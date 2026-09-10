"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { DiagnosticCenter } from "@doctor-contract/shared";

interface CenterOverviewCardProps {
  center: DiagnosticCenter | null | undefined;
}

export function CenterOverviewCard({
  center,
}: CenterOverviewCardProps) {
  const t = useTranslations("DiagnosticCenterDashboard");
  const locale = useLocale();

  const localeCode =
    locale === "bn"
      ? "bn-BD"
      : locale === "hi"
        ? "hi-IN"
        : "en-US";

  if (!center) return null;

  /* ============================================================
     LOCATION
  ============================================================ */

  const locationParts = [
    center.address,
    center.city,
    center.state,
    center.pincode,
  ].filter(Boolean);

  const formattedLocation =
    locationParts.length > 0
      ? locationParts.join(", ")
      : t("notConfigured");

  /* ============================================================
     DATE FORMATTER
  ============================================================ */

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return null;

    try {
      return new Date(dateStr).toLocaleDateString(localeCode, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  const createdDate = formatDate(center.createdAt);
  const updatedDate = formatDate(center.updatedAt);

  /* ============================================================
     COMPONENT
  ============================================================ */

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[1.5px] shadow-[0_4px_18px_rgba(15,23,42,0.06)]">

      <div className="overflow-hidden rounded-[14px] bg-white dark:bg-slate-900">

        {/* ======================================================
            MAIN CONTENT
        ======================================================= */}

        <div className="p-4 sm:p-5 lg:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            {/* ==================================================
                CENTER IDENTITY
            =================================================== */}

            <div className="flex min-w-0 items-start gap-4">

              {/* Logo */}

              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-700">

                {center.logo ? (
                  <Image
                    src={center.logo}
                    alt={
                      center.centerName ||
                      "Diagnostic Center"
                    }
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850">
                    <Building2 className="h-7 w-7 text-slate-400 dark:text-slate-500" />
                  </div>
                )}

              </div>


              {/* Center Information */}

              <div className="min-w-0 flex-1">

                {/* Small label */}

                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#14B8A6]">
                  Diagnostic Center
                </p>

                {/* Name */}

                <h2 className="break-words text-base font-bold leading-tight tracking-[-0.01em] text-slate-950 sm:text-lg dark:text-white">
                  {center.centerName || t("notConfigured")}
                </h2>

                {/* Location */}

                <div className="mt-2 flex items-start gap-1.5">

                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />

                  <span className="line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {formattedLocation}
                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                ACTION + STATUS
            =================================================== */}

            <div className="flex shrink-0 items-center gap-2 sm:justify-end">

              {/* Approval */}

              {center.isApproved ? (
                <div className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">

                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

                  <span>
                    {t("approved")}
                  </span>

                </div>
              ) : (
                <div className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-[10px] font-bold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">

                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />

                  <span>
                    {t("pendingApproval")}
                  </span>

                </div>
              )}

              {/* Edit */}

              <Link
                href="/diagnosticCenter/profile"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <span>
                  {t("editProfile")}
                </span>

                <ExternalLink className="h-3 w-3" />
              </Link>

            </div>

          </div>


          {/* ======================================================
              INFORMATION STRIP
          ======================================================= */}

          <div className="mt-5 grid gap-2 sm:grid-cols-2">

            {/* Location */}

            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-700">

                <MapPin className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />

              </div>

              <div className="min-w-0">

                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  Location
                </p>

                <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  {formattedLocation}
                </p>

              </div>

            </div>


            {/* Verification */}

            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">

              <div
                className={
                  center.isApproved
                    ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40"
                    : "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40"
                }
              >
                {center.isApproved ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>

              <div className="min-w-0">

                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                  Verification
                </p>

                <p
                  className={
                    center.isApproved
                      ? "mt-0.5 truncate text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                      : "mt-0.5 truncate text-[10px] font-semibold text-amber-600 dark:text-amber-400"
                  }
                >
                  {center.isApproved
                    ? t("approved")
                    : t("pendingApproval")}
                </p>

              </div>

            </div>

          </div>


          {/* ======================================================
              PENDING NOTICE
          ======================================================= */}

          {!center.isApproved && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-3 dark:border-amber-900/40 dark:bg-amber-950/20">

              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">

                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />

              </div>

              <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300">
                {t("pendingNotice")}
              </p>

            </div>
          )}

        </div>


        {/* ========================================================
            METADATA FOOTER
        ========================================================= */}

        {(createdDate || updatedDate) && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 bg-slate-50/40 px-4 py-2.5 sm:px-5 lg:px-6 dark:border-slate-800 dark:bg-slate-950/20">

            {createdDate && (
              <div className="flex items-center gap-1.5">

                <Calendar className="h-3 w-3 text-slate-400 dark:text-slate-500" />

                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                  {t("registeredOn")}:{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {createdDate}
                  </span>
                </span>

              </div>
            )}

            {updatedDate && (
              <div className="flex items-center gap-1.5">

                <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />

                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                  {t("lastUpdated")}:{" "}
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {updatedDate}
                  </span>
                </span>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}