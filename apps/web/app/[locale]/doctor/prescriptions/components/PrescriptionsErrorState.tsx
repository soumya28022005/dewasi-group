"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface PrescriptionsErrorStateProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export function PrescriptionsErrorState({
  onRetry,
  isRetrying = false,
}: PrescriptionsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center transition-colors dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        Unable to Load Prescriptions
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-slate-600 dark:text-slate-400">
        We encountered an issue fetching your digital prescription history. Please check your network connection and try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
