export interface CacheEntry<T> {
  data: T
  cachedAt: number
  ttl: number
}

export class ScanCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>()
  
  constructor(private defaultTtl: number = 5 * 60 * 1000) {}
  
  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() - entry.cachedAt > entry.ttl) {
      this.store.delete(key)
      return null
    }
    return entry.data
  }
  
  set(key: string, data: T, ttl?: number): void {
    this.store.set(key, { data, cachedAt: Date.now(), ttl: ttl || this.defaultTtl })
  }
  
  invalidate(pattern?: string): void {
    if (!pattern) { this.store.clear(); return }
    const regex = new RegExp(pattern.replace('*', '.*'))
    for (const key of this.store.keys()) {
      if (regex.test(key)) this.store.delete(key)
    }
  }
  
  get size(): number { return this.store.size }
}
