"use client";

import { Link } from "@/i18n/routing";
import { Building2, Inbox, RefreshCw } from "lucide-react";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ClinicsHeaderProps {
  activeClinicsCount: number;
  isRefreshing?: boolean;
  onRefresh: () => void;
}

export function ClinicsHeader({
  activeClinicsCount,
  isRefreshing = false,
  onRefresh,
}: ClinicsHeaderProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#0891b2]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              My Clinics
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/30">
              <Building2 className="h-3.5 w-3.5" />
              {activeClinicsCount} Active {activeClinicsCount === 1 ? "Clinic" : "Clinics"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overview of your connected medical centers, practice locations, and active consultation hubs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            title="Refresh Clinics Data"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isRefreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/doctor/requests"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 text-xs font-bold text-white shadow-md shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Inbox className="h-4 w-4" />
            <span>Manage Requests</span>
          </Link>
        </div>
      </div>
    </GradientCard>
  );
}
