"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  MapPin,
  Image as ImageIcon,
  Loader2,
  Users,
  UserRound,
  CheckCircle2,
  Clock3,
  Pencil,
  Wifi,
  X,
  AlertTriangle,
  Save,
  RefreshCw,
  History,
  Sparkles,
  Shield,
  ArrowRight,
  Building2,
  TrendingUp,
  Award,
  Activity,
} from "lucide-react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import {
  useClinicProfile,
  useUpdateClinicProfile,
  useUploadClinicLogo,
  useToggleOnlineConsultation,
  useClinicDoctors,
  useClinicReceptionists,
} from "@/lib/hooks/useClinic";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[3.0px] bg-gradient-to-r ${gradient} shadow-lg ${className}`}>
      <div className="rounded-[calc(1rem-1px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const clinicFormSchema = z.object({
  clinicName: z.string().min(3, "Clinic name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{5,6}$/, "Enter a valid 5-6 digit pincode"),
});

type ClinicFormData = z.infer<typeof clinicFormSchema>;

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ClinicOverviewPage() {
  const t = useTranslations("ClinicOverview");
  const tNav = useTranslations("ClinicNav");
  const tStatus = useTranslations("Status");
  const queryClient = useQueryClient();
  const { data: clinic, isLoading } = useClinicProfile();
  const { data: doctors } = useClinicDoctors();
  const { data: receptionists } = useClinicReceptionists();

  const updateProfile = useUpdateClinicProfile();
  const uploadLogo = useUploadClinicLogo();
  const toggleOnline = useToggleOnlineConsultation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ClinicFormData>({
    clinicName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClinicFormData, string>>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    if (clinic) {
      setLastSynced(new Date());
    }
  }, [clinic]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const logActivity = useCallback((action: string) => {
    const timestamp = new Date().toLocaleString();
    setActivityLog((prev) => [`${timestamp} - ${action}`, ...prev].slice(0, 50));
  }, []);

  const startEditing = useCallback(() => {
    if (clinic) {
      setForm({
        clinicName: clinic.clinicName,
        address: clinic.address ?? "",
        city: clinic.city ?? "",
        state: clinic.state ?? "",
        pincode: clinic.pincode ?? "",
      });
      setErrors({});
    }
    setEditing(true);
  }, [clinic]);

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = clinicFormSchema.safeParse(form);
      if (!result.success) {
        const formattedErrors: Partial<Record<keyof ClinicFormData, string>> = {};
        
        result.error.issues.forEach((err) => {
          const path = err.path[0] as keyof ClinicFormData;
          formattedErrors[path] = err.message;
        });
        
        setErrors(formattedErrors);
        toast.error("Please fix the errors before saving");
        return;
      }

      const queryKey = ["clinic", "profile"];
      const previousClinic = queryClient.getQueryData(queryKey);

      try {
        queryClient.setQueryData(queryKey, (old: any) => ({
          ...old,
          ...form,
        }));

        await updateProfile.mutateAsync(form);

        setEditing(false);
        setSaved(true);
        setHasUnsavedChanges(false);
        setErrors({});
        logActivity("Updated clinic profile");
        toast.success("Clinic profile updated successfully!");

        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } catch (error) {
        queryClient.setQueryData(queryKey, previousClinic);
        toast.error("Failed to update profile. Please try again.");
        logActivity("Failed to update clinic profile");
      }
    },
    [form, queryClient, updateProfile, logActivity]
  );

  const handleLogoPick = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      try {
        await uploadLogo.mutateAsync(file);
        toast.success("Logo uploaded successfully!");
        logActivity("Uploaded clinic logo");
      } catch (error) {
        setLogoPreview(null);
        toast.error("Failed to upload logo");
        logActivity("Failed to upload clinic logo");
      }
    },
    [uploadLogo, logActivity]
  );

  const handleToggleOnline = useCallback(async () => {
    if (clinic?.onlineConsultationEnabled) {
      setConfirmToggle(true);
    } else {
      try {
        await toggleOnline.mutateAsync(true);
        toast.success("Online consultation enabled");
        logActivity("Enabled online consultation");
      } catch (error) {
        toast.error("Failed to toggle online consultation");
        logActivity("Failed to toggle online consultation");
      }
    }
  }, [clinic?.onlineConsultationEnabled, toggleOnline, logActivity]);

  const confirmToggleOnline = useCallback(async () => {
    try {
      await toggleOnline.mutateAsync(false);
      toast.success("Online consultation disabled");
      logActivity("Disabled online consultation");
      setConfirmToggle(false);
    } catch (error) {
      toast.error("Failed to toggle online consultation");
      logActivity("Failed to toggle online consultation");
    }
  }, [toggleOnline, logActivity]);

  const handleCancelEdit = useCallback(() => {
    setEditing(false);
    setErrors({});
    setHasUnsavedChanges(false);
  }, []);

  const handleFormChange = useCallback(
    (field: keyof ClinicFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const fullAddress = useMemo(() => {
    return [clinic?.address, clinic?.city, clinic?.state, clinic?.pincode]
      .filter(Boolean)
      .join(", ");
  }, [clinic?.address, clinic?.city, clinic?.state, clinic?.pincode]);

  const logoUrl = useMemo(() => {
    return logoPreview || clinic?.logo || null;
  }, [logoPreview, clinic?.logo]);

  const totalStaff = (doctors?.length ?? 0) + (receptionists?.length ?? 0);

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading || !clinic) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>

        <div className="h-96 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER - Gradient Border
      ====================================================== */}

      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-[#1e3a8a]/30">
                <Building2 className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e40af]">
                {tNav("overview")}
              </p>
              {clinic.isApproved && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1e40af]/10 px-2 py-1 text-[9px] font-bold text-[#1e40af]">
                  <Shield className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("heading")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t("subtitle")}
            </p>

            {lastSynced && (
              <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                <Clock3 className="h-3 w-3" />
                {t("lastSynced")}: {lastSynced.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Activity Log Button */}
            <button
              type="button"
              onClick={() => {
                toast.custom((tToast) => (
                  <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-md border border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-[#1e40af]" />
                        <h3 className="font-bold text-slate-800">{t("activityHistory")}</h3>
                      </div>
                      <button onClick={() => toast.dismiss(tToast.id)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto text-xs space-y-2">
                      {activityLog.length === 0 ? (
                        <p className="text-slate-400">No recent activity</p>
                      ) : (
                        activityLog.map((log, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1e40af] shrink-0" />
                            <p className="text-slate-600">{log}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ));
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:border-[#1e40af]/30 hover:text-[#1e40af] hover:shadow-md"
            >
              <History className="h-4 w-4" />
              History
            </button>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          APPROVAL WARNING - Gradient Border
      ====================================================== */}

      {!clinic.isApproved && (
        <GradientCard gradient="from-[#f59e0b] via-[#f97316] to-[#ef4444]">
          <div className="flex items-start gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-lg shadow-[#f59e0b]/30">
              <Clock3 className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">
                  {tStatus("PENDING")}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f59e0b]/10 px-2 py-0.5 text-[9px] font-bold text-[#f59e0b]">
                  <Sparkles className="h-3 w-3" />
                  Under Review
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Your clinic is not yet approved by admin. It won't be visible in
                doctor search until it is approved.
              </p>
            </div>

            <button className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#f97316] px-3 py-2 text-xs font-bold text-white transition-all hover:shadow-lg">
              Contact Admin
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </GradientCard>
      )}

      {/* =====================================================
          STATS - Each with different gradient
      ====================================================== */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Doctors - Blue Gradient */}
        <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
          <Link href="/clinic/add-patient" className="block h-full transition-transform hover:scale-[1.02]">
            <StatCard
              icon={UserRound}
              label={tNav("doctors")}
              value={doctors?.length ?? 0}
              trend="+2 this month"
            />
          </Link>
        </GradientCard>

        {/* Receptionists - Indigo Gradient */}
        <GradientCard gradient="from-[#4f46e5] via-[#6366f1] to-[#818cf8]">
          <Link href="/clinic/receptionists" className="block h-full transition-transform hover:scale-[1.02]">
            <StatCard
              icon={Users}
              label={tNav("receptionists")}
              value={receptionists?.length ?? 0}
              trend="+1 this month"
            />
          </Link>
        </GradientCard>

        {/* Total Staff - Purple Gradient */}
        <GradientCard gradient="from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]">
          <StatCard
            icon={Activity}
            label="Total Staff"
            value={totalStaff}
            trend="Team growing"
          />
        </GradientCard>

        {/* Verified Status - Emerald Gradient */}
        <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
          <div className="h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-lg shadow-[#059669]/30">
                <Award className="h-5 w-5" />
              </div>

              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                clinic.isApproved 
                  ? "bg-[#059669]/10 text-[#059669]"
                  : "bg-[#f59e0b]/10 text-[#f59e0b]"
              }`}>
                {clinic.isApproved ? "Verified" : "Review"}
              </span>
            </div>

            <p className="mt-4 text-lg font-bold text-slate-900">
              {clinic.isApproved ? "Active" : "Pending"}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {clinic.isApproved
                ? "Your clinic is visible"
                : "Waiting for approval"}
            </p>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          CLINIC PROFILE - Gradient Border
      ====================================================== */}

      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
        <div className="p-5 sm:p-6">
          {/* =================================================
              PROFILE HEADER
          ================================================== */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {/* Logo */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLogo.isPending}
                className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#1e40af]/20 bg-[var(--color-bg-soft)] shadow-sm transition-all duration-200 hover:border-[#1e40af]/40 hover:shadow-md disabled:cursor-not-allowed"
                aria-label="Change clinic logo"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Clinic logo"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Building2 className="h-7 w-7 text-[#1e40af]" />
                )}

                {/* Upload overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {uploadLogo.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Change"
                  )}
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoPick}
              />

              {/* Clinic Info */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                    {clinic.clinicName}
                  </h2>

                  {clinic.isApproved && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#1e40af]/10 px-2 py-1 text-[10px] font-bold text-[#1e40af]">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>

                {fullAddress && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1e40af]" />
                    <span>{fullAddress}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Edit */}
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#1e3a8a]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            )}
          </div>

          {/* =================================================
              EDIT FORM
          ================================================== */}

          {editing && (
            <form
              onSubmit={handleSave}
              className="mt-6 rounded-3xl border border-[#1e40af]/10 bg-gradient-to-b from-[#1e40af]/5 to-white p-5"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af]/10 text-[#1e40af]">
                    <Pencil className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Edit clinic information
                  </p>
                </div>
                <p className="mt-1 ml-10 text-xs text-slate-500">
                  Update the details patients see about your clinic.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Clinic Name" error={errors.clinicName}>
                  <input
                    required
                    value={form.clinicName}
                    onChange={(e) =>
                      handleFormChange("clinicName", e.target.value)
                    }
                    className={`w-full rounded-xl border ${
                      errors.clinicName ? "border-red-300" : "border-slate-200"
                    } bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-[#1e40af]/30 focus:border-[#1e40af] focus:ring-[3px] focus:ring-[#1e40af]/15`}
                    placeholder="Enter clinic name"
                  />
                </Field>

                <Field label="City" error={errors.city}>
                  <input
                    value={form.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.city ? "border-red-300" : "border-slate-200"
                    } bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-[#1e40af]/30 focus:border-[#1e40af] focus:ring-[3px] focus:ring-[#1e40af]/15`}
                    placeholder="Enter city"
                  />
                </Field>

                <Field label="Address" full error={errors.address}>
                  <input
                    value={form.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.address ? "border-red-300" : "border-slate-200"
                    } bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-[#1e40af]/30 focus:border-[#1e40af] focus:ring-[3px] focus:ring-[#1e40af]/15`}
                    placeholder="Street, area, locality"
                  />
                </Field>

                <Field label="State" error={errors.state}>
                  <input
                    value={form.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.state ? "border-red-300" : "border-slate-200"
                    } bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-[#1e40af]/30 focus:border-[#1e40af] focus:ring-[3px] focus:ring-[#1e40af]/15`}
                    placeholder="Enter state"
                  />
                </Field>

                <Field label="Pincode" error={errors.pincode}>
                  <input
                    value={form.pincode}
                    onChange={(e) => handleFormChange("pincode", e.target.value)}
                    className={`w-full rounded-xl border ${
                      errors.pincode ? "border-red-300" : "border-slate-200"
                    } bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-[#1e40af]/30 focus:border-[#1e40af] focus:ring-[3px] focus:ring-[#1e40af]/15`}
                    placeholder="Enter pincode"
                  />
                </Field>
              </div>

              {/* Form actions */}
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1e3a8a]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {updateProfile.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (clinic) {
                      setForm({
                        clinicName: clinic.clinicName,
                        address: clinic.address ?? "",
                        city: clinic.city ?? "",
                        state: clinic.state ?? "",
                        pincode: clinic.pincode ?? "",
                      });
                      setErrors({});
                      setHasUnsavedChanges(false);
                      toast.success("Reset to original values");
                    }
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4 inline mr-1" />
                  Reset
                </button>
              </div>
            </form>
          )}

          {/* Saved Message */}
          {saved && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#059669]/20 bg-[#059669]/10 px-4 py-3 text-xs font-semibold text-[#059669]">
              <CheckCircle2 className="h-4 w-4" />
              Profile updated successfully.
            </div>
          )}

          {/* =================================================
              ONLINE CONSULTATION - Gradient Border
          ================================================== */}

          <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]" className="mt-6">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                  clinic.onlineConsultationEnabled
                    ? "bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-lg shadow-[#059669]/30"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  <Wifi className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      Online Consultation
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                      clinic.onlineConsultationEnabled
                        ? "bg-[#059669]/10 text-[#059669]"
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {clinic.onlineConsultationEnabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Allow patients to book online with your doctors.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={clinic.onlineConsultationEnabled}
                onClick={handleToggleOnline}
                disabled={toggleOnline.isPending}
                className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                  clinic.onlineConsultationEnabled
                    ? "bg-gradient-to-r from-[#059669] to-[#10b981] shadow-lg shadow-[#059669]/30"
                    : "bg-slate-300"
                }`}
              >
                <span className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  clinic.onlineConsultationEnabled ? "translate-x-6" : "translate-x-0"
                }`} />
              </button>
            </div>
          </GradientCard>

          {/* =================================================
              ONLINE CONSULTATION CONFIRMATION DIALOG
          ================================================== */}

          {confirmToggle && (
            <div className="mt-4 rounded-2xl border border-[#ef4444]/20 bg-gradient-to-r from-[#ef4444]/5 to-white p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ef4444]/10 text-[#ef4444]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    Disable Online Consultation?
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    This will prevent patients from booking online appointments
                    with your doctors. Existing appointments will not be affected.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={confirmToggleOnline}
                      disabled={toggleOnline.isPending}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#ef4444] px-4 py-2 text-xs font-bold text-white hover:bg-[#dc2626] disabled:opacity-60"
                    >
                      {toggleOnline.isPending && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      Yes, disable
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmToggle(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================

const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
}) => {
  return (
    <div className="h-full p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white shadow-lg shadow-[#1e40af]/30">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-0.5 text-xs font-semibold text-slate-500">{label}</p>

      {trend && (
        <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#059669]">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </p>
      )}
    </div>
  );
};

// ============================================================
// FORM FIELD COMPONENT
// ============================================================

const Field = ({
  label,
  children,
  full,
  error,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  error?: string;
}) => {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
};

// manual and onine in  doctor 