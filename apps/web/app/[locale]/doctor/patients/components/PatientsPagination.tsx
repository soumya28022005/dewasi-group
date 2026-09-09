"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PatientsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PatientsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PatientsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <span className="text-xs text-slate-600 dark:text-slate-400">
        Page <strong className="font-semibold text-slate-900 dark:text-white">{currentPage}</strong> of{" "}
        <strong className="font-semibold text-slate-900 dark:text-white">{totalPages}</strong>
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
