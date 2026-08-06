import { useEffect, useMemo, useState } from 'react'
import { ClipboardCopy, Download, FileText, X, ChevronUp, ChevronDown, Briefcase } from 'lucide-react'
import { useProposal } from '../../contexts/ProposalContext'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import {
  copyToClipboard,
  DEFAULT_EXPORT_FIELDS,
  downloadFile,
  EXPORT_FIELDS,
  formatProjectExport,
  type ExportFieldId,
} from '../../lib/export'
import { VISIBILITY_LABELS } from '../../lib/constants'
import type { Project } from '../../types'

export function ProposalTray() {
  const { selectedProjects, remove, clear, count } = useProposal()
  const [open, setOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)

  if (count === 0) return null

  return (
    <>
      <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 w-auto overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-2xl animate-fade-in sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[min(100%-2rem,24rem)]">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 bg-gradient-to-r from-ink to-ink-soft px-4 py-3.5 text-left text-white"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Briefcase size={16} />
            </span>
            <div>
              <div className="font-display text-sm font-semibold">Proposal Builder</div>
              <div className="text-xs text-white/65">
                {count} project{count === 1 ? '' : 's'} selected
              </div>
            </div>
          </div>
          {open ? <ChevronDown size={16} className="text-white/70" /> : <ChevronUp size={16} className="text-white/70" />}
        </button>

        {open && (
          <div className="flex max-h-72 flex-col">
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thin">
              {selectedProjects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-2 rounded-xl border border-line/60 bg-canvas/40 px-3 py-2.5 transition hover:bg-canvas/70"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{p.name}</div>
                    <Badge
                      tone={
                        p.visibility === 'public'
                          ? 'success'
                          : p.visibility === 'proposal_only'
                            ? 'warn'
                            : 'danger'
                      }
                      className="mt-1"
                    >
                      {VISIBILITY_LABELS[p.visibility]}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="rounded-lg p-1 text-muted transition hover:bg-surface hover:text-ink"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 gap-2 border-t border-line/60 bg-surface p-3">
              <Button variant="outline" size="sm" className="flex-1" onClick={clear}>
                Clear
              </Button>
              <Button size="sm" className="flex-1 shadow-sm" onClick={() => setExportOpen(true)}>
                Export
              </Button>
            </div>
          </div>
        )}
      </div>

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        projects={selectedProjects}
      />
    </>
  )
}

function ExportDialog({
  open,
  onClose,
  projects,
}: {
  open: boolean
  onClose: () => void
  projects: Project[]
}) {
  const [status, setStatus] = useState<string | null>(null)
  const [confirmedProposalOnly, setConfirmedProposalOnly] = useState(false)
  const [selectedFields, setSelectedFields] = useState<ExportFieldId[]>(DEFAULT_EXPORT_FIELDS)

  useEffect(() => {
    if (!open) return
    setStatus(null)
    setConfirmedProposalOnly(false)
    setSelectedFields(DEFAULT_EXPORT_FIELDS)
  }, [open])

  const { exportable, blocked, proposalOnly } = useMemo(() => {
    const blocked = projects.filter((p) => p.visibility === 'internal')
    const proposalOnly = projects.filter((p) => p.visibility === 'proposal_only')
    const exportable = projects.filter((p) => p.visibility !== 'internal')
    return { exportable, blocked, proposalOnly }
  }, [projects])

  const needsWarning = proposalOnly.length > 0 && !confirmedProposalOnly
  const canExport = exportable.length > 0 && !needsWarning && selectedFields.length > 0

  function toggleField(id: ExportFieldId) {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }

  async function doCopy() {
    const text = formatProjectExport(exportable, 'txt', selectedFields)
    await copyToClipboard(text)
    setStatus('Copied to clipboard')
  }

  function doDownload(format: 'txt' | 'md') {
    const content = formatProjectExport(exportable, format, selectedFields)
    downloadFile(
      content,
      `proposal-projects.${format}`,
      format === 'md' ? 'text/markdown' : 'text/plain',
    )
    setStatus(`Downloaded .${format}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Export proposal">
      {blocked.length > 0 && (
        <div className="mb-3 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
          {blocked.length} internal project{blocked.length === 1 ? '' : 's'} excluded from export
          and cannot be shared: {blocked.map((p) => p.name).join(', ')}.
        </div>
      )}

      {proposalOnly.length > 0 && (
        <div className="mb-3 rounded-xl border border-warn/30 bg-warn-soft px-3 py-2 text-sm text-warn">
          <p className="font-medium">
            Includes proposal-only projects: {proposalOnly.map((p) => p.name).join(', ')}.
          </p>
          <p className="mt-1">Confirm these are appropriate for the recipient before exporting.</p>
          <label className="mt-2 flex items-center gap-2 text-ink">
            <input
              type="checkbox"
              checked={confirmedProposalOnly}
              onChange={(e) => setConfirmedProposalOnly(e.target.checked)}
            />
            I confirm it is OK to export proposal-only projects
          </label>
        </div>
      )}

      <p className="mb-4 text-sm text-muted">
        Choose which fields to include, then export.
        {exportable.length > 0
          ? ` ${exportable.length} project${exportable.length === 1 ? '' : 's'} will be included.`
          : ' Nothing to export.'}
      </p>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-ink">Fields to include</legend>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {EXPORT_FIELDS.map((field) => {
            const checked = selectedFields.includes(field.id)
            return (
              <label
                key={field.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition ${
                  checked
                    ? 'border-accent/40 bg-accent/5 text-ink'
                    : 'border-line/70 bg-canvas/40 text-muted hover:border-line hover:text-ink'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleField(field.id)}
                  className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-line text-accent focus:ring-2 focus:ring-accent/25 focus:ring-offset-0"
                />
                <span className="leading-tight">{field.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button disabled={!canExport} className="min-h-11 sm:min-h-0" onClick={() => void doCopy()}>
          <ClipboardCopy size={14} /> Copy to clipboard
        </Button>
        <Button
          variant="outline"
          disabled={!canExport}
          className="min-h-11 sm:min-h-0"
          onClick={() => doDownload('txt')}
        >
          <Download size={14} /> .txt
        </Button>
        <Button
          variant="outline"
          disabled={!canExport}
          className="min-h-11 sm:min-h-0"
          onClick={() => doDownload('md')}
        >
          <FileText size={14} /> .md
        </Button>
      </div>

      {status && <p className="mt-3 text-sm text-accent">{status}</p>}
    </Modal>
  )
}
