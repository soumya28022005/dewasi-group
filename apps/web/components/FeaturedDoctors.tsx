"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Star,
  Heart,
  BadgeCheck,
  MapPin,
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";

import { Link } from "@/i18n/routing";
import { usePublicFeaturedDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";
import { ExtendedDoctor } from "@/types/doctor";

function initials(name?: string) {
  if (!name) return "DR";

  return name
    .replace(/^dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function FeaturedDoctorCard({
  doctor,
}: {
  doctor: ExtendedDoctor;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const name = doctor.user?.name || "Doctor";

  const specialization =
    doctor.specialization || "General Physician";

  const experience = doctor.experience ?? 0;

  const rating = doctor.rating ?? null;

  const reviews = doctor.reviewCount ?? null;

  const avatar =
    (doctor as any).profilePhoto ||
    doctor.user?.avatar ||
    null;

  const location =
    doctor.clinic?.city ||
    doctor.clinic?.clinicName ||
    null;

  return (
    <div
      className="
        group
        relative
        h-full

        rounded-[22px]
        p-[3px]

        bg-gradient-to-br
        from-[#252a67]
        via-[#3b4a8f]
        to-[#14B8A6]

        shadow-[0_8px_30px_rgba(37,42,103,0.10)]

        transition-all
        duration-300
        ease-out

        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(20,184,166,0.18)]
      "
    >
      {/* =====================================================
          INNER CARD
      ====================================================== */}
      <div
        className="
          relative
          flex
          h-full
          min-w-0
          flex-col

          overflow-hidden
          rounded-[19px]

          bg-white

          dark:bg-slate-900
        "
      >
        {/* =====================================================
            FAVORITE
        ====================================================== */}
        <button
          type="button"
          onClick={() =>
            setIsFavorite((prev) => !prev)
          }
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Save to favorites"
          }
          className="
            absolute
            right-3
            top-3
            z-20

            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-full

            border
            border-white/80

            bg-white/90

            text-slate-400

            shadow-md
            backdrop-blur-md

            transition-all
            duration-200

            hover:scale-105
            hover:text-red-500

            dark:border-slate-700
            dark:bg-slate-800/90
          "
        >
          <Heart
            className={`
              h-[17px]
              w-[17px]

              transition-all
              duration-200

              ${
                isFavorite
                  ? "scale-110 fill-red-500 text-red-500"
                  : ""
              }
            `}
          />
        </button>

        {/* =====================================================
            IMAGE
        ====================================================== */}
        <div
          className="
            relative
            h-44

            overflow-hidden

            bg-slate-100

            sm:h-48

            dark:bg-slate-800
          "
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              loading="lazy"
              className="
                h-full
                w-full

                object-cover
                object-top

                transition-transform
                duration-700
                ease-out

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
                from-[#252a67]
                via-[#3b4a8f]
                to-[#14B8A6]

                text-5xl
                font-bold
                text-white
              "
            >
              {initials(name)}
            </div>
          )}

          {/* Image bottom overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0

              h-24

              bg-gradient-to-t
              from-black/30
              via-black/5
              to-transparent
            "
          />

          {/* =====================================================
              VERIFIED
          ====================================================== */}
          <div className="absolute left-3 top-3">
            <span
              className="
                inline-flex
                items-center
                gap-1.5

                rounded-full

                bg-gradient-to-r
                from-emerald-500
                to-teal-500

                px-2.5
                py-1

                text-[10px]
                font-bold
                tracking-wide

                text-white

                shadow-lg
                shadow-emerald-500/20

                backdrop-blur-md
              "
            >
              <BadgeCheck className="h-3.5 w-3.5" />

              VERIFIED
            </span>
          </div>

          {/* =====================================================
              EXPERIENCE ON IMAGE
          ====================================================== */}
          {experience > 0 && (
            <div className="absolute bottom-3 left-3">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-full

                  border
                  border-white/20

                  bg-slate-950/65

                  px-2.5
                  py-1.5

                  text-[10px]
                  font-semibold
                  tracking-wide

                  text-white

                  shadow-sm

                  backdrop-blur-md
                "
              >
                <BriefcaseBusiness
                  className="
                    h-3
                    w-3
                    text-teal-300
                  "
                />

                {experience}+ Years Experience
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div
          className="
            flex
            flex-1
            flex-col

            px-4
            pb-4
            pt-4
          "
        >
          {/* ===================================================
              DOCTOR NAME
          ==================================================== */}
          <h3
            className="
              truncate

              text-[17px]
              font-extrabold
              leading-5

              tracking-[-0.01em]

              text-[#182153]

              dark:text-white
            "
          >
            {name}
          </h3>

          {/* ===================================================
              SPECIALIZATION
          ==================================================== */}
          <p
            className="
              mt-1

              truncate

              text-[13px]
              font-semibold
              leading-5

              text-[#3B4A8F]

              dark:text-indigo-300
            "
          >
            {specialization}
          </p>

          {/* ===================================================
              RATING + REVIEWS
          ==================================================== */}
          {rating != null && (
            <div className="mt-3 flex items-center">
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-lg

                  bg-amber-50

                  px-2
                  py-1

                  dark:bg-amber-500/10
                "
              >
                <Star
                  className="
                    h-3.5
                    w-3.5

                    fill-amber-400
                    text-amber-400
                  "
                />

                <span
                  className="
                    text-[12px]
                    font-bold

                    text-amber-700

                    dark:text-amber-400
                  "
                >
                  {rating}
                </span>

                {reviews != null && (
                  <span
                    className="
                      text-[11px]
                      font-medium

                      text-amber-600/70

                      dark:text-amber-400/70
                    "
                  >
                    ({reviews})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              LOCATION
          ==================================================== */}
          {location && (
            <div
              className="
                mt-3

                flex
                min-w-0
                items-center
                gap-1.5
              "
            >
              <div
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center

                  rounded-md

                  bg-slate-100

                  dark:bg-slate-800
                "
              >
                <MapPin
                  className="
                    h-3.5
                    w-3.5

                    text-[#3B4A8F]
                  "
                />
              </div>

              <span
                className="
                  truncate

                  text-[11px]
                  font-medium

                  text-slate-500

                  dark:text-slate-400
                "
              >
                {location}
              </span>
            </div>
          )}

          {/* ===================================================
              AVAILABILITY
          ==================================================== */}
          <div className="mt-3">
            <span
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

                text-emerald-700

                dark:border-emerald-500/20
                dark:bg-emerald-500/10
                dark:text-emerald-400
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5

                  animate-pulse

                  rounded-full

                  bg-emerald-500
                "
              />

              Available Today
            </span>
          </div>

          {/* ===================================================
              CTA
          ==================================================== */}
          <div className="mt-auto pt-4">
            <Link
              href={`/doctors/${doctor.id}`}
              className="
                group/btn

                flex
                w-full
                items-center
                justify-center
                gap-2

                rounded-xl

                bg-gradient-to-r
                from-[#252a67]
                via-[#3b4a8f]
                to-[#3b4a8f]

                py-2.5

                text-[13px]
                font-bold

                text-white

                shadow-md
                shadow-[#252a67]/15

                transition-all
                duration-300

                hover:from-[#252a67]
                hover:via-[#3b4a8f]
                hover:to-[#14B8A6]

                hover:shadow-lg
                hover:shadow-[#14B8A6]/20

                active:scale-[0.98]
              "
            >
              Book Appointment

              <ArrowRight
                className="
                  h-4
                  w-4

                  transition-transform
                  duration-300

                  group-hover/btn:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedDoctors() {
  const t = useTranslations("HomePage");

  const {
    data,
    isLoading,
  } = usePublicFeaturedDoctors();

  const featured =
    ((data as ExtendedDoctor[]) ?? []).filter(
      (doctor) => doctor?.id
    );

  /* =========================================================
     LOADING
  ========================================================== */
  if (isLoading) {
    return (
      <section
        className="
          mx-auto
          max-w-7xl

          border-b
          border-slate-100

          px-5
          py-7

          lg:px-8

          dark:border-slate-800
        "
      >
        <SectionHeader
          title={
            t("featuredDoctors") ||
            "Featured Doctors"
          }
          subtitle="Top rated and most trusted doctors near you"
        />

        <div
          className="
            flex
            gap-5
            overflow-hidden
          "
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="
                h-[390px]

                shrink-0

                basis-[82%]

                animate-pulse

                rounded-[22px]

                bg-slate-100

                sm:basis-[48%]
                md:basis-[32%]
                lg:basis-[calc((100%-60px)/4)]
                xl:basis-[calc((100%-80px)/5)]

                dark:bg-slate-800
              "
            />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
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
        py-7

        lg:px-8

        dark:border-slate-800
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <SectionHeader
        title={
          t("featuredDoctors") ||
          "Featured Doctors"
        }
        subtitle="Top rated and most trusted doctors near you"
        viewAllHref="/doctors/featured"
        viewAllLabel={
          t("viewAll") || "View All"
        }
      />

      {/* =====================================================
          HORIZONTAL DOCTOR ROW
      ====================================================== */}
      <div
        className="
          -mx-1

          flex
          gap-5

          overflow-x-auto
          overflow-y-hidden

          px-1
          pb-4

          snap-x
          snap-mandatory

          scroll-smooth

          overscroll-x-contain

          [scrollbar-width:none]
          [-ms-overflow-style:none]

          [&::-webkit-scrollbar]:hidden
        "
      >
        {featured.map((doctor) => (
          <div
            key={doctor.id}
            className="
              shrink-0
              snap-start

              basis-[82%]

              sm:basis-[48%]

              md:basis-[32%]

              lg:basis-[calc((100%-60px)/4)]

              xl:basis-[calc((100%-80px)/5)]
            "
          >
            <FeaturedDoctorCard
              doctor={doctor}
            />
          </div>
        ))}
      </div>

      {/* =====================================================
          MOBILE SWIPE HINT
      ====================================================== */}
      {featured.length > 1 && (
        <div
          className="
            mt-1

            flex
            items-center
            justify-center
            gap-1.5

            text-[10px]
            font-medium

            text-slate-400

            sm:hidden
          "
        >
          <span>
            Swipe to explore more doctors
          </span>

          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </section>
  );
}