"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Send, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useNotifyDoctorDelay } from "@/lib/hooks/useDoctor";
import toast from "react-hot-toast";
import { GradientCard } from "@/components/ui/GradientCard";

interface DelayNotificationCardProps {
  doctorId: string;
  clinicId: string;
  clinicName?: string;
}

const PRESET_DELAYS = [10, 15, 30, 45, 60];

export function DelayNotificationCard({
  doctorId,
  clinicId,
  clinicName,
}: DelayNotificationCardProps) {
  const t = useTranslations("DoctorSchedule");
  const [selectedDelay, setSelectedDelay] = useState<number | "">("");
  const [customDelay, setCustomDelay] = useState<string>("");

  const delayMutation = useNotifyDoctorDelay();

  const handlePresetClick = (minutes: number) => {
    setSelectedDelay(minutes);
    setCustomDelay("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDelay(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedDelay(parsed);
    } else {
      setSelectedDelay("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !clinicId) {
      toast.error("Doctor or Clinic association is missing.");
      return;
    }

    const minutes =
      typeof selectedDelay === "number" ? selectedDelay : parseInt(customDelay, 10);

    if (!minutes || isNaN(minutes) || !Number.isInteger(minutes) || minutes <= 0) {
      toast.error("Please enter a valid positive integer for delay minutes.");
      return;
    }

    try {
      await delayMutation.mutateAsync({
        doctorId,
        clinicId,
        delayMinutes: minutes,
      });
      toast.success(t("delaySuccess"));
      setSelectedDelay("");
      setCustomDelay("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to broadcast delay notification.";
      toast.error(errorMsg);
    }
  };

  const isPending = delayMutation.isPending;
  const isSubmitDisabled =
    isPending ||
    selectedDelay === "" ||
    typeof selectedDelay !== "number" ||
    selectedDelay <= 0;

  return (
    <GradientCard variant="rose" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 shadow-xs">
                <AlertCircle className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t("delayTitle")}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("delaySub")}
                </p>
              </div>
            </div>
          </div>

          {/* Informational Message */}
          <div className="mt-4 rounded-xl bg-amber-50/70 p-3.5 dark:bg-amber-950/20 dark:border dark:border-amber-900/30">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
              {t("delayInfo")}
            </p>
          </div>

          {/* Presets and Custom Input */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("selectDelayDuration")}
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESET_DELAYS.map((mins) => {
                  const isSelected = selectedDelay === mins && !customDelay;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handlePresetClick(mins)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                        isSelected
                          ? "bg-rose-600 text-white shadow-xs"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      +{mins}m
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
                  placeholder={t("customDelayPlaceholder")}
                  value={customDelay}
                  onChange={handleCustomChange}
                  disabled={isPending}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-rose-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 focus:outline-hidden disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>{t("sendDelayNotification")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </GradientCard>
  );
}
