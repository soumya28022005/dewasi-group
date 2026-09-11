"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import {
  CalendarCheck,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  Radio,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import DoctorGrid from "@/components/DoctorGrid";
import { useLocationCity } from "@/lib/hooks/useLocationCity";
import { fetchSearchLocations } from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

interface Location {
  id: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
  isActive?: boolean;
}

/* =========================================================
   GRADIENT CARD
========================================================= */

function GradientCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        relative rounded-[24px] p-[1.5px]
        bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6]
        shadow-[0_12px_40px_-20px_rgba(37,42,103,0.32)]
        ${className}
      `}
    >
      <div className="h-full rounded-[22.5px] bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   DOCTORS PAGE
========================================================= */

function DoctorsPage() {
  return (
    <DoctorsPageContent />
  );
}

/* =========================================================
   PAGE CONTENT
========================================================= */

function DoctorsPageContent() {
  const t = useTranslations("DoctorSearch");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const {
    city,
    status,
    setManualCity,
  } = useLocationCity();

  /* =========================================================
     INITIAL TAB
  ========================================================= */

  const initialTab =
    searchParams.get("live") === "true"
      ? "LIVE"
      : searchParams.get("available") === "true"
        ? "AVAILABLE"
        : "ALL";

  const [activeTab, setActiveTab] = useState<
    "ALL" | "AVAILABLE" | "LIVE"
  >(initialTab);

  /* =========================================================
     SEARCH QUERY
  ========================================================= */

  const [query, setQuery] = useState(
    searchParams.get("q") ??
      searchParams.get("specialty") ??
      searchParams.get("specialization") ??
      searchParams.get("treatment") ??
      ""
  );

  /* =========================================================
     LOCATIONS
  ========================================================= */

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  const [locationOpen, setLocationOpen] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);

  const cityParam = searchParams.get("city");

  /* =========================================================
     LOAD LOCATIONS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    setLocationsLoading(true);

    fetchSearchLocations()
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          setLocations(data);
        } else if (
          data &&
          Array.isArray(data.data)
        ) {
          setLocations(data.data);
        } else {
          setLocations([]);
        }
      })
      .catch((error) => {
        console.error(
          "Failed to load locations:",
          error
        );

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

  /* =========================================================
     URL CITY
  ========================================================= */

  useEffect(() => {
    if (cityParam?.trim()) {
      setManualCity(cityParam.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityParam]);

  /* =========================================================
     CLOSE LOCATION DROPDOWN
  ========================================================= */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        locationRef.current &&
        !locationRef.current.contains(
          event.target as Node
        )
      ) {
        setLocationOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     LOCALIZED LOCATION
  ========================================================= */

  function getLocalizedName(location: Location) {
    const localizedNames: Record<
      string,
      string | undefined
    > = {
      en: location.nameEn,
      bn: location.nameBn,
      hi: location.nameHi,
    };

    return (
      localizedNames[locale] ??
      location.nameEn
    );
  }

  /* =========================================================
     SELECTED LOCATION
  ========================================================= */

  const selectedLocation =
    locations.find(
      (location) =>
        location.nameEn?.toLowerCase() ===
        city?.toLowerCase()
    ) ?? null;

  const selectedLocationName =
    selectedLocation
      ? getLocalizedName(selectedLocation)
      : city || "";

  /* =========================================================
     LOCATION SELECT
  ========================================================= */

  function handleSelectLocation(
    value: string
  ) {
    setManualCity(value);
    setLocationOpen(false);
  }

  /* =========================================================
     CLEAR LOCATION
  ========================================================= */

  function clearLocation() {
    setManualCity("");
    setLocationOpen(false);
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  function handleSearchChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setQuery(e.target.value);
  }

  function clearSearch() {
    setQuery("");
  }

  /* =========================================================
     SEARCH SUGGESTIONS
  ========================================================= */

  const searchSuggestions = [
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "General Physician",
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <GradientCard>
        <div className="relative overflow-hidden px-5 py-5 sm:px-7 sm:py-6">
          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#252a67]/5 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#14B8A6]/5 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Heading */}

            <div className="min-w-0">
              <div className="mb-2.5 flex items-center gap-2">
                <div
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-[#252a67]
                    to-[#14B8A6]
                    text-white
                    shadow-sm
                  "
                >
                  <Users className="h-4 w-4" />
                </div>

                <span
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.16em]
                    text-[#252a67]
                    dark:text-blue-300
                  "
                >
                  {t("findDoctors") ||
                    "Find Doctors"}
                </span>
              </div>

              <h1
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-[30px]
                  dark:text-white
                "
              >
                {t("heading") ||
                  "Doctor Directory"}
              </h1>

              <p
                className="
                  mt-1.5
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("subheading") ||
                  "Search trusted doctors, clinics and specialists near you"}
              </p>
            </div>

            {/* Trusted network */}

            <div className="hidden shrink-0 sm:block">
              <div
                className="
                  flex items-center gap-2
                  rounded-full
                  border border-slate-100
                  bg-slate-50/90
                  px-4 py-2.5
                  shadow-sm
                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >
                <Sparkles className="h-3.5 w-3.5 text-[#14B8A6]" />

                <span
                  className="
                    text-[11px]
                    font-bold
                    text-[#252a67]
                    dark:text-blue-300
                  "
                >
                  {t("trustedNetwork") ||
                    "Trusted Healthcare Network"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          SEARCH / LOCATION
      ===================================================== */}

      <div className="mt-5">
        <GradientCard>
          <div className="p-3 sm:p-4">
            <div
              className="
                grid
                gap-3
                md:grid-cols-[minmax(250px,0.82fr)_1px_minmax(360px,1.45fr)]
                md:items-center
              "
            >
              {/* =================================================
                  LOCATION
              ================================================= */}

              <div
                ref={locationRef}
                className="relative min-w-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setLocationOpen(
                      (value) => !value
                    )
                  }
                  className="
                    flex w-full
                    items-center gap-3
                    rounded-[18px]
                    border border-slate-200/90
                    bg-slate-50/75
                    px-3.5 py-3
                    text-left
                    transition-all duration-200
                    hover:border-[#14B8A6]/35
                    hover:bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#14B8A6]/10
                    dark:border-slate-700
                    dark:bg-slate-800/70
                    dark:hover:bg-slate-800
                  "
                >
                  {/* Location icon */}

                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-[#252a67]
                      to-[#14B8A6]
                      text-white
                      shadow-sm
                    "
                  >
                    <MapPin className="h-[17px] w-[17px]" />
                  </div>

                  {/* Text */}

                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        mb-0.5
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-[0.13em]
                        text-slate-400
                      "
                    >
                      Location
                    </p>

                    {status === "loading" ||
                    locationsLoading ? (
                      <div
                        className="
                          flex items-center gap-2
                          py-0.5
                          text-sm
                          font-semibold
                          text-slate-600
                          dark:text-slate-300
                        "
                      >
                        <Loader2
                          className="
                            h-3.5 w-3.5
                            animate-spin
                            text-[#14B8A6]
                          "
                        />

                        <span>
                          {t(
                            "locationDetecting"
                          ) ||
                            "Detecting location..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`
                            truncate
                            text-sm
                            font-bold
                            ${
                              selectedLocationName
                                ? "text-[#252a67] dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                            }
                          `}
                        >
                          {selectedLocationName ||
                            t("locationPrompt") ||
                            "Choose your location"}
                        </span>

                        {selectedLocation && (
                          <span
                            className="
                              hidden shrink-0
                              rounded-full
                              bg-[#14B8A6]/10
                              px-2 py-0.5
                              text-[9px]
                              font-bold
                              text-[#0f766e]
                              sm:inline-flex
                            "
                          >
                            Selected
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Clear */}

                  {city &&
                  status !== "loading" ? (
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        clearLocation();
                      }}
                      className="
                        flex h-7 w-7
                        shrink-0
                        items-center justify-center
                        rounded-full
                        text-slate-400
                        transition
                        hover:bg-red-50
                        hover:text-red-500
                        dark:hover:bg-red-500/10
                      "
                      role="button"
                      aria-label="Clear location"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <ChevronDown
                      className={`
                        h-4 w-4
                        shrink-0
                        text-slate-400
                        transition-transform
                        duration-200
                        ${
                          locationOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  )}
                </button>

                {/* =================================================
                    LOCATION DROPDOWN
                ================================================= */}

                {locationOpen &&
                  !locationsLoading && (
                    <div
                      className="
                        absolute left-0 right-0 top-[calc(100%+8px)]
                        z-50
                        overflow-hidden
                        rounded-2xl
                        border border-slate-200
                        bg-white
                        p-1.5
                        shadow-[0_18px_45px_-18px_rgba(15,27,51,0.28)]
                        dark:border-slate-700
                        dark:bg-slate-900
                      "
                    >
                      {/* All locations */}

                      <button
                        type="button"
                        onClick={() =>
                          handleSelectLocation(
                            ""
                          )
                        }
                        className="
                          flex w-full
                          items-center gap-3
                          rounded-xl
                          px-3 py-2.5
                          text-left
                          transition
                          hover:bg-slate-50
                          dark:hover:bg-slate-800
                        "
                      >
                        <div
                          className="
                            flex h-8 w-8
                            shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-slate-100
                            text-slate-500
                            dark:bg-slate-800
                            dark:text-slate-300
                          "
                        >
                          <MapPin className="h-3.5 w-3.5" />
                        </div>

                        <span
                          className="
                            min-w-0 flex-1
                            text-sm font-semibold
                            text-slate-700
                            dark:text-slate-200
                          "
                        >
                          All Locations
                        </span>

                        {!city && (
                          <Check className="h-4 w-4 text-[#14B8A6]" />
                        )}
                      </button>

                      {/* Locations */}

                      <div className="max-h-64 overflow-y-auto">
                        {locations
                          .filter(
                            (location) =>
                              location?.isActive !==
                              false
                          )
                          .map((location) => {
                            const isSelected =
                              city?.toLowerCase() ===
                              location.nameEn?.toLowerCase();

                            return (
                              <button
                                type="button"
                                key={location.id}
                                onClick={() =>
                                  handleSelectLocation(
                                    location.nameEn
                                  )
                                }
                                className={`
                                  flex w-full
                                  items-center gap-3
                                  rounded-xl
                                  px-3 py-2.5
                                  text-left
                                  transition
                                  ${
                                    isSelected
                                      ? "bg-[#14B8A6]/8"
                                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                  }
                                `}
                              >
                                <div
                                  className={`
                                    flex h-8 w-8
                                    shrink-0
                                    items-center justify-center
                                    rounded-lg
                                    ${
                                      isSelected
                                        ? "bg-[#14B8A6]/10 text-[#0f766e]"
                                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                                    }
                                  `}
                                >
                                  <MapPin className="h-3.5 w-3.5" />
                                </div>

                                <span
                                  className={`
                                    min-w-0 flex-1
                                    truncate
                                    text-sm
                                    ${
                                      isSelected
                                        ? "font-bold text-[#0f766e]"
                                        : "font-semibold text-slate-700 dark:text-slate-200"
                                    }
                                  `}
                                >
                                  {getLocalizedName(
                                    location
                                  )}
                                </span>

                                {isSelected && (
                                  <Check className="h-4 w-4 shrink-0 text-[#14B8A6]" />
                                )}
                              </button>
                            );
                          })}

                        {locations.length === 0 && (
                          <div className="px-3 py-6 text-center">
                            <MapPin className="mx-auto h-5 w-5 text-slate-300" />

                            <p className="mt-2 text-xs font-medium text-slate-400">
                              No locations available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Desktop divider */}

              <div
                className="
                  hidden h-11 w-px
                  bg-slate-200
                  md:block
                  dark:bg-slate-700
                "
              />

              {/* =================================================
                  SEARCH
              ================================================= */}

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
                {/* Search icon */}

                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-white
                    text-slate-500
                    shadow-sm
                    dark:bg-slate-700
                    dark:text-slate-300
                  "
                >
                  <Search className="h-[17px] w-[17px]" />
                </div>

                {/* Input */}

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      mb-0.5
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.13em]
                      text-slate-400
                    "
                  >
                    Search
                  </p>

                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Doctor name, clinic, specialization, treatment..."
                    className="
                      w-full
                      bg-transparent
                      text-sm
                      font-semibold
                      text-slate-800
                      outline-none
                      placeholder:text-slate-400
                      dark:text-white
                      dark:placeholder:text-slate-500
                    "
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {/* Clear */}

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="
                      flex h-7 w-7
                      shrink-0
                      items-center justify-center
                      rounded-full
                      text-slate-400
                      transition
                      hover:bg-slate-200
                      hover:text-slate-700
                      dark:hover:bg-slate-700
                      dark:hover:text-white
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                SEARCH HINTS
            ================================================= */}

            <div
              className="
                mt-3
                flex min-w-0
                items-center gap-2
                overflow-hidden
                px-1
              "
            >
              <Search className="h-3 w-3 shrink-0 text-slate-400" />

              <span
                className="
                  shrink-0
                  text-[10px]
                  font-medium
                  text-slate-400
                "
              >
                Try:
              </span>

              <div className="flex min-w-0 gap-1.5 overflow-x-auto no-scrollbar">
                {searchSuggestions.map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        setQuery(suggestion)
                      }
                      className="
                        shrink-0
                        rounded-full
                        border border-slate-200
                        bg-white
                        px-2.5 py-1
                        text-[10px]
                        font-semibold
                        text-slate-500
                        transition
                        hover:border-[#14B8A6]/30
                        hover:bg-[#14B8A6]/5
                        hover:text-[#0f766e]
                        dark:border-slate-700
                        dark:bg-slate-800
                        dark:text-slate-400
                      "
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          FILTER TABS
      ===================================================== */}

      <div
        className="
          mt-6
          flex flex-wrap
          items-center
          gap-2.5
          border-b
          border-slate-200
          pb-4
          dark:border-slate-800
        "
      >
        {/* ALL DOCTORS */}

        <button
          type="button"
          onClick={() =>
            setActiveTab("ALL")
          }
          className={`
            flex items-center gap-2
            rounded-full
            px-4 py-2
            text-sm
            font-bold
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
          onClick={() =>
            setActiveTab("AVAILABLE")
          }
          className={`
            flex items-center gap-2
            rounded-full
            px-4 py-2
            text-sm
            font-bold
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
          onClick={() =>
            setActiveTab("LIVE")
          }
          className={`
            flex items-center gap-2
            rounded-full
            px-4 py-2
            text-sm
            font-bold
            transition-all duration-200
            ${
              activeTab === "LIVE"
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }
          `}
        >
          <Radio
            className={`
              h-4 w-4
              ${
                activeTab === "LIVE"
                  ? "animate-pulse text-white"
                  : "text-red-500"
              }
            `}
          />

          Live Now
        </button>
      </div>

      {/* =====================================================
          LIVE BANNER
      ===================================================== */}

      {activeTab === "LIVE" && (
        <div
          className="
            mt-4
            flex items-center gap-2
            rounded-2xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm
            font-semibold
            text-red-700
            dark:border-red-900/50
            dark:bg-red-950/30
            dark:text-red-300
          "
        >
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
          city={city || undefined}
          liveNow={activeTab === "LIVE"}
          availableToday={
            activeTab === "AVAILABLE"
          }
        />
      </div>
    </main>
  );
}

export default DoctorsPage;