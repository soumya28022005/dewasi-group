"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
    <article
      className="
        group
        relative
        h-full
        overflow-hidden
        rounded-[22px]
        bg-gradient-to-br
        from-[#252A67]
        via-[#3B4A8F]
        to-[#14B8A6]
        p-[3px]
        shadow-[0_8px_24px_rgba(37,42,103,0.09)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_38px_rgba(20,184,166,0.16)]
      "
    >
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
        {/* Favorite */}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite((prev) => !prev);
          }}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Save to favorites"
          }
          className="
            absolute
            right-3
            top-3
            z-30
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/80
            bg-white/90
            text-slate-400
            shadow-[0_4px_12px_rgba(0,0,0,0.11)]
            backdrop-blur-md
            transition-all
            hover:scale-105
            hover:text-red-500
            dark:border-slate-700
            dark:bg-slate-800/90
          "
        >
          <Heart
            className={`
              h-[15px]
              w-[15px]
              transition-all
              ${
                isFavorite
                  ? "scale-110 fill-red-500 text-red-500"
                  : ""
              }
            `}
          />
        </button>

        {/* Doctor Image */}

        <div
          className="
            relative
            h-[174px]
            overflow-hidden
            bg-slate-100

            sm:h-[190px]

            md:h-[184px]

            lg:h-[172px]

            xl:h-[180px]

            2xl:h-[185px]

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
                from-[#252A67]
                via-[#3B4A8F]
                to-[#14B8A6]
                text-4xl
                font-bold
                text-white
              "
            >
              {initials(name)}
            </div>
          )}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-24
              bg-gradient-to-t
              from-black/35
              via-black/5
              to-transparent
            "
          />

          {/* Verified */}

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
                py-1.5
                text-[8px]
                font-extrabold
                tracking-[0.08em]
                text-white
                shadow-lg
                shadow-emerald-500/20
                backdrop-blur-md
              "
            >
              <BadgeCheck className="h-3 w-3" />
              VERIFIED
            </span>
          </div>

          {/* Experience */}

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
                  text-[8px]
                  font-bold
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

                {experience}+ Years
              </span>
            </div>
          )}
        </div>

        {/* Content */}

        <div
          className="
            flex
            flex-1
            flex-col
            px-3.5
            pb-3.5
            pt-3.5

            lg:px-4
            lg:pb-4
            lg:pt-3.5
          "
        >
          <h3
            className="
              truncate
              text-[16px]
              font-extrabold
              leading-5
              tracking-[-0.02em]
              text-[#182153]
              dark:text-white
            "
          >
            {name}
          </h3>

          <p
            className="
              mt-1
              truncate
              text-[12px]
              font-semibold
              leading-5
              text-[#3B4A8F]
              dark:text-indigo-300
            "
          >
            {specialization}
          </p>

          {/* Rating */}

          {rating != null && (
            <div className="mt-2.5">
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-amber-50
                  px-2
                  py-1.5
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
                    text-[11px]
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
                      text-[10px]
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

          {/* Location */}

          {location && (
            <div
              className="
                mt-2.5
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
                    h-3
                    w-3
                    text-[#3B4A8F]
                  "
                />
              </div>

              <span
                className="
                  truncate
                  text-[10px]
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {location}
              </span>
            </div>
          )}

          {/* Available */}

          <div className="mt-2.5">
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
                py-1.5
                text-[9px]
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

          {/* Button */}

          <div className="mt-auto pt-3.5">
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
                from-[#252A67]
                via-[#3B4A8F]
                to-[#3B4A8F]
                py-2.5
                text-[12px]
                font-bold
                text-white
                shadow-md
                shadow-[#252A67]/15
                transition-all
                duration-300
                hover:from-[#252A67]
                hover:via-[#3B4A8F]
                hover:to-[#14B8A6]
                hover:shadow-lg
                hover:shadow-[#14B8A6]/20
                active:scale-[0.98]
              "
            >
              Book Appointment

              <ArrowRight
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-300
                  group-hover/btn:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
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

  const carouselRef =
    useRef<HTMLDivElement>(null);

  const [isInteracting, setIsInteracting] =
    useState(false);

  /* =========================================================
     AUTO SLIDE — EVERY 3 SECONDS
  ========================================================== */

  useEffect(() => {
    if (
      isLoading ||
      featured.length <= 1
    ) {
      return;
    }

    const container =
      carouselRef.current;

    if (!container) return;

    const interval = window.setInterval(() => {
      if (isInteracting) return;

      const cards =
        container.querySelectorAll<HTMLElement>(
          "[data-doctor-card]"
        );

      if (!cards.length) return;

      const currentScroll =
        container.scrollLeft;

      let nextCard: HTMLElement | null = null;

      for (const card of cards) {
        if (
          card.offsetLeft >
          currentScroll + 10
        ) {
          nextCard = card;
          break;
        }
      }

      if (!nextCard) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        return;
      }

      container.scrollTo({
        left: nextCard.offsetLeft,
        behavior: "smooth",
      });
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    featured.length,
    isLoading,
    isInteracting,
  ]);

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
          py-6
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
            -mx-1
            flex
            gap-4
            overflow-hidden
            px-1
          "
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="
                h-[430px]
                shrink-0
                basis-[82%]
                animate-pulse
                rounded-[22px]
                bg-slate-100

                sm:basis-[48%]

                md:basis-[31%]

                lg:basis-[calc((100%-48px)/4)]

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
        py-6
        lg:px-8
        dark:border-slate-800
      "
    >
      {/* HEADER */}

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
          RESPONSIVE CAROUSEL
      ====================================================== */}

      <div
        ref={carouselRef}
        onMouseEnter={() =>
          setIsInteracting(true)
        }
        onMouseLeave={() =>
          setIsInteracting(false)
        }
        onTouchStart={() =>
          setIsInteracting(true)
        }
        onTouchEnd={() => {
          window.setTimeout(() => {
            setIsInteracting(false);
          }, 1200);
        }}
        className="
          -mx-1
          flex
          gap-4
          overflow-x-auto
          overflow-y-hidden
          px-1
          pb-3
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
            data-doctor-card
            className="
              shrink-0
              snap-start

              /* MOBILE — keep the good 1.2 card view */
              basis-[82%]

              /* TABLET */
              sm:basis-[48%]

              /* DESKTOP — wide professional cards */
              md:basis-[34%]

              /* LARGE DESKTOP */
              lg:basis-[calc((100%-48px)/4)]

              /* VERY LARGE */
              xl:basis-[calc((100%-64px)/5)]

              /* ULTRA WIDE — prevents cards becoming too narrow */
              2xl:basis-[calc((100%-64px)/5)]
            "
          >
            <FeaturedDoctorCard
              doctor={doctor}
            />
          </div>
        ))}
      </div>

      {/* Mobile hint */}

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