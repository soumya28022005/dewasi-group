"use client";

import { useTranslations } from "next-intl";
import { Users, UserPlus } from "lucide-react";

interface StaffEmptyStateProps {
  onAddStaff: () => void;
}

export function StaffEmptyState({ onAddStaff }: StaffEmptyStateProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
        <Users className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        {t("noStaffTitle")}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        {t("noStaffDesc")}
      </p>

      <div className="mt-6">
        <button
          type="button"
          onClick={onAddStaff}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <UserPlus className="h-4 w-4" />
          <span>{t("addFirstStaff")}</span>
        </button>
      </div>
    </div>
  );
}
