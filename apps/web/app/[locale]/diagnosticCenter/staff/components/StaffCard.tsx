"use client";

import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, Calendar, KeyRound, CheckCircle2, XCircle } from "lucide-react";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface StaffCardProps {
  staff: DiagnosticCenterStaff;
  onChangePassword: (staff: DiagnosticCenterStaff) => void;
}

export function StaffCard({ staff, onChangePassword }: StaffCardProps) {
  const t = useTranslations("DiagnosticCenterStaff");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const name = staff.name || staff.user?.name || t("name");
  const email = staff.email || staff.user?.email || "—";
  const phone = staff.phone || staff.user?.phone || null;
  const isActive = staff.isActive ?? staff.user?.isActive ?? true;
  const createdAt = staff.createdAt || staff.user?.createdAt;

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString(localeCode, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  const initial = name.charAt(0).toUpperCase() || "S";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        {/* Header with Avatar, Name, Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {initial}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                {name}
              </h3>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {email}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold shrink-0 ${
              isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            {isActive ? (
              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
            )}
            <span>{isActive ? t("active") : t("inactive")}</span>
          </span>
        </div>

        {/* Contact & Meta Details */}
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{phone || t("notProvided")}</span>
          </div>

          {createdAt && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {t("joined")}: {formatDate(createdAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onChangePassword(staff)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-750 dark:hover:text-slate-100"
        >
          <KeyRound className="h-3.5 w-3.5 text-slate-400" />
          <span>{t("changePassword")}</span>
        </button>
      </div>
    </div>
  );
}
