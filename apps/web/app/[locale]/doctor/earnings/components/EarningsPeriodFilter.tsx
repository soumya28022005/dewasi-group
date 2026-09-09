"use client";

import { Building2 } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

export type EarningsPeriod = "daily" | "weekly" | "monthly" | "yearly";

interface EarningsPeriodFilterProps {
  selectedPeriod: EarningsPeriod;
  onPeriodChange: (period: EarningsPeriod) => void;
  selectedClinicId: string;
  onClinicChange: (clinicId: string) => void;
  clinics: { id: string; clinicName: string }[];
}

export function EarningsPeriodFilter({
  selectedPeriod,
  onPeriodChange,
  selectedClinicId,
  onClinicChange,
  clinics,
}: EarningsPeriodFilterProps) {
  return (
    <GradientCard variant="slate">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Period Selection Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          {(["daily", "weekly", "monthly", "yearly"] as EarningsPeriod[]).map((period) => {
            const active = selectedPeriod === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => onPeriodChange(period)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                  active
                    ? "bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>

        {/* Clinic Filter Dropdown */}
        {clinics.length > 0 && (
          <div className="relative min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <select
              value={selectedClinicId}
              onChange={(e) => onClinicChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-8 text-xs font-semibold text-slate-700 transition-colors focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Practice Clinics</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.clinicName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
