"use client";

import { Building2, MapPin } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface ClinicItem {
  id: string;
  name: string;
  city?: string | null;
  address?: string | null;
  doctorId: string;
}

interface ClinicSelectorProps {
  clinics: ClinicItem[];
  selectedClinicId: string;
  onClinicChange: (clinicId: string) => void;
}

export function ClinicSelector({
  clinics,
  selectedClinicId,
  onClinicChange,
}: ClinicSelectorProps) {
  if (clinics.length === 0) {
    return null;
  }

  const selectedClinic =
    clinics.find((c) => c.id === selectedClinicId) || clinics[0];

  const hasMultipleClinics = clinics.length > 1;

  return (
    <GradientCard variant="blue">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shadow-xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedClinic?.name}
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                Active Association
              </span>
            </div>
            {(selectedClinic?.city || selectedClinic?.address) && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3 shrink-0" />
                {[selectedClinic.address, selectedClinic.city]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Only show dropdown when multiple clinics exist */}
        {hasMultipleClinics && (
          <div className="relative min-w-[220px]">
            <label htmlFor="clinic-select" className="sr-only">
              Select Clinic
            </label>
            <select
              id="clinic-select"
              value={selectedClinicId}
              onChange={(e) => onClinicChange(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            >
              {clinics.map((clinic) => {
                const location = [clinic.city, clinic.address]
                  .filter(Boolean)
                  .join(" - ");
                return (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name} {location ? `(${location})` : ""}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    </GradientCard>
  );
}
