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
  FileText,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useUpdateDiagnosticCenterProfile,
} from "@/lib/hooks/useDiagnosticCenter";

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

export function ProfileForm({
  center,
}: ProfileFormProps) {
  const t = useTranslations("DiagnosticCenterProfile");

  const updateProfile =
    useUpdateDiagnosticCenterProfile();

  const [formError, setFormError] =
    useState<string | null>(null);

  /* ==========================================================
     FORM
  ========================================================== */

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<FormValues>({
    defaultValues: {
      centerName: center?.centerName || "",
      address: center?.address || "",
      city: center?.city || "",
      state: center?.state || "",
      pincode: center?.pincode || "",
      phone: center?.phone || "",
      whatsapp: center?.whatsapp || "",
      googleMapsUrl:
        center?.googleMapsUrl || "",
      authorizationNote:
        center?.authorizationNote || "",
      hasHomeService:
        center?.hasHomeService ?? false,
    },
  });

  /* ==========================================================
     SYNC FORM WITH CENTER
  ========================================================== */

  useEffect(() => {
    if (!center) return;

    reset({
      centerName: center.centerName || "",
      address: center.address || "",
      city: center.city || "",
      state: center.state || "",
      pincode: center.pincode || "",
      phone: center.phone || "",
      whatsapp: center.whatsapp || "",
      googleMapsUrl:
        center.googleMapsUrl || "",
      authorizationNote:
        center.authorizationNote || "",
      hasHomeService:
        center.hasHomeService ?? false,
    });
  }, [center, reset]);

  /* ==========================================================
     SUBMIT
  ========================================================== */

  async function onSubmit(data: FormValues) {
    setFormError(null);

    const payload = {
      centerName: data.centerName.trim(),

      address:
        data.address.trim() || undefined,

      city:
        data.city.trim() || undefined,

      state:
        data.state.trim() || undefined,

      pincode:
        data.pincode.trim() || undefined,

      phone:
        data.phone.trim() || undefined,

      whatsapp:
        data.whatsapp.trim() || undefined,

      googleMapsUrl:
        data.googleMapsUrl.trim() || undefined,

      authorizationNote:
        data.authorizationNote.trim() || undefined,

      hasHomeService:
        data.hasHomeService,
    } as any;

    try {
      await updateProfile.mutateAsync(payload);

      reset(data);

      toast.success(
        t("updateSuccess") ||
          "Profile updated successfully!",
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        t("updateError") ||
        "Failed to update profile";

      setFormError(msg);

      toast.error(msg);
    }
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#252a67] via-[#3b4a8f] to-[#14B8A6] p-[2.5px] shadow-[0_4px_18px_rgba(15,23,42,0.045)]">

      <div className="rounded-[14px] bg-white p-4 sm:p-5 lg:p-6 dark:bg-slate-900">

        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h2 className="text-sm font-bold tracking-tight text-slate-950 sm:text-base dark:text-white">
                {t("detailsTitle") ||
                  "Center Details"}
              </h2>

              <span className="h-1 w-1 rounded-full bg-[#14B8A6]" />

            </div>

            <p className="mt-1 max-w-2xl text-[10px] leading-relaxed text-slate-500 sm:text-[11px] dark:text-slate-400">
              {t("detailsSubtitle") ||
                "Update your diagnostic center's core information, contact details, and services."}
            </p>

            <div className="mt-2 h-[2px] w-8 rounded-full bg-gradient-to-r from-[#252a67] to-[#14B8A6]" />

          </div>

          {/* Dirty indicator */}

          {isDirty && (
            <div className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[9px] font-semibold text-amber-700 sm:flex dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">

              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

              <span>
                Unsaved changes
              </span>

            </div>
          )}

        </div>


        {/* ====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 space-y-5"
        >

          {/* ==================================================
              FORM ERROR
          =================================================== */}

          {formError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/70 px-3.5 py-3 dark:border-rose-900/40 dark:bg-rose-950/20">

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">

                <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />

              </div>

              <div className="min-w-0">

                <p className="text-[10px] font-bold text-rose-800 dark:text-rose-300">
                  Unable to save changes
                </p>

                <p className="mt-0.5 text-[9px] leading-relaxed text-rose-700 dark:text-rose-400">
                  {formError}
                </p>

              </div>

            </div>
          )}


          {/* ==================================================
              BASIC INFORMATION
          =================================================== */}

          <div>

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#252a67]/[0.07] dark:bg-[#252a67]/30">

                <Building2 className="h-3 w-3 text-[#252a67] dark:text-indigo-300" />

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                  Basic Information
                </p>

                <div className="mt-1 h-[2px] w-5 rounded-full bg-[#14B8A6]" />

              </div>

            </div>

            <ProfileField
              label={
                t("centerName") ||
                "Center Name"
              }
              icon={Building2}
              placeholder={
                t(
                  "centerNamePlaceholder",
                ) ||
                "e.g. City Diagnostic Lab"
              }
              error={
                errors.centerName?.message
              }
              {...register("centerName", {
                required:
                  t("minCharsError") ||
                  "Required",

                minLength: {
                  value: 2,
                  message:
                    t("minCharsError") ||
                    "At least 2 characters",
                },
              })}
            />

          </div>


          {/* ==================================================
              CONTACT INFORMATION
          =================================================== */}

          <div>

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3b4a8f]/[0.08] dark:bg-[#3b4a8f]/30">

                <Phone className="h-3 w-3 text-[#3b4a8f] dark:text-indigo-300" />

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                  Contact Information
                </p>

                <div className="mt-1 h-[2px] w-5 rounded-full bg-[#14B8A6]" />

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <ProfileField
                label="Phone Number"
                icon={Phone}
                placeholder="+91 98765 43210"
                error={
                  errors.phone?.message
                }
                {...register("phone")}
              />

              <ProfileField
                label="WhatsApp Number"
                icon={MessageCircle}
                placeholder="+91 98765 43210"
                error={
                  errors.whatsapp?.message
                }
                {...register("whatsapp")}
              />

            </div>

          </div>


          {/* ==================================================
              ONLINE PRESENCE
          =================================================== */}

          <div>

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">

                <Link2 className="h-3 w-3 text-teal-600 dark:text-teal-400" />

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                  Online Presence
                </p>

                <div className="mt-1 h-[2px] w-5 rounded-full bg-[#14B8A6]" />

              </div>

            </div>

            <div className="space-y-4">

              <ProfileField
                label="Google Maps URL"
                icon={Link2}
                placeholder="https://maps.app.goo.gl/..."
                error={
                  errors.googleMapsUrl?.message
                }
                {...register(
                  "googleMapsUrl",
                )}
              />

              <ProfileField
                label="Authorization Note (Optional)"
                icon={FileText}
                placeholder='e.g. "Authorized diagnostic partner"'
                error={
                  errors.authorizationNote
                    ?.message
                }
                {...register(
                  "authorizationNote",
                )}
              />

            </div>

          </div>


          {/* ==================================================
              LOCATION
          =================================================== */}

          <div>

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">

                <MapPin className="h-3 w-3 text-[#3b4a8f] dark:text-teal-400" />

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                  Location Details
                </p>

                <div className="mt-1 h-[2px] w-5 rounded-full bg-[#14B8A6]" />

              </div>

            </div>

            <div className="space-y-4">

              <ProfileField
                label={
                  t("address") ||
                  "Address"
                }
                icon={MapPin}
                placeholder={
                  t(
                    "addressPlaceholder",
                  ) ||
                  "Street address"
                }
                error={
                  errors.address?.message
                }
                {...register("address")}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <ProfileField
                  label={
                    t("city") || "City"
                  }
                  icon={Navigation}
                  placeholder={
                    t(
                      "cityPlaceholder",
                    ) || "City"
                  }
                  error={
                    errors.city?.message
                  }
                  {...register("city")}
                />

                <ProfileField
                  label={
                    t("state") || "State"
                  }
                  icon={Map}
                  placeholder={
                    t(
                      "statePlaceholder",
                    ) || "State"
                  }
                  error={
                    errors.state?.message
                  }
                  {...register("state")}
                />

                <ProfileField
                  label={
                    t("pincode") ||
                    "Pincode"
                  }
                  icon={Hash}
                  placeholder={
                    t(
                      "pincodePlaceholder",
                    ) || "Pincode"
                  }
                  error={
                    errors.pincode?.message
                  }
                  {...register(
                    "pincode",
                  )}
                />

              </div>

            </div>

          </div>


          {/* ==================================================
              HOME COLLECTION
          =================================================== */}

          <div>

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">

                <Home className="h-3 w-3 text-teal-600 dark:text-teal-400" />

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">
                  Home Collection
                </p>

                <div className="mt-1 h-[2px] w-5 rounded-full bg-[#14B8A6]" />

              </div>

            </div>


            <label
              htmlFor="hasHomeService"
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50/30 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-teal-900/50 dark:hover:bg-teal-950/10"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/30">

                  <Home className="h-4 w-4 text-teal-600 dark:text-teal-400" />

                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold text-slate-800 sm:text-[11px] dark:text-slate-200">
                    Provide Home Sample Collection
                  </p>

                  <p className="mt-0.5 max-w-xl text-[9px] leading-relaxed text-slate-500 sm:text-[10px] dark:text-slate-400">
                    Allow patients to request sample collection directly from their home.
                  </p>

                </div>

              </div>


              {/* Toggle */}

              <div className="relative shrink-0">

                <input
                  type="checkbox"
                  id="hasHomeService"
                  {...register(
                    "hasHomeService",
                  )}
                  className="peer sr-only"
                />

                <div className="h-6 w-11 rounded-full border border-slate-300 bg-slate-200 transition-all peer-checked:border-teal-600 peer-checked:bg-gradient-to-r peer-checked:from-[#3b4a8f] peer-checked:to-[#14B8A6] peer-focus-visible:ring-4 peer-focus-visible:ring-teal-500/15 dark:border-slate-600 dark:bg-slate-700" />

                <div className="pointer-events-none absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5">

                  <CheckCircle2 className="h-2.5 w-2.5 text-transparent transition-colors peer-checked:text-teal-600" />

                </div>

              </div>

            </label>

          </div>


          {/* ==================================================
              ACTION FOOTER
          =================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

            <div className="flex items-center gap-2">

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDirty
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />

              <p className="text-[9px] text-slate-400 dark:text-slate-500">

                {isDirty
                  ? "You have unsaved changes"
                  : "All changes are saved"}

              </p>

            </div>


            <button
              type="submit"
              disabled={
                updateProfile.isPending ||
                !isDirty
              }
              className="group inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#252a67] via-[#3b4a8f] to-[#3b4a8f] px-5 text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(37,42,103,0.16)] transition-all duration-200 hover:shadow-[0_5px_16px_rgba(37,42,103,0.22)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none sm:w-auto"
            >

              {updateProfile.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              )}

              <span>
                {updateProfile.isPending
                  ? t("saving") ||
                    "Saving..."
                  : t("saveChanges") ||
                    "Save Changes"}
              </span>

            </button>

          </div>

        </form>

      </div>
    </section>
  );
}