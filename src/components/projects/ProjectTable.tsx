import type { ReactNode } from 'react'
import { ExternalLink, PenTool, FileText } from 'lucide-react'
import type { Project } from '../../types'
import { VISIBILITY_LABELS } from '../../lib/constants'
import { useProposal } from '../../contexts/ProposalContext'
import { ProposalCheckbox } from '../proposal/ProposalCheckbox'
import { useProposalBulk } from '../../hooks/useProposalBulk'

function CellText({ value }: { value: string }) {
  if (!value) return <span className="text-muted">—</span>
  return (
    <span className="block truncate text-muted" title={value}>
      {value}
    </span>
  )
}

function LinkButton({
  href,
  icon,
  label,
  tone = 'default',
}: {
  href: string
  icon: ReactNode
  label: string
  tone?: 'default' | 'accent'
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition ${
        tone === 'accent'
          ? 'border-accent/20 bg-accent/5 text-accent hover:bg-accent/10'
          : 'border-line bg-canvas/50 text-muted hover:border-line hover:bg-canvas hover:text-ink'
      }`}
    >
      {icon}
    </a>
  )
}

export function ProjectTable({
  projects,
  onOpen,
}: {
  projects: Project[]
  onOpen: (project: Project) => void
}) {
  const { isSelected, toggle } = useProposal()
  const { allVisibleSelected, someVisibleSelected, toggleSelectAllVisible } =
    useProposalBulk(projects)

  if (projects.length === 0) {
    return (
      <div className="panel border-dashed bg-surface/60 px-6 py-20 text-center animate-fade-in">
        <p className="font-display text-lg font-semibold text-ink">No projects match</p>
        <p className="mt-1 text-sm text-muted">Try adjusting your filters or search.</p>
      </div>
    )
  }

  return (
    <div className="panel overflow-hidden animate-fade-in">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-line bg-canvas/95 backdrop-blur-sm">
            <tr className="section-label">
              <th className="w-12 px-4 py-3">
                <ProposalCheckbox
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  title="Select all visible projects"
                />
              </th>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Tech</th>
              <th className="px-4 py-3 font-semibold">Domain</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {projects.map((p) => {
              const selected = isSelected(p.id)

              return (
                <tr
                  key={p.id}
                  className="group cursor-pointer transition-colors hover:bg-accent/[0.03]"
                  onClick={() => onOpen(p)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <ProposalCheckbox
                      checked={selected}
                      onChange={() => toggle(p.id)}
                      title={selected ? 'Remove from proposal' : 'Add to proposal'}
                    />
                  </td>

                  <td className="max-w-[260px] px-4 py-3">
                    <div className="truncate font-medium text-ink group-hover:text-accent">
                      {p.name}
                    </div>
                    {p.description && (
                      <div className="mt-0.5 truncate text-xs text-muted">
                        {p.description}
                      </div>
                    )}
                  </td>

                  <td className="max-w-[160px] px-4 py-3">
                    <CellText value={p.project_type.join(', ')} />
                  </td>

                  <td className="max-w-[200px] px-4 py-3">
                    <CellText value={p.tech_stack.join(', ')} />
                  </td>

                  <td className="max-w-[160px] px-4 py-3">
                    <CellText value={p.domain.join(', ')} />
                  </td>

                  <td className="max-w-[120px] px-4 py-3">
                    <CellText value={VISIBILITY_LABELS[p.visibility]} />
                  </td>

                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      {p.url && (
                        <LinkButton
                          href={p.url}
                          icon={<ExternalLink size={13} />}
                          label="Live URL"
                          tone="accent"
                        />
                      )}
                      {p.figma_url && (
                        <LinkButton
                          href={p.figma_url}
                          icon={<PenTool size={13} />}
                          label="Figma"
                        />
                      )}
                      {p.case_study_url && (
                        <LinkButton
                          href={p.case_study_url}
                          icon={<FileText size={13} />}
                          label="Case study"
                        />
                      )}
                      {!p.url && !p.figma_url && !p.case_study_url && (
                        <span className="text-xs text-muted">—</span>
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
