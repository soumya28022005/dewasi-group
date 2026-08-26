"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Flag,
  Stethoscope,
  Building2,
  User,
} from "lucide-react";

import {
  usePendingReviews,
  useReportedReviews,
  useModerateReview,
} from "@/lib/hooks/useReviews";
import type { AdminReviewRecord } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data &&
    typeof err.response.data.message === "string"
  ) {
    return err.response.data.message;
  }
  return fallback;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${
            n <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const t = useTranslations("AdminReviews");
  const [tab, setTab] = useState<"pending" | "reported">("pending");

  const pending = usePendingReviews();
  const reported = useReportedReviews();
  const moderate = useModerateReview();

  const active = tab === "pending" ? pending : reported;
  const { data, isLoading, isError, isFetching, refetch } = active;
  const reviews = data ?? [];

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleModerate(review: AdminReviewRecord, action: "APPROVE" | "REJECT") {
    setActionError(null);
    setActionSuccess(null);
    setPendingId(review.id);

    try {
      await moderate.mutateAsync({ reviewId: review.id, action });
      setActionSuccess(
        action === "APPROVE"
          ? t("successApproved") || "Review approved."
          : t("successRejected") || "Review rejected."
      );
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to moderate review"));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Amber */}
      <GradientCard variant="amber">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {t("title") || "Reviews Moderation"}
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("subtitle") || "Approve, reject, or handle reported patient reviews."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-amber-600" : ""}`} />
            <span>{t("retry") || "Refresh"}</span>
          </button>
        </div>
      </GradientCard>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition ${
            tab === "pending"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs"
              : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          {t("tabPending") || "Pending Approval"}
          {pending.data && pending.data.length > 0 && (
            <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">
              {pending.data.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("reported")}
          className={`flex-1 rounded-lg px-4 py-2 text-xs font-bold transition ${
            tab === "reported"
              ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-xs"
              : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          {t("tabReported") || "Reported"}
          {reported.data && reported.data.length > 0 && (
            <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">
              {reported.data.length}
            </span>
          )}
        </button>
      </div>

      {/* Alerts */}
      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button type="button" onClick={() => setActionError(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button type="button" onClick={() => setActionSuccess(null)} className="text-[11px] font-bold underline">
            {t("dismiss") || "Dismiss"}
          </button>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
              <h3 className="text-xs font-semibold">{t("errorTitle") || "Could not load reviews"}</h3>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              {t("retry") || "Retry"}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <GradientCard variant="amber">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shadow-xs">
                  {tab === "pending" ? <Star className="h-6 w-6" /> : <Flag className="h-6 w-6" />}
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {tab === "pending"
                    ? t("emptyPending") || "No reviews awaiting approval"
                    : t("emptyReported") || "No reported reviews"}
                </h3>
              </div>
            </GradientCard>
          ) : (
            reviews.map((review) => (
              <GradientCard key={review.id} variant={tab === "pending" ? "amber" : "rose"}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StarRow rating={review.rating} />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {review.rating}/5
                      </span>
                      {review.isReported && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          <Flag className="h-3 w-3" />
                          {t("reported") || "Reported"}
                        </span>
                      )}
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    )}

                    {review.reportReason && (
                      <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/20 dark:text-rose-300">
                        <span className="font-bold">{t("reportReason") || "Report reason"}:</span>{" "}
                        {review.reportReason}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {review.patient?.name && (
                        <span className="flex items-center gap-1 font-medium">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {review.patient.name}
                        </span>
                      )}
                      {review.doctor?.user?.name && (
                        <span className="flex items-center gap-1 font-medium">
                          <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                          {review.doctor.user.name}
                        </span>
                      )}
                      {review.clinic?.clinicName && (
                        <span className="flex items-center gap-1 font-medium">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {review.clinic.clinicName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-start">
                    <button
                      type="button"
                      onClick={() => handleModerate(review, "APPROVE")}
                      disabled={pendingId === review.id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t("approve") || "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerate(review, "REJECT")}
                      disabled={pendingId === review.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {t("reject") || "Reject"}
                    </button>
                  </div>
                </div>
              </GradientCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}