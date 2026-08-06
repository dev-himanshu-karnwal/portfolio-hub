import { ExternalLink, PenTool, FileText, Check } from 'lucide-react'
import type { Project } from '../../types'
import { VISIBILITY_LABELS } from '../../lib/constants'
import { Badge, Chip } from '../ui/Badge'
import { useProposal } from '../../contexts/ProposalContext'

function visibilityTone(v: Project['visibility']) {
  if (v === 'public') return 'success' as const
  if (v === 'proposal_only') return 'warn' as const
  return 'danger' as const
}

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
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? 'border-accent ring-2 ring-accent/20' : 'border-line'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative aspect-[16/10] overflow-hidden bg-canvas text-left"
      >
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-soft to-ink transition duration-300 group-hover:scale-[1.02]">
          <span className="font-display text-2xl font-bold text-white/80">
            {project.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="absolute top-2 left-2">
          <Badge tone={visibilityTone(project.visibility)}>
            {VISIBILITY_LABELS[project.visibility]}
          </Badge>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="flex-1 text-left"
          >
            <h3 className="font-display text-base font-semibold text-ink group-hover:text-accent">
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{project.description}</p>
          </button>
          <button
            type="button"
            onClick={() => toggle(project.id)}
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition ${
              selected
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-surface text-muted hover:border-accent'
            }`}
            title={selected ? 'Remove from proposal' : 'Add to proposal'}
            aria-pressed={selected}
          >
            <Check size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 4).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          {project.tech_stack.length > 4 && (
            <Chip>+{project.tech_stack.length - 4}</Chip>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {project.domain.slice(0, 3).map((d) => (
            <Badge key={d} tone="accent">
              {d}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-line pt-3">
          {project.has_live_url && project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
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
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:underline"
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
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:underline"
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
