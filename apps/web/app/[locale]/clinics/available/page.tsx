"use client";

import { Building2, MapPin, Loader2, ArrowRight, Wifi } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePublicAllClinics, type PublicClinic } from "@/lib/hooks/usePublicDirectory";

export default function AvailableClinicsPage() {
  const { data: clinics, isLoading } = usePublicAllClinics();
  // Filter only clinics that have online consultation enabled
  const availableClinics = (clinics as PublicClinic[])?.filter(c => c.onlineConsultationEnabled) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative rounded-[20px] p-[3px] bg-gradient-to-r from-[#0F766E] to-[#14B8A6] shadow-sm mb-8">
        <div className="rounded-[calc(20px-3px)] bg-white dark:bg-slate-900 p-5 sm:p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Available Online Clinics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Clinics offering instant online consultation slots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-[#14B8A6] mx-auto col-span-full py-12" />}
        
        {!isLoading && availableClinics.map((clinic: PublicClinic) => (
          <Link href={`/clinics/${clinic.id}`} key={clinic.id} className="block group">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{clinic.clinicName}</h3>
              <p className="text-xs text-slate-500 mt-1">{clinic.city}</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full dark:bg-teal-950 dark:text-teal-400">
                <Wifi className="h-3 w-3" /> Online Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}