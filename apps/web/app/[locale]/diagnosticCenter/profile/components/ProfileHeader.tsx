"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

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
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
      {/* Subtle top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6]" />

      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Left */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-sm">
              <ShieldCheck className="h-[17px] w-[17px]" />
            </div>

            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">
              {t("title")}
            </h1>

            {/* Approval Status */}
            {isApproved !== undefined && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                  isApproved
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {isApproved ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}

                <span>
                  {isApproved ? t("verified") : t("unverified")}
                </span>
              </span>
            )}
          </div>

          {/* Subtitle */}
          <p className="mt-1.5 max-w-2xl pl-0 text-[11px] leading-relaxed text-slate-500 sm:text-xs dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          aria-label={t("retry")}
          className="group inline-flex h-9 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#3b4a8f]/30 hover:bg-[#252a67] hover:text-white hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-center dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-[#3b4a8f] dark:hover:bg-[#252a67] dark:hover:text-white"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 transition-transform ${
              isFetching
                ? "animate-spin text-[#14B8A6]"
                : "group-hover:rotate-180"
            }`}
          />

          <span>{isFetching ? "Refreshing..." : t("retry")}</span>
        </button>
      </div>
    </div>
  );
}