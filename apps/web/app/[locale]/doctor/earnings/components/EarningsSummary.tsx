"use client";

import {
  TrendingUp,
  Users,
  Building2,
  BadgeIndianRupee,
} from "lucide-react";
import type { DoctorEarningsSummary } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface EarningsSummaryProps {
  summary: DoctorEarningsSummary;
}

export function EarningsSummary({ summary }: EarningsSummaryProps) {
  const totalEarnings = summary.totalEarnings || 0;
  const totalConsultations = summary.totalConsultations || 0;
  const avgFee = totalConsultations > 0 ? Math.round(totalEarnings / totalConsultations) : 0;
  const activeClinicsCount = summary.clinicBreakdown?.length || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Revenue - Emerald */}
      <GradientCard variant="emerald">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Total Revenue
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shadow-xs">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ₹{totalEarnings.toLocaleString()}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Recorded fee earnings
            </p>
          </div>
        </div>
      </GradientCard>

      {/* 2. Total Consultations - Blue */}
      <GradientCard variant="blue">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Completed Consultations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 shadow-xs">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {totalConsultations.toLocaleString()}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              Completed patient visits
            </p>
          </div>
        </div>
      </GradientCard>

      {/* 3. Average Consultation Fee - Purple */}
      <GradientCard variant="purple">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Avg Fee / Consultation
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 shadow-xs">
              <BadgeIndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ₹{avgFee.toLocaleString()}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              Effective average per visit
            </p>
          </div>
        </div>
      </GradientCard>

      {/* 4. Practice Clinics Count - Cyan */}
      <GradientCard variant="cyan">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Practice Clinics
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400 shadow-xs">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {activeClinicsCount}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
              Contributing centers
            </p>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}
