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
    chips.push({ kind: 'search', label: `Search: “${filters.search}”` })
  }
  filters.techStack.forEach((t) => chips.push({ kind: 'tech', label: t, value: t }))
  filters.domain.forEach((d) => chips.push({ kind: 'domain', label: d, value: d }))
  filters.projectType.forEach((t) => chips.push({ kind: 'type', label: t, value: t }))
  filters.visibility.forEach((v) =>
    chips.push({ kind: 'visibility', label: VISIBILITY_LABELS[v], value: v }),
  )

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <Chip key={`${c.kind}-${c.value ?? c.label}`} onRemove={() => onRemove(c.kind, c.value)}>
          {c.label}
        </Chip>
      ))}
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear all
      </Button>
    </div>
  )
}
