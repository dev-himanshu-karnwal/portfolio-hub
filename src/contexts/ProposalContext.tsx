import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Project } from '../types'

interface ProposalContextValue {
  selectedIds: Set<string>
  selectedProjects: Project[]
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  selectMany: (ids: string[]) => void
  deselectMany: (ids: string[]) => void
  clear: () => void
  isSelected: (id: string) => boolean
  count: number
}

const ProposalContext = createContext<ProposalContextValue | null>(null)

export function ProposalProvider({
  children,
  projects,
}: {
  children: ReactNode
  projects: Project[]
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const add = useCallback((id: string) => {
    setSelectedIds((prev) => new Set(prev).add(id))
  }, [])

  const remove = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const selectMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
  }, [])

  const deselectMany = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }, [])

  const clear = useCallback(() => setSelectedIds(new Set()), [])

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds])

  const selectedProjects = useMemo(
    () => projects.filter((p) => selectedIds.has(p.id)),
    [projects, selectedIds],
  )

  const value = useMemo(
    () => ({
      selectedIds,
      selectedProjects,
      toggle,
      add,
      remove,
      selectMany,
      deselectMany,
      clear,
      isSelected,
      count: selectedIds.size,
    }),
    [selectedIds, selectedProjects, toggle, add, remove, selectMany, deselectMany, clear, isSelected],
  )

  return <ProposalContext.Provider value={value}>{children}</ProposalContext.Provider>
}

export function useProposal() {
  const ctx = useContext(ProposalContext)
  if (!ctx) throw new Error('useProposal must be used within ProposalProvider')
  return ctx
}
