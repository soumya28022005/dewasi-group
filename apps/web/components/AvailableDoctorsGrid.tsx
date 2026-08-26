"use client";

import { useTranslations } from "next-intl";
import { MapPin, Stethoscope, Clock, CheckCircle2 } from "lucide-react";

import type { Doctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicAvailableDoctors } from "@/lib/hooks/usePublicDirectory";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function AvailableDoctorCard({ doctor }: { doctor: Doctor }) {
  const t = useTranslations("AvailableDoctors");
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;

  return (
    <Link
      href="/doctors"
      className="
        group relative block overflow-hidden rounded-3xl
        border border-gray-200/80 bg-white p-5
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]
        dark:border-soft-300 dark:bg-surface
      "
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 via-[var(--color-primary)] to-green-500 opacity-90" />

      <div className="flex items-center gap-4 pt-3">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-primary)]/10 text-lg font-bold text-[var(--color-primary-text)] ring-1 ring-gray-100 dark:ring-soft-300">
            {initials(doctor.user.name)}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500 dark:border-surface">
            <CheckCircle2 className="h-3 w-3 text-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[var(--color-primary-dark-text)]">
            {doctor.user.name}
          </h3>

          {doctor.specialization && (
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-medium text-gray-500 dark:text-ink-500">
              <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
              {doctor.specialization}
            </p>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-gray-100 dark:bg-soft-100" />

      <div className="flex flex-wrap items-center gap-2">
        {location && (
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-600 dark:bg-soft-50 dark:text-ink-600">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary-text)]" />
            <span className="truncate">{location}</span>
          </span>
        )}

        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
          <Clock className="h-3.5 w-3.5" />
          {t("availableNow") || "Available Now"}
        </span>
      </div>
    </Link>
  );
}

export default function AvailableDoctorsGrid() {
  const t = useTranslations("AvailableDoctors");
  const { data, isLoading, isError } = usePublicAvailableDoctors();
  const doctors = data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-3xl border border-gray-100 bg-gray-50 dark:border-soft-300 dark:bg-soft-50"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-dashed border-red-200 bg-red-50/60 p-14 text-center dark:border-red-500/25 dark:bg-red-500/5">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          {t("loadError") || "Could not load available doctors right now. Please try again shortly."}
        </p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 p-14 text-center dark:border-soft-300 dark:bg-soft-50/70">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-surface dark:ring-soft-300">
          <Clock className="h-7 w-7 text-gray-400 dark:text-ink-400" />
        </div>
        <p className="text-lg font-bold text-gray-800 dark:text-ink-800">
          {t("noResults") || "No doctors are available right now."}
        </p>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-ink-500">
          {t("checkBack") || "Check back shortly, or browse the full doctor directory."}
        </p>
        <Link
          href="/doctors"
          className="mt-4 inline-flex rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--color-primary-dark)]"
        >
          {t("browseAllDoctors") || "Browse All Doctors"}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {doctors.map((doctor) => (
        <AvailableDoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}