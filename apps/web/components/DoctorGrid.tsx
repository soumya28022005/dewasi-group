"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  Star,
  Heart,
  Clock,
  BadgeCheck,
  Stethoscope,
  Loader2,
  Building2,
  Radio,
  Search,
  MapPin,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth-context";
import { useRouter, Link } from "@/i18n/routing";

import {
  useDoctorSearch,
  useDoctorSchedules,
  useBookAppointment,
} from "@/lib/hooks/useDoctorSearch";

import { ExtendedDoctor } from "@/types/doctor";
import DoctorClinicInfo from "@/components/DoctorClinicInfo";

/* =========================================================
   HELPERS
========================================================= */

function scheduleLabel(startTime: string, endTime: string) {
  return `${startTime} – ${endTime}`;
}

function initials(name?: string) {
  if (!name) return "DR";

  return name
    .replace(/^dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeSearchValue(value: unknown): string {
  if (value == null) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value).toLowerCase();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeSearchValue(item))
      .join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => normalizeSearchValue(item))
      .join(" ");
  }

  return "";
}

function getDoctorSearchText(doctor: ExtendedDoctor): string {
  const d = doctor as any;

  return normalizeSearchValue([
    d.user?.name,
    d.name,
    d.fullName,
    d.displayName,
    d.specialization,
    d.specialty,
    d.speciality,
    d.specialties,
    d.specialisations,
    d.specializations,
    d.treatment,
    d.treatments,
    d.treatmentTypes,
    d.qualification,
    d.qualifications,
    d.degree,
    d.degrees,
    d.department,
    d.departments,
    d.clinicName,
    d.clinic?.clinicName,
    d.clinic?.name,
    d.clinic?.city,
    d.clinic?.address,
    d.allClinics,
    d.bio,
    d.about,
    d.expertise,
    d.expertises,
    d.services,
    d.languages,
  ]);
}

function matchesDoctorSearch(doctor: ExtendedDoctor, query: string) {
  const search = query.trim().toLowerCase();

  if (!search) return true;

  const searchText = getDoctorSearchText(doctor);

  if (searchText.includes(search)) {
    return true;
  }

  const words = search
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length > 1) {
    return words.every((word) => searchText.includes(word));
  }

  return false;
}

/* =========================================================
   PREMIUM GRADIENT BORDER CARD
========================================================= */

