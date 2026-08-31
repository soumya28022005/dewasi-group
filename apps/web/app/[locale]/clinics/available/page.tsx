"use client";

import {
  MapPin,
  Loader2,
  Wifi,
  Clock,
  Building2,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

import { Link } from "@/i18n/routing";
import {
  usePublicAvailableClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";

// ============================================================================
// TYPES
// ============================================================================

type ClinicWithLogo = PublicClinic & {
  logo?: string | null;
  image?: string | null;
  photo?: string | null;
};

// ============================================================================
// HELPERS
// ============================================================================

function getInitials(name?: string): string {
  if (!name || typeof name !== "string") {
    return "CL";
  }

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getClinicLogo(
  clinic: ClinicWithLogo
) {
  return (
    clinic.logo ??
    clinic.image ??
    clinic.photo ??
    null
  );
}

// ============================================================================
// CLINIC CARD
// ============================================================================

function ClinicCard({
  clinic,
}: {
  clinic: ClinicWithLogo;
}) {
  const location =
    clinic.city || "No city provided";

  const isAvailable =
    clinic.availability?.isAvailable;

  const status =
    clinic.availability?.status ||
    "Open";

  const logo =
    getClinicLogo(clinic);

  return (
    <Link
      href={`/clinics/${clinic.id}`}
      aria-label={`View clinic ${clinic.clinicName}`}
      className="
        group
        block
        h-full
        min-w-0
        outline-none
      "
    >

      {/* ====================================================================
          OUTER CARD
          Same style as Available Doctors
          ==================================================================== */}

      <div
        className="
          relative
          h-full
          rounded-2xl
          p-[3px]
          bg-gradient-to-br
          from-[#252a67]
          via-[#3b4a8f]
          to-[#14B8A6]
          shadow-[0_4px_20px_-6px_rgba(37,42,103,0.35)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_14px_38px_-8px_rgba(20,184,166,0.30)]
        "
      >

        {/* ==================================================================
            INNER CARD
            ================================================================== */}

        <div
          className="
            h-full
            overflow-hidden
            rounded-[calc(1rem-3px)]
            bg-white
            dark:bg-slate-900
          "
        >

          <div
            className="
              p-3
              sm:p-4
              lg:p-4.5
              xl:p-5
            "
          >

            {/* ==============================================================
                CARD CONTENT
                ============================================================== */}

            <div
              className="
                flex
                flex-col
                items-center
                text-center
                lg:flex-row
                lg:items-start
                lg:text-left
              "
            >

              {/* ============================================================
                  CLINIC PHOTO
                  Same shape/size as Doctor photo
                  ============================================================ */}

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

                {/* Photo frame */}

                <div
                  className="
                    absolute
                    inset-0
                    overflow-hidden
                    rounded-xl
                    border-2
                    border-[#252a67]
                    bg-slate-100
                    shadow-[0_6px_18px_rgba(37,42,103,0.16)]
                    dark:bg-slate-800
                  "
                >

                  {logo ? (
                    <img
                      src={logo}
                      alt={`${clinic.clinicName} logo`}
                      loading="lazy"
                      className="
                        h-full
                        w-full
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
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        bg-gradient-to-br
                        from-[#252a67]
                        to-[#14B8A6]
                        text-3xl
                        font-extrabold
                        text-white
                      "
                    >
                      {getInitials(
                        clinic.clinicName
                      )}
                    </div>
                  )}

                </div>

                {/* Available indicator */}

                <div
                  className={`
                    absolute
                    bottom-2
                    left-2
                    z-20
                    flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-white/90
                    px-2.5
                    py-1
                    text-[10px]
                    font-extrabold
                    shadow-md
                    backdrop-blur-sm
                    ${
                      isAvailable
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-600 text-white"
                    }
                  `}
                >

                  {isAvailable ? (
                    <CheckCircleIcon />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}

                  {status}

                </div>

                {/* Verified */}

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

              {/* ============================================================
                  CLINIC DETAILS
                  ============================================================ */}

              <div className="min-w-0 flex-1">

                {/* Name */}

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
                      from-[#252a67]
                      to-[#14B8A6]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    {clinic.clinicName}
                  </span>
                </h3>

                {/* Clinic type */}

                <p
                  className="
                    mt-1
                    flex
                    items-center
                    justify-center
                    gap-1
                    text-xs
                    font-semibold
                    text-slate-700
                    lg:justify-start
                    dark:text-slate-300
                  "
                >

                  <Building2
                    className="
                      h-3
                      w-3
                      shrink-0
                      text-[#252a67]
                    "
                  />

                  Clinic

                </p>

                {/* Location */}

                <p
                  className="
                    mt-1.5
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
                      text-[#14B8A6]
                    "
                  />

                  <span className="truncate">
                    {location}
                  </span>

                </p>

                {/* Online Consultation */}

                {clinic.onlineConsultationEnabled && (
                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      justify-center
                      lg:justify-start
                    "
                  >

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-teal-50
                        px-2.5
                        py-1
                        text-[10px]
                        font-extrabold
                        text-teal-700
                        ring-1
                        ring-inset
                        ring-teal-100
                        dark:bg-teal-950
                        dark:text-teal-400
                        dark:ring-teal-900
                      "
                    >

                      <Wifi className="h-3 w-3" />

                      Online Consultation

                    </span>

                  </div>
                )}

                {/* View clinic */}

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-1
                    text-[10px]
                    font-bold
                    text-[#252a67]
                    lg:justify-start
                    group-hover:text-[#14B8A6]
                  "
                >

                  View Clinic

                  <ChevronRight
                    className="
                      h-3
                      w-3
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
}

// ============================================================================
// CHECK ICON
// ============================================================================

function CheckCircleIcon() {
  return (
    <span
      className="
        flex
        h-3
        w-3
        items-center
        justify-center
        rounded-full
        bg-white/20
      "
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
    </span>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

function GridSkeleton() {
  return (
    <div
      className="
        h-full
        min-h-[210px]
        rounded-2xl
        p-[3px]
        bg-gradient-to-br
        from-[#252a67]
        via-[#3b4a8f]
        to-[#14B8A6]
      "
    >

      <div
        className="
          h-full
          rounded-[calc(1rem-3px)]
          bg-white
          p-3
          sm:p-4
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

          {/* Photo */}

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

          {/* Details */}

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

    </div>
  );
}

// ============================================================================
// AVAILABLE CLINICS
// ============================================================================

export default function AvailableClinicsGrid() {
  const {
    data,
    isLoading,
  } = usePublicAvailableClinics();

  const clinics =
    (data as ClinicWithLogo[]) ?? [];

  // ========================================================================
  // LOADING
  // ========================================================================

  if (isLoading) {
    return (
      <section
        className="
          mx-auto
          w-full
          px-3
          sm:px-4
          lg:px-5
        "
      >

        <div className="mb-4 sm:mb-5">

          <div className="flex items-center gap-2.5">

            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#252a67]/[0.07]
                text-[#252a67]
              "
            >
              <Building2 className="h-4 w-4" />
            </div>

            <div>

              <h2
                className="
                  text-lg
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                Available Clinics
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                Find a clinic for your consultation.
              </p>

            </div>

          </div>

        </div>

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

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <GridSkeleton
              key={index}
            />
          ))}

        </div>

      </section>
    );
  }

  // ========================================================================
  // EMPTY
  // ========================================================================

  if (clinics.length === 0) {
    return (
      <section
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
            flex
            min-h-[260px]
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
              bg-[#252a67]/[0.07]
              text-[#252a67]
            "
          >
            <Building2 className="h-6 w-6" />
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
            No clinics available
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
            We couldn't find any clinics
            available for online consultation.
          </p>

        </div>

      </section>
    );
  }

  // ========================================================================
  // FINAL
  // ========================================================================

  return (
    <section
      className="
        mx-auto
        w-full
        px-3
        pt-4
        sm:px-4
        sm:pt-5
        lg:px-5
        lg:pt-6
      "
    >

      {/* ==================================================================
          AVAILABLE CLINICS HEADER
          ================================================================== */}

      <div className="mb-4 sm:mb-5">

        <div className="flex items-center gap-2.5">

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#252a67]/[0.07]
              text-[#252a67]
              sm:h-9
              sm:w-9
            "
          >
            <Building2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          </div>

          <div className="min-w-0">

            <h2
              className="
                text-lg
                font-extrabold
                tracking-tight
                text-slate-900
                sm:text-xl
                dark:text-white
              "
            >
              Available Clinics
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                leading-relaxed
                text-slate-500
                sm:text-xs
                dark:text-slate-400
              "
            >
              Find the right clinic for your consultation.
            </p>

          </div>

        </div>

        {/* Count */}

        <div
          className="
            mt-2.5
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-emerald-100
            bg-emerald-50
            px-2.5
            py-1
            text-[9px]
            font-bold
            text-emerald-700
            sm:text-[10px]
          "
        >

          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          {clinics.length}{" "}
          {clinics.length === 1
            ? "Clinic"
            : "Clinics"}{" "}
          Available

        </div>

      </div>

      {/* ==================================================================
          FULL CLINIC LIST
          ================================================================== */}

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

        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
          />
        ))}

      </div>

    </section>
  );
}