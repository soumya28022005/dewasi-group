"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Building2,
  BadgeCheck,
  Wifi,
  Users,
  ArrowRight,
} from "lucide-react";

import { Link } from "@/i18n/routing";
import {
  usePublicAllClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";
import ViewAllButton from "@/components/ViewAllButton";
import HorizontalCarousel from "@/components/HorizontalCarousel";

// ============================================================
// UTILITIES
// ============================================================

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "CL";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials || "CL";
}

// ============================================================
// UI COMPONENTS
// ============================================================

function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative h-full rounded-[26px] p-[3px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-[0_4px_20px_-6px_rgba(37,42,103,0.3)] transition-all duration-500 hover:shadow-[0_12px_40px_-8px_rgba(20,184,166,0.4)] hover:from-[#2563EB] hover:via-[#0F766E] hover:to-[#14B8A6] dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 dark:hover:from-[#2563EB] dark:hover:via-[#0F766E] dark:hover:to-[#14B8A6]">
      <div className="relative h-full w-full overflow-hidden rounded-[calc(26px-3px)] bg-white transition-colors dark:bg-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2563EB]/[0.03] to-[#0F766E]/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {children}
      </div>
    </div>
  );
}

function ClinicMiniCard({ clinic }: { clinic: PublicClinic }) {
  const location = [clinic.city, clinic.state].filter(Boolean).join(", ") || clinic.address;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link
      href="/clinics"
      className="block h-[350px] w-[240px] shrink-0"
      aria-label={`View profile of ${clinic.clinicName}`}
    >
      <GradientBorderCard>
        <div className="relative flex h-full flex-col items-center p-5 text-center">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#0F766E]/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />

          {/* Logo Area - matches doctor avatar sizing (6rem x 8rem) */}
          <div className="relative mt-2">
            <div className="flex w-[6rem] h-[8rem] overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-3xl font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-105">
              {clinic.logo && !logoFailed ? (
                <img
                  src={clinic.logo}
                  alt={clinic.clinicName}
                  onError={() => setLogoFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(clinic.clinicName)
              )}
            </div>
            {clinic.isApproved && (
              <BadgeCheck className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-white text-[#2563EB] shadow-sm ring-2 ring-white dark:bg-slate-900 dark:ring-slate-900" />
            )}
          </div>

          {/* Name & Specialties - same style as Doctor mini card */}
          <div className="mt-4 flex w-full flex-col items-center">
            <h4 className="w-full truncate text-base font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#422995] to-[#4a9860] bg-clip-text text-transparent">
                {clinic.clinicName}
              </span>
            </h4>
            {clinic.specialties && clinic.specialties.length > 0 && (
              <p className="mt-1 flex w-full items-center justify-center gap-1.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                <span className="truncate">{clinic.specialties.slice(0, 2).join(" · ")}</span>
              </p>
            )}
          </div>

          {/* Core Metrics */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            {typeof clinic.doctorsCount === "number" && (
              <span className="flex items-center gap-1 font-semibold">
                <Users className="h-3.5 w-3.5 text-amber-500" />
                {clinic.doctorsCount} Dr{clinic.doctorsCount === 1 ? "" : "s"}
              </span>
            )}
            {clinic.onlineConsultationEnabled && (
              <span className="flex items-center gap-1 font-semibold text-[#0F766E]">
                <Wifi className="h-3.5 w-3.5" />
                Online
              </span>
            )}
          </div>

          <div className="flex-1" />

          {/* Location & Call to Action */}
          <div className="w-full space-y-3">
            {location && (
              <p className="flex w-full items-center justify-center gap-1 truncate text-xs text-slate-400 dark:text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                <span className="truncate">{location}</span>
              </p>
            )}

            <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-600 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#2563EB]/10 group-hover:to-[#0F766E]/10 group-hover:text-[#2563EB] dark:bg-slate-800 dark:text-slate-300">
              View Clinic
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </GradientBorderCard>
    </Link>
  );
}

function ClinicSkeleton() {
  return (
    <div className="flex h-[350px] w-[240px] shrink-0 flex-col items-center rounded-[26px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mt-2 w-[6rem] h-[8rem] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="mt-5 h-5 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-3 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="flex-1" />
      <div className="mb-3 h-3 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="h-9 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AllClinics() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicAllClinics();
  const clinics = data ?? [];

  if (!isLoading && clinics.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <SectionHeader eyebrow="Partner Network" title={t("allClinics")} />

      {isLoading ? (
        <div className="flex gap-5 overflow-hidden py-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <ClinicSkeleton key={item} />
          ))}
        </div>
      ) : (
        <div className="py-4">
          <HorizontalCarousel ariaLabel={t("allClinics")}>
            {clinics.map((clinic) => (
              <ClinicMiniCard key={clinic.id} clinic={clinic} />
            ))}
          </HorizontalCarousel>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <ViewAllButton href="/clinics" label={t("viewAllClinics")} />
      </div>
    </section>
  );
}