import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  // SimilarWeb API is paid, so we show "Connect API key to unlock" in UI
  // or return a mock for demonstration
  return NextResponse.json({
    estimatedVisits: "10K - 50K",
    trafficTrend: "growing",
    topCountries: ["US", "IN", "GB"],
    bounceRate: "45%",
    message: "Connect SimilarWeb API key in settings for real-time data"
  });
}
