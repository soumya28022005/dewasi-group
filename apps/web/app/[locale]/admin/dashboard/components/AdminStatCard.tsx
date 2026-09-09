"use client";

import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { GradientCard, type GradientVariant } from "@/components/ui/GradientCard";

interface AdminStatCardProps {
  title: string;
  value?: number | string | null;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: "healthy" | "warning" | "neutral" | "info";
  colorScheme?: "blue" | "emerald" | "amber" | "indigo" | "purple" | "cyan" | "rose";
  href?: string;
  linkText?: string;
  secondaryMetric?: {
    label: string;
    value: number | string;
    variant?: "warning" | "healthy" | "neutral";
  };
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = "neutral",
  colorScheme = "blue",
  href,
  linkText,
  secondaryMetric,
}: AdminStatCardProps) {
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const displayValue =
    typeof value === "number"
      ? value.toLocaleString(localeCode)
      : value !== undefined && value !== null
        ? String(value)
        : "—";

  const colorStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-900/50",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-900/50",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-900/50",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-900/50",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-900/50",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-900/50",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-900/50",
    },
  }[colorScheme];

  const badgeStyles = {
    healthy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  }[badgeVariant];

  const cardVariant: GradientVariant =
    colorScheme === "amber"
      ? "amber"
      : colorScheme === "emerald"
      ? "emerald"
      : colorScheme === "purple"
      ? "purple"
      : colorScheme === "cyan"
      ? "cyan"
      : colorScheme === "rose"
      ? "rose"
      : colorScheme === "indigo"
      ? "indigo"
      : "blue";

  return (
    <GradientCard variant={cardVariant}>
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {title}
            </span>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border} shadow-xs`}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-2">
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {displayValue}
            </p>

            {badgeText && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${badgeStyles}`}
              >
                {badgeText}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {(secondaryMetric || (href && linkText)) && (
          <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800/80 text-xs">
            {secondaryMetric ? (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium">{secondaryMetric.label}:</span>
                <span
                  className={`font-bold ${
                    secondaryMetric.variant === "warning"
                      ? "text-amber-600 dark:text-amber-400"
                      : secondaryMetric.variant === "healthy"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {typeof secondaryMetric.value === "number"
                    ? secondaryMetric.value.toLocaleString(localeCode)
                    : secondaryMetric.value}
                </span>
              </div>
            ) : <div />}

            {href && linkText && (
              <Link
                href={href}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-hidden"
              >
                <span>{linkText}</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        )}
      </div>
    </GradientCard>
  );
}
