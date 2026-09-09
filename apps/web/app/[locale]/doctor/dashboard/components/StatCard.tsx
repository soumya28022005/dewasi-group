"use client";

import type { LucideIcon } from "lucide-react";
import { GradientCard } from "./GradientCard";

interface StatCardProps {
  title: string;
  value?: number | string | null;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  colorScheme?: "blue" | "emerald" | "amber" | "indigo" | "purple" | "cyan";
  gradient?: string;
}

const COLOR_GRADIENTS = {
  blue: "from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]",
  emerald: "from-[#059669] via-[#10b981] to-[#34d399]",
  amber: "from-[#f59e0b] via-[#f97316] to-[#fb7185]",
  indigo: "from-[#4f46e5] via-[#6366f1] to-[#818cf8]",
  purple: "from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]",
  cyan: "from-[#0891b2] via-[#06b6d4] to-[#38bdf8]",
};

const ICON_THEMES = {
  blue: {
    bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  },
  emerald: {
    bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  amber: {
    bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  indigo: {
    bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
    badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  purple: {
    bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
    badge: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  },
  cyan: {
    bg: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
    badge: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  colorScheme = "blue",
  gradient,
}: StatCardProps) {
  const displayValue =
    value !== undefined && value !== null ? value : "--";

  const activeGradient = gradient || COLOR_GRADIENTS[colorScheme];
  const theme = ICON_THEMES[colorScheme];

  return (
    <GradientCard gradient={activeGradient} className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {title}
          </span>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 hover:scale-105 ${theme.bg}`}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-2">
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {displayValue}
          </p>

          {badgeText && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </GradientCard>
  );
}
