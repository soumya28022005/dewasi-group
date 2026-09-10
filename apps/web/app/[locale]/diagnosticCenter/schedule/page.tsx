"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  Loader2,
  Clock3,
  Check,
  X,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  SunMedium,
  Moon,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useCenterWorkingHours,
  useUpdateCenterWorkingHours,
} from "@/lib/hooks/useDiagnosticCenter";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const DAY_SHORT: Record<string, string> = {
  MONDAY: "M",
  TUESDAY: "T",
  WEDNESDAY: "W",
  THURSDAY: "T",
  FRIDAY: "F",
  SATURDAY: "S",
  SUNDAY: "S",
};

interface WorkingHour {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface FormValues {
  hours: WorkingHour[];
}

export default function CenterSchedulePage() {
  const { data: workingHours, isLoading } = useCenterWorkingHours();
  const updateMutation = useUpdateCenterWorkingHours();

  const { register, control, handleSubmit, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        hours: [],
      },
    });

  const { fields } = useFieldArray({
    control,
    name: "hours",
  });

  const watchedHours = watch("hours");

  useEffect(() => {
    if (!workingHours) return;

    const formatted: WorkingHour[] = DAYS.map((day) => {
      const existing = workingHours.find(
        (h: any) => h.dayOfWeek === day
      );

      return {
        dayOfWeek: day,
        openTime: existing?.openTime || "09:00",
        closeTime: existing?.closeTime || "17:00",
        isClosed: existing?.isClosed ?? false,
      };
    });

    reset({ hours: formatted });
  }, [workingHours, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateMutation.mutateAsync(data.hours);
      toast.success("Working hours updated successfully!");
    } catch {
      toast.error("Failed to update working hours.");
    }
  };

  const openDays =
    watchedHours?.filter((item) => !item.isClosed).length ?? 0;

  const closedDays =
    watchedHours?.filter((item) => item.isClosed).length ?? 0;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 animate-pulse">
        <div className="h-44 rounded-[28px] bg-slate-100 dark:bg-slate-900" />

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-[86px] rounded-2xl bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-12">
      {/* =====================================================
          HERO / HEADER
      ====================================================== */}
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950">
        {/* Premium accent */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6]" />

        <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-[#3b4a8f]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-3xl" />

        <div className="relative p-5 sm:p-7">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* Heading */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] opacity-20 blur-md" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] text-white shadow-lg">
                  <Clock3 className="h-5.5 w-5.5" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                    Working Hours
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <ShieldCheck className="h-3 w-3" />
                    Live Schedule
                  </span>
                </div>

                <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                  Configure when your diagnostic center is available
                  for patients throughout the week.
                </p>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="flex items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </span>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Open Days
                    </p>
                    <p className="text-lg font-black leading-5 text-slate-900 dark:text-white">
                      {openDays}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <X className="h-3.5 w-3.5" />
                  </span>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Closed
                    </p>
                    <p className="text-lg font-black leading-5 text-slate-900 dark:text-white">
                      {closedDays}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SCHEDULE EDITOR
      ====================================================== */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950">
          {/* Editor Header */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
                <CalendarDays className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Weekly Availability
                </h2>
                <p className="text-[10px] text-slate-400">
                  Your schedule visible to patients
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-[10px] font-medium text-slate-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Open
              <span className="ml-2 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              Closed
            </div>
          </div>

          {/* Days */}
          <div className="space-y-2 p-3 sm:p-5">
            {fields.map((field, index) => {
              const isClosed = watchedHours?.[index]?.isClosed ?? false;

              return (
                <div
                  key={field.id}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isClosed
                      ? "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
                      : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                  }`}
                >
                  {!isClosed && (
                    <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#252a67] to-[#14B8A6]" />
                  )}

                  <div className="grid gap-4 p-3.5 sm:grid-cols-[minmax(170px,1fr)_auto_minmax(270px,0.9fr)] sm:items-center sm:p-4">
                    {/* Day */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                          isClosed
                            ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                            : "bg-gradient-to-br from-[#252a67]/10 to-[#14B8A6]/10 text-[#252a67] dark:from-[#252a67]/30 dark:to-[#14B8A6]/20 dark:text-slate-200"
                        }`}
                      >
                        {DAY_SHORT[field.dayOfWeek]}

                        {!isClosed && (
                          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-sm font-extrabold ${
                            isClosed
                              ? "text-slate-400"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {DAY_LABELS[field.dayOfWeek]}
                        </p>

                        <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                          {isClosed
                            ? "Not accepting patients"
                            : "Accepting patients"}
                        </p>
                      </div>
                    </div>

                    {/* Status Switch */}
                    <div className="flex">
                      <label
                        className={`relative inline-flex h-9 cursor-pointer items-center rounded-xl border p-1 transition ${
                          isClosed
                            ? "border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
                            : "border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          {...register(`hours.${index}.isClosed`)}
                          className="peer sr-only"
                        />

                        <span
                          className={`flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold transition ${
                            !isClosed
                              ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300"
                              : "text-slate-400"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          Open
                        </span>

                        <span
                          className={`flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-bold transition ${
                            isClosed
                              ? "bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-200"
                              : "text-slate-400"
                          }`}
                        >
                          <X className="h-3 w-3" />
                          Closed
                        </span>
                      </label>
                    </div>

                    {/* Time */}
                    <div
                      className={`flex items-center gap-2 ${
                        isClosed
                          ? "pointer-events-none opacity-30"
                          : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5 px-1">
                          <SunMedium className="h-3 w-3 text-amber-500" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Opening
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="time"
                            disabled={isClosed}
                            {...register(`hours.${index}.openTime`)}
                            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#3b4a8f] focus:bg-white focus:ring-4 focus:ring-[#3b4a8f]/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                        <span className="text-[9px] font-black text-slate-400">
                          →
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-1.5 px-1">
                          <Moon className="h-3 w-3 text-[#3b4a8f]" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Closing
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="time"
                            disabled={isClosed}
                            {...register(`hours.${index}.closeTime`)}
                            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-[#14B8A6]/5 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#14B8A6]/10 text-[#14B8A6]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    Keep your availability accurate
                  </p>

                  <p className="mt-0.5 max-w-md text-[10px] leading-4 text-slate-400">
                    Patients use these hours to plan visits and
                    appointments at your diagnostic center.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] px-6 text-xs font-extrabold text-white shadow-lg shadow-[#252a67]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#252a67]/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />

                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="relative h-4 w-4 animate-spin" />
                    <span className="relative">Saving changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="relative h-4 w-4" />
                    <span className="relative">Save Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}