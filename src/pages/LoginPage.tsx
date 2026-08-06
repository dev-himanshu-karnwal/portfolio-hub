import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const {
    user,
    profile,
    loading,
    error: authError,
    signIn,
    sendMagicLink,
    completeMagicLink,
    isMagicLink,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isMagicLink()) return
    const stored = window.localStorage.getItem('emailForSignIn') || ''
    setEmail(stored)
    setMode('magic')
    if (stored) {
      setBusy(true)
      completeMagicLink(stored)
        .catch((err) => setError(err instanceof Error ? err.message : 'Magic link failed'))
        .finally(() => setBusy(false))
    }
  }, [isMagicLink, completeMagicLink])

  if (!loading && user && profile) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      if (mode === 'password') {
        await signIn(email.trim(), password)
      } else if (isMagicLink() && email) {
        await completeMagicLink(email.trim())
      } else {
        await sendMagicLink(email.trim())
        setMessage('Check your email for the sign-in link.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white shadow-lg">
            <Sparkles size={24} />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Portfolio Hub
          </h1>
          <p className="mt-2 text-muted">
            Sign in with your company account. No public signup.
          </p>
        </div>

        <form
          onSubmit={(e) => void onSubmit(e)}
          className="rounded-2xl border border-line bg-surface p-6 shadow-xl shadow-ink/5"
        >
          <div className="mb-4 flex rounded-lg border border-line bg-canvas p-1">
            <button
              type="button"
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                mode === 'password' ? 'bg-surface text-ink shadow-sm' : 'text-muted'
              }`}
              onClick={() => setMode('password')}
            >
              Email & Password
            </button>
            <button
              type="button"
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                mode === 'magic' ? 'bg-surface text-ink shadow-sm' : 'text-muted'
              }`}
              onClick={() => setMode('magic')}
            >
              Magic Link
            </button>
          </div>

          <label className="mb-3 block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Email</span>
            <div className="relative">
              <Mail size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface py-2.5 pr-3 pl-10 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
          </label>

          {mode === 'password' && (
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Password</span>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface py-2.5 pr-3 pl-10 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </label>
          )}

          {(error || authError) && (
            <div className="mb-4 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger">
              {error || authError}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-sm text-accent">
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={busy} size="lg">
            {busy
              ? 'Please wait…'
              : mode === 'password'
                ? 'Sign in'
                : isMagicLink()
                  ? 'Complete sign-in'
                  : 'Send magic link'}
          </Button>
        </form>
      </div>
    </div>
  )
}
