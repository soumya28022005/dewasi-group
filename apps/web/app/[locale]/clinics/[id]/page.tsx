"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Building2,
  BadgeCheck,
  Stethoscope,
  Loader2,
  Star,
  Users,
  ArrowRight,
  ArrowLeft,
  Wifi,
  Navigation,
  PhoneCall,
  Clock,
  Sparkles,
  Award,
  IndianRupee,
  Search,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";

// ============================================================
// WHATSAPP ICON
// ============================================================
function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.482-1.46-1.656-1.758-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* =========================================================
   WHATSAPP NUMBER NORMALIZER
========================================================= */

function normalizeWhatsAppNumber(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/[^0-9]/g, "");
  if (!digits) return null;
  digits = digits.replace(/^0+/, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("91")) return digits;
  if (digits.length > 10) return digits;
  return `91${digits}`;
}

function initials(name?: string) {
  if (!name) return "CL";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function ClinicProfileSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-24 w-full animate-pulse bg-slate-100 dark:bg-slate-800" />

        <div className="px-6 pb-6 pt-3">
          <div className="-mt-12 h-24 w-24 animate-pulse rounded-2xl bg-slate-300 dark:bg-slate-700" />
          <div className="mt-4 space-y-3">
            <div className="h-7 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ClinicProfilePage() {
  const params = useParams();
  const clinicId = params.id as string;

  const [clinic, setClinic] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchClinic() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
        const res = await fetch(`${API_URL}/clinic/${clinicId}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        if (json.success && json.data) {
          setClinic(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (clinicId) fetchClinic();
  }, [clinicId]);

  const normalizedWhatsApp = useMemo(
    () => normalizeWhatsAppNumber(clinic?.whatsapp),
    [clinic?.whatsapp]
  );

  const filteredDoctors = useMemo(() => {
    if (!clinic?.allDoctors) return [];
    if (!searchQuery.trim()) return clinic.allDoctors;

    const q = searchQuery.toLowerCase().trim();

    return clinic.allDoctors.filter((doc: any) => {
      const text = [
        doc.user?.name,
        doc.specialization,
        doc.qualification,
        doc.associationDetails?.dayOfWeek,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [clinic?.allDoctors, searchQuery]);

  if (isLoading) return <ClinicProfileSkeleton />;

  if (error || !clinic) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
          <Building2 className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Clinic Not Found
        </h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          This clinic may have been removed or the link is incorrect.
        </p>
        <Link
          href="/clinics"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#252a67] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Clinics
        </Link>
      </div>
    );
  }

  /* SAFE VALUES */
  const name = clinic.clinicName || "Clinic";

  const addressLine = [clinic.address, clinic.city, clinic.state]
    .filter(Boolean)
    .join(", ");

  const fullAddress = [clinic.address, clinic.city, clinic.state, clinic.pincode]
    .filter(Boolean)
    .join(", ");

  const rating = typeof clinic.rating === "number" ? clinic.rating : null;

  const doctorsCount = Array.isArray(clinic.allDoctors)
    ? clinic.allDoctors.length
    : typeof clinic.doctorsCount === "number"
    ? clinic.doctorsCount
    : null;

  const specialties: string[] = Array.isArray(clinic.specialties)
    ? clinic.specialties
    : [];

  const mapsHref =
    clinic.googleMapsUrl ||
    (fullAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${name}, ${fullAddress}`
        )}`
      : null);

  const whatsappHref = normalizedWhatsApp
    ? `https://wa.me/${normalizedWhatsApp}`
    : null;

  const whatsappDisplay = normalizedWhatsApp ? `+${normalizedWhatsApp}` : null;

  return (
    <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      {/* BACK LINK */}
      <Link
        href="/clinics"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#1C63E7] dark:text-slate-400 sm:mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        All Clinics
      </Link>

      {/* ==========================================================
          HEADER — LIGHTER BANNER (no more dark blue dominance)
      ========================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl">
        {/* Light gradient banner — subtle, not dominating */}
        <div className="relative h-20 w-full overflow-hidden bg-gradient-to-r from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 sm:h-24">
          {/* Very subtle dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(59,74,143,0.15) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Soft accent line at bottom of banner */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#3B4A8F]/20 to-transparent" />

          {/* Verified badge — soft blue pill */}
          {clinic.isApproved && (
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-blue-200/60 bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#1D4ED8] shadow-sm backdrop-blur-md dark:border-blue-800/40 dark:bg-slate-900/80 dark:text-blue-400 sm:right-4 sm:top-4 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[10px]">
              <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Verified
            </div>
          )}
        </div>

        {/* LOGO */}
        <div className="relative px-4 sm:px-6">
          <div className="relative -mt-12 inline-block sm:-mt-14">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-[0_6px_20px_rgba(15,23,42,0.12)] dark:border-slate-900 dark:bg-slate-800 sm:h-28 sm:w-28">
              {clinic.logo ? (
                <img
                  src={clinic.logo}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#252a67] via-[#3B4A8F] to-[#14B8A6]">
                  <span className="text-2xl font-extrabold text-white sm:text-3xl">
                    {initials(name)}
                  </span>
                </div>
              )}
            </div>

            {clinic.isApproved && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#2563EB] shadow-md dark:border-slate-900 sm:h-7 sm:w-7">
                <BadgeCheck className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
              </div>
            )}
          </div>
        </div>

        {/* CLINIC INFO */}
        <div className="px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
          <h1 className="text-[20px] font-extrabold leading-tight tracking-tight text-[#0F1B33] dark:text-white sm:text-[26px]">
            {name}
          </h1>

          {addressLine && (
            <div className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#16A34A]" />
              <span className="line-clamp-2">{addressLine}</span>
            </div>
          )}

          {/* Pills */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {rating !== null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {rating.toFixed(1)}
              </span>
            )}

            {doctorsCount !== null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Users className="h-3 w-3" />
                {doctorsCount} Doctor{doctorsCount === 1 ? "" : "s"}
              </span>
            )}

            {clinic.onlineConsultationEnabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Online
              </span>
            )}
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {specialties.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Stethoscope className="h-2.5 w-2.5 text-[#14B8A6]" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {(clinic.phone || whatsappHref || mapsHref) && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {clinic.phone ? (
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-2 py-2.5 text-blue-700 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-400"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span className="text-xs font-bold">Call</span>
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 opacity-40 dark:border-slate-700 dark:bg-slate-800" />
              )}

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-2 py-2.5 text-emerald-700 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span className="text-xs font-bold">WhatsApp</span>
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 opacity-40 dark:border-slate-700 dark:bg-slate-800" />
              )}

              {mapsHref ? (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-2 py-2.5 text-red-700 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-400"
                >
                  <Navigation className="h-4 w-4" />
                  <span className="text-xs font-bold">Maps</span>
                </a>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 opacity-40 dark:border-slate-700 dark:bg-slate-800" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==========================================================
          DOCTORS SECTION — Search bar ABOVE, then grid
      ========================================================== */}

      <div className="mt-6 sm:mt-8">
        {/* Section header */}
        <div className="mb-3 flex items-end justify-between sm:mb-4">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#14B8A6] sm:h-3.5 sm:w-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#3B4A8F] dark:text-teal-400 sm:text-[10px]">
                Medical Team
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Doctors Available
            </h2>
          </div>

          {doctorsCount !== null && doctorsCount > 0 && (
            <span className="rounded-full bg-[#14B8A6]/10 px-2.5 py-1 text-[10px] font-bold text-[#0F766E] dark:bg-teal-500/10 dark:text-teal-400 sm:px-3 sm:py-1.5 sm:text-xs">
              {filteredDoctors.length} of {doctorsCount}
            </span>
          )}
        </div>

        {/* =============================================
            SEARCH BAR — matches the site-wide pattern used on /doctors
        ============================================= */}
        <div className="mb-4">
          <div
            className="
              flex min-w-0 items-center gap-3
              rounded-[18px]
              border border-slate-200/90
              bg-slate-50/75
              px-3.5 py-3
              transition-all duration-200
              focus-within:border-[#14B8A6]/45
              focus-within:bg-white
              focus-within:shadow-[0_5px_20px_-12px_rgba(20,184,166,0.3)]
              dark:border-slate-700
              dark:bg-slate-800/70
              dark:focus-within:bg-slate-800
            "
          >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-300">
              <Search className="h-[17px] w-[17px]" />
            </div>

            {/* Input */}
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                Search
              </p>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, specialties..."
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Clear */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Active search hint */}
          {searchQuery && (
            <p className="mt-2 px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-[#0F766E] dark:text-teal-400">
                {filteredDoctors.length}
              </span>{" "}
              result{filteredDoctors.length === 1 ? "" : "s"} for "
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {searchQuery}
              </span>
              "
            </p>
          )}
        </div>

        {/* Doctor grid — elevated card treatment */}
        {clinic.allDoctors && clinic.allDoctors.length > 0 ? (
          filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredDoctors.map((doctor: any) => {
                const doctorFee =
                  doctor.associationDetails?.fee || doctor.fee || null;

                return (
                  <div
                    key={doctor.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/40 hover:shadow-[0_12px_28px_-10px_rgba(20,184,166,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500/30"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      {doctor.user?.avatar ? (
                        <img
                          src={doctor.user.avatar}
                          alt={doctor.user?.name}
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#252a67] via-[#3B4A8F] to-[#14B8A6]">
                          <span className="text-2xl font-extrabold text-white sm:text-3xl">
                            {initials(doctor.user?.name || "DR")}
                          </span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

                      {doctor.isPrimary && (
                        <div className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[8px] font-extrabold text-[#252a67] shadow-md backdrop-blur-sm sm:gap-1 sm:px-2 sm:py-1 sm:text-[9px]">
                          <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          Primary
                        </div>
                      )}

                      {doctorFee && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] font-extrabold text-[#0F766E] shadow-md backdrop-blur-sm sm:gap-1 sm:px-2 sm:py-1 sm:text-[10px]">
                          <IndianRupee className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          {doctorFee}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                      <h3 className="truncate text-[12.5px] font-bold leading-tight text-slate-900 dark:text-white sm:text-[14px]">
                        {doctor.user?.name || "Doctor"}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 truncate text-[10px] font-semibold text-[#0F766E] dark:text-teal-400 sm:text-[11px]">
                        <Stethoscope className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                        <span className="truncate">
                          {doctor.specialization || "General Physician"}
                        </span>
                      </p>

                      {doctor.qualification && (
                        <p className="mt-1 hidden truncate text-[10.5px] text-slate-500 dark:text-slate-400 sm:block">
                          {doctor.qualification}
                        </p>
                      )}

                      {doctor.associationDetails?.startTime && (
                        <div className="mt-1.5 flex items-center gap-1 text-[9.5px] font-medium text-slate-500 dark:text-slate-400 sm:text-[10.5px]">
                          <Clock className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                          <span className="truncate">
                            {doctor.associationDetails.dayOfWeek
                              ? `${doctor.associationDetails.dayOfWeek.slice(0, 3)} · `
                              : ""}
                            {doctor.associationDetails.startTime}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-3">
                        <Link
                          href={`/doctors/${doctor.id}`}
                          className="flex h-8 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#252a67] to-[#3B4A8F] text-[10.5px] font-bold text-white shadow-sm transition-all group-hover:shadow-md sm:h-9 sm:text-[11.5px]"
                        >
                          Book
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Search empty state */
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                <Search className="h-5 w-5 text-slate-400" />
              </div>

              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                No doctors found
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try a different name or specialty.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Clear search
              </button>
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50 sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
              <Users className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
              No doctors listed yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Doctors will appear here once they join this clinic.
            </p>
          </div>
        )}
      </div>

      {/* ==========================================================
          LOCATION & CONTACT — MOVED BELOW doctors
      ========================================================== */}

      {(fullAddress || clinic.phone || whatsappDisplay) && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:mt-10">
          <div className="border-b border-slate-100 px-4 py-3.5 dark:border-slate-800 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14B8A6]/10">
                <MapPin className="h-4 w-4 text-[#14B8A6]" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white sm:text-base">
                  Location & Contact
                </h2>
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500">
                  Visit or reach out to the clinic
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {/* ADDRESS */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#252a67]/8 dark:bg-blue-500/10">
                <MapPin className="h-4 w-4 text-[#252a67] dark:text-blue-400" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                  Address
                </p>
                <p className="mt-0.5 text-[13px] leading-5 text-slate-700 dark:text-slate-300 sm:text-sm">
                  {fullAddress || "Not provided"}
                </p>
              </div>
            </div>

            {/* PHONE */}
            {clinic.phone && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <PhoneCall className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                    Phone
                  </p>
                  <a
                    href={`tel:${clinic.phone}`}
                    className="mt-0.5 block text-[13px] font-semibold text-slate-700 hover:text-[#1C63E7] dark:text-slate-300 sm:text-sm"
                  >
                    {clinic.phone}
                  </a>
                </div>
              </div>
            )}

            {/* WHATSAPP */}
            {whatsappDisplay && whatsappHref && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                    WhatsApp
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-[13px] font-semibold text-slate-700 hover:text-[#25D366] dark:text-slate-300 sm:text-sm"
                  >
                    {whatsappDisplay}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}