import type { ReactNode } from 'react'
import { ExternalLink, PenTool, FileText } from 'lucide-react'
import type { Project } from '../../types'
import { VISIBILITY_LABELS } from '../../lib/constants'
import { useProposal } from '../../contexts/ProposalContext'
import { ProposalCheckbox } from '../proposal/ProposalCheckbox'
import { useProposalBulk } from '../../hooks/useProposalBulk'
import { Badge, Chip } from '../ui/Badge'

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

function visibilityTone(v: Project['visibility']) {
  if (v === 'public') return 'success' as const
  if (v === 'proposal_only') return 'warn' as const
  return 'danger' as const
}

function MobileRow({
  project,
  selected,
  onToggle,
  onOpen,
}: {
  project: Project
  selected: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  return (
    <li className="border-b border-line/60 last:border-b-0">
      <div className="flex items-start gap-3 px-3 py-3.5">
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <ProposalCheckbox
            checked={selected}
            onChange={onToggle}
            title={selected ? 'Remove from proposal' : 'Add to proposal'}
          />
        </div>
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge tone={visibilityTone(project.visibility)}>
              {VISIBILITY_LABELS[project.visibility]}
            </Badge>
            {project.project_type.slice(0, 2).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <div className="font-medium text-ink">{project.name}</div>
          {project.description && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">
              {project.description}
            </p>
          )}
          {(project.tech_stack.length > 0 || project.domain.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.tech_stack.slice(0, 3).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
              {project.domain.slice(0, 2).map((d) => (
                <Badge key={d} tone="accent">
                  {d}
                </Badge>
              ))}
            </div>
          )}
        </button>
        <div className="flex shrink-0 flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
          {project.url && (
            <LinkButton
              href={project.url}
              icon={<ExternalLink size={13} />}
              label="Live URL"
              tone="accent"
            />
          )}
          {project.figma_url && (
            <LinkButton href={project.figma_url} icon={<PenTool size={13} />} label="Figma" />
          )}
          {project.case_study_url && (
            <LinkButton
              href={project.case_study_url}
              icon={<FileText size={13} />}
              label="Case study"
            />
          )}
        </div>
      </div>
    </li>
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
      {/* Mobile: stacked rows */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 border-b border-line bg-canvas/80 px-3 py-2.5">
          <ProposalCheckbox
            checked={allVisibleSelected}
            indeterminate={someVisibleSelected}
            onChange={toggleSelectAllVisible}
            title="Select all visible projects"
          />
          <span className="section-label">Select all visible</span>
        </div>
        <ul>
          {projects.map((p) => (
            <MobileRow
              key={p.id}
              project={p}
              selected={isSelected(p.id)}
              onToggle={() => toggle(p.id)}
              onOpen={() => onOpen(p)}
            />
          ))}
        </ul>
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
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
