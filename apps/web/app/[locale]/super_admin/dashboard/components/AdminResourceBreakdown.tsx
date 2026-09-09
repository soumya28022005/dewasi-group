"use client";

import { Building2, Stethoscope, Users, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import type { AdminPlatformStats } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface AdminResourceBreakdownProps {
  stats: AdminPlatformStats;
}

export function AdminResourceBreakdown({ stats }: AdminResourceBreakdownProps) {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const totalClinics = stats.totalClinics || 0;
  const approvedClinics = stats.approvedClinics || 0;
  const pendingClinics = stats.pendingClinics || 0;
  const clinicApprovalRate =
    totalClinics > 0 ? Math.round((approvedClinics / totalClinics) * 100) : 0;

  const totalDoctors = stats.totalDoctors || 0;
  const verifiedDoctors = stats.verifiedDoctors || 0;
  const unverifiedDoctors = stats.unverifiedDoctors || 0;
  const doctorVerificationRate =
    totalDoctors > 0 ? Math.round((verifiedDoctors / totalDoctors) * 100) : 0;

  const totalUsers = stats.totalUsers || 0;
  const totalPatients = stats.totalPatients || 0;
  const patientRatio =
    totalUsers > 0 ? Math.round((totalPatients / totalUsers) * 100) : 0;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {t("platformSummary")}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Clinics Breakdown Card - Purple */}
        <GradientCard variant="purple">
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shadow-xs">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {t("clinicsDistribution")}
                  </h3>
                </div>
                <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-extrabold text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  {clinicApprovalRate}% {t("approvedBadge")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                  style={{ width: `${clinicApprovalRate}%` }}
                />
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{t("approvedClinics")}</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {approvedClinics.toLocaleString(localeCode)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span>{t("pendingClinics")}</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {pendingClinics.toLocaleString(localeCode)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <Link
                href="/super_admin/clinics"
                className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
              >
                <span>{t("reviewClinics")}</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </GradientCard>

        {/* Doctors Breakdown Card - Cyan */}
        <GradientCard variant="cyan">
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 shadow-xs">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {t("doctorsDistribution")}
                  </h3>
                </div>
                <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-extrabold text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                  {doctorVerificationRate}% {t("verifiedBadge")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 transition-all duration-500"
                  style={{ width: `${doctorVerificationRate}%` }}
                />
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{t("verifiedDoctors")}</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {verifiedDoctors.toLocaleString(localeCode)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/50">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span>{t("unverifiedDoctors")}</span>
                  </div>
                  <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {unverifiedDoctors.toLocaleString(localeCode)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <Link
                href="/super_admin/doctors"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400"
              >
                <span>{t("verifyDoctors")}</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </GradientCard>

        {/* Users & Patients Distribution Card - Blue */}
        <GradientCard variant="blue">
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shadow-xs">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {t("usersDistribution")}
                  </h3>
                </div>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-extrabold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  {patientRatio}% Patients
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                  style={{ width: `${patientRatio}%` }}
                />
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/50">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {t("totalUsers")}
                  </span>
                  <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {totalUsers.toLocaleString(localeCode)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/50">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {t("totalPatients")}
                  </span>
                  <p className="mt-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {totalPatients.toLocaleString(localeCode)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <Link
                href="/super_admin/users"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>{t("manageUsers")}</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
