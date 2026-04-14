import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const apiKey = process.env.WHOISJSON_API_KEY;

  try {
    const response = await axios.get(`https://whoisjson.com/api/v1/whois`, {
      params: {
        domain: domain,
        token: apiKey
      }
    });

    const data = response.data;
    const whois = data.whois || {};

    // Standardize the response according to WhoisData interface
    return NextResponse.json({
      domain,
      registered: data.registered,
      created: whois.created_date,
      updated: whois.updated_date,
      expires: whois.expiration_date,
      registrar: {
        name: whois.registrar,
        url: whois.registrar_url,
      },
      registrant: {
        name: whois.registrant_name,
        org: whois.registrant_organization,
        country: whois.registrant_country,
      },
      nameservers: whois.name_servers || [],
      status: whois.domain_status || [],
      privacyProtected: whois.registrant_name?.toLowerCase().includes("privacy") || 
                        whois.registrant_email?.toLowerCase().includes("privacy") || false
    });
  } catch (error: any) {
    console.error("WHOIS Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch WHOIS data", details: error.message }, { status: 500 });
  }
}
