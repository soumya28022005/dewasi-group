"use client";

import { Stethoscope, Building2, MapPin, ClipboardList, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useMyAssignedDoctors } from "@/lib/hooks/useReceptionist";
import type { Doctor } from "@doctor-contract/shared";

function initials(name: string) {
  if (!name) return "DR";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const doctorName = doctor.user?.name || "Unknown Doctor";
  const clinicId = doctor.clinic?.id;

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:border-soft-300 dark:bg-surface">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-sm font-bold text-[var(--color-primary-text)] ring-1 ring-gray-100 dark:ring-soft-300">
          {initials(doctorName)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-[var(--color-primary-dark-text)]">
            {doctorName}
          </h3>
          {doctor.specialization && (
            <p className="truncate text-xs font-medium text-gray-500 dark:text-ink-500">
              {doctor.specialization}
            </p>
          )}
        </div>
        {doctor.isAvailable !== undefined && (
          <span
            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              doctor.isAvailable
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-gray-100 text-gray-500 dark:bg-soft-100 dark:text-ink-500"
            }`}
          >
            {doctor.isAvailable ? "Available" : "Unavailable"}
          </span>
        )}
      </div>

      <div className="my-3 h-px bg-gray-100 dark:bg-soft-100" />

      <div className="space-y-1.5">
        {doctor.clinic?.clinicName && (
          <p className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-ink-600">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
            {doctor.clinic.clinicName}
          </p>
        )}
        {doctor.clinic?.city && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-ink-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {doctor.clinic.city}
          </p>
        )}
      </div>

      <Link
        href={clinicId ? `/receptionist/queue/${doctor.id}/${clinicId}` : "/receptionist/queue"}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
      >
        <ClipboardList className="h-3.5 w-3.5" />
        Manage Live Queue
      </Link>
    </div>
  );
}

export default function ReceptionistDashboardPage() {
  const { data: doctors, isLoading, isError, isFetching, refetch } = useMyAssignedDoctors();
  const list = doctors ?? [];

  return (
    <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary-dark-text)]">
            My Doctors
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-ink-500">
            Doctors assigned to you. Open a doctor to manage their live queue.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 disabled:opacity-50 dark:border-soft-300 dark:bg-surface dark:text-ink-700 dark:hover:bg-soft-100 sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[var(--color-primary)]" : ""}`} />
          Refresh
        </button>
      </div>

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <p className="flex-1 text-xs font-semibold">Could not load your assigned doctors.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-gray-50 dark:border-soft-300 dark:bg-soft-50"
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-12 text-center dark:border-soft-300 dark:bg-soft-50/70">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-surface dark:ring-soft-300">
            <Stethoscope className="h-6 w-6 text-gray-400 dark:text-ink-400" />
          </div>
          <p className="text-base font-bold text-gray-800 dark:text-ink-800">
            No doctors assigned yet
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-ink-500">
            Ask your clinic admin to assign you to one or more doctors.
          </p>
        </div>
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((doc, index) => (
            <DoctorCard key={doc.id || `doctor-${index}`} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}