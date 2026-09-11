"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLocale, useTranslations } from "next-intl";

import {
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarCheck,
} from "lucide-react";

import { Link } from "@/i18n/routing";

import {
  usePublicAllDoctors,
} from "@/lib/hooks/usePublicDirectory";

import SectionHeader from "@/components/SectionHeader";

import { ExtendedDoctor } from "@/types/doctor";

/* =========================================================
   HELPERS
========================================================= */

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
   DOCTOR IMAGE
========================================================= */

function DoctorImage({
  src,
  name,
}: {
  src?: string | null;
  name?: string;
}) {
  const [broken, setBroken] = useState(false);

  const showImage = Boolean(src) && !broken;

  return (
    <div
      className="
        relative
        h-[92px]
        w-[92px]
        shrink-0
        overflow-hidden
        rounded-[15px]
        border
        border-slate-200/80
        bg-slate-100
        shadow-sm
        sm:h-[96px]
        sm:w-[96px]
        dark:border-slate-700
        dark:bg-slate-800
      "
    >
      {showImage ? (
        <img
          src={src as string}
          alt={name || "Doctor"}
          loading="lazy"
          onError={() => setBroken(true)}
          className="
            h-full
            w-full
            object-cover
            object-top
            transition-transform
            duration-500
            group-hover:scale-[1.04]
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
            from-[#25336F]
            via-[#31529A]
            to-[#13A99A]
            text-xl
            font-extrabold
            text-white
          "
        >
          {initials(name)}
        </div>
      )}

      {/* Small online indicator */}
      <span
        className="
          absolute
          bottom-2
          right-2
          h-3
          w-3
          rounded-full
          border-2
          border-white
          bg-emerald-500
          shadow-sm
        "
      />
    </div>
  );
}

/* =========================================================
   DOCTOR CARD
   App-style compact horizontal card
========================================================= */

function AllDoctorCard({
  doctor,
}: {
  doctor: ExtendedDoctor;
}) {
  const name = doctor.user?.name || "Doctor";

  const specialization =
    doctor.specialization || "General Physician";

  const avatar =
    (doctor as any).profilePhoto ||
    doctor.user?.avatar ||
    null;

  const rating = doctor.rating ?? null;

  const location =
    doctor.clinic?.city ||
    doctor.clinic?.clinicName ||
    null;

  const consultationFee =
    (doctor as any).consultationFee ??
    (doctor as any).consultationFees ??
    (doctor as any).fee ??
    null;

  return (
    <div
      className="
        group
        relative
        block
        h-full
        w-full
        overflow-hidden
        rounded-[22px]
        p-[3px]

        bg-gradient-to-br
        from-[#252A67]
        via-[#3D4B91]
        to-[#14B8A6]

        shadow-[0_7px_24px_rgba(37,42,103,0.10)]

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:shadow-[0_15px_35px_rgba(20,184,166,0.18)]
      "
    >
      <div
        className="
          relative
          flex
          h-full
          min-h-[148px]
          flex-col
          justify-between
          gap-3

          overflow-hidden
          rounded-[19px]

          bg-white
          px-3.5
          py-3.5

          sm:min-h-[156px]
          sm:px-4

          dark:bg-slate-900
        "
      >
        {/* =================================================
            TOP: PHOTO + DETAILS (clickable -> profile)
        ================================================== */}

        <Link
          href={`/doctors/${doctor.id}`}
          className="
            flex
            items-center
            gap-3

            active:scale-[0.99]
          "
        >
        {/* =================================================
            DOCTOR PHOTO
        ================================================== */}

        <DoctorImage
          src={avatar}
          name={name}
        />

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="min-w-0 flex-1 self-stretch">
          <div className="flex h-full flex-col justify-center">
            {/* Name */}
            <h3
              className="
                truncate
                pr-1
                text-[15px]
                font-extrabold
                leading-5
                tracking-[-0.01em]
                text-[#182153]

                sm:text-[16px]

                dark:text-white
              "
            >
              {name}
            </h3>

            {/* Specialization */}
            <p
              className="
                mt-0.5
                truncate
                text-[12px]
                font-bold
                leading-5
                text-[#30488B]

                sm:text-[13px]

                dark:text-indigo-300
              "
            >
              {specialization}
            </p>

            {/* Clinic */}
            {location && (
              <div
                className="
                  mt-1
                  flex
                  min-w-0
                  items-center
                  gap-1
                "
              >
                <MapPin
                  className="
                    h-3
                    w-3
                    shrink-0
                    text-[#14A89A]
                  "
                />

                <span
                  className="
                    truncate
                    text-[10px]
                    font-medium
                    text-slate-500

                    sm:text-[11px]

                    dark:text-slate-400
                  "
                >
                  {location}
                </span>
              </div>
            )}
          </div>
        </div>
        </Link>

        {/* =================================================
            BOTTOM: RATING / FEE + BOOK NOW
        ================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-2
          "
        >
          {/* Rating / fee */}
          <div className="flex min-w-0 items-center gap-1.5">
            {rating != null ? (
              <span
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1
                  rounded-md
                  bg-amber-50
                  px-1.5
                  py-1

                  text-[10px]
                  font-bold
                  text-amber-700

                  sm:text-[11px]

                  dark:bg-amber-500/10
                  dark:text-amber-400
                "
              >
                <Star
                  className="
                    h-3
                    w-3
                    fill-amber-400
                    text-amber-400
                  "
                />

                {rating}
              </span>
            ) : (
              <span
                className="
                  truncate
                  text-[10px]
                  font-medium
                  text-slate-400
                "
              >
                Verified doctor
              </span>
            )}

            {consultationFee != null && (
              <span
                className="
                  shrink-0
                  text-[12px]
                  font-extrabold
                  text-[#182153]

                  sm:text-[13px]

                  dark:text-white
                "
              >
                ₹{consultationFee}
              </span>
            )}
          </div>

          {/* Book Now */}
          <Link
            href={`/doctors/${doctor.id}`}
            className="
              inline-flex
              shrink-0
              items-center
              gap-1
              rounded-full
              bg-gradient-to-r
              from-[#252A67]
              to-[#14B8A6]
              px-3
              py-1.5

              text-[11px]
              font-bold
              text-white

              shadow-sm
              shadow-[#252A67]/20

              transition-all
              hover:opacity-90
              active:scale-95

              sm:text-[11.5px]
            "
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AllDoctors() {
  const t = useTranslations("HomePage");

  const {
    data,
    isLoading,
  } = usePublicAllDoctors();

  const doctors =
    ((data as ExtendedDoctor[]) ?? []).filter(
      (doctor) => doctor?.id
    );

  const [active, setActive] = useState("All");

  const scrollRef =
    useRef<HTMLDivElement>(null);

  const autoScrollRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  /* =======================================================
     SPECIALTIES
  ======================================================= */

  const specialties = useMemo(() => {
    const set = new Set<string>();

    doctors.forEach((doctor) => {
      if (doctor.specialization) {
        set.add(doctor.specialization);
      }
    });

    return [
      "All",
      ...Array.from(set).slice(0, 10),
    ];
  }, [doctors]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredDoctors = useMemo(() => {
    if (active === "All") {
      return doctors;
    }

    return doctors.filter(
      (doctor) =>
        doctor.specialization === active
    );
  }, [doctors, active]);

  /* =======================================================
     SCROLL ONE CARD
  ======================================================= */

  const scroll = (
    direction: "left" | "right"
  ) => {
    const container = scrollRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-doctor-card]"
      );

    if (!firstCard) return;

    const cardWidth =
      firstCard.offsetWidth;

    const gap = 16;

    const amount =
      direction === "right"
        ? cardWidth + gap
        : -(cardWidth + gap);

    container.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  /* =======================================================
     AUTO SWIPE
     Every 3 seconds
  ======================================================= */

  useEffect(() => {
    if (
      isLoading ||
      filteredDoctors.length <= 1
    ) {
      return;
    }

    const startAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(
          autoScrollRef.current
        );
      }

      autoScrollRef.current =
        setInterval(() => {
          const container =
            scrollRef.current;

          if (!container) return;

          const maxScroll =
            container.scrollWidth -
            container.clientWidth;

          /*
           * When reaching the end,
           * smoothly return to beginning.
           */
          if (
            container.scrollLeft >=
            maxScroll - 10
          ) {
            container.scrollTo({
              left: 0,
              behavior: "smooth",
            });
          } else {
            scroll("right");
          }
        }, 3000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(
          autoScrollRef.current
        );
      }
    };
  }, [
    isLoading,
    filteredDoctors.length,
  ]);

  /* =======================================================
     PAUSE AUTO SWIPE ON HOVER / TOUCH
  ======================================================= */

  const pauseAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(
        autoScrollRef.current
      );
      autoScrollRef.current = null;
    }
  };

  const resumeAutoScroll = () => {
    if (
      isLoading ||
      filteredDoctors.length <= 1
    ) {
      return;
    }

    if (autoScrollRef.current) {
      clearInterval(
        autoScrollRef.current
      );
    }

    autoScrollRef.current =
      setInterval(() => {
        const container =
          scrollRef.current;

        if (!container) return;

        const maxScroll =
          container.scrollWidth -
          container.clientWidth;

        if (
          container.scrollLeft >=
          maxScroll - 10
        ) {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          scroll("right");
        }
      }, 3000);
  };

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!isLoading && doctors.length === 0) {
    return null;
  }

  return (
    <section
      className="
        mx-auto
        max-w-7xl
        border-b
        border-slate-100
        px-5
        py-6

        sm:py-7

        lg:px-8
        lg:py-7

        dark:border-slate-800
      "
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <SectionHeader
        title={
          t("allDoctors") ||
          "All Doctors"
        }
        subtitle="Browse doctors across specialities"
        viewAllHref="/doctors"
        viewAllLabel={
          t("viewAll") ||
          "View All"
        }
      />

      {/* ===================================================
          SPECIALTY FILTER
      ==================================================== */}

      {specialties.length > 1 && (
        <div
          className="
            mb-4
            flex
            items-center
            gap-2
            overflow-x-auto
            pb-1
            no-scrollbar
          "
        >
          {specialties.map(
            (specialty) => {
              const selected =
                active === specialty;

              return (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => {
                    setActive(
                      specialty
                    );

                    /*
                     * Reset carousel when
                     * changing specialty.
                     */
                    requestAnimationFrame(
                      () => {
                        scrollRef.current?.scrollTo(
                          {
                            left: 0,
                            behavior:
                              "smooth",
                          }
                        );
                      }
                    );
                  }}
                  className={`
                    shrink-0
                    rounded-full
                    px-4
                    py-2
                    text-[11px]
                    font-bold
                    transition-all
                    duration-200

                    ${
                      selected
                        ? `
                          bg-[#253A82]
                          text-white
                          shadow-[0_5px_14px_rgba(37,58,130,0.20)]
                        `
                        : `
                          border
                          border-slate-200
                          bg-white
                          text-slate-600
                          hover:border-[#3B4B91]/40
                          hover:text-[#253A82]
                          dark:border-slate-700
                          dark:bg-slate-900
                          dark:text-slate-300
                        `
                    }
                  `}
                >
                  {specialty}
                </button>
              );
            }
          )}
        </div>
      )}

      {/* ===================================================
          CAROUSEL AREA
      ==================================================== */}

      <div className="relative group">
        {/* ================================================
            LEFT BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            scroll("left")
          }
          aria-label="Previous doctors"
          className="
            absolute
            -left-3
            top-1/2
            z-30
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            text-[#253A82]
            shadow-[0_6px_20px_rgba(15,23,42,0.12)]
            transition-all
            duration-200
            hover:scale-105
            hover:bg-[#253A82]
            hover:text-white
            active:scale-95

            md:flex

            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* ================================================
            RIGHT BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            scroll("right")
          }
          aria-label="Next doctors"
          className="
            absolute
            -right-3
            top-1/2
            z-30
            hidden
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white
            text-[#253A82]
            shadow-[0_6px_20px_rgba(15,23,42,0.12)]
            transition-all
            duration-200
            hover:scale-105
            hover:bg-[#253A82]
            hover:text-white
            active:scale-95

            md:flex

            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* ================================================
            LOADING
        ================================================= */}

        {isLoading ? (
          <div
            className="
              flex
              gap-4
              overflow-hidden
              py-1
            "
          >
            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-[154px]
                    shrink-0
                    basis-[88%]
                    animate-pulse
                    rounded-[22px]
                    bg-slate-100

                    sm:basis-[70%]
                    md:basis-[48%]
                    lg:basis-[calc((100%-48px)/4)]
                    xl:basis-[calc((100%-64px)/5)]

                    dark:bg-slate-800
                  "
                />
              )
            )}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-8
              text-center
              text-sm
              font-medium
              text-slate-500
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            No doctors in “{active}”.
          </div>
        ) : (
          /* ==============================================
             ACTUAL CAROUSEL
          ============================================== */

          <div
            ref={scrollRef}
            onMouseEnter={
              pauseAutoScroll
            }
            onMouseLeave={
              resumeAutoScroll
            }
            onTouchStart={
              pauseAutoScroll
            }
            onTouchEnd={
              resumeAutoScroll
            }
            className="
              flex
              gap-4
              overflow-x-auto
              overflow-y-hidden

              px-1
              py-2

              scroll-smooth
              snap-x
              snap-mandatory
              overscroll-x-contain

              no-scrollbar

              [scrollbar-width:none]
              [-ms-overflow-style:none]

              [&::-webkit-scrollbar]:hidden
            "
          >
            {filteredDoctors.map(
              (doctor) => (
                <div
                  key={doctor.id}
                  data-doctor-card
                  className="
                    shrink-0
                    snap-start

                    basis-[88%]

                    sm:basis-[70%]

                    md:basis-[48%]

                    lg:basis-[calc((100%-48px)/4)]

                    xl:basis-[calc((100%-64px)/5)]
                  "
                >
                  <AllDoctorCard
                    doctor={doctor}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ===================================================
          MOBILE SWIPE INDICATOR
      ==================================================== */}

      {!isLoading &&
        filteredDoctors.length > 1 && (
          <div
            className="
              mt-2
              flex
              items-center
              justify-center
              gap-1.5
              text-[10px]
              font-semibold
              text-slate-400
              md:hidden
            "
          >
            <span>
              Swipe to explore more doctors
            </span>

            <ChevronRight
              className="
                h-3
                w-3
              "
            />
          </div>
        )}
    </section>
  );
}