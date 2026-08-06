import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createProject,
  deleteProject,
  fetchAllProjects,
  updateProject,
} from '../lib/projects'
import { useAuth } from './AuthContext'
import type { Project, ProjectInput } from '../types'

interface ProjectsContextValue {
  projects: Project[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addProject: (input: ProjectInput) => Promise<string>
  editProject: (id: string, input: ProjectInput) => Promise<void>
  removeProject: (project: Project) => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setProjects([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addProject = useCallback(
    async (input: ProjectInput) => {
      if (!user) throw new Error('Not authenticated')
      const id = await createProject(input, user.uid)
      await refresh()
      return id
    },
    [user, refresh],
  )

  const editProject = useCallback(
    async (id: string, input: ProjectInput) => {
      await updateProject(id, input)
      await refresh()
    },
    [refresh],
  )

  const removeProject = useCallback(
    async (project: Project) => {
      await deleteProject(project.id)
      await refresh()
    },
    [refresh],
  )

  const value = useMemo(
    () => ({
      projects,
      loading,
      error,
      refresh,
      addProject,
      editProject,
      removeProject,
    }),
    [projects, loading, error, refresh, addProject, editProject, removeProject],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider')
  return ctx
}
