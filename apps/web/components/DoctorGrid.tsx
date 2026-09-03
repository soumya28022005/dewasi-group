"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MapPin, Stethoscope, BadgeCheck, Star, Award } from "lucide-react";
import type { Doctor as SharedDoctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";

export type ExtendedDoctor = SharedDoctor & {
  isVerified?: boolean;
  isFeatured?: boolean;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  clinic?: { clinicName: string; city?: string; };
  user: { name: string; email: string; phone?: string; avatar?: string | null; };
  // NEW: Real-time Live Status payload from Backend
  liveStatus?: {
    isLive: boolean;
    isAvailable: boolean;
    reason: string;
    capacity?: { booked: number; max: number } | null;
  };
};

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "DR";
  return name.trim().split(/\s+/).filter(Boolean).map((part) => part.charAt(0)).slice(0, 2).join("").toUpperCase();
}

function getDoctorAvatar(doctor: ExtendedDoctor) {
  return (doctor as ExtendedDoctor & { profilePhoto?: string | null; }).profilePhoto ?? doctor.user?.avatar ?? null;
}

function ExperienceBadge({ years }: { years: number; }) {
  if (!years || years <= 0) return null;
  return (
    <div className="absolute bottom-0 left-0 z-10 translate-y-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/90 bg-[#252a67]/95 px-2.5 py-1 shadow-[0_5px_14px_rgba(37,42,103,0.35)] backdrop-blur-sm">
        <Award className="h-3 w-3 shrink-0 text-amber-300" strokeWidth={2.5} />
        <span className="whitespace-nowrap text-[10px] font-extrabold tracking-wide text-white">{years}+ yrs</span>
      </div>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: ExtendedDoctor; }) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const experience = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const reviews = doctor.reviewCount ?? 0;
  const avatar = getDoctorAvatar(doctor);

  return (
    <Link href={`/doctors/${doctor.id}`} aria-label={`View profile of ${doctor.user.name}`} className="group block h-full min-w-0 outline-none">
      <div className="relative h-full rounded-2xl p-[3px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-[0_4px_20px_-6px_rgba(37,42,103,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_38px_-8px_rgba(20,184,166,0.30)]">
        <div className="h-full overflow-hidden rounded-[calc(1rem-3px)] bg-white dark:bg-slate-900">
          <div className="p-3 sm:p-4 lg:p-4.5 xl:p-5">
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left">
              
              {/* DOCTOR PHOTO */}
              <div className="relative mb-5 h-40 w-32 shrink-0 sm:h-44 sm:w-34 lg:mb-0 lg:mr-4 lg:h-40 lg:w-32 xl:h-44 xl:w-34">
                
                {/* NEW: LIVE DOT WITH CAPACITY OVERLAY */}
                {doctor.liveStatus?.isLive && (
                  <div className="absolute -top-2 -right-2 z-30 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md ring-2 ring-white dark:ring-slate-900">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-100 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                    </span>
                    LIVE
                    {doctor.liveStatus.capacity && (
                      <span className="ml-1 border-l border-red-300 pl-1.5">
                        {doctor.liveStatus.capacity.booked}/{doctor.liveStatus.capacity.max}
                      </span>
                    )}
                  </div>
                )}

                <div className="absolute inset-0 overflow-hidden rounded-xl border-2 border-[#252a67] bg-slate-100 shadow-[0_6px_18px_rgba(37,42,103,0.16)] dark:bg-slate-800">
                  {avatar ? (
                    <img src={avatar} alt={doctor.user.name} loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.035]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-2xl font-bold text-white">
                      {getInitials(doctor.user.name)}
                    </div>
                  )}
                </div>
                <ExperienceBadge years={experience} />
                {doctor.isVerified !== false && (
                  <BadgeCheck className="absolute -bottom-2 -right-2 z-20 h-6 w-6 rounded-full bg-white p-[1px] text-[#2563EB] shadow-md ring-2 ring-white dark:bg-slate-900 dark:ring-slate-900" />
                )}
              </div>

              {/* DOCTOR DETAILS */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-[17px] xl:text-lg">
                  <span className="bg-gradient-to-r from-[#252a67] to-[#14B8A6] bg-clip-text text-transparent">
                    {doctor.user.name}
                  </span>
                </h3>
                {doctor.qualification && (
                  <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-300">{doctor.qualification}</p>
                )}
                {doctor.specialization && (
                  <p className="mt-1 flex min-w-0 items-center justify-center gap-1 text-xs text-slate-500 lg:justify-start dark:text-slate-400">
                    <Stethoscope className="h-3 w-3 shrink-0 text-teal-600" />
                    <span className="truncate">{doctor.specialization}</span>
                  </p>
                )}
                <div className="mt-2 flex items-center justify-center gap-1 lg:justify-start">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3 w-3 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">({reviews})</span>
                </div>
                {doctor.fee != null && (
                  <p className="mt-1.5 text-sm font-bold text-[#252a67] dark:text-blue-400">
                    ₹{doctor.fee} <span className="text-xs font-normal text-slate-400"> / visit</span>
                  </p>
                )}
                {location && (
                  <p className="mt-1 flex min-w-0 items-center justify-center gap-1 text-xs text-slate-500 lg:justify-start dark:text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                    <span className="truncate">{location}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function GridSkeleton() {
  return (
    <div className="h-full min-h-[210px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
        <div className="h-40 w-32 shrink-0 animate-pulse rounded-xl bg-slate-200 sm:h-44 sm:w-34 lg:h-40 lg:w-32 xl:h-44 xl:w-34 dark:bg-slate-800" />
        <div className="flex w-full flex-1 flex-col items-center space-y-2 lg:items-start">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

// NEW: Accepts props from DoctorsPage to drive the API call
export default function DoctorGrid({ query, city, liveNow }: { query?: string; city?: string; liveNow?: boolean; }) {
  
  // NEW: Connects directly to the Advanced Search backend API
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors-search", query, city, liveNow],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (city) params.append("city", city);
      if (liveNow) params.append("liveNow", "true");

      const res = await api.get(`/doctors/advanced-search?${params.toString()}`);
      return res.data?.data?.doctors as ExtendedDoctor[] || [];
    }
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-full px-3 sm:px-4 lg:px-5">
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#252a67]/[0.07] text-[#252a67]"><Stethoscope className="h-4 w-4" /></div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Searching Doctors...</h2>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6">
          {Array.from({ length: 6 }).map((_, index) => <GridSkeleton key={index} />)}
        </div>
      </section>
    );
  }

  if (doctors.length === 0) {
    return (
      <section className="mx-auto w-full px-3 sm:px-4 lg:px-5">
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252a67]/[0.07] text-[#252a67] dark:bg-blue-950/40 dark:text-blue-400"><Stethoscope className="h-6 w-6" /></div>
          <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">No doctors available</h3>
          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">We couldn't find any doctors matching the current filters.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full px-3 pt-4 sm:px-4 sm:pt-5 lg:px-5 lg:pt-6">
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#252a67]/[0.07] text-[#252a67] sm:h-9 sm:w-9"><Stethoscope className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /></div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl dark:text-white">
              {liveNow ? "Live Doctors" : "Available Doctors"}
            </h2>
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500 sm:text-xs dark:text-slate-400">Find the right doctor for your consultation.</p>
          </div>
        </div>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700 sm:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {doctors.length} {doctors.length === 1 ? "Doctor" : "Doctors"} Available
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
}