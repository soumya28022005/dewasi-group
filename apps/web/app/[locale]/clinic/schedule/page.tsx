"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Loader2,
  Building2,
  CalendarOff,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useWorkingHours,
  useSetWorkingHours,
  useHolidays,
  useAddHoliday,
  useRemoveHoliday,
  type WorkingHour,
  type DayOfWeek,
} from "@/lib/hooks/useClinic";

import { PremiumTimeInput } from "@/components/PremiumTimeInput"; // Ensure this path is correct

const DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function defaultHours(): WorkingHour[] {
  return DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    isClosed: dayOfWeek === "SUNDAY",
    openTime: "10:00",
    closeTime: "19:00",
  }));
}

// Premium input styling for other inputs (like Date/Text)
const inputClasses =
  "rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[#667eea] focus:ring-[3px] focus:ring-[#667eea]/15";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#667eea] via-[#764ba2] to-[#f093fb]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[3px] bg-gradient-to-r ${gradient} shadow-xl ${className}`}>
      <div className="rounded-[calc(1rem-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

export default function ClinicSchedulePage() {
  const tDays = useTranslations("Days");
  const tSched = useTranslations("ClinicSchedule");
  const tNav = useTranslations("ClinicNav");
  const { data: savedHours, isLoading } = useWorkingHours();
  const setHours = useSetWorkingHours();
  const { data: holidays } = useHolidays();
  const addHoliday = useAddHoliday();
  const removeHoliday = useRemoveHoliday();

  const [hours, setLocalHours] = useState<WorkingHour[]>(defaultHours());
  const [saved, setSaved] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");

  useEffect(() => {
    if (savedHours && savedHours.length > 0) {
      setLocalHours(
        DAYS.map(
          (day) =>
            savedHours.find((h) => h.dayOfWeek === day) ?? {
              dayOfWeek: day,
              isClosed: true,
              openTime: null,
              closeTime: null,
            }
        )
      );
    }
  }, [savedHours]);

  function updateDay(day: DayOfWeek, patch: Partial<WorkingHour>) {
    setLocalHours((prev) =>
      prev.map((h) => (h.dayOfWeek === day ? { ...h, ...patch } : h))
    );
  }

  // Handle Toggle to insert default times when turning ON
  function handleToggleDay(h: WorkingHour) {
    const willBeOpen = h.isClosed; // Turning ON
    updateDay(h.dayOfWeek, { 
      isClosed: !h.isClosed,
      openTime: willBeOpen && !h.openTime ? "10:00" : h.openTime,
      closeTime: willBeOpen && !h.closeTime ? "19:00" : h.closeTime
    });
  }

  function handleSaveHours(e: React.FormEvent) {
    e.preventDefault();
    
    // BACKEND PAYLOAD FORMATTING: 
    // Closed din gulo te time null kore pathate hobe jate backend reject na kore
    const payload = hours.map(h => ({
      dayOfWeek: h.dayOfWeek,
      isClosed: h.isClosed,
      openTime: h.isClosed ? null : h.openTime,
      closeTime: h.isClosed ? null : h.closeTime
    }));

    setHours.mutate(payload, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      },
    });
  }

  function handleAddHoliday(e: React.FormEvent) {
    e.preventDefault();
    if (!holidayDate) return;

    addHoliday.mutate(
      {
        date: holidayDate,
        reason: holidayReason || undefined,
      },
      {
        onSuccess: () => {
          setHolidayDate("");
          setHolidayReason("");
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1e40af]">
              {tNav("schedule")}
            </span>

            {holidays && holidays.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-2 py-0.5 text-[9px] font-bold text-white">
                <Sparkles className="h-3 w-3" />
                {holidays.length} Holidays
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {tSched("heading")}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {tSched("subtitle")}
          </p>
        </div>
      </GradientCard>

      {/* =====================================================
          WORKING HOURS
      ====================================================== */}
      <GradientCard gradient="from-[#667eea] via-[#764ba2] to-[#f093fb]">
        <form onSubmit={handleSaveHours} className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-purple-500/30">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {tSched("weeklyHours")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {tSched("subtitle")}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-100 bg-slate-50/50">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#667eea] border-t-transparent" />
                <p className="text-sm font-medium text-slate-500">
                  {tSched("loadingSchedule")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {hours.map((h) => (
                <div
                  key={h.dayOfWeek}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                    h.isClosed
                      ? "border-slate-100 bg-slate-50/70 opacity-80"
                      : "border-slate-200 bg-white shadow-sm hover:border-[#667eea]/30 hover:shadow-md"
                  }`}
                >
                  {!h.isClosed && (
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-[#667eea] to-[#764ba2]" />
                  )}

                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:pl-5">
                    {/* Day Info */}
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          h.isClosed
                            ? "bg-slate-200 text-slate-400"
                            : "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30"
                        }`}
                      >
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className={`text-sm font-bold ${h.isClosed ? "text-slate-500" : "text-slate-800"}`}>
                          {tDays(h.dayOfWeek)}
                        </p>
                        <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${h.isClosed ? "text-slate-400" : "text-[#059669]"}`}>
                          {h.isClosed ? tSched("closed") : tSched("open")}
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                      {/* Premium Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!h.isClosed}
                        onClick={() => handleToggleDay(h)}
                        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#667eea]/20 ${
                          !h.isClosed ? "bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            !h.isClosed ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>

                      {/* Premium Time Inputs */}
                      {!h.isClosed && (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-1">
                          <PremiumTimeInput
                            value={h.openTime ?? "10:00"}
                            onChange={(e) => updateDay(h.dayOfWeek, { openTime: e.target.value })}
                            disabled={h.isClosed}
                          />
                          <span className="text-xs font-bold text-slate-400">
                            {tSched("to")}
                          </span>
                          <PremiumTimeInput
                            value={h.closeTime ?? "19:00"}
                            onChange={(e) => updateDay(h.dayOfWeek, { closeTime: e.target.value })}
                            disabled={h.isClosed}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={setHours.isPending || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {setHours.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {setHours.isPending ? tSched("saving") : tSched("saveWeeklyRoutine")}
            </button>

            {saved && (
              <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#059669]/10 to-transparent px-4 py-3 text-xs font-bold text-[#059669]">
                <CheckCircle2 className="h-4 w-4" />
                {tSched("hoursSuccess")}
              </div>
            )}
          </div>
        </form>
      </GradientCard>

      {/* =====================================================
          HOLIDAYS - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#f093fb] via-[#f5576c] to-[#fda085]">
        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white shadow-lg shadow-pink-500/30">
              <CalendarOff className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {tSched("holidaysHeading")}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {tSched("holidaysSub")}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddHoliday}
            className="rounded-2xl border border-[#f5576c]/10 bg-gradient-to-r from-[#f5576c]/5 to-transparent p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr_auto] sm:items-end">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">
                  {tSched("selectDate")}
                </span>
                <input
                  type="date"
                  required
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className={`${inputClasses} w-full`}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-600">
                  {tSched("reasonLabel")}
                  <span className="ml-1 font-medium text-slate-400">
                    {tSched("optional")}
                  </span>
                </span>
                <input
                  type="text"
                  value={holidayReason}
                  onChange={(e) => setHolidayReason(e.target.value)}
                  className={`${inputClasses} w-full`}
                  placeholder={tSched("reasonPlaceholder")}
                />
              </label>

              <button
                type="submit"
                disabled={addHoliday.isPending}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5576c] to-[#fda085] px-5 text-sm font-bold text-white shadow-md shadow-pink-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addHoliday.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {addHoliday.isPending ? tSched("adding") : tSched("addHoliday")}
              </button>
            </div>
          </form>

          {/* Holiday List */}
          <div className="mt-6">
            {(holidays ?? []).length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white shadow-lg shadow-pink-500/30">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800">
                  {tSched("noHolidaysTitle")}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {tSched("noHolidaysSub")}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {holidays?.map((holiday) => {
                  const dateObj = new Date(holiday.date);
                  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
                  const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
                  const year = dateObj.toLocaleDateString("en-US", { year: "numeric" });

                  return (
                    <div
                      key={holiday.id}
                      className="group flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-[#f5576c]/30 hover:shadow-md"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#f5576c] to-[#fda085] text-white shadow-md shadow-pink-500/30">
                          <span className="text-[10px] font-bold uppercase leading-none">{month}</span>
                          <span className="mt-0.5 text-lg font-black leading-none tracking-tight">{day}</span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">{holiday.reason || tSched("defaultReason")}</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-400">{year}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeHoliday.mutate(holiday.id)}
                        disabled={removeHoliday.isPending}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 opacity-0 transition-all hover:border-[#f5576c]/30 hover:bg-[#f5576c]/5 hover:text-[#f5576c] group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Remove holiday"
                      >
                        {removeHoliday.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </GradientCard>
    </div>
  );
}