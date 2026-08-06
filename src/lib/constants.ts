/** Expand legacy combined labels stored before types were split. */
export const LEGACY_PROJECT_TYPE_MAP: Record<string, string[]> = {
  'Figma/UI-UX': ['Figma', 'UI-UX'],
  'Shopify/WooCommerce/WordPress': ['Shopify', 'WooCommerce', 'WordPress'],
}

/** Coerce Firestore/URL values into a free-form string list (no whitelist). */
export function normalizeStringList(raw: unknown, expandLegacy = false): string[] {
  const values = Array.isArray(raw) ? raw : raw != null && raw !== '' ? [raw] : []
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const key = String(value).trim()
    if (!key) continue
    const expanded = expandLegacy ? (LEGACY_PROJECT_TYPE_MAP[key] ?? [key]) : [key]
    for (const item of expanded) {
      const normalized = item.trim()
      if (!normalized) continue
      const lower = normalized.toLowerCase()
      if (seen.has(lower)) continue
      seen.add(lower)
      result.push(normalized)
    }
  }

  return result
}

export const ROLE_LABELS = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
} as const
