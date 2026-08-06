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
      <Search
        size={17}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted sm:left-4"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search name, tech, domain…"
        className="w-full rounded-xl border border-line/80 bg-surface py-2.5 pr-10 pl-10 text-sm shadow-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/15 sm:pr-11 sm:pl-11"
        aria-label="Search projects"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted transition hover:bg-canvas hover:text-ink sm:right-3.5"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
