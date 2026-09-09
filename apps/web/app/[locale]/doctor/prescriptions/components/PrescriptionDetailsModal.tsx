"use client";

import {
  X,
  User,
  Building2,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Printer,
} from "lucide-react";
import type { DoctorPrescription } from "@doctor-contract/shared";

interface PrescriptionDetailsModalProps {
  prescription: DoctorPrescription | null;
  onClose: () => void;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PrescriptionDetailsModal({
  prescription,
  onClose,
}: PrescriptionDetailsModalProps) {
  if (!prescription) return null;

  const formattedDate = formatDate(prescription.createdAt);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-colors dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Medical Prescription Record
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official E-Rx document issued by attending physician.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prescription Header Info */}
        <div className="mt-5 space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-950/60 dark:bg-blue-950/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Patient Information
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {prescription.patientName}
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                <Stethoscope className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Diagnosis: <strong className="font-semibold text-slate-900 dark:text-white">{prescription.diagnosis}</strong>
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Clinic & Date
              </span>
              <p className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white sm:justify-end">
                <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                {prescription.clinicName}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 sm:justify-end">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Rx Medicines Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Rx Requisition & Dosage</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Medicine</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {prescription.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {item.medicineName}
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {item.dosage}
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {item.frequency}
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {item.duration}
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 italic">
                        {item.instructions || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Notes */}
          {prescription.notes && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Additional Instructions / Clinical Notes
              </span>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 leading-relaxed italic">
                {prescription.notes}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
