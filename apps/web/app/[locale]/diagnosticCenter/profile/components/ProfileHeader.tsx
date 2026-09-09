"use client";

import { useTranslations } from "next-intl";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

interface ProfileHeaderProps {
  isApproved?: boolean;
  isFetching?: boolean;
  onRefresh: () => void;
}

export function ProfileHeader({
  isApproved,
  isFetching,
  onRefresh,
}: ProfileHeaderProps) {
  const t = useTranslations("DiagnosticCenterProfile");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
            {t("title")}
          </h1>

          {isApproved !== undefined && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                isApproved
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              )}
              <span>{isApproved ? t("verified") : t("unverified")}</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 sm:self-auto dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
        />
        <span>{t("retry")}</span>
      </button>
    </div>
  );
}
