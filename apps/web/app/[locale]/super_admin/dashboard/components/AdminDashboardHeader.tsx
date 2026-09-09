"use client";

import { Calendar, RefreshCw, ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { GradientCard } from "@/components/ui/GradientCard";

interface AdminDashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function AdminDashboardHeader({
  onRefresh,
  isRefreshing = false,
}: AdminDashboardHeaderProps) {
  const t = useTranslations("AdminDashboard");
  const tNav = useTranslations("AdminNav");
  const locale = useLocale();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";
  const currentDateFormatted = new Date().toLocaleDateString(localeCode, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <GradientCard variant="amber">
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              {t("title")}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                isSuperAdmin
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isSuperAdmin ? tNav("superAdminBadge") : tNav("adminBadge")}</span>
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>{currentDateFormatted}</span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={t("refreshData")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-amber-600" : "text-slate-500 dark:text-slate-400"}`}
            />
            <span className="hidden sm:inline">{t("refreshData")}</span>
          </button>
        </div>
      </div>
    </GradientCard>
  );
}
