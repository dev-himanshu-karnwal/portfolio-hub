import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Plus, SlidersHorizontal } from 'lucide-react'
import { useProjects } from '../contexts/ProjectsContext'
import { useAuth } from '../contexts/AuthContext'
import { useUrlFilters } from '../hooks/useUrlFilters'
import { collectFacetValues, countActiveFilters, filterProjects } from '../lib/filters'
import { SearchBar } from '../components/filters/SearchBar'
import { FilterPanel } from '../components/filters/FilterPanel'
import { ActiveFilterChips } from '../components/filters/ActiveFilterChips'
import { ProjectGrid } from '../components/projects/ProjectGrid'
import { ProjectTable } from '../components/projects/ProjectTable'
import { ProjectDetailPanel } from '../components/projects/ProjectDetailPanel'
import { ProjectForm } from '../components/projects/ProjectForm'
import { ProposalTray } from '../components/proposal/ProposalTray'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import type { Project, ProjectInput } from '../types'

export function HomePage() {
  const { projects, loading, error, addProject } = useProjects()
  const { canEdit } = useAuth()
  const {
    filters,
    setSearch,
    toggleTech,
    toggleDomain,
    toggleProjectType,
    toggleVisibility,
    setView,
    clearFilters,
    removeChip,
  } = useUrlFilters()

  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<Project | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (searchParams.get('new') === '1' && canEdit) {
      setCreating(true)
      const next = new URLSearchParams(searchParams)
      next.delete('new')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams, canEdit])

  const facets = useMemo(() => collectFacetValues(projects), [projects])

  const filtered = useMemo(() => filterProjects(projects, filters), [projects, filters])

  const activeCount = countActiveFilters(filters)

  useEffect(() => {
    if (!selected) return
    const fresh = projects.find((p) => p.id === selected.id)
    if (!fresh) setSelected(null)
    else if (fresh !== selected) setSelected(fresh)
  }, [projects, selected])

  async function handleCreate(input: ProjectInput) {
    setSaving(true)
    try {
      await addProject(input)
      setCreating(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Projects
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">
            Browse and filter past work for proposals and client demos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={14} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </Button>
          <div className="inline-flex rounded-xl border border-line/80 bg-surface p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filters.view === 'grid'
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <LayoutGrid size={14} /> Grid
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filters.view === 'table'
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <List size={14} /> Table
            </button>
          </div>
          {canEdit && (
            <Button size="sm" className="shadow-sm" onClick={() => setCreating(true)}>
              <Plus size={14} /> Add Project
            </Button>
          )}
        </div>
      </div>

      {/* Search + results bar */}
      <div className="panel mb-5 px-4 py-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <SearchBar value={filters.search} onChange={setSearch} />
          </div>
          <div className="flex shrink-0 items-baseline gap-1.5 self-end text-sm sm:self-auto">
            <span className="font-display text-lg font-bold text-ink">{filtered.length}</span>
            <span className="whitespace-nowrap text-muted">
              result{filtered.length === 1 ? '' : 's'}
              {loading ? ' · loading…' : ` of ${projects.length}`}
            </span>
          </div>
        </div>
        <ActiveFilterChips
          filters={filters}
          onRemove={removeChip}
          onClear={clearFilters}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Main content */}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className={showFilters ? 'block animate-fade-in' : 'hidden lg:block'}>
          <FilterPanel
            filters={filters}
            techOptions={facets.techStack}
            domainOptions={facets.domain}
            onToggleTech={toggleTech}
            onToggleDomain={toggleDomain}
            onToggleType={toggleProjectType}
            onToggleVisibility={toggleVisibility}
          />
        </div>

        <div className="min-w-0 pb-28">
          {loading && projects.length === 0 ? (
            <div className="panel px-6 py-20 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-accent/20" />
              <p className="text-muted">Loading projects…</p>
            </div>
          ) : (
            <>
              {filters.view === 'table' ? (
                <ProjectTable projects={filtered} onOpen={setSelected} />
              ) : (
                <ProjectGrid projects={filtered} onOpen={setSelected} />
              )}
            </>
          )}
        </div>
      </div>

      {selected && (
        <ProjectDetailPanel project={selected} onClose={() => setSelected(null)} />
      )}

      <ProposalTray />

      <Modal open={creating} onClose={() => setCreating(false)} title="Add project" wide>
        <ProjectForm
          submitting={saving}
          onCancel={() => setCreating(false)}
          onSubmit={handleCreate}
        />
      </Modal>
    </main>
  )
}
