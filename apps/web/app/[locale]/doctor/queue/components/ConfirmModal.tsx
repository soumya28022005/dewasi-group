"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  isLoading = false,
  onConfirm,
  onClose,
  children,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colorStyles = {
    danger: {
      bg: "bg-rose-100 dark:bg-rose-900/40",
      icon: "text-rose-600 dark:text-rose-400",
      button: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    warning: {
      bg: "bg-amber-100 dark:bg-amber-900/40",
      icon: "text-amber-600 dark:text-amber-400",
      button: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    info: {
      bg: "bg-blue-100 dark:bg-blue-900/40",
      icon: "text-blue-600 dark:text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorStyles.bg}`}>
              <AlertTriangle className={`h-5 w-5 ${colorStyles.icon}`} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {children && <div className="mt-3">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 ${colorStyles.button}`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
