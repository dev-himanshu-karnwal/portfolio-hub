import type { FilterState, Project, ViewMode } from '../types'
import { normalizeStringList } from './constants'

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  techStack: [],
  domain: [],
  projectType: [],
  visibility: [],
  view: 'table',
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

function matchesSearch(project: Project, search: string): boolean {
  const tokens = tokenize(search)
  if (tokens.length === 0) return true

  const haystack = [
    project.name,
    project.description,
    ...project.tech_stack,
    ...project.domain,
    ...project.project_type,
    ...project.visibility,
    ...project.tags,
  ]
    .join(' ')
    .toLowerCase()

  return tokens.every((token) => haystack.includes(token))
}

function matchesMultiSelect(selected: string[], values: string[]): boolean {
  if (selected.length === 0) return true
  const lower = values.map((v) => v.toLowerCase())
  return selected.some((s) => lower.includes(s.toLowerCase()))
}

export function filterProjects(projects: Project[], filters: FilterState): Project[] {
  return projects.filter((project) => {
    if (!matchesSearch(project, filters.search)) return false

    if (!matchesMultiSelect(filters.techStack, project.tech_stack)) return false
    if (!matchesMultiSelect(filters.domain, project.domain)) return false
    if (!matchesMultiSelect(filters.projectType, project.project_type)) return false
    if (!matchesMultiSelect(filters.visibility, project.visibility)) return false

    return true
  })
}

export function collectFacetValues(projects: Project[]): {
  techStack: string[]
  domain: string[]
  projectType: string[]
  visibility: string[]
} {
  const tech = new Set<string>()
  const domain = new Set<string>()
  const projectType = new Set<string>()
  const visibility = new Set<string>()
  for (const p of projects) {
    p.tech_stack.forEach((t) => tech.add(t))
    p.domain.forEach((d) => domain.add(d))
    p.project_type.forEach((t) => projectType.add(t))
    p.visibility.forEach((v) => visibility.add(v))
  }
  const sort = (a: string, b: string) => a.localeCompare(b)
  return {
    techStack: [...tech].sort(sort),
    domain: [...domain].sort(sort),
    projectType: [...projectType].sort(sort),
    visibility: [...visibility].sort(sort),
  }
}

function parseList(value: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((v) => decodeURIComponent(v.trim()))
    .filter(Boolean)
}

export function filtersFromSearchParams(params: URLSearchParams): FilterState {
  const viewParam = params.get('view')
  const view: ViewMode = viewParam === 'grid' ? 'grid' : 'table'

  return {
    search: params.get('q') ?? '',
    techStack: parseList(params.get('tech')),
    domain: parseList(params.get('domain')),
    projectType: normalizeStringList(parseList(params.get('type')), true),
    visibility: normalizeStringList(parseList(params.get('visibility'))),
    view,
  }
}

export function filtersToSearchParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search) params.set('q', filters.search)
  if (filters.techStack.length) params.set('tech', filters.techStack.map(encodeURIComponent).join(','))
  if (filters.domain.length) params.set('domain', filters.domain.map(encodeURIComponent).join(','))
  if (filters.projectType.length) {
    params.set('type', filters.projectType.map(encodeURIComponent).join(','))
  }
  if (filters.visibility.length) {
    params.set('visibility', filters.visibility.map(encodeURIComponent).join(','))
  }
  if (filters.view !== 'grid') params.set('view', filters.view)
  return params
}

export function countActiveFilters(filters: FilterState): number {
  return (
    (filters.search ? 1 : 0) +
    filters.techStack.length +
    filters.domain.length +
    filters.projectType.length +
    filters.visibility.length
  )
}
