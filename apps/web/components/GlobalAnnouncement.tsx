"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { getSocket } from "@/lib/socket";
import { fetchAnnouncements } from "@/lib/api";
import { Link } from "@/i18n/routing";
import toast from "react-hot-toast";

interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
}

export default function GlobalAnnouncement() {
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  /*
   * ------------------------------------------------------------
   * Initial state
   *
   * IMPORTANT:
   * There is NO polling here.
   *
   * We fetch once when the page loads.
   * Socket.IO handles everything after that.
   * ------------------------------------------------------------
   */
  const loadAnnouncements = useCallback(async () => {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname;

    if (
      pathname.includes("/login") ||
      pathname.includes("/register")
    ) {
      return;
    }

    try {
      const data = await fetchAnnouncements();

      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.warn(
        "[Announcements] Failed to load announcements:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  /*
   * ------------------------------------------------------------
   * SOCKET.IO
   *
   * New announcement arrives instantly.
   * NO polling.
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname;

    if (
      pathname.includes("/login") ||
      pathname.includes("/register")
    ) {
      return;
    }

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleNewAnnouncement = (
      announcement: AnnouncementData
    ) => {
      setAnnouncements((previous) => {
        // Prevent duplicate announcements
        if (
          previous.some(
            (item) => item.id === announcement.id
          )
        ) {
          return previous;
        }

        return [announcement, ...previous];
      });

      // New announcement should immediately become visible
      setCurrentIndex(0);
      setIsVisible(true);

      /*
       * Small notification.
       * The main announcement remains inside the bar.
       */
      toast.custom(
        (t) => (
          <div
            className={`pointer-events-auto w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 ${
              t.visible
                ? "animate-in fade-in slide-in-from-top-3 duration-300"
                : "animate-out fade-out slide-out-to-top-3 duration-200"
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                <BellRing className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  New announcement
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {announcement.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                aria-label="Close notification"
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ),
        {
          duration: 4500,
          position: "top-center",
        }
      );
    };

    socket.on(
      "new_announcement",
      handleNewAnnouncement
    );

    return () => {
      socket.off(
        "new_announcement",
        handleNewAnnouncement
      );
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * Keep index valid when announcements change
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (announcements.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= announcements.length) {
      setCurrentIndex(announcements.length - 1);
    }
  }, [announcements.length, currentIndex]);

  /*
   * ------------------------------------------------------------
   * Automatic horizontal slider
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (
      !isVisible ||
      announcements.length <= 1
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => {
        return (
          (previous + 1) %
          announcements.length
        );
      });
    }, 6500);

    return () => {
      window.clearInterval(timer);
    };
  }, [announcements.length, isVisible]);

  const currentAnnouncement = useMemo(() => {
    if (announcements.length === 0) {
      return null;
    }

    return announcements[currentIndex];
  }, [announcements, currentIndex]);

  const nextSlide = () => {
    if (announcements.length <= 1) return;

    setCurrentIndex(
      (previous) =>
        (previous + 1) % announcements.length
    );
  };

  const previousSlide = () => {
    if (announcements.length <= 1) return;

    setCurrentIndex(
      (previous) =>
        (previous - 1 + announcements.length) %
        announcements.length
    );
  };

  /*
   * Close only hides the current announcement bar.
   *
   * IMPORTANT:
   * We intentionally DO NOT use localStorage.
   *
   * Therefore:
   * close → hidden now
   * refresh → announcements load again from server
   */
  const closeAnnouncement = () => {
    setIsVisible(false);
  };

  /*
   * Loading state
   */
  if (isLoading || !currentAnnouncement || !isVisible) {
    return null;
  }

  return (
    <section
      aria-label="Platform announcements"
      className="relative z-40 w-full px-3 pt-2 sm:px-4 sm:pt-3"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* ============================================================
            ULTRA-PREMIUM ANNOUNCEMENT BAR
        ============================================================ */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:bg-slate-900/80 dark:border-slate-700/30 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_25px_70px_-15px_rgba(59,130,246,0.25)]">
          
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 blur-[2px] group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Top accent line (moving shimmer) */}
          <div className="absolute inset-x-0 top-0 h-[3px] overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-[shimmer_2s_infinite]" />
          </div>

          {/* Left gradient bar */}
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500" />

          {/* Soft glow orb */}
          <div className="pointer-events-none absolute -top-6 right-10 h-20 w-20 rounded-full bg-blue-400/10 blur-3xl transition-all duration-500 group-hover:bg-blue-400/20" />

          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative flex min-h-[58px] items-center gap-2 pl-4 pr-2 sm:gap-3 sm:pl-5 sm:pr-3">
            {/* ============================================================
                PREMIUM ICON WITH ROTATING GLOW
            ============================================================ */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-inner ring-1 ring-blue-100 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 dark:from-blue-500/20 dark:to-indigo-500/20 dark:text-blue-400 dark:ring-blue-500/30">
              <Megaphone className="h-[18px] w-[18px]" />
              
              {/* Live pulse dot */}
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
              </span>
            </div>

            {/* ============================================================
                SLIDING CONTENT - BETTER TYPOGRAPHY
            ============================================================ */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <div
                key={currentAnnouncement.id}
                className="animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="max-w-[45%] shrink-0 truncate text-sm font-bold text-slate-900 dark:text-white sm:max-w-none">
                    {currentAnnouncement.title}
                  </span>

                  <span className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 sm:block" />

                  <span className="min-w-0 truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                    {currentAnnouncement.message}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================
                DESKTOP / TABLET CONTROLS - PREMIUM
            ============================================================ */}
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              {announcements.length > 1 && (
                <div className="flex items-center overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-300 hover:border-blue-300/50 dark:bg-slate-800/40 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous announcement"
                    className="flex h-8 w-8 items-center justify-center text-slate-500 transition-all duration-200 hover:bg-white hover:text-blue-600 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="min-w-[40px] text-center text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-400">
                    {currentIndex + 1}/{announcements.length}
                  </span>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next announcement"
                    className="flex h-8 w-8 items-center justify-center text-slate-500 transition-all duration-200 hover:bg-white hover:text-blue-600 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <Link
                href="/announcements"
                className="group/link flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:brightness-110 active:scale-95"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>

              <button
                type="button"
                onClick={closeAnnouncement}
                aria-label="Close announcements"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm text-slate-400 border border-white/20 transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:bg-slate-800/40 dark:border-slate-700/50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ============================================================
                MOBILE CONTROLS - PREMIUM
            ============================================================ */}
            <div className="flex shrink-0 items-center gap-1 sm:hidden">
              {announcements.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous announcement"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm text-slate-500 transition hover:bg-white hover:text-blue-600 active:scale-95 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-[10px] font-bold tabular-nums text-slate-400 dark:text-slate-500">
                    {currentIndex + 1}/{announcements.length}
                  </span>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next announcement"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm text-slate-500 transition hover:bg-white hover:text-blue-600 active:scale-95 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              <Link
                href="/announcements"
                aria-label="View all announcements"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={closeAnnouncement}
                aria-label="Close announcements"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/40 backdrop-blur-sm text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-95 dark:bg-slate-800/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ============================================================
              PREMIUM PROGRESS BAR - ANIMATED GRADIENT
          ============================================================ */}
          {announcements.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-100/60 dark:bg-slate-800/60">
              <div
                key={currentAnnouncement.id}
                className="h-full origin-left bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-[announcement-progress_6.5s_linear]"
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes announcement-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}