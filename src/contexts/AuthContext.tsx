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
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { AppUser, UserRole } from '../types'

interface AuthContextValue {
  user: User | null
  profile: AppUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  sendMagicLink: (email: string) => Promise<void>
  completeMagicLink: (email: string) => Promise<void>
  isMagicLink: () => boolean
  signOut: () => Promise<void>
  isAdmin: boolean
  isEditor: boolean
  canEdit: boolean
  canManageUsers: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadProfile(user: User): Promise<AppUser> {
  const snap = await getDoc(doc(db, 'users', user.uid))
  if (!snap.exists()) {
    throw new Error(
      'Account not provisioned. Ask an admin to add your user document in Firestore.',
    )
  }
  const data = snap.data()
  return {
    uid: user.uid,
    email: String(data.email ?? user.email ?? ''),
    displayName: String(data.displayName ?? user.displayName ?? ''),
    role: data.role as UserRole,
    createdAt:
      data.createdAt?.toDate?.() instanceof Date
        ? data.createdAt.toDate()
        : new Date(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let signingOutAfterProfileError = false
    const unsub = onAuthStateChanged(auth, async (next) => {
      setLoading(true)
      try {
        if (!next) {
          setUser(null)
          setProfile(null)
          // Keep profile-load errors visible after forced sign-out
          if (!signingOutAfterProfileError) setError(null)
          signingOutAfterProfileError = false
          return
        }
        setError(null)
        const p = await loadProfile(next)
        setUser(next)
        setProfile(p)
      } catch (err) {
        setUser(null)
        setProfile(null)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
        signingOutAfterProfileError = true
        await firebaseSignOut(auth)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const sendMagicLink = useCallback(async (email: string) => {
    const actionCodeSettings = {
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    }
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    window.localStorage.setItem('emailForSignIn', email)
  }, [])

  const completeMagicLink = useCallback(async (email: string) => {
    await signInWithEmailLink(auth, email, window.location.href)
    window.localStorage.removeItem('emailForSignIn')
  }, [])

  const isMagicLink = useCallback(() => isSignInWithEmailLink(auth, window.location.href), [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
    setProfile(null)
  }, [])

  const role = profile?.role
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      error,
      signIn,
      sendMagicLink,
      completeMagicLink,
      isMagicLink,
      signOut,
      isAdmin: role === 'admin',
      isEditor: role === 'editor',
      canEdit: role === 'admin' || role === 'editor',
      canManageUsers: role === 'admin',
    }),
    [
      user,
      profile,
      loading,
      error,
      signIn,
      sendMagicLink,
      completeMagicLink,
      isMagicLink,
      signOut,
      role,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
