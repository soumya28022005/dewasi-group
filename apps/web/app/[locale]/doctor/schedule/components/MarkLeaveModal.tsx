"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { useMarkDoctorLeave } from "@/lib/hooks/useDoctor";
import toast from "react-hot-toast";

interface MarkLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  clinicId: string;
  clinicName?: string;
  initialDate?: string;
}

export function MarkLeaveModal({
  isOpen,
  onClose,
  doctorId,
  clinicId,
  clinicName,
  initialDate,
}: MarkLeaveModalProps) {
  const [date, setDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const markLeaveMutation = useMarkDoctorLeave();

  useEffect(() => {
    if (isOpen) {
      const defaultDate =
        initialDate || new Date().toISOString().split("T")[0];
      setDate(defaultDate);
      setReason("");
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !clinicId) {
      toast.error("Doctor or Clinic association is missing.");
      return;
    }

    if (!date) {
      toast.error("Please select a valid leave date.");
      return;
    }

    // Validate YYYY-MM-DD pattern
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      toast.error("Date format must be YYYY-MM-DD.");
      return;
    }

    try {
      await markLeaveMutation.mutateAsync({
        doctorId,
        clinicId,
        date,
        reason: reason.trim() || undefined,
      });

      toast.success("Leave marked successfully.");
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mark doctor leave.";
      toast.error(errorMessage);
    }
  };

  const isPending = markLeaveMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mark Doctor Leave
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {clinicName ? `For ${clinicName}` : "Schedule time off for clinic"}
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Date Picker (Required) */}
          <div>
            <label
              htmlFor="leave-date"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Leave Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="leave-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isPending}
              className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-rose-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            />
          </div>

          {/* Reason (Optional) */}
          <div>
            <label
              htmlFor="leave-reason"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Reason <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="leave-reason"
              rows={3}
              placeholder="e.g. Attending medical conference, personal leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPending}
              maxLength={200}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-rose-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || !date}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition-colors"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Mark Leave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
