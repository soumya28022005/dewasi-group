"use client";

import type { DoctorQueue } from "@doctor-contract/shared";
import { UserCheck, Clock, Hash, CheckCircle2 } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface QueueStatusCardProps {
  queue?: DoctorQueue;
}

export function QueueStatusCard({ queue }: QueueStatusCardProps) {
  const currentToken = queue?.currentToken ?? 0;
  const lastTokenIssued = queue?.lastTokenIssued ?? 0;
  const tokens = queue?.tokens ?? [];

  // Calculate stats from tokens array
  const waitingCount = tokens.filter(
    (t) => t.status === "WAITING" || t.status === "CHECKED_IN"
  ).length;

  const completedCount = tokens.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  const formatTokenDisplay = (val: number) => {
    if (!val || val <= 0) return "--";
    return `#${val < 10 ? `0${val}` : val}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Current Serving - Blue */}
      <GradientCard variant="blue">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Currently Serving
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 shadow-xs">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400">
              {formatTokenDisplay(currentToken)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Active Token</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            In consultation room
          </p>
        </div>
      </GradientCard>

      {/* Waiting Count - Amber */}
      <GradientCard variant="amber">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Patients Waiting
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 shadow-xs">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
              {waitingCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">in waiting line</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Ready for call
          </p>
        </div>
      </GradientCard>

      {/* Last Token Issued - Purple */}
      <GradientCard variant="purple">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Last Token Issued
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 shadow-xs">
              <Hash className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatTokenDisplay(lastTokenIssued)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Total generated</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Max token for date
          </p>
        </div>
      </GradientCard>

      {/* Completed Today - Emerald */}
      <GradientCard variant="emerald">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Completed Today
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Consultations</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Successfully served
          </p>
        </div>
      </GradientCard>
    </div>
  );
}
