"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Map, 
  Hash, 
  Save, 
  Loader2, 
  AlertCircle, 
  Home, 
  Phone, 
  MessageCircle, 
  Link2, 
  FileText 
} from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateDiagnosticCenterProfile } from "@/lib/hooks/useDiagnosticCenter";
import { ProfileField } from "./ProfileField";
import type { DiagnosticCenter } from "@doctor-contract/shared";

interface ProfileFormProps {
  center: DiagnosticCenter | null | undefined;
}

interface FormValues {
  centerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl: string;
  authorizationNote: string;
  hasHomeService: boolean; 
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
      phone: center?.phone || "",
      whatsapp: center?.whatsapp || "",
      googleMapsUrl: center?.googleMapsUrl || "",
      authorizationNote: center?.authorizationNote || "",
      hasHomeService: center?.hasHomeService ?? false, 
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
        phone: center.phone || "",
        whatsapp: center.whatsapp || "",
        googleMapsUrl: center.googleMapsUrl || "",
        authorizationNote: center.authorizationNote || "",
        hasHomeService: center.hasHomeService ?? false, 
      });
    }
  }, [center, reset]);

  async function onSubmit(data: FormValues) {
    setFormError(null);

    // 🟢 নতুন ফিল্ডগুলো পেলোডে পাঠানো হচ্ছে
    const payload = {
      centerName: data.centerName.trim(),
      address: data.address.trim() || undefined,
      city: data.city.trim() || undefined,
      state: data.state.trim() || undefined,
      pincode: data.pincode.trim() || undefined,
      phone: data.phone.trim() || undefined,
      whatsapp: data.whatsapp.trim() || undefined,
      googleMapsUrl: data.googleMapsUrl.trim() || undefined,
      authorizationNote: data.authorizationNote.trim() || undefined,
      hasHomeService: data.hasHomeService, 
    } as any; 

    try {
      await updateProfile.mutateAsync(payload);
      // Reset the form with the new data so isDirty becomes false
      reset(data);
      toast.success(t("updateSuccess") || "Profile updated successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("updateError") || "Failed to update profile";
      setFormError(msg);
      toast.error(msg);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t("detailsTitle") || "Center Details"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("detailsSubtitle") || "Update your diagnostic center's core information, contact details, and services."}
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
          label={t("centerName") || "Center Name"}
          icon={Building2}
          placeholder={t("centerNamePlaceholder") || "e.g. City Diagnostic Lab"}
          error={errors.centerName?.message}
          {...register("centerName", {
            required: t("minCharsError") || "Required",
            minLength: {
              value: 2,
              message: t("minCharsError") || "At least 2 characters",
            },
          })}
        />

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileField
            label="Phone Number"
            icon={Phone}
            placeholder="e.g. +8801700000000"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <ProfileField
            label="WhatsApp Number"
            icon={MessageCircle}
            placeholder="e.g. 8801700000000"
            error={errors.whatsapp?.message}
            {...register("whatsapp")}
          />
        </div>

        {/* Google Maps URL */}
        <ProfileField
          label="Google Maps URL"
          icon={Link2}
          placeholder="https://maps.app.goo.gl/..."
          error={errors.googleMapsUrl?.message}
          {...register("googleMapsUrl")}
        />

        {/* Authorization Note */}
        <ProfileField
          label="Authorization Note (Optional)"
          icon={FileText}
          placeholder='e.g. "আমরা লালবাবা থেকে করাই"'
          error={errors.authorizationNote?.message}
          {...register("authorizationNote")}
        />

        {/* Address */}
        <ProfileField
          label={t("address") || "Address"}
          icon={MapPin}
          placeholder={t("addressPlaceholder") || "Street address"}
          error={errors.address?.message}
          {...register("address")}
        />

        {/* City, State, Pincode in 3 columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ProfileField
            label={t("city") || "City"}
            icon={Navigation}
            placeholder={t("cityPlaceholder") || "City"}
            error={errors.city?.message}
            {...register("city")}
          />

          <ProfileField
            label={t("state") || "State"}
            icon={Map}
            placeholder={t("statePlaceholder") || "State"}
            error={errors.state?.message}
            {...register("state")}
          />

          <ProfileField
            label={t("pincode") || "Pincode"}
            icon={Hash}
            placeholder={t("pincodePlaceholder") || "Pincode"}
            error={errors.pincode?.message}
            {...register("pincode")}
          />
        </div>

        {/* 🟢 Home Service Toggle Checkbox */}
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasHomeService"
              {...register("hasHomeService")}
              className="h-5 w-5 cursor-pointer rounded border-slate-300 text-purple-600 focus:ring-purple-600 dark:border-slate-600 dark:bg-slate-800"
            />
            <label
              htmlFor="hasHomeService"
              className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Provide Home Sample Collection
            </label>
          </div>
          <p className="ml-8 mt-1 text-xs text-slate-500">
            Check this if your diagnostic center collects samples directly from the patient's home.
          </p>
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
            <span>{updateProfile.isPending ? (t("saving") || "Saving...") : (t("saveChanges") || "Save Changes")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}