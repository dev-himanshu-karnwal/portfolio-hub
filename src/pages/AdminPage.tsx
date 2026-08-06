import { useEffect, useState, type FormEvent } from 'react'
import { createUserProfile, fetchAllUsers, updateUserRole } from '../lib/projects'
import type { AppUser, UserRole } from '../types'
import { ROLE_LABELS } from '../lib/constants'
import { useAuth } from '../contexts/AuthContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function AdminPage() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [form, setForm] = useState({
    uid: '',
    email: '',
    displayName: '',
    role: 'viewer' as UserRole,
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchAllUsers()
        if (!cancelled) setUsers(data.sort((a, b) => a.email.localeCompare(b.email)))
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load users')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function changeRole(uid: string, role: UserRole) {
    setSaving(uid)
    setError(null)
    try {
      await updateUserRole(uid, role)
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setSaving(null)
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError(null)
    try {
      await createUserProfile(form)
      setUsers((prev) =>
        [...prev, { ...form, createdAt: new Date() }].sort((a, b) =>
          a.email.localeCompare(b.email),
        ),
      )
      setForm({ uid: '', email: '', displayName: '', role: 'viewer' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user profile')
    } finally {
      setCreating(false)
    }
  }

  const field =
    'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

  return (
    <main className="mx-auto max-w-4xl px-3 py-5 sm:px-6 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Admin</h1>
        <p className="mt-1 text-sm text-muted">
          Manage teammate roles. Create the Auth user in Firebase Console first, then add their
          profile here using the Auth UID.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        {loading ? (
          <div className="px-5 py-10 text-center text-muted">Loading users…</div>
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="divide-y divide-line/70 sm:hidden">
              {users.map((u) => (
                <li key={u.uid} className="space-y-2 px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{u.displayName || '—'}</span>
                    {u.uid === profile?.uid && (
                      <Badge tone="demo">You</Badge>
                    )}
                  </div>
                  <div className="break-all text-sm text-muted">{u.email}</div>
                  <select
                    className="w-full rounded-lg border border-line bg-surface px-2.5 py-2 text-sm outline-none focus:border-accent"
                    value={u.role}
                    disabled={saving === u.uid || u.uid === profile?.uid}
                    onChange={(e) => void changeRole(u.uid, e.target.value as UserRole)}
                    title={
                      u.uid === profile?.uid
                        ? 'You cannot change your own role here'
                        : undefined
                    }
                  >
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-canvas/80 text-[11px] tracking-wider text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.uid} className="border-b border-line/70">
                      <td className="px-4 py-3 font-medium text-ink">
                        {u.displayName || '—'}
                        {u.uid === profile?.uid && (
                          <Badge tone="demo" className="ml-2">
                            You
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-accent"
                          value={u.role}
                          disabled={saving === u.uid || u.uid === profile?.uid}
                          onChange={(e) => void changeRole(u.uid, e.target.value as UserRole)}
                          title={
                            u.uid === profile?.uid
                              ? 'You cannot change your own role here'
                              : undefined
                          }
                        >
                          {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <form
        onSubmit={(e) => void onCreate(e)}
        className="mt-5 space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:mt-6 sm:p-5"
      >
        <h2 className="font-display text-base font-semibold text-ink">Add user profile</h2>
        <p className="text-sm text-muted">
          After creating the user under Authentication → Users, paste their UID here.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium">Auth UID</span>
            <input
              className={field}
              required
              value={form.uid}
              onChange={(e) => setForm((f) => ({ ...f, uid: e.target.value.trim() }))}
              placeholder="Firebase Auth UID"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input
              type="email"
              className={field}
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Display name</span>
            <input
              className={field}
              required
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Role</span>
            <select
              className={field}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
            >
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button type="submit" disabled={creating}>
          {creating ? 'Saving…' : 'Create profile'}
        </Button>
      </form>
    </main>
  )
}
