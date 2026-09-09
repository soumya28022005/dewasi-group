"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  FlaskConical,
  FileText,
  Shield,
  CalendarClock,
  Printer,
} from "lucide-react";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

interface ReferralDetailsModalProps {
  isOpen: boolean;
  referral: DiagnosticCenterIncomingReferral | null;
  onClose: () => void;
  onPrint?: (referral: DiagnosticCenterIncomingReferral) => void;
}

export function ReferralDetailsModal({
  isOpen,
  referral,
  onClose,
  onPrint,
}: ReferralDetailsModalProps) {
  const t = useTranslations("DiagnosticCenterReferrals");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  if (!isOpen || !referral) return null;

  const patientName =
    referral.patient?.name || referral.patient?.user?.name || t("patient");
  const patientPhone =
    referral.patient?.phone || referral.patient?.user?.phone || null;
  const patientEmail = referral.patient?.user?.email || null;
  const patientAddress = referral.patient?.address || null;
  const clinicName = referral.referringClinic?.clinicName || "—";
  const tests = referral.testNames || [];
  const notes = referral.notes;
  const createdRole = referral.createdByRole;
  const appointmentId = referral.appointmentId;

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString(localeCode, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-details-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-slate-200 bg-white shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="referral-details-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                {t("details")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("referralId")}: <span className="font-mono">{referral.id}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Patient Information Section */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5 dark:border-slate-700/60">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t("patientInfo")}
              </h3>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("patient")}
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {patientName}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("phone")}
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{patientPhone || t("notProvided")}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("email")}
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{patientEmail || t("notProvided")}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("address")}
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{patientAddress || t("notProvided")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Metadata Section */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5 dark:border-slate-700/60">
              <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t("referralInfo")}
              </h3>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("clinic")}
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {clinicName}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t("createdAt")}
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDate(referral.createdAt)}</span>
                </div>
              </div>

              {createdRole && (
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t("createdBy")}
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                    <Shield className="h-3.5 w-3.5 text-slate-400" />
                    <span>{createdRole}</span>
                  </div>
                </div>
              )}

              {appointmentId && (
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t("appointment")}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{appointmentId}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Requested Diagnostic Tests */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
              <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>{t("tests")} ({tests.length})</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tests.length > 0 ? (
                tests.map((test, index) => (
                  <span
                    key={`modal-test-${index}`}
                    className="inline-flex items-center rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300"
                  >
                    {test}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t("notProvided")}
                </p>
              )}
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
              <FileText className="h-4 w-4 text-slate-500" />
              <span>{t("notes")}</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
              {notes ? (
                <p className="whitespace-pre-wrap">{notes}</p>
              ) : (
                <p className="text-slate-400 dark:text-slate-500 italic">
                  {t("noNotes")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800">
          <div>
            {onPrint && (
              <button
                type="button"
                onClick={() => onPrint(referral)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
              >
                <Printer className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t("printWorkOrder")}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
