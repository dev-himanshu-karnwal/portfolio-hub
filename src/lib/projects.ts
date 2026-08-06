import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import { normalizeStringList } from './constants'
import type { AppUser, Project, ProjectInput, UserRole } from '../types'

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate()
  if (value instanceof Date) return value
  return new Date()
}

function isFigmaUrl(value: string | null | undefined): boolean {
  return Boolean(value && /figma\.com/i.test(value))
}

function mapProject(id: string, data: Record<string, unknown>): Project {
  const rawUrl = (data.url as string | null) ?? null
  const rawFigma = (data.figma_url as string | null) ?? null
  // Legacy: single `url` held either live or Figma
  const url = rawUrl && !isFigmaUrl(rawUrl) ? rawUrl : null
  const figma_url = rawFigma || (rawUrl && isFigmaUrl(rawUrl) ? rawUrl : null)
  const case_study_url = (data.case_study_url as string | null) ?? null

  return {
    id,
    name: String(data.name ?? ''),
    url,
    figma_url,
    description: String(data.description ?? ''),
    tech_stack: (data.tech_stack as string[]) ?? [],
    domain: (data.domain as string[]) ?? [],
    project_type: normalizeStringList(data.project_type, true),
    visibility: normalizeStringList(data.visibility),
    has_live_url: Boolean(url),
    has_figma: Boolean(figma_url),
    has_case_study: Boolean(case_study_url) || Boolean(data.has_case_study),
    case_study_url,
    tags: (data.tags as string[]) ?? [],
    notes: (data.notes as string | null) ?? null,
    created_at: toDate(data.created_at),
    updated_at: toDate(data.updated_at),
    created_by: String(data.created_by ?? ''),
  }
}

function deriveFlags(input: ProjectInput) {
  const url = input.url?.trim() || null
  const figmaUrl = input.figma_url?.trim() || null
  const caseStudy = input.case_study_url?.trim() || null
  return {
    url,
    figma_url: figmaUrl,
    case_study_url: caseStudy,
    has_live_url: Boolean(url),
    has_figma: Boolean(figmaUrl),
    has_case_study: Boolean(caseStudy) || Boolean(input.has_case_study),
  }
}

export async function fetchAllProjects(): Promise<Project[]> {
  const q = query(collection(db, 'projects'), orderBy('updated_at', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => mapProject(d.id, d.data()))
}

export async function createProject(
  input: ProjectInput,
  uid: string,
): Promise<string> {
  const flags = deriveFlags(input)
  const docRef = await addDoc(collection(db, 'projects'), {
    name: input.name.trim(),
    description: input.description.trim(),
    tech_stack: input.tech_stack,
    domain: input.domain,
    project_type: input.project_type,
    visibility: input.visibility,
    tags: input.tags,
    notes: input.notes?.trim() || null,
    ...flags,
    created_by: uid,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  return docRef.id
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  const flags = deriveFlags(input)
  await updateDoc(doc(db, 'projects', id), {
    name: input.name.trim(),
    description: input.description.trim(),
    tech_stack: input.tech_stack,
    domain: input.domain,
    project_type: input.project_type,
    visibility: input.visibility,
    tags: input.tags,
    notes: input.notes?.trim() || null,
    ...flags,
    updated_at: serverTimestamp(),
  })
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id))
}

export async function fetchAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      uid: d.id,
      email: String(data.email ?? ''),
      displayName: String(data.displayName ?? ''),
      role: data.role as UserRole,
      createdAt: toDate(data.createdAt),
    }
  })
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role })
}

export async function createUserProfile(input: {
  uid: string
  email: string
  displayName: string
  role: UserRole
}): Promise<void> {
  await setDoc(doc(db, 'users', input.uid), {
    uid: input.uid,
    email: input.email.trim(),
    displayName: input.displayName.trim(),
    role: input.role,
    createdAt: serverTimestamp(),
  })
}
