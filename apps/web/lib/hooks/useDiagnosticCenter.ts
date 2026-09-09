import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  DiagnosticCenter,
  DiagnosticCenterStaff,
  DiagnosticCenterIncomingReferral,
  UpdateDiagnosticCenterProfileInput,
  CreateDiagnosticCenterStaffInput,
  ChangeDiagnosticCenterStaffPasswordInput,
} from "@doctor-contract/shared";

// ============================================================
// 1. Diagnostic Center Profile Hooks
// ============================================================

export function useDiagnosticCenterProfile() {
  return useQuery<DiagnosticCenter>({
    queryKey: ["diagnostic-center", "profile"],
    queryFn: async () => {
      const res = await api.get("/diagnostic-centers/profile");
      return res.data.data.center;
    },
  });
}

export function useUpdateDiagnosticCenterProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateDiagnosticCenterProfileInput) => {
      const res = await api.patch("/diagnostic-centers/profile", payload);
      return res.data.data.center as DiagnosticCenter;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diagnostic-center", "profile"] });
    },
  });
}

export function useUploadDiagnosticCenterLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("photo", file);
      const res = await api.post("/diagnostic-centers/logo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data.center as DiagnosticCenter;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diagnostic-center", "profile"] });
    },
  });
}

// ============================================================
// 2. Diagnostic Center Staff Hooks
// ============================================================

export function useDiagnosticCenterStaff() {
  return useQuery<DiagnosticCenterStaff[]>({
    queryKey: ["diagnostic-center", "staff"],
    queryFn: async () => {
      const res = await api.get("/diagnostic-centers/staff");
      return res.data.data.staff;
    },
  });
}

export function useAddDiagnosticCenterStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateDiagnosticCenterStaffInput) => {
      const res = await api.post("/diagnostic-centers/staff", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diagnostic-center", "staff"] });
    },
  });
}

export function useChangeDiagnosticCenterStaffPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ChangeDiagnosticCenterStaffPasswordInput) => {
      const res = await api.patch("/diagnostic-centers/staff/change-password", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["diagnostic-center", "staff"] });
    },
  });
}

// ============================================================
// 3. Incoming Test Referrals Hook (Phase 02)
// ============================================================

export function useDiagnosticCenterIncomingReferrals(
  params: { page?: number; limit?: number } = {}
) {
  const { page = 1, limit = 20 } = params;
  return useQuery<DiagnosticCenterIncomingReferral[]>({
    queryKey: ["diagnostic-center", "referrals", "incoming", page, limit],
    queryFn: async () => {
      const res = await api.get("/test-referrals/incoming", {
        params: { page, limit },
      });
      return (
        res.data?.data?.referrals ??
        res.data?.data ??
        res.data?.referrals ??
        []
      );
    },
  });
}

