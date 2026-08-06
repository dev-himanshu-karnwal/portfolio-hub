import { useState, type ReactNode } from 'react'
import {
  X,
  ExternalLink,
  PenTool,
  FileText,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react'
import type { Project, ProjectInput } from '../../types'
import { projectGradient, projectInitials } from '../../lib/avatar'
import { Badge, Chip } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { ProjectForm } from './ProjectForm'
import { useAuth } from '../../contexts/AuthContext'
import { useProjects } from '../../contexts/ProjectsContext'
import { useProposal } from '../../contexts/ProposalContext'

export function ProjectDetailPanel({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const { isAdmin, profile } = useAuth()
  const { editProject, removeProject } = useProjects()
  const { isSelected, toggle } = useProposal()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const showNotes =
    (profile?.role === 'editor' || profile?.role === 'admin') && Boolean(project.notes)

  const canEditThis =
    isAdmin || (profile?.role === 'editor' && project.created_by === profile.uid)

  const gradient = projectGradient(project.name)

  async function handleSave(input: ProjectInput) {
    setSaving(true)
    try {
      await editProject(project.id, input)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    await removeProject(project)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end">
        <button
          type="button"
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          aria-label="Close panel"
          onClick={onClose}
        />
        <aside className="relative z-10 flex h-full w-full max-w-lg flex-col bg-surface shadow-2xl animate-slide-in-right">
          {/* Hero header */}
          <div className={`relative shrink-0 bg-gradient-to-br ${gradient} px-5 pt-5 pb-6`}>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 rounded-lg bg-white/10 p-1.5 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white backdrop-blur-sm">
                {projectInitials(project.name)}
              </div>
              <div className="min-w-0 pt-1">
                {project.visibility.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {project.visibility.map((v) => (
                      <Chip key={v}>{v}</Chip>
                    ))}
                  </div>
                )}
                <h2 className="font-display text-xl font-bold text-white">{project.name}</h2>
                <p className="mt-0.5 text-sm text-white/70">
                  {project.project_type.join(' · ') || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="space-y-6 p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {project.description}
              </p>

              <DetailSection title="Project type">
                <div className="flex flex-wrap gap-1.5">
                  {project.project_type.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                  {project.project_type.length === 0 && (
                    <span className="text-sm text-muted">None listed</span>
                  )}
                </div>
              </DetailSection>

              <DetailSection title="Visibility">
                <div className="flex flex-wrap gap-1.5">
                  {project.visibility.map((v) => (
                    <Chip key={v}>{v}</Chip>
                  ))}
                  {project.visibility.length === 0 && (
                    <span className="text-sm text-muted">None listed</span>
                  )}
                </div>
              </DetailSection>

              <DetailSection title="Tech stack">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                  {project.tech_stack.length === 0 && (
                    <span className="text-sm text-muted">None listed</span>
                  )}
                </div>
              </DetailSection>

              <DetailSection title="Domains">
                <div className="flex flex-wrap gap-1.5">
                  {project.domain.map((d) => (
                    <Badge key={d} tone="accent">
                      {d}
                    </Badge>
                  ))}
                  {project.domain.length === 0 && (
                    <span className="text-sm text-muted">None listed</span>
                  )}
                </div>
              </DetailSection>

              {project.tags.length > 0 && (
                <DetailSection title="Tags">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </DetailSection>
              )}

              <DetailSection title="Links">
                <div className="space-y-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-canvas/40 px-3 py-2.5 text-sm font-medium text-accent transition hover:bg-accent/5"
                    >
                      <ExternalLink size={15} /> Open live URL
                    </a>
                  )}
                  {project.figma_url && (
                    <a
                      href={project.figma_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-canvas/40 px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-canvas"
                    >
                      <PenTool size={15} /> Open Figma
                    </a>
                  )}
                  {project.case_study_url && (
                    <a
                      href={project.case_study_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-canvas/40 px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-canvas"
                    >
                      <FileText size={15} /> Case study
                    </a>
                  )}
                  {!project.url && !project.figma_url && !project.case_study_url && (
                    <p className="text-sm text-muted">No links</p>
                  )}
                </div>
              </DetailSection>

              {showNotes && (
                <div className="rounded-xl border border-warn/30 bg-warn-soft p-4">
                  <h3 className="section-label mb-1.5 text-warn">Internal notes</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                    {project.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-line/70 bg-canvas/30 px-5 py-4">
            <Button
              variant={isSelected(project.id) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => toggle(project.id)}
            >
              <Check size={14} />
              {isSelected(project.id) ? 'In proposal' : 'Add to proposal'}
            </Button>
            {canEditThis && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil size={14} /> Edit
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-danger hover:bg-danger-soft"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} /> Delete
              </Button>
            )}
          </div>
        </aside>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit project" wide>
        <ProjectForm
          initial={project}
          submitting={saving}
          onCancel={() => setEditing(false)}
          onSubmit={handleSave}
        />
      </Modal>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete project?">
        <p className="mb-4 text-sm text-muted">
          This permanently deletes <strong>{project.name}</strong>. This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => void handleDelete()}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <h3 className="section-label mb-2.5">{title}</h3>
      {children}
    </section>
  )
}
