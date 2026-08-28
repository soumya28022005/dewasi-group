"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck, Wifi, Users, Building2 } from "lucide-react";

import { Link } from "@/i18n/routing";
import {
  usePublicFeaturedClinics,
  type PublicClinic,
} from "@/lib/hooks/usePublicDirectory";
import SectionHeader from "@/components/SectionHeader";

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
// VERIFIED BADGE (same treatment as the Doctor card's
// ExperienceBadge — top-left chip on the photo)
// ============================================================

function VerifiedBadge() {
  return (
    <div className="absolute bottom-0 left-0 z-0">
      <div className="flex items-center gap-1.5 rounded-full border border-white/80 bg-[#252a67]/95 px-3 py-1.5 shadow-[0_5px_14px_rgba(37,42,103,0.35)] backdrop-blur-sm">
        <ShieldCheck
          className="h-3.5 w-3.5 text-amber-300"
          strokeWidth={2.5}
        />

        <span className="whitespace-nowrap text-[11px] font-extrabold tracking-wide text-white md:text-xs">
          Verified Clinic
        </span>
      </div>
    </div>
  );
}

// ============================================================
// Featured Clinic Card — same layout as FeaturedDoctorCard:
// full-size photo left, gradient border, details right
// ============================================================

function FeaturedClinicCard({
  clinic,
  index,
}: {
  clinic: PublicClinic;
  index: number;
}) {
  const location = [clinic.city, clinic.state].filter(Boolean).join(", ") || clinic.address;
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link
      href="/clinics"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
      className="group block h-full w-full"
    >
      {/* 3px Gradient Border Wrapper */}
      <div className="rounded-2xl p-[3px] bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] shadow-[0_4px_20px_-6px_rgba(37,42,103,0.4)] transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(20,184,166,0.3)]">
        {/* Inner Card */}
        <div className="doctor-card h-full rounded-[calc(1rem-3px)] bg-white overflow-hidden">
          <div className="pt-3 md:p-4">
            <div className="flex flex-col px-2 pb-2 items-center md:flex-row">
              {/* ================= CLINIC PHOTO ================= */}
              <div className="relative flex md:mb-0 w-[12rem] h-[16rem] md:w-[10rem] md:h-[14rem] flex-shrink-0">

                {/* Verified Badge (top-left, matches doctor card) */}
                {clinic.isApproved && <VerifiedBadge />}

                {/* Photo */}
                {clinic.logo && !logoFailed ? (
                  <img
                    src={clinic.logo}
                    alt={clinic.clinicName}
                    onError={() => setLogoFailed(true)}
                    className="w-full h-full rounded-2xl object-cover border-2 border-[#252a67]"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl object-cover border-2 border-[#252a67] bg-gradient-to-br from-[#2563EB] to-[#6a7583] flex items-center justify-center text-white text-4xl font-bold">
                    {initials(clinic.clinicName)}
                  </div>
                )}

                {/* Small check badge (bottom-right, matches doctor card) */}
                <Building2 className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white p-1.5 text-[#2563EB] shadow-md ring-2 ring-white dark:bg-slate-800 dark:ring-slate-700" />
              </div>

              {/* ================= CLINIC DETAILS ================= */}
              <div className="flex flex-col md:p-3 text-center md:text-left mt-3 md:mt-0">
                {/* Clinic Name - with gradient style */}
                <h3 className="text-[1.3rem] md:text-2xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-[#422995] to-[#4a9860] bg-clip-text text-transparent">
                    {clinic.clinicName}
                  </span>
                </h3>

                {clinic.specialties && clinic.specialties.length > 0 && (
                  <p className="text-black font-semibold text-sm md:text-sm mt-0.5">
                    {clinic.specialties.slice(0, 3).join(" · ")}
                  </p>
                )}

                {typeof clinic.doctorsCount === "number" && (
                  <p className="text-gray-700 text-sm md:text-lg">
                    {clinic.doctorsCount} doctor{clinic.doctorsCount === 1 ? "" : "s"}
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

                {/* Online consultation */}
                {clinic.onlineConsultationEnabled && (
                  <div className="mt-2 flex justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#14B8A6]/25 bg-[#14B8A6]/10 px-3 py-1 text-xs font-bold text-[#0f766e]">
                      <Wifi className="h-3.5 w-3.5" />
                      Online consultation
                    </span>
                  </div>
                )}

                {/* View Clinic */}
                <div className="mt-2">
                  <span className="text-sm font-bold text-[#252a67]">View Clinic</span>
                  <span className="ml-1 text-xs text-gray-400">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// MAIN SECTION — desktop grid + mobile swipe carousel,
// matching the FeaturedDoctors layout/behavior
// ============================================================

export default function FeaturedClinics() {
  const t = useTranslations("HomePage");
  const { data, isLoading } = usePublicFeaturedClinics();
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
        <SectionHeader eyebrow="Partner Network" title={t("featuredClinics")} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-3xl border border-gray-100 bg-gray-50 dark:border-soft-300 dark:bg-soft-50"
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
        eyebrow="Partner Network"
        title={t("featuredClinics")}
        viewAllHref="/clinics"
        viewAllLabel={t("viewAll")}
      />

      {/* Tablet / Desktop Grid */}
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {featured.map((clinic, i) => (
          <FeaturedClinicCard key={clinic.id} clinic={clinic} index={i} />
        ))}
      </div>

      {/* Mobile - Swipe Carousel */}
      <div
        className="relative h-[29rem] overflow-hidden pb-9 md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {featured.map((clinic, i) => {
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
              key={clinic.id}
              className={`absolute top-1 w-[78%] max-w-[300px] transition-all duration-500 ease-out ${styles[position]}`}
            >
              <FeaturedClinicCard clinic={clinic} index={i} />
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