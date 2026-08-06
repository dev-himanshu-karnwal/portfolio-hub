import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, LogOut, Shield, FolderKanban } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

function NavLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-3 ${
        active
          ? "bg-accent/10 text-accent"
          : "text-muted hover:bg-canvas hover:text-ink"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

export function Header() {
  const { profile, signOut, canManageUsers } = useAuth();
  const location = useLocation();
  const isBrowse = location.pathname === "/";
  const isAdmin = location.pathname === "/admin";

  const initials = (profile?.displayName || profile?.email || "?")
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 glass">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 shrink-0 group sm:gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ink to-ink-soft text-white shadow-sm transition group-hover:shadow-md sm:h-10 sm:w-10">
            <FolderKanban size={18} />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="font-display text-sm font-bold tracking-tight text-ink sm:text-base">
              Portfolio Hub
            </div>
            <div className="hidden text-[11px] text-muted sm:block">
              Project library
            </div>
          </div>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
          <NavLink
            to="/"
            icon={<LayoutGrid size={15} />}
            label="Browse"
            active={isBrowse}
          />

          {canManageUsers && (
            <NavLink
              to="/admin"
              icon={<Shield size={15} />}
              label="Users"
              active={isAdmin}
            />
          )}

          <div className="ml-1 hidden items-center gap-2.5 border-l border-line pl-3 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
              {initials}
            </div>
            <div className="text-right leading-tight">
              <div className="max-w-[140px] truncate text-sm font-medium text-ink">
                {profile?.displayName || profile?.email}
              </div>
              <div className="text-[11px] capitalize text-muted">
                {profile?.role}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink md:hidden"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </nav>
      </div>
    </header>
  );
}
