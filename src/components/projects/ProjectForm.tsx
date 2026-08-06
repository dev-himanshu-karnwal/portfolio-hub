import { useState, type FormEvent } from 'react'
import { PROJECT_TYPES, VISIBILITY_OPTIONS, VISIBILITY_LABELS } from '../../lib/constants'
import type { Project, ProjectInput, ProjectType, Visibility } from '../../types'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Badge'
import { TagInput } from '../ui/TagInput'

const empty: ProjectInput = {
  name: '',
  description: '',
  url: null,
  figma_url: null,
  tech_stack: [],
  domain: [],
  project_type: [],
  visibility: 'public',
  case_study_url: null,
  tags: [],
  notes: null,
}

export function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: Project | null
  onSubmit: (input: ProjectInput) => Promise<void>
  onCancel: () => void
  submitting?: boolean
}) {
  const [form, setForm] = useState<ProjectInput>(() => {
    if (!initial) return { ...empty }
    return {
      name: initial.name,
      description: initial.description,
      url: initial.url,
      figma_url: initial.figma_url,
      tech_stack: initial.tech_stack,
      domain: initial.domain,
      project_type: initial.project_type,
      visibility: initial.visibility,
      case_study_url: initial.case_study_url,
      tags: initial.tags,
      notes: initial.notes,
    }
  })
  const [error, setError] = useState<string | null>(null)

  function toggleType(type: ProjectType) {
    setForm((f) => {
      const has = f.project_type.includes(type)
      return {
        ...f,
        project_type: has
          ? f.project_type.filter((t) => t !== type)
          : [...f.project_type, type],
      }
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    if (form.project_type.length === 0) {
      setError('Select at least one project type')
      return
    }
    try {
      await onSubmit({
        name: form.name,
        description: form.description,
        url: form.url?.trim() || null,
        figma_url: form.figma_url?.trim() || null,
        tech_stack: form.tech_stack,
        domain: form.domain,
        project_type: form.project_type,
        visibility: form.visibility,
        case_study_url: form.case_study_url?.trim() || null,
        tags: form.tags,
        notes: form.notes?.trim() || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const field =
    'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Name</span>
        <input
          className={field}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Description</span>
        <textarea
          className={`${field} min-h-24`}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Live URL</span>
          <input
            className={field}
            value={form.url ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Figma URL</span>
          <input
            className={field}
            value={form.figma_url ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, figma_url: e.target.value }))}
            placeholder="https://figma.com/..."
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Case study URL</span>
        <input
          className={field}
          value={form.case_study_url ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, case_study_url: e.target.value }))}
          placeholder="https://"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-medium">Project type</span>
        <div className="flex flex-wrap gap-1.5">
          {PROJECT_TYPES.map((t) => (
            <Chip
              key={t}
              active={form.project_type.includes(t)}
              onClick={() => toggleType(t)}
            >
              {t}
            </Chip>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">Select one or more</p>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Visibility</span>
        <select
          className={field}
          value={form.visibility}
          onChange={(e) =>
            setForm((f) => ({ ...f, visibility: e.target.value as Visibility }))
          }
        >
          {VISIBILITY_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {VISIBILITY_LABELS[v]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tech stack</span>
        <TagInput
          values={form.tech_stack}
          onChange={(tech_stack) => setForm((f) => ({ ...f, tech_stack }))}
          placeholder="Type and press Enter"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Domains</span>
        <TagInput
          values={form.domain}
          onChange={(domain) => setForm((f) => ({ ...f, domain }))}
          placeholder="Type and press Enter"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tags</span>
        <TagInput
          values={form.tags}
          onChange={(tags) => setForm((f) => ({ ...f, tags }))}
          placeholder="Type and press Enter"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Internal notes</span>
        <textarea
          className={`${field} min-h-20`}
          value={form.notes ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Only visible to editors and admins"
        />
      </label>

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="min-h-11 sm:min-h-0" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="min-h-11 sm:min-h-0" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create project'}
        </Button>
      </div>
    </form>
  )
}
