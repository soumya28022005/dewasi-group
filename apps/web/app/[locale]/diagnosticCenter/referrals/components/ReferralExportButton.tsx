"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

interface ReferralExportButtonProps {
  referrals: DiagnosticCenterIncomingReferral[];
}

export function ReferralExportButton({ referrals }: ReferralExportButtonProps) {
  const t = useTranslations("DiagnosticCenterReferrals");

  function escapeCsvValue(val?: string | number | null): string {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  }

  function handleExport() {
    if (!referrals || referrals.length === 0) {
      return;
    }

    const headers = [
      "Referral ID",
      "Patient Name",
      "Patient Phone",
      "Patient Email",
      "Patient Address",
      "Referring Clinic",
      "Requested Tests",
      "Clinical Notes",
      "Created By Role",
      "Created At",
    ];

    const rows = referrals.map((r) => {
      const patientName = r.patient?.name || r.patient?.user?.name || "";
      const patientPhone = r.patient?.phone || r.patient?.user?.phone || "";
      const patientEmail = r.patient?.user?.email || "";
      const patientAddress = r.patient?.address || "";
      const clinicName = r.referringClinic?.clinicName || "";
      const tests = (r.testNames || []).join("; ");
      const notes = r.notes || "";
      const createdRole = r.createdByRole || "";
      const createdAt = r.createdAt || "";

      return [
        escapeCsvValue(r.id),
        escapeCsvValue(patientName),
        escapeCsvValue(patientPhone),
        escapeCsvValue(patientEmail),
        escapeCsvValue(patientAddress),
        escapeCsvValue(clinicName),
        escapeCsvValue(tests),
        escapeCsvValue(notes),
        escapeCsvValue(createdRole),
        escapeCsvValue(createdAt),
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];

    link.setAttribute("href", url);
    link.setAttribute("download", `diagnostic_referrals_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const isDisabled = !referrals || referrals.length === 0;

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isDisabled}
      title={isDisabled ? t("noReferralsToExport") : t("exportCsv")}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <Download className="h-3.5 w-3.5" />
      <span>{t("exportCsv")}</span>
    </button>
  );
}
