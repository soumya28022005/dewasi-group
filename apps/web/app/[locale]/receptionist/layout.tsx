"use client";

import { useEffect, useState } from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Menu,
  X,
  LogOut,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/receptionist/dashboard", label: "My Doctors", icon: LayoutDashboard, exact: true },
  { href: "/receptionist/queue", label: "Live Queue", icon: ClipboardList },
  { href: "/receptionist/patients", label: "Patients", icon: Users },
];

function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
    </div>
  );
}

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isReceptionist = user?.role === "RECEPTIONIST";

  useEffect(() => {
    if (!loading && (!user || !isReceptionist)) {
      router.push("/login");
    }
  }, [loading, user, isReceptionist, router]);

  if (loading || !user || !isReceptionist) {
    return <LoadingSpinner />;
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-soft-300 dark:bg-surface md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden dark:text-ink-500 dark:hover:bg-soft-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-sm">
              <Stethoscope className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-primary-dark-text)]">
                {user.name}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-ink-400">
                Receptionist
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-soft-300 dark:text-ink-600 dark:hover:bg-soft-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 border-r border-gray-200 p-4 md:block dark:border-soft-300">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--color-bg-soft)] text-[var(--color-primary-text)]"
                      : "text-gray-600 hover:bg-gray-50 dark:text-ink-600 dark:hover:bg-soft-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-20 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="absolute left-0 top-0 h-full w-64 space-y-1 bg-white p-4 pt-20 shadow-xl dark:bg-surface">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[var(--color-bg-soft)] text-[var(--color-primary-text)]"
                        : "text-gray-600 hover:bg-gray-50 dark:text-ink-600 dark:hover:bg-soft-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}