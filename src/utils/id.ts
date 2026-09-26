/** Generates a unique, framework-independent id, optionally namespaced with a prefix. */
export function createId(prefix?: string): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return prefix ? `${prefix}-${random}` : random
}
