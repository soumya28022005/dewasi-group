"use client";

import React, { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { useRouter, Link } from "@/i18n/routing";

import {
  useDoctorSearch,
  useDoctorSchedules,
  useBookAppointment,
} from "@/lib/hooks/useDoctorSearch";

import { ExtendedDoctor } from "@/types/doctor";
import DoctorClinicInfo from "@/components/DoctorClinicInfo";

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

/* =========================================================
   SEARCH HELPERS
========================================================= */

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

  const searchableFields = [
    /* Doctor */
    d.user?.name,
    d.name,
    d.fullName,
    d.displayName,

    /* Specialization */
    d.specialization,
    d.specialty,
    d.speciality,
    d.specialties,
    d.specialisations,
    d.specializations,

    /* Treatment */
    d.treatment,
    d.treatments,
    d.treatmentTypes,

    /* Qualification */
    d.qualification,
    d.qualifications,
    d.degree,
    d.degrees,

    /* Department */
    d.department,
    d.departments,

    /* Clinic */
    d.clinicName,
    d.clinic?.clinicName,
    d.clinic?.name,
    d.clinic?.city,
    d.clinic?.address,

    /* Multiple clinics */
    d.allClinics,

    /* Other useful fields */
    d.bio,
    d.about,
    d.expertise,
    d.expertises,
    d.services,
    d.languages,
  ];

  return normalizeSearchValue(searchableFields);
}

function matchesDoctorSearch(
  doctor: ExtendedDoctor,
  query: string
) {
  const search = query.trim().toLowerCase();

  if (!search) return true;

  const searchText = getDoctorSearchText(doctor);

  /* Exact phrase */
  if (searchText.includes(search)) {
    return true;
  }

  /* Multiple words */
  const words = search
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length > 1) {
    return words.every((word) =>
      searchText.includes(word)
    );
  }

  return false;
}

/* =========================================================
   CARD WRAPPER
========================================================= */

function GradientBorderCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        relative h-full rounded-2xl p-[1px]
        bg-gradient-to-br
        from-[#2563EB]
        via-[#0F766E]
        to-[#14B8A6]
        shadow-[0_3px_16px_rgba(15,23,42,0.05)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_12px_28px_rgba(37,99,235,0.11)]
      "
    >
      <div className="flex h-full flex-col rounded-[15px] bg-white dark:bg-slate-900">
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
const locale = useLocale();

  /*
   * Search is handled locally so specialization,
   * clinic and treatment also work properly.
   */
  const { data, isLoading } = useDoctorSearch(
    "",
    city,
    {
      liveNow,
      availableToday,
    }
  );

  const doctors = (data as ExtendedDoctor[]) ?? [];

  const filteredDoctors = useMemo(() => {
    if (!query.trim()) {
      return doctors;
    }

    return doctors.filter((doctor) =>
      matchesDoctorSearch(doctor, query)
    );
  }, [doctors, query]);

  return (
    <div
      className="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      "
    >
      {/* ===================================================
          LOADING
      =================================================== */}

      {isLoading && (
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-[#2563EB]" />
            </div>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("loading") || "Finding doctors..."}
          </p>
        </div>
      )}

      {/* ===================================================
          EMPTY
      =================================================== */}

      {!isLoading && filteredDoctors.length === 0 && (
        <div
          className="
            col-span-full
            flex flex-col items-center justify-center
            rounded-2xl
            border border-dashed border-slate-200
            bg-slate-50/70
            p-12 text-center
            dark:border-slate-700
            dark:bg-slate-900/50
          "
        >
          <div
            className="
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              bg-white
              text-slate-400
              shadow-sm
              dark:bg-slate-800
            "
          >
            {query.trim() ? (
              <Search className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>

          <p className="mt-3 text-base font-bold text-slate-800 dark:text-slate-100">
            {query.trim()
              ? `No doctors found for "${query}"`
              : t("noResults") || "No doctors found"}
          </p>

          <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {query.trim()
              ? "Try a doctor name, specialization, clinic name or treatment."
              : t("adjustFilters") ||
                "Try adjusting your search or filters"}
          </p>
        </div>
      )}

      {/* ===================================================
          DOCTORS
      =================================================== */}

      {!isLoading &&
        filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
          />
        ))}
    </div>
  );
}

/* =========================================================
   DOCTOR CARD
========================================================= */

function DoctorCard({
  doctor,
}: {
  doctor: ExtendedDoctor;
}) {
  const t = useTranslations("DoctorSearch");
const locale = useLocale();

  const { user } = useAuth();
  const router = useRouter();

  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState("");
  const [scheduleId, setScheduleId] = useState("");

  const defaultClinicId =
    doctor.allClinics?.[0]?.id ||
    (doctor as any).clinicId;

  const [selectedClinicId, setSelectedClinicId] =
    useState(defaultClinicId);

  const [isFavorite, setIsFavorite] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const bookMutation = useBookAppointment();

  const {
    data: schedules,
    isLoading: schedulesLoading,
  } = useDoctorSchedules(
    showBooking ? doctor.id : undefined,
    showBooking ? selectedClinicId : undefined
  );

  const bookableSchedules =
    (schedules ?? []).filter(
      (schedule) =>
        schedule.isActive &&
        schedule.onlineBookingEnabled !== false
    );

  /* =======================================================
     BOOK BUTTON
  ======================================================= */

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

  /* =======================================================
     CONFIRM BOOKING
  ======================================================= */

  function handleConfirmBooking() {
    if (!date || !scheduleId) {
      setMessage({
        type: "error",
        text:
          t("pleaseSelectSchedule") ||
          "Please select a session and date",
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

  /* =======================================================
     DOCTOR DATA
  ======================================================= */

  const experienceYears = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const reviews = doctor.reviewCount ?? 120;

  const liveStatus = doctor.liveStatus;

  const isLive = liveStatus?.isLive ?? false;

  const isAvailable = liveStatus
    ? liveStatus.isAvailable
    : doctor.isAvailable;

  /*
   * Keep backend photo priority:
   * profilePhoto -> user.avatar -> initials
   */
  const avatarSrc =
    (doctor as any).profilePhoto ||
    doctor.user?.avatar ||
    null;

  return (
    <GradientBorderCard>
      <div className="relative flex h-full flex-col p-3">
        {/* =================================================
            FAVORITE
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            setIsFavorite((value) => !value)
          }
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
          className="
            absolute right-3 top-3 z-10
            flex h-7 w-7
            items-center justify-center
            rounded-full
            bg-slate-50
            text-slate-400
            shadow-sm
            transition-all
            hover:scale-105
            hover:bg-white
            hover:text-red-500
            active:scale-95
            dark:bg-slate-800
            dark:hover:bg-slate-700
          "
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-slate-400"
            }`}
          />
        </button>

        {/* =================================================
            DOCTOR PHOTO
        ================================================= */}

        <div
          className="
            relative mx-auto mt-2
            h-[76px] w-[76px]
            shrink-0
            sm:h-[84px] sm:w-[84px]
          "
        >
          <div
            className="
              h-full w-full
              overflow-hidden
              rounded-full
              border-[3px]
              border-white
              bg-slate-100
              shadow-md
              ring-1 ring-slate-200
              dark:border-slate-800
              dark:bg-slate-800
              dark:ring-slate-700
            "
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={doctor.user?.name || "Doctor"}
                loading="lazy"
                className="
                  h-full w-full
                  object-cover
                  object-top
                "
                onError={(event) => {
                  const image =
                    event.currentTarget;

                  image.style.display = "none";

                  const parent =
                    image.parentElement;

                  if (parent) {
                    parent.innerHTML = `
                      <div class="
                        flex h-full w-full
                        items-center justify-center
                        bg-gradient-to-br
                        from-[#2563EB]
                        to-[#14B8A6]
                        text-lg font-bold
                        text-white
                      ">
                        ${initials(
                          doctor.user?.name
                        )}
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
                  from-[#2563EB]
                  to-[#14B8A6]
                  text-lg font-bold
                  text-white
                "
              >
                {initials(doctor.user?.name)}
              </div>
            )}
          </div>

          {/* Verified */}
          <BadgeCheck
            className="
              absolute
              bottom-0 right-0
              h-5 w-5
              rounded-full
              bg-white
              text-[#2563EB]
              shadow-sm
              ring-1 ring-white
              dark:bg-slate-800
              dark:ring-slate-800
            "
          />
        </div>

        {/* =================================================
            NAME + SPECIALIZATION
        ================================================= */}

        <div className="mt-2.5 flex flex-col items-center text-center">
          <h3
            className="
              w-full truncate
              px-2
              text-sm
              font-bold
              tracking-tight
              text-slate-900
              dark:text-slate-100
            "
          >
            {doctor.user?.name || "Doctor"}
          </h3>

          <p
            className="
              mt-0.5
              w-full truncate
              px-2
              text-[11px]
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            {doctor.specialization ||
              "General Physician"}

            {experienceYears > 0 && (
              <span className="ml-1 text-slate-400">
                • {experienceYears}y exp
              </span>
            )}
          </p>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <Star
              className="
                h-3 w-3
                fill-amber-400
                text-amber-400
              "
            />

            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              {rating}
            </span>

            <span className="text-[10px] text-slate-400">
              ({reviews})
            </span>
          </div>
        </div>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="my-3 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* =================================================
            CLINIC
        ================================================= */}

        <div className="relative w-full">
          <DoctorClinicInfo doctor={doctor} />
        </div>

        {/* =================================================
            STATUS + ACTION
        ================================================= */}

        <div className="mt-auto pt-3">
          {/* Status */}

          <div className="mb-3 flex h-4 items-center justify-center gap-1 text-[11px] font-medium">
            {isLive ? (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full w-full
                      animate-ping
                      rounded-full
                      bg-red-400
                      opacity-75
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-1.5 w-1.5
                      rounded-full
                      bg-red-500
                    "
                  />
                </span>

                <Radio className="h-3 w-3" />

                {t("liveNow") || "Live"}

                {liveStatus?.capacity && (
                  <span className="ml-1 text-[10px] text-slate-400">
                    (
                    {liveStatus.capacity.booked}/
                    {liveStatus.capacity.max})
                  </span>
                )}
              </div>
            ) : isAvailable ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-emerald-500" />

                {t("availableNow") ||
                  "Available"}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

                {t("currentlyUnavailable") ||
                  "Unavailable"}
              </div>
            )}
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/doctors/${doctor.id}`}
              className="
                flex
                items-center
                justify-center
                rounded-lg
                border border-slate-200
                bg-white
                px-2 py-1.5
                text-[11px]
                font-semibold
                text-slate-600
                transition-all
                hover:bg-slate-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-300
                dark:hover:bg-slate-700
              "
            >
              Profile
            </Link>

            <button
              type="button"
              onClick={handleBookClick}
              className="
                flex
                items-center
                justify-center
                rounded-lg
                bg-gradient-to-r
                from-[#252A67]
                to-[#14B8A6]
                px-2 py-1.5
                text-[11px]
                font-semibold
                text-white
                transition-all
                hover:opacity-90
                active:scale-95
              "
            >
              {showBooking ? "Cancel" : "Book"}
            </button>
          </div>
        </div>

        {/* =================================================
            BOOKING PANEL
        ================================================= */}

        {showBooking && user && (
          <div className="relative mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
            <div
              className="
                rounded-xl
                border border-slate-200
                bg-slate-50
                p-2
                dark:border-slate-700
                dark:bg-slate-800/60
              "
            >
              <div className="space-y-2">
                {/* Clinic */}
                {doctor.allClinics &&
                  doctor.allClinics.length > 0 && (
                    <div
                      className="
                        flex items-center gap-2
                        rounded-md
                        border border-slate-200
                        bg-white
                        px-2 py-1.5
                        dark:border-slate-600
                        dark:bg-slate-900
                      "
                    >
                      <Building2 className="h-3 w-3 shrink-0 text-slate-400" />

                      <select
                        value={selectedClinicId}
                        onChange={(e) =>
                          setSelectedClinicId(
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          cursor-pointer
                          bg-transparent
                          text-[10px]
                          font-medium
                          text-slate-700
                          outline-none
                          dark:text-slate-200
                        "
                      >
                        {doctor.allClinics.map(
                          (clinic) => (
                            <option
                              key={clinic.id}
                              value={clinic.id}
                            >
                              {clinic.clinicName} - ₹
                              {clinic
                                .associationDetails
                                ?.fee ||
                                doctor.fee}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                {/* Session */}
                <div
                  className="
                    flex items-center gap-2
                    rounded-md
                    border border-slate-200
                    bg-white
                    px-2 py-1.5
                    dark:border-slate-600
                    dark:bg-slate-900
                  "
                >
                  <Clock className="h-3 w-3 shrink-0 text-slate-400" />

                  {schedulesLoading ? (
                    <span className="text-[10px] text-slate-400">
                      Loading...
                    </span>
                  ) : bookableSchedules.length === 0 ? (
                    <span className="text-[10px] text-slate-400">
                      No sessions
                    </span>
                  ) : (
                    <select
                      value={scheduleId}
                      onChange={(e) => {
                        setScheduleId(
                          e.target.value
                        );
                        setMessage(null);
                      }}
                      className="
                        w-full
                        cursor-pointer
                        bg-transparent
                        text-[10px]
                        font-medium
                        text-slate-700
                        outline-none
                        dark:text-slate-200
                      "
                    >
                      <option value="">
                        Select session
                      </option>

                      {bookableSchedules.map(
                        (schedule) => (
                          <option
                            key={schedule.id}
                            value={schedule.id}
                          >
                            {scheduleLabel(
                              schedule.startTime,
                              schedule.endTime
                            )}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>

                {/* Date */}
                <div
                  className="
                    flex items-center gap-2
                    rounded-md
                    border border-slate-200
                    bg-white
                    px-2 py-1.5
                    dark:border-slate-600
                    dark:bg-slate-900
                  "
                >
                  <Calendar className="h-3 w-3 shrink-0 text-slate-400" />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setMessage(null);
                    }}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    className="
                      w-full
                      bg-transparent
                      text-[10px]
                      font-medium
                      text-slate-700
                      outline-none
                      dark:text-slate-200
                    "
                  />
                </div>
              </div>

              {/* Confirm */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={
                  !date ||
                  !scheduleId ||
                  bookMutation.isPending
                }
                className="
                  mt-2
                  flex w-full
                  items-center
                  justify-center
                  rounded-md
                  bg-[#14B8A6]
                  px-2 py-1.5
                  text-[11px]
                  font-bold
                  text-white
                  transition-all
                  hover:bg-[#0F9688]
                  disabled:opacity-50
                "
              >
                {bookMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`
                    mt-1.5
                    rounded
                    p-1.5
                    text-[10px]
                    font-medium
                    ${
                      message.type ===
                      "success"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                    }
                  `}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GradientBorderCard>
  );
}