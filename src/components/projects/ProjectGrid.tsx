import type { Project } from '../../types'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid({
  projects,
  onOpen,
}: {
  projects: Project[]
  onOpen: (project: Project) => void
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink">No projects match</p>
        <p className="mt-1 text-sm text-muted">Try clearing filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onOpen={onOpen} />
      ))}
    </div>
  )
}
