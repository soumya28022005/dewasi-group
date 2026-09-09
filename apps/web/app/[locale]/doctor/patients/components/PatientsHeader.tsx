"use client";

import { Users, RefreshCw } from "lucide-react";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface PatientsHeaderProps {
  totalPatients: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function PatientsHeader({
  totalPatients,
  onRefresh,
  isRefreshing,
}: PatientsHeaderProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#059669]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Users className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Patient Consultation Records
            </h1>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {totalPatients} {totalPatients === 1 ? "Patient" : "Patients"} Treated
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View past patient records, contact info, total consultations, and last visit details across your linked practice clinics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50"
            title="Refresh Patient Records"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin text-blue-600 dark:text-blue-400" : ""
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </GradientCard>
  );
}
