import { NextRequest, NextResponse } from 'next/server';
import * as dns from 'dns/promises';

const CDN_PATTERNS = [
  { name: 'CloudFlare', patterns: ['cloudflare.com', 'cloudflare.net'] },
  { name: 'Akamai', patterns: ['akamai.net', 'akamaiedge.net'] },
  { name: 'Fastly', patterns: ['fastly.net'] },
  { name: 'CloudFront', patterns: ['cloudfront.net'] },
  { name: 'Cloudflare', patterns: ['cloudflare.com'] },
  { name: 'Azure CDN', patterns: ['azureedge.net', 'trafficmanager.net'] },
  { name: 'StackPath', patterns: ['stackpathcdn.com'] },
];

export async function POST(req: NextRequest) {
  const { domain } = await req.json();
  try {
    const resolved = await dns.resolve4(domain);
    let detectedCDN: string[] = [];
    try {
      const cnameRecords = await dns.resolveCname(domain);
      const allNames = [...cnameRecords];
      for (const name of allNames) {
        for (const cdn of CDN_PATTERNS) {
          if (cdn.patterns.some(p => name.toLowerCase().includes(p)))
            detectedCDN.push(cdn.name);
        }
      }
    } catch {}
    
    // Detect load balancer
    const possibleLB = resolved.length > 1 ? 'Multiple A records - possible load balancer' : 'Single endpoint';

    return NextResponse.json({
      domain,
      ipAddresses: resolved,
      possibleCDN: detectedCDN.length > 0 ? [...new Set(detectedCDN)] : ['None detected'],
      loadBalancer: possibleLB,
      cdnDetected: detectedCDN.length > 0,
    });
  } catch (e: any) {
    return NextResponse.json({ domain, error: e.message });
  }
}
