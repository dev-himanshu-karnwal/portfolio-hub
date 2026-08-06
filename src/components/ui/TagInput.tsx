import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react'
import { X } from 'lucide-react'

function normalizeTag(value: string): string {
  return value.trim()
}

function splitRaw(value: string): string[] {
  return value
    .split(/[,|\n]/)
    .map(normalizeTag)
    .filter(Boolean)
}

export function TagInput({
  values,
  onChange,
  placeholder,
  id,
}: {
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  id?: string
}) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTags(raw: string | string[]) {
    const incoming = (Array.isArray(raw) ? raw : splitRaw(raw)).map(normalizeTag).filter(Boolean)
    if (incoming.length === 0) return
    const seen = new Set(values.map((v) => v.toLowerCase()))
    const next = [...values]
    for (const tag of incoming) {
      const key = tag.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      next.push(tag)
    }
    onChange(next)
    setDraft('')
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index))
  }

  function commitDraft() {
    if (!draft.trim()) return
    addTags(draft)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitDraft()
      return
    }
    if (e.key === 'Backspace' && !draft && values.length > 0) {
      e.preventDefault()
      removeAt(values.length - 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    if (!text || (!text.includes(',') && !text.includes('\n'))) return
    e.preventDefault()
    addTags(`${draft}${text}`)
  }

  return (
    <div
      className="flex min-h-[42px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
      onClick={() => inputRef.current?.focus()}
    >
      {values.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex max-w-full items-center gap-1 rounded-md border border-accent/20 bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent"
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            className="shrink-0 rounded opacity-70 hover:opacity-100"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation()
              removeAt(index)
            }}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        className="min-w-[8rem] flex-1 border-0 bg-transparent py-1 text-sm outline-none placeholder:text-muted"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={commitDraft}
        placeholder={values.length === 0 ? placeholder : 'Add another…'}
      />
    </div>
  )
}
