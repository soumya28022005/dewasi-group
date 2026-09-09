"use client";

import {
  User,
  Building2,
  Calendar,
  Pill,
  FileText,
  Eye,
  Stethoscope,
} from "lucide-react";
import type { DoctorPrescription } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface PrescriptionCardProps {
  prescription: DoctorPrescription;
  onViewDetails: (prescription: DoctorPrescription) => void;
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

export function PrescriptionCard({
  prescription,
  onViewDetails,
}: PrescriptionCardProps) {
  const formattedDate = formatDate(prescription.createdAt);

  return (
    <GradientCard variant="purple">
      <div className="flex flex-col gap-4 p-5">
        {/* Top Header: Patient & Diagnosis */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shadow-xs dark:bg-purple-950/50 dark:text-purple-400">
              <User className="h-5 w-5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {prescription.patientName}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 ring-1 ring-purple-600/20 dark:bg-purple-950/50 dark:text-purple-400">
                  <Stethoscope className="h-3 w-3" />
                  {prescription.diagnosis}
                </span>
              </div>

              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Building2 className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                <span>{prescription.clinicName}</span>
              </p>
            </div>
          </div>

          {/* Date & Details Button */}
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>

            <button
              type="button"
              onClick={() => onViewDetails(prescription)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-purple-400 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Details</span>
            </button>
          </div>
        </div>

        {/* Medicines Requisition Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Pill className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Prescribed Medicines ({prescription.items?.length || 0})</span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {prescription.items?.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-50/80 px-3 py-2 text-xs dark:bg-slate-800/60"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {item.medicineName}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {item.dosage} • {item.frequency} ({item.duration})
                </span>
              </div>
            ))}
          </div>

          {prescription.items && prescription.items.length > 4 && (
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              +{prescription.items.length - 4} additional medicines prescribed...
            </p>
          )}
        </div>

        {/* Notes if available */}
        {prescription.notes && (
          <div className="rounded-xl bg-slate-50/80 p-2.5 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-300">
            <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 mb-0.5">
              <FileText className="h-3 w-3 text-slate-500" />
              <span>Notes:</span>
            </div>
            <p className="leading-relaxed italic truncate">{prescription.notes}</p>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
