import { useMemo, useState } from 'react'
import { ClipboardCopy, Download, FileText, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useProposal } from '../../contexts/ProposalContext'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { copyToClipboard, downloadFile, formatProjectExport } from '../../lib/export'
import type { Project } from '../../types'

export function ProposalTray() {
  const { selectedProjects, remove, clear, count } = useProposal()
  const [open, setOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)

  if (count === 0) return null

  return (
    <>
      <div className="fixed right-4 bottom-4 z-30 w-[min(100%-2rem,22rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 border-b border-line bg-ink px-4 py-3 text-left text-white"
          onClick={() => setOpen((v) => !v)}
        >
          <div>
            <div className="font-display text-sm font-semibold">Proposal Builder</div>
            <div className="text-xs text-white/70">{count} project{count === 1 ? '' : 's'} selected</div>
          </div>
          {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {open && (
          <div className="max-h-72 overflow-y-auto p-3">
            <ul className="space-y-2">
              {selectedProjects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-2 rounded-lg border border-line bg-canvas/50 px-2.5 py-2"
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
                      {p.visibility}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="rounded p-1 text-muted hover:bg-surface hover:text-ink"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={clear}>
                Clear
              </Button>
              <Button size="sm" className="flex-1" onClick={() => setExportOpen(true)}>
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

  const { exportable, blocked, proposalOnly } = useMemo(() => {
    const blocked = projects.filter((p) => p.visibility === 'internal')
    const proposalOnly = projects.filter((p) => p.visibility === 'proposal_only')
    const exportable = projects.filter((p) => p.visibility !== 'internal')
    return { exportable, blocked, proposalOnly }
  }, [projects])

  const needsWarning = proposalOnly.length > 0 && !confirmedProposalOnly
  const canExport = exportable.length > 0 && !needsWarning

  async function doCopy() {
    const text = formatProjectExport(exportable, 'txt')
    await copyToClipboard(text)
    setStatus('Copied to clipboard')
  }

  function doDownload(format: 'txt' | 'md') {
    const content = formatProjectExport(exportable, format)
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
        <div className="mb-3 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
          {blocked.length} internal project{blocked.length === 1 ? '' : 's'} excluded from export
          and cannot be shared: {blocked.map((p) => p.name).join(', ')}.
        </div>
      )}

      {proposalOnly.length > 0 && (
        <div className="mb-3 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-sm text-warn">
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
        Each export includes name, one-line description, tech stack, and URL.
        {exportable.length > 0
          ? ` ${exportable.length} project(s) will be included.`
          : ' Nothing to export.'}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button disabled={!canExport} onClick={() => void doCopy()}>
          <ClipboardCopy size={14} /> Copy to clipboard
        </Button>
        <Button
          variant="outline"
          disabled={!canExport}
          onClick={() => doDownload('txt')}
        >
          <Download size={14} /> .txt
        </Button>
        <Button
          variant="outline"
          disabled={!canExport}
          onClick={() => doDownload('md')}
        >
          <FileText size={14} /> .md
        </Button>
      </div>

      {status && <p className="mt-3 text-sm text-accent">{status}</p>}
    </Modal>
  )
}
