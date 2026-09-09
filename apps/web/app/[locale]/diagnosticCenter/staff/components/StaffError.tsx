"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw } from "lucide-react";

interface StaffErrorProps {
  onRetry: () => void;
  message?: string;
}

export function StaffError({ onRetry, message }: StaffErrorProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h3 className="mt-3 text-sm font-bold text-rose-900 dark:text-rose-200">
        {t("errorTitle")}
      </h3>

      <p className="mx-auto mt-1 max-w-md text-xs text-rose-700 dark:text-rose-300">
        {message || t("errorDesc")}
      </p>

      <div className="mt-4">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{t("retry")}</span>
        </button>
      </div>
    </div>
  );
}
