"use client";

import { FileText, FilterX, RotateCcw, Plus } from "lucide-react";

interface PrescriptionsEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
}

export function PrescriptionsEmptyState({
  hasActiveFilters,
  onClearFilters,
  onOpenCreateModal,
}: PrescriptionsEmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <FilterX className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No matching prescriptions
        </h3>

        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          No digital prescription records match your search query or clinic filter.
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
        <FileText className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        No Prescriptions Issued Yet
      </h3>

      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        You haven't generated any digital prescriptions yet. Create structured E-Rx documents with medication, dosage, and frequency instructions for your patients.
      </p>

      <button
        type="button"
        onClick={onOpenCreateModal}
        className="mt-5 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Issue First Prescription</span>
      </button>
    </div>
  );
}
