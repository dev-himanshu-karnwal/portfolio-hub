import type { ProjectType, Visibility } from '../types'

export const PROJECT_TYPES: ProjectType[] = [
  'Full Stack',
  'Frontend Only',
  "Backend Only",
  "Chrome Extension",
  "Mobile App",
  "Desktop App",
  "API Development",
  "Database Design",
  "System Integration",
  "DevOps",
  "Cloud Services",
  "Security",
  'Figma',
  'UI-UX',
  'Landing Page',
  'Case Study',
  'Shopify',
  'WooCommerce',
  'WordPress',
]

/** Expand legacy combined labels stored before types were split. */
export const LEGACY_PROJECT_TYPE_MAP: Record<string, ProjectType[]> = {
  'Figma/UI-UX': ['Figma', 'UI-UX'],
  'Shopify/WooCommerce/WordPress': ['Shopify', 'WooCommerce', 'WordPress'],
}

export function normalizeProjectTypes(raw: unknown): ProjectType[] {
  const values = Array.isArray(raw) ? raw : raw != null && raw !== '' ? [raw] : []
  const seen = new Set<ProjectType>()
  const result: ProjectType[] = []

  for (const value of values) {
    const key = String(value)
    const expanded = LEGACY_PROJECT_TYPE_MAP[key] ?? [key]
    for (const type of expanded) {
      if (!PROJECT_TYPES.includes(type as ProjectType)) continue
      const typed = type as ProjectType
      if (seen.has(typed)) continue
      seen.add(typed)
      result.push(typed)
    }
  }

  return result
}

export const VISIBILITY_OPTIONS: Visibility[] = ['public', 'proposal_only', 'internal']

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  public: 'Public',
  proposal_only: 'Proposal Only',
  internal: 'Internal',
}

export const ROLE_LABELS = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
} as const
