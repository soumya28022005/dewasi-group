"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useCancelAssociation } from "@/lib/hooks/useDoctor";
import type { DoctorRequest } from "@doctor-contract/shared";
import toast from "react-hot-toast";

interface CancelRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: DoctorRequest | null;
}

export function CancelRequestModal({
  isOpen,
  onClose,
  request,
}: CancelRequestModalProps) {
  const cancelMutation = useCancelAssociation();

  if (!isOpen || !request) return null;

  const clinicName = request.clinic?.clinicName || "Medical Clinic";

  const handleConfirmCancel = async () => {
    try {
      await cancelMutation.mutateAsync(request.id);
      toast.success("Request cancelled successfully.");
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to cancel request.";
      toast.error(errorMsg);
    }
  };

  const isPending = cancelMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/40">
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cancel Sent Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Withdraw your application to {clinicName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-3.5 dark:bg-slate-800/60 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Clinic:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{clinicName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Shift Day:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{request.dayOfWeek || "--"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Timing:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {request.startTime && request.endTime
                ? `${request.startTime} - ${request.endTime}`
                : "--"}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Are you sure you want to withdraw this connection request? This action will remove the pending request from the clinic&apos;s review queue.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
          >
            Keep Request
          </button>

          <button
            type="button"
            onClick={handleConfirmCancel}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition-colors"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
