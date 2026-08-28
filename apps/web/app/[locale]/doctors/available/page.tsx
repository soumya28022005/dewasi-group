"use client";

import React from "react";
import {
  MapPin,
  Stethoscope,
  BadgeCheck,
  Star,
  Award,
} from "lucide-react";

import type { Doctor as SharedDoctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicAvailableDoctors } from "@/lib/hooks/usePublicDirectory";

export type ExtendedDoctor = SharedDoctor & {
  isVerified?: boolean;
  isFeatured?: boolean;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  clinic?: {
    clinicName: string;
    city?: string;
  };
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string | null;
  };
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "DR";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getDoctorAvatar(doctor: ExtendedDoctor) {
  return (
    (doctor as ExtendedDoctor & {
      profilePhoto?: string | null;
    }).profilePhoto ??
    doctor.user?.avatar ??
    null
  );
}

/* -------------------------------------------------------------------------- */
/* Experience Badge                                                           */
/* -------------------------------------------------------------------------- */

function ExperienceBadge({ years }: { years: number }) {
  if (!years || years <= 0) return null;

  return (
    <div className="absolute bottom-0 left-0 z-10 translate-y-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/90 bg-[#252a67]/95 px-2.5 py-1 shadow-[0_5px_14px_rgba(37,42,103,0.35)] backdrop-blur-sm">
        <Award
          className="h-3 w-3 shrink-0 text-amber-300"
          strokeWidth={2.5}
        />

        <span className="whitespace-nowrap text-[10px] font-extrabold tracking-wide text-white">
          {years}+ yrs
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Doctor Card                                                                */
/* -------------------------------------------------------------------------- */

function DoctorCard({ doctor }: { doctor: ExtendedDoctor }) {
  const location =
    doctor.clinic?.city ?? doctor.clinic?.clinicName;

  const experience = doctor.experience ?? 0;
  const rating = doctor.rating ?? 4.5;
  const reviews = doctor.reviewCount ?? 0;
  const avatar = getDoctorAvatar(doctor);

  return (
    <Link
      href={`/doctors/${doctor.id}`}
      aria-label={`View profile of ${doctor.user.name}`}
      className="group block h-full min-w-0 outline-none"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Outer Gradient Border                                               */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          relative h-full rounded-2xl p-[3px]
          bg-gradient-to-br
          from-[#252a67]
          via-[#3b4a8f]
          to-[#14B8A6]
          shadow-[0_4px_20px_-6px_rgba(37,42,103,0.35)]
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_14px_38px_-8px_rgba(20,184,166,0.30)]
        "
      >
        {/* Inner Card */}
        <div
          className="
            h-full overflow-hidden
            rounded-[calc(1rem-3px)]
            bg-white
            dark:bg-slate-900
          "
        >
          <div className="p-3 sm:p-4 lg:p-4.5 xl:p-5">

            {/* ============================================================ */}
            {/* Mobile / Tablet / Desktop Layout                              */}
            {/* ============================================================ */}

            <div
              className="
                flex flex-col
                items-center
                text-center

                lg:flex-row
                lg:items-start
                lg:text-left
              "
            >

              {/* ========================================================== */}
              {/* Doctor Photo                                                */}
              {/* ========================================================== */}

              <div
                className="
                  relative
                  mb-5
                  h-40
                  w-32
                  shrink-0

                  sm:h-44
                  sm:w-34

                  lg:mb-0
                  lg:mr-4
                  lg:h-40
                  lg:w-32

                  xl:h-44
                  xl:w-34
                "
              >
                {/* Photo Frame */}
                <div
                  className="
                    absolute inset-0
                    overflow-hidden
                    rounded-xl
                    border-2 border-[#252a67]
                    bg-slate-100
                    shadow-[0_6px_18px_rgba(37,42,103,0.16)]
                    dark:bg-slate-800
                  "
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={doctor.user.name}
                      loading="lazy"
                      className="
                        h-full w-full
                        object-cover
                        object-center
                        transition-transform
                        duration-500
                        group-hover:scale-[1.035]
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex h-full w-full
                        items-center justify-center
                        bg-gradient-to-br
                        from-[#2563EB]
                        to-[#6a7583]
                        text-2xl
                        font-bold
                        text-white
                      "
                    >
                      {getInitials(doctor.user.name)}
                    </div>
                  )}
                </div>

                {/* Experience Badge */}
                <ExperienceBadge years={experience} />

                {/* Verified Badge
                    Positioned outside the face area */}
                <BadgeCheck
                  className="
                    absolute
                    -bottom-2
                    -right-2
                    z-20
                    h-6
                    w-6
                    rounded-full
                    bg-white
                    p-[1px]
                    text-[#2563EB]
                    shadow-md
                    ring-2
                    ring-white

                    dark:bg-slate-900
                    dark:ring-slate-900
                  "
                />
              </div>

              {/* ========================================================== */}
              {/* Doctor Details                                              */}
              {/* ========================================================== */}

              <div className="min-w-0 flex-1">

                {/* Doctor Name */}
                <h3
                  className="
                    truncate
                    text-base
                    font-extrabold
                    tracking-tight
                    text-slate-900
                    dark:text-white
                    lg:text-[17px]
                    xl:text-lg
                  "
                >
                  <span
                    className="
                      bg-gradient-to-r
                      from-[#422995]
                      to-[#4a9860]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    {doctor.user.name}
                  </span>
                </h3>

                {/* Qualification */}
                {doctor.qualification && (
                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {doctor.qualification}
                  </p>
                )}

                {/* Specialization */}
                {doctor.specialization && (
                  <p
                    className="
                      mt-1
                      flex
                      min-w-0
                      items-center
                      justify-center
                      gap-1
                      text-xs
                      text-slate-500

                      lg:justify-start

                      dark:text-slate-400
                    "
                  >
                    <Stethoscope
                      className="
                        h-3
                        w-3
                        shrink-0
                        text-teal-600
                      "
                    />

                    <span className="truncate">
                      {doctor.specialization}
                    </span>
                  </p>
                )}

                {/* Rating */}
                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-center
                    gap-1

                    lg:justify-start
                  "
                >
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <span
                    className="
                      text-xs
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {rating.toFixed(1)}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    ({reviews})
                  </span>
                </div>

                {/* Consultation Fee */}
                {doctor.fee != null && (
                  <p
                    className="
                      mt-1.5
                      text-sm
                      font-bold
                      text-[#252a67]
                      dark:text-blue-400
                    "
                  >
                    ₹{doctor.fee}{" "}
                    <span
                      className="
                        text-xs
                        font-normal
                        text-slate-400
                      "
                    >
                      / visit
                    </span>
                  </p>
                )}

                {/* Location */}
                {location && (
                  <p
                    className="
                      mt-1
                      flex
                      min-w-0
                      items-center
                      justify-center
                      gap-1
                      text-xs
                      text-slate-500

                      lg:justify-start

                      dark:text-slate-400
                    "
                  >
                    <MapPin
                      className="
                        h-3
                        w-3
                        shrink-0
                        text-gray-400
                      "
                    />

                    <span className="truncate">
                      {location}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function GridSkeleton() {
  return (
    <div
      className="
        h-full
        min-h-[210px]
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm

        sm:p-4

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-4

          lg:flex-row
          lg:items-start
        "
      >
        {/* Skeleton Photo */}
        <div
          className="
            h-40
            w-32
            shrink-0
            animate-pulse
            rounded-xl
            bg-slate-200

            sm:h-44
            sm:w-34

            lg:h-40
            lg:w-32

            xl:h-44
            xl:w-34

            dark:bg-slate-800
          "
        />

        {/* Skeleton Details */}
        <div
          className="
            flex
            w-full
            flex-1
            flex-col
            items-center
            space-y-2

            lg:items-start
          "
        >
          <div
            className="
              h-4
              w-3/4
              animate-pulse
              rounded
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              h-3
              w-1/2
              animate-pulse
              rounded
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              h-3
              w-2/3
              animate-pulse
              rounded
              bg-slate-200
              dark:bg-slate-800
            "
          />

          <div
            className="
              h-3
              w-1/3
              animate-pulse
              rounded
              bg-slate-200
              dark:bg-slate-800
            "
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Grid                                                                  */
/* -------------------------------------------------------------------------- */

export default function AvailableDoctorsGrid() {
  const {
    data,
    isLoading,
  } = usePublicAvailableDoctors();

  const doctors =
    (data as ExtendedDoctor[]) ?? [];

  /* ---------------------------------------------------------------------- */
  /* Loading State                                                          */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div
        className="
          mx-auto
          w-full
          px-3

          sm:px-4

          lg:px-5
        "
      >
        <div
          className="
            grid
            grid-cols-2
            gap-3

            sm:gap-4

            lg:grid-cols-3
            lg:gap-5

            xl:gap-6
          "
        >
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <GridSkeleton key={index} />
            )
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Empty State                                                            */
  /* ---------------------------------------------------------------------- */

  if (doctors.length === 0) {
    return (
      <div
        className="
          mx-3
          flex
          min-h-[300px]
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-slate-200
          bg-slate-50/70
          px-6
          text-center

          sm:mx-4

          dark:border-slate-800
          dark:bg-slate-900/50
        "
      >
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-50
            text-blue-600

            dark:bg-blue-950/40
            dark:text-blue-400
          "
        >
          <Stethoscope className="h-6 w-6" />
        </div>

        <h3
          className="
            mt-4
            text-sm
            font-bold
            text-slate-800
            dark:text-slate-200
          "
        >
          No doctors available
        </h3>

        <p
          className="
            mt-1
            max-w-sm
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          We couldn't find any doctors matching
          the current availability.
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Doctors Grid                                                           */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      className="
        mx-auto
        w-full
        px-3

        sm:px-4

        lg:px-5
      "
    >
      <div
        className="
          grid
          grid-cols-2
          gap-3

          sm:gap-4

          lg:grid-cols-3
          lg:gap-5

          xl:gap-6
        "
      >
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
          />
        ))}
      </div>
    </div>
  );
}