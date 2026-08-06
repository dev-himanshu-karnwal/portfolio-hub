import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, Filter, Search } from 'lucide-react'
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
  variant = 'sidebar',
  headerAction,
}: {
  filters: FilterState
  techOptions: string[]
  domainOptions: string[]
  onToggleTech: (v: string) => void
  onToggleDomain: (v: string) => void
  onToggleType: (v: ProjectType) => void
  onToggleVisibility: (v: Visibility) => void
  variant?: 'sidebar' | 'drawer'
  headerAction?: ReactNode
}) {
  const activeTotal =
    filters.techStack.length +
    filters.domain.length +
    filters.projectType.length +
    filters.visibility.length

  const shell =
    variant === 'drawer'
      ? 'flex h-full min-h-0 flex-col overflow-hidden bg-surface'
      : 'panel sticky top-[4.5rem] flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden lg:top-20'

  return (
    <aside className={shell}>
      <div className="flex items-center justify-between border-b border-line/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-accent" />
          <span className="font-display text-sm font-semibold text-ink">Filters</span>
          {activeTotal > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">
              {activeTotal}
            </span>
          )}
        </div>
        {headerAction}
      </div>

      <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto overscroll-contain p-3">
        <FilterGroup
          title="Tech Stack"
          count={filters.techStack.length}
          defaultOpen
          searchable
          options={techOptions}
          active={filters.techStack}
          onToggle={onToggleTech}
          emptyLabel="No tech tags yet"
        />

        <FilterGroup
          title="Domain"
          count={filters.domain.length}
          defaultOpen
          searchable
          options={domainOptions}
          active={filters.domain}
          onToggle={onToggleDomain}
          emptyLabel="No domains yet"
        />

        <FilterGroup
          title="Project Type"
          count={filters.projectType.length}
          defaultOpen
          options={PROJECT_TYPES}
          active={filters.projectType}
          onToggle={onToggleType}
        />

        <FilterGroup
          title="Visibility"
          count={filters.visibility.length}
          defaultOpen={false}
          options={VISIBILITY_OPTIONS}
          active={filters.visibility}
          onToggle={onToggleVisibility}
          labelFn={(v) => VISIBILITY_LABELS[v as Visibility]}
        />
      </div>
    </aside>
  )
}

function FilterGroup<T extends string>({
  title,
  count,
  defaultOpen = true,
  searchable = false,
  options,
  active,
  onToggle,
  emptyLabel,
  labelFn,
}: {
  title: string
  count: number
  defaultOpen?: boolean
  searchable?: boolean
  options: readonly T[]
  active: T[]
  onToggle: (v: T) => void
  emptyLabel?: string
  labelFn?: (v: T) => string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((o) => {
      const label = labelFn ? labelFn(o) : o
      return label.toLowerCase().includes(q)
    })
  }, [options, query, labelFn])

  return (
    <div className="rounded-xl border border-line/60 bg-canvas/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-canvas/50"
      >
        <span className="section-label">{title}</span>
        <div className="flex items-center gap-1.5">
          {count > 0 && (
            <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
              {count}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-line/60 px-3 pb-3 pt-2">
          {searchable && options.length > 6 && (
            <div className="relative mb-2">
              <Search size={12} className="absolute top-1/2 left-2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}…`}
                className="w-full rounded-lg border border-line bg-surface py-1.5 pr-2 pl-7 text-xs outline-none focus:border-accent"
              />
            </div>
          )}
          <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 && (
              <span className="text-xs text-muted">{emptyLabel ?? 'No matches'}</span>
            )}
            {filtered.map((opt) => (
              <Chip
                key={opt}
                active={active.includes(opt)}
                onClick={() => onToggle(opt)}
              >
                {labelFn ? labelFn(opt) : opt}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
