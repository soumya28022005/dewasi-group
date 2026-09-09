"use client";

import React from "react";

export type GradientVariant =
  | "blue"
  | "emerald"
  | "amber"
  | "purple"
  | "indigo"
  | "cyan"
  | "rose"
  | "slate"
  | "default"
  | "primary";

export interface GradientCardProps {
  children: React.ReactNode;
  variant?: GradientVariant;
  gradient?: string;
  className?: string;
  innerClassName?: string;
  rounded?: "xl" | "2xl" | "3xl";
  borderSize?: "thin" | "normal" | "thick";
  hover?: boolean;
}

const GRADIENT_PRESETS: Record<GradientVariant, string> = {
  blue: "from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]",
  emerald: "from-[#059669] via-[#10b981] to-[#34d399]",
  amber: "from-[#f59e0b] via-[#f97316] to-[#fb7185]",
  purple: "from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]",
  indigo: "from-[#4f46e5] via-[#6366f1] to-[#818cf8]",
  cyan: "from-[#0891b2] via-[#06b6d4] to-[#38bdf8]",
  rose: "from-[#ec4899] via-[#f43f5e] to-[#fb7185]",
  slate: "from-slate-200 via-slate-300 to-slate-400 dark:from-slate-800 dark:via-slate-750 dark:to-slate-700",
  default: "from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]",
  primary: "from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]",
};

const ROUNDED_CLASSES = {
  xl: {
    outer: "rounded-xl",
    inner: "rounded-[calc(0.75rem-1px)]",
  },
  "2xl": {
    outer: "rounded-2xl",
    inner: "rounded-[calc(1rem-1px)]",
  },
  "3xl": {
    outer: "rounded-3xl",
    inner: "rounded-[calc(1.5rem-1px)]",
  },
};

const BORDER_CLASSES = {
  thin: "p-[1.5px]",
  normal: "p-[2.5px]",
  thick: "p-[3.5px]",
};

export function GradientCard({
  children,
  variant = "default",
  gradient,
  className = "",
  innerClassName = "",
  rounded = "2xl",
  borderSize = "normal",
  hover = true,
}: GradientCardProps) {
  const activeGradient = gradient || GRADIENT_PRESETS[variant] || GRADIENT_PRESETS.default;
  const radius = ROUNDED_CLASSES[rounded] || ROUNDED_CLASSES["2xl"];
  const border = BORDER_CLASSES[borderSize] || BORDER_CLASSES.normal;

  return (
    <div
      className={`relative ${radius.outer} ${border} bg-gradient-to-r ${activeGradient} shadow-md shadow-blue-900/5 transition-all duration-300 ${
        hover ? "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/10" : ""
      } ${className}`}
    >
      <div
        className={`${radius.inner} bg-white dark:bg-slate-900 h-full w-full ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

export default GradientCard;
