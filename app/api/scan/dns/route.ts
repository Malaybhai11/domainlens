import { NextRequest, NextResponse } from 'next/server';
import * as dns from 'dns/promises';

export async function POST(req: NextRequest) {
  const { domain } = await req.json();
  const results: any = { domain, records: {}, issues: [] };

  try {
    const a = await dns.resolve4(domain);
    results.records.A = a;
  } catch { results.records.A = []; }

  try {
    const mx = await dns.resolveMx(domain);
    results.records.MX = mx;
  } catch { results.records.MX = []; }

  try {
    const txt = await dns.resolveTxt(domain);
    const flatTxt = txt.map(t => t.join(' '));
    results.records.TXT = flatTxt;
    const spf = flatTxt.filter(t => t.startsWith('v=spf1'));
    if (spf.length === 0) results.issues.push('No SPF record found - email spoofing possible');
    const dmarc = flatTxt.filter(t => t.startsWith('v=DMARC1'));
    if (dmarc.length === 0) results.issues.push('No DMARC record found');
  } catch { results.records.TXT = []; results.issues.push('No TXT records'); }

  try {
    const cname = await dns.resolveCname(domain);
    results.records.CNAME = cname;
  } catch { results.records.CNAME = []; }

  try {
    const ns = await dns.resolveNs(domain);
    results.records.NS = ns;
    if (ns.some(n => n.includes('dnssec'))) results.records.DNSSEC = true;
    if (ns.length < 2) results.issues.push('Only one nameserver - no redundancy');
  } catch { results.records.NS = []; }

  try {
    const caa = await dns.resolveCaa(domain);
    results.records.CAA = caa;
    if (caa.length === 0) results.issues.push('No CAA record - any CA can issue certificates');
  } catch { results.records.CAA = []; }

  return NextResponse.json(results);
}
