"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Loader2,
  Navigation,
  Search,
  Radio,
  CalendarCheck,
  Users,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";

import DoctorGrid from "@/components/DoctorGrid";
import { useLocationCity } from "@/lib/hooks/useLocationCity";
import { fetchSearchLocations } from "@/lib/api";

interface Location {
  id: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
  isActive?: boolean;
}

function GradientCard({
  children,
  className = "",
  gradient = "from-[#252a67] via-[#3b4a8f] to-[#14B8A6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`
        relative rounded-[22px] p-[1px]
        bg-gradient-to-r ${gradient}
        shadow-[0_8px_30px_-14px_rgba(37,42,103,0.35)]
        ${className}
      `}
    >
      <div className="h-full rounded-[21px] bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}

function DoctorsPage() {
  return (
    <Suspense fallback={null}>
      <DoctorsPageContent />
    </Suspense>
  );
}

function DoctorsPageContent() {
  const t = useTranslations("DoctorSearch");

  const { city, status, setManualCity } = useLocationCity();
  const searchParams = useSearchParams();

  const initialTab =
    searchParams.get("live") === "true"
      ? "LIVE"
      : searchParams.get("available") === "true"
        ? "AVAILABLE"
        : "ALL";

  const [activeTab, setActiveTab] = useState<
    "ALL" | "AVAILABLE" | "LIVE"
  >(initialTab);

  const [query, setQuery] = useState(
    searchParams.get("q") ??
      searchParams.get("specialty") ??
      searchParams.get("treatment") ??
      ""
  );

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  const cityParam = searchParams.get("city");

  /*
   * ---------------------------------------------------------
   * LOAD LOCATIONS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    setLocationsLoading(true);

    fetchSearchLocations()
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          setLocations(data);
        } else if (data && Array.isArray(data.data)) {
          setLocations(data.data);
        } else {
          setLocations([]);
        }
      })
      .catch((error) => {
        console.error("Failed to load locations:", error);

        if (mounted) {
          setLocations([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLocationsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * INITIAL CITY FROM URL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (cityParam?.trim()) {
      setManualCity(cityParam.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityParam]);

  /*
   * ---------------------------------------------------------
   * LOCATION CHANGE
   * ---------------------------------------------------------
   */

  function handleLocationChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.target.value.trim();

    setManualCity(value);
  }

  /*
   * ---------------------------------------------------------
   * CLEAR LOCATION
   * ---------------------------------------------------------
   */

  function clearLocation() {
    setManualCity("");
  }

  /*
   * ---------------------------------------------------------
   * LOCALIZED LOCATION NAME
   * ---------------------------------------------------------
   */

  function getLocalizedName(location: Location) {
    const locale = t("locale");

    if (locale === "bn") {
      return location.nameBn;
    }

    if (locale === "hi") {
      return location.nameHi;
    }

    return location.nameEn;
  }

  /*
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   *
   * Query is intentionally passed directly to DoctorGrid.
   * This keeps the existing backend/search behaviour intact.
   *
   * Doctor name
   * Clinic name
   * Specialization
   * Treatment
   * etc.
   * are handled by the existing DoctorGrid/data layer.
   */

  function handleSearchChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setQuery(e.target.value);
  }

  function clearSearch() {
    setQuery("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <GradientCard>
        <div className="relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
          {/* Soft background accents */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#252a67]/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-[#14B8A6]/5 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-sm">
                  <Users className="h-4 w-4" />
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#252a67] dark:text-blue-300">
                  {t("findDoctors") || "Find Doctors"}
                </p>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {t("heading") || "Doctor Directory"}
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {t("subheading") ||
                  "Search trusted doctors, clinics and specialists near you"}
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3.5 py-2 dark:border-slate-700 dark:bg-slate-800">
                <Sparkles className="h-3.5 w-3.5 text-[#14B8A6]" />

                <span className="text-[11px] font-semibold text-[#252a67] dark:text-blue-300">
                  {t("trustedNetwork") ||
                    "Trusted Healthcare Network"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          SEARCH AREA
      ===================================================== */}

      <div className="mt-5">
        <GradientCard>
          <div className="p-3 sm:p-4">
            <div className="grid gap-3 md:grid-cols-[minmax(230px,0.8fr)_1px_minmax(320px,1.4fr)] md:items-center">
              {/* =================================================
                  LOCATION
              ================================================= */}

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/70 px-3.5 py-2.5 transition-colors focus-within:border-[#14B8A6]/50 focus-within:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:bg-slate-800">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-sm">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Location
                  </p>

                  <div className="relative">
                    {status === "loading" || locationsLoading ? (
                      <div className="flex items-center gap-2 py-0.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#14B8A6]" />
                        <span>
                          {t("locationDetecting") || "Detecting..."}
                        </span>
                      </div>
                    ) : (
                      <>
                        <select
                          value={city || ""}
                          onChange={handleLocationChange}
                          className="
                            w-full cursor-pointer appearance-none
                            bg-transparent pr-6
                            text-sm font-semibold
                            text-[#252a67]
                            outline-none
                            dark:text-white
                          "
                        >
                          <option value="">
                            {t("locationPrompt") ||
                              "Choose your location"}
                          </option>

                          {locations
                            .filter((location) => location?.isActive !== false)
                            .map((location) => (
                              <option
                                key={location.id}
                                value={location.nameEn}
                              >
                                {getLocalizedName(location)}
                              </option>
                            ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </>
                    )}
                  </div>
                </div>

                {city && status !== "loading" && (
                  <button
                    type="button"
                    onClick={clearLocation}
                    aria-label="Clear location"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Desktop divider */}
              <div className="hidden h-10 w-px bg-slate-200 md:block dark:bg-slate-700" />

              {/* =================================================
                  SEARCH
              ================================================= */}

              <div
                className="
                  flex min-w-0 items-center gap-3
                  rounded-2xl border border-slate-200/90
                  bg-slate-50/70 px-3.5 py-2.5
                  transition-all
                  focus-within:border-[#14B8A6]/50
                  focus-within:bg-white
                  dark:border-slate-700
                  dark:bg-slate-800/60
                  dark:focus-within:bg-slate-800
                "
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-300">
                  <Search className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Search
                  </p>

                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Doctor name, clinic, specialization, treatment..."
                    className="
                      w-full bg-transparent
                      text-sm font-medium
                      text-slate-800
                      outline-none
                      placeholder:text-slate-400
                      dark:text-slate-100
                      dark:placeholder:text-slate-500
                    "
                  />
                </div>

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search helper */}
            <div className="mt-2.5 flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
              <Search className="h-3 w-3" />
              <span>
                Search by doctor name, clinic, specialty or treatment
              </span>
            </div>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          FILTER TABS
      ===================================================== */}

      <div className="mt-6 flex flex-wrap items-center gap-2.5 border-b border-slate-200 pb-4 dark:border-slate-800">
        {/* ALL */}
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`
            flex items-center gap-2 rounded-full
            px-4 py-2 text-sm font-semibold
            transition-all duration-200
            ${
              activeTab === "ALL"
                ? "bg-[#252a67] text-white shadow-md shadow-[#252a67]/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#252a67]/30 hover:text-[#252a67] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }
          `}
        >
          <Users className="h-4 w-4" />
          All Doctors
        </button>

        {/* AVAILABLE */}
        <button
          type="button"
          onClick={() => setActiveTab("AVAILABLE")}
          className={`
            flex items-center gap-2 rounded-full
            px-4 py-2 text-sm font-semibold
            transition-all duration-200
            ${
              activeTab === "AVAILABLE"
                ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-[#14B8A6]/30 hover:text-[#0f766e] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }
          `}
        >
          <CalendarCheck className="h-4 w-4" />
          Available Today
        </button>

        {/* LIVE */}
        <button
          type="button"
          onClick={() => setActiveTab("LIVE")}
          className={`
            flex items-center gap-2 rounded-full
            px-4 py-2 text-sm font-semibold
            transition-all duration-200
            ${
              activeTab === "LIVE"
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }
          `}
        >
          <Radio
            className={`h-4 w-4 ${
              activeTab === "LIVE"
                ? "animate-pulse text-white"
                : "text-red-500"
            }`}
          />

          Live Now
        </button>
      </div>

      {/* =====================================================
          LIVE BANNER
      ===================================================== */}

      {activeTab === "LIVE" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <Radio className="h-4 w-4 animate-pulse" />

          {t("liveNowBanner") ||
            "Showing doctors currently live in session right now"}
        </div>
      )}

      {/* =====================================================
          DOCTOR RESULTS
      ===================================================== */}

      <div className="mt-6">
        <DoctorGrid
          query={query}
          city={city ?? undefined}
          liveNow={activeTab === "LIVE"}
          availableToday={activeTab === "AVAILABLE"}
        />
      </div>
    </main>
  );
}

export default DoctorsPage;