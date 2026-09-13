"use client";

import { ChevronRight, ChevronLeft, Loader2, Users } from "lucide-react";
import { useQueueNext, useQueuePrevious } from "@/lib/hooks/useDoctor";
import toast from "react-hot-toast";
import { GradientCard } from "@/components/ui/GradientCard";

// A separate, deliberately simple control from <QueueActions> — just two
// big buttons anyone can tap on a phone without hunting through the full
// control panel. Uses the exact same Next/Previous mutations, so it stays
// in sync with the detailed panel and the live queue view automatically.
export function QuickQueueControl({
  doctorId,
  clinicId,
  date,
  scheduleId,
  currentToken,
  lastTokenIssued,
  queueStatus,
}: {
  doctorId: string;
  clinicId: string;
  date: string;
  scheduleId: string;
  currentToken?: number;
  lastTokenIssued?: number;
  queueStatus?: string;
}) {
  const nextMutation = useQueueNext();
  const prevMutation = useQueuePrevious();

  const isClosed = (queueStatus || "").toUpperCase() === "CLOSED";
  const hasWaiting = (lastTokenIssued ?? 0) > (currentToken ?? 0);
  const isBusy = nextMutation.isPending || prevMutation.isPending;

  async function callNext() {
    try {
      await nextMutation.mutateAsync({ doctorId, clinicId, date, scheduleId });
      toast.success("Called next patient");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not call next patient");
    }
  }

  async function goPrevious() {
    try {
      await prevMutation.mutateAsync({ doctorId, clinicId, date, scheduleId });
      toast.success("Went back to previous token");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not go to previous token");
    }
  }

  return (
    <GradientCard variant="indigo">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Queue Control
          </p>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Now serving #{currentToken ?? 0}
          </span>
        </div>

        {/* Big tap targets — sized for a thumb on a phone, not a mouse */}
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_2fr]">
          <button
            type="button"
            onClick={goPrevious}
            disabled={isBusy || isClosed || (currentToken ?? 0) <= 0}
            className="flex h-16 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-700 transition active:scale-95 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {prevMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
            Previous
          </button>

          <button
            type="button"
            onClick={callNext}
            disabled={isBusy || isClosed || !hasWaiting}
            className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-base font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-40"
          >
            {nextMutation.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
            Next Patient
          </button>
        </div>

        {isClosed && (
          <p className="mt-2.5 text-center text-[11px] font-semibold text-rose-500">
            Queue is closed — reopen it below to call patients.
          </p>
        )}
        {!isClosed && !hasWaiting && (
          <p className="mt-2.5 text-center text-[11px] font-medium text-slate-400">
            No more waiting patients in this session.
          </p>
        )}
      </div>
    </GradientCard>
  );
}
