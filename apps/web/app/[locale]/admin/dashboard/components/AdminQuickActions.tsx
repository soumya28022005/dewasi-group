"use client";

import { Link } from "@/i18n/routing";
import {
  Users,
  Building2,
  Stethoscope,
  Sparkles,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { GradientCard } from "@/components/ui/GradientCard";

interface AdminQuickActionsProps {
  pendingClinics?: number;
  unverifiedDoctors?: number;
}

export function AdminQuickActions({
  pendingClinics = 0,
  unverifiedDoctors = 0,
}: AdminQuickActionsProps) {
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();

  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const actions = [
    {
      href: "/admin/users",
      title: t("manageUsers"),
      desc: t("manageUsersDesc"),
      icon: Users,
      color: "blue",
      badge: null,
    },
    {
      href: "/admin/clinics",
      title: t("reviewClinics"),
      desc: t("reviewClinicsDesc"),
      icon: Building2,
      color: "purple",
      badge:
        pendingClinics > 0
          ? `${pendingClinics.toLocaleString(localeCode)} ${t("pendingAction")}`
          : null,
      badgeVariant: "warning" as const,
    },
    {
      href: "/admin/doctors",
      title: t("verifyDoctors"),
      desc: t("verifyDoctorsDesc"),
      icon: Stethoscope,
      color: "cyan",
      badge:
        unverifiedDoctors > 0
          ? `${unverifiedDoctors.toLocaleString(localeCode)} ${t("pendingAction")}`
          : null,
      badgeVariant: "warning" as const,
    },
    {
      href: "/admin/featured-doctors",
      title: t("featuredDoctors"),
      desc: t("featuredDoctorsDesc"),
      icon: Sparkles,
      color: "amber",
      badge: null,
    },
    {
      href: "/admin/diagnostic-centers",
      title: t("diagnosticCenters"),
      desc: t("diagnosticCentersDesc"),
      icon: Activity,
      color: "emerald",
      badge: null,
    },
  ];

  return (
    <GradientCard variant="blue">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t("quickActions")}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Direct shortcuts to platform management interfaces.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map(({ href, title, desc, icon: Icon, color, badge }) => {
            const colorStyles = {
              blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
              purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
              cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
              amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
              emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
            }[color as "blue" | "purple" | "cyan" | "amber" | "emerald"];

            return (
              <Link
                key={href}
                href={href}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-blue-500 hover:bg-blue-50/30 hover:scale-[1.02] active:scale-95 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-blue-500/70 dark:hover:bg-slate-800/80 focus:outline-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorStyles} shadow-xs`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                        {title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-blue-600 dark:text-slate-500" />
                </div>

                {badge && (
                  <div className="mt-3 flex items-center justify-start">
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {badge}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </GradientCard>
  );
}
