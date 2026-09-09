import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AdminAnnouncementRecord,
  PublishAnnouncementInput,
} from "@doctor-contract/shared";
import { api } from "@/lib/api";

// ============================================================
// Announcements
//
// Matches announcement.routes.js exactly:
//   POST   /announcements/admin                (Admin) publish platform-wide
//   GET    /announcements/admin                (Admin) list platform announcements
//   POST   /announcements/clinic               (Clinic) publish clinic announcement
//   GET    /announcements/clinic/:clinicId     view a clinic's active announcements
//   PATCH  /announcements/:id/deactivate       deactivate (own clinic, or any as Admin)
// ============================================================

function unwrapAnnouncements(res: { data?: unknown }): AdminAnnouncementRecord[] {
  const data = res.data as
    | { data?: { announcements?: AdminAnnouncementRecord[] } | AdminAnnouncementRecord[] }
    | undefined;

  if (!data) return [];
  if ("data" in data) {
    const inner = data.data;
    if (Array.isArray(inner)) return inner;
    if (inner && Array.isArray(inner.announcements)) return inner.announcements;
  }
  return [];
}

// ------------------------------------------------------------
// Admin (platform-wide)
// ------------------------------------------------------------

export function useAdminAnnouncements() {
  return useQuery<AdminAnnouncementRecord[]>({
    queryKey: ["admin", "announcements"],
    queryFn: async () => {
      const res = await api.get("/announcements/admin");
      return unwrapAnnouncements(res);
    },
  });
}

export function usePublishPlatformAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PublishAnnouncementInput) => {
      const res = await api.post("/announcements/admin", payload);
      return res.data.data as AdminAnnouncementRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "announcements"] });
    },
  });
}

export function useDeactivateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (announcementId: string) => {
      const res = await api.patch(`/announcements/${announcementId}/deactivate`);
      return res.data.data as AdminAnnouncementRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "announcements"] });
      qc.invalidateQueries({ queryKey: ["clinic", "announcements"] });
    },
  });
}

// ------------------------------------------------------------
// Clinic (their own announcements + platform-wide ones)
// ------------------------------------------------------------

export function useClinicAnnouncements(clinicId: string | undefined) {
  return useQuery<AdminAnnouncementRecord[]>({
    queryKey: ["clinic", "announcements", clinicId],
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await api.get(`/announcements/clinic/${clinicId}`);
      return unwrapAnnouncements(res);
    },
  });
}

export function usePublishClinicAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PublishAnnouncementInput & { doctorId?: string }) => {
      const res = await api.post("/announcements/clinic", payload);
      return res.data.data as AdminAnnouncementRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinic", "announcements"] });
    },
  });
}