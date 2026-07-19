export class ScanError extends Error {
  constructor(message: string, public readonly module: string, public readonly code: string, public readonly recoverable: boolean = false) {
    super(message); this.name = 'ScanError'
  }
}

export function classifyScanError(error: unknown, module: string): ScanError {
  if (error instanceof ScanError) return error
  const msg = error instanceof Error ? error.message : String(error)
  if (msg.includes('timeout')) return new ScanError('Connection timeout', module, 'TIMEOUT', true)
  if (msg.includes('ENOTFOUND')) return new ScanError('DNS failure', module, 'DNS_FAILURE', false)
  if (msg.includes('ECONNREFUSED')) return new ScanError('Connection refused', module, 'CONN_REFUSED', false)
  return new ScanError('Unknown error: ' + msg.slice(0, 80), module, 'UNKNOWN', false)
}

export function shouldRetry(e: ScanError): boolean { return e.recoverable && e.code === 'TIMEOUT' }
