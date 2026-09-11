"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface DashboardHeaderProps {
  centerName?: string;
  isApproved?: boolean;
  isFetching?: boolean;
  isOnline?: boolean;
  hasHomeService?: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  centerName,
  isApproved,
  isFetching,
  isOnline,
  hasHomeService,
  onRefresh,
}: DashboardHeaderProps) {
  const t = useTranslations("DiagnosticCenterDashboard");

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

      {/* =========================================================
          LEFT — PAGE IDENTITY
      ========================================================== */}

      <div className="min-w-0">

        {/* Eyebrow */}

        <div className="mb-1.5 flex items-center gap-2">

          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#252a67] to-[#14B8A6]" />

          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Diagnostic Center
          </span>

        </div>


        {/* Title + Center */}

        <div className="flex min-w-0 flex-wrap items-center gap-2">

          <h1 className="text-xl font-bold tracking-[-0.02em] text-slate-950 sm:text-2xl dark:text-white">
            {t("title")}
          </h1>

          {centerName && (
            <div className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">

              <Building2 className="h-3 w-3 shrink-0 text-[#3b4a8f] dark:text-teal-400" />

              <span className="max-w-[220px] truncate text-[10px] font-bold text-slate-600 dark:text-slate-300">
                {centerName}
              </span>

            </div>
          )}

        </div>


        {/* Subtitle */}

        <p className="mt-1.5 max-w-2xl text-[11px] leading-relaxed text-slate-500 sm:text-xs dark:text-slate-400">
          {t("subtitle")}
        </p>


        {/* =======================================================
            STATUS ROW
        ======================================================== */}

        <div className="mt-3 flex flex-wrap items-center gap-2">

          {/* Approval */}

          {isApproved !== undefined && (
            <span
              className={
                isApproved
                  ? "inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
              }
            >
              {isApproved ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Clock3 className="h-3 w-3" />
              )}

              <span>
                {isApproved
                  ? t("approved")
                  : t("pendingApproval")}
              </span>
            </span>
          )}


          {/* Online status */}

          {isOnline !== undefined && (
            <span
              className={
                isOnline
                  ? "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                  : "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
              }
            >
              <span
                className={
                  isOnline
                    ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                    : "h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"
                }
              />

              <span>
                {isOnline ? "Online" : "Offline"}
              </span>
            </span>
          )}


          {/* Home service */}

          {hasHomeService !== undefined && hasHomeService && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">

              <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />

              <span>
                Home Service
              </span>

            </span>
          )}

        </div>

      </div>


      {/* =========================================================
          RIGHT — REFRESH ACTION
      ========================================================== */}

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        aria-label={t("refresh")}
        className="group inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
      >

        <RefreshCw
          className={
            isFetching
              ? "h-3.5 w-3.5 animate-spin text-[#3b4a8f] dark:text-teal-400"
              : "h-3.5 w-3.5 text-slate-400 transition-transform duration-300 group-hover:rotate-180 dark:text-slate-500"
          }
        />

        <span>
          {isFetching ? "Updating..." : t("refresh")}
        </span>

      </button>

    </header>
  );
}