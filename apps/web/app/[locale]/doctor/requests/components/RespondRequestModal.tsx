"use client";

import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { useRespondDoctorRequest } from "@/lib/hooks/useDoctor";
import type { DoctorRequest } from "@doctor-contract/shared";
import toast from "react-hot-toast";

interface RespondRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: DoctorRequest | null;
  action: "ACCEPT" | "REJECT" | null;
}

export function RespondRequestModal({
  isOpen,
  onClose,
  request,
  action,
}: RespondRequestModalProps) {
  const respondMutation = useRespondDoctorRequest();

  if (!isOpen || !request || !action) return null;

  const isAccept = action === "ACCEPT";
  const clinicName = request.clinic?.clinicName || "Medical Clinic";

  const handleConfirm = async () => {
    try {
      await respondMutation.mutateAsync({
        associationId: request.id,
        action,
      });

      toast.success(
        isAccept
          ? `You have accepted the invitation from ${clinicName}.`
          : `You have declined the invitation from ${clinicName}.`
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to respond to request.";
      toast.error(errorMsg);
    }
  };

  const isPending = respondMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isAccept
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
              }`}
            >
              {isAccept ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isAccept ? "Accept Clinic Invitation" : "Decline Clinic Invitation"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {clinicName}
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

        {/* Shift Details Summary */}
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
          {request.fee !== undefined && request.fee !== null && (
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Consultation Fee:</span>
              <span className="font-semibold text-slate-900 dark:text-white">₹{request.fee}</span>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {isAccept
            ? "Accepting this request will establish an active association, enabling you to manage patient queues and schedules for this clinic."
            : "Are you sure you want to decline this invitation? The clinic will be notified that this request was rejected."}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition-colors ${
              isAccept
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isAccept ? "Confirm Acceptance" : "Confirm Decline"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
