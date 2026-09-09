"use client";

import { useTranslations, useLocale } from "next-intl";
import { Users, UserCheck, UserX, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface StaffSummaryCardProps {
  staffList: DiagnosticCenterStaff[] | undefined;
}

export function StaffSummaryCard({ staffList = [] }: StaffSummaryCardProps) {
  const t = useTranslations("DiagnosticCenterDashboard");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const total = staffList.length;
  const active = staffList.filter((s) => {
    if (s.isActive !== undefined) return s.isActive;
    if (s.user?.isActive !== undefined) return s.user.isActive;
    return true; // default true if not specified
  }).length;
  const inactive = total - active;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t("staffSummary")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("manageStaffDesc")}
          </p>
        </div>

        <Link
          href="/diagnosticCenter/staff"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>{t("manageStaff")}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total Staff */}
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t("totalStaff")}
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {total.toLocaleString(localeCode)}
            </p>
          </div>
        </div>

        {/* Active Staff */}
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t("activeStaff")}
            </span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {active.toLocaleString(localeCode)}
            </p>
          </div>
        </div>

        {/* Inactive Staff */}
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t("inactiveStaff")}
            </span>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {inactive.toLocaleString(localeCode)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
