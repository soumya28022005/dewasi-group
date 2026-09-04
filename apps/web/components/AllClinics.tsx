"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Building2, BadgeCheck, Wifi, Users, ArrowRight } from "lucide-react";

import { Link } from "@/i18n/routing";
import { usePublicAllClinics, type PublicClinic } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";
import HorizontalCarousel from "@/components/HorizontalCarousel";

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "CL";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative h-full rounded-[26px] p-[3px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-[0_4px_20px_-6px_rgba(37,42,103,0.3)] transition-all duration-500 hover:shadow-[0_12px_40px_-8px_rgba(20,184,166,0.4)]">
      <div className="relative h-full w-full overflow-hidden rounded-[calc(26px-3px)] bg-white transition-colors dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}

function ClinicMiniCard({ clinic }: { clinic: PublicClinic }) {
  const location = [clinic.city, clinic.state].filter(Boolean).join(", ") || clinic.address;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link href={`/clinics/${clinic.id}`} className="block h-[260px] w-[220px] shrink-0">
      <GradientBorderCard>
        <div className="relative flex h-full flex-col items-center p-4 text-center">
          <div className="relative mt-2">
            <div className="flex w-[5rem] h-[6.5rem] overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-2xl font-bold text-white shadow-lg">
              {clinic.logo && !logoFailed ? (
                <img src={clinic.logo} alt={clinic.clinicName} onError={() => setLogoFailed(true)} className="h-full w-full object-cover" />
              ) : (
                getInitials(clinic.clinicName)
              )}
            </div>
            {clinic.isApproved && (
              <BadgeCheck className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-white text-[#2563EB] shadow-sm ring-2 ring-white" />
            )}
          </div>

          <div className="mt-3 flex w-full flex-col items-center">
            <h4 className="w-full truncate text-sm font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-[#422995] to-[#4a9860] bg-clip-text text-transparent">
                {clinic.clinicName}
              </span>
            </h4>
            {clinic.specialties && clinic.specialties.length > 0 && (
              <p className="mt-0.5 flex w-full items-center justify-center gap-1.5 truncate text-[11px] font-medium text-slate-500">
                <Building2 className="h-3 w-3 shrink-0 text-[#0F766E]" />
                <span className="truncate">{clinic.specialties.slice(0, 2).join(" · ")}</span>
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
            {typeof clinic.doctorsCount === "number" && (
              <span className="flex items-center gap-1 font-semibold">
                <Users className="h-3 w-3 text-amber-500" />
                {clinic.doctorsCount} Dr{clinic.doctorsCount === 1 ? "" : "s"}
              </span>
            )}
            {clinic.onlineConsultationEnabled && (
              <span className="flex items-center gap-1 font-semibold text-[#0F766E]">
                <Wifi className="h-3 w-3" /> Online
              </span>
            )}
          </div>

          <div className="flex-1" />

          <div className="w-full space-y-2">
            {location && (
              <p className="flex w-full items-center justify-center gap-1 truncate text-[11px] text-slate-400">
                <MapPin className="h-3 w-3 shrink-0 text-[#0F766E]" />
                <span className="truncate">{location}</span>
              </p>
            )}

            <div className="flex w-full items-center justify-center gap-1 rounded-lg bg-slate-50 py-2 text-[11px] font-bold text-slate-600 transition-all group-hover:bg-[#14B8A6]/10 group-hover:text-[#2563EB]">
              View Clinic
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </GradientBorderCard>
    </Link>
  );
}

function ClinicSkeleton() {
  return (
    <div className="flex h-[320px] w-[220px] shrink-0 flex-col items-center rounded-[26px] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mt-2 w-[5rem] h-[6.5rem] animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
      <div className="flex-1" />
      <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

export default function AllClinics() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicAllClinics();
  const clinics = data ?? [];

  if (!isLoading && clinics.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <SectionHeader 
        eyebrow="Partner Network" 
        title={t("allClinics")} 
        viewAllHref="/clinics" 
        viewAllLabel="View All" 
      />

      {isLoading ? (
        <div className="flex gap-5 overflow-hidden py-4">
          {[1, 2, 3, 4, 5].map((item) => <ClinicSkeleton key={item} />)}
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
    </section>
  );
}