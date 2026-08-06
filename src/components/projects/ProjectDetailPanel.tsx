import { useState } from 'react'
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
import { VISIBILITY_LABELS } from '../../lib/constants'
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

  // Editors update own projects; admins update all. Delete is admin-only.
  const canEditThis =
    isAdmin || (profile?.role === 'editor' && project.created_by === profile.uid)

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
          className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
          aria-label="Close panel"
          onClick={onClose}
        />
        <aside className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-line bg-surface shadow-2xl animate-in">
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <Badge
                tone={
                  project.visibility === 'public'
                    ? 'success'
                    : project.visibility === 'proposal_only'
                      ? 'warn'
                      : 'danger'
                }
              >
                {VISIBILITY_LABELS[project.visibility]}
              </Badge>
              <h2 className="mt-2 font-display text-xl font-bold text-ink">{project.name}</h2>
              <p className="mt-0.5 text-sm text-muted">
                {project.project_type.join(' · ') || '—'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted hover:bg-canvas"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-5 p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {project.description}
              </p>

              <section>
                <h3 className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
                  Tech stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
                  Domains
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.domain.map((d) => (
                    <Badge key={d} tone="accent">
                      {d}
                    </Badge>
                  ))}
                </div>
              </section>

              {project.tags.length > 0 && (
                <section>
                  <h3 className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-2">
                <h3 className="mb-2 text-[11px] font-bold tracking-wider text-muted uppercase">
                  Links
                </h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                  >
                    <ExternalLink size={14} /> Open live URL
                  </a>
                )}
                {project.figma_url && (
                  <a
                    href={project.figma_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-ink-soft hover:underline"
                  >
                    <PenTool size={14} /> Open Figma
                  </a>
                )}
                {project.case_study_url && (
                  <a
                    href={project.case_study_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-ink-soft hover:underline"
                  >
                    <FileText size={14} /> Case study
                  </a>
                )}
                {!project.url && !project.figma_url && !project.case_study_url && (
                  <p className="text-sm text-muted">No links</p>
                )}
              </section>

              {showNotes && (
                <section className="rounded-xl border border-warn/30 bg-warn-soft p-4">
                  <h3 className="mb-1 text-[11px] font-bold tracking-wider text-warn uppercase">
                    Internal notes
                  </h3>
                  <p className="whitespace-pre-wrap text-sm text-ink-soft">{project.notes}</p>
                </section>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
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
                className="ml-auto text-danger"
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
