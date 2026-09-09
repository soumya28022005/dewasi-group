"use client";

import { useTranslations } from "next-intl";
import { RefreshCw, FileText } from "lucide-react";
import { ReferralExportButton } from "./ReferralExportButton";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

interface ReferralHeaderProps {
  page: number;
  count: number;
  referrals: DiagnosticCenterIncomingReferral[];
  isFetching?: boolean;
  onRefresh: () => void;
}

export function ReferralHeader({
  page,
  count,
  referrals,
  isFetching,
  onRefresh,
}: ReferralHeaderProps) {
  const t = useTranslations("DiagnosticCenterReferrals");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
            {t("title")}
          </h1>

          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            <FileText className="h-3.5 w-3.5" />
            <span>
              {t("page")} {page} ({count})
            </span>
          </span>
        </div>

        <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {t("description")}
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <ReferralExportButton referrals={referrals} />

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
          />
          <span>{t("retry")}</span>
        </button>
      </div>
    </div>
  );
}
