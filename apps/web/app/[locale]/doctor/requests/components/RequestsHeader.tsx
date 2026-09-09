"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface RequestsHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenSendModal: () => void;
  pendingReceivedCount?: number;
}

export function RequestsHeader({
  onRefresh,
  isRefreshing = false,
  onOpenSendModal,
  pendingReceivedCount = 0,
}: RequestsHeaderProps) {
  const t = useTranslations("DoctorRequests");

  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#4f46e5]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {t("title")}
            </h1>
            {pendingReceivedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30">
                {pendingReceivedCount} {t("actionRequired")}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            title="Refresh Requests"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>{t("refresh")}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSendModal}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 text-xs font-bold text-white shadow-md shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{t("newRequestToClinic")}</span>
          </button>
        </div>
      </div>
    </GradientCard>
  );
}
