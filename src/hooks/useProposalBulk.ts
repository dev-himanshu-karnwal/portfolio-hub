import { useCallback, useMemo } from 'react'
import type { Project } from '../types'
import { useProposal } from '../contexts/ProposalContext'

export function useProposalBulk(projects: Project[]) {
  const { isSelected, selectMany, deselectMany, clear, count } = useProposal()

  const ids = useMemo(() => projects.map((p) => p.id), [projects])

  const visibleSelectedCount = useMemo(
    () => ids.filter((id) => isSelected(id)).length,
    [ids, isSelected],
  )

  const allVisibleSelected = ids.length > 0 && visibleSelectedCount === ids.length
  const someVisibleSelected =
    visibleSelectedCount > 0 && visibleSelectedCount < ids.length

  const toggleSelectAllVisible = useCallback(() => {
    if (allVisibleSelected) deselectMany(ids)
    else selectMany(ids)
  }, [allVisibleSelected, ids, selectMany, deselectMany])

  const clearAll = useCallback(() => clear(), [clear])

  return {
    allVisibleSelected,
    someVisibleSelected,
    visibleSelectedCount,
    totalVisible: ids.length,
    totalSelected: count,
    toggleSelectAllVisible,
    clearAll,
  }
}
