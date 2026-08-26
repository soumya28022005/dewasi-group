"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { 
  MapPin, 
  Stethoscope, 
  BadgeCheck, 
  Star, 
  ArrowRight, 
  Award 
} from "lucide-react";

// Import the base Doctor type and extend it locally to prevent TS errors
import type { Doctor as SharedDoctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicAllDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";
import ViewAllButton from "@/components/ViewAllButton";
import HorizontalCarousel from "@/components/HorizontalCarousel";

// ============================================================
// TYPE DEFINITIONS
// ============================================================

// Extending the shared type to include missing UI properties safely
export type ExtendedDoctor = SharedDoctor & {
  isVerified?: boolean;
  isFeatured?: boolean;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  clinic?: {
    clinicName: string;
    city?: string;
  };
  user: {
    name: string;
    email: string;
    phone?: string;
  };
};

// ============================================================
// UTILITIES
// ============================================================

/**
 * Extracts up to 2 initials from a given name string.
 * Fallbacks to "DR" if the name is missing or invalid.
 */
function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "DR";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  
  return initials || "DR";
}

// ============================================================
// UI COMPONENTS
// ============================================================

/**
 * Premium gradient border wrapper with smooth hover transitions.
 */
function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative h-full rounded-[24px] bg-gradient-to-br from-slate-200 to-slate-200 p-[1.5px] transition-all duration-500 hover:from-[#2563EB] hover:via-[#0F766E] hover:to-[#14B8A6] hover:shadow-[0_16px_40px_-8px_rgba(37,99,235,0.25)] dark:from-slate-800 dark:to-slate-800">
      <div className="relative h-full w-full overflow-hidden rounded-[calc(24px-1.5px)] bg-white transition-colors dark:bg-slate-900">
        {/* Subtle hover overlay inside the card for a premium glass effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2563EB]/[0.02] to-[#0F766E]/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {children}
      </div>
    </div>
  );
}

/**
 * Compact, highly optimized card for the horizontal carousel.
 */
function DoctorMiniCard({ doctor }: { doctor: ExtendedDoctor }) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const experience = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const reviews = doctor.reviewCount ?? 120;

  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="block h-[290px] w-[240px] shrink-0"
      aria-label={`View profile of ${doctor.user.name}`}
    >
      <GradientBorderCard>
        <div className="relative flex h-full flex-col items-center p-5 text-center">
          {/* Decorative glow blob on hover */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#0F766E]/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />

          {/* Avatar Area */}
          <div className="relative mt-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-105">
              {getInitials(doctor.user.name)}
            </div>
            {/* Dynamic Verification Badge */}
            {(doctor.isVerified ?? true) && (
              <BadgeCheck className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-white text-[#2563EB] shadow-sm ring-2 ring-white dark:bg-slate-900 dark:ring-slate-900" />
            )}
          </div>

          {/* Name & Specialization */}
          <div className="mt-4 flex w-full flex-col items-center">
            <h4 className="w-full truncate text-base font-bold text-slate-900 dark:text-slate-100">
              {doctor.user.name}
            </h4>
            {doctor.specialization && (
              <p className="mt-1 flex w-full items-center justify-center gap-1.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                <span className="truncate">{doctor.specialization}</span>
              </p>
            )}
          </div>

          {/* Core Metrics */}
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            {experience > 0 && (
              <span className="flex items-center gap-1 font-semibold">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                {experience}+ Yrs
              </span>
            )}
            <span className="flex items-center gap-1 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-slate-800 dark:text-slate-200">{rating}</span>
              <span className="font-normal text-slate-400">({reviews})</span>
            </span>
          </div>

          {/* Flexible spacer to push the footer to the bottom */}
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
              View Profile
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </GradientBorderCard>
    </Link>
  );
}

/**
 * Premium Skeleton Loader mirroring the exact shape of the DoctorMiniCard.
 */
function DoctorSkeleton() {
  return (
    <div className="flex h-[290px] w-[240px] shrink-0 flex-col items-center rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mt-2 h-16 w-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
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

export default function AllDoctors() {
  const t = useTranslations("HomePage");
  
  // Custom hook fetching public doctor data
  const { data, isLoading } = usePublicAllDoctors();
  const doctors = (data as ExtendedDoctor[]) ?? [];

  // Gracefully hide the section if no doctors exist (and not loading)
  if (!isLoading && doctors.length === 0) {
    return null; 
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <SectionHeader eyebrow="Browse the directory" title={t("allDoctors")} />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex gap-5 overflow-hidden py-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <DoctorSkeleton key={item} />
          ))}
        </div>
      ) : (
        /* Loaded State with Carousel */
        <div className="py-4">
          <HorizontalCarousel ariaLabel={t("allDoctors")}>
            {doctors.map((doctor) => (
              <DoctorMiniCard key={doctor.id} doctor={doctor} />
            ))}
          </HorizontalCarousel>
        </div>
      )}

      {/* View All Action */}
      <div className="mt-8 flex justify-center">
        <ViewAllButton href="/doctors" label={t("viewAllDoctors")} />
      </div>
    </section>
  );
}