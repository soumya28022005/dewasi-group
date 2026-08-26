"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Award, ShieldCheck, Stethoscope, Star, BadgeCheck, ArrowRight } from "lucide-react";

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
// GRADIENT BORDER WRAPPER (CHINA BEST - BLUE TEAL)
// ============================================================

function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[28px] p-[2px] bg-gradient-to-br from-[#2563EB] via-[#0F766E] to-[#14B8A6] shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(37,99,235,0.2)]">
      <div className="rounded-[calc(28px-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// FEATURED DOCTOR CARD (BLUE TEAL GRADIENT BORDER)
// ============================================================

function FeaturedDoctorCard({
  doctor,
  index,
}: {
  doctor: Doctor;
  index: number;
}) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;
  const experience = doctor.experience ?? 0;
  const rating = (doctor as any).rating ?? 4.5;
  const reviews = (doctor as any).reviewCount ?? 120;

  return (
    <Link
      href="/doctors"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="group block h-full w-full"
    >
      <GradientBorderCard>
        <div className="relative flex h-full flex-col p-6 overflow-hidden">
          {/* Subtle decorative blob */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-[#2563EB]/5 to-[#0F766E]/10 blur-2xl" />

          {/* Profile Area */}
          <div className="relative flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                {initials(doctor.user.name)}
              </div>
              <BadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-[#2563EB] shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700" />
            </div>

            {/* Doctor Info */}
            <div className="min-w-0 flex-1 pt-1">
              <h3 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {doctor.user.name}
              </h3>
              {doctor.qualification && (
                <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {doctor.qualification}
                </p>
              )}
              {doctor.specialization && (
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {doctor.specialization}
                </p>
              )}
            </div>
          </div>

          {/* Experience & Rating */}
          <div className="mt-4 flex items-center gap-4">
            {experience > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                {experience}+ yrs
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">{rating}</span>
              <span className="text-xs text-slate-400">({reviews})</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-slate-50 dark:bg-slate-800" />

          {/* Location & Fee */}
          <div className="space-y-2">
            {location && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 shrink-0 text-[#0F766E]" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {doctor.fee != null && (
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className="text-[#2563EB]">₹{doctor.fee}</span>
                <span className="text-xs font-normal text-slate-400">/ visit</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 transition-colors group-hover:bg-slate-100 dark:bg-slate-800/50 dark:group-hover:bg-slate-800">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">View Profile</span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#2563EB]" />
            </div>
          </div>
        </div>
      </GradientBorderCard>
    </Link>
  );
}

// ============================================================
// MAIN SECTION
// ============================================================

export default function FeaturedDoctors() {
  const t = useTranslations("HomePage");

  const { data, isLoading } = usePublicFeaturedDoctors();
  const featured = data ?? [];

  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mobile Detection
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto Slide (mobile only)
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

  // Loading / Empty
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <SectionHeader eyebrow="Trusted Healthcare" title={t("featuredDoctors")} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-[28px] border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50"
            />
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
        className="relative h-[24rem] overflow-hidden md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {featured.map((doctor, i) => {
          let position: "center" | "left" | "right" | "hidden" = "hidden";

          if (i === index) position = "center";
          else if (i === prevIndex) position = "left";
          else if (i === nextIndex) position = "right";

          const styles: Record<typeof position, string> = {
            center: "left-1/2 -translate-x-1/2 scale-100 opacity-100 blur-0 z-30",
            left: "left-0 -translate-x-[10%] scale-[0.85] opacity-60 blur-[2px] z-20",
            right: "left-full -translate-x-[110%] scale-[0.85] opacity-60 blur-[2px] z-20",
            hidden: "opacity-0 pointer-events-none",
          };

          return (
            <div
              key={doctor.id}
              className={`absolute top-0 w-[84%] max-w-[320px] transition-all duration-700 ease-out ${styles[position]}`}
            >
              <FeaturedDoctorCard doctor={doctor} index={i} />
            </div>
          );
        })}

        {/* Progress Dots */}
        <div className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-2 w-6 bg-[#2563EB]"
                  : "h-2 w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}