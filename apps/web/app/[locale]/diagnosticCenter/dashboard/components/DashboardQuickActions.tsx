"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

export function DashboardQuickActions() {
  const t = useTranslations("DiagnosticCenterDashboard");

  const actions = [
    {
      href: "/diagnosticCenter/profile",
      title: t("editProfile"),
      description: t("editProfileDesc"),
      icon: Building2,
    },
    {
      href: "/diagnosticCenter/staff",
      title: t("manageStaff"),
      description: t("manageStaffDesc"),
      icon: Users,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-5 dark:border-slate-800 dark:bg-slate-900">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-950 sm:text-base dark:text-white">
            {t("quickActions")}
          </h2>

          <div className="mt-1 h-[2px] w-7 rounded-full bg-gradient-to-r from-[#252a67] to-[#14B8A6]" />
        </div>

        <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          Actions
        </span>

      </div>


      {/* =========================================================
          ACTIONS
      ========================================================== */}

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">

        {actions.map(
          ({
            href,
            title,
            description,
            icon: Icon,
          }) => (
            <Link
              key={href}
              href={href}
              className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/40 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
            >

              {/* =================================================
                  TOP ACCENT
              ================================================== */}

              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />


              <div className="flex items-center gap-3">

                {/* =================================================
                    ICON
                ================================================== */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200/80 transition-all duration-200 group-hover:bg-gradient-to-br group-hover:from-[#252a67] group-hover:to-[#3b4a8f] group-hover:ring-transparent dark:bg-slate-900 dark:ring-slate-700 dark:group-hover:from-[#252a67] dark:group-hover:to-[#14B8A6]">

                  <Icon className="h-[17px] w-[17px] text-[#3b4a8f] transition-colors duration-200 group-hover:text-white dark:text-slate-400 dark:group-hover:text-white" />

                </div>


                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="min-w-0 flex-1">

                  <p className="truncate text-[11px] font-bold text-slate-900 transition-colors duration-150 group-hover:text-[#252a67] dark:text-slate-100 dark:group-hover:text-teal-400">
                    {title}
                  </p>

                  <p className="mt-0.5 line-clamp-1 text-[9.5px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {description}
                  </p>

                </div>


                {/* =================================================
                    ARROW
                ================================================== */}

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all duration-200 group-hover:border-[#3b4a8f]/20 group-hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:group-hover:border-teal-500/20 dark:group-hover:bg-slate-800">

                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#252a67] dark:text-slate-500 dark:group-hover:text-teal-400" />

                </div>

              </div>

            </Link>
          )
        )}

      </div>

    </section>
  );
}