function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        relative h-full
        rounded-[22px]
        p-px

        bg-gradient-to-br
        from-[#252a67]
        via-[#3b4a8f]
        to-[#14B8A6]

        shadow-[0_5px_24px_rgba(15,23,42,0.055)]

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:shadow-[0_18px_42px_rgba(37,42,103,0.12)]

        dark:shadow-[0_5px_24px_rgba(0,0,0,0.20)]
        dark:hover:shadow-[0_18px_42px_rgba(0,0,0,0.32)]
      "
    >
      <div
        className="
          flex h-full
          flex-col
          overflow-hidden
          rounded-[21px]
          bg-white
          dark:bg-slate-950
        "
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   DOCTOR GRID
========================================================= */

export default function DoctorGrid({
  query,
  city,
  liveNow,
  availableToday,
}: {
  query: string;
  city?: string;
  liveNow?: boolean;
  availableToday?: boolean;
}) {
  const t = useTranslations("DoctorSearch");

  const { data, isLoading } = useDoctorSearch("", city, {
    liveNow,
    availableToday,
  });

  const doctors = (data as ExtendedDoctor[]) ?? [];

  const filteredDoctors = useMemo(() => {
    if (!query.trim()) {
      return doctors;
    }

    return doctors.filter((doctor) => matchesDoctorSearch(doctor, query));
  }, [doctors, query]);

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {/* LOADING */}

      {isLoading && (
        <div
          className="
            col-span-full
            flex min-h-[280px]
            flex-col
            items-center
            justify-center
          "
        >
          <div className="relative">
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-[0_8px_30px_rgba(15,23,42,0.08)]
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <Loader2
                className="
                  h-6 w-6
                  animate-spin
                  text-[#252a67]
                  dark:text-blue-400
                "
              />
            </div>

            <div
              className="
                absolute
                -inset-2
                rounded-3xl
                border
                border-[#252a67]/10
              "
            />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-semibold
              tracking-tight
              text-slate-700
              dark:text-slate-300
            "
          >
            {t("loading") || "Finding doctors..."}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Finding the best doctors for you
          </p>
        </div>
      )}

      {/* EMPTY */}

      {!isLoading && filteredDoctors.length === 0 && (
        <div
          className="
            col-span-full
            flex min-h-[320px]
            flex-col
            items-center
            justify-center
            rounded-[24px]
            border
            border-dashed
            border-slate-200
            bg-slate-50/70
            px-6
            py-14
            text-center

            dark:border-slate-800
            dark:bg-slate-900/40
          "
        >
          <div
            className="
              flex h-16 w-16
              items-center justify-center
              rounded-2xl
              border
              border-slate-200
              bg-white
              text-slate-400
              shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            {query.trim() ? (
              <Search className="h-6 w-6" />
            ) : (
              <Stethoscope className="h-6 w-6" />
            )}
          </div>

          <h3
            className="
              mt-5
              text-base
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            {query.trim()
              ? `No doctors found for "${query}"`
              : t("noResults") || "No doctors found"}
          </h3>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {query.trim()
              ? "Try searching by doctor name, specialization, clinic or treatment."
              : t("adjustFilters") || "Try adjusting your search or filters."}
          </p>
        </div>
      )}

      {/* DOCTORS */}

      {!isLoading &&
        filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
    </div>
  );
}

/* =========================================================
   DOCTOR CARD
========================================================= */

function DoctorCard({ doctor }: { doctor: ExtendedDoctor }) {
  const t = useTranslations("DoctorSearch");

  const { user } = useAuth();
  const router = useRouter();

  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [scheduleId, setScheduleId] = useState("");

  const defaultClinicId =
    doctor.allClinics?.[0]?.id || (doctor as any).clinicId;

  const [selectedClinicId, setSelectedClinicId] =
    useState(defaultClinicId);

  const [isFavorite, setIsFavorite] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const bookMutation = useBookAppointment();

  const { data: schedules, isLoading: schedulesLoading } = useDoctorSchedules(
    showBooking ? doctor.id : undefined,
    showBooking ? selectedClinicId : undefined
  );

  const bookableSchedules = (schedules ?? []).filter(
    (schedule) =>
      schedule.isActive && schedule.onlineBookingEnabled !== false
  );

  /* BOOK BUTTON */

  function handleBookClick() {
    if (!user) {
      router.push("/login?redirect=/doctors");
      return;
    }

    setMessage(null);
    setShowBooking((value) => !value);

    if (!showBooking) {
      setDate("");
      setScheduleId("");
    }
  }

  /* CONFIRM BOOKING */

  function handleConfirmBooking() {
    if (!date || !scheduleId) {
      setMessage({
        type: "error",
        text:
          t("pleaseSelectSchedule") || "Please select a session and date",
      });

      return;
    }

    bookMutation.mutate(
      {
        doctorId: doctor.id,
        clinicId: selectedClinicId,
        scheduleId,
        date,
      },
      {
        onSuccess: (appointment) => {
          setMessage({
            type: "success",
            text: `${t("bookSuccess")} #${appointment.token}`,
          });

          setDate("");
          setScheduleId("");

          setTimeout(() => {
            setShowBooking(false);
            setMessage(null);
          }, 5000);
        },

        onError: (error: any) => {
          setMessage({
            type: "error",
            text:
              error?.response?.data?.message ||
              error?.message ||
              t("bookError"),
          });
        },
      }
    );
  }

  /* DOCTOR DATA */

  const experienceYears = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const reviews = doctor.reviewCount ?? 120;

  const liveStatus = doctor.liveStatus;

  const isLive = liveStatus?.isLive ?? false;

  const isAvailable = liveStatus
    ? liveStatus.isAvailable
    : doctor.isAvailable;

  const avatarSrc =
    (doctor as any).profilePhoto || doctor.user?.avatar || null;

  const doctorName = doctor.user?.name || "Doctor";

  const specialization = doctor.specialization || "General Physician";

  return (
    <GradientBorderCard>
      <div
        className="
          relative
          flex h-full
          flex-col
          p-4
          sm:p-[18px]
        "
      >
        {/* =================================================
            FAVORITE
        ================================================= */}

        <button
          type="button"
          onClick={() => setIsFavorite((value) => !value)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="
            absolute
            right-4
            top-4
            z-10

            flex
            h-8
            w-8
            items-center
            justify-center

            rounded-xl

            border
            border-slate-200/80

            bg-white/90
            text-slate-400

            backdrop-blur

            transition-all
            duration-200

            hover:border-red-100
            hover:bg-red-50
            hover:text-red-500

            active:scale-95

            dark:border-slate-800
            dark:bg-slate-900/90
            dark:hover:border-red-950
            dark:hover:bg-red-950/30
          "
        >
          <Heart
            className={`
              h-3.5 w-3.5
              transition-all
              ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-slate-400"
              }
            `}
          />
        </button>

        {/* =================================================
            DOCTOR HEADER
        ================================================= */}

        <div className="flex items-start gap-3.5">
          {/* =================================================
              DOCTOR PHOTO — Fixed Size & Clean Radius
          ================================================= */}

          <div
            className="
              relative
              shrink-0
              h-[96px]
              w-[96px]
              sm:h-[104px]
              sm:w-[104px]
            "
          >
            <div
              className="
                h-full
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-slate-100
                shadow-sm

                transition-all
                duration-300

                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={doctorName}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-500
                    hover:scale-[1.04]
                  "
                  onError={(event) => {
                    const image = event.currentTarget;
                    image.style.display = "none";
                    const parent = image.parentElement;

                    if (parent) {
                      parent.innerHTML = `
                        <div class="
                          flex h-full w-full
                          items-center justify-center
                          bg-gradient-to-br
                          from-[#252a67]
                          via-[#3b4a8f]
                          to-[#14B8A6]
                          text-2xl font-bold
                          text-white
                        ">
                          ${initials(doctorName)}
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div
                  className="
                    flex h-full w-full
                    items-center justify-center
                    bg-gradient-to-br
                    from-[#252a67]
                    via-[#3b4a8f]
                    to-[#14B8A6]
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  {initials(doctorName)}
                </div>
              )}
            </div>

            {/* Verified Badge */}

            <div
              className="
                absolute
                -bottom-1
                -right-1
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                border-2
                border-white
                bg-[#252a67]
                shadow-md
                dark:border-slate-950
              "
            >
              <BadgeCheck className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          {/* =================================================
              NAME / SPECIALIZATION
          ================================================= */}

          <div className="min-w-0 flex-1 pt-0.5 pr-9">
            <h3
              className="
                truncate
                text-[15px]
                font-bold
                leading-5
                tracking-[-0.025em]
                text-slate-950
                dark:text-white
              "
            >
              {doctorName}
            </h3>

            <p
              className="
                mt-1
                truncate
                text-[11.5px]
                font-medium
                leading-4
                text-slate-500
                dark:text-slate-400
              "
            >
              {specialization}
            </p>

            {/* Rating */}

            <div className="mt-2.5 flex items-center gap-2 text-[10.5px]">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  font-bold
                  text-slate-800
                  dark:text-slate-200
                "
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {rating}
              </span>

              <span className="text-slate-300 dark:text-slate-700">•</span>

              <span className="text-slate-400">{reviews} reviews</span>
            </div>
          </div>
        </div>

        {/* =================================================
            EXPERIENCE
        ================================================= */}

        {experienceYears > 0 && (
          <div className="mt-3">
            <span
              className="
                inline-flex
                items-center
                rounded-lg
                border
                border-slate-200/80
                bg-slate-50
                px-2
                py-1
                text-[10px]
                font-semibold
                text-slate-500

                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-400
              "
            >
              <Sparkles className="mr-1 h-3 w-3" />
              {experienceYears}+ years experience
            </span>
          </div>
        )}

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="my-4 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* =================================================
            CLINIC
        ================================================= */}

        <div className="min-h-[54px]">
          <div
            className="
              mb-2
              flex
              items-center
              gap-1.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-slate-400
            "
          >
            <MapPin className="h-3 w-3" />
            Clinic
          </div>

          <div className="text-sm">
            <DoctorClinicInfo doctor={doctor} />
          </div>
        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="mt-4">
          {isLive ? (
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-red-100
                bg-red-50
                px-2.5
                py-1
                text-[10px]
                font-bold
                text-red-600

                dark:border-red-950
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>

              <Radio className="h-3 w-3" />

              {t("liveNow") || "Live"}

              {liveStatus?.capacity && (
                <span className="ml-0.5 font-medium opacity-70">
                  {liveStatus.capacity.booked}/{liveStatus.capacity.max}
                </span>
              )}
            </div>
          ) : isAvailable ? (
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-100
                bg-emerald-50
                px-2.5
                py-1
                text-[10px]
                font-bold
                text-emerald-600

                dark:border-emerald-950
                dark:bg-emerald-950/30
                dark:text-emerald-400
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("availableNow") || "Available now"}
            </div>
          ) : (
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-2.5
                py-1
                text-[10px]
                font-semibold
                text-slate-500

                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-400
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {t("currentlyUnavailable") || "Currently unavailable"}
            </div>
          )}
        </div>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="mt-auto pt-4">
          <div className="grid grid-cols-[0.85fr_1.4fr] gap-2">
            <Link
              href={`/doctors/${doctor.id}`}
              className="
                flex
                h-10
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                text-[11px]
                font-bold
                text-slate-700

                transition-all
                duration-200

                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-950

                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-slate-700
                dark:hover:bg-slate-800
              "
            >
              Profile
            </Link>

            <button
              type="button"
              onClick={handleBookClick}
              className="
                flex
                h-10
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-[#252a67]
                px-3
                text-[11px]
                font-bold
                text-white

                shadow-[0_6px_18px_rgba(37,42,103,0.18)]

                transition-all
                duration-200

                hover:bg-[#1e2255]
                hover:shadow-[0_8px_22px_rgba(37,42,103,0.25)]

                active:scale-[0.98]
              "
            >
              <Calendar className="h-3.5 w-3.5" />
              {showBooking ? "Close" : "Book appointment"}
            </button>
          </div>
        </div>

        {/* =================================================
            BOOKING PANEL
        ================================================= */}

        {showBooking && user && (
          <div
            className="
              mt-3
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-3
              animate-in
              slide-in-from-top-2
              fade-in
              duration-200

              dark:border-slate-800
              dark:bg-slate-900/70
            "
          >
            {/* Booking heading */}

            <div className="mb-3 flex items-center gap-2">
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#252a67]/10
                  text-[#252a67]
                  dark:bg-blue-950/50
                  dark:text-blue-400
                "
              >
                <Calendar className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Book appointment
                </p>

                <p className="text-[9px] text-slate-400">
                  Select your preferred clinic and time
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {/* CLINIC SELECT */}

              {doctor.allClinics && doctor.allClinics.length > 0 && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-2.5
                    dark:border-slate-800
                    dark:bg-slate-950
                  "
                >
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                  <select
                    value={selectedClinicId}
                    onChange={(e) => setSelectedClinicId(e.target.value)}
                    className="
                      min-w-0
                      flex-1
                      cursor-pointer
                      bg-transparent
                      text-[10px]
                      font-semibold
                      text-slate-700
                      outline-none
                      dark:text-slate-200
                    "
                  >
                    {doctor.allClinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.clinicName} - ₹
                        {clinic.associationDetails?.fee || doctor.fee}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              )}

              {/* SESSION */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2.5
                  dark:border-slate-800
                  dark:bg-slate-950
                "
              >
                <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                {schedulesLoading ? (
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      font-medium
                      text-slate-400
                    "
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading sessions...
                  </div>
                ) : bookableSchedules.length === 0 ? (
                  <span className="text-[10px] font-medium text-slate-400">
                    No sessions available
                  </span>
                ) : (
                  <>
                    <select
                      value={scheduleId}
                      onChange={(e) => {
                        setScheduleId(e.target.value);
                        setMessage(null);
                      }}
                      className="
                        min-w-0
                        flex-1
                        cursor-pointer
                        bg-transparent
                        text-[10px]
                        font-semibold
                        text-slate-700
                        outline-none
                        dark:text-slate-200
                      "
                    >
                      <option value="">Select session</option>

                      {bookableSchedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {scheduleLabel(schedule.startTime, schedule.endTime)}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </>
                )}
              </div>

              {/* DATE */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2.5
                  dark:border-slate-800
                  dark:bg-slate-950
                "
              >
                <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setMessage(null);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-[10px]
                    font-semibold
                    text-slate-700
                    outline-none
                    dark:text-slate-200
                  "
                />
              </div>
            </div>

            {/* CONFIRM */}

            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={!date || !scheduleId || bookMutation.isPending}
              className="
                mt-3
                flex
                h-10
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#14B8A6]
                text-[11px]
                font-bold
                text-white

                shadow-[0_6px_18px_rgba(20,184,166,0.18)]

                transition-all
                duration-200

                hover:bg-[#0f9688]

                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Calendar className="h-3.5 w-3.5" />
                  Confirm appointment
                </>
              )}
            </button>

            {/* MESSAGE */}

            {message && (
              <div
                className={`
                  mt-2.5
                  rounded-xl
                  border
                  px-3
                  py-2
                  text-[10px]
                  font-semibold
                  leading-4

                  ${
                    message.type === "success"
                      ? `
                        border-emerald-100
                        bg-emerald-50
                        text-emerald-700
                        dark:border-emerald-950
                        dark:bg-emerald-950/30
                        dark:text-emerald-400
                      `
                      : `
                        border-red-100
                        bg-red-50
                        text-red-600
                        dark:border-red-950
                        dark:bg-red-950/30
                        dark:text-red-400
                      `
                  }
                `}
              >
                {message.text}
              </div>
            )}
          </div>
        )}
      </div>
    </GradientBorderCard>
  );
}