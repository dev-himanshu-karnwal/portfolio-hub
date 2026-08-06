import type { ReactNode } from 'react'
import { PROJECT_TYPES, VISIBILITY_LABELS, VISIBILITY_OPTIONS } from '../../lib/constants'
import type { FilterState, ProjectType, Visibility } from '../../types'
import { Chip } from '../ui/Badge'

export function FilterPanel({
  filters,
  techOptions,
  domainOptions,
  onToggleTech,
  onToggleDomain,
  onToggleType,
  onToggleVisibility,
}: {
  filters: FilterState
  techOptions: string[]
  domainOptions: string[]
  onToggleTech: (v: string) => void
  onToggleDomain: (v: string) => void
  onToggleType: (v: ProjectType) => void
  onToggleVisibility: (v: Visibility) => void
}) {
  return (
    <aside className="space-y-5 rounded-2xl border border-line bg-surface/90 p-4 shadow-sm">
      <FilterGroup title="Tech Stack">
        <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
          {techOptions.length === 0 && (
            <span className="text-xs text-muted">No tech tags yet</span>
          )}
          {techOptions.map((t) => (
            <Chip
              key={t}
              active={filters.techStack.includes(t)}
              onClick={() => onToggleTech(t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Domain">
        <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
          {domainOptions.length === 0 && (
            <span className="text-xs text-muted">No domains yet</span>
          )}
          {domainOptions.map((d) => (
            <Chip
              key={d}
              active={filters.domain.includes(d)}
              onClick={() => onToggleDomain(d)}
            >
              {d}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Project Type">
        <div className="flex flex-wrap gap-1.5">
          {PROJECT_TYPES.map((t) => (
            <Chip
              key={t}
              active={filters.projectType.includes(t)}
              onClick={() => onToggleType(t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Visibility">
        <div className="flex flex-wrap gap-1.5">
          {VISIBILITY_OPTIONS.map((v) => (
            <Chip
              key={v}
              active={filters.visibility.includes(v)}
              onClick={() => onToggleVisibility(v)}
            >
              {VISIBILITY_LABELS[v]}
            </Chip>
          ))}
        </div>
      </FilterGroup>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}
