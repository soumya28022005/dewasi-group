import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Doctor,
  CreateGuestPatientInput,
  BookReceptionAppointmentInput,
  PatientSearchResult,
  Appointment,
} from "@doctor-contract/shared";
import { api } from "@/lib/api";

// ============================================================
// Receptionist Portal
//
// Matches receptionist.routes.js, patient.routes.js, and
// appointment.routes.js exactly:
//   GET  /receptionist/my-doctors     doctors assigned to this receptionist
//   GET  /patient/search              search a patient by phone
//   POST /patient/guest               create a walk-in guest patient
//   POST /appointments/book/reception book an appointment on a patient's behalf
// ============================================================

// ------------------------------------------------------------
// Assigned doctors
// ------------------------------------------------------------

export const useMyAssignedDoctors = () => {
  return useQuery({
    queryKey: ["assigned-doctors"],
    queryFn: async () => {
      // Replace this endpoint with your actual backend route for receptionist doctors
      const response = await api.get("/api/v1/receptionist/doctors");
      return response.data?.data || [];
    },
  });
};

// ------------------------------------------------------------
// Patient search & guest registration
// ------------------------------------------------------------

export function useSearchPatientByPhone() {
  return useMutation({
    mutationFn: async (phone: string) => {
      const res = await api.get("/patient/search", { params: { phone } });
      return (res.data?.data?.patient ?? null) as PatientSearchResult | null;
    },
  });
}

export function useCreateGuestPatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateGuestPatientInput) => {
      const res = await api.post("/patient/guest", payload);
      return res.data.data.patient as PatientSearchResult;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receptionist"] });
    },
  });
}

// ------------------------------------------------------------
// Reception booking
// ------------------------------------------------------------

export function useBookReceptionAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BookReceptionAppointmentInput) => {
      const res = await api.post("/appointments/book/reception", payload);
      return res.data.data.appointment as Appointment;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["doctor", "queue", variables.doctorId, variables.clinicId, variables.date],
      });
    },
  });
}