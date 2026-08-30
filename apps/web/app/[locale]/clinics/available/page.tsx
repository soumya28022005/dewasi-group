"use client";

import { MapPin, Loader2, Wifi, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePublicAvailableClinics, type PublicClinic } from "@/lib/hooks/usePublicDirectory";

export default function AvailableClinicsPage() {
  // Using the new hook: backend returns ONLY open clinics
  const { data: availableClinics, isLoading } = usePublicAvailableClinics();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative rounded-[20px] p-[3px] bg-gradient-to-r from-[#0F766E] to-[#14B8A6] shadow-sm mb-8">
        <div className="rounded-[calc(20px-3px)] bg-white dark:bg-slate-900 p-5 sm:p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Available Online Clinics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Clinics currently open and offering instant online consultation slots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-[#14B8A6] mx-auto col-span-full py-12" />}
        
        {!isLoading && (!availableClinics || availableClinics.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No clinics are currently available. Please check back later.
          </div>
        )}

        {!isLoading && availableClinics?.map((clinic: PublicClinic) => (
          <Link href={`/clinics/${clinic.id}`} key={clinic.id} className="block group">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{clinic.clinicName}</h3>
              
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                {clinic.city || "No city provided"}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {clinic.onlineConsultationEnabled && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full dark:bg-teal-950 dark:text-teal-400">
                    <Wifi className="h-3 w-3" /> Online
                  </span>
                )}
                
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  clinic.availability?.isAvailable 
                    ? 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400'
                    : 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400'
                }`}>
                  <Clock className="h-3 w-3" /> 
                  {clinic.availability?.status || 'Open'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}