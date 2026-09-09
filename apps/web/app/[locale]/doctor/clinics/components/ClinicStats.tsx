"use client";

import { Building2, Clock, CheckCircle2, MapPin } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface ClinicStatsProps {
  activeClinicsCount: number;
  pendingRequestsCount: number;
  acceptedCount: number;
  connectedCitiesCount: number;
}

export function ClinicStats({
  activeClinicsCount,
  pendingRequestsCount,
  acceptedCount,
  connectedCitiesCount,
}: ClinicStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Active Clinics - Blue */}
      <GradientCard variant="blue">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Active Clinics
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 shadow-xs">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
              {activeClinicsCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Connected Hubs</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Ready for live queue operations
          </p>
        </div>
      </GradientCard>

      {/* Pending Requests - Amber */}
      <GradientCard variant="amber">
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
            <span className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
              {pendingRequestsCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Awaiting Action</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Incoming & outgoing requests
          </p>
        </div>
      </GradientCard>

      {/* Accepted Associations - Emerald */}
      <GradientCard variant="emerald">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Accepted Associations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {acceptedCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Approved Links</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Verified medical centers
          </p>
        </div>
      </GradientCard>

      {/* Practice Cities - Purple */}
      <GradientCard variant="purple">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Practice Locations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 shadow-xs">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-purple-600 dark:text-purple-400">
              {connectedCitiesCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Distinct Cities</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Geographic footprint
          </p>
        </div>
      </GradientCard>
    </div>
  );
}
