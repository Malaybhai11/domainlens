import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const DNS_TYPES = ["A", "AAAA", "MX", "TXT", "CNAME", "NS", "SOA", "CAA"];

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  try {
    const results: any = {};

    await Promise.all(DNS_TYPES.map(async (type) => {
      try {
        const response = await axios.get(`https://cloudflare-dns.com/dns-query`, {
          params: {
            name: domain,
            type: type
          },
          headers: {
            "Accept": "application/dns-json"
          }
        });

        if (response.data.Answer) {
          results[type.toLowerCase()] = response.data.Answer.map((ans: any) => ({
            type: type,
            name: ans.name,
            content: ans.data,
            ttl: ans.TTL,
            priority: ans.data.split(" ")[0] && type === "MX" ? parseInt(ans.data.split(" ")[0]) : undefined
          }));
        } else {
          results[type.toLowerCase()] = [];
        }
      } catch (err) {
        console.error(`DNS Error for ${type}:`, err);
        results[type.toLowerCase()] = [];
      }
    }));

    // Clean up MX content if it includes priority
    if (results.mx) {
      results.mx = results.mx.map((record: any) => {
        const parts = record.content.split(" ");
        if (parts.length > 1) {
          return {
            ...record,
            priority: parseInt(parts[0]),
            content: parts.slice(1).join(" ")
          };
        }
        return record;
      }).sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch DNS records", details: error.message }, { status: 500 });
  }
}
