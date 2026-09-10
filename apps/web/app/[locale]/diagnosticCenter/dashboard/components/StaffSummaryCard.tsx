"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Users,
  UserCheck,
  UserX,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface StaffSummaryCardProps {
  staffList: DiagnosticCenterStaff[] | undefined;
}

export function StaffSummaryCard({
  staffList = [],
}: StaffSummaryCardProps) {
  const t = useTranslations("DiagnosticCenterDashboard");
  const locale = useLocale();

  const localeCode =
    locale === "bn"
      ? "bn-BD"
      : locale === "hi"
        ? "hi-IN"
        : "en-US";

  const total = staffList.length;

  const active = staffList.filter((s) => {
    if (s.isActive !== undefined) return s.isActive;
    if (s.user?.isActive !== undefined) return s.user.isActive;

    return true;
  }).length;

  const inactive = total - active;

  const stats = [
    {
      label: t("totalStaff"),
      value: total,
      icon: Users,
      iconBg:
        "bg-[#252a67]/[0.07] dark:bg-[#252a67]/30",
      iconColor:
        "text-[#252a67] dark:text-indigo-300",
      valueColor:
        "text-slate-950 dark:text-white",
    },
    {
      label: t("activeStaff"),
      value: active,
      icon: UserCheck,
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor:
        "text-emerald-600 dark:text-emerald-400",
      valueColor:
        "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: t("inactiveStaff"),
      value: inactive,
      icon: UserX,
      iconBg:
        "bg-slate-100 dark:bg-slate-800",
      iconColor:
        "text-slate-500 dark:text-slate-400",
      valueColor:
        "text-slate-700 dark:text-slate-300",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-5 dark:border-slate-800 dark:bg-slate-900">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h2 className="text-sm font-bold tracking-tight text-slate-950 sm:text-base dark:text-white">
              {t("staffSummary")}
            </h2>

            <span className="hidden h-1 w-1 rounded-full bg-[#14B8A6] sm:block" />

          </div>

          <p className="mt-1 text-[10px] leading-relaxed text-slate-500 sm:text-[11px] dark:text-slate-400">
            {t("manageStaffDesc")}
          </p>

          <div className="mt-2 h-[2px] w-7 rounded-full bg-gradient-to-r from-[#252a67] to-[#14B8A6]" />

        </div>


        {/* Manage Staff */}

        <Link
          href="/diagnosticCenter/staff"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-600 transition-all duration-150 hover:border-[#3b4a8f]/30 hover:bg-slate-50 hover:text-[#252a67] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500/30 dark:hover:bg-slate-800 dark:hover:text-teal-400"
        >
          <span>{t("manageStaff")}</span>

          <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

      </div>


      {/* =========================================================
          STAFF STATS
      ========================================================== */}

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">

        {stats.map(
          ({
            label,
            value,
            icon: Icon,
            iconBg,
            iconColor,
            valueColor,
          }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
            >

              {/* Top accent */}

              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />


              <div className="flex items-center gap-3">

                {/* Icon */}

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon
                    className={`h-[17px] w-[17px] ${iconColor}`}
                  />
                </div>


                {/* Number */}

                <div className="min-w-0">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                    {label}
                  </p>

                  <p
                    className={`mt-0.5 text-xl font-bold leading-none tracking-tight ${valueColor}`}
                  >
                    {value.toLocaleString(localeCode)}
                  </p>

                </div>

              </div>

            </div>
          ),
        )}

      </div>

    </section>
  );
}