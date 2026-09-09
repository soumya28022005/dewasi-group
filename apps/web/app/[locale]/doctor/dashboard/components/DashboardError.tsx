"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardErrorProps {
  onRetry: () => void;
  message?: string;
}

export function DashboardError({ onRetry, message }: DashboardErrorProps) {
  const t = useTranslations("DoctorDashboard");

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center shadow-xs dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        {t("errorTitle")}
      </h2>

      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
        {message || "An unexpected error occurred while fetching your doctor metrics. Please try again."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {t("retry")}
      </button>
    </div>
  );
}
