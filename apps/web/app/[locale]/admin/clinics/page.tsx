"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";

import {
  useAdminClinics,
  useApproveClinic,
  useRevokeClinic,
  useCreateClinic,
} from "@/lib/hooks/useAdmin";

import type {
  AdminClinicRecord,
  CreateClinicInput,
} from "@doctor-contract/shared";

import { GradientCard } from "@/components/ui/GradientCard";

type FilterTab = "ALL" | "APPROVED" | "PENDING";

export default function AdminClinicsPage() {
  const t = useTranslations("AdminClinics");
  const locale = useLocale();

  const localeCode =
    locale === "bn"
      ? "bn-BD"
      : locale === "hi"
        ? "hi-IN"
        : "en-US";

  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [page, setPage] = useState(1);

  const limit = 20;

  const isApprovedParam =
    activeTab === "ALL"
      ? undefined
      : activeTab === "APPROVED";

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAdminClinics({
    isApproved: isApprovedParam,
    page,
    limit,
  });

  const approveClinic = useApproveClinic();
  const revokeClinic = useRevokeClinic();
  const createClinic = useCreateClinic();

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] =
    useState<string | null>(null);

  const [pendingApproveClinic, setPendingApproveClinic] =
    useState<AdminClinicRecord | null>(null);

  const [pendingRevokeClinic, setPendingRevokeClinic] =
    useState<AdminClinicRecord | null>(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [formData, setFormData] =
    useState<CreateClinicInput>({
      name: "",
      email: "",
      password: "",
      phone: "",
      clinicName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  const clinics = data?.clinics || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  async function handleConfirmApprove() {
    if (!pendingApproveClinic) return;

    const clinicId = pendingApproveClinic.id;

    setPendingApproveClinic(null);
    setActionError(null);
    setActionSuccess(null);

    try {
      await approveClinic.mutateAsync(clinicId);
      setActionSuccess(t("successApproved"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          "Failed to approve clinic"
      );
    }
  }

  async function handleConfirmRevoke() {
    if (!pendingRevokeClinic) return;

    const clinicId = pendingRevokeClinic.id;

    setPendingRevokeClinic(null);
    setActionError(null);
    setActionSuccess(null);

    try {
      await revokeClinic.mutateAsync(clinicId);
      setActionSuccess(t("successRevoked"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          "Failed to revoke clinic approval"
      );
    }
  }

  async function handleCreateClinic(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setActionError(null);
    setActionSuccess(null);

    const requiredFields = [
      {
        value: formData.clinicName,
        label: "Clinic Name",
      },
      {
        value: formData.name,
        label: "Owner / Admin Name",
      },
      {
        value: formData.email,
        label: "Owner Email Address",
      },
      {
        value: formData.password,
        label: "Account Password",
      },
      {
        value: formData.phone,
        label: "Phone Number",
      },
    ];

    const missingField = requiredFields.find(
      (field) =>
        !field.value ||
        !String(field.value).trim()
    );

    if (missingField) {
      setActionError(
        `${missingField.label} is required.`
      );
      return;
    }

    const phone = String(formData.phone)
      .replace(/\D/g, "");

    if (!/^\d{10}$/.test(phone)) {
      setActionError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (formData.password.trim().length < 6) {
      setActionError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      await createClinic.mutateAsync({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone,
        clinicName: formData.clinicName.trim(),
        address: formData.address?.trim() || "",
        city: formData.city?.trim() || "",
        state: formData.state?.trim() || "",
        pincode: formData.pincode?.trim() || "",
      });

      setShowCreateModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        clinicName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });

      setActionSuccess(t("successCreated"));
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          "Failed to create clinic"
      );
    }
  }

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return "—";

    try {
      return new Date(dateStr).toLocaleDateString(
        localeCode,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="space-y-6">
      <GradientCard variant="purple">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {t("title")}
              </h1>

              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                Clinics Management
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setActionSuccess(null);
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t("addClinic")}</span>
            </button>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isFetching
                    ? "animate-spin text-blue-600"
                    : ""
                }`}
              />

              <span>{t("retry")}</span>
            </button>
          </div>
        </div>
      </GradientCard>

      {actionError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{actionError}</span>
          </div>

          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-[11px] font-bold underline"
          >
            {t("dismiss")}
          </button>
        </div>
      )}

      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>

          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-[11px] font-bold underline"
          >
            {t("dismiss")}
          </button>
        </div>
      )}

      <GradientCard variant="slate">
        <div className="flex flex-wrap gap-1.5 p-2">
          {(
            [
              ["ALL", t("all")],
              ["APPROVED", t("approved")],
              ["PENDING", t("pending")],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setActiveTab(value);
                setPage(1);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === value
                  ? value === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : value === "PENDING"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </GradientCard>

      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />

            <div className="flex-1">
              <h3 className="text-xs font-semibold">
                {t("errorTitle")}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <GradientCard variant="slate">
          <div className="overflow-hidden">
            {clinics.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("emptyTitle")}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t("emptyDesc")}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">
                        {t("clinicName")}
                      </th>

                      <th className="px-4 py-3">
                        {t("owner")}
                      </th>

                      <th className="px-4 py-3">
                        {t("location")}
                      </th>

                      <th className="px-4 py-3">
                        {t("approvalStatus")}
                      </th>

                      <th className="px-4 py-3">
                        {t("createdDate")}
                      </th>

                      <th className="px-4 py-3 text-right">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clinics.map((clinic) => (
                      <tr
                        key={clinic.id}
                        className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                              <Building2 className="h-4 w-4" />
                            </div>

                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {clinic.clinicName}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {clinic.user?.name || "—"}
                          </p>

                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {clinic.user?.email ||
                              clinic.user?.phone ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {clinic.address ? (
                            <span>
                              {clinic.address}
                              {clinic.city
                                ? `, ${clinic.city}`
                                : ""}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {clinic.isApproved ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              {t("approved")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                              <XCircle className="h-3 w-3" />
                              {t("pending")}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {formatDate(clinic.createdAt)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {clinic.isApproved ? (
                            <button
                              type="button"
                              onClick={() =>
                                setPendingRevokeClinic(clinic)
                              }
                              disabled={
                                revokeClinic.isPending
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/50 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            >
                              <ShieldAlert className="h-3 w-3" />
                              {t("revoke")}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setPendingApproveClinic(
                                  clinic
                                )
                              }
                              disabled={
                                approveClinic.isPending
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <ShieldCheck className="h-3 w-3" />
                              {t("approve")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {total > limit && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>
                  {t("page")} {page} {t("of")} {totalPages} (
                  {total.toLocaleString(localeCode)}{" "}
                  {t("clinics")})
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) =>
                        Math.max(1, p - 1)
                      )
                    }
                    disabled={page <= 1 || isLoading}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {t("previous")}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) =>
                        Math.min(totalPages, p + 1)
                      )
                    }
                    disabled={
                      page >= totalPages || isLoading
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    {t("next")}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </GradientCard>
      )}

      {/* APPROVE MODAL */}
      {pendingApproveClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("approveDialogTitle")}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingApproveClinic.clinicName}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              {t("approveDialogDesc")}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setPendingApproveClinic(null)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={approveClinic.isPending}
                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {approveClinic.isPending
                  ? t("saving")
                  : t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVOKE MODAL */}
      {pendingRevokeClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("revokeDialogTitle")}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingRevokeClinic.clinicName}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
              {t("revokeDialogDesc")}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setPendingRevokeClinic(null)
                }
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={handleConfirmRevoke}
                disabled={revokeClinic.isPending}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {revokeClinic.isPending
                  ? t("saving")
                  : t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CLINIC MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="my-8 w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  Register New Clinic
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create a clinic partner account with initial
                  administrator credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setActionError(null);
                }}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={handleCreateClinic}
              className="mt-8"
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2">
                {/* CLINIC NAME */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Clinic Name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinicName: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

                {/* OWNER NAME */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Owner / Admin Name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Owner Email Address{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Account Password{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

               {/* PHONE NUMBER - REQUIRED */}
<div>
  <label
    htmlFor="clinic-phone"
    className="block text-sm font-bold text-slate-700 dark:text-slate-300"
  >
    Phone Number <span className="text-red-500">*</span>
  </label>

  <input
    id="clinic-phone"
    name="phone"
    type="tel"
    required
    inputMode="numeric"
    autoComplete="tel"
    maxLength={10}
    minLength={10}
    pattern="[0-9]{10}"
    value={formData.phone || ""}
    onChange={(e) => {
      const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }}
    placeholder="10-digit mobile number"
    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
  />

  <p className="mt-1 text-[11px] text-slate-400">
    Mobile number is required
  </p>
</div>

                {/* CITY */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    City
                  </label>

                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

                {/* STATE */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    State
                  </label>

                  <input
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

                {/* PIN CODE */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.pincode || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pincode: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>

                {/* STREET ADDRESS */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    Street Address
                  </label>

                  <textarea
                    rows={3}
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-950"
                  />
                </div>
              </div>

              {actionError && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setActionError(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createClinic.isPending}
                  className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createClinic.isPending
                    ? "Creating..."
                    : "Create Clinic"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}