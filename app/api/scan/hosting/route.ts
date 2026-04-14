import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { promises as dns } from "dns";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  try {
    const ips = await dns.resolve4(domain);
    const primaryIp = ips[0];

    // Get IP info
    const ipInfoRes = await axios.get(`https://ipinfo.io/${primaryIp}/json`);
    const ipData = ipInfoRes.data;

    // Get ASN info from bgpview if needed
    let asnInfo = null;
    try {
      const bgpRes = await axios.get(`https://api.bgpview.io/ip/${primaryIp}`);
      asnInfo = bgpRes.data.data;
    } catch (e) {
      // Ignore if bgpview fails
    }

    return NextResponse.json({
      ipAddresses: ips,
      asn: ipData.org?.split(" ")[0],
      asnOrg: ipData.org?.split(" ").slice(1).join(" "),
      provider: asnInfo?.prefixes?.[0]?.name || ipData.org?.split(" ").slice(1).join(" "),
      country: ipData.country,
      city: ipData.city,
      countryFlag: `https://flagcdn.com/w20/${ipData.country?.toLowerCase()}.png`,
      ipv6Support: await checkIpv6(domain),
      cdn: detectCDN(ipData.org || "")
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch hosting data", details: error.message }, { status: 500 });
  }
}

async function checkIpv6(domain: string) {
  try {
    const ips = await dns.resolve6(domain);
    return ips.length > 0;
  } catch {
    return false;
  }
}

function detectCDN(org: string) {
  const orgLower = org.toLowerCase();
  if (orgLower.includes("cloudflare")) return "Cloudflare";
  if (orgLower.includes("fastly")) return "Fastly";
  if (orgLower.includes("akamai")) return "Akamai";
  if (orgLower.includes("amazon")) return "CloudFront (AWS)";
  if (orgLower.includes("google")) return "Google Cloud CDN";
  if (orgLower.includes("vercel")) return "Vercel";
  if (orgLower.includes("netlify")) return "Netlify";
  return "None Detected";
}
