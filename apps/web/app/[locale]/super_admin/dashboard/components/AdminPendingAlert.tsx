"use client";

import { Link } from "@/i18n/routing";
import { AlertTriangle, CheckCircle2, Building2, Stethoscope, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { GradientCard } from "@/components/ui/GradientCard";

interface AdminPendingAlertProps {
  pendingClinics: number;
  unverifiedDoctors: number;
}

export function AdminPendingAlert({
  pendingClinics,
  unverifiedDoctors,
}: AdminPendingAlertProps) {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const totalPending = (pendingClinics || 0) + (unverifiedDoctors || 0);

  if (totalPending === 0) {
    return (
      <GradientCard variant="emerald">
        <div className="flex items-center gap-3 p-4 text-emerald-900 dark:text-emerald-300">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 shadow-xs">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              {t("systemHealth")} — {t("operational")}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              {t("allSystemsOperational")}
            </p>
          </div>
        </div>
      </GradientCard>
    );
  }

  return (
    <GradientCard variant="amber">
      <div className="flex flex-col gap-3.5 p-4 text-amber-900 dark:text-amber-300 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 shadow-xs">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                {t("actionRequiredTitle")}
              </h2>
              <span className="inline-flex items-center rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 dark:bg-amber-900/70 dark:text-amber-200">
                {totalPending.toLocaleString(localeCode)} {t("pendingAction")}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold">{totalPending.toLocaleString(localeCode)}</span>{" "}
              {t("pendingAlertDesc")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingClinics > 0 && (
            <Link
              href="/super_admin/clinics"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 focus:outline-hidden"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{t("reviewClinics")} ({pendingClinics.toLocaleString(localeCode)})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}

          {unverifiedDoctors > 0 && (
            <Link
              href="/super_admin/doctors"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 focus:outline-hidden"
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>{t("verifyDoctors")} ({unverifiedDoctors.toLocaleString(localeCode)})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </GradientCard>
  );
}
