"use client";

import { TrendingUp, CalendarX } from "lucide-react";

interface EarningsEmptyStateProps {
  selectedPeriod: string;
}

export function EarningsEmptyState({ selectedPeriod }: EarningsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <TrendingUp className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        No Earnings Recorded for {selectedPeriod}
      </h3>

      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        There are no completed patient consultation records for the selected time period. Consultation revenue is automatically tracked as appointments are completed in your clinic queues.
      </p>
    </div>
  );
}
