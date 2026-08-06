import type { Project } from '../types'
import { VISIBILITY_LABELS } from './constants'

export const EXPORT_FIELDS = [
  { id: 'name', label: 'Name', defaultSelected: true },
  { id: 'description', label: 'Description', defaultSelected: true },
  { id: 'tech_stack', label: 'Tech stack', defaultSelected: true },
  { id: 'url', label: 'Live URL', defaultSelected: true },
  { id: 'figma_url', label: 'Figma URL', defaultSelected: true },
  { id: 'case_study_url', label: 'Case study URL', defaultSelected: true },
  { id: 'project_type', label: 'Project type', defaultSelected: false },
  { id: 'visibility', label: 'Visibility', defaultSelected: false },
  { id: 'domain', label: 'Domains', defaultSelected: false },
  { id: 'tags', label: 'Tags', defaultSelected: false },
  { id: 'notes', label: 'Internal notes', defaultSelected: false },
] as const

export type ExportFieldId = (typeof EXPORT_FIELDS)[number]['id']

export const DEFAULT_EXPORT_FIELDS: ExportFieldId[] = EXPORT_FIELDS.filter(
  (f) => f.defaultSelected,
).map((f) => f.id)

function joinList(values: string[]): string {
  return values.join(', ') || '—'
}

function oneLiner(description: string): string {
  return description.split('\n')[0] || description
}

function projectLines(
  p: Project,
  fields: Set<ExportFieldId>,
  style: 'txt' | 'md',
): string[] {
  const lines: (string | null)[] = []
  const bold = (label: string, value: string) =>
    style === 'md' ? `**${label}:** ${value}` : `${label}: ${value}`

  if (fields.has('name')) {
    lines.push(style === 'md' ? `## ${p.name}` : p.name)
    if (style === 'md') lines.push('')
  }

  if (fields.has('description')) {
    lines.push(oneLiner(p.description))
    if (style === 'md') lines.push('')
  }

  if (fields.has('tech_stack')) {
    lines.push(bold('Tech Stack', joinList(p.tech_stack)))
  }
  if (fields.has('url')) {
    lines.push(bold('Live URL', p.url || '—'))
  }
  if (fields.has('figma_url') && p.figma_url) {
    lines.push(bold('Figma', p.figma_url))
  }
  if (fields.has('case_study_url') && p.case_study_url) {
    lines.push(bold('Case study', p.case_study_url))
  }
  if (fields.has('project_type')) {
    lines.push(bold('Project type', joinList(p.project_type)))
  }
  if (fields.has('visibility')) {
    lines.push(bold('Visibility', VISIBILITY_LABELS[p.visibility]))
  }
  if (fields.has('domain')) {
    lines.push(bold('Domains', joinList(p.domain)))
  }
  if (fields.has('tags')) {
    lines.push(bold('Tags', joinList(p.tags)))
  }
  if (fields.has('notes') && p.notes) {
    lines.push(bold('Notes', p.notes))
  }

  if (style === 'md') lines.push('')

  return lines.filter((line): line is string => line !== null)
}

export function formatProjectExport(
  projects: Project[],
  format: 'txt' | 'md',
  fieldIds: ExportFieldId[] = DEFAULT_EXPORT_FIELDS,
): string {
  const fields = new Set(fieldIds)

  if (format === 'md') {
    return projects
      .map((p) => projectLines(p, fields, 'md').join('\n'))
      .join('\n---\n\n')
  }

  return projects
    .map((p) => projectLines(p, fields, 'txt').join('\n'))
    .join('\n\n────────────────────────\n\n')
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
