export class ScanError extends Error {
  constructor(
    message: string,
    public readonly module: string,
    public readonly code: string,
    public readonly recoverable: boolean = false
  ) { super(message); this.name = 'ScanError' }
}

export function classifyScanError(error: unknown, module: string): ScanError {
  if (error instanceof ScanError) return error
  const msg = error instanceof Error ? error.message : String(error)
  
  if (msg.includes('timeout') || msg.includes('timed out'))
    return new ScanError(`Connection timeout on ${module}`, module, 'TIMEOUT', true)
  if (msg.includes('ENOTFOUND') || msg.includes('DNS'))
    return new ScanError(`DNS resolution failed for ${module}`, module, 'DNS_FAILURE', false)
  if (msg.includes('ETIMEDOUT'))
    return new ScanError(`Host unreachable for ${module}`, module, 'HOST_UNREACHABLE', true)
  if (msg.includes('ECONNREFUSED'))
    return new ScanError(`Connection refused on ${module}`, module, 'CONN_REFUSED', false)
  
  return new ScanError(`Unknown error in ${module}: ${msg.slice(0, 100)}`, module, 'UNKNOWN', false)
}

export function shouldRetry(error: ScanError): boolean {
  return error.recoverable && ['TIMEOUT', 'HOST_UNREACHABLE'].includes(error.code)
}
