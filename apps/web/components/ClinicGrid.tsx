"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  ShieldCheck,
  Wifi,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

import {
  usePublicAllClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Gradient Border                                                            */
/* -------------------------------------------------------------------------- */

function GradientBorderCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative h-full rounded-[24px] p-[3px]
        bg-gradient-to-br
        from-[#2563EB]
        via-[#0F766E]
        to-[#14B8A6]
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_35px_rgba(37,99,235,0.14)]
        ${className}
      `}
    >
      <div className="relative h-full overflow-hidden rounded-[calc(24px-3px)] bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Clinic Card                                                                */
/* -------------------------------------------------------------------------- */

function ClinicCard({ clinic }: { clinic: PublicClinic }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const location = [clinic.address, clinic.city, clinic.state]
    .filter(Boolean)
    .join(", ");

  return (
    <GradientBorderCard>
      <div
        className="
          group relative flex h-full min-h-[290px] flex-col
          overflow-hidden p-4
        "
        role="article"
        aria-label={`Clinic: ${clinic.clinicName}`}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br from-[#2563EB]/5 to-[#14B8A6]/10 blur-2xl transition-all duration-500 group-hover:scale-125" />

        {/* ---------------------------------------------------------------- */}
        {/* Header / Logo                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative flex items-center gap-3">
          {/* Logo */}
          <div className="relative h-[88px] w-[88px] shrink-0">
            <div
              className="
                h-full w-full overflow-hidden rounded-2xl
                border-2 border-[#252a67]
                bg-slate-50
                shadow-[0_4px_14px_rgba(37,42,103,0.12)]
                transition-transform duration-300
                group-hover:scale-[1.02]
                dark:bg-slate-800
              "
            >
              {clinic.logo && !logoFailed ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={clinic.logo}
                  alt={clinic.clinicName}
                  onError={() => setLogoFailed(true)}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="
                    flex h-full w-full items-center justify-center
                    bg-gradient-to-br from-[#2563EB] to-[#0F766E]
                    text-xl font-extrabold text-white
                  "
                >
                  {initials(clinic.clinicName)}
                </div>
              )}
            </div>

            {/* Verified badge */}
            {clinic.isApproved && (
              <div
                className="
                  absolute -bottom-1.5 -right-1.5 z-10
                  flex h-6 w-6 items-center justify-center
                  rounded-full bg-white
                  shadow-md ring-2 ring-white
                  dark:bg-slate-900 dark:ring-slate-900
                "
              >
                <ShieldCheck
                  className="h-4 w-4 text-[#2563EB]"
                  strokeWidth={2.5}
                />
              </div>
            )}
          </div>

          {/* Clinic name/details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-1.5">
              <h3
                className="
                  min-w-0 truncate
                  text-base font-extrabold tracking-tight
                  text-slate-900 dark:text-slate-100
                "
              >
                <span className="bg-gradient-to-r from-[#422995] to-[#4a9860] bg-clip-text text-transparent">
                  {clinic.clinicName}
                </span>
              </h3>
            </div>

            {typeof clinic.doctorsCount === "number" && (
              <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                {clinic.doctorsCount} doctor
                {clinic.doctorsCount === 1 ? "" : "s"} associated
              </p>
            )}

            {clinic.isApproved && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#2563EB]/8 px-2 py-1 text-[10px] font-bold text-[#2563EB] dark:bg-blue-500/10 dark:text-blue-400">
                <ShieldCheck className="h-3 w-3" />
                Verified Clinic
              </div>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Divider                                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

        {/* ---------------------------------------------------------------- */}
        {/* Location & Specialties                                          */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative space-y-2.5">
          {location && (
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#252a67]" />

              <span className="line-clamp-2 leading-relaxed">
                {location}
              </span>
            </div>
          )}

          {clinic.specialties && clinic.specialties.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#14B8A6]" />

              <span className="line-clamp-2 leading-relaxed">
                {clinic.specialties.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Badges                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative mt-4 flex min-h-[30px] flex-wrap items-center gap-2">
          {clinic.onlineConsultationEnabled && (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-[#14B8A6]/10
                px-2.5 py-1.5
                text-[10px] font-bold
                text-[#0F766E]
                dark:bg-teal-500/10
                dark:text-teal-400
              "
            >
              <Wifi className="h-3 w-3" />
              Online Consultation
            </span>
          )}

          {clinic.isApproved && (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-[#252a67]/8
                px-2.5 py-1.5
                text-[10px] font-bold
                text-[#252a67]
                dark:bg-blue-500/10
                dark:text-blue-400
              "
            >
              <ShieldCheck className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>

        {/* Push action to bottom */}
        <div className="flex-1" />

        {/* ---------------------------------------------------------------- */}
        {/* View Clinic Button                                               */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            relative mt-4 flex w-full
            items-center justify-center gap-1.5
            rounded-xl
            bg-slate-50
            px-3 py-2.5
            text-[11px] font-bold
            text-slate-600
            transition-all duration-300
            group-hover:bg-gradient-to-r
            group-hover:from-[#2563EB]/10
            group-hover:to-[#0F766E]/10
            group-hover:text-[#2563EB]
            dark:bg-slate-800
            dark:text-slate-300
          "
        >
          View Clinic
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </GradientBorderCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function ClinicSkeleton() {
  return (
    <div
      className="
        h-full min-h-[290px]
        rounded-[24px]
        border border-slate-200
        bg-white p-4
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="flex items-center gap-3">
        <div className="h-[88px] w-[88px] shrink-0 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

      <div className="space-y-3">
        <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-3/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="mt-5 flex gap-2">
        <div className="h-7 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="mt-8 h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Clinic Grid                                                                */
/* -------------------------------------------------------------------------- */

export default function ClinicGrid({ query = "" }: { query?: string }) {
  const t = useTranslations("ClinicSearch");
  const { data, isLoading, isError } = usePublicAllClinics();

  const filtered = useMemo(() => {
    const clinics = data ?? [];
    const q = query.trim().toLowerCase();

    if (!q) return clinics;

    return clinics.filter((clinic) => {
      const haystack = [
        clinic.clinicName,
        clinic.city,
        clinic.state,
        clinic.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [data, query]);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <ClinicSkeleton key={index} />
        ))}
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  if (isError) {
    return (
      <div className="rounded-[24px] border border-dashed border-red-200 bg-red-50/60 p-14 text-center dark:border-red-500/25 dark:bg-red-500/5">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          {t("loadError") ||
            "Could not load clinics right now. Please try again shortly."}
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Empty                                                                  */
  /* ---------------------------------------------------------------------- */

  if (filtered.length === 0) {
    return (
      <div className="col-span-full rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-14 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <Clock className="h-7 w-7 text-slate-400" />
        </div>

        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {t("noResults") || "No clinics found."}
        </p>

        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your search.
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Grid                                                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
      {filtered.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}