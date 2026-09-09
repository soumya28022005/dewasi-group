"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
  XCircle,
  Hash,
  Search,
  Plus,
} from "lucide-react";

import {
  useAdminClinics,
  useAdminFeaturedClinics,
  useSetFeaturedClinic,
} from "@/lib/hooks/useAdmin";
import type { AdminClinicRecord } from "@doctor-contract/shared";
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

export default function AdminFeaturedClinicsPage() {
  const t = useTranslations("AdminFeaturedClinics");

  const {
    data: featured,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAdminFeaturedClinics();

  // All approved clinics, to pick new ones to feature from.
  const { data: allClinicsData, isLoading: isLoadingAll } = useAdminClinics({
    isApproved: true,
    limit: 100,
  });

  const setFeatured = useSetFeaturedClinic();

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [editingClinicId, setEditingClinicId] = useState<string | null>(null);
  const [orderInput, setOrderInput] = useState<number>(1);
  const [addSearch, setAddSearch] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);

  const featuredList = [...(featured || [])].sort((a, b) => {
    const orderA = a.featuredOrder ?? 999;
    const orderB = b.featuredOrder ?? 999;
    return orderA - orderB;
  });

  const featuredIds = useMemo(
    () => new Set(featuredList.map((c) => c.id)),
    [featuredList]
  );

  const addableClinics = useMemo(() => {
    const all = allClinicsData?.clinics ?? [];
    const notFeatured = all.filter((c) => !featuredIds.has(c.id));

    const q = addSearch.trim().toLowerCase();
    if (!q) return notFeatured;

    return notFeatured.filter((c) =>
      [c.clinicName, c.city, c.state].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [allClinicsData, featuredIds, addSearch]);

  async function handleAddFeatured(clinic: AdminClinicRecord) {
    setActionError(null);
    setActionSuccess(null);
    try {
      await setFeatured.mutateAsync({
        clinicId: clinic.id,
        isFeatured: true,
        featuredOrder: featuredList.length + 1,
      });
      setActionSuccess(t("successFeatured") || "Clinic added to featured.");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to feature clinic"));
    }
  }

  async function handleRemoveFeatured(clinic: AdminClinicRecord) {
    setActionError(null);
    setActionSuccess(null);
    try {
      await setFeatured.mutateAsync({
        clinicId: clinic.id,
        isFeatured: false,
      });
      setActionSuccess(t("successRemoved") || "Clinic removed from featured.");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to update featured status"));
    }
  }

  async function handleSaveOrder(clinicId: string) {
    setActionError(null);
    setActionSuccess(null);
    try {
      await setFeatured.mutateAsync({
        clinicId,
        isFeatured: true,
        featuredOrder: Number(orderInput) || 1,
      });
      setEditingClinicId(null);
      setActionSuccess(t("successFeatured") || "Featured order updated.");
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, "Failed to update featured order"));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Purple */}
      <GradientCard variant="purple">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {t("title") || "Featured Clinics"}
              </h1>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                Partner Spotlight
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("subtitle") || "Choose which approved clinics appear in the homepage spotlight."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowAddPanel((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("addClinic") || "Add Clinic"}
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-purple-600" : ""}`} />
              <span>{t("retry") || "Refresh"}</span>
            </button>
          </div>
        </div>
      </GradientCard>

      {/* Add Clinic Panel */}
      {showAddPanel && (
        <GradientCard variant="indigo">
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                placeholder={t("searchPlaceholder") || "Search approved clinics by name or city..."}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>

            {isLoadingAll ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-lg bg-white/60 dark:bg-slate-900/60"
                  />
                ))}
              </div>
            ) : addableClinics.length === 0 ? (
              <p className="py-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                {t("noAddable") || "No more approved clinics to add."}
              </p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {addableClinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                        {clinic.clinicName}
                      </p>
                      {(clinic.city || clinic.state) && (
                        <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {[clinic.city, clinic.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddFeatured(clinic)}
                      disabled={setFeatured.isPending}
                      className="shrink-0 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {t("add") || "Add"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GradientCard>
      )}

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
              <h3 className="text-xs font-semibold">{t("errorTitle") || "Could not load featured clinics"}</h3>
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
              className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      )}

      {/* Featured Clinics List */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {featuredList.length === 0 ? (
            <GradientCard variant="purple">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-xs">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("emptyTitle") || "No featured clinics yet"}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t("emptyDesc") || 'Use "Add Clinic" above to feature one.'}
                </p>
              </div>
            </GradientCard>
          ) : (
            featuredList.map((clinic) => (
              <GradientCard key={clinic.id} variant="purple">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 shadow-xs">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {clinic.clinicName}
                      </h3>
                      {(clinic.city || clinic.state) && (
                        <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{[clinic.city, clinic.state].filter(Boolean).join(", ")}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {editingClinicId === clinic.id ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800 shadow-xs">
                          <Hash className="h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="number"
                            min={1}
                            max={999}
                            value={orderInput}
                            onChange={(e) => setOrderInput(Number(e.target.value))}
                            className="w-12 bg-transparent text-xs font-bold text-slate-900 outline-none dark:text-slate-100"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSaveOrder(clinic.id)}
                          disabled={setFeatured.isPending}
                          className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                          {setFeatured.isPending ? t("updating") || "Updating..." : t("confirm") || "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingClinicId(null)}
                          className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                        >
                          {t("cancel") || "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-extrabold text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                          <Hash className="h-3 w-3" />
                          <span>
                            {t("featuredOrder") || "Order"}: {clinic.featuredOrder || 1}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingClinicId(clinic.id);
                            setOrderInput(clinic.featuredOrder || 1);
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {t("setOrder") || "Set Order"}
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveFeatured(clinic)}
                      disabled={setFeatured.isPending}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>{t("removeFeatured") || "Remove"}</span>
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