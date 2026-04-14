import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const url = domain.startsWith("http") ? domain : `https://${domain}`;

  try {
    const [desktopRes, mobileRes] = await Promise.all([
      axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`, {
        params: { url, strategy: "desktop", key: apiKey }
      }),
      axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`, {
        params: { url, strategy: "mobile", key: apiKey }
      })
    ]);

    const data = {
      desktopScore: Math.round(desktopRes.data.lighthouseResult.categories.performance.score * 100),
      mobileScore: Math.round(mobileRes.data.lighthouseResult.categories.performance.score * 100),
      lighthouseResult: desktopRes.data.lighthouseResult
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PageSpeed Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch PageSpeed data", details: error.message }, { status: 500 });
  }
}
