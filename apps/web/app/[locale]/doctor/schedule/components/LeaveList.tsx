"use client";

import { Calendar, Trash2, CalendarOff } from "lucide-react";
import type { DoctorLeave } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface LeaveListProps {
  leaves: DoctorLeave[];
  onCancelLeave: (leave: DoctorLeave) => void;
  isLoading?: boolean;
}

export function LeaveList({
  leaves,
  onCancelLeave,
  isLoading = false,
}: LeaveListProps) {
  // Sort leaves by date ascending
  const sortedLeaves = [...leaves].sort((a, b) => {
    return (a.date || "").localeCompare(b.date || "");
  });

  return (
    <GradientCard variant="amber" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 shadow-xs">
                <Calendar className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Scheduled Leaves List
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {leaves.length} {leaves.length === 1 ? "leave record" : "leave records"} for active clinic
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                  />
                ))}
              </div>
            ) : sortedLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                <CalendarOff className="h-8 w-8 text-slate-400 dark:text-slate-600" />
                <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  No leaves marked for this clinic.
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  You are currently scheduled as available across all regular clinic shifts.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <th className="pb-2 pl-2">Date</th>
                      <th className="pb-2">Reason</th>
                      <th className="pb-2 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sortedLeaves.map((leave) => (
                      <tr
                        key={leave.id || leave.date}
                        className="group transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-3 pl-2 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                            <span>{leave.date}</span>
                          </div>
                        </td>

                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          {leave.reason ? (
                            <span>{leave.reason}</span>
                          ) : (
                            <span className="italic text-slate-400 dark:text-slate-500">
                              No reason provided
                            </span>
                          )}
                        </td>

                        <td className="py-3 pr-2 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onCancelLeave(leave)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 transition-colors"
                            title={`Cancel leave for ${leave.date}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Cancel Leave</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
