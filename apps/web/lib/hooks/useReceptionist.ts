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

/**
 * The exact shape of GET /receptionist/my-doctors hasn't been confirmed
 * against clinicController.getMyAssignedDoctors, so this accepts several
 * plausible shapes rather than assuming one and silently rendering nothing
 * if the guess is wrong:
 *   - { success, data: { doctors: [...] } }
 *   - { success, data: [...] }
 *   - { success, data: { assignedDoctors: [...] } }
 *   - a flat association shape, e.g. { doctor: {...}, clinic: {...} }[]
 */
function normalizeAssignedDoctor(raw: unknown): Doctor | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  // Already in the expected shape.
  const objUser = obj.user as Record<string, unknown> | undefined;
  if (objUser?.name && obj.clinic) {
    return obj as unknown as Doctor;
  }

  // Association/junction shape: { doctor: {...}, clinic: {...} }
  if (obj.doctor && typeof obj.doctor === "object") {
    const doc = obj.doctor as Record<string, unknown>;
    const clinic = obj.clinic as Record<string, unknown> | undefined;
    return {
      id: (doc.id ?? obj.doctorId) as string,
      specialization: (doc.specialization ?? null) as string | null,
      qualification: (doc.qualification ?? null) as string | null,
      experience: (doc.experience ?? null) as number | null,
      fee: (doc.fee ?? null) as number | null,
      clinicId: (clinic?.id ?? obj.clinicId ?? "") as string,
      isAvailable: doc.isAvailable as boolean | undefined,
      user: (doc.user ?? { name: doc.name ?? "Doctor" }) as Doctor["user"],
      clinic: (clinic ?? {
        id: obj.clinicId ?? "",
        clinicName: obj.clinicName ?? "",
        city: obj.city ?? null,
        address: obj.address ?? null,
      }) as Doctor["clinic"],
    };
  }

  // Flat shape: fields directly on the object, no nested user/clinic.
  if (obj.doctorName || obj.name) {
    return {
      id: (obj.doctorId ?? obj.id) as string,
      specialization: (obj.specialization ?? null) as string | null,
      qualification: (obj.qualification ?? null) as string | null,
      experience: (obj.experience ?? null) as number | null,
      fee: (obj.fee ?? null) as number | null,
      clinicId: (obj.clinicId ?? "") as string,
      isAvailable: obj.isAvailable as boolean | undefined,
      user: { name: (obj.doctorName ?? obj.name) as string },
      clinic: {
        id: (obj.clinicId ?? "") as string,
        clinicName: (obj.clinicName ?? "") as string,
        city: (obj.city ?? null) as string | null,
        address: (obj.address ?? null) as string | null,
      },
    };
  }

  return null;
}

export function useMyAssignedDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["receptionist", "my-doctors"],
    queryFn: async () => {
      const res = await api.get("/receptionist/my-doctors");
      const data = res.data?.data;

      const rawList: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.doctors)
          ? data.doctors
          : Array.isArray(data?.assignedDoctors)
            ? data.assignedDoctors
            : Array.isArray(res.data?.doctors)
              ? res.data.doctors
              : [];

      return rawList
        .map((raw) => normalizeAssignedDoctor(raw))
        .filter((d): d is Doctor => d !== null);
    },
  });
}

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