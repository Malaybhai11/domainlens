export interface SecurityHeaders {
  'strict-transport-security': string | null
  'content-security-policy': string | null
  'x-frame-options': string | null
  'x-content-type-options': string | null
  'referrer-policy': string | null
  'permissions-policy': string | null
}

export async function scanSecurityHeaders(url: string): Promise<{ headers: SecurityHeaders; score: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const g = (name: string) => response.headers.get(name)
    const headers: SecurityHeaders = {
      'strict-transport-security': g('strict-transport-security'),
      'content-security-policy': g('content-security-policy'),
      'x-frame-options': g('x-frame-options'),
      'x-content-type-options': g('x-content-type-options'),
      'referrer-policy': g('referrer-policy'),
      'permissions-policy': g('permissions-policy'),
    }
    const present = Object.values(headers).filter(Boolean).length
    return { headers, score: Math.round((present / 6) * 100) }
  } catch { return { headers: {} as SecurityHeaders, score: 0 } }
}
