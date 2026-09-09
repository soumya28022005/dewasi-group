"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================
// HorizontalCarousel
//
// A gentle, continuously auto-scrolling row used for the "All
// Doctors" / "All Clinics" homepage sections. Reused by both so
// the scroll/pause/resume/loop behavior only lives in one place.
//
// - Auto-scrolls slowly to the right, glides back to the start
//   when it reaches the end.
// - Pauses on hover, touch, pointer interaction, or manual scroll,
//   and resumes a couple of seconds after the user lets go.
// - Respects prefers-reduced-motion (no auto-scroll, still swipeable).
// - No default browser scrollbar (uses the `.no-scrollbar` utility).
// - Cleans up its animation frame / timers on unmount.
// ============================================================

export default function HorizontalCarousel({
  children,
  ariaLabel,
  speed = 0.45,
}: {
  children: ReactNode;
  ariaLabel: string;
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const pausedRef = useRef(false);
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  // ------------------------------------------------------------
  // Auto-scroll loop
  // ------------------------------------------------------------
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateArrows();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    function step() {

      const node = trackRef.current;

      if (node && !pausedRef.current) {
        const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1;

        if (atEnd && node.scrollWidth > node.clientWidth) {
          pausedRef.current = true;

          endTimeoutRef.current = setTimeout(() => {
            trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });

            resumeTimeoutRef.current = setTimeout(() => {
              pausedRef.current = false;
            }, 900);
          }, 1400);
        } else {
          node.scrollLeft += speed;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [speed, updateArrows]);


  // ------------------------------------------------------------
  // Pause / resume on interaction
  // ------------------------------------------------------------
  function pause() {
    pausedRef.current = true;
    if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 2200);
  }

  function scrollByAmount(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    pause();
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
    scheduleResume();
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll left"
          className="absolute -left-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 p-2 text-gray-600 shadow-md backdrop-blur transition hover:bg-white hover:text-[var(--color-primary-text)] md:flex dark:border-soft-300 dark:bg-surface/95 dark:text-ink-600"

        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div
        ref={trackRef}
        aria-label={ariaLabel}
        onScroll={updateArrows}
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        className="no-scrollbar flex gap-4 overflow-x-auto px-1 py-2"
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll right"
          className="absolute -right-2 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 p-2 text-gray-600 shadow-md backdrop-blur transition hover:bg-white hover:text-[var(--color-primary-text)] md:flex dark:border-soft-300 dark:bg-surface/95 dark:text-ink-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );

}