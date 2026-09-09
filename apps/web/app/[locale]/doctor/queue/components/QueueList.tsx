"use client";

import type { QueueToken } from "@doctor-contract/shared";
import { Users, Clock, CheckCircle, PauseCircle, AlertCircle, XCircle } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface QueueListProps {
  tokens?: QueueToken[];
  currentTokenNumber?: number;
}

export function QueueList({ tokens = [], currentTokenNumber = 0 }: QueueListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            <Clock className="h-3 w-3" />
            Waiting
          </span>
        );
      case "CHECKED_IN":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
            <CheckCircle className="h-3 w-3" />
            Checked In
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        );
      case "ABSENT":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <AlertCircle className="h-3 w-3" />
            Absent
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950/50 dark:text-orange-400">
            <PauseCircle className="h-3 w-3" />
            Paused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const formatTokenDisplay = (val: number) => {
    if (!val || val <= 0) return "--";
    return `#${val < 10 ? `0${val}` : val}`;
  };

  return (
    <GradientCard variant="slate">
      <div className="p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Waiting Queue List
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Total Tokens: {tokens.length}
          </span>
        </div>

        {tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Users className="h-6 w-6" />
            </div>
            <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              No patients are currently waiting.
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              New patient bookings for this date will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800">
                  <th className="py-2.5 px-3">Token</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Demographics</th>
                  <th className="py-2.5 px-3">Booking Time</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {tokens.map((token) => {
                  const isCurrent = token.token === currentTokenNumber;
                  const formattedTime = token.bookedAt
                    ? new Date(token.bookedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--";

                  return (
                    <tr
                      key={token.id || token.token}
                      className={
                        isCurrent
                          ? "bg-blue-50/80 font-bold text-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition-colors"
                      }
                    >
                      <td className="py-3 px-3">
                        <span
                          className={
                            isCurrent
                              ? "inline-block rounded-lg bg-blue-600 px-2 py-0.5 font-mono text-xs font-black text-white shadow-xs"
                              : "font-mono font-bold text-slate-900 dark:text-white"
                          }
                        >
                          {formatTokenDisplay(token.token)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {token.patientName || `Patient #${token.token}`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {[
                          token.patientAge !== null && token.patientAge !== undefined
                            ? `${token.patientAge} yrs`
                            : null,
                          token.patientGender,
                        ]
                          .filter(Boolean)
                          .join(" • ") || "--"}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {formattedTime}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {getStatusBadge(token.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
