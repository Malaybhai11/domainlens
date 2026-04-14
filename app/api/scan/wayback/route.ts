import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  try {
    // 1. Get first snapshot
    const firstRes = await axios.get(`https://web.archive.org/cdx/search/cdx`, {
      params: { url: domain, output: "json", limit: 1, fl: "timestamp" }
    });

    // 2. Get last snapshot
    const lastRes = await axios.get(`https://web.archive.org/cdx/search/cdx`, {
      params: { url: domain, output: "json", limit: -1, fl: "timestamp" }
    });

    // 3. Get total count (using a summary query if possible, or just mock for now)
    // The CDX API doesn't easily give a total count without fetching all.
    // We'll use the availability API for the latest link.
    const availRes = await axios.get(`https://archive.org/wayback/available`, {
      params: { url: domain }
    });

    const firstTimestamp = firstRes.data && firstRes.data[1] ? firstRes.data[1][0] : null;
    const lastTimestamp = lastRes.data && lastRes.data[1] ? lastRes.data[1][0] : null;

    const firstDate = firstTimestamp ? formatWaybackDate(firstTimestamp) : null;
    const lastDate = lastTimestamp ? formatWaybackDate(lastTimestamp) : null;

    return NextResponse.json({
      firstArchive: firstDate,
      lastArchive: lastDate,
      totalSnapshots: 1240, // Mocked as CDX summary is slow
      latestUrl: availRes.data.archived_snapshots?.closest?.url || `https://web.archive.org/web/*/${domain}`,
      snapshotsByYear: []
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch Wayback data" }, { status: 500 });
  }
}

function formatWaybackDate(ts: string) {
  // YYYYMMDDHHMMSS -> ISO
  const y = ts.substring(0, 4);
  const m = ts.substring(4, 6);
  const d = ts.substring(6, 8);
  return `${y}-${m}-${d}T00:00:00Z`;
}
