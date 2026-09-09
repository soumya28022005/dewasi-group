"use client";

import { useTranslations } from "next-intl";
import { UserPlus, RefreshCw } from "lucide-react";

interface StaffHeaderProps {
  onAddStaff: () => void;
  isFetching?: boolean;
  onRefresh: () => void;
}

export function StaffHeader({
  onAddStaff,
  isFetching,
  onRefresh,
}: StaffHeaderProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
          {t("title")}
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
          />
          <span>{t("retry")}</span>
        </button>

        <button
          type="button"
          onClick={onAddStaff}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{t("addStaff")}</span>
        </button>
      </div>
    </div>
  );
}
