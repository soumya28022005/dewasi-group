"use client";

import {
  ListOrdered,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { GradientCard } from "./GradientCard";

interface DoctorQueueOverviewProps {
  waitingCount?: number;
  completedCount?: number;
  totalAppointments?: number;
  activeStatus?: string;
}

export function DoctorQueueOverview({
  waitingCount = 0,
  completedCount = 0,
  totalAppointments = 0,
  activeStatus = "ACTIVE",
}: DoctorQueueOverviewProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4]" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <ListOrdered className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Queue & Consultations
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Live patient consultation status
                </p>
              </div>
            </div>

            <Link
              href="/doctor/queue"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              <span>Live Queue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Status Breakdown Pills */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <Clock className="h-3.5 w-3.5" />
                <span>Waiting</span>
              </div>
              <p className="mt-1 text-xl font-bold text-amber-900 dark:text-amber-200">
                {waitingCount}
              </p>
            </div>

            <div className="rounded-xl border border-blue-200/70 bg-blue-50/60 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                <Activity className="h-3.5 w-3.5" />
                <span>Total Today</span>
              </div>
              <p className="mt-1 text-xl font-bold text-blue-900 dark:text-blue-200">
                {totalAppointments}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/60 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completed</span>
              </div>
              <p className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-200">
                {completedCount}
              </p>
            </div>

            <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/60 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Status</span>
              </div>
              <p className="mt-1 text-xs font-bold uppercase text-indigo-900 dark:text-indigo-200">
                {activeStatus}
              </p>
            </div>
          </div>

          {/* Quick Queue Launch Box */}
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-center dark:border-slate-800 dark:bg-slate-850/60">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {waitingCount > 0
                ? `${waitingCount} patients are currently waiting in your consultation queue.`
                : "No patients currently waiting in queue."}
            </p>
            <div className="mt-3 flex justify-center">
              <Link
                href="/doctor/queue"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Open Live Queue Desk</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
