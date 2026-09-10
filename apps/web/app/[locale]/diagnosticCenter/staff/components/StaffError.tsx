"use client";

import { useTranslations } from "next-intl";
import {
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface StaffErrorProps {
  onRetry: () => void;
  message?: string;
}

export function StaffError({
  onRetry,
  message,
}: StaffErrorProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  return (
    <div
      className="
        group
        relative
        flex
        min-h-[320px]
        w-full
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[28px]
        border
        border-rose-200/70
        bg-white
        px-6
        py-12
        text-center
        shadow-[0_8px_40px_-20px_rgba(15,23,42,0.16)]
        transition-all
        duration-300
        hover:shadow-[0_20px_55px_-22px_rgba(15,23,42,0.20)]
        dark:border-rose-900/50
        dark:bg-slate-950
        dark:shadow-[0_8px_40px_-20px_rgba(0,0,0,0.55)]
      "
    >
      {/* =========================================
          Decorative Background
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-rose-100/60
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
          dark:bg-rose-950/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-16
          h-48
          w-48
          rounded-full
          bg-orange-100/40
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
          dark:bg-orange-950/10
        "
      />

      {/* Premium top accent */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-rose-500
          via-orange-400
          to-rose-500
          opacity-80
        "
      />

      {/* =========================================
          Main Content
      ========================================= */}

      <div className="relative flex flex-col items-center">
        {/* Error Icon */}
        <div className="relative">
          {/* Glow */}
          <div
            className="
              absolute
              inset-0
              rounded-[22px]
              bg-rose-400/20
              blur-xl
              transition-all
              duration-500
              group-hover:scale-125
              group-hover:bg-rose-400/30
              dark:bg-rose-500/10
            "
          />

          {/* Icon container */}
          <div
            className="
              relative
              flex
              h-[72px]
              w-[72px]
              items-center
              justify-center
              rounded-[22px]
              border
              border-rose-100
              bg-gradient-to-br
              from-rose-50
              via-red-50
              to-white
              text-rose-600
              shadow-[0_12px_30px_-12px_rgba(225,29,72,0.30)]
              transition-all
              duration-300
              group-hover:-translate-y-1
              group-hover:scale-105
              dark:border-rose-900/60
              dark:from-rose-950/60
              dark:via-red-950/30
              dark:to-slate-900
              dark:text-rose-400
            "
          >
            <AlertCircle
              className="h-8 w-8"
              strokeWidth={1.7}
            />

            {/* Small shield badge */}
            <span
              className="
                absolute
                -bottom-1.5
                -right-1.5
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-xl
                border-2
                border-white
                bg-slate-950
                text-white
                shadow-md
                dark:border-slate-950
                dark:bg-rose-600
              "
            >
              <ShieldAlert
                className="h-3.5 w-3.5"
                strokeWidth={2.1}
              />
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className="
            mt-7
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-rose-100
            bg-rose-50
            px-2.5
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-[0.1em]
            text-rose-600
            dark:border-rose-900/50
            dark:bg-rose-950/30
            dark:text-rose-400
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-rose-500
            "
          />

          Service interruption
        </div>

        {/* Title */}
        <h3
          className="
            mt-4
            text-[18px]
            font-bold
            tracking-[-0.025em]
            text-slate-950
            dark:text-white
          "
        >
          {t("errorTitle")}
        </h3>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-2
            max-w-md
            text-[12px]
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          {message || t("errorDesc")}
        </p>

        {/* Retry */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onRetry}
            className="
              group/button
              inline-flex
              h-11
              items-center
              gap-2.5
              rounded-xl
              bg-slate-950
              px-5
              text-[12px]
              font-bold
              text-white
              shadow-[0_10px_28px_-10px_rgba(15,23,42,0.55)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-rose-600
              hover:shadow-[0_14px_32px_-10px_rgba(225,29,72,0.45)]
              active:translate-y-0
              dark:bg-white
              dark:text-slate-950
              dark:hover:bg-rose-500
              dark:hover:text-white
            "
          >
            {/* Icon */}
            <span
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-lg
                bg-white/10
                transition-colors
                group-hover/button:bg-white/15
                dark:bg-slate-950/10
              "
            >
              <RefreshCw
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  duration-500
                  group-hover/button:rotate-180
                "
                strokeWidth={2.1}
              />
            </span>

            <span>
              {t("retry")}
            </span>

            <ArrowRight
              className="
                h-3.5
                w-3.5
                transition-transform
                duration-200
                group-hover/button:translate-x-0.5
              "
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Bottom status */}
        <div
          className="
            mt-5
            flex
            items-center
            gap-1.5
            text-[10px]
            font-medium
            text-slate-400
            dark:text-slate-500
          "
        >
          <ShieldAlert
            className="h-3 w-3"
            strokeWidth={1.8}
          />

          Your staff data remains secure
        </div>
      </div>
    </div>
  );
}
