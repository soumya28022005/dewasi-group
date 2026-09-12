"use client";

import { useMyAssignedDoctors } from "@/lib/hooks/useReceptionist";
import ClinicAppointmentsView from "@/components/appointments/ClinicAppointmentsView";

export default function ReceptionistAppointmentsPage() {
  const { data: doctors, isLoading } = useMyAssignedDoctors();

  const simpleDoctors = (doctors ?? []).map((d) => ({
    id: d.id,
    name: d.user?.name || "Doctor",
  }));

  return (
    <ClinicAppointmentsView
      doctors={simpleDoctors}
      isLoadingDoctors={isLoading}
      title="Appointments"
      subtitle="Appointments at your clinic for your assigned doctors — filter by doctor, status, or date."
    />
  );
}
