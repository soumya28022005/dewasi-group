"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Building2, MapPin, Navigation, Map, Hash, Save, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateDiagnosticCenterProfile } from "@/lib/hooks/useDiagnosticCenter";
import { ProfileField } from "./ProfileField";
import type { DiagnosticCenter, UpdateDiagnosticCenterProfileInput } from "@doctor-contract/shared";

interface ProfileFormProps {
  center: DiagnosticCenter | null | undefined;
}

interface FormValues {
  centerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export function ProfileForm({ center }: ProfileFormProps) {
  const t = useTranslations("DiagnosticCenterProfile");
  const updateProfile = useUpdateDiagnosticCenterProfile();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      centerName: center?.centerName || "",
      address: center?.address || "",
      city: center?.city || "",
      state: center?.state || "",
      pincode: center?.pincode || "",
    },
  });

  // Keep form in sync if center query updates
  useEffect(() => {
    if (center) {
      reset({
        centerName: center.centerName || "",
        address: center.address || "",
        city: center.city || "",
        state: center.state || "",
        pincode: center.pincode || "",
      });
    }
  }, [center, reset]);

  async function onSubmit(data: FormValues) {
    setFormError(null);

    const payload: UpdateDiagnosticCenterProfileInput = {
      centerName: data.centerName.trim(),
      address: data.address.trim() || undefined,
      city: data.city.trim() || undefined,
      state: data.state.trim() || undefined,
      pincode: data.pincode.trim() || undefined,
    };

    try {
      await updateProfile.mutateAsync(payload);
      toast.success(t("updateSuccess"));
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("updateError");
      setFormError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t("detailsTitle")}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("detailsSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        {/* Error Alert */}
        {formError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        {/* Center Name */}
        <ProfileField
          label={t("centerName")}
          icon={Building2}
          placeholder={t("centerNamePlaceholder")}
          error={errors.centerName?.message}
          {...register("centerName", {
            required: t("minCharsError"),
            minLength: {
              value: 2,
              message: t("minCharsError"),
            },
          })}
        />

        {/* Address */}
        <ProfileField
          label={t("address")}
          icon={MapPin}
          placeholder={t("addressPlaceholder")}
          error={errors.address?.message}
          {...register("address")}
        />

        {/* City, State, Pincode in 3 columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ProfileField
            label={t("city")}
            icon={Navigation}
            placeholder={t("cityPlaceholder")}
            error={errors.city?.message}
            {...register("city")}
          />

          <ProfileField
            label={t("state")}
            icon={Map}
            placeholder={t("statePlaceholder")}
            error={errors.state?.message}
            {...register("state")}
          />

          <ProfileField
            label={t("pincode")}
            icon={Hash}
            placeholder={t("pincodePlaceholder")}
            error={errors.pincode?.message}
            {...register("pincode")}
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            disabled={updateProfile.isPending || !isDirty}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{updateProfile.isPending ? t("saving") : t("saveChanges")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
