"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Sparkles, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePublicFeaturedClinics } from "@/lib/hooks/usePublicDirectory";

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function FeaturedClinicsPage() {
  const { data: clinics, isLoading } = usePublicFeaturedClinics();
  const featuredClinics = clinics ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="relative rounded-[20px] p-[3px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-sm mb-8">
        <div className="rounded-[calc(20px-3px)] bg-white dark:bg-slate-900 p-5 sm:p-6 overflow-hidden relative">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#252a67]/[0.06] to-[#14B8A6]/[0.06] blur-3xl" />
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#252a67] dark:text-blue-300">
              Featured Network
            </p>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Featured Clinics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Our top recommended and highly rated healthcare facilities.
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-[#2563EB]" />
            <p className="mt-3 text-sm font-semibold text-slate-500">Loading featured clinics...</p>
          </div>
        )}

        {!isLoading && featuredClinics.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500">
            No Featured Clinics available at the moment.
          </div>
        )}

        {featuredClinics.map((clinic) => (
          <Link href={`/clinics/${clinic.id}`} key={clinic.id} className="block group">
            <div className="relative rounded-[20px] p-[2px] bg-gradient-to-br from-[#2563EB] to-[#14B8A6] shadow-sm transition-transform hover:-translate-y-1">
              <div className="rounded-[calc(20px-2px)] bg-white p-4 h-full text-center">
                <div className="mx-auto w-20 h-20 rounded-xl overflow-hidden mb-3 border border-slate-100 shadow-sm relative">
                  {clinic.logo ? (
                    <img src={clinic.logo} alt={clinic.clinicName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#252a67] text-white font-bold">{initials(clinic.clinicName)}</div>
                  )}
                  {clinic.isApproved && <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full text-[#2563EB]" />}
                </div>
                <h3 className="font-bold text-sm text-slate-800 truncate">{clinic.clinicName}</h3>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {clinic.city || "Location N/A"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}