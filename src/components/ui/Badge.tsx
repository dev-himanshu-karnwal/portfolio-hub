import type { ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'warn' | 'danger' | 'demo' | 'success'

const tones: Record<Tone, string> = {
  neutral: 'bg-canvas text-muted border-line',
  accent: 'bg-accent-soft text-accent border-accent/20',
  warn: 'bg-warn-soft text-warn border-warn/20',
  danger: 'bg-danger-soft text-danger border-danger/20',
  demo: 'bg-demo-soft text-demo border-demo/20',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
}

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Chip({
  children,
  active = false,
  onClick,
  onRemove,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  onRemove?: () => void
}) {
  const base =
    'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors'
  const state = active
    ? 'bg-accent text-white border-accent'
    : 'bg-surface text-ink-soft border-line hover:border-accent/40'

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${state}`}>
        {children}
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            className="ml-0.5 opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation()
                onRemove()
              }
            }}
          >
            ×
          </span>
        )}
      </button>
    )
  }

  return (
    <span className={`${base} ${state}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="ml-0.5 opacity-70 hover:opacity-100"
          onClick={onRemove}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  )
}
