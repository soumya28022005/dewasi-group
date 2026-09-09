"use client";

import { useState } from "react";
import { Clock, Loader2, Info, Check } from "lucide-react";
import { useUpdateConsultationTime } from "@/lib/hooks/useDoctor";
import toast from "react-hot-toast";
import { GradientCard } from "@/components/ui/GradientCard";

interface ConsultationTimeCardProps {
  doctorId: string;
  clinicId: string;
  avgConsultationMinutes?: number;
  isLoading?: boolean;
}

const PRESET_MINUTES = [10, 15, 20, 30, 45, 60];

export function ConsultationTimeCard({
  doctorId,
  clinicId,
  avgConsultationMinutes,
  isLoading = false,
}: ConsultationTimeCardProps) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | "">("");
  const [customValue, setCustomValue] = useState<string>("");

  const updateMutation = useUpdateConsultationTime();

  const handlePresetClick = (minutes: number) => {
    setSelectedMinutes(minutes);
    setCustomValue("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedMinutes(parsed);
    } else {
      setSelectedMinutes("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !clinicId) {
      toast.error("Doctor or Clinic association is missing.");
      return;
    }

    const minutesToSubmit =
      typeof selectedMinutes === "number" ? selectedMinutes : parseInt(customValue, 10);

    if (
      !minutesToSubmit ||
      isNaN(minutesToSubmit) ||
      !Number.isInteger(minutesToSubmit) ||
      minutesToSubmit <= 0
    ) {
      toast.error("Please enter a valid positive duration in minutes.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        doctorId,
        clinicId,
        avgConsultationMinutes: minutesToSubmit,
      });
      toast.success(`Consultation time updated to ${minutesToSubmit} mins`);
      setSelectedMinutes("");
      setCustomValue("");
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to update consultation time. Please try again.";
      toast.error(errMsg);
    }
  };

  const displayValue =
    avgConsultationMinutes !== undefined && avgConsultationMinutes !== null
      ? `${avgConsultationMinutes} mins`
      : "Not set";

  const isPending = updateMutation.isPending;
  const isSubmitDisabled =
    isPending ||
    typeof selectedMinutes !== "number" ||
    selectedMinutes <= 0;

  return (
    <GradientCard variant="purple" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 shadow-xs">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Consultation Timing
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Configure patient consultation slot duration
                </p>
              </div>
            </div>
          </div>

          {/* Read value: Practice Average Consultation Time */}
          <div className="mt-4 rounded-xl bg-slate-50/80 p-3.5 dark:bg-slate-800/60">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Practice Average Consultation Time
              </span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {isLoading ? "..." : displayValue}
              </span>
            </div>
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
              <span>
                This reading reflects your overall practice average across consultations. Updating will set your target consultation pace for the active clinic.
              </span>
            </div>
          </div>

          {/* Presets and Custom Input */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select or Enter Duration (Minutes)
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESET_MINUTES.map((mins) => {
                  const isSelected = selectedMinutes === mins && !customValue;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handlePresetClick(mins)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                        isSelected
                          ? "bg-purple-600 text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {mins}m
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Custom minutes (e.g. 25)"
                  value={customValue}
                  onChange={handleCustomChange}
                  disabled={isPending}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-purple-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 focus:outline-hidden disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Update Consultation Time</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </GradientCard>
  );
}
