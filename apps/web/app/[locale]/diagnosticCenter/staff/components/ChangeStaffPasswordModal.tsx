"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  X,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useChangeDiagnosticCenterStaffPassword } from "@/lib/hooks/useDiagnosticCenter";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface ChangeStaffPasswordModalProps {
  isOpen: boolean;
  staff: DiagnosticCenterStaff | null;
  onClose: () => void;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export function ChangeStaffPasswordModal({
  isOpen,
  staff,
  onClose,
}: ChangeStaffPasswordModalProps) {
  const t = useTranslations("DiagnosticCenterStaff");
  const changePassword = useChangeDiagnosticCenterStaffPassword();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  if (!isOpen || !staff) return null;

  const staffName = staff.name || staff.user?.name || t("name");
  const staffEmail = staff.email || staff.user?.email || "";
  const targetUserId = staff.user?.id || staff.userId || staff.id;

  function handleClose() {
    reset();
    setServerError(null);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  }

  async function onSubmit(data: FormValues) {
    setServerError(null);

    if (data.newPassword !== data.confirmPassword) {
      setServerError(t("passwordsDoNotMatch"));
      return;
    }

    try {
      await changePassword.mutateAsync({
        userId: targetUserId,
        newPassword: data.newPassword,
      });
      toast.success(t("passwordSuccess"));
      handleClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("passwordError");
      setServerError(msg);
      toast.error(msg);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="change-password-modal-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                {t("modalPasswordTitle")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("modalPasswordDesc")}
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

        {/* Staff Target Identifier Card */}
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
              {staffName}
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {staffEmail}
            </p>
          </div>
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
          {/* New Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t("modalPasswordTitle")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder={t("newPasswordPlaceholder")}
                className={`w-full rounded-lg border bg-white py-2 pl-9 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 ${
                  errors.newPassword
                    ? "border-rose-300 focus:border-rose-600 dark:border-rose-700"
                    : "border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500"
                }`}
                {...register("newPassword", {
                  required: t("passwordMinLength"),
                  minLength: { value: 6, message: t("passwordMinLength") },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {t("confirmPasswordPlaceholder")}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPasswordPlaceholder")}
                className={`w-full rounded-lg border bg-white py-2 pl-9 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 ${
                  errors.confirmPassword
                    ? "border-rose-300 focus:border-rose-600 dark:border-rose-700"
                    : "border-slate-200 focus:border-blue-600 dark:border-slate-700 dark:focus:border-blue-500"
                }`}
                {...register("confirmPassword", {
                  required: t("passwordMinLength"),
                  validate: (val) =>
                    val === watch("newPassword") || t("passwordsDoNotMatch"),
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={changePassword.isPending}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {changePassword.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <KeyRound className="h-3.5 w-3.5" />
              )}
              <span>
                {changePassword.isPending
                  ? t("updating")
                  : t("updatePasswordBtn")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
