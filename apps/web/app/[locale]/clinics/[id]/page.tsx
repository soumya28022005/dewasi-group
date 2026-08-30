"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Building2, BadgeCheck, Stethoscope, Loader2, Calendar, Star, Users, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClinicProfilePage() {
  const params = useParams();
  const clinicId = params.id as string;

  const [clinic, setClinic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchClinic() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
        // ফিক্স: /clinics/ এর পরিবর্তে /clinic/ দেওয়া হয়েছে
        const res = await fetch(`${API_URL}/clinic/${clinicId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const json = await res.json();
        if (json.success && json.data) {
          setClinic(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (clinicId) fetchClinic();
  }, [clinicId]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#14B8A6]" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading clinic profile...</p>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <Building2 className="h-10 w-10 text-red-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Clinic Not Found</h2>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* CLINIC HEADER SECTION */}
      <div className="relative rounded-[24px] p-[3px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-md mb-8">
        <div className="rounded-[calc(24px-3px)] bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          
          <div className="relative w-32 h-32 shrink-0 rounded-2xl border-4 border-slate-50 shadow-md bg-slate-100 overflow-hidden">
            {clinic.logo ? (
              <img src={clinic.logo} alt={clinic.clinicName} className="w-full h-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#252a67] text-3xl font-bold text-white">
                {initials(clinic.clinicName)}
              </div>
            )}
            {clinic.isApproved && <BadgeCheck className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-full text-[#2563EB]" />}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {clinic.clinicName}
            </h1>
            <p className="mt-2 flex items-center justify-center md:justify-start gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-[#14B8A6]" />
              {clinic.address ? `${clinic.address}, ` : ''}{clinic.city}, {clinic.state}
            </p>
            {clinic.onlineConsultationEnabled && (
              <span className="inline-block mt-3 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-200">
                Online Consultation Available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DOCTORS AVAILABLE AT THIS CLINIC */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 dark:text-white">
          <Users className="h-5 w-5 text-[#14B8A6]" />
          Doctors Available at this Clinic
        </h2>

        {clinic.allDoctors && clinic.allDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinic.allDoctors.map((doctor: any) => (
              <div key={doctor.id} className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {doctor.user?.avatar ? (
                    <img src={doctor.user.avatar} className="w-full h-full object-cover" alt={doctor.user?.name} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#2563EB] text-white font-bold text-xl">
                      {initials(doctor.user?.name || "DR")}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{doctor.user?.name}</h3>
                    <p className="text-xs text-[#0F766E] font-medium flex items-center gap-1 mt-0.5">
                      <Stethoscope className="h-3 w-3" /> {doctor.specialization || "General Physician"}
                    </p>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                      {doctor.isPrimary ? (
                        <p className="flex items-center gap-1"><Calendar className="h-3 w-3"/> Primary Clinic Doctor</p>
                      ) : (
                        <p className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {doctor.associationDetails?.dayOfWeek} • {doctor.associationDetails?.startTime}</p>
                      )}
                      <p className="font-semibold mt-1 text-slate-700 dark:text-slate-300">
                        Consultation Fee: <span className="text-[#252a67] dark:text-blue-400">₹{doctor.associationDetails?.fee || doctor.fee}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Link href={`/doctors/${doctor.id}`} className="flex-1 text-center bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
                      View Profile
                    </Link>
                    <Link href={`/doctors/${doctor.id}`} className="flex-1 flex justify-center items-center gap-1 bg-gradient-to-r from-[#252a67] to-[#14B8A6] text-white py-2 rounded-lg text-xs font-bold shadow-md hover:-translate-y-0.5 transition-transform">
                      Book Now <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-10 border border-dashed border-slate-200 dark:border-slate-700 text-slate-500">
            No doctors are currently listed for this clinic.
          </div>
        )}
      </div>

    </main>
  );
}