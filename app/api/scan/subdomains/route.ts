import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  try {
    // crt.sh query for subdomains
    const response = await axios.get(`https://crt.sh/?q=%.${domain}&output=json`, {
      timeout: 15000
    });

    const certs = response.data;
    const subdomainSet = new Set<string>();
    const details: any[] = [];

    certs.forEach((cert: any) => {
      const names = cert.common_name.split("\n").concat(cert.name_value.split("\n"));
      names.forEach((name: string) => {
        const cleanName = name.toLowerCase().trim();
        if (cleanName.endsWith(`.${domain}`) && !cleanName.includes("*") && cleanName !== domain) {
          if (!subdomainSet.has(cleanName)) {
            subdomainSet.add(cleanName);
            details.push({
              name: cleanName,
              firstSeen: cert.entry_timestamp,
              lastSeen: cert.not_before
            });
          }
        }
      });
    });

    const sortedSubdomains = details.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      subdomains: sortedSubdomains,
      totalCount: sortedSubdomains.length
    });
  } catch (error: any) {
    console.error("Subdomain Error:", error.message);
    return NextResponse.json({ 
      subdomains: [], 
      totalCount: 0,
      error: "Failed to fetch subdomains from crt.sh" 
    }, { status: 500 });
  }
}
