import { useQuery } from "@tanstack/react-query";
import type { Doctor } from "@doctor-contract/shared";
import { api } from "@/lib/api";
import type { Clinic } from "@/lib/hooks/useClinic";

// ============================================================
// Public Doctor & Clinic Directory Hooks
// ============================================================

/** A clinic as returned by the public directory. Only `id`/`clinicName`
 *  are guaranteed — everything else must be optionally rendered. */
export type PublicClinic = Clinic & {
  specialties?: string[];
  doctorsCount?: number;
  rating?: number;
  availability?: {
    isAvailable: boolean;
    status: string;
  };
};

function unwrapDoctors(res: { data?: unknown }): Doctor[] {
  const data = res.data as
    | { data?: { doctors?: Doctor[] } | Doctor[]; doctors?: Doctor[] }
    | undefined;

  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.doctors)) return data.doctors;
  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data.doctors)) return data.data.doctors;
  }
  return [];
}

function unwrapClinics(res: { data?: unknown }): PublicClinic[] {
  const data = res.data as
    | { data?: { clinics?: PublicClinic[] } | PublicClinic[]; clinics?: PublicClinic[] }
    | undefined;

  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.clinics)) return data.clinics;
  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data.clinics)) return data.data.clinics;
  }
  return [];
}

// ------------------------------------------------------------
// Doctors
// ------------------------------------------------------------

export function usePublicFeaturedDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["public", "doctors", "featured"],
    queryFn: async () => {
      const res = await api.get("/doctors/featured");
      return unwrapDoctors(res);
    },
    staleTime: 60_000,
  });
}

export function usePublicAllDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["public", "doctors", "all"],
    queryFn: async () => {
      const res = await api.get("/doctors");
      return unwrapDoctors(res);
    },
    staleTime: 60_000,
  });
}

export function usePublicAvailableDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["public", "doctors", "available"],
    queryFn: async () => {
      // Changed from /doctors/available to /doctors?available=true
      const res = await api.get("/doctors?available=true"); 
      return unwrapDoctors(res);
    },
    staleTime: 30_000,
  });
}

// ------------------------------------------------------------
// Clinics
// ------------------------------------------------------------

export function usePublicFeaturedClinics() {
  return useQuery<PublicClinic[]>({
    queryKey: ["public", "clinics", "featured"],
    queryFn: async () => {
      const res = await api.get("/clinic/featured");
      return unwrapClinics(res);
    },
    staleTime: 60_000,
  });
}

export function usePublicAllClinics() {
  return useQuery<PublicClinic[]>({
    queryKey: ["public", "clinics", "all"],
    queryFn: async () => {
      const res = await api.get("/clinic");
      return unwrapClinics(res);
    },
    staleTime: 60_000,
  });
}

export const usePublicAvailableClinics = () => {
  return useQuery<PublicClinic[]>({
    queryKey: ["public-clinics", "available"],
    queryFn: async () => {
      const res = await api.get("/clinic?available=true");
      return unwrapClinics(res);
    },
    staleTime: 30_000,
  });
};