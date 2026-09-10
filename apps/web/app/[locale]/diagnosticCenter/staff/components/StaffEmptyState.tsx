"use client";

import { useTranslations } from "next-intl";
import {
  Users,
  UserPlus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface StaffEmptyStateProps {
  onAddStaff: () => void;
}

export function StaffEmptyState({
  onAddStaff,
}: StaffEmptyStateProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  return (
    <div
      className="
        group
        relative
        flex
        min-h-[360px]
        w-full
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white
        px-6
        py-14
        text-center
        shadow-[0_8px_40px_-20px_rgba(15,23,42,0.18)]
        transition-all
        duration-300
        hover:border-slate-300
        hover:shadow-[0_20px_55px_-22px_rgba(15,23,42,0.24)]
        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-[0_8px_40px_-20px_rgba(0,0,0,0.55)]
        dark:hover:border-slate-700
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
          bg-blue-100/50
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
          dark:bg-blue-950/20
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
          bg-indigo-100/40
          blur-3xl
          transition-transform
          duration-700
          group-hover:scale-125
          dark:bg-indigo-950/20
        "
      />

      {/* Subtle top accent */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-blue-600
          via-indigo-500
          to-cyan-500
          opacity-70
        "
      />

      {/* =========================================
          Main Content
      ========================================= */}

      <div className="relative flex flex-col items-center">
        {/* Icon Container */}
        <div className="relative">
          {/* Glow */}
          <div
            className="
              absolute
              inset-0
              rounded-[22px]
              bg-blue-400/20
              blur-xl
              transition-all
              duration-500
              group-hover:scale-125
              group-hover:bg-blue-400/30
              dark:bg-blue-500/10
            "
          />

          {/* Icon */}
          <div
            className="
              relative
              flex
              h-[76px]
              w-[76px]
              items-center
              justify-center
              rounded-[22px]
              border
              border-blue-100
              bg-gradient-to-br
              from-blue-50
              via-indigo-50
              to-white
              text-blue-600
              shadow-[0_12px_30px_-12px_rgba(37,99,235,0.35)]
              transition-all
              duration-300
              group-hover:-translate-y-1
              group-hover:scale-105
              dark:border-blue-900/60
              dark:from-blue-950/70
              dark:via-indigo-950/50
              dark:to-slate-900
              dark:text-blue-400
            "
          >
            <Users
              className="h-8 w-8"
              strokeWidth={1.7}
            />

            {/* Small plus badge */}
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
                dark:bg-blue-600
              "
            >
              <UserPlus
                className="h-3.5 w-3.5"
                strokeWidth={2.2}
              />
            </span>
          </div>
        </div>

        {/* Badge */}
        <div
          className="
            mt-7
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-2.5
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-[0.1em]
            text-slate-500
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-400
          "
        >
          <ShieldCheck
            className="h-3 w-3 text-emerald-500"
            strokeWidth={2.2}
          />

          Staff Management
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
          {t("noStaffTitle")}
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
          {t("noStaffDesc")}
        </p>

        {/* CTA */}
        <div className="mt-7">
          <button
            type="button"
            onClick={onAddStaff}
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
              hover:bg-blue-600
              hover:shadow-[0_14px_32px_-10px_rgba(37,99,235,0.5)]
              active:translate-y-0
              dark:bg-white
              dark:text-slate-950
              dark:hover:bg-blue-500
              dark:hover:text-white
            "
          >
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
              <UserPlus
                className="h-3.5 w-3.5"
                strokeWidth={2.2}
              />
            </span>

            <span>
              {t("addFirstStaff")}
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

        {/* Bottom trust hint */}
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
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
            "
          />

          Add a staff member to get started
        </div>
      </div>
    </div>
  );
}
