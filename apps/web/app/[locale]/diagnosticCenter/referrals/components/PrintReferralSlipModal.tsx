"use client";

import { useTranslations, useLocale } from "next-intl";
import { X, Printer, FlaskConical, Building2, User, Calendar, FileText, Shield } from "lucide-react";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";
import { useDiagnosticCenterProfile } from "@/lib/hooks/useDiagnosticCenter";

interface PrintReferralSlipModalProps {
  isOpen: boolean;
  referral: DiagnosticCenterIncomingReferral | null;
  onClose: () => void;
}

export function PrintReferralSlipModal({
  isOpen,
  referral,
  onClose,
}: PrintReferralSlipModalProps) {
  const t = useTranslations("DiagnosticCenterReferrals");
  const locale = useLocale();
  const localeCode =
    locale === "bn" ? "bn-BD" : locale === "hi" ? "hi-IN" : "en-US";

  const { data: centerProfile } = useDiagnosticCenterProfile();

  if (!isOpen || !referral) return null;

  const centerName = centerProfile?.centerName || "Diagnostic Center";
  const centerLogo = centerProfile?.logo || null;
  const centerAddress = [
    centerProfile?.address,
    centerProfile?.city,
    centerProfile?.state,
    centerProfile?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

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

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-850/80 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t("printWorkOrder")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{t("print")}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="overflow-y-auto p-6 md:p-8">
          <div
            id="printable-lab-work-order"
            className="mx-auto max-w-[210mm] rounded-xl border border-slate-200 bg-white p-8 text-slate-900 shadow-xs print:m-0 print:max-w-none print:border-none print:p-0 print:shadow-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 print:dark:bg-white print:dark:text-black"
          >
            {/* Header / Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 dark:border-slate-100 print:border-black">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {centerLogo ? (
                    <img
                      src={centerLogo}
                      alt={centerName}
                      className="h-10 w-auto max-w-[120px] object-contain"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white print:bg-black">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                  )}
                  <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 print:text-black">
                    {centerName}
                  </h1>
                </div>

                {centerAddress && (
                  <p className="text-xs text-slate-500 print:text-gray-600 dark:text-slate-400">
                    {centerAddress}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="inline-block rounded border border-slate-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:border-slate-100 dark:text-slate-100 print:border-black print:text-black">
                  Lab Work Order
                </span>
                <p className="mt-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 print:text-black">
                  #{referral.id.slice(0, 13)}
                </p>
              </div>
            </div>

            {/* Referral & Patient Details Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-xs dark:border-slate-800 dark:bg-slate-850/50 print:border-gray-300 print:bg-transparent">
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-gray-600">
                  {t("patientDemographics")}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 print:text-black">
                    {patientName}
                  </p>
                  {patientPhone && (
                    <p className="text-slate-600 dark:text-slate-300 print:text-gray-700">
                      <strong>Phone:</strong> {patientPhone}
                    </p>
                  )}
                  {patientEmail && (
                    <p className="text-slate-600 dark:text-slate-300 print:text-gray-700">
                      <strong>Email:</strong> {patientEmail}
                    </p>
                  )}
                  {patientAddress && (
                    <p className="text-slate-600 dark:text-slate-300 print:text-gray-700">
                      <strong>Address:</strong> {patientAddress}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-gray-600">
                  {t("referralInfo")}
                </h3>
                <div className="space-y-1">
                  <p className="text-slate-800 dark:text-slate-200 print:text-black">
                    <strong>{t("clinic")}:</strong> {clinicName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 print:text-gray-700">
                    <strong>{t("createdAt")}:</strong> {formatDate(referral.createdAt)}
                  </p>
                  {createdRole && (
                    <p className="text-slate-600 dark:text-slate-300 print:text-gray-700">
                      <strong>{t("createdBy")}:</strong> {createdRole}
                    </p>
                  )}
                  {appointmentId && (
                    <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600">
                      <strong>Appointment ID:</strong> {appointmentId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Requested Diagnostic Tests Checklist */}
            <div className="mt-6 space-y-3">
              <h3 className="border-b border-slate-200 pb-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:border-slate-800 dark:text-slate-100 print:border-black print:text-black">
                {t("testChecklist")} ({tests.length})
              </h3>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {tests.map((test, index) => (
                  <div
                    key={`print-test-${index}`}
                    className="flex items-center gap-2.5 rounded-md border border-slate-200 p-2.5 text-xs dark:border-slate-800 print:border-gray-300"
                  >
                    <div className="h-4 w-4 shrink-0 rounded border border-slate-400 print:border-black" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">
                      {test}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            {notes && (
              <div className="mt-6 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 print:text-black">
                  {t("notes")}
                </h3>
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs italic text-slate-700 dark:border-slate-800 dark:bg-slate-850/50 dark:text-slate-300 print:border-gray-300 print:bg-transparent print:text-black">
                  &ldquo;{notes}&rdquo;
                </div>
              </div>
            )}

            {/* Laboratory Processing & Verification Signatures */}
            <div className="mt-10 border-t-2 border-slate-200 pt-6 dark:border-slate-800 print:border-black">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-gray-600">
                {t("labProcessing")}
              </h4>

              <div className="mt-4 grid grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 print:text-gray-500">
                    {t("specimenCollected")}:
                  </span>
                  <div className="mt-6 border-b border-dashed border-slate-400 dark:border-slate-600 print:border-black" />
                  <p className="mt-1 text-[10px] text-slate-400 print:text-gray-500">
                    Date & Time / Collector
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 print:text-gray-500">
                    {t("technicianSignature")}:
                  </span>
                  <div className="mt-6 border-b border-dashed border-slate-400 dark:border-slate-600 print:border-black" />
                  <p className="mt-1 text-[10px] text-slate-400 print:text-gray-500">
                    Lab Technologist
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 print:text-gray-500">
                    {t("doctorSignature")}:
                  </span>
                  <div className="mt-6 border-b border-dashed border-slate-400 dark:border-slate-600 print:border-black" />
                  <p className="mt-1 text-[10px] text-slate-400 print:text-gray-500">
                    Pathologist / In-Charge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-lab-work-order,
          #printable-lab-work-order * {
            visibility: visible;
          }
          #printable-lab-work-order {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
