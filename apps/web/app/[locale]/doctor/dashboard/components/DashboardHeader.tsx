"use client";

import { Calendar, CheckCircle2, Award } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { GradientCard } from "./GradientCard";

export function DashboardHeader() {
  const t = useTranslations("DoctorDashboard");
  const locale = useLocale();
  const { user } = useAuth();

  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";
  const currentDateFormatted = new Date().toLocaleDateString(localeCode, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const doctorName = user?.name ? `Dr. ${user.name}` : "Doctor";

  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
      <div className="flex flex-col gap-4 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {greeting}, {doctorName}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Practitioner
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 sm:self-center">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>{currentDateFormatted}</span>
        </div>
      </div>
    </GradientCard>
  );
}
