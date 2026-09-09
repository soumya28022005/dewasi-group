"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  MapPin,
  Search,
  Circle,
} from "lucide-react";

import { usePublicAllDoctors } from "@/lib/hooks/usePublicDirectory";
import { useToggleDoctorAvailability } from "@/lib/hooks/useAdmin";
import type { Doctor } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data &&
    typeof err.response.data.message === "string"
  ) {
    return err.response.data.message;
  }
  return fallback;
}

export default function AdminDoctorAvailabilityPage() {
  const t = useTranslations("AdminDoctorAvailability");
  const { data: doctors, isLoading, isError, isFetching, refetch } = usePublicAllDoctors();
  const toggleAvailability = useToggleDoctorAvailability();

  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = doctors ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((doc) => {
      const haystack = [doc.user.name, doc.specialization, doc.clinic?.clinicName, doc.clinic?.city]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [doctors, search]);

  async function handleToggle(doc: Doctor) {
    setActionError(null);
    setActionSuccess(null);
    setPendingId(doc.id);

    try {
      await toggleAvailability.mutateAsync({
        doctorId: doc.id,
        isAvailable: !doc.isAvailable,
      });
      setActionSuccess(t("successUpdated") || "Availability updated.");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to update availability"));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Cyan */}
      <GradientCard variant="cyan">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {t("title") || "Doctor Availability"}
              </h1>
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">
                Live Status
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("subtitle") ||
                "Mark doctors as available or unavailable for bookings across the platform."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-cyan-600" : ""}`} />
            <span>{t("retry") || "Refresh"}</span>
          </button>
        </div>
      </GradientCard>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder") || "Search doctors by name, specialty, or clinic..."}
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>

      {/* Alerts */}
      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <h3 className="text-xs font-semibold">{t("errorTitle") || "Could not load doctors"}</h3>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              {t("retry") || "Retry"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <GradientCard variant="cyan">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 shadow-xs">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("emptyTitle") || "No doctors found"}
                </h3>
              </div>
            </GradientCard>
          ) : (
            filtered.map((doc) => (
              <GradientCard key={doc.id} variant="cyan">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 shadow-xs">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {doc.user.name}
                        </h3>
                        {doc.specialization && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {doc.specialization}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                        {doc.clinic?.clinicName && (
                          <span className="flex items-center gap-1 font-medium">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>{doc.clinic.clinicName}</span>
                          </span>
                        )}
                        {doc.clinic?.city && (
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{doc.clinic.city}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                        doc.isAvailable
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <Circle
                        className={`h-2 w-2 ${doc.isAvailable ? "fill-emerald-500 text-emerald-500" : "fill-slate-400 text-slate-400"}`}
                      />
                      {doc.isAvailable ? t("available") || "Available" : t("unavailable") || "Unavailable"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggle(doc)}
                      disabled={pendingId === doc.id}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition hover:scale-105 active:scale-95 disabled:opacity-50 ${
                        doc.isAvailable
                          ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                      }`}
                    >
                      {pendingId === doc.id
                        ? t("updating") || "Updating..."
                        : doc.isAvailable
                          ? t("markUnavailable") || "Mark Unavailable"
                          : t("markAvailable") || "Mark Available"}
                    </button>
                  </div>
                </div>
              </GradientCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}