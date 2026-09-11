"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  UserPlus,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

interface StaffHeaderProps {
  onAddStaff: () => void;
  isFetching?: boolean;
  onRefresh: () => void;
}

export function StaffHeader({
  onAddStaff,
  isFetching = false,
  onRefresh,
}: StaffHeaderProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  return (
    <header className="relative">
      <div
        className="
          relative
          flex
          flex-col
          gap-5
          overflow-hidden
          rounded-[24px]
          border
          border-slate-200/80
          bg-white
          px-5
          py-5
          shadow-[0_8px_35px_-20px_rgba(15,23,42,0.18)]
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
          dark:border-slate-800
          dark:bg-slate-950
          dark:shadow-[0_8px_35px_-20px_rgba(0,0,0,0.55)]
        "
      >
        {/* Premium top accent */}
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
            opacity-80
          "
        />

        {/* Background glow */}
        <div
          className="
            pointer-events-none
            absolute
            -left-20
            -top-24
            h-40
            w-40
            rounded-full
            bg-blue-100/40
            blur-3xl
            dark:bg-blue-950/20
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            right-0
            h-40
            w-40
            rounded-full
            bg-indigo-100/30
            blur-3xl
            dark:bg-indigo-950/20
          "
        />

        {/* =====================================
            Title Section
        ===================================== */}

        <div className="relative flex min-w-0 items-center gap-3.5">
          {/* Icon */}
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-blue-100
              bg-gradient-to-br
              from-blue-50
              via-indigo-50
              to-white
              text-blue-600
              shadow-sm
              dark:border-blue-900/50
              dark:from-blue-950/70
              dark:via-indigo-950/50
              dark:to-slate-900
              dark:text-blue-400
            "
          >
            <Users
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          {/* Text */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="
                  truncate
                  text-[18px]
                  font-bold
                  tracking-[-0.025em]
                  text-slate-950
                  sm:text-[20px]
                  dark:text-white
                "
              >
                {t("title")}
              </h1>

              <span
                className="
                  hidden
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-emerald-100
                  bg-emerald-50
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-emerald-700
                  md:inline-flex
                  dark:border-emerald-900/50
                  dark:bg-emerald-950/30
                  dark:text-emerald-400
                "
              >
                <ShieldCheck className="h-2.5 w-2.5" />
                Secure
              </span>
            </div>

            <p
              className="
                mt-0.5
                max-w-xl
                truncate
                text-[11px]
                leading-5
                text-slate-500
                sm:text-xs
                dark:text-slate-400
              "
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* =====================================
            Actions
        ===================================== */}

        <div
          className="
            relative
            flex
            w-full
            items-center
            gap-2
            sm:w-auto
          "
        >
          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            aria-label={t("retry")}
            className="
              group/refresh
              inline-flex
              h-10
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-slate-50/70
              px-3.5
              text-[11px]
              font-bold
              text-slate-600
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-px
              hover:border-slate-300
              hover:bg-white
              hover:text-slate-900
              hover:shadow-md
              active:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:flex-none
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:border-slate-700
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <RefreshCw
              className={`
                h-3.5
                w-3.5
                transition-transform
                duration-500
                ${
                  isFetching
                    ? "animate-spin text-blue-500"
                    : "text-slate-400 group-hover/refresh:rotate-180 group-hover/refresh:text-blue-500"
                }
              `}
              strokeWidth={2}
            />

            <span className="hidden sm:inline">
              {t("retry")}
            </span>
          </button>

          {/* Add Staff */}
          <button
            type="button"
            onClick={onAddStaff}
            className="
              group/add
              inline-flex
              h-10
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-950
              px-4
              text-[11px]
              font-bold
              text-white
              shadow-[0_8px_24px_-9px_rgba(15,23,42,0.55)]
              transition-all
              duration-200
              hover:-translate-y-px
              hover:bg-blue-600
              hover:shadow-[0_12px_28px_-9px_rgba(37,99,235,0.55)]
              active:translate-y-0
              sm:flex-none
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
                transition-transform
                duration-200
                group-hover/add:scale-110
                dark:bg-slate-950/10
              "
            >
              <UserPlus
                className="h-3.5 w-3.5"
                strokeWidth={2.2}
              />
            </span>

            <span>
              {t("addStaff")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
