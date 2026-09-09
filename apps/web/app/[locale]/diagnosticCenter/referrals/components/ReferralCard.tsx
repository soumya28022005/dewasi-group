"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  FlaskConical,
  FileText,
  Eye,
  Shield,
} from "lucide-react";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

interface ReferralCardProps {
  referral: DiagnosticCenterIncomingReferral;
  onViewDetails: (referral: DiagnosticCenterIncomingReferral) => void;
}

export function ReferralCard({ referral, onViewDetails }: ReferralCardProps) {
  const t = useTranslations("DiagnosticCenterReferrals");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const patientName =
    referral.patient?.name || referral.patient?.user?.name || t("patient");
  const patientPhone =
    referral.patient?.phone || referral.patient?.user?.phone || null;
  const patientEmail = referral.patient?.user?.email || null;
  const clinicName = referral.referringClinic?.clinicName || "—";
  const tests = referral.testNames || [];
  const createdRole = referral.createdByRole;
  const notes = referral.notes;

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

  const initial = patientName.charAt(0).toUpperCase() || "P";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900/50">
      <div className="space-y-4">
        {/* Header: Patient Name, Avatar & Role/Date */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                {patientName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                <span>{formatDate(referral.createdAt)}</span>
              </div>
            </div>
          </div>

          {createdRole && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400 shrink-0">
              <Shield className="h-2.5 w-2.5" />
              <span>{createdRole}</span>
            </span>
          )}
        </div>

        {/* Contact Info & Referring Clinic */}
        <div className="grid grid-cols-1 gap-2 rounded-lg bg-slate-50/70 p-3 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {clinicName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {patientPhone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                <span>{patientPhone}</span>
              </div>
            )}
            {patientEmail && (
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{patientEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Requested Tests Badges */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <FlaskConical className="h-3 w-3 text-purple-500" />
            <span>{t("tests")} ({tests.length})</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tests.length > 0 ? (
              tests.map((test, index) => (
                <span
                  key={`${referral.id}-test-${index}`}
                  className="inline-flex items-center rounded-md border border-purple-200/80 bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-300"
                >
                  {test}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {t("notProvided")}
              </span>
            )}
          </div>
        </div>

        {/* Notes Preview if available */}
        {notes && (
          <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
            <p className="line-clamp-2 text-[11px] italic">
              &ldquo;{notes}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onViewDetails(referral)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t("viewDetails")}</span>
        </button>
      </div>
    </div>
  );
}
