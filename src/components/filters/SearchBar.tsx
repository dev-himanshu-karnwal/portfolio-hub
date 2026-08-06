import { Search, X } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search name, tech, domain, tags, description…"
        className="w-full rounded-xl border border-line bg-surface py-3 pr-10 pl-10 text-sm shadow-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        aria-label="Search projects"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-muted hover:text-ink"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
