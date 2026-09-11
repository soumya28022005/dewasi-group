
"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useChangeDiagnosticCenterStaffPassword,
} from "@/lib/hooks/useDiagnosticCenter";
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
  const changePassword =
    useChangeDiagnosticCenterStaffPassword();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  if (!isOpen || !staff) return null;

  const staffName =
    staff.name || staff.user?.name || t("name");

  const staffEmail =
    staff.email || staff.user?.email || "";

  const targetUserId =
    staff.user?.id || staff.userId || staff.id;

  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const passwordLengthValid =
    newPassword.length >= 6;

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
      const msg =
        err?.response?.data?.message ||
        t("passwordError");

      setServerError(msg);
      toast.error(msg);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-950/70
        p-4
        backdrop-blur-md
        animate-in fade-in duration-200
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-modal-title"
    >
      <div
        className="
          relative
          w-full max-w-lg
          overflow-hidden
          rounded-[28px]
          border border-white/70
          bg-white
          shadow-[0_32px_100px_-24px_rgba(15,23,42,0.50)]
          animate-in
          zoom-in-95
          slide-in-from-bottom-2
          duration-300
          dark:border-slate-700/70
          dark:bg-slate-950
          dark:shadow-[0_32px_100px_-24px_rgba(0,0,0,0.85)]
        "
      >
        {/* Top Accent */}
        <div
          className="
            absolute inset-x-0 top-0 h-1
            bg-gradient-to-r
            from-indigo-600
            via-violet-500
            to-blue-500
          "
        />

        {/* ================= HEADER ================= */}
        <div
          className="
            border-b
            border-slate-100
            px-7
            pb-6
            pt-7
            dark:border-slate-800
          "
        >
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-2xl
                  border border-violet-100
                  bg-gradient-to-br
                  from-violet-50
                  to-indigo-50
                  text-violet-600
                  shadow-sm
                  dark:border-violet-900/60
                  dark:from-violet-950/60
                  dark:to-indigo-950/40
                  dark:text-violet-400
                "
              >
                <KeyRound
                  className="h-5 w-5"
                  strokeWidth={2.2}
                />
              </div>

              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <h2
                    id="change-password-modal-title"
                    className="
                      text-[17px]
                      font-bold
                      tracking-[-0.02em]
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {t("modalPasswordTitle")}
                  </h2>

                  <span
                    className="
                      hidden
                      rounded-full
                      border
                      border-violet-100
                      bg-violet-50
                      px-2
                      py-0.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-violet-600
                      sm:inline-flex
                      dark:border-violet-900/50
                      dark:bg-violet-950/40
                      dark:text-violet-400
                    "
                  >
                    Security
                  </span>
                </div>

                <p
                  className="
                    max-w-sm
                    text-[12px]
                    leading-5
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {t("modalPasswordDesc")}
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              disabled={changePassword.isPending}
              aria-label="Close dialog"
              className="
                group
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                text-slate-400
                transition-all duration-200
                hover:bg-slate-50
                hover:text-slate-700
                disabled:pointer-events-none
                dark:hover:bg-slate-900
                dark:hover:text-slate-200
              "
            >
              <X
                className="
                  h-[18px] w-[18px]
                  transition-transform duration-200
                  group-hover:rotate-90
                "
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-7 pb-7 pt-6"
        >
          {/* Staff Identity */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-gradient-to-br
              from-slate-50
              via-white
              to-indigo-50/40
              p-4
              shadow-sm
              dark:border-slate-800
              dark:from-slate-900
              dark:via-slate-900
              dark:to-indigo-950/20
            "
          >
            <div
              className="
                absolute right-0 top-0
                h-20 w-20
                rounded-full
                bg-indigo-100/50
                blur-2xl
                dark:bg-indigo-900/20
              "
            />

            <div className="relative flex items-center gap-3.5">
              {/* Avatar */}
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-indigo-100
                  bg-white
                  text-indigo-600
                  shadow-sm
                  dark:border-indigo-900/50
                  dark:bg-slate-800
                  dark:text-indigo-400
                "
              >
                <User
                  className="h-[18px] w-[18px]"
                  strokeWidth={1.9}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    mb-0.5
                    truncate
                    text-[13px]
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {staffName}
                </p>

                <p
                  className="
                    truncate
                    text-[11px]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {staffEmail}
                </p>
              </div>

              <div
                className="
                  hidden
                  items-center gap-1.5
                  rounded-full
                  border
                  border-emerald-100
                  bg-emerald-50
                  px-2.5 py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-emerald-700
                  sm:flex
                  dark:border-emerald-900/50
                  dark:bg-emerald-950/30
                  dark:text-emerald-400
                "
              >
                <ShieldCheck className="h-3 w-3" />
                Staff
              </div>
            </div>
          </div>

          {/* Error */}
          {serverError && (
            <div
              className="
                mt-5
                flex items-start gap-3
                rounded-2xl
                border border-rose-200
                bg-rose-50/80
                px-4 py-3.5
                shadow-sm
                dark:border-rose-900/60
                dark:bg-rose-950/20
              "
            >
              <div
                className="
                  mt-0.5
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-rose-100
                  dark:bg-rose-950/60
                "
              >
                <AlertCircle
                  className="
                    h-4 w-4
                    text-rose-600
                    dark:text-rose-400
                  "
                />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[11px]
                    font-bold
                    text-rose-900
                    dark:text-rose-300
                  "
                >
                  Password update failed
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    leading-5
                    text-rose-700
                    dark:text-rose-400
                  "
                >
                  {serverError}
                </p>
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="mt-6 space-y-5">
            {/* New Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="new-password"
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  {t("modalPasswordTitle")}
                </label>

                <span
                  className="
                    flex items-center gap-1
                    text-[10px]
                    font-medium
                    normal-case
                    tracking-normal
                    text-slate-400
                  "
                >
                  <ShieldCheck className="h-3 w-3" />
                  Secure
                </span>
              </div>

              <div className="group relative">
                <div
                  className="
                    pointer-events-none
                    absolute inset-y-0 left-0
                    flex items-center pl-3.5
                    text-slate-400
                    transition-colors
                    group-focus-within:text-indigo-600
                    dark:group-focus-within:text-indigo-400
                  "
                >
                  <Lock
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </div>

                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder={t("newPasswordPlaceholder")}
                  className={`
                    h-12
                    w-full
                    rounded-2xl
                    border
                    bg-slate-50/70
                    pl-11
                    pr-12
                    text-[13px]
                    font-medium
                    text-slate-900
                    outline-none
                    transition-all duration-200
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]
                    dark:bg-slate-900/70
                    dark:text-slate-100
                    dark:placeholder:text-slate-600
                    dark:focus:bg-slate-900
                    dark:focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]
                    ${
                      errors.newPassword
                        ? "border-rose-300 focus:border-rose-500 dark:border-rose-800"
                        : "border-slate-200 focus:border-indigo-500 dark:border-slate-800 dark:focus:border-indigo-500"
                    }
                  `}
                  {...register("newPassword", {
                    required: t("passwordMinLength"),
                    minLength: {
                      value: 6,
                      message: t("passwordMinLength"),
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (value) => !value,
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex h-8 w-8
                    -translate-y-1/2
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
                  {showNewPassword ? (
                    <EyeOff
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </div>

              {/* Password Status */}
              {newPassword.length > 0 &&
                !errors.newPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className={`
                            h-1
                            w-7
                            rounded-full
                            transition-colors
                            ${
                              passwordLengthValid
                                ? "bg-emerald-500"
                                : item === 1
                                  ? "bg-amber-400"
                                  : "bg-slate-200 dark:bg-slate-800"
                            }
                          `}
                        />
                      ))}
                    </div>

                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-slate-400
                      "
                    >
                      {passwordLengthValid
                        ? "Password meets minimum length"
                        : "Use at least 6 characters"}
                    </span>
                  </div>
                )}

              {errors.newPassword && (
                <p
                  className="
                    mt-1.5
                    pl-1
                    text-[10px]
                    font-semibold
                    text-rose-600
                    dark:text-rose-400
                  "
                >
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="
                  mb-2 block
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {t("confirmPasswordPlaceholder")}
              </label>

              <div className="group relative">
                <div
                  className="
                    pointer-events-none
                    absolute inset-y-0 left-0
                    flex items-center pl-3.5
                    text-slate-400
                    transition-colors
                    group-focus-within:text-indigo-600
                    dark:group-focus-within:text-indigo-400
                  "
                >
                  <Lock
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />
                </div>

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  className={`
                    h-12
                    w-full
                    rounded-2xl
                    border
                    bg-slate-50/70
                    pl-11
                    pr-12
                    text-[13px]
                    font-medium
                    text-slate-900
                    outline-none
                    transition-all duration-200
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]
                    dark:bg-slate-900/70
                    dark:text-slate-100
                    dark:placeholder:text-slate-600
                    dark:focus:bg-slate-900
                    ${
                      errors.confirmPassword
                        ? "border-rose-300 focus:border-rose-500 dark:border-rose-800"
                        : "border-slate-200 focus:border-indigo-500 dark:border-slate-800 dark:focus:border-indigo-500"
                    }
                  `}
                  {...register("confirmPassword", {
                    required: t("passwordMinLength"),
                    validate: (value) =>
                      value === watch("newPassword") ||
                      t("passwordsDoNotMatch"),
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value,
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex h-8 w-8
                    -translate-y-1/2
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
                  {showConfirmPassword ? (
                    <EyeOff
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      className="h-4 w-4"
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </div>

              {/* Match Indicator */}
              {confirmPassword.length > 0 &&
                !errors.confirmPassword && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <CheckCircle2
                      className="
                        h-3.5 w-3.5
                        text-emerald-500
                      "
                    />

                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}

              {errors.confirmPassword && (
                <p
                  className="
                    mt-1.5
                    pl-1
                    text-[10px]
                    font-semibold
                    text-rose-600
                    dark:text-rose-400
                  "
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div
            className="
              mt-7
              flex flex-col-reverse
              gap-3
              border-t
              border-slate-100
              pt-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              dark:border-slate-800
            "
          >
            <div className="hidden items-center gap-2 sm:flex">
              <div
                className="
                  flex h-6 w-6
                  items-center justify-center
                  rounded-lg
                  bg-emerald-50
                  dark:bg-emerald-950/40
                "
              >
                <ShieldCheck
                  className="
                    h-3.5 w-3.5
                    text-emerald-600
                    dark:text-emerald-400
                  "
                />
              </div>

              <span
                className="
                  text-[10px]
                  font-medium
                  text-slate-400
                "
              >
                Secure account update
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              {/* Cancel */}
              <button
                type="button"
                onClick={handleClose}
                disabled={changePassword.isPending}
                className="
                  h-11
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-[12px]
                  font-bold
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

              {/* Update */}
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="
                  group
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-950
                  px-5
                  text-[12px]
                  font-bold
                  text-white
                  shadow-[0_8px_24px_-8px_rgba(15,23,42,0.55)]
                  transition-all duration-200
                  hover:-translate-y-px
                  hover:bg-indigo-600
                  hover:shadow-[0_10px_28px_-8px_rgba(79,70,229,0.55)]
                  active:translate-y-0
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:bg-white
                  dark:text-slate-950
                  dark:hover:bg-indigo-500
                  dark:hover:text-white
                "
              >
                {changePassword.isPending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                  />
                ) : (
                  <KeyRound
                    className="
                      h-4 w-4
                      transition-transform
                      duration-200
                      group-hover:scale-110
                    "
                    strokeWidth={2}
                  />
                )}

                <span>
                  {changePassword.isPending
                    ? t("updating")
                    : t("updatePasswordBtn")}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}