"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Stethoscope,
  Mail,
  Phone,
  Clock3,
  IndianRupee,
  BriefcaseMedical,
  GraduationCap,
  UserRound,
  CheckCircle2,
  Loader2,
  Activity,
  Award,
  Sparkles,
  TrendingUp,
  Star,
  Shield,
  BookOpen,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useClinicDoctors,
  useAddDoctor,
  useEditDoctor,
  type ClinicDoctor,
} from "@/lib/hooks/useClinic";

const EMPTY_ADD = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  qualification: "",
  experience: "",
  fee: "",
  startTime: "",
};

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400 dark:hover:border-soft-300";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#667eea] via-[#764ba2] to-[#f093fb]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[3px] bg-gradient-to-r ${gradient} shadow-lg ${className}`}>
      <div className="rounded-[calc(1rem-4.5px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// DOCTOR CARD GRADIENTS - Royal Blue & Leaf Green
// ============================================================

const DOCTOR_GRADIENTS = [
  "from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]", // Royal Blue
  "from-[#059669] via-[#10b981] to-[#34d399]", // Leaf Green
  "from-[#1e40af] via-[#3b82f6] to-[#059669]", // Blue → Green
  "from-[#0d9488] via-[#14b8a6] to-[#3b82f6]", // Teal → Blue
  "from-[#1e3a8a] via-[#1d4ed8] to-[#10b981]", // Deep Blue → Green
  "from-[#059669] via-[#0d9488] to-[#1e40af]", // Green → Blue
  "from-[#1e3a8a] via-[#2563eb] to-[#34d399]", // Blue → Light Green
  "from-[#0f766e] via-[#14b8a6] to-[#3b82f6]", // Teal → Blue
  "from-[#1e40af] via-[#059669] to-[#10b981]", // Blue → Green
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ClinicDoctorsPage() {
  const tDoc = useTranslations("ClinicDoctors");
  const tNav = useTranslations("ClinicNav");
  const { data: doctors, isLoading } = useClinicDoctors();
  const addDoctor = useAddDoctor();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_ADD);
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    addDoctor.mutate(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        specialization: form.specialization || undefined,
        qualification: form.qualification || undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        fee: form.fee ? Number(form.fee) : undefined,
        startTime: form.startTime || undefined,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_ADD);
          setShowAdd(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Failed to add doctor");
        },
      }
    );
  }

  function closeAddForm() {
    setShowAdd(false);
    setForm(EMPTY_ADD);
    setError("");
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER - Royal Blue Gradient
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                <Stethoscope className="h-4 w-4" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#1e40af]">
                {tNav("doctors")}
              </span>

              {doctors && doctors.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-2 py-0.5 text-[9px] font-bold text-white">
                  <Sparkles className="h-3 w-3" />
                  {doctors.length} Active
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {tDoc("heading")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {tDoc("subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showAdd) {
                closeAddForm();
              } else {
                setShowAdd(true);
                setError("");
              }
            }}
            className={
              showAdd
                ? "inline-flex items-center justify-center gap-2 rounded-xl border border-[#f5576c]/30 bg-white px-4 py-2.5 text-sm font-bold text-[#f5576c] transition hover:bg-[#f5576c]/5"
                : "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            }
          >
            {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAdd ? tDoc("cancel") : tDoc("addDoctor")}
          </button>
        </div>
      </GradientCard>

      {/* =====================================================
          ADD DOCTOR FORM - Leaf Green Gradient
      ====================================================== */}
      {showAdd && (
        <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
          <form onSubmit={handleAdd} className="p-5 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] text-white shadow-lg shadow-green-500/30">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {tDoc("addNewDoctor")}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {tDoc("addDoctorSub")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={tDoc("name")} required>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter doctor's name"
                />
              </Field>

              <Field label={tDoc("email")} required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                  placeholder="doctor@example.com"
                />
              </Field>

              <Field label={tDoc("password")} required>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClasses}
                  placeholder="Minimum 6 characters"
                />
              </Field>

              <Field label={tDoc("phone")}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClasses}
                  placeholder="Phone number"
                />
              </Field>

              <Field label={tDoc("specialization")}>
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g. Cardiology"
                />
              </Field>

              <Field label={tDoc("qualification")}>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({ ...form, qualification: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="e.g. MBBS, MD"
                />
              </Field>

              <Field label={tDoc("experience")}>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className={`${inputClasses} pr-16`}
                    placeholder="Years"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                    {tDoc("years")}
                  </span>
                </div>
              </Field>

              <Field label={tDoc("fee")}>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    className={`${inputClasses} pl-9`}
                    placeholder="Consultation fee"
                  />
                </div>
              </Field>

              <Field label={tDoc("startTime")}>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  className={inputClasses}
                />
              </Field>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-[#f5576c]/20 bg-gradient-to-r from-[#f5576c]/5 to-white px-4 py-3 text-sm font-medium text-[#f5576c]">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={addDoctor.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addDoctor.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {addDoctor.isPending ? tDoc("creating") : tDoc("createAccount")}
              </button>

              <button
                type="button"
                onClick={closeAddForm}
                className="rounded-xl border border-[#1e40af]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#1e40af] transition hover:bg-[#1e40af]/5"
              >
                {tDoc("cancel")}
              </button>
            </div>
          </form>
        </GradientCard>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}
      {isLoading && (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.04)] dark:border-soft-300 dark:bg-surface">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--color-primary)] border-t-transparent" />
            <p className="text-sm font-medium text-gray-500 dark:text-ink-500">
              {tDoc("loadingDoctors")}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!isLoading && (!doctors || doctors.length === 0) && (
        <GradientCard gradient="from-[#f093fb] via-[#f5576c] to-[#fda085]">
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white shadow-lg shadow-pink-500/30">
              <Stethoscope className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-800">
              {tDoc("noDoctorsTitle")}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {tDoc("noDoctorsSub")}
            </p>

            {!showAdd && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                {tDoc("addDoctor")}
              </button>
            )}
          </div>
        </GradientCard>
      )}

      {/* =====================================================
          DOCTOR LIST - 1 column mobile, 2 tablet, 3 desktop
      ====================================================== */}
      {!isLoading && doctors && doctors.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">{tDoc("yourDoctors")}</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {doctors.length} {tDoc("doctorsAdded")}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1 text-[10px] font-bold text-white">
              <TrendingUp className="h-3 w-3" />
              {doctors.filter(d => d.user.isActive).length} Active
            </div>
          </div>

          {/* ✅ FIXED: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {doctors.map((doctor, index) => (
              <DoctorRow 
                key={doctor.id} 
                doctor={doctor} 
                gradient={DOCTOR_GRADIENTS[index % DOCTOR_GRADIENTS.length]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Form Field Component
// ============================================================
function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

// ============================================================
// Doctor Card Component - Each with different gradient
// ============================================================
function DoctorRow({ doctor, gradient }: { doctor: ClinicDoctor; gradient: string }) {
  const tDoc = useTranslations("ClinicDoctors");
  const editDoctor = useEditDoctor();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    specialization: doctor.specialization ?? "",
    qualification: doctor.qualification ?? "",
    experience: doctor.experience?.toString() ?? "",
    fee: doctor.fee?.toString() ?? "",
    startTime: doctor.startTime ?? "",
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    editDoctor.mutate(
      {
        doctorId: doctor.id,
        specialization: form.specialization || undefined,
        qualification: form.qualification || undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        fee: form.fee ? Number(form.fee) : undefined,
        startTime: form.startTime || undefined,
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  }

  return (
    <GradientCard gradient={gradient}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
              <span className="text-sm font-bold">
                {getInitials(doctor.user.name)}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {doctor.user.name}
                </p>

                {doctor.user.isActive ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-gradient-to-r from-[#f5576c] to-[#fda085] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Inactive
                  </span>
                )}
              </div>

              <div className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-slate-500">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#1e40af]" />
                <span className="truncate">{doctor.user.email}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className={
              editing
                ? "inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#f5576c]/30 bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#f5576c]"
                : "inline-flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md shadow-blue-500/30"
            }
          >
            {editing ? (
              <X className="h-3 w-3" />
            ) : (
              <Pencil className="h-3 w-3" />
            )}
            {editing ? tDoc("close") : tDoc("edit")}
          </button>
        </div>

        {/* Info Grid - 2 columns always */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoItem
            icon={BriefcaseMedical}
            label={tDoc("specialization")}
            value={doctor.specialization || tDoc("notSet")}
          />
          <InfoItem
            icon={GraduationCap}
            label={tDoc("qualification")}
            value={doctor.qualification || tDoc("notSet")}
          />
          <InfoItem
            icon={Clock3}
            label={tDoc("startTime")}
            value={doctor.startTime || tDoc("notSet")}
          />
          <InfoItem
            icon={IndianRupee}
            label={tDoc("fee")}
            value={doctor.fee != null ? `₹${doctor.fee}` : tDoc("notSet")}
          />
        </div>

        {/* Qualification Highlight - Deep */}
        {doctor.qualification && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-3 py-2.5 shadow-md shadow-blue-500/30">
            <BookOpen className="h-4 w-4 text-white" />
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-blue-200">
                {tDoc("qualification")}
              </p>
              <p className="truncate text-xs font-bold text-white">
                {doctor.qualification}
              </p>
            </div>
          </div>
        )}

        {/* Experience Banner */}
        {doctor.experience != null && (
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#059669]/5 to-[#10b981]/5 px-3 py-2 text-[11px] font-medium text-slate-600">
            <Award className="h-4 w-4 text-[#059669]" />
            {doctor.experience} {tDoc("yearsExperience")}
          </div>
        )}

        {/* =================================================
            EDIT FORM
        ================================================== */}
        {editing && (
          <form
            onSubmit={handleSave}
            className="mt-4 border-t border-[#1e40af]/10 pt-4"
          >
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-800">
                {tDoc("editDoctorDetails")}
              </h3>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {tDoc("editDoctorSub")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label={tDoc("specialization")}>
                  <input
                    value={form.specialization}
                    onChange={(e) =>
                      setForm({ ...form, specialization: e.target.value })
                    }
                    className={`${inputClasses} px-3 py-2 text-xs`}
                    placeholder="e.g. Cardiology"
                  />
                </Field>

                <Field label={tDoc("qualification")}>
                  <input
                    value={form.qualification}
                    onChange={(e) =>
                      setForm({ ...form, qualification: e.target.value })
                    }
                    className={`${inputClasses} px-3 py-2 text-xs`}
                    placeholder="e.g. MBBS, MD"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Field label={tDoc("experience")}>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                      className={`${inputClasses} px-3 py-2 pr-8 text-xs`}
                      placeholder="Years"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-medium text-gray-400">
                      {tDoc("years")}
                    </span>
                  </div>
                </Field>

                <Field label={tDoc("fee")}>
                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min={0}
                      value={form.fee}
                      onChange={(e) => setForm({ ...form, fee: e.target.value })}
                      className={`${inputClasses} px-3 py-2 pl-6 text-xs`}
                      placeholder="Fee"
                    />
                  </div>
                </Field>
              </div>

              <Field label={tDoc("startTime")}>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  className={`${inputClasses} px-3 py-2 text-xs`}
                />
              </Field>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                disabled={editDoctor.isPending}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-3 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editDoctor.isPending && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {editDoctor.isPending ? tDoc("saving") : tDoc("saveChanges")}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-[#1e40af]/30 bg-white px-3 py-2 text-xs font-semibold text-[#1e40af] transition hover:bg-[#1e40af]/5"
              >
                {tDoc("cancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    </GradientCard>
  );
}

// ============================================================
// Info Item Component
// ============================================================
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-2.5 transition-colors hover:border-[#1e40af]/20 hover:bg-[#1e40af]/5">
      <div className="flex items-center gap-1">
        <Icon className="h-3 w-3 text-[#1e40af]" />
        <span className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      <p className="mt-1 truncate text-[11px] font-bold text-slate-800">{value}</p>
    </div>
  );
}

// ============================================================
// Utility Component
// ============================================================
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}