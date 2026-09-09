"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  X,
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAddDiagnosticCenterStaff } from "@/lib/hooks/useDiagnosticCenter";
import type { CreateDiagnosticCenterStaffInput } from "@doctor-contract/shared";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const t = useTranslations("DiagnosticCenterStaff");
  const addStaff = useAddDiagnosticCenterStaff();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  if (!isOpen) return null;

  function handleClose() {
    reset();
    setServerError(null);
    setShowPassword(false);
    onClose();
  }

  async function onSubmit(data: FormValues) {
    setServerError(null);

    const payload: CreateDiagnosticCenterStaffInput = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone?.trim() || undefined,
    };

    try {
      await addStaff.mutateAsync(payload);
      toast.success(t("createSuccess"));
      handleClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("createError");
      setServerError(msg);
      toast.error(msg);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-staff-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="add-staff-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                {t("modalAddTitle")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("modalAddDesc")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="staff-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t("name")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="staff-name"
                type="text"
                placeholder={t("namePlaceholder")}
                className={`w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 ${
                  errors.name
                    ? "border-rose-300 focus:border-rose-600 dark:border-rose-700"
                    : "border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500"
                }`}
                {...register("name", {
                  required: t("nameMinLength"),
                  minLength: { value: 2, message: t("nameMinLength") },
                })}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="staff-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t("email")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="staff-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className={`w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 ${
                  errors.email
                    ? "border-rose-300 focus:border-rose-600 dark:border-rose-700"
                    : "border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500"
                }`}
                {...register("email", {
                  required: t("invalidEmail"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("invalidEmail"),
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="staff-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t("actions")} — {t("changePassword")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="staff-password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                className={`w-full rounded-lg border bg-white py-2 pl-9 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 ${
                  errors.password
                    ? "border-rose-300 focus:border-rose-600 dark:border-rose-700"
                    : "border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500"
                }`}
                {...register("password", {
                  required: t("passwordMinLength"),
                  minLength: { value: 6, message: t("passwordMinLength") },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="staff-phone"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t("phone")} <span className="text-[10px] font-normal text-slate-400">({t("notProvided")})</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                id="staff-phone"
                type="tel"
                placeholder={t("phonePlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={addStaff.isPending}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={addStaff.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {addStaff.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UserPlus className="h-3.5 w-3.5" />
              )}
              <span>{addStaff.isPending ? t("creating") : t("createStaffBtn")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
