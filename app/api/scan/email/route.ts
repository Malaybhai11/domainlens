import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "dns";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

  try {
    const [spf, dmarc, bimi] = await Promise.all([
      checkSPF(domain),
      checkDMARC(domain),
      checkBIMI(domain)
    ]);

    let score = 0;
    if (spf.present) score += 40;
    if (dmarc.present) score += 40;
    if (bimi.present) score += 20;

    return NextResponse.json({
      spf,
      dmarc,
      bimi,
      overallScore: score
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch email security data", details: error.message }, { status: 500 });
  }
}

async function checkSPF(domain: string) {
  try {
    const records = await dns.resolveTxt(domain);
    const spfRecord = records.find(r => r.join("").startsWith("v=spf1"));
    return {
      present: !!spfRecord,
      policy: spfRecord?.join(""),
      explanation: spfRecord ? "SPF record found, preventing email spoofing." : "SPF record missing, unauthorized servers can send mail as you."
    };
  } catch {
    return { present: false, explanation: "SPF record missing or could not be fetched." };
  }
}

async function checkDMARC(domain: string) {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records.find(r => r.join("").startsWith("v=DMARC1"));
    return {
      present: !!dmarcRecord,
      policy: dmarcRecord?.join(""),
      explanation: dmarcRecord ? "DMARC record found, providing policy for email failures." : "DMARC record missing, no instructions for failed SPF/DKIM."
    };
  } catch {
    return { present: false, explanation: "DMARC record missing or could not be fetched." };
  }
}

async function checkBIMI(domain: string) {
  try {
    const records = await dns.resolveTxt(`default._bimi.${domain}`);
    const bimiRecord = records.find(r => r.join("").startsWith("v=BIMI1"));
    return {
      present: !!bimiRecord,
      explanation: bimiRecord ? "BIMI record found, allowing brand logos in email clients." : "BIMI record missing."
    };
  } catch {
    return { present: false, explanation: "BIMI record missing." };
  }
}
