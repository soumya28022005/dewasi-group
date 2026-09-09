"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface ProfileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ElementType;
}

export const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, error, helperText, icon: Icon, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-900 transition outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 dark:disabled:bg-slate-900 ${
              Icon ? "pl-9" : ""
            } ${
              error
                ? "border-rose-300 focus:border-rose-600 dark:border-rose-700 dark:focus:border-rose-500"
                : "border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500"
            } ${className}`}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

ProfileField.displayName = "ProfileField";
