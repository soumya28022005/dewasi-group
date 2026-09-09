"use client";

import { Building2, CheckCircle2, Clock } from "lucide-react";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ProfileStatsProps {
  activeClinicsCount: number;
  acceptedAssociationsCount: number;
  pendingRequestsCount: number;
}

export function ProfileStats({
  activeClinicsCount,
  acceptedAssociationsCount,
  pendingRequestsCount,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Associated Clinics - Blue Gradient */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Associated Clinics
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 shadow-xs">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeClinicsCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Active Centers</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Connected practice hubs
          </p>
        </div>
      </GradientCard>

      {/* Accepted Associations - Emerald Gradient */}
      <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Approved Links
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {acceptedAssociationsCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Accepted Requests</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Verified affiliations
          </p>
        </div>
      </GradientCard>

      {/* Pending Requests - Amber Gradient */}
      <GradientCard gradient="from-[#f59e0b] via-[#f97316] to-[#fb7185]">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Pending Requests
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 shadow-xs">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {pendingRequestsCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Awaiting Action</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            In review queue
          </p>
        </div>
      </GradientCard>
    </div>
  );
}
