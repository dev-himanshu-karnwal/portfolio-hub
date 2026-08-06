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
      <div className="panel border-dashed bg-surface/60 px-6 py-20 text-center animate-fade-in">
        <p className="font-display text-lg font-semibold text-ink">No projects match</p>
        <p className="mt-1 text-sm text-muted">Try clearing filters or adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 animate-fade-in">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onOpen={onOpen} />
      ))}
    </div>
  )
}
