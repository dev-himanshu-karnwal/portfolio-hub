import { ExternalLink, PenTool, FileText } from 'lucide-react'
import type { Project } from '../../types'
import { Badge, Chip } from '../ui/Badge'
import { useProposal } from '../../contexts/ProposalContext'
import { ProposalCheckbox } from '../proposal/ProposalCheckbox'

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const { isSelected, toggle } = useProposal()
  const selected = isSelected(project.id)

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected ? 'border-accent ring-2 ring-accent/20' : 'border-line/80'
      }`}
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-2">
          <div
            className="pt-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <ProposalCheckbox
              checked={selected}
              onChange={() => toggle(project.id)}
              title={selected ? 'Remove from proposal' : 'Add to proposal'}
            />
          </div>
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="min-w-0 flex-1 text-left"
          >
            {project.visibility.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {project.visibility.map((v) => (
                  <Chip key={v}>{v}</Chip>
                ))}
              </div>
            )}
            <h3 className="font-display text-base font-semibold text-ink transition group-hover:text-accent">
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
              {project.description}
            </p>
          </button>
        </div>

        {project.project_type.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-6">
            {project.project_type.slice(0, 2).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
            {project.project_type.length > 2 && (
              <Chip>+{project.project_type.length - 2}</Chip>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1 pl-6">
          {project.tech_stack.slice(0, 4).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          {project.tech_stack.length > 4 && (
            <Chip>+{project.tech_stack.length - 4}</Chip>
          )}
        </div>

        {project.domain.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-6">
            {project.domain.slice(0, 3).map((d) => (
              <Badge key={d} tone="accent">
                {d}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 border-t border-line/70 pt-3 pl-6">
          {project.has_live_url && project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-accent/5 px-2 py-1 text-xs font-medium text-accent transition hover:bg-accent/10"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} /> Live
            </a>
          )}
          {project.has_figma && project.figma_url && (
            <a
              href={project.figma_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted transition hover:bg-canvas hover:text-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <PenTool size={12} /> Figma
            </a>
          )}
          {project.has_case_study && project.case_study_url && (
            <a
              href={project.case_study_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted transition hover:bg-canvas hover:text-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText size={12} /> Case Study
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
