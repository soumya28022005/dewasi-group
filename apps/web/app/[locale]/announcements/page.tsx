"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { fetchAnnouncements } from "@/lib/api";
import SectionHeader from "@/components/SectionHeader";

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
  type?: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">(
    "next"
  );

  // ============================================================
  // INITIAL DATA
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();

        if (!mounted) return;

        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load announcements:", error);

        if (mounted) {
          setAnnouncements([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnnouncements();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // SORT — NEWEST FIRST
  // ============================================================

  const sortedAnnouncements = useMemo(() => {
    return [...announcements].sort((a, b) => {
      const first = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const second = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return second - first;
    });
  }, [announcements]);

  // ============================================================
  // SAFETY
  // ============================================================

  useEffect(() => {
    if (
      sortedAnnouncements.length > 0 &&
      currentIndex >= sortedAnnouncements.length
    ) {
      setCurrentIndex(0);
    }
  }, [sortedAnnouncements.length, currentIndex]);

  // ============================================================
  // AUTO SLIDER
  // ============================================================

  useEffect(() => {
    if (sortedAnnouncements.length <= 1) return;

    const timer = window.setInterval(() => {
      setSlideDirection("next");

      setCurrentIndex((previous) =>
        previous >= sortedAnnouncements.length - 1
          ? 0
          : previous + 1
      );
    }, 7000);

    return () => window.clearInterval(timer);
  }, [sortedAnnouncements.length]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goNext = () => {
    if (sortedAnnouncements.length <= 1) return;

    setSlideDirection("next");

    setCurrentIndex((previous) =>
      previous >= sortedAnnouncements.length - 1
        ? 0
        : previous + 1
    );
  };

  const goPrevious = () => {
    if (sortedAnnouncements.length <= 1) return;

    setSlideDirection("prev");

    setCurrentIndex((previous) =>
      previous <= 0
        ? sortedAnnouncements.length - 1
        : previous - 1
    );
  };

  const goToAnnouncement = (index: number) => {
    if (index === currentIndex) return;

    setSlideDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  // ============================================================
  // FORMATTERS
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) return "Recently";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "EMERGENCY":
        return "Urgent";

      case "MAINTENANCE":
        return "Maintenance";

      case "HOLIDAY":
        return "Holiday";

      case "CLINIC_CLOSED":
        return "Clinic Update";

      case "DOCTOR_ABSENT":
        return "Doctor Update";

      default:
        return "Platform Update";
    }
  };

  const currentAnnouncement =
    sortedAnnouncements[currentIndex] ?? null;

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[#4169E1]/[0.055] blur-3xl" />

        <div className="absolute right-[-220px] top-[380px] h-[420px] w-[420px] rounded-full bg-[#228B22]/[0.045] blur-3xl" />

        <div className="absolute left-[-220px] top-[720px] h-[360px] w-[360px] rounded-full bg-[#4169E1]/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4169E1]/30 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#3355c9] shadow-sm dark:border-[#4169E1]/40 dark:bg-slate-900 dark:text-[#7c93ea]">
            <Sparkles className="h-3.5 w-3.5" />
            Platform Updates
          </div>

          <SectionHeader
            eyebrow="Stay informed"
            title="Announcements"
          />

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Important platform updates, service notices and
            announcements — all in one place.
          </p>

        </header>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {isLoading && (
          <section className="mx-auto max-w-5xl">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="animate-pulse p-5 sm:p-7">

                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />

                  <div className="space-y-2">
                    <div className="h-2.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2.5 w-20 rounded bg-slate-100 dark:bg-slate-800/70" />
                  </div>
                </div>

                <div className="mt-7 h-7 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

                <div className="mt-4 h-4 w-full rounded bg-slate-100 dark:bg-slate-800/70" />
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800/70" />

              </div>

            </div>

          </section>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {!isLoading && sortedAnnouncements.length === 0 && (
          <section className="mx-auto max-w-2xl">

            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4169E1]/10 dark:bg-[#4169E1]/15">
                <Bell className="h-7 w-7 text-[#4169E1] dark:text-[#7c93ea]" />
              </div>

              <h2 className="mt-6 text-xl font-bold tracking-tight">
                You're all caught up
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                There are no active announcements at the moment.
                Important updates will appear here when available.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3.5 py-2 text-[11px] font-medium text-slate-400 dark:bg-slate-800">
                <Clock3 className="h-3.5 w-3.5" />
                Check back later
              </div>

            </div>

          </section>
        )}

        {/* ======================================================
            ANNOUNCEMENTS
        ====================================================== */}

        {!isLoading && currentAnnouncement && (
          <>

            {/* ==================================================
                FEATURED / SLIDER
            ================================================== */}

            <section className="mx-auto max-w-5xl">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#228B22] opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#228B22]" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3355c9] dark:text-[#7c93ea]">
                    Latest announcement
                  </span>

                </div>

                {sortedAnnouncements.length > 1 && (
                  <span className="text-[11px] font-semibold tabular-nums text-slate-400">
                    {String(currentIndex + 1).padStart(2, "0")}{" "}
                    /{" "}
                    {String(sortedAnnouncements.length).padStart(
                      2,
                      "0"
                    )}
                  </span>
                )}

              </div>

              {/* ==================================================
                  MAIN CARD
              ================================================== */}

              <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">

                {/* top accent */}

                <div className="h-[4px] w-full bg-gradient-to-r from-[#4169E1] via-[#228B22] to-[#4169E1]" />

                {/* subtle background glow */}

                <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#4169E1]/[0.045] blur-3xl" />

                <div className="relative p-5 sm:p-7 lg:p-8">

                  {/* ==================================================
                      TOP META
                  ================================================== */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3.5">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#4169E1]/10 text-[#4169E1] ring-1 ring-[#4169E1]/20 dark:bg-[#4169E1]/15 dark:text-[#7c93ea] dark:ring-[#4169E1]/30">
                        <Megaphone className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#228B22] dark:text-[#5cb85c]">
                            {getTypeLabel(
                              currentAnnouncement.type
                            )}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

                          <span className="text-[11px] font-medium text-slate-400">
                            {formatDate(
                              currentAnnouncement.createdAt
                            )}
                          </span>

                        </div>

                        {formatTime(
                          currentAnnouncement.createdAt
                        ) && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Clock3 className="h-3 w-3" />

                            {formatTime(
                              currentAnnouncement.createdAt
                            )}
                          </div>
                        )}

                      </div>

                    </div>

                    {/* desktop navigation */}

                    {sortedAnnouncements.length > 1 && (
                      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">

                        <button
                          type="button"
                          onClick={goPrevious}
                          aria-label="Previous announcement"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-[#4169E1]/40 hover:bg-[#4169E1]/10 hover:text-[#4169E1] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[#4169E1]/50 dark:hover:bg-[#4169E1]/15 dark:hover:text-[#7c93ea]"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={goNext}
                          aria-label="Next announcement"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-[#4169E1]/40 hover:bg-[#4169E1]/10 hover:text-[#4169E1] active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[#4169E1]/50 dark:hover:bg-[#4169E1]/15 dark:hover:text-[#7c93ea]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                      </div>
                    )}

                  </div>

                  {/* ==================================================
                      SLIDING CONTENT
                  ================================================== */}

                  <div className="relative mt-7 overflow-hidden">

                    <div
                      key={`${currentAnnouncement.id}-${slideDirection}`}
                      className={
                        slideDirection === "next"
                          ? "animate-announcement-next"
                          : "animate-announcement-prev"
                      }
                    >

                      <h1 className="max-w-4xl text-[1.65rem] font-bold leading-[1.15] tracking-[-0.025em] text-slate-950 sm:text-3xl lg:text-[2.15rem] dark:text-white">
                        {currentAnnouncement.title}
                      </h1>

                      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-7 dark:text-slate-300">
                        {currentAnnouncement.message}
                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      FOOTER
                  ================================================== */}

                  <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">

                    {/* dots */}

                    <div className="flex items-center gap-1.5">

                      {sortedAnnouncements
                        .slice(0, 8)
                        .map((announcement, index) => (
                          <button
                            key={announcement.id}
                            type="button"
                            onClick={() =>
                              goToAnnouncement(index)
                            }
                            aria-label={`Show announcement ${
                              index + 1
                            }`}
                            aria-current={
                              index === currentIndex
                                ? "true"
                                : undefined
                            }
                            className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4169E1] focus-visible:ring-offset-2 ${
                              index === currentIndex
                                ? "w-7 bg-[#4169E1]"
                                : "w-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                            }`}
                          />
                        ))}

                      {sortedAnnouncements.length > 8 && (
                        <span className="ml-1 text-[10px] font-medium text-slate-400">
                          +{sortedAnnouncements.length - 8}
                        </span>
                      )}

                    </div>

                    {/* mobile controls */}

                    {sortedAnnouncements.length > 1 && (
                      <div className="flex items-center justify-between sm:hidden">

                        <span className="text-[10px] font-medium text-slate-400">
                          Swipe through updates
                        </span>

                        <div className="flex items-center gap-1.5">

                          <button
                            type="button"
                            onClick={goPrevious}
                            aria-label="Previous announcement"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 active:scale-95 dark:border-slate-700 dark:text-slate-400"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next announcement"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 active:scale-95 dark:border-slate-700 dark:text-slate-400"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            </section>

            {/* ==================================================
                ALL ANNOUNCEMENTS
            ================================================== */}

            <section className="mx-auto mt-11 max-w-5xl">

              <div className="mb-4 flex items-end justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Archive
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    All announcements
                  </h2>

                </div>

                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  {sortedAnnouncements.length}{" "}
                  {sortedAnnouncements.length === 1
                    ? "update"
                    : "updates"}
                </span>

              </div>

              {/* ==================================================
                  LIST
              ================================================== */}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                {sortedAnnouncements.map(
                  (announcement, index) => {

                    const isActive =
                      index === currentIndex;

                    return (
                      <button
                        key={announcement.id}
                        type="button"
                        onClick={() =>
                          goToAnnouncement(index)
                        }
                        className={`group relative flex w-full items-start gap-4 border-b border-slate-100 p-4 text-left transition-all last:border-0 sm:p-5 dark:border-slate-800 ${
                          isActive
                            ? "bg-[#4169E1]/[0.06] dark:bg-[#4169E1]/[0.10]"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >

                        {/* active line */}

                        <span
                          className={`absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-[#228B22] transition-opacity ${
                            isActive
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />

                        {/* icon */}

                        <div
                          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                            isActive
                              ? "bg-[#4169E1] text-white shadow-sm shadow-[#4169E1]/20"
                              : "bg-slate-100 text-slate-500 group-hover:bg-[#4169E1]/10 group-hover:text-[#4169E1] dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-[#4169E1]/15 dark:group-hover:text-[#7c93ea]"
                          }`}
                        >
                          <Megaphone className="h-4 w-4" />
                        </div>

                        {/* content */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-5">

                            <h3
                              className={`text-sm font-semibold sm:text-[15px] ${
                                isActive
                                  ? "text-slate-950 dark:text-white"
                                  : "text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              {announcement.title}
                            </h3>

                            {announcement.createdAt && (
                              <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium text-slate-400">
                                <CalendarDays className="h-3 w-3" />

                                {formatDate(
                                  announcement.createdAt
                                )}
                              </span>
                            )}

                          </div>

                          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                            {announcement.message}
                          </p>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </section>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="mt-9 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">

              <Bell className="h-3.5 w-3.5" />

              You're up to date with platform announcements

            </div>

          </>
        )}

      </div>

      {/* ========================================================
          SLIDE ANIMATIONS
          Horizontal — NOT bottom-to-top
      ======================================================== */}

      <style jsx>{`
        @keyframes announcementNext {
          from {
            opacity: 0;
            transform: translate3d(28px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes announcementPrev {
          from {
            opacity: 0;
            transform: translate3d(-28px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-announcement-next {
          animation: announcementNext 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .animate-announcement-prev {
          animation: announcementPrev 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-announcement-next,
          .animate-announcement-prev {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}