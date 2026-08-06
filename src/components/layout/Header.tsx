import { Link, useNavigate } from 'react-router-dom'
import { LayoutGrid, LogOut, Shield, FolderKanban } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'

export function Header() {
  const { profile, signOut, canManageUsers, canEdit } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <FolderKanban size={18} />
          </span>
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-tight text-ink">
              Portfolio Hub
            </div>
            <div className="hidden text-[11px] text-muted sm:block">Project library</div>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => navigate('/?new=1')}
            >
              Add Project
            </Button>
          )}

          {canManageUsers && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted hover:bg-canvas hover:text-ink sm:inline-flex"
            >
              <Shield size={15} />
              Admin
            </Link>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted hover:bg-canvas hover:text-ink"
          >
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">Browse</span>
          </Link>

          <div className="hidden items-center gap-2 border-l border-line pl-3 md:flex">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium text-ink">
                {profile?.displayName || profile?.email}
              </div>
              <div className="text-[11px] capitalize text-muted">{profile?.role}</div>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink md:hidden"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
