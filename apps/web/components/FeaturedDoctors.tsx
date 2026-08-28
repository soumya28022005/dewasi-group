"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Award, Stethoscope, Star, BadgeCheck, ArrowRight } from "lucide-react";
import type { Doctor } from "@doctor-contract/shared";
import { Link } from "@/i18n/routing";
import { usePublicFeaturedDoctors } from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";

// ============================================================
// INITIALS
// ============================================================

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ============================================================
// EXPERIENCE BADGE (Keep exactly as you had it)
// ============================================================

function ExperienceBadge({ years }: { years: number }) {
  if (!years || years <= 0) return null;

  return (
    <div className="absolute bottom-0 left-0 z-0">
      <div className="flex items-center gap-1.5 rounded-full border border-white/80 bg-[#252a67]/95 px-3 py-1.5 shadow-[0_5px_14px_rgba(37,42,103,0.35)] backdrop-blur-sm">
        <Award
          className="h-3.5 w-3.5 text-amber-300"
          strokeWidth={2.5}
        />

        <span className="whitespace-nowrap text-[11px] font-extrabold tracking-wide text-white md:text-xs">
          {years} Years Experience
        </span>
      </div>
    </div>
  );
}

// ============================================================
// DOCTOR CARD - Adding 3px gradient border around the whole card
// ============================================================

function FeaturedDoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const experience = doctor.experience ?? 0;
  const rating = (doctor as any).rating ?? 4.5;
  const reviews = (doctor as any).reviewCount ?? 120;
  const avatarSrc = (doctor as any).profilePhoto || (doctor as any).user?.avatar;

  return (
    <Link
      href="/doctors"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="group block h-full w-full"
    >
      {/* 3px Gradient Border Wrapper */}
      <div className="rounded-2xl p-[3px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-[0_4px_20px_-6px_rgba(37,42,103,0.4)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(20,184,166,0.3)]">
        {/* Inner Card (your original card) */}
        <div className="doctor-card h-full rounded-[calc(1rem-3px)] bg-white overflow-hidden">
          <div className="pt-3 md:p-4">
            <div className="flex flex-col px-2 pb-2 items-center md:flex-row">
              {/* ================= PROFILE IMAGE ================= */}
              <div className="relative flex md:mb-0 w-[12rem] h-[16rem] md:w-[10rem] md:h-[14rem] flex-shrink-0">

                {/* Experience Badge (top-left, as original) */}
                <ExperienceBadge years={experience} />
                
                {/* Image */}
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={doctor.user.name}
                    className="w-full h-full rounded-2xl object-cover border-2 border-[#252a67]"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl object-cover border-2 border-[#252a67] bg-gradient-to-br from-[#2563EB] to-[#6a7583] flex items-center justify-center text-white text-4xl font-bold">
                    {initials(doctor.user.name)}
                  </div>
                )}

                {/* Verified Badge (bottom-right) */}
                <BadgeCheck className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white text-[#2563EB] shadow-md ring-2 ring-white dark:bg-slate-800 dark:ring-slate-700" />
              </div>

              {/* ================= DOCTOR DETAILS ================= */}
              <div className="flex flex-col md:p-3 text-center md:text-left mt-3 md:mt-0">
                {/* Doctor Name - with gradient style */}
                <h3 className="text-[1.3rem] md:text-2xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-[#422995] to-[#4a9860] bg-clip-text text-transparent">
                    {doctor.user.name}
                  </span>
                </h3>

                {doctor.qualification && (
                  <p className="text-black font-semibold text-sm md:text-sm mt-0.5">
                    {doctor.qualification}
                  </p>
                )}

                {doctor.specialization && (
                  <p className="text-gray-700 text-sm md:text-lg">
                    {doctor.specialization}
                  </p>
                )}

                {location && (
                  <div className="text-black flex flex-wrap gap-1 items-center text-sm md:text-lg justify-center md:justify-start mt-1">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span
                      style={{
                        background: "#eef2ff",
                        color: "#252a67",
                        padding: "1px 10px",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        border: "1px solid #c7d2fe",
                      }}
                    >
                      {location}
                    </span>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{rating}</span>
                  <span className="text-[11px] text-gray-400">({reviews})</span>
                </div>

                {/* Consultation Fee */}
                {doctor.fee != null && (
                  <div className="mt-2">
                    <span className="text-lg font-bold text-[#252a67]">₹{doctor.fee}</span>
                    <span className="text-xs text-gray-400"> / visit</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// MAIN SECTION (unchanged logic)
// ============================================================

export default function FeaturedDoctors() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicFeaturedDoctors();
  const featured = data ?? [];

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || featured.length < 2) return;
    autoSlideRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4500);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [isMobile, featured.length]);

  function restartAutoSlide() {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (!isMobile || featured.length < 2) return;
    autoSlideRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 4500);
  }

  function goTo(i: number) {
    setIndex(i);
    restartAutoSlide();
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setIndex((i) => (i + 1) % featured.length);
      } else {
        setIndex((i) => (i - 1 + featured.length) % featured.length);
      }
    }
    touchStartX.current = null;
    restartAutoSlide();
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <SectionHeader eyebrow="Trusted Healthcare" title={t("featuredDoctors")} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null;
  }

  const total = featured.length;
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <SectionHeader
        eyebrow="Trusted Healthcare"
        title={t("featuredDoctors")}
        viewAllHref="/doctors"
        viewAllLabel={t("viewAll")}
      />

      {/* Tablet / Desktop Grid */}
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {featured.map((doctor, i) => (
          <FeaturedDoctorCard key={doctor.id} doctor={doctor} index={i} />
        ))}
      </div>

      {/* Mobile - Swipe Carousel */}
      <div
        className="relative h-[29rem] overflow-hidden pb-9 md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {featured.map((doctor, i) => {
          let position: "center" | "left" | "right" | "hidden" = "hidden";
          if (i === index) position = "center";
          else if (i === prevIndex) position = "left";
          else if (i === nextIndex) position = "right";

          const styles: Record<typeof position, string> = {
            center: "left-1/2 -translate-x-1/2 scale-100 opacity-100 blur-0 z-30 drop-shadow-[0_18px_30px_rgba(37,42,103,0.22)]",
            left: "left-0 -translate-x-[4%] scale-[0.86] opacity-45 blur-[1.5px] z-20",
            right: "left-full -translate-x-[104%] scale-[0.86] opacity-45 blur-[1.5px] z-20",
            hidden: "opacity-0 pointer-events-none",
          };

          return (
            <div
              key={doctor.id}
              className={`absolute top-1 w-[78%] max-w-[300px] transition-all duration-500 ease-out ${styles[position]}`}
            >
              <FeaturedDoctorCard doctor={doctor} index={i} />
            </div>
          );
        })}

        {/* Progress Dots */}
        <div className="absolute bottom-1 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
          {featured.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-2 w-6 bg-gradient-to-r from-[#252a67] to-[#14B8A6]"
                  : "h-2 w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}