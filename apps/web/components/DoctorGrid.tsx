"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  Clock,
  ChevronRight,
  BadgeCheck,
  Stethoscope,
  Award,
  Loader2,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

import type { Doctor } from "@doctor-contract/shared";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/routing";
import {
  useDoctorSearch,
  useBookAppointment,
} from "@/lib/hooks/useDoctorSearch";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function GradientBorderCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[28px] p-[3.5px] bg-gradient-to-br from-[#2563EB] via-[#0F766E] to-[#14B8A6] shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_16px_50px_rgba(37,99,235,0.15)] ${className}`}>
      <div className="rounded-[calc(28px-1.5px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

export default function DoctorGrid({
  query,
  city,
}: {
  query: string;
  city?: string;
}) {
  const t = useTranslations("DoctorSearch");
  const { data: doctors, isLoading } = useDoctorSearch(query, city);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {isLoading && (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-[#2563EB]" />
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            {t("loading") || "Finding the best doctors..."}
          </p>
        </div>
      )}

      {!isLoading && doctors?.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Clock className="h-7 w-7" />
          </div>
          <p className="mt-4 text-lg font-bold text-slate-800">
            {t("noResults")}
          </p>
          <p className="mt-1.5 text-sm text-slate-500">
            {t("adjustFilters") || "Try adjusting your search or filters"}
          </p>
        </div>
      )}

      {doctors?.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const t = useTranslations("DoctorSearch");
  const { user } = useAuth();
  const router = useRouter();

  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const bookMutation = useBookAppointment();

  function handleBookClick() {
    if (!user) {
      router.push("/login?redirect=/doctors");
      return;
    }
    setMessage(null);
    setShowBooking((v) => !v);
    if (!showBooking) {
      setDate("");
      setTime("");
    }
  }

  function handleConfirmBooking() {
    if (!date || !time) {
      setMessage({ type: "error", text: t("pleaseSelectDateTime") || "Please select date and time" });
      return;
    }
    const dateTime = new Date(`${date}T${time}`);
    if (dateTime < new Date()) {
      setMessage({ type: "error", text: t("pastDateError") || "Please select a future date and time" });
      return;
    }
    bookMutation.mutate(
      { doctorId: doctor.id, clinicId: doctor.clinicId, date: dateTime.toISOString() },
      {
        onSuccess: (appointment) => {
          setMessage({ type: "success", text: `${t("bookSuccess")} #${appointment.token}` });
          setDate("");
          setTime("");
          setTimeout(() => {
            setShowBooking(false);
            setMessage(null);
          }, 5000);
        },
        onError: (error) => setMessage({ type: "error", text: error.message || t("bookError") }),
      }
    );
  }

  function handleFavoriteToggle() {
    setIsFavorite(!isFavorite);
  }

  const experienceYears = doctor.experience ?? 0;
  const rating = (doctor as any).rating ?? 4.5;
  const reviews = (doctor as any).reviewCount ?? 120;
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const isAvailable = doctor.isAvailable;

  return (
    <GradientBorderCard className="h-full">
      <div className="flex h-full flex-col p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563EB]/5 to-[#0F766E]/10 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                {initials(doctor.user.name)}
              </div>
              <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-[#2563EB] shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {doctor.user.name}
                </h3>
              </div>
              {doctor.qualification && (
                <p className="mt-0.5 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
                  {doctor.qualification}
                </p>
              )}
              {doctor.specialization && (
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400">
                  <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                  {doctor.specialization}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFavoriteToggle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-all hover:scale-105 hover:bg-slate-100 hover:text-red-500 active:scale-95 dark:hover:bg-slate-800"
          >
            <Heart className={`h-[18px] w-[18px] transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
          </button>
        </div>

        {experienceYears > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {experienceYears}+ {t("yearsExperience") || "years experience"}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{rating}</span>
          <span className="text-xs text-slate-400">· {reviews} {t("reviews") || "reviews"}</span>
        </div>

        <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

        <div className="space-y-2.5">
          {location && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="h-4 w-4 shrink-0 text-[#2563EB]" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {doctor.fee != null && (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="text-[#2563EB]">₹{doctor.fee}</span>
              <span className="text-slate-400">{t("consultationFee") || "consultation fee"}</span>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("status") || "Status"}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {isAvailable ? (t("availableNow") || "Available Now") : (t("currentlyUnavailable") || "Currently Unavailable")}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {isAvailable ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t("available") || "Available"}</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-400" />
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t("unavailable") || "Unavailable"}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleBookClick}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:text-slate-800 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-100"
          >
            {t("viewProfile") || "View Profile"}
          </button>
          <button
            type="button"
            onClick={handleBookClick}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            {showBooking ? t("cancel") || "Cancel" : t("bookButton")}
          </button>
        </div>

        {showBooking && user && (
          <div className="mt-5 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("bookAppointment") || "Book an appointment"}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t("selectDatePrompt") || "Select your preferred date and time."}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 dark:border-slate-700 dark:bg-slate-900">
                  <Calendar className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setMessage(null); }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none dark:text-slate-200"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20 dark:border-slate-700 dark:bg-slate-900">
                  <Clock className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => { setTime(e.target.value); setMessage(null); }}
                    min="08:00"
                    max="20:00"
                    step="1800"
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none dark:text-slate-200"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={!date || !time || bookMutation.isPending}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0F766E] to-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
              >
                {bookMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">{t("bookingLoading")}</span>
                  </>
                ) : (
                  t("confirmBooking") || "Confirm Booking"
                )}
              </button>

              {message && (
                <div
                  className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-sm font-medium ${
                    message.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {message.type === "success" ? (
                    <CalendarCheck className="h-4 w-4 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GradientBorderCard>
  );
}