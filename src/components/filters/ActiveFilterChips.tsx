import { VISIBILITY_LABELS } from '../../lib/constants'
import type { FilterState } from '../../types'
import { Chip } from '../ui/Badge'
import { Button } from '../ui/Button'

export function ActiveFilterChips({
  filters,
  onRemove,
  onClear,
}: {
  filters: FilterState
  onRemove: (
    kind: 'search' | 'tech' | 'domain' | 'type' | 'visibility',
    value?: string,
  ) => void
  onClear: () => void
}) {
  const chips: { kind: 'search' | 'tech' | 'domain' | 'type' | 'visibility'; label: string; value?: string }[] =
    []

  if (filters.search) {
    chips.push({ kind: 'search', label: `"${filters.search}"` })
  }
  filters.techStack.forEach((t) => chips.push({ kind: 'tech', label: t, value: t }))
  filters.domain.forEach((d) => chips.push({ kind: 'domain', label: d, value: d }))
  filters.projectType.forEach((t) => chips.push({ kind: 'type', label: t, value: t }))
  filters.visibility.forEach((v) =>
    chips.push({ kind: 'visibility', label: VISIBILITY_LABELS[v], value: v }),
  )

  if (chips.length === 0) return null

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-2.5 sm:gap-2">
      <span className="w-full text-xs font-medium text-muted sm:w-auto">Active:</span>
      {chips.map((c) => (
        <Chip key={`${c.kind}-${c.value ?? c.label}`} active onRemove={() => onRemove(c.kind, c.value)}>
          {c.label}
        </Chip>
      ))}
      <Button variant="ghost" size="sm" className="text-xs" onClick={onClear}>
        Clear all
      </Button>
    </div>
  )
}
