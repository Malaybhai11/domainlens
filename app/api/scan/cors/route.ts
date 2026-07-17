import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { domain } = await req.json();
  try {
    const resp = await fetch(`https://${domain}`, { method: 'OPTIONS' });
    const corsHeader = resp.headers.get('access-control-allow-origin');
    const allowedMethods = resp.headers.get('access-control-allow-methods') || 'Not specified';
    const allowedHeaders = resp.headers.get('access-control-allow-headers') || 'Not specified';
    const exposedHeaders = resp.headers.get('access-control-expose-headers') || 'Not specified';
    const maxAge = resp.headers.get('access-control-max-age') || 'Not specified';
    const allowCredentials = resp.headers.get('access-control-allow-credentials') || 'Not specified';

    const issues: string[] = [];
    if (!corsHeader) issues.push('No CORS headers found');
    if (corsHeader === '*') issues.push('Wildcard origin (*) - overly permissive');
    if (corsHeader === 'null') issues.push('Null origin allowed - security risk');

    return NextResponse.json({
      domain,
      headers: {
        'Access-Control-Allow-Origin': corsHeader || 'Not set',
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': allowedHeaders,
        'Access-Control-Expose-Headers': exposedHeaders,
        'Access-Control-Max-Age': maxAge,
        'Access-Control-Allow-Credentials': allowCredentials,
      },
      issues,
      risk: issues.length === 0 ? 'low' : issues.length <= 2 ? 'medium' : 'high',
    });
  } catch (e: any) {
    return NextResponse.json({ domain, error: e.message, risk: 'unknown' });
  }
}
