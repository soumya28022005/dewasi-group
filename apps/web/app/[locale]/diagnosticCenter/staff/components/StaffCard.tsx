"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Mail,
  Phone,
  Calendar,
  KeyRound,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface StaffCardProps {
  staff: DiagnosticCenterStaff;
  onChangePassword: (staff: DiagnosticCenterStaff) => void;
}

export function StaffCard({
  staff,
  onChangePassword,
}: StaffCardProps) {
  const t = useTranslations("DiagnosticCenterStaff");
  const locale = useLocale();

  const localeCode =
    locale === "bn"
      ? "bn-BD"
      : locale === "hi"
        ? "hi-IN"
        : "en-US";

  const name =
    staff.name ||
    staff.user?.name ||
    t("name");

  const email =
    staff.email ||
    staff.user?.email ||
    "—";

  const phone =
    staff.phone ||
    staff.user?.phone ||
    null;

  const isActive =
    staff.isActive ??
    staff.user?.isActive ??
    true;

  const createdAt =
    staff.createdAt ||
    staff.user?.createdAt;

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "—";

    try {
      return new Date(dateStr).toLocaleDateString(
        localeCode,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
    } catch {
      return dateStr;
    }
  }

  const initial =
    name.charAt(0).toUpperCase() || "S";

  return (
    <article
      className="
        group
        relative
        flex
        min-h-[285px]
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200/80
        bg-white
        shadow-[0_4px_24px_-12px_rgba(15,23,42,0.16)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-[0_20px_45px_-18px_rgba(15,23,42,0.25)]
        dark:border-slate-800
        dark:bg-slate-950
        dark:shadow-[0_4px_24px_-12px_rgba(0,0,0,0.45)]
        dark:hover:border-slate-700
        dark:hover:shadow-[0_20px_45px_-18px_rgba(0,0,0,0.65)]
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
          opacity-70
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* Soft background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-blue-100/50
          blur-3xl
          transition-all
          duration-500
          group-hover:scale-125
          dark:bg-blue-950/20
        "
      />

      <div className="relative flex flex-1 flex-col p-5">
        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between gap-4">
          {/* Identity */}
          <div className="flex min-w-0 items-center gap-3.5">
            {/* Avatar */}
            <div
              className="
                relative
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-blue-100
                bg-gradient-to-br
                from-blue-50
                via-indigo-50
                to-slate-50
                text-sm
                font-extrabold
                text-blue-700
                shadow-sm
                transition-transform
                duration-300
                group-hover:scale-105
                dark:border-blue-900/50
                dark:from-blue-950/70
                dark:via-indigo-950/50
                dark:to-slate-900
                dark:text-blue-300
              "
            >
              <span className="relative">
                {initial}
              </span>

              {/* Online indicator */}
              <span
                className={`
                  absolute
                  bottom-0.5
                  right-0.5
                  h-2.5
                  w-2.5
                  rounded-full
                  border-2
                  border-white
                  dark:border-slate-950
                  ${
                    isActive
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }
                `}
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-[14px]
                  font-bold
                  tracking-[-0.01em]
                  text-slate-950
                  dark:text-white
                "
              >
                {name}
              </h3>

              <div className="mt-1 flex items-center gap-1.5">
                <ShieldCheck
                  className="
                    h-3.5
                    w-3.5
                    shrink-0
                    text-blue-500
                    dark:text-blue-400
                  "
                />

                <span
                  className="
                    truncate
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  Staff Account
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <span
            className={`
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              px-2.5
              py-1
              text-[9px]
              font-bold
              uppercase
              tracking-[0.08em]
              ${
                isActive
                  ? `
                    border-emerald-100
                    bg-emerald-50
                    text-emerald-700
                    dark:border-emerald-900/50
                    dark:bg-emerald-950/30
                    dark:text-emerald-400
                  `
                  : `
                    border-rose-100
                    bg-rose-50
                    text-rose-700
                    dark:border-rose-900/50
                    dark:bg-rose-950/30
                    dark:text-rose-400
                  `
              }
            `}
          >
            {isActive ? (
              <CheckCircle2
                className="h-3 w-3"
                strokeWidth={2.3}
              />
            ) : (
              <XCircle
                className="h-3 w-3"
                strokeWidth={2.3}
              />
            )}

            <span>
              {isActive
                ? t("active")
                : t("inactive")}
            </span>
          </span>
        </div>

        {/* ================= CONTACT INFO ================= */}
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-slate-100
            bg-slate-50/60
            p-3.5
            dark:border-slate-800
            dark:bg-slate-900/60
          "
        >
          {/* Email */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-slate-500
                shadow-sm
                dark:bg-slate-800
                dark:text-slate-400
              "
            >
              <Mail
                className="h-3.5 w-3.5"
                strokeWidth={1.9}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-slate-400
                "
              >
                Email
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[11px]
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
                title={email}
              >
                {email}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-slate-200/70 dark:border-slate-800" />

          {/* Phone */}
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-slate-500
                shadow-sm
                dark:bg-slate-800
                dark:text-slate-400
              "
            >
              <Phone
                className="h-3.5 w-3.5"
                strokeWidth={1.9}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-slate-400
                "
              >
                {t("phone")}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[11px]
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {phone || t("notProvided")}
              </p>
            </div>
          </div>

          {/* Joined */}
          {createdAt && (
            <>
              <div className="my-3 border-t border-slate-200/70 dark:border-slate-800" />

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-slate-500
                    shadow-sm
                    dark:bg-slate-800
                    dark:text-slate-400
                  "
                >
                  <Calendar
                    className="h-3.5 w-3.5"
                    strokeWidth={1.9}
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-slate-400
                    "
                  >
                    {t("joined")}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[11px]
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onChangePassword(staff)}
            className="
              group/button
              flex
              h-11
              w-full
              items-center
              justify-between
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3.5
              text-left
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-px
              hover:border-slate-300
              hover:bg-slate-50
              hover:shadow-md
              active:translate-y-0
              dark:border-slate-800
              dark:bg-slate-900
              dark:hover:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            <span className="flex items-center gap-2.5">
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-500
                  transition-colors
                  group-hover/button:bg-blue-50
                  group-hover/button:text-blue-600
                  dark:bg-slate-800
                  dark:text-slate-400
                  dark:group-hover/button:bg-blue-950/50
                  dark:group-hover/button:text-blue-400
                "
              >
                <KeyRound
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                />
              </span>

              <span
                className="
                  text-[11px]
                  font-bold
                  text-slate-700
                  dark:text-slate-300
                "
              >
                {t("changePassword")}
              </span>
            </span>

            <ArrowUpRight
              className="
                h-4
                w-4
                text-slate-300
                transition-all
                duration-200
                group-hover/button:-translate-y-0.5
                group-hover/button:translate-x-0.5
                group-hover/button:text-blue-500
                dark:text-slate-600
                dark:group-hover/button:text-blue-400
              "
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
