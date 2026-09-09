"use client";

import { useState } from "react";
import type { QueueToken } from "@doctor-contract/shared";
import {
  useQueueNext,
  useQueuePrevious,
  useQueueSkip,
  useQueueRecall,
  useQueuePause,
  useQueueResume,
  useQueueClose,
  useQueueReopen,
  useQueueEmergency,
} from "@/lib/hooks/useDoctor";
import toast from "react-hot-toast";
import { ConfirmModal } from "./ConfirmModal";
import {
  SkipForward,
  SkipBack,
  RotateCcw,
  Pause,
  Play,
  Lock,
  Unlock,
  AlertOctagon,
  ChevronRight,
  Loader2,
  Sliders,
} from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface QueueActionsProps {
  doctorId: string;
  clinicId: string;
  date: string;
  queueStatus?: string;
  waitingTokens?: QueueToken[];
}

export function QueueActions({
  doctorId,
  clinicId,
  date,
  queueStatus,
  waitingTokens = [],
}: QueueActionsProps) {
  // Mutation hooks
  const nextMutation = useQueueNext();
  const prevMutation = useQueuePrevious();
  const skipMutation = useQueueSkip();
  const recallMutation = useQueueRecall();
  const pauseMutation = useQueuePause();
  const resumeMutation = useQueueResume();
  const closeMutation = useQueueClose();
  const reopenMutation = useQueueReopen();
  const emergencyMutation = useQueueEmergency();

  // Active state for safety confirmation modals
  const [activeModal, setActiveModal] = useState<
    "skip" | "pause" | "close" | "reopen" | "emergency" | null
  >(null);
  const [skipReason, setSkipReason] = useState("");
  const [pauseReason, setPauseReason] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [selectedEmergencyPatientId, setSelectedEmergencyPatientId] = useState("");

  const isAnyMutating =
    nextMutation.isPending ||
    prevMutation.isPending ||
    skipMutation.isPending ||
    recallMutation.isPending ||
    pauseMutation.isPending ||
    resumeMutation.isPending ||
    closeMutation.isPending ||
    reopenMutation.isPending ||
    emergencyMutation.isPending;

  const handleAction = async (
    mutation: { mutateAsync: (args: any) => Promise<any> },
    successMsg: string,
    extraBody?: Record<string, any>
  ) => {
    try {
      await mutation.mutateAsync({
        doctorId,
        clinicId,
        date,
        ...extraBody,
      });
      toast.success(successMsg);
      setActiveModal(null);
      setSkipReason("");
      setPauseReason("");
      setCloseReason("");
      setSelectedEmergencyPatientId("");
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Unable to update the queue. Please try again.";
      toast.error(errMsg);
    }
  };

  const isClosed = (queueStatus || "").toUpperCase() === "CLOSED";
  const isPaused = (queueStatus || "").toUpperCase() === "PAUSED";

  return (
    <GradientCard variant="indigo" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Sliders className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Queue Control Panel
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              Real-time Direct Commands
            </span>
          </div>

          {/* Primary Call Controls */}
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Token Navigation
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {/* Next Patient */}
              <button
                type="button"
                disabled={isAnyMutating || isClosed}
                onClick={() => handleAction(nextMutation, "Called next patient token")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {nextMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Next Patient
              </button>

              {/* Previous Patient */}
              <button
                type="button"
                disabled={isAnyMutating || isClosed}
                onClick={() => handleAction(prevMutation, "Returned to previous token")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-all"
              >
                {prevMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <SkipBack className="h-3.5 w-3.5" />
                )}
                Previous
              </button>

              {/* Skip Patient */}
              <button
                type="button"
                disabled={isAnyMutating || isClosed}
                onClick={() => setActiveModal("skip")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-all"
              >
                <SkipForward className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Skip
              </button>

              {/* Recall Patient */}
              <button
                type="button"
                disabled={isAnyMutating || isClosed}
                onClick={() => handleAction(recallMutation, "Recalled skipped patient")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-all"
              >
                {recallMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                )}
                Recall
              </button>
            </div>
          </div>

          {/* State Management Controls */}
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Queue State Management
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {/* Pause / Resume Queue */}
              {isPaused ? (
                <button
                  type="button"
                  disabled={isAnyMutating || isClosed}
                  onClick={() => handleAction(resumeMutation, "Queue resumed successfully")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  {resumeMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  Resume Queue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isAnyMutating || isClosed}
                  onClick={() => setActiveModal("pause")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-all"
                >
                  <Pause className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Pause Queue
                </button>
              )}

              {/* Close / Reopen Queue */}
              {isClosed ? (
                <button
                  type="button"
                  disabled={isAnyMutating}
                  onClick={() => setActiveModal("reopen")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition-all"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Reopen Queue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isAnyMutating}
                  onClick={() => setActiveModal("close")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-all"
                >
                  <Lock className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                  Close Queue
                </button>
              )}

              {/* Emergency Intercept */}
              <button
                type="button"
                disabled={isAnyMutating || isClosed}
                onClick={() => setActiveModal("emergency")}
                className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 sm:col-span-2 transition-all"
              >
                {emergencyMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <AlertOctagon className="h-4 w-4" />
                )}
                Emergency Intercept
              </button>
            </div>
          </div>
        </div>

        {/* Safety Confirmation Modals */}
        <ConfirmModal
          isOpen={activeModal === "skip"}
          title="Skip Current Patient?"
          description="This will move the currently serving patient token to skipped status and make the next waiting patient eligible for call."
          confirmText="Skip Token"
          variant="warning"
          isLoading={skipMutation.isPending}
          onConfirm={() => handleAction(skipMutation, "Patient token skipped")}
          onClose={() => setActiveModal(null)}
        />

        <ConfirmModal
          isOpen={activeModal === "pause"}
          title="Pause Live Queue?"
          description="Pausing the queue will temporarily halt live token call processing. Patients will see the queue status as PAUSED until resumed."
          confirmText="Pause Queue"
          variant="warning"
          isLoading={pauseMutation.isPending}
          onConfirm={() => handleAction(pauseMutation, "Queue paused")}
          onClose={() => setActiveModal(null)}
        />

        <ConfirmModal
          isOpen={activeModal === "close"}
          title="Close Queue for Date?"
          description="Closing the queue will prevent further token call progression for this date. You can reopen the queue at any time if needed."
          confirmText="Close Queue"
          variant="danger"
          isLoading={closeMutation.isPending}
          onConfirm={() => handleAction(closeMutation, "Queue closed for date")}
          onClose={() => setActiveModal(null)}
        />

        <ConfirmModal
          isOpen={activeModal === "reopen"}
          title="Reopen Closed Queue?"
          description="Reopening the queue will reactivate live token operations and resume patient consultation processing."
          confirmText="Reopen Queue"
          variant="info"
          isLoading={reopenMutation.isPending}
          onConfirm={() => handleAction(reopenMutation, "Queue reopened")}
          onClose={() => setActiveModal(null)}
        />

        <ConfirmModal
          isOpen={activeModal === "emergency"}
          title="Trigger Emergency Intercept?"
          description="Emergency mode prioritizes urgent patient consultation ahead of the regular token sequence. Select a waiting token if applicable or confirm immediate emergency call."
          confirmText="Trigger Emergency"
          variant="danger"
          isLoading={emergencyMutation.isPending}
          onConfirm={() => {
            const bodyPayload = selectedEmergencyPatientId
              ? { patientId: selectedEmergencyPatientId }
              : undefined;
            handleAction(emergencyMutation, "Emergency intercept triggered", bodyPayload);
          }}
          onClose={() => {
            setActiveModal(null);
            setSelectedEmergencyPatientId("");
          }}
        >
          {waitingTokens.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Select Patient for Emergency Priority (Optional):
              </label>
              <select
                value={selectedEmergencyPatientId}
                onChange={(e) => setSelectedEmergencyPatientId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">-- General Emergency Call --</option>
                {waitingTokens.map((t) => (
                  <option key={t.id || t.token} value={t.id}>
                    Token #{t.token} - {t.patientName || "Patient"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </ConfirmModal>
      </div>
    </GradientCard>
  );
}
