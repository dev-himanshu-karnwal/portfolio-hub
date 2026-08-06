import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_FILTERS,
  filtersFromSearchParams,
  filtersToSearchParams,
} from '../lib/filters'
import type { FilterState, ViewMode } from '../types'

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => filtersFromSearchParams(searchParams),
    [searchParams],
  )

  const setFilters = useCallback(
    (next: FilterState | ((prev: FilterState) => FilterState)) => {
      const resolved = typeof next === 'function' ? next(filters) : next
      const params = filtersToSearchParams(resolved)
      setSearchParams(params, { replace: true })
    },
    [filters, setSearchParams],
  )

  const setSearch = useCallback(
    (search: string) => setFilters((f) => ({ ...f, search })),
    [setFilters],
  )

  const toggleTech = useCallback(
    (tech: string) =>
      setFilters((f) => ({
        ...f,
        techStack: f.techStack.includes(tech)
          ? f.techStack.filter((t) => t !== tech)
          : [...f.techStack, tech],
      })),
    [setFilters],
  )

  const toggleDomain = useCallback(
    (domain: string) =>
      setFilters((f) => ({
        ...f,
        domain: f.domain.includes(domain)
          ? f.domain.filter((d) => d !== domain)
          : [...f.domain, domain],
      })),
    [setFilters],
  )

  const toggleProjectType = useCallback(
    (type: string) =>
      setFilters((f) => ({
        ...f,
        projectType: f.projectType.includes(type)
          ? f.projectType.filter((t) => t !== type)
          : [...f.projectType, type],
      })),
    [setFilters],
  )

  const toggleVisibility = useCallback(
    (visibility: string) =>
      setFilters((f) => ({
        ...f,
        visibility: f.visibility.includes(visibility)
          ? f.visibility.filter((v) => v !== visibility)
          : [...f.visibility, visibility],
      })),
    [setFilters],
  )

  const setView = useCallback(
    (view: ViewMode) => setFilters((f) => ({ ...f, view })),
    [setFilters],
  )

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, view: filters.view })
  }, [setFilters, filters.view])

  const removeChip = useCallback(
    (kind: 'search' | 'tech' | 'domain' | 'type' | 'visibility', value?: string) => {
      setFilters((f) => {
        if (kind === 'search') return { ...f, search: '' }
        if (kind === 'tech' && value) {
          return { ...f, techStack: f.techStack.filter((t) => t !== value) }
        }
        if (kind === 'domain' && value) {
          return { ...f, domain: f.domain.filter((d) => d !== value) }
        }
        if (kind === 'type' && value) {
          return {
            ...f,
            projectType: f.projectType.filter((t) => t !== value),
          }
        }
        if (kind === 'visibility' && value) {
          return {
            ...f,
            visibility: f.visibility.filter((v) => v !== value),
          }
        }
        return f
      })
    },
    [setFilters],
  )

  return {
    filters,
    setFilters,
    setSearch,
    toggleTech,
    toggleDomain,
    toggleProjectType,
    toggleVisibility,
    setView,
    clearFilters,
    removeChip,
  }
}
