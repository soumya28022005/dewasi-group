"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  AlertCircle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

interface DashboardErrorProps {
  onRetry: () => void;
  message?: string;
}

export function DashboardError({
  onRetry,
  message,
}: DashboardErrorProps) {
  const t = useTranslations("DiagnosticCenterDashboard");

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

      <div className="rounded-[14px] bg-white px-5 py-10 sm:px-8 sm:py-12 dark:bg-slate-900">

        {/* ======================================================
            ERROR ICON
        ======================================================= */}

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30">

          <AlertCircle className="h-7 w-7 text-rose-500 dark:text-rose-400" />

        </div>


        {/* ======================================================
            TITLE
        ======================================================= */}

        <h3 className="mt-4 text-center text-base font-bold tracking-tight text-slate-950 sm:text-lg dark:text-white">
          {t("errorTitle")}
        </h3>


        {/* ======================================================
            DESCRIPTION
        ======================================================= */}

        <p className="mx-auto mt-2 max-w-md text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs dark:text-slate-400">
          {message || t("errorDesc")}
        </p>


        {/* ======================================================
            RETRY BUTTON
        ======================================================= */}

        <div className="mt-5 flex justify-center">

          <button
            type="button"
            onClick={onRetry}
            className="group inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-4 text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(37,42,103,0.16)] transition-all duration-200 hover:shadow-[0_5px_16px_rgba(37,42,103,0.22)] active:scale-[0.98]"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />

            <span>
              {t("retry")}
            </span>

          </button>

        </div>


        {/* ======================================================
            SECURITY / SYSTEM NOTE
        ======================================================= */}

        <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">

          <ShieldAlert className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />

          <span className="text-center text-[8.5px] font-medium text-slate-400 dark:text-slate-500">
            Please try again. Your dashboard data has not been changed.
          </span>

        </div>

      </div>
    </section>
  );
}