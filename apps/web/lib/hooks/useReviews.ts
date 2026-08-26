import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminReviewRecord, ModerateReviewInput } from "@doctor-contract/shared";
import { api } from "@/lib/api";

// ============================================================
// Reviews
//
// Matches review.routes.js exactly:
//   POST   /reviews                          (Patient) submit a review
//   PATCH  /reviews/:reviewId/report          report a review
//   GET    /reviews/doctor/:doctorId          doctor's approved reviews
//   GET    /reviews/clinic/:clinicId          clinic's approved reviews
//   GET    /reviews/pending                   (Admin) pending reviews
//   GET    /reviews/reported                  (Admin) reported reviews
//   PATCH  /reviews/:reviewId/moderate        (Admin) approve/reject
// ============================================================

function unwrapReviews(res: { data?: unknown }): AdminReviewRecord[] {
  const data = res.data as
    | { data?: { reviews?: AdminReviewRecord[] } | AdminReviewRecord[] }
    | undefined;

  if (!data) return [];
  if ("data" in data) {
    const inner = data.data;
    if (Array.isArray(inner)) return inner;
    if (inner && Array.isArray(inner.reviews)) return inner.reviews;
  }
  return [];
}

// ------------------------------------------------------------
// Patient actions
// ------------------------------------------------------------

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { appointmentId: string; rating: number; comment?: string }) => {
      const res = await api.post("/reviews", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useReportReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, reportReason }: { reviewId: string; reportReason: string }) => {
      const res = await api.patch(`/reviews/${reviewId}/report`, { reportReason });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["admin", "reviews", "reported"] });
    },
  });
}

// ------------------------------------------------------------
// Public listings
// ------------------------------------------------------------

export function useDoctorReviews(doctorId: string | undefined) {
  return useQuery<AdminReviewRecord[]>({
    queryKey: ["reviews", "doctor", doctorId],
    enabled: !!doctorId,
    queryFn: async () => {
      const res = await api.get(`/reviews/doctor/${doctorId}`);
      return unwrapReviews(res);
    },
  });
}

export function useClinicReviews(clinicId: string | undefined) {
  return useQuery<AdminReviewRecord[]>({
    queryKey: ["reviews", "clinic", clinicId],
    enabled: !!clinicId,
    queryFn: async () => {
      const res = await api.get(`/reviews/clinic/${clinicId}`);
      return unwrapReviews(res);
    },
  });
}

// ------------------------------------------------------------
// Admin moderation
// ------------------------------------------------------------

export function usePendingReviews() {
  return useQuery<AdminReviewRecord[]>({
    queryKey: ["admin", "reviews", "pending"],
    queryFn: async () => {
      const res = await api.get("/reviews/pending");
      return unwrapReviews(res);
    },
  });
}

export function useReportedReviews() {
  return useQuery<AdminReviewRecord[]>({
    queryKey: ["admin", "reviews", "reported"],
    queryFn: async () => {
      const res = await api.get("/reviews/reported");
      return unwrapReviews(res);
    },
  });
}

export function useModerateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, action }: ModerateReviewInput) => {
      const res = await api.patch(`/reviews/${reviewId}/moderate`, { action });
      return res.data.data.review as AdminReviewRecord;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}