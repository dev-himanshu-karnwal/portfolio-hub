import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20',
  secondary: 'bg-ink text-white hover:bg-ink-soft',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  danger: 'bg-danger text-white hover:bg-danger/90',
  outline: 'border border-line bg-surface text-ink hover:bg-canvas',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
