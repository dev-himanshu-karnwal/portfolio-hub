import { useEffect, useRef } from 'react'

export function ProposalCheckbox({
  checked,
  indeterminate = false,
  onChange,
  title,
  className = '',
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  title?: string
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      title={title}
      aria-label={title}
      className={`h-4 w-4 shrink-0 cursor-pointer rounded border-line text-accent focus:ring-2 focus:ring-accent/25 focus:ring-offset-0 ${className}`}
    />
  )
}
