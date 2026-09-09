"use client";

import { Users, FilterX, RotateCcw } from "lucide-react";

interface PatientsEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function PatientsEmptyState({
  hasActiveFilters,
  onClearFilters,
}: PatientsEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <FilterX className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No matching patients found
        </h3>

        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          No patient records match your current search query or active clinic filter.
        </p>

        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Search & Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        <Users className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        No Patient Records Yet
      </h3>

      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        You have no recorded patient consultations yet. Once you complete queue appointments at your associated clinics, patient history will automatically appear here.
      </p>
    </div>
  );
}
