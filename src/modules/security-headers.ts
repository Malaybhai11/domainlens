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
    const h = (name: string) => response.headers.get(name)
    
    const headers: SecurityHeaders = {
      'strict-transport-security': h('strict-transport-security'),
      'content-security-policy': h('content-security-policy'),
      'x-frame-options': h('x-frame-options'),
      'x-content-type-options': h('x-content-type-options'),
      'referrer-policy': h('referrer-policy'),
      'permissions-policy': h('permissions-policy'),
    }
    
    const present = Object.values(headers).filter(Boolean).length
    const score = Math.round((present / 6) * 100)
    
    return { headers, score }
  } catch {
    return { headers: {} as SecurityHeaders, score: 0 }
  }
}
