"use client";

import { useTranslations } from "next-intl";
import { MapPin, Stethoscope, BadgeCheck, Star, ArrowRight, Award, Sparkles } from "lucide-react";

import type { Doctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicAllDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";
import ViewAllButton from "@/components/ViewAllButton";
import HorizontalCarousel from "@/components/HorizontalCarousel";

// ============================================================
// INITIALS
// ============================================================

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ============================================================
// GRADIENT BORDER WRAPPER (World-Class)
// ============================================================

function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[24px] p-[2px] bg-gradient-to-br from-[#2563EB] via-[#0F766E] to-[#14B8A6] shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)] transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(37,99,235,0.25)]">
      <div className="rounded-[calc(24px-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Compact Doctor Card (Premium)
// ============================================================

function DoctorMiniCard({ doctor }: { doctor: Doctor }) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const experience = doctor.experience ?? 0;
  const rating = (doctor as any).rating ?? 4.5;
  const reviews = (doctor as any).reviewCount ?? 120;

  return (
    <Link
      href="/doctors"
      className="group block w-[200px] shrink-0 sm:w-[220px]"
    >
      <GradientBorderCard>
        <div className="relative flex flex-col items-center p-5 text-center">
          {/* Decorative blob */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563EB]/5 to-[#0F766E]/10 blur-2xl" />

          {/* Avatar */}
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-lg font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              {initials(doctor.user.name)}
            </div>
            <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-[#2563EB] shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700" />
          </div>

          {/* Name & Specialization */}
          <h4 className="mt-3 w-full truncate text-base font-bold text-slate-900 dark:text-slate-100">
            {doctor.user.name}
          </h4>

          {doctor.specialization && (
            <p className="mt-0.5 flex w-full items-center justify-center gap-1.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
              <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
              <span className="truncate">{doctor.specialization}</span>
            </p>
          )}

          {/* Experience & Rating (inline, minimal) */}
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            {experience > 0 && (
              <span className="flex items-center gap-1 font-medium">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                {experience}+ yrs
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700">{rating}</span>
              <span className="text-[10px] text-slate-400">({reviews})</span>
            </span>
          </div>

          {/* Location */}
          {location && (
            <p className="mt-1.5 flex w-full items-center justify-center gap-1 truncate text-xs text-slate-400 dark:text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
              <span className="truncate">{location}</span>
            </p>
          )}

          {/* CTA (premium) */}
          <div className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB]/5 to-[#0F766E]/5 py-2 text-xs font-semibold text-[#2563EB] transition-all group-hover:from-[#2563EB]/10 group-hover:to-[#0F766E]/10 group-hover:text-[#2563EB]">
            View Profile
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </GradientBorderCard>
    </Link>
  );
}

// ============================================================
// MAIN SECTION
// ============================================================

export default function AllDoctors() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicAllDoctors();
  const doctors = data ?? [];

  if (!isLoading && doctors.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <SectionHeader eyebrow="Browse the directory" title={t("allDoctors")} />

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-[220px] w-[200px] shrink-0 animate-pulse rounded-[24px] border border-slate-100 bg-slate-50 sm:w-[220px] dark:border-slate-800 dark:bg-slate-800/50"
            />
          ))}
        </div>
      ) : (
        <HorizontalCarousel ariaLabel={t("allDoctors")}>
          {doctors.map((doctor) => (
            <DoctorMiniCard key={doctor.id} doctor={doctor} />
          ))}
        </HorizontalCarousel>
      )}

      <ViewAllButton href="/doctors" label={t("viewAllDoctors")} />
    </section>
  );
}