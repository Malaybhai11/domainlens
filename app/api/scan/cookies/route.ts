import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  try {
    const resp = await fetch(url, { redirect: 'follow' });
    const setCookieHeaders = resp.headers.getSetCookie?.() || [];
    const cookies = setCookieHeaders.map((header: string) => {
      const parts = header.split(';').map(p => p.trim());
      const [name, ...valParts] = parts[0].split('=');
      const value = valParts.join('=');
      const attrs: Record<string, string> = {};
      for (let i = 1; i < parts.length; i++) {
        const [k, ...v] = parts[i].split('=');
        attrs[k.toLowerCase()] = v.join('=') || 'true';
      }
      return { name, value, httpOnly: 'httponly' in attrs, secure: 'secure' in attrs, sameSite: attrs.samesite || 'not set', domain: attrs.domain || 'not set', path: attrs.path || '/', issues: [] };
    });

    cookies.forEach((c: any) => {
      if (!c.secure) c.issues.push('Missing Secure flag - sent over HTTP');
      if (!c.httpOnly) c.issues.push('Missing HttpOnly flag - accessible via JS');
      if (!c.sameSite || c.sameSite === 'not set') c.issues.push('Missing SameSite attribute');
      if (c.domain?.startsWith('.')) c.issues.push('Domain starts with dot - broad scope');
    });

    return NextResponse.json({ url, cookieCount: cookies.length, cookies, risk: cookies.some((c: any) => c.issues.length > 0) ? 'medium' : 'low' });
  } catch (e: any) {
    return NextResponse.json({ url, error: e.message, risk: 'unknown' });
  }
}
