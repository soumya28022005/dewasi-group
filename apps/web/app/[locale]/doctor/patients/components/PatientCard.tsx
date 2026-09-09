"use client";

import {
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  Activity,
  FlaskConical,
  Droplet,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import type { DoctorPatientRecord } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface PatientCardProps {
  patient: DoctorPatientRecord;
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PatientCard({ patient }: PatientCardProps) {
  const formattedLastVisit = formatDate(patient.lastConsultationDate);

  return (
    <GradientCard variant="blue">
      <div className="flex flex-col gap-4 p-5">
        {/* Header Info */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-xs dark:bg-blue-950/50 dark:text-blue-400">
              <User className="h-5.5 w-5.5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {patient.name}
                </h3>
                {patient.bloodGroup && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400">
                    <Droplet className="h-3 w-3 fill-current" />
                    {patient.bloodGroup}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                {patient.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </span>
                )}
                {patient.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {patient.email}
                  </span>
                )}
                {patient.age && <span>Age: {patient.age} yrs</span>}
                {patient.gender && <span>Gender: {patient.gender}</span>}
              </div>
            </div>
          </div>

          {/* Total Consultations Badge */}
          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
              <Activity className="h-3.5 w-3.5" />
              {patient.totalConsultations} {patient.totalConsultations === 1 ? "Consultation" : "Consultations"}
            </span>
          </div>
        </div>

        {/* Footer Info & Actions */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <strong className="font-semibold text-slate-700 dark:text-slate-300">{patient.clinicName}</strong>
            </span>

            {patient.lastConsultationDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Last Visit: <strong className="font-semibold text-slate-700 dark:text-slate-300">{formattedLastVisit}</strong>
              </span>
            )}
          </div>

          <Link
            href="/doctor/referrals"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Issue Test Referral</span>
          </Link>
        </div>
      </div>
    </GradientCard>
  );
}
