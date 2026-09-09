"use client";

import { useTranslations } from "next-intl";
import { Building2, Users, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export function DashboardQuickActions() {
  const t = useTranslations("DiagnosticCenterDashboard");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {t("quickActions")}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Edit Profile Action */}
        <Link
          href="/diagnosticCenter/profile"
          className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                {t("editProfile")}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t("editProfileDesc")}
              </p>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
        </Link>

        {/* Manage Staff Action */}
        <Link
          href="/diagnosticCenter/staff"
          className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-purple-200 hover:bg-purple-50/40 dark:border-slate-800 dark:hover:border-purple-900/50 dark:hover:bg-purple-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-950/60 dark:text-purple-400 dark:group-hover:bg-purple-600 dark:group-hover:text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 transition group-hover:text-purple-600 dark:text-slate-100 dark:group-hover:text-purple-400">
                {t("manageStaff")}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t("manageStaffDesc")}
              </p>
            </div>
          </div>

          <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-purple-600 dark:text-slate-500 dark:group-hover:text-purple-400" />
        </Link>
      </div>
    </div>
  );
}
