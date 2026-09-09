"use client";

import { ClinicCard, type DerivedClinicAssociation } from "./ClinicCard";

interface ClinicGridProps {
  clinics: DerivedClinicAssociation[];
}

export function ClinicGrid({ clinics }: ClinicGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clinics.map((clinic) => (
        <ClinicCard key={clinic.clinicId} clinic={clinic} />
      ))}
    </div>
  );
}
