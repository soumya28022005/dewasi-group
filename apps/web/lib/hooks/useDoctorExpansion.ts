import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  DoctorPatientRecord,
  DoctorPrescription,
  DoctorEarningsSummary,
  DoctorSettings,
} from "@doctor-contract/shared";

export type PatientsQueryParams = {
  search?: string;
  clinicId?: string;
  page?: number;
  limit?: number;
};

export type PatientsApiResponse = {
  patients: DoctorPatientRecord[];
  total: number;
  page: number;
  limit: number;
};

export function useDoctorPatients(params?: PatientsQueryParams) {
  return useQuery<PatientsApiResponse>({
    queryKey: [
      "doctor",
      "patients",
      params?.search ?? "",
      params?.clinicId ?? "",
      params?.page ?? 1,
      params?.limit ?? 10,
    ],
    queryFn: async () => {
      try {
        const res = await api.get("/doctors/patients", { params });
        return (
          res.data?.data ?? {
            patients: [],
            total: 0,
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
          }
        );
      } catch {
        return {
          patients: [],
          total: 0,
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        };
      }
    },
  });
}

export function useDoctorPrescriptions(params?: { patientId?: string; clinicId?: string }) {
  return useQuery<DoctorPrescription[]>({
    queryKey: ["doctor", "prescriptions", params?.patientId ?? "", params?.clinicId ?? ""],
    queryFn: async () => {
      try {
        const res = await api.get("/doctors/prescriptions", { params });
        return res.data?.data?.prescriptions ?? [];
      } catch {
        return [];
      }
    },
  });
}

export function useCreateDoctorPrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      patientId: string;
      clinicId: string;
      diagnosis: string;
      items: { medicineName: string; dosage: string; frequency: string; duration: string; instructions?: string }[];
      notes?: string;
    }) => {
      const res = await api.post("/doctors/prescriptions", payload);
      return res.data.data.prescription as DoctorPrescription;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor", "prescriptions"] });
    },
  });
}

export function useDoctorEarnings(params?: { period?: string; startDate?: string; endDate?: string; clinicId?: string }) {
  return useQuery<DoctorEarningsSummary>({
    queryKey: ["doctor", "earnings", params?.period ?? "monthly", params?.clinicId ?? ""],
    queryFn: async () => {
      try {
        const res = await api.get("/doctors/earnings", { params });
        return (
          res.data?.data?.earnings ?? {
            period: params?.period ?? "monthly",
            totalEarnings: 0,
            totalConsultations: 0,
            clinicBreakdown: [],
          }
        );
      } catch {
        return {
          period: (params?.period as any) ?? "monthly",
          totalEarnings: 0,
          totalConsultations: 0,
          clinicBreakdown: [],
        };
      }
    },
  });
}

export function useDoctorSettings() {
  return useQuery<DoctorSettings>({
    queryKey: ["doctor", "settings"],
    queryFn: async () => {
      try {
        const res = await api.get("/doctors/settings");
        return (
          res.data?.data?.settings ?? {
            doctorId: "",
            emailNotifications: true,
            smsNotifications: true,
            autoAcceptClinicRequests: false,
            defaultConsultationFee: null,
          }
        );
      } catch {
        return {
          doctorId: "",
          emailNotifications: true,
          smsNotifications: true,
          autoAcceptClinicRequests: false,
          defaultConsultationFee: null,
        };
      }
    },
  });
}

export function useUpdateDoctorSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<DoctorSettings>) => {
      const res = await api.patch("/doctors/settings", payload);
      return res.data.data.settings as DoctorSettings;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor", "settings"] });
    },
  });
}
