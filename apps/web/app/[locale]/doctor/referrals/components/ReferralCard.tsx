"use client";

import {
  User,
  Phone,
  Building2,
  Calendar,
  FileText,
  FlaskConical,
} from "lucide-react";
import type { SentReferral } from "@/lib/hooks/useReferrals";
import { GradientCard } from "@/components/ui/GradientCard";

interface ReferralCardProps {
  referral: SentReferral;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReferralCard({ referral }: ReferralCardProps) {
  const patientName = referral.patient?.name || "Patient";
  const patientPhone = referral.patient?.phone || referral.patient?.user?.phone || null;
  const centerName = referral.diagnosticCenter?.centerName || "Diagnostic Center";
  const formattedDate = formatDate(referral.createdAt);

  return (
    <GradientCard variant="cyan">
      <div className="flex flex-col gap-4 p-5">
        {/* Top Bar: Patient & Center */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800/80">
          {/* Patient Details */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 shadow-xs dark:bg-cyan-950/50 dark:text-cyan-400">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {patientName}
              </h3>
              {patientPhone && (
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Phone className="h-3 w-3" />
                  <span>{patientPhone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Center & Date */}
          <div className="flex flex-col sm:items-end gap-1">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              <Building2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{centerName}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Tests Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <FlaskConical className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Requisitioned Tests ({referral.testNames?.length || 0})</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {referral.testNames?.map((testName, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 ring-1 ring-cyan-600/20 dark:bg-cyan-950/50 dark:text-cyan-400 dark:ring-cyan-500/30"
              >
                {testName}
              </span>
            ))}
          </div>
        </div>

        {/* Clinical Notes if available */}
        {referral.notes && (
          <div className="rounded-xl bg-slate-50/80 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 mb-0.5">
              <FileText className="h-3 w-3 text-slate-500" />
              <span>Clinical Notes / Instructions:</span>
            </div>
            <p className="leading-relaxed italic">{referral.notes}</p>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
