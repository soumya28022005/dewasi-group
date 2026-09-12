"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ClinicAppointmentsView from "@/components/appointments/ClinicAppointmentsView";

export default function ClinicAppointmentsPage() {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["clinicDoctors", "for-appointments-filter"],
    queryFn: async () => {
      const res = await api.get("/clinic/doctors");
      const list = res.data?.data?.doctors || [];
      return list.map((d: any) => ({ id: d.id, name: d.user?.name || d.name || "Doctor" }));
    },
  });

  return (
    <ClinicAppointmentsView
      doctors={doctors ?? []}
      isLoadingDoctors={isLoading}
      title="Appointments"
      subtitle="All appointments across your clinic — filter by doctor, status, or date."
    />
  );
}
