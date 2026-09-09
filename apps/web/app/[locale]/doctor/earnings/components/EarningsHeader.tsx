"use client";

import { TrendingUp, RefreshCw } from "lucide-react";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface EarningsHeaderProps {
  totalEarnings: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function EarningsHeader({
  totalEarnings,
  onRefresh,
  isRefreshing,
}: EarningsHeaderProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#059669]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Practice Earnings & Analytics
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400">
              ₹{totalEarnings.toLocaleString()} Net Revenue
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track consultation fee revenue, patient volume trends, and clinic-wise financial performance.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50"
            title="Refresh Earnings Data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </GradientCard>
  );
}
