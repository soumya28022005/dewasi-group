"use client";

import { Lock } from "lucide-react";

interface ProfileFieldProps {
  label: string;
  value?: string | number | null;
  icon: React.ComponentType<{ className?: string }>;
  isLocked?: boolean;
  fallbackText?: string;
}

export function ProfileField({
  label,
  value,
  icon: Icon,
  isLocked = true,
  fallbackText = "Not provided",
}: ProfileFieldProps) {
  const displayValue = value !== undefined && value !== null && String(value).trim() !== ""
    ? String(value)
    : fallbackText;

  const isFallback = displayValue === fallbackText;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-colors dark:border-slate-800 dark:bg-slate-850">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </span>
        </div>

        {isLocked && (
          <span
            className="inline-flex items-center gap-1 rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            title="Managed via authenticated profile identity (Read-Only)"
          >
            <Lock className="h-3 w-3" />
            <span>Read-Only</span>
          </span>
        )}
      </div>

      <div className="mt-2.5">
        <p
          className={`text-sm font-semibold tracking-tight ${
            isFallback
              ? "italic text-slate-400 dark:text-slate-500"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}
