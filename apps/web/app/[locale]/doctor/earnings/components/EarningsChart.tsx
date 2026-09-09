"use client";

import { BarChart3 } from "lucide-react";
import type { ClinicEarningsBreakdown } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface EarningsChartProps {
  breakdown: ClinicEarningsBreakdown[];
}

export function EarningsChart({ breakdown }: EarningsChartProps) {
  if (!breakdown || breakdown.length === 0) return null;

  const maxEarnings = Math.max(...breakdown.map((b) => b.totalEarnings), 1);

  return (
    <GradientCard variant="blue">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Practice Revenue Distribution
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Comparative Clinic Performance
          </span>
        </div>

        {/* SVG Bar Visualizer */}
        <div className="space-y-4 pt-2">
          {breakdown.map((item) => {
            const heightPercent = Math.round((item.totalEarnings / maxEarnings) * 100);

            return (
              <div key={item.clinicId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {item.clinicName}
                  </span>
                  <span className="text-slate-900 font-extrabold dark:text-white">
                    ₹{item.totalEarnings.toLocaleString()}
                  </span>
                </div>

                <div className="relative flex h-5 w-full items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-700"
                    style={{ width: `${Math.max(heightPercent, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GradientCard>
  );
}
