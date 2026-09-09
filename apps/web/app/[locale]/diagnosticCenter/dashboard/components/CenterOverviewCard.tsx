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

export function CenterOverviewCard({ center }: CenterOverviewCardProps) {
  const t = useTranslations("DiagnosticCenterDashboard");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  if (!center) return null;

  const locationParts = [
    center.address,
    center.city,
    center.state,
    center.pincode,
  ].filter(Boolean);

  const formattedLocation =
    locationParts.length > 0 ? locationParts.join(", ") : t("notConfigured");

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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Logo or Icon */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/80">
            {center.logo ? (
              <Image
                src={center.logo}
                alt={center.centerName || "Diagnostic Center"}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-1.5 min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100">
              {center.centerName || t("notConfigured")}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="line-clamp-2">{formattedLocation}</span>
            </div>

            {/* Approval Badge */}
            <div className="pt-1">
              {center.isApproved ? (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("approved")}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t("pendingApproval")}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Link to Profile */}
        <Link
          href="/diagnosticCenter/profile"
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
        >
          <span>{t("editProfile")}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Approval Warning Notice if not approved */}
      {!center.isApproved && (
        <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p>{t("pendingNotice")}</p>
          </div>
        </div>
      )}

      {/* Timestamps Footer */}
      {(createdDate || updatedDate) && (
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
          {createdDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              <span>
                {t("registeredOn")}: {createdDate}
              </span>
            </div>
          )}
          {updatedDate && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>
                {t("lastUpdated")}: {updatedDate}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
