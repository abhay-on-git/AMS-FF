export function formatLogTimestamp(ts: string) {
  const d = new Date(ts)
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toISOString().slice(11, 19),
  }
}

export function formatChangeValue(v: unknown): string | null {
  if (v === null || v === undefined) return null
  if (Array.isArray(v)) return v.join(', ')
  return String(v)
}
