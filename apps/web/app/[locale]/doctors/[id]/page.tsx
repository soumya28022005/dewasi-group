"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Star, Award, Stethoscope, BadgeCheck, Clock, Calendar, CalendarCheck, Loader2, Building2, MapPin, Activity } from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import { ExtendedDoctor } from "@/types/doctor";
import { useBookAppointment } from "@/lib/hooks/useDoctorSearch"; 
import { api } from "@/lib/api"; // NEW: Using Axios instance for authenticated requests

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function GradientBorderCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[20px] p-[2px] bg-gradient-to-br from-[#2563EB] via-[#0F766E] to-[#14B8A6] shadow-sm ${className}`}>
      <div className="rounded-[calc(20px-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

export default function DoctorProfilePage() {
  const t = useTranslations("DoctorSearch");
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<ExtendedDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Booking States
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [selectedClinicId, setSelectedClinicId] = useState("");
  
  // NEW: Schedule States (Replacing freeform Time)
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [isFetchingSchedules, setIsFetchingSchedules] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const bookMutation = useBookAppointment();

  // 1. Fetch Doctor Profile
  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        if (res.data?.success && res.data?.data) {
          setDoctor(res.data.data);
          setSelectedClinicId(res.data.data.allClinics?.[0]?.id || res.data.data.clinicId);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  // 2. NEW: Fetch Schedules when Clinic changes and Booking is open
  useEffect(() => {
    async function fetchClinicSchedules() {
      if (!showBooking || !selectedClinicId || !doctorId) return;
      
      setIsFetchingSchedules(true);
      try {
        const res = await api.get(`/doctors/${doctorId}/clinics/${selectedClinicId}/schedules`);
        if (res.data?.success) {
          const activeSchedules = res.data.data.schedules.filter((s: any) => s.isActive);
          setSchedules(activeSchedules);
          if (activeSchedules.length > 0) {
            setSelectedScheduleId(activeSchedules[0].id);
          } else {
            setSelectedScheduleId("");
          }
        }
      } catch (err) {
        console.error("Failed to fetch schedules", err);
      } finally {
        setIsFetchingSchedules(false);
      }
    }
    fetchClinicSchedules();
  }, [showBooking, selectedClinicId, doctorId]);

  function handleBookClick() {
    if (!user) {
      router.push(`/login?redirect=/doctors/${doctorId}`);
      return;
    }
    setMessage(null);
    setShowBooking((v) => !v);
    if (!showBooking) {
      setDate(new Date().toISOString().split("T")[0]); // Default to today
    }
  }

  function handleConfirmBooking() {
    if (!date || !selectedScheduleId) {
      setMessage({ type: "error", text: t("pleaseSelectDateTime") || "Please select a date and session" });
      return;
    }

    const selectedSchedule = schedules.find(s => s.id === selectedScheduleId);
    if (!selectedSchedule) return;

    // Combine the selected date with the schedule's exact start time for the backend YYYY-MM-DDTHH:mm:ss format
    const dateTime = new Date(`${date}T${selectedSchedule.startTime}`);
    
    // Allow booking for today even if the start time has slightly passed (Live Queue logic)
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      setMessage({ type: "error", text: t("pastDateError") || "Please select a future date" });
      return;
    }
    
    bookMutation.mutate(
      { 
        doctorId: doctor!.id, 
        clinicId: selectedClinicId, 
        date: dateTime.toISOString(),
        scheduleId: selectedScheduleId // NEW: Injecting the required Schedule ID
      },
      {
        onSuccess: (appointment) => {
          setMessage({ type: "success", text: `${t("bookSuccess")} #${appointment.token || appointment.id}` });
          setTimeout(() => {
            setShowBooking(false);
            setMessage(null);
          }, 5000);
        },
        onError: (err) => setMessage({ type: "error", text: err.message || t("bookError") }),
      }
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#14B8A6]" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-50 p-3 text-red-500 mb-3">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Doctor Not Found</h2>
        <p className="mt-1 text-sm text-slate-500">The profile you are looking for does not exist.</p>
        <button onClick={() => router.back()} className="mt-4 rounded-lg bg-[#252a67] px-5 py-2 text-sm text-white font-medium">
          Go Back
        </button>
      </div>
    );
  }

  const avatarSrc = (doctor as any).profilePhoto || doctor.user?.avatar;
  const experienceYears = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const reviews = doctor.reviewCount ?? 120;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8 lg:px-8">
      <GradientBorderCard>
        <div className="p-5 sm:p-6 lg:p-8">
          
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            {/* Left: Compact Avatar */}
            <div className="relative w-32 h-40 shrink-0 rounded-xl border-2 border-slate-100 shadow-md bg-slate-50 overflow-hidden dark:border-slate-800 dark:bg-slate-800">
              {avatarSrc ? (
                <img src={avatarSrc} alt={doctor.user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-3xl font-bold text-white">
                  {initials(doctor.user.name)}
                </div>
              )}
              {experienceYears > 0 && (
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-[#252a67]/90 px-2 py-0.5 backdrop-blur-sm">
                  <Award className="h-3 w-3 text-amber-300" />
                  <span className="text-[10px] font-bold text-white">{experienceYears}+ Yrs</span>
                </div>
              )}
              <BadgeCheck className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-white text-[#2563EB] shadow-sm ring-1 ring-white dark:bg-slate-900 dark:ring-slate-900" />
            </div>

            {/* Right: Info */}
            <div className="flex-1 w-full text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                <span className="bg-gradient-to-r from-[#422995] to-[#4a9860] bg-clip-text text-transparent">
                  {doctor.user.name}
                </span>
              </h1>
              {doctor.qualification && <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{doctor.qualification}</p>}
              {doctor.specialization && (
                <p className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-sm text-[#0F766E] font-medium">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {doctor.specialization}
                </p>
              )}
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800 ml-1">{rating}</span>
                <span className="text-xs text-slate-400">({reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Available Clinics Highlighted Boxes */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5 dark:text-slate-200">
              <Building2 className="h-4 w-4 text-[#14B8A6]" />
              Available at
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.allClinics?.map((c) => (
                <div key={c.id} className="flex flex-col justify-between border-l-4 border-l-[#14B8A6] bg-slate-50 dark:bg-slate-800/50 rounded-r-xl p-3 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-sm text-[#252a67] dark:text-blue-300 leading-tight">{c.clinicName}</h4>
                    {c.isPrimary && <span className="shrink-0 bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-bold dark:bg-blue-900/40 dark:text-blue-400">Primary</span>}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3" />{c.city || 'Location not specified'}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Fee: <span className="text-[#0F766E]">₹{c.associationDetails?.fee || doctor.fee}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
            {!showBooking ? (
              <button onClick={handleBookClick} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#14B8A6] px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5">
                <Calendar className="h-4 w-4" />
                {t("bookButton") || "Book Appointment"}
              </button>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-[#252a67] dark:text-white">Select Booking Details</h4>
                  <button onClick={handleBookClick} className="text-xs font-semibold text-slate-400 hover:text-slate-700">Cancel</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Clinic Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Clinic</label>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 focus-within:border-[#14B8A6]">
                      <Building2 className="h-3.5 w-3.5 text-[#14B8A6]" />
                      <select value={selectedClinicId} onChange={(e) => setSelectedClinicId(e.target.value)} className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer">
                        {doctor.allClinics?.map((c) => (
                          <option key={c.id} value={c.id}>{c.clinicName} (₹{c.associationDetails?.fee || doctor.fee})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Date</label>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 focus-within:border-[#14B8A6]">
                      <Calendar className="h-3.5 w-3.5 text-[#14B8A6]" />
                      <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setMessage(null); }} min={new Date().toISOString().split("T")[0]} className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none" />
                    </div>
                  </div>

                  {/* NEW: Session/Schedule Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Session</label>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 focus-within:border-[#14B8A6]">
                      <Activity className="h-3.5 w-3.5 text-[#14B8A6]" />
                      {isFetchingSchedules ? (
                        <span className="text-xs text-slate-400">Loading...</span>
                      ) : schedules.length > 0 ? (
                        <select value={selectedScheduleId} onChange={(e) => { setSelectedScheduleId(e.target.value); setMessage(null); }} className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer">
                          {schedules.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.startTime} - {s.endTime} (Max: {s.maxPatients})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-red-500 font-semibold">No Sessions Available</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={bookMutation.isPending || !date || !selectedScheduleId}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#14B8A6] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
                  {bookMutation.isPending ? "Confirming..." : "Confirm Booking"}
                </button>

                {message && (
                  <div className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-bold ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CalendarCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {message.text}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </GradientBorderCard>
    </main>
  );
}