"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Loader2, Building2, BadgeCheck, Wifi, Users, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocationCity } from "@/lib/hooks/useLocationCity";
import DirectoryFilterBar from "@/components/DirectoryFilterBar";
import { usePublicAllClinics, type PublicClinic } from "@/lib/hooks/usePublicDirectory";

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClinicsPage() {
  const t = useTranslations("ClinicSearch");
  const { city } = useLocationCity();
  const [query, setQuery] = useState("");

  const { data, isLoading } = usePublicAllClinics();

  // Frontend filtering based on Search Query and Global City
  const filteredClinics = (data as PublicClinic[])?.filter((clinic) => {
    const matchesCity = city ? clinic.city?.toLowerCase() === city.toLowerCase() : true;
    const matchesQuery = query ? clinic.clinicName.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesCity && matchesQuery;
  }) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-sm">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Clinics
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Search for trusted healthcare facilities near you
          </p>
        </div>
      </div>

      {/* Global Search & Location Bar */}
      <DirectoryFilterBar onSearch={setQuery} defaultCity={city} />

      {/* Grid */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#14B8A6]" />
            <p className="mt-3 text-sm font-semibold text-slate-500">Loading clinics...</p>
          </div>
        ) : filteredClinics.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Building2 className="h-10 w-10 text-slate-400 mb-3" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No Clinics Found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredClinics.map((clinic) => (
              <Link href={`/clinics/${clinic.id}`} key={clinic.id} className="block group h-full">
                <div className="relative h-full rounded-2xl p-[2px] bg-gradient-to-br from-[#252a67] to-[#14B8A6] shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="bg-white dark:bg-slate-900 rounded-[calc(1rem-2px)] p-5 h-full flex flex-col">
                    
                    {/* Clinic Header Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-100 dark:border-slate-800">
                        {clinic.logo ? (
                          <img src={clinic.logo} alt={clinic.clinicName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#252a67] text-white font-bold text-xl">
                            {initials(clinic.clinicName)}
                          </div>
                        )}
                        {clinic.isApproved && (
                          <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full text-[#2563EB]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">{clinic.clinicName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                          <MapPin className="h-3.5 w-3.5 text-[#14B8A6] shrink-0" /> 
                          <span className="truncate">{clinic.city || clinic.address || "Location N/A"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Specialists & Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs mt-auto mb-4">
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                        <Users className="h-3.5 w-3.5 text-[#14B8A6]" />
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {clinic.doctorsCount && clinic.doctorsCount > 0 ? `${clinic.doctorsCount} Specialists` : "Specialists Onboarding"}
                        </span>
                      </div>
                      {clinic.onlineConsultationEnabled && (
                        <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800">
                          <Wifi className="h-3.5 w-3.5 text-[#0F766E] dark:text-teal-400" />
                          <span className="font-bold text-[#0F766E] dark:text-teal-400">Online</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Call to Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-[#252a67] dark:text-blue-400 group-hover:text-[#14B8A6]">
                      <span>View Clinic Details</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}