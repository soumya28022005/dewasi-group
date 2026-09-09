"use client";

import { Building2, RefreshCw } from "lucide-react";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ClinicInfo {
  id: string;
  name: string;
  city?: string | null;
  address?: string | null;
}

interface ScheduleHeaderProps {
  selectedClinic?: ClinicInfo;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function ScheduleHeader({
  selectedClinic,
  onRefresh,
  isRefreshing = false,
}: ScheduleHeaderProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Schedule & Availability
            </h1>
            {selectedClinic && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/30">
                <Building2 className="h-3.5 w-3.5" />
                {selectedClinic.name}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your consultation timing, planned leave dates, and notify clinics of expected schedule delays.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            title="Refresh Schedule Data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </GradientCard>
  );
}
