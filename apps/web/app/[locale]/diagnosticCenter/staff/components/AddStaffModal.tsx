"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  ShieldCheck,
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

export function AddStaffModal({
  isOpen,
  onClose,
}: AddStaffModalProps) {
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
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-slate-950/70 p-4
        backdrop-blur-md
        animate-in fade-in duration-200
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-staff-modal-title"
    >
      <div
        className="
          relative w-full max-w-lg overflow-hidden
          rounded-[28px]
          border border-white/70
          bg-white
          shadow-[0_32px_100px_-24px_rgba(15,23,42,0.45)]
          animate-in zoom-in-95 slide-in-from-bottom-2 duration-300
          dark:border-slate-700/70
          dark:bg-slate-950
          dark:shadow-[0_32px_100px_-24px_rgba(0,0,0,0.8)]
        "
      >
        {/* Premium top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />

        {/* Header */}
        <div className="relative border-b border-slate-100 px-7 pb-6 pt-7 dark:border-slate-800">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-2xl
                  border border-blue-100
                  bg-gradient-to-br from-blue-50 to-indigo-50
                  text-blue-600
                  shadow-sm
                  dark:border-blue-900/60
                  dark:from-blue-950/60
                  dark:to-indigo-950/40
                  dark:text-blue-400
                "
              >
                <UserPlus className="h-5 w-5" strokeWidth={2.2} />
              </div>

              <div className="min-w-0 pt-0.5">
                <div className="mb-1 flex items-center gap-2">
                  <h2
                    id="add-staff-modal-title"
                    className="
                      text-[17px] font-bold tracking-[-0.02em]
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {t("modalAddTitle")}
                  </h2>

                  <span
                    className="
                      hidden rounded-full border border-blue-100
                      bg-blue-50 px-2 py-0.5
                      text-[9px] font-bold uppercase tracking-[0.12em]
                      text-blue-600
                      sm:inline-flex
                      dark:border-blue-900/50
                      dark:bg-blue-950/40
                      dark:text-blue-400
                    "
                  >
                    Staff
                  </span>
                </div>

                <p className="max-w-sm text-[12px] leading-5 text-slate-500 dark:text-slate-400">
                  {t("modalAddDesc")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={addStaff.isPending}
              aria-label="Close dialog"
              className="
                group flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl
                border border-transparent
                text-slate-400
                transition-all duration-200
                hover:border-slate-200
                hover:bg-slate-50
                hover:text-slate-700
                disabled:pointer-events-none
                dark:hover:border-slate-700
                dark:hover:bg-slate-900
                dark:hover:text-slate-200
              "
            >
              <X
                className="h-[18px] w-[18px] transition-transform duration-200 group-hover:rotate-90"
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-7 pb-7 pt-6"
        >
          {/* Server Error */}
          {serverError && (
            <div
              className="
                mb-5 flex items-start gap-3 rounded-2xl
                border border-rose-200
                bg-rose-50/80
                px-4 py-3.5
                text-[12px]
                text-rose-800
                shadow-sm
                dark:border-rose-900/60
                dark:bg-rose-950/20
                dark:text-rose-300
              "
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/60">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold">Unable to create staff</p>
                <p className="mt-0.5 leading-5 opacity-80">
                  {serverError}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="staff-name"
                className="
                  mb-2 flex items-center justify-between
                  text-[11px] font-bold uppercase tracking-[0.08em]
                  text-slate-600
                  dark:text-slate-400
                "
              >
                <span>{t("name")}</span>
                <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
                  Required
                </span>
              </label>

              <div className="group relative">
                <div
                  className="
                    pointer-events-none absolute inset-y-0 left-0
                    flex items-center pl-3.5
                    text-slate-400
                    transition-colors
                    group-focus-within:text-blue-600
                    dark:group-focus-within:text-blue-400
                  "
                >
                  <User className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </div>

                <input
                  id="staff-name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  className={`
                    h-12 w-full rounded-2xl border
                    bg-slate-50/70
                    pl-11 pr-4
                    text-[13px] font-medium
                    text-slate-900
                    outline-none
                    transition-all duration-200
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]
                    dark:bg-slate-900/70
                    dark:text-slate-100
                    dark:placeholder:text-slate-600
                    dark:focus:bg-slate-900
                    dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.10)]
                    ${
                      errors.name
                        ? "border-rose-300 focus:border-rose-500 dark:border-rose-800"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-800 dark:focus:border-blue-500"
                    }
                  `}
                  {...register("name", {
                    required: t("nameMinLength"),
                    minLength: {
                      value: 2,
                      message: t("nameMinLength"),
                    },
                  })}
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 pl-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="staff-email"
                className="
                  mb-2 flex items-center justify-between
                  text-[11px] font-bold uppercase tracking-[0.08em]
                  text-slate-600 dark:text-slate-400
                "
              >
                <span>{t("email")}</span>
                <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
                  Required
                </span>
              </label>

              <div className="group relative">
                <div
                  className="
                    pointer-events-none absolute inset-y-0 left-0
                    flex items-center pl-3.5
                    text-slate-400
                    transition-colors
                    group-focus-within:text-blue-600
                    dark:group-focus-within:text-blue-400
                  "
                >
                  <Mail className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </div>

                <input
                  id="staff-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  className={`
                    h-12 w-full rounded-2xl border
                    bg-slate-50/70
                    pl-11 pr-4
                    text-[13px] font-medium
                    text-slate-900
                    outline-none
                    transition-all duration-200
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]
                    dark:bg-slate-900/70
                    dark:text-slate-100
                    dark:placeholder:text-slate-600
                    dark:focus:bg-slate-900
                    ${
                      errors.email
                        ? "border-rose-300 focus:border-rose-500 dark:border-rose-800"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-800 dark:focus:border-blue-500"
                    }
                  `}
                  {...register("email", {
                    required: t("invalidEmail"),
                    pattern: {
                      value:
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("invalidEmail"),
                    },
                  })}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 pl-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="staff-password"
                className="
                  mb-2 flex items-center justify-between
                  text-[11px] font-bold uppercase tracking-[0.08em]
                  text-slate-600 dark:text-slate-400
                "
              >
                <span>Password</span>

                <span className="flex items-center gap-1 text-[10px] font-medium normal-case tracking-normal text-slate-400">
                  <ShieldCheck className="h-3 w-3" />
                  Secure
                </span>
              </label>

              <div className="group relative">
                <div
                  className="
                    pointer-events-none absolute inset-y-0 left-0
                    flex items-center pl-3.5
                    text-slate-400
                    transition-colors
                    group-focus-within:text-blue-600
                    dark:group-focus-within:text-blue-400
                  "
                >
                  <Lock className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </div>

                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("passwordPlaceholder")}
                  className={`
                    h-12 w-full rounded-2xl border
                    bg-slate-50/70
                    pl-11 pr-12
                    text-[13px] font-medium
                    text-slate-900
                    outline-none
                    transition-all duration-200
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]
                    dark:bg-slate-900/70
                    dark:text-slate-100
                    dark:placeholder:text-slate-600
                    dark:focus:bg-slate-900
                    ${
                      errors.password
                        ? "border-rose-300 focus:border-rose-500 dark:border-rose-800"
                        : "border-slate-200 focus:border-blue-500 dark:border-slate-800 dark:focus:border-blue-500"
                    }
                  `}
                  {...register("password", {
                    required: t("passwordMinLength"),
                    minLength: {
                      value: 6,
                      message: t("passwordMinLength"),
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="
                    absolute right-2 top-1/2
                    flex h-8 w-8 -translate-y-1/2
                    items-center justify-center
                    rounded-lg
                    text-slate-400
                    transition-all
                    hover:bg-slate-100
                    hover:text-slate-700
                    dark:hover:bg-slate-800
                    dark:hover:text-slate-200
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.8} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.8} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 pl-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="staff-phone"
                className="
                  mb-2 flex items-center justify-between
                  text-[11px] font-bold uppercase tracking-[0.08em]
                  text-slate-600 dark:text-slate-400
                "
              >
                <span>{t("phone")}</span>

                <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
                  {t("notProvided")}
                </span>
              </label>

              <div className="group relative">
                <div
                  className="
                    pointer-events-none absolute inset-y-0 left-0
                    flex items-center pl-3.5
                    text-slate-400
                    transition-colors
                    group-focus-within:text-blue-600
                    dark:group-focus-within:text-blue-400
                  "
                >
                  <Phone className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </div>

                <input
                  id="staff-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("phonePlaceholder")}
                  className="
                    h-12 w-full rounded-2xl
                    border border-slate-200
                    bg-slate-50/70
                    pl-11 pr-4
                    text-[13px] font-medium
                    text-slate-900
                    outline-none
                    transition-all duration-200
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]
                    dark:border-slate-800
                    dark:bg-slate-900/70
                    dark:text-slate-100
                    dark:placeholder:text-slate-600
                    dark:focus:bg-slate-900
                  "
                  {...register("phone")}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              mt-7 flex flex-col-reverse gap-3
              border-t border-slate-100 pt-5
              sm:flex-row sm:items-center sm:justify-between
              dark:border-slate-800
            "
          >
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-slate-400">
                Secure staff account
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={addStaff.isPending}
                className="
                  h-11 rounded-xl
                  border border-slate-200
                  bg-white
                  px-4
                  text-[12px] font-bold
                  text-slate-600
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-px
                  hover:border-slate-300
                  hover:bg-slate-50
                  hover:text-slate-900
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:border-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                disabled={addStaff.isPending}
                className="
                  group inline-flex h-11 items-center justify-center
                  gap-2 rounded-xl
                  bg-slate-950
                  px-5
                  text-[12px] font-bold
                  text-white
                  shadow-[0_8px_24px_-8px_rgba(15,23,42,0.55)]
                  transition-all duration-200
                  hover:-translate-y-px
                  hover:bg-blue-600
                  hover:shadow-[0_10px_28px_-8px_rgba(37,99,235,0.55)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:bg-white
                  dark:text-slate-950
                  dark:hover:bg-blue-500
                  dark:hover:text-white
                "
              >
                {addStaff.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                    strokeWidth={2}
                  />
                )}

                <span>
                  {addStaff.isPending
                    ? t("creating")
                    : t("createStaffBtn")}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
