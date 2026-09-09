"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReferralPaginationProps {
  page: number;
  returnedCount: number;
  limit: number;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
}

export function ReferralPagination({
  page,
  returnedCount,
  limit,
  isLoading,
  onPageChange,
}: ReferralPaginationProps) {
  const t = useTranslations("DiagnosticCenterReferrals");

  const hasPrevious = page > 1;
  const hasNext = returnedCount === limit;

  if (!hasPrevious && !hasNext) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <span className="font-medium text-slate-500 dark:text-slate-400">
        {t("page")} <span className="font-bold text-slate-900 dark:text-slate-100">{page}</span>
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious || isLoading}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{t("previous")}</span>
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext || isLoading}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span>{t("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
