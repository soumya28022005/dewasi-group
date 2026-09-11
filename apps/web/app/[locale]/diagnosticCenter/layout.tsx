"use client";

import { useEffect, useMemo } from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import {
  LayoutDashboard,
  Building2,
  Users,
  Inbox,
  ChevronRight,
  FlaskConical,
  TestTube,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLocale, useTranslations } from "next-intl";

const ALL_NAV = [
  {
    href: "/diagnosticCenter/dashboard",
    key: "dashboard",
    icon: LayoutDashboard,
    exact: true,
    ownerOnly: true,
  },
  {
    href: "/diagnosticCenter/profile",
    key: "profile",
    icon: Building2,
    ownerOnly: true,
  },
  {
    href: "/diagnosticCenter/schedule",
    key: "schedule",
    icon: Clock,
    ownerOnly: true,
  },
  {
    href: "/diagnosticCenter/staff",
    key: "staff",
    icon: Users,
    ownerOnly: true,
  },
  {
    href: "/diagnosticCenter/tests",
    key: "tests",
    icon: TestTube,
    ownerOnly: true,
  },
  {
    href: "/diagnosticCenter/referrals",
    key: "referrals",
    icon: Inbox,
    ownerOnly: false,
  },
];

export default function DiagnosticCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tNav = useTranslations("DiagnosticCenterNav");

  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isStaff = user?.role === "DIAGNOSTIC_STAFF";
  const isOwner = user?.role === "DIAGNOSTIC_CENTER";
  const isAuthorized = isOwner || isStaff;

  /* ============================================================
     AUTHENTICATION
  ============================================================ */

  useEffect(() => {
    if (!loading) {
      if (!user || !isAuthorized) {
        router.push("/login");
      } else if (isStaff) {
        router.push("/diagnosticStaff/dashboard");
      }
    }
  }, [loading, user, isAuthorized, isStaff, router]);

  /* ============================================================
     VISIBLE NAVIGATION
  ============================================================ */

  const visibleNav = useMemo(() => {
    if (isStaff) {
      return ALL_NAV.filter((item) => !item.ownerOnly);
    }

    return ALL_NAV;
  }, [isStaff]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading || !user || !isAuthorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-slate-200 border-t-[#252a67] dark:border-slate-800 dark:border-t-[#14B8A6]" />

            <FlaskConical className="h-4 w-4 text-[#252a67] dark:text-teal-400" />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Loading
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-[1440px] items-start gap-5 px-3 py-4 sm:px-5 sm:py-5 md:px-6 lg:gap-6 lg:px-8">

        {/* =========================================================
            DESKTOP SIDEBAR
        ========================================================== */}

        <aside className="hidden w-[232px] shrink-0 md:block lg:w-[248px]">
          <div className="sticky top-20">

            {/* =====================================================
                PORTAL HEADER
            ====================================================== */}

            <div className="mb-3 rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_4px_18px_rgba(37,42,103,0.12)]">

              <div className="rounded-[15px] bg-white dark:bg-slate-900">

                <div className="flex items-center gap-3 px-3.5 py-3.5">

                  {/* Logo */}

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-sm">
                    <FlaskConical className="h-[17px] w-[17px]" />
                  </div>

                  {/* Portal information */}

                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#14B8A6]">
                      {tNav("portalTitle")}
                    </p>

                    <p className="mt-0.5 truncate text-[12px] font-bold text-slate-900 dark:text-white">
                      {user.name || "Diagnostic Center"}
                    </p>
                  </div>

                </div>

                {/* Trust line */}

                <div className="flex items-center gap-1.5 border-t border-slate-100 px-3.5 py-2 dark:border-slate-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />

                  <span className="text-[8.5px] font-semibold text-slate-400 dark:text-slate-500">
                    Verified Diagnostic Partner
                  </span>
                </div>

              </div>
            </div>


            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <nav className="rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] dark:border-slate-800 dark:bg-slate-900">

              <div className="px-2.5 pb-2 pt-1.5">
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  Workspace
                </span>
              </div>

              <div className="space-y-0.5">

                {visibleNav.map(
                  ({ href, key, icon: Icon, exact }) => {
                    const active = exact
                      ? pathname === href
                      : pathname.startsWith(href);

                    return (
                      <Link
                        key={href}
                        href={href}
                        className="group block"
                      >
                        {active ? (

                          /* =================================================
                             ACTIVE
                          ================================================== */

                          <div className="rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] p-[1px] shadow-[0_4px_12px_rgba(37,42,103,0.14)]">

                            <div className="relative flex items-center gap-2.5 rounded-[10px] bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-2.5 py-2.5 text-white">

                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                                <Icon className="h-3.5 w-3.5" />
                              </span>

                              <span className="min-w-0 flex-1 truncate text-[11px] font-bold">
                                {tNav(key)}
                              </span>

                              <ChevronRight className="h-3 w-3 text-white/45" />

                            </div>

                          </div>

                        ) : (

                          /* =================================================
                             NORMAL
                          ================================================== */

                          <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white">

                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                              <Icon className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-[#252a67] dark:text-slate-400 dark:group-hover:text-teal-400" />
                            </span>

                            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">
                              {tNav(key)}
                            </span>

                            <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600" />

                          </div>

                        )}
                      </Link>
                    );
                  }
                )}

              </div>
            </nav>


            {/* =====================================================
                SECURITY STATUS
            ====================================================== */}

            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                  Secure workspace
                </span>

              </div>

              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-500">
                Active
              </span>

            </div>

          </div>
        </aside>


        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}

        <main className="min-w-0 flex-1 pb-24 md:pb-6">
          {children}
        </main>


        {/* =========================================================
            MOBILE BOTTOM NAVIGATION
        ========================================================== */}

        <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden">

          {/* Gradient border */}

          <div className="rounded-[18px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_6px_24px_rgba(15,23,42,0.16)]">

            <div className="rounded-[16px] bg-white/98 px-1 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl dark:bg-slate-950/98">

              <div className="flex items-center">

                {visibleNav.map(
                  ({ href, key, icon: Icon, exact }) => {

                    const active = exact
                      ? pathname === href
                      : pathname.startsWith(href);

                    return (
                      <Link
                        key={href}
                        href={href}
                        className="min-w-0 flex-1"
                      >

                        <div
                          className={`
                            relative mx-0.5
                            flex flex-col
                            items-center
                            justify-center
                            rounded-xl
                            px-1
                            py-1.5
                            transition-colors
                            duration-150
                            ${
                              active
                                ? "text-[#252a67] dark:text-teal-400"
                                : "text-slate-400 dark:text-slate-500"
                            }
                          `}
                        >

                          {/* Active background */}

                          {active && (
                            <span className="absolute inset-x-1 top-0 h-[34px] rounded-xl bg-slate-50 dark:bg-slate-900" />
                          )}

                          {/* Icon */}

                          <span className="relative z-10 flex h-7 w-7 items-center justify-center">

                            <Icon
                              className={`
                                h-[15px] w-[15px]
                                ${
                                  active
                                    ? "text-[#252a67] dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500"
                                }
                              `}
                            />

                          </span>

                          {/* Label */}

                          <span
                            className={`
                              relative z-10 mt-0.5
                              max-w-[65px]
                              truncate
                              text-[8.5px]
                              leading-none
                              ${
                                active
                                  ? "font-bold"
                                  : "font-medium"
                              }
                            `}
                          >
                            {tNav(key)}
                          </span>

                          {/* Active indicator */}

                          {active && (
                            <span className="absolute bottom-0 h-[2px] w-4 rounded-full bg-gradient-to-r from-[#252a67] to-[#14B8A6]" />
                          )}

                        </div>

                      </Link>
                    );
                  }
                )}

              </div>

            </div>

          </div>

        </nav>

      </div>
    </div>
  );
}