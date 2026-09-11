"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Star,
  Stethoscope,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  usePublicFeaturedClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";

function getInitials(name?: string) {
  if (!name) return "CL";
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   CLINIC IMAGE
========================================================= */

function ClinicImage({ src, name }: { src?: string | null; name?: string }) {
  const [broken, setBroken] = useState(false);
  const showImage = typeof src === "string" && src.trim().length > 0 && !broken;

  return (
    <div className="relative h-[140px] w-full overflow-hidden bg-[#F1F5F9] sm:h-[160px]">
      {showImage ? (
        <img
          src={src as string}
          alt={name || "Clinic"}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#14B8A6] to-[#0D9488]">
          <Building2 className="h-7 w-7 text-white/90 sm:h-8 sm:w-8" />
          <span className="mt-1.5 text-[18px] font-extrabold tracking-wide text-white sm:text-[20px]">
            {getInitials(name)}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
    </div>
  );
}

/* =========================================================
   FEATURED CLINIC CARD — fluid width for a grid, not a carousel
========================================================= */

function FeaturedClinicCard({ clinic }: { clinic: PublicClinic }) {
  const name = clinic.clinicName || "Clinic Center";

  const location =
    clinic.city && clinic.address
      ? `${clinic.city}, ${clinic.address}`
      : clinic.city || clinic.address || null;

  const rating = typeof clinic.rating === "number" ? clinic.rating : null;
  const doctorsCount = typeof clinic.doctorsCount === "number" ? clinic.doctorsCount : null;
  const specialties =
    Array.isArray(clinic.specialties) && clinic.specialties.length > 0
      ? clinic.specialties.slice(0, 2)
      : [];

  return (
    <Link
      href={`/clinics/${clinic.id}`}
      className="group block h-full rounded-[22px] bg-gradient-to-br from-[#252A67] via-[#3B4A8F] to-[#14B8A6] p-[3px] shadow-[0_6px_20px_rgba(15,27,51,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,99,231,0.14)] active:scale-[0.995]"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[19px] bg-white dark:bg-slate-900">
        {/* IMAGE */}
        <div className="relative">
          <ClinicImage src={clinic.logo} name={name} />

          {doctorsCount !== null && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-[#0D9488]/95 px-2 py-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:px-2.5 sm:py-[5px]">
              <Stethoscope className="h-[10px] w-[10px] text-white sm:h-[12px] sm:w-[12px]" />
              <span className="text-[9px] font-extrabold leading-none text-white sm:text-[11px]">
                {doctorsCount} Doctor{doctorsCount === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
          <h3 className="truncate text-[14px] font-extrabold leading-[20px] text-[#0F1B33] dark:text-white sm:text-[15px]">
            {name}
          </h3>

          {location && (
            <div className="mt-1.5 flex min-w-0 items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 text-[#16A34A]" />
              <span className="truncate text-[11px] leading-[16px] text-slate-500 dark:text-slate-400 sm:text-[12px]">
                {location}
              </span>
            </div>
          )}

          {specialties.length > 0 && (
            <div className="mt-2 flex gap-1.5 overflow-hidden">
              {specialties.map((tag) => (
                <span
                  key={tag}
                  className="max-w-[120px] truncate rounded-md bg-[#F1F5F9] px-2 py-1 text-[10px] font-semibold leading-none text-[#475569] dark:bg-slate-800 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-[#F1F5F9] pt-3 dark:border-slate-800">
            {rating !== null ? (
              <div className="flex items-center gap-1 rounded-full bg-[#FEF9C3] px-2 py-1 dark:bg-amber-500/10">
                <Star className="h-3 w-3 fill-[#EAB308] text-[#EAB308]" />
                <span className="text-[11px] font-extrabold leading-none text-[#A16207] dark:text-amber-400">
                  {rating.toFixed(1)}
                </span>
              </div>
            ) : (
              <span />
            )}

            <span className="flex items-center gap-0.5 text-[13px] font-bold leading-none text-[#1C63E7] dark:text-blue-400">
              View
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function FeaturedClinicsPage() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicFeaturedClinics();
  const featured = (data ?? []).filter((clinic) => clinic?.id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ================= HEADER — matches /doctors/featured ================= */}
      <div className="relative mb-8 rounded-[20px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[3px] shadow-[0_4px_15px_-6px_rgba(37,42,103,0.3)]">
        <div className="relative overflow-hidden rounded-[17px] bg-white p-5 dark:bg-slate-900 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#252a67]/[0.06] to-[#14B8A6]/[0.06] blur-3xl" />
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#252a67] dark:text-blue-300">
              Featured Directory
            </p>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {t("featuredClinics") || "Featured Clinics"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Modern facilities with live token queues, hand-picked for you.
          </p>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading &&
          [1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-[280px] animate-pulse rounded-[22px] bg-slate-100 dark:bg-slate-800"
            />
          ))}

        {!isLoading && featured.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">
              No Featured Clinics
            </p>
            <p className="mt-1 text-sm text-slate-500">
              We couldn't find any featured clinics at the moment.
            </p>
          </div>
        )}

        {featured.map((clinic) => (
          <FeaturedClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </main>
  );
}