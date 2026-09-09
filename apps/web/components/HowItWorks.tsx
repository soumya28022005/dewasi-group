"use client";

import {
  Search,
  CalendarCheck,
  Timer,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const steps = [
    {
      icon: Search,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      icon: CalendarCheck,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      icon: Timer,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-[var(--color-bg-soft)] px-5 py-16 lg:py-20"
    >
      {/* Decorative background */}

      <div
        className="
          pointer-events-none absolute
          -right-32 -top-32
          h-72 w-72
          rounded-full
          bg-[var(--color-primary)]/5
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none absolute
          -bottom-32 -left-32
          h-72 w-72
          rounded-full
          bg-[var(--color-secondary)]/5
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}

        <div className="mx-auto max-w-2xl text-center">
          <p
            className="
              mb-2
              text-[10px] font-bold
              uppercase tracking-[0.2em]
              text-[var(--color-primary-text)]
            "
          >
            Simple & Fast
          </p>

          <h2
            className="
              text-2xl font-bold
              tracking-tight
              text-[var(--color-primary-dark-text)]
              md:text-3xl
            "
          >
            {t("heading")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-ink-500 md:text-base">
            Find the right doctor, book your appointment, and track your
            queue — all from one simple platform.
          </p>
        </div>

        {/* Steps */}

        <div className="relative mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {/* Connecting line */}

          <div
            className="
              absolute left-[16.5%]
              right-[16.5%]
              top-[48px]
              hidden h-px
              bg-gradient-to-r
              from-[var(--color-primary)]/15
              via-[var(--color-primary)]/30
              to-[var(--color-primary)]/15
              md:block
            "
          />

          {steps.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={title}
              className="
                group relative
                rounded-3xl
                border border-gray-200/80
                bg-white
                p-6
                shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-gray-300
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]
                dark:border-soft-300
                dark:bg-surface
              "
            >
              {/* Step Number */}

              <div
                className="
                  absolute right-5 top-5
                  text-[11px] font-extrabold
                  tracking-wider
                  text-gray-200
                  transition-colors
                  group-hover:text-[var(--color-primary)]/20
                  dark:text-ink-300/40
                "
              >
                0{index + 1}
              </div>

              {/* Icon */}

              <div className="relative z-10">
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-[var(--color-primary)]
                    shadow-md
                    shadow-[var(--color-primary)]/20
                    transition-all duration-300
                    group-hover:scale-105
                    group-hover:shadow-lg
                  "
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>

                {/* Small Indicator */}

                <span
                  className="
                    absolute
                    -bottom-1
                    -right-1
                    flex h-5 w-5
                    items-center justify-center
                    rounded-full
                    border-2 border-white
                    bg-[var(--color-secondary)]
                    dark:border-surface
                  "
                >
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </span>
              </div>

              {/* Content */}

              <div className="mt-6">
                <h3
                  className="
                    text-base font-bold
                    text-gray-800
                    transition-colors
                    group-hover:text-[var(--color-primary-text)]
                    dark:text-ink-800
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                    dark:text-ink-500
                  "
                >
                  {desc}
                </p>
              </div>

              {/* Bottom Indicator */}

              <div
                className="
                  mt-5 flex items-center
                  gap-1.5
                  text-[11px] font-bold
                  text-[var(--color-primary-text)]
                  opacity-0
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
              >
                <span>
                  {index === 0
                    ? "Start here"
                    : index === 1
                      ? "Next step"
                      : "You're ready"}
                </span>

                {index < 2 && (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}