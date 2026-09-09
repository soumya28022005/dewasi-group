"use client";

import { RefreshCw, UserCheck } from "lucide-react";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ProfileHeaderProps {
  name: string;
  role: string;
  isRefreshing?: boolean;
  onRefresh: () => void;
}

export function ProfileHeader({
  name,
  role,
  isRefreshing = false,
  onRefresh,
}: ProfileHeaderProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Doctor Profile
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/30">
              <UserCheck className="h-3.5 w-3.5" />
              Verified {role}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View your verified medical practice credentials, contact details, and account profile settings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            title="Refresh Profile Info"
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
