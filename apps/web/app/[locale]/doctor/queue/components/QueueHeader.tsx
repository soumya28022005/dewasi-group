"use client";

import { Building2, Calendar, RefreshCw, Activity } from "lucide-react";
import { useTranslations } from "next-intl";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ClinicOption {
  id: string;
  name: string;
  address?: string | null;
}

interface QueueHeaderProps {
  clinics: ClinicOption[];
  selectedClinicId: string;
  onClinicChange: (id: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  status?: string;
  isFetching?: boolean;
  onRefresh: () => void;
}

export function QueueHeader({
  clinics,
  selectedClinicId,
  onClinicChange,
  selectedDate,
  onDateChange,
  status,
  isFetching = false,
  onRefresh,
}: QueueHeaderProps) {
  const t = useTranslations("DoctorQueue");

  // Format status badge color based on API value
  const getStatusBadge = (rawStatus?: string) => {
    const s = (rawStatus || "UNKNOWN").toUpperCase();
    if (s === "LIVE" || s === "ACTIVE" || s === "CHECKED_IN") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ● {t("live")}
        </span>
      );
    }
    if (s === "PAUSED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          ● {t("paused")}
        </span>
      );
    }
    if (s === "CLOSED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          ● {t("closed")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {s}
      </span>
    );
  };

  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4]">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {t("title")}
            </h1>
            {getStatusBadge(status)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Controls: Clinic, Date, Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Clinic Selector */}
          {clinics.length > 0 && (
            <div className="relative flex items-center">
              <Building2 className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <select
                value={selectedClinicId}
                onChange={(e) => onClinicChange(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Selector */}
          <div className="relative flex items-center">
            <Calendar className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            />
          </div>

          {/* Manual Refresh Trigger */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50"
            title="Refresh Queue Data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
            <span>{t("refresh")}</span>
          </button>
        </div>
      </div>
    </GradientCard>
  );
}
