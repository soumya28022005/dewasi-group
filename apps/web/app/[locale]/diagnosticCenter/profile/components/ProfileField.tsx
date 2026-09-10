"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface ProfileFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ElementType;
}

export const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  (
    { label, error, helperText, icon: Icon, className = "", id, ...props },
    ref
  ) => {
    const inputId = id || props.name;
    const hasError = !!error;

    return (
      <div className="group/field min-w-0 space-y-2">
        {/* =====================================================
            LABEL
        ====================================================== */}

        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={inputId}
            className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-600 transition-colors group-focus-within/field:text-[#252a67] dark:text-slate-400 dark:group-focus-within/field:text-teal-400 sm:text-[11px]"
          >
            {label}
          </label>

          {hasError && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-rose-600 ring-1 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-900/50">
              <AlertCircle className="h-2.5 w-2.5" />
              Required
            </span>
          )}
        </div>

        {/* =====================================================
            INPUT WRAPPER
        ====================================================== */}

        <div className="relative">
          {/* Gradient Glow (focus) */}
          <div
            className={`pointer-events-none absolute -inset-[2px] rounded-2xl opacity-0 transition-opacity duration-300 ${
              hasError
                ? "bg-gradient-to-r from-rose-400 via-rose-500 to-orange-500 group-focus-within/field:opacity-100"
                : "bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#14B8A6] group-focus-within/field:opacity-100"
            }`}
          />

          {/* Icon */}
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center pl-3.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
                  hasError
                    ? "bg-rose-50 text-rose-500 dark:bg-rose-950/40"
                    : "bg-slate-100 text-slate-400 group-focus-within/field:bg-gradient-to-br group-focus-within/field:from-[#252a67] group-focus-within/field:to-[#3b4a8f] group-focus-within/field:text-white dark:bg-slate-800 dark:text-slate-500 dark:group-focus-within/field:from-[#252a67] dark:group-focus-within/field:to-[#14B8A6]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={`
              relative z-10
              h-11 w-full rounded-2xl
              border
              bg-white
              text-[12px]
              font-semibold
              text-slate-900
              shadow-[0_1px_2px_rgba(15,23,42,0.03)]
              outline-none
              transition-all
              duration-200

              placeholder:text-slate-400
              placeholder:font-normal

              hover:border-slate-300

              focus:bg-white
              focus:shadow-md

              disabled:cursor-not-allowed
              disabled:bg-slate-50
              disabled:text-slate-400

              dark:bg-slate-900
              dark:text-slate-100
              dark:placeholder:text-slate-500
              dark:hover:border-slate-600
              dark:focus:bg-slate-900
              dark:disabled:bg-slate-950

              ${Icon ? "pl-12 pr-3.5" : "px-3.5"}

              ${
                hasError
                  ? `
                    border-rose-300
                    focus:border-rose-400
                    dark:border-rose-800
                    dark:focus:border-rose-600
                  `
                  : `
                    border-slate-200
                    focus:border-[#3b4a8f]
                    dark:border-slate-700
                    dark:focus:border-teal-500
                  `
              }

              ${className}
            `}
            {...props}
          />
        </div>

        {/* =====================================================
            HELPER / ERROR
        ====================================================== */}

        {error ? (
          <div
            id={`${inputId}-error`}
            className="flex items-start gap-2 pt-0.5 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50">
              <AlertCircle className="h-2.5 w-2.5 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-[10px] font-semibold leading-relaxed text-rose-600 dark:text-rose-400 sm:text-[11px]">
              {error}
            </p>
          </div>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="pl-0.5 pt-0.5 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500 sm:text-[11px]"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

ProfileField.displayName = "ProfileField";