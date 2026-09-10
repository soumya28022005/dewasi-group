"use client";

import { useTranslations } from "next-intl";
import {
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface ProfileErrorProps {
  onRetry: () => void;
  message?: string;
}

export function ProfileError({ onRetry, message }: ProfileErrorProps) {
  const t = useTranslations("DiagnosticCenterProfile");

  return (
    <section className="group relative rounded-3xl bg-gradient-to-br from-rose-400 via-rose-500 to-orange-500 p-[3px] shadow-[0_8px_30px_-12px_rgba(244,63,94,0.35)] transition-all duration-300 hover:shadow-[0_16px_50px_-12px_rgba(244,63,94,0.45)]">
      <div className="relative overflow-hidden rounded-[calc(1.5rem-3px)] bg-white dark:bg-slate-900">
        {/* =====================================================
            DECORATIVE GLOWS
        ====================================================== */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-rose-500/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-500/[0.06] blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(244,63,94,.8) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative px-5 py-10 sm:px-8 sm:py-12">
          {/* =====================================================
              ERROR ICON
          ====================================================== */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-50 via-rose-100 to-orange-50 ring-1 ring-rose-200/70 shadow-md shadow-rose-500/10 dark:from-rose-950/40 dark:via-rose-900/30 dark:to-orange-950/30 dark:ring-rose-900/50">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-sm">
              <ShieldAlert className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              </span>
            </div>
          </div>

          {/* =====================================================
              CONTENT
          ====================================================== */}

          <div className="mx-auto mt-6 max-w-md text-center">
            {/* Label pill */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 dark:border-rose-900/50 dark:bg-rose-950/30">
              <AlertCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
              <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-400">
                Error
              </span>
            </div>

            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
              {t("errorTitle")}
            </h3>

            <p className="mt-2.5 text-[11px] leading-relaxed text-slate-500 sm:text-xs dark:text-slate-400">
              {message || t("errorDesc")}
            </p>
          </div>

          {/* =====================================================
              RETRY BUTTON
          ====================================================== */}

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={onRetry}
              className="group/btn inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] px-6 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-md shadow-[#252a67]/25 transition-all duration-200 hover:shadow-lg hover:shadow-[#252a67]/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover/btn:rotate-180" />

              <span>{t("retry")}</span>

              <ArrowUpRight className="h-3.5 w-3.5 opacity-80 transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </button>
          </div>

          {/* =====================================================
              BOTTOM ACCENT
          ====================================================== */}

          <div className="mt-8 flex items-center justify-center gap-1.5">
            <span className="h-[2px] w-8 rounded-full bg-gradient-to-r from-transparent to-rose-400" />
            <Sparkles className="h-3 w-3 text-rose-400" />
            <span className="h-[2px] w-8 rounded-full bg-gradient-to-l from-transparent to-rose-400" />
          </div>
        </div>
      </div>
    </section>
  );
}