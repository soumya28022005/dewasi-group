"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MapPin, Stethoscope, BadgeCheck, Star, Award } from "lucide-react";

import { Link } from "@/i18n/routing";
import { usePublicAllDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";

import { ExtendedDoctor } from "@/types/doctor";

// ============================================================
// UTILITIES
// ============================================================

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "DR";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ============================================================
// COMPACT DOCTOR CARD (PREMIUM & CONSISTENT)
// ============================================================

function CompactDoctorCard({ doctor }: { doctor: ExtendedDoctor }) {
  const [imgError, setImgError] = React.useState(false);
  const experience = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const avatarSrc = (doctor as any).profilePhoto || doctor.user?.avatar;

  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="group block w-[300px] shrink-0"
      aria-label={`View profile of ${doctor.user.name}`}
    >
      <div className="flex h-[7.5rem] items-center rounded-3xl border-2 border-[#252a67] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        {/* Left: Photo */}
        <div className="relative mr-3 flex-shrink-0">
          {/* Experience Badge (Overlapping) */}
          {experience > 0 && (
            <div className="absolute -left-2 -top-2 z-10">
              <div className="flex items-center gap-1 rounded-full bg-[#252a67] px-2.5 py-1 text-[9px] font-bold text-white shadow-md whitespace-nowrap">
                <Award className="h-3 w-3 text-amber-400" />
                {experience}+ Yrs
              </div>
            </div>
          )}

          {/* Photo / Initials */}
          {avatarSrc && !imgError ? (
            <img
              src={avatarSrc}
              alt={doctor.user.name}
              onError={() => setImgError(true)}
              className="h-[5.5rem] w-[4.5rem] rounded-2xl border-2 border-[#252a67]/20 object-cover shadow-md"
            />
          ) : (
            <div className="flex h-[5.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-xl font-bold text-white shadow-md">
              {getInitials(doctor.user.name)}
            </div>
          )}

          {/* Verified Badge */}
          <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-[#2563EB] shadow-sm ring-1 ring-slate-100" />
        </div>

        {/* Right: Doctor Info */}
        <div className="flex min-w-0 flex-col justify-center">
          <h3 className="truncate text-[1.05rem] font-bold leading-tight text-slate-900">
            {doctor.user.name}
          </h3>
          {doctor.qualification && (
            <p className="mt-0.5 truncate text-[0.85rem] font-semibold text-black">
              {doctor.qualification}
            </p>
          )}
          {doctor.specialization && (
            <p className="mt-0.5 truncate text-[0.8rem] text-gray-600">
              {doctor.specialization}
            </p>
          )}

          {/* Bottom: Location + Rating */}
          <div className="mt-1.5 flex items-center gap-2">
            {location && (
              <p className="flex items-center gap-1 truncate text-[0.7rem] font-medium text-gray-500">
                <MapPin className="h-3 w-3 shrink-0 text-[#0F766E]" />
                <span className="truncate">{location}</span>
              </p>
            )}
            <span className="flex items-center gap-0.5 text-[0.7rem] font-semibold text-slate-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// MARQUEE ROW (Smooth & Consistent)
// ============================================================

function MarqueeRow({ doctors, duration }: { doctors: ExtendedDoctor[]; duration: string }) {
  if (!doctors || doctors.length === 0) return null;

  // Duplicate doctors for infinite scroll
  const doubledDoctors = [...doctors, ...doctors];

  return (
    <div className="group relative w-full overflow-hidden py-2">
      {/* Left Fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
      {/* Right Fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

      <div
        className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: duration }}
      >
        {doubledDoctors.map((doctor, index) => (
          <CompactDoctorCard key={`${doctor.id}-${index}`} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT - Two Rows (Right to Left)
// ============================================================

export default function AllDoctors() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicAllDoctors();
  const doctors = (data as ExtendedDoctor[]) ?? [];

  if (!isLoading && doctors.length === 0) return null;

  const midpoint = Math.ceil(doctors.length / 2);
  const firstRow = doctors.slice(0, midpoint);
  const secondRow = doctors.slice(midpoint);

  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          eyebrow="Browse the directory" 
          title={t("allDoctors")} 
          viewAllHref="/doctors" 
          viewAllLabel={t("viewAllDoctors") || "View All"} 
        />
      </div>

      {isLoading ? (
        <div className="space-y-4 px-4">
          {[1, 2].map((row) => (
            <div key={row} className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-[7.5rem] w-[300px] shrink-0 animate-pulse rounded-3xl border-2 border-slate-200 bg-slate-100" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Row 1 - Right to Left (40s) */}
          <MarqueeRow doctors={firstRow} duration="40s" />
          {/* Row 2 - Right to Left (55s) */}
          <MarqueeRow doctors={secondRow} duration="40s" />
        </div>
      )}
    </section>
  );
}