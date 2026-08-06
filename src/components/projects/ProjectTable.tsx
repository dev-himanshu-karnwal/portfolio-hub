import { ExternalLink, PenTool, FileText, Check } from 'lucide-react'
import type { Project } from '../../types'
import { VISIBILITY_LABELS } from '../../lib/constants'
import { Badge } from '../ui/Badge'
import { useProposal } from '../../contexts/ProposalContext'

export function ProjectTable({
  projects,
  onOpen,
}: {
  projects: Project[]
  onOpen: (project: Project) => void
}) {
  const { isSelected, toggle } = useProposal()

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
        <p className="font-display text-lg font-semibold text-ink">No projects match</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-canvas/80 text-[11px] tracking-wider text-muted uppercase">
            <tr>
              <th className="w-10 px-3 py-3" />
              <th className="px-3 py-3 font-semibold">Project</th>
              <th className="px-3 py-3 font-semibold">Type</th>
              <th className="px-3 py-3 font-semibold">Tech</th>
              <th className="px-3 py-3 font-semibold">Domain</th>
              <th className="px-3 py-3 font-semibold">Visibility</th>
              <th className="px-3 py-3 font-semibold">Links</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const selected = isSelected(p.id)
              return (
                <tr
                  key={p.id}
                  className="border-b border-line/70 hover:bg-canvas/50 cursor-pointer"
                  onClick={() => onOpen(p)}
                >
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggle(p.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded border ${
                        selected
                          ? 'border-accent bg-accent text-white'
                          : 'border-line text-muted'
                      }`}
                      aria-pressed={selected}
                    >
                      <Check size={12} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5 font-medium text-ink">{p.name}</td>
                  <td className="px-3 py-2.5 text-muted">
                    {p.project_type.join(', ') || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-muted">
                    {p.tech_stack.slice(0, 3).join(', ')}
                    {p.tech_stack.length > 3 ? '…' : ''}
                  </td>
                  <td className="px-3 py-2.5 text-muted">{p.domain.join(', ')}</td>
                  <td className="px-3 py-2.5">
                    <Badge
                      tone={
                        p.visibility === 'public'
                          ? 'success'
                          : p.visibility === 'proposal_only'
                            ? 'warn'
                            : 'danger'
                      }
                    >
                      {VISIBILITY_LABELS[p.visibility]}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline"
                          title="Live URL"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {p.figma_url && (
                        <a
                          href={p.figma_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-soft hover:underline"
                          title="Figma"
                        >
                          <PenTool size={14} />
                        </a>
                      )}
                      {p.case_study_url && (
                        <a
                          href={p.case_study_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-soft hover:underline"
                          title="Case study"
                        >
                          <FileText size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
