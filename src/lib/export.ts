import type { Project } from '../types'

export function formatProjectExport(projects: Project[], format: 'txt' | 'md'): string {
  if (format === 'md') {
    return projects
      .map((p) => {
        const lines = [
          `## ${p.name}`,
          '',
          p.description.split('\n')[0] || p.description,
          '',
          `**Tech Stack:** ${p.tech_stack.join(', ') || '—'}`,
          p.url ? `**Live URL:** ${p.url}` : '**Live URL:** —',
          p.figma_url ? `**Figma:** ${p.figma_url}` : null,
          p.case_study_url ? `**Case study:** ${p.case_study_url}` : null,
          '',
        ].filter((line): line is string => line !== null)
        return lines.join('\n')
      })
      .join('\n---\n\n')
  }

  return projects
    .map((p) => {
      const oneLiner = p.description.split('\n')[0] || p.description
      return [
        p.name,
        oneLiner,
        `Tech Stack: ${p.tech_stack.join(', ') || '—'}`,
        `Live URL: ${p.url || '—'}`,
        p.figma_url ? `Figma: ${p.figma_url}` : null,
        p.case_study_url ? `Case study: ${p.case_study_url}` : null,
      ]
        .filter((line): line is string => line !== null)
        .join('\n')
    })
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
