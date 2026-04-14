import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  try {
    const response = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
      client: {
        clientId: "domainlens",
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url: domain }]
      }
    });

    const matches = response.data.matches || [];
    const isSafe = matches.length === 0;

    return NextResponse.json({
      googleSafeBrowsing: {
        safe: isSafe,
        threats: matches.map((m: any) => m.threatType)
      },
      overallStatus: isSafe ? "safe" : "dangerous",
      score: isSafe ? 100 : 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch blacklist data", details: error.message }, { status: 500 });
  }
}
