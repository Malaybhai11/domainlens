import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "dns";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  const [name, tld] = domain.split(".");
  const variations: string[] = [];

  // 1. Common TLD swaps
  [".net", ".org", ".co", ".info", ".biz", ".in"].forEach(ext => {
    if (ext !== `.${tld}`) variations.push(`${name}${ext}`);
  });

  // 2. Character substitution (simplified)
  if (name.includes("o")) variations.push(name.replace("o", "0") + `.${tld}`);
  if (name.includes("l")) variations.push(name.replace("l", "1") + `.${tld}`);
  if (name.includes("s")) variations.push(name.replace("s", "5") + `.${tld}`);

  // 3. Omitting a character
  if (name.length > 3) variations.push(name.substring(1) + `.${tld}`);

  const results = await Promise.all(variations.slice(0, 10).map(async (v) => {
    try {
      const ips = await dns.resolve4(v);
      return { domain: v, registered: true, ip: ips[0] };
    } catch {
      return { domain: v, registered: false };
    }
  }));

  return NextResponse.json({ variations: results });
}
