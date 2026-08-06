export type UserRole = 'admin' | 'editor' | 'viewer'

export interface Project {
  id: string
  name: string
  url: string | null
  figma_url: string | null
  description: string
  tech_stack: string[]
  domain: string[]
  project_type: string[]
  visibility: string[]
  has_live_url: boolean
  has_figma: boolean
  has_case_study: boolean
  case_study_url: string | null
  tags: string[]
  notes: string | null
  created_at: Date
  updated_at: Date
  created_by: string
}

export type ProjectInput = Omit<
  Project,
  'id' | 'created_at' | 'updated_at' | 'created_by' | 'has_live_url' | 'has_figma' | 'has_case_study'
> & {
  has_live_url?: boolean
  has_figma?: boolean
  has_case_study?: boolean
}

export interface AppUser {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: Date
}

export type ViewMode = 'grid' | 'table'

export interface FilterState {
  search: string
  techStack: string[]
  domain: string[]
  projectType: string[]
  visibility: string[]
  view: ViewMode
}
