"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Pencil,
  Search,
  Stethoscope,
  Mail,
  Clock3,
  IndianRupee,
  BriefcaseMedical,
  GraduationCap,
  UserRound,
  CheckCircle2,
  Loader2,
  Award,
  TrendingUp,
  BookOpen,
  Camera,
} from "lucide-react";

import { useTranslations } from "next-intl";

import {
  useClinicDoctors,
  useAddDoctor,
  useEditDoctor,
  type ClinicDoctor,
} from "@/lib/hooks/useClinic";

// ============================================================
// FORM
// ============================================================

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

// ============================================================
// INPUT
// ============================================================

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400";

// ============================================================
// BRAND
// ============================================================

const PRIMARY_GRADIENT =
  "from-[#252a67] via-[#3b4a8f] to-[#14B8A6]";

const GREEN_GRADIENT =
  "from-[#047857] via-[#059669] to-[#14B8A6]";

// ============================================================
// GRADIENT CARD
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = PRIMARY_GRADIENT,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div
      className={`
        rounded-[22px]
        bg-gradient-to-r
        ${gradient}
        p-[3px]
        shadow-[0_10px_35px_-22px_rgba(37,42,103,0.55)]
        ${className}
      `}
    >
      <div className="h-full rounded-[20px] bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function ClinicDoctorsPage() {
  const tDoc = useTranslations("ClinicDoctors");
  const tNav = useTranslations("ClinicNav");

  const {
    data: doctors,
    isLoading,
  } = useClinicDoctors();

  const addDoctor = useAddDoctor();

  const [showAdd, setShowAdd] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [form, setForm] =
    useState(EMPTY_ADD);

  const [error, setError] =
    useState("");

  // ==========================================================
  // ADD DOCTOR
  // ==========================================================

  function handleAdd(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    addDoctor.mutate(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        specialization:
          form.specialization || undefined,
        qualification:
          form.qualification || undefined,
        experience: form.experience
          ? Number(form.experience)
          : undefined,
        fee: form.fee
          ? Number(form.fee)
          : undefined,
        startTime:
          form.startTime || undefined,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_ADD);
          setShowAdd(false);
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              "Failed to add doctor"
          );
        },
      }
    );
  }

  // ==========================================================
  // CLOSE ADD FORM
  // ==========================================================

  function closeAddForm() {
    setShowAdd(false);
    setForm(EMPTY_ADD);
    setError("");
  }

  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalDoctors =
    doctors?.length ?? 0;

  const activeDoctors =
    doctors?.filter(
      (doctor) =>
        doctor.user.isActive
    ).length ?? 0;

  // ==========================================================
  // SEARCH
  //
  // Only searches doctor NAME.
  // ==========================================================

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredDoctors =
    doctors?.filter((doctor) => {
      const name =
        doctor.user?.name
          ?.toLowerCase() ?? "";

      return name.includes(
        normalizedSearch
      );
    }) ?? [];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-4 pb-5 sm:space-y-6">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <GradientCard>

        <div className="relative overflow-hidden p-4 sm:p-6">

          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Header content */}

            <div className="min-w-0">

              <div className="mb-2.5 flex flex-wrap items-center gap-2">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-md">
                  <Stethoscope className="h-4 w-4" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#252a67] sm:text-xs">
                  {tNav("doctors")}
                </span>

                {totalDoctors > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 sm:text-[10px]">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    {activeDoctors} Active

                  </span>
                )}

              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {tDoc("heading")}
              </h1>

              <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                {tDoc("subtitle")}
              </p>

            </div>

            {/* Add button */}

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
              className={`
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                py-3
                text-xs
                font-bold
                transition-all
                sm:w-auto
                sm:text-sm
                ${
                  showAdd
                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gradient-to-r from-[#252a67] to-[#3b4a8f] text-white shadow-[0_8px_20px_-8px_rgba(37,42,103,0.65)] hover:-translate-y-0.5 hover:shadow-lg"
                }
              `}
            >

              {showAdd ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}

              {showAdd
                ? tDoc("cancel")
                : tDoc("addDoctor")}

            </button>

          </div>
        </div>

      </GradientCard>

      {/* ======================================================
          ADD DOCTOR
          ====================================================== */}

      {showAdd && (
        <GradientCard gradient={GREEN_GRADIENT}>

          <form
            onSubmit={handleAdd}
            className="p-4 sm:p-6"
          >

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#047857] to-[#14B8A6] text-white shadow-md">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0">

                <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                  {tDoc("addNewDoctor")}
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                  {tDoc("addDoctorSub")}
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">

              <Field
                label={tDoc("name")}
                required
              >
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="Enter doctor's name"
                />
              </Field>

              <Field
                label={tDoc("email")}
                required
              >
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="doctor@example.com"
                />
              </Field>

              <Field
                label={tDoc("password")}
                required
              >
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="Minimum 6 characters"
                />
              </Field>

              <Field label={tDoc("phone")}>
                <input
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="Phone number"
                />
              </Field>

              <Field
                label={tDoc("specialization")}
              >
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specialization:
                        e.target.value,
                    })
                  }
                  className={inputClasses}
                  placeholder="e.g. Cardiology"
                />
              </Field>

              <Field
                label={tDoc("qualification")}
              >
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      qualification:
                        e.target.value,
                    })
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
                      setForm({
                        ...form,
                        experience:
                          e.target.value,
                      })
                    }
                    className={`${inputClasses} pr-16`}
                    placeholder="Years"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
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
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fee: e.target.value,
                      })
                    }
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
                    setForm({
                      ...form,
                      startTime:
                        e.target.value,
                    })
                  }
                  className={inputClasses}
                />
              </Field>

            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">

              <button
                type="submit"
                disabled={
                  addDoctor.isPending
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
              >

                {addDoctor.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {addDoctor.isPending
                  ? tDoc("creating")
                  : tDoc("createAccount")}

              </button>

              <button
                type="button"
                onClick={closeAddForm}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 sm:w-auto sm:text-sm"
              >
                {tDoc("cancel")}
              </button>

            </div>

          </form>

        </GradientCard>
      )}

      {/* ======================================================
          LOADING
          ====================================================== */}

      {isLoading && (
        <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-slate-100 bg-white dark:border-soft-300 dark:bg-surface">

          <div className="flex flex-col items-center gap-3">

            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#252a67] border-t-transparent" />

            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              {tDoc("loadingDoctors")}
            </p>

          </div>

        </div>
      )}

      {/* ======================================================
          EMPTY
          ====================================================== */}

      {!isLoading &&
        (!doctors ||
          doctors.length === 0) && (
          <GradientCard>

            <div className="px-5 py-10 text-center sm:p-10">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-lg">
                <Stethoscope className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-800">
                {tDoc("noDoctorsTitle")}
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 sm:text-sm">
                {tDoc("noDoctorsSub")}
              </p>

              {!showAdd && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAdd(true)
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:text-sm"
                >
                  <Plus className="h-4 w-4" />
                  {tDoc("addDoctor")}
                </button>
              )}

            </div>

          </GradientCard>
        )}

      {/* ======================================================
          DOCTOR LIST
          ====================================================== */}

      {!isLoading &&
        doctors &&
        doctors.length > 0 && (

          <div className="space-y-4 sm:space-y-5">

            {/* ==================================================
                SEARCH BAR
                ================================================== */}

            <div className="relative">

              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                  sm:left-4
                  sm:h-5
                  sm:w-5
                "
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search doctor by name..."
                aria-label="Search doctor by name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  py-3
                  pl-10
                  pr-11
                  text-xs
                  font-medium
                  text-slate-700
                  outline-none
                  shadow-[0_6px_24px_-17px_rgba(37,42,103,0.4)]
                  transition-all
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-[#252a67]
                  focus:ring-4
                  focus:ring-[#252a67]/10
                  sm:py-3.5
                  sm:pl-12
                  sm:text-sm
                  dark:border-soft-300
                  dark:bg-surface
                  dark:text-ink-800
                "
              />

              {/* Clear */}

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  aria-label="Clear search"
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-6
                    w-6
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-100
                    text-slate-400
                    transition
                    hover:bg-slate-200
                    hover:text-slate-700
                  "
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

            </div>

            {/* ==================================================
                SECTION HEADER
                ================================================== */}

            <div className="flex items-end justify-between gap-3">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#14B8A6]" />

                  <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                    {tDoc("yourDoctors")}
                  </h2>

                </div>

                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">

                  {searchQuery.trim()
                    ? `${filteredDoctors.length} of ${totalDoctors} doctors`
                    : `${totalDoctors} ${tDoc("doctorsAdded")}`}

                </p>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-700 sm:text-[10px]">

                <TrendingUp className="h-3 w-3" />

                {activeDoctors} Active

              </div>

            </div>

            {/* ==================================================
                RESULTS
                ================================================== */}

            {filteredDoctors.length > 0 && (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">

                {filteredDoctors.map(
                  (doctor) => (
                    <DoctorRow
                      key={doctor.id}
                      doctor={doctor}
                    />
                  )
                )}

              </div>
            )}

            {/* ==================================================
                NO SEARCH RESULT
                ================================================== */}

            {searchQuery.trim() &&
              filteredDoctors.length ===
                0 && (
                <div className="rounded-[22px] border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_8px_30px_-20px_rgba(37,42,103,0.35)] dark:border-soft-300 dark:bg-surface">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#252a67]/[0.06]">

                    <Search className="h-5 w-5 text-[#252a67]" />

                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800">
                    No doctor found
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">

                    No doctor matches{" "}

                    <span className="font-semibold text-[#252a67]">
                      "{searchQuery}"
                    </span>

                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    className="mt-4 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-4 py-2.5 text-[10px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:text-xs"
                  >
                    Clear Search
                  </button>

                </div>
              )}

          </div>
        )}

    </div>
  );
}

// ============================================================
// FIELD
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

      <span className="mb-1.5 block text-[11px] font-bold text-slate-600 sm:text-xs">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </span>

      {children}

    </label>
  );
}

// ============================================================
// DOCTOR CARD
// ============================================================

function DoctorRow({
  doctor,
}: {
  doctor: ClinicDoctor;
}) {
  const tDoc =
    useTranslations("ClinicDoctors");

  const editDoctor =
    useEditDoctor();

  const [editing, setEditing] =
    useState(false);

  const [form, setForm] = useState({
    specialization:
      doctor.specialization ?? "",
    qualification:
      doctor.qualification ?? "",
    experience:
      doctor.experience?.toString() ?? "",
    fee:
      doctor.fee?.toString() ?? "",
    startTime:
      doctor.startTime ?? "",
  });

  // ==========================================================
  // PHOTO
  //
  // Supports common possible backend fields.
  // ==========================================================

  const doctorData =
    doctor as ClinicDoctor & {
      image?: string | null;
      photo?: string | null;
      avatar?: string | null;
      profileImage?: string | null;
      profilePhoto?: string | null;

      user?: ClinicDoctor["user"] & {
        image?: string | null;
        photo?: string | null;
        avatar?: string | null;
        profileImage?: string | null;
        profilePhoto?: string | null;
      };
    };

  const photo =
    doctorData.user?.image ||
    doctorData.user?.photo ||
    doctorData.user?.avatar ||
    doctorData.user?.profileImage ||
    doctorData.user?.profilePhoto ||
    doctorData.image ||
    doctorData.photo ||
    doctorData.avatar ||
    doctorData.profileImage ||
    doctorData.profilePhoto ||
    null;

  // ==========================================================
  // NAME
  // ==========================================================

  const doctorName =
    doctor.user.name || "Doctor";

  // ==========================================================
  // SAVE
  // ==========================================================

  function handleSave(
    e: React.FormEvent
  ) {
    e.preventDefault();

    editDoctor.mutate(
      {
        doctorId: doctor.id,

        specialization:
          form.specialization ||
          undefined,

        qualification:
          form.qualification ||
          undefined,

        experience: form.experience
          ? Number(form.experience)
          : undefined,

        fee: form.fee
          ? Number(form.fee)
          : undefined,

        startTime:
          form.startTime ||
          undefined,
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  }

  // ==========================================================
  // CARD
  // ==========================================================

  return (
    <GradientCard>

      <div className="p-3.5 sm:p-5">

        {/* ====================================================
            PROFILE
            ==================================================== */}

        <div className="flex min-w-0 items-start gap-3">

          {/* ==================================================
              DOCTOR PHOTO

              object-cover:
              fills the small frame

              object-top:
              preserves the top portion
              so head/face doesn't disappear
              ================================================== */}

          <div className="relative h-[68px] w-[58px] shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 sm:h-[78px] sm:w-[66px] sm:rounded-2xl">

            {photo ? (
              <img
                src={photo}
                alt={doctorName}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white">

                <Camera className="mb-1 h-3.5 w-3.5 opacity-60" />

                <span className="text-sm font-bold">
                  {getInitials(
                    doctorName
                  )}
                </span>

              </div>
            )}

            {/* Active check */}

            {doctor.user.isActive && (
              <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md">

                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

              </div>
            )}

          </div>

          {/* ==================================================
              DOCTOR DETAILS
              ================================================== */}

          <div className="min-w-0 flex-1">

            <div className="flex min-w-0 items-start gap-1.5">

              <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900 sm:text-base">
                {formatDoctorName(
                  doctorName
                )}
              </p>

              {/* Desktop/tablet status */}

              {doctor.user.isActive ? (
                <span className="hidden shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 min-[400px]:inline-flex">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Active

                </span>
              ) : (
                <span className="hidden shrink-0 rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600 min-[400px]:inline-flex">
                  Inactive
                </span>
              )}

            </div>

            <div className="mt-1.5 flex min-w-0 items-center gap-1.5">

              <Mail className="h-3 w-3 shrink-0 text-[#3b4a8f]" />

              <span className="truncate text-[10px] font-medium text-slate-500 sm:text-[11px]">
                {doctor.user.email}
              </span>

            </div>

            {/* Small mobile status */}

            <div className="mt-1.5 min-[400px]:hidden">

              {doctor.user.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Active

                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[8px] font-bold text-red-600">
                  Inactive
                </span>
              )}

            </div>

          </div>

          {/* ==================================================
              EDIT
              ================================================== */}

          <button
            type="button"
            onClick={() =>
              setEditing(
                (value) => !value
              )
            }
            aria-label={
              editing
                ? tDoc("close")
                : tDoc("edit")
            }
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              transition-all
              sm:h-9
              sm:w-9
              ${
                editing
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "bg-[#252a67]/[0.06] text-[#252a67] hover:bg-[#252a67]/10"
              }
            `}
          >

            {editing ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}

          </button>

        </div>

        {/* ====================================================
            QUICK INFO
            ==================================================== */}

        <div className="mt-3 grid grid-cols-2 gap-2">

          <InfoItem
            icon={BriefcaseMedical}
            label={tDoc("specialization")}
            value={
              doctor.specialization ||
              tDoc("notSet")
            }
          />

          <InfoItem
            icon={GraduationCap}
            label={tDoc("qualification")}
            value={
              doctor.qualification ||
              tDoc("notSet")
            }
          />

          <InfoItem
            icon={Clock3}
            label={tDoc("startTime")}
            value={
              doctor.startTime ||
              tDoc("notSet")
            }
          />

          <InfoItem
            icon={IndianRupee}
            label={tDoc("fee")}
            value={
              doctor.fee != null
                ? `₹${doctor.fee}`
                : tDoc("notSet")
            }
          />

        </div>

        {/* ====================================================
            EXPERIENCE
            ==================================================== */}

        {doctor.experience != null && (
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-emerald-50/70 px-3 py-2">

            <Award className="h-4 w-4 shrink-0 text-emerald-600" />

            <span className="text-[10px] font-bold text-emerald-700 sm:text-[11px]">
              {doctor.experience}{" "}
              {tDoc("yearsExperience")}
            </span>

          </div>
        )}

        {/* ====================================================
            QUALIFICATION
            ==================================================== */}

        {doctor.qualification && (
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-3 py-2.5">

            <BookOpen className="h-4 w-4 shrink-0 text-white" />

            <div className="min-w-0">

              <p className="text-[8px] font-bold uppercase tracking-wider text-blue-200">
                {tDoc("qualification")}
              </p>

              <p className="truncate text-[10px] font-bold text-white sm:text-xs">
                {doctor.qualification}
              </p>

            </div>

          </div>
        )}

        {/* ====================================================
            EDIT FORM
            ==================================================== */}

        {editing && (
          <form
            onSubmit={handleSave}
            className="mt-4 border-t border-slate-100 pt-4"
          >

            <div className="mb-3">

              <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                {tDoc("editDoctorDetails")}
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-500">
                {tDoc("editDoctorSub")}
              </p>

            </div>

            <div className="space-y-3">

              <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">

                <Field
                  label={tDoc("specialization")}
                >
                  <input
                    value={
                      form.specialization
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specialization:
                          e.target.value,
                      })
                    }
                    className={`${inputClasses} px-3 py-2 text-xs`}
                    placeholder="e.g. Cardiology"
                  />
                </Field>

                <Field
                  label={tDoc("qualification")}
                >
                  <input
                    value={
                      form.qualification
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        qualification:
                          e.target.value,
                      })
                    }
                    className={`${inputClasses} px-3 py-2 text-xs`}
                    placeholder="e.g. MBBS, MD"
                  />
                </Field>

              </div>

              <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">

                <Field
                  label={tDoc("experience")}
                >
                  <input
                    type="number"
                    min={0}
                    value={form.experience}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        experience:
                          e.target.value,
                      })
                    }
                    className={`${inputClasses} px-3 py-2 text-xs`}
                    placeholder="Years"
                  />
                </Field>

                <Field label={tDoc("fee")}>

                  <div className="relative">

                    <IndianRupee className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />

                    <input
                      type="number"
                      min={0}
                      value={form.fee}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fee: e.target.value,
                        })
                      }
                      className={`${inputClasses} px-3 py-2 pl-7 text-xs`}
                      placeholder="Fee"
                    />

                  </div>

                </Field>

              </div>

              <Field
                label={tDoc("startTime")}
              >
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startTime:
                        e.target.value,
                    })
                  }
                  className={`${inputClasses} px-3 py-2 text-xs`}
                />
              </Field>

            </div>

            <div className="mt-3 flex gap-2">

              <button
                type="submit"
                disabled={
                  editDoctor.isPending
                }
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-3 py-2.5 text-[10px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 sm:flex-none sm:text-xs"
              >

                {editDoctor.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}

                {editDoctor.isPending
                  ? tDoc("saving")
                  : tDoc("saveChanges")}

              </button>

              <button
                type="button"
                onClick={() =>
                  setEditing(false)
                }
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none sm:text-xs"
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
// INFO ITEM
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
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition hover:border-[#252a67]/15">

      <div className="flex min-w-0 items-center gap-1.5">

        <Icon className="h-3 w-3 shrink-0 text-[#252a67]" />

        <span className="truncate text-[8px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>

      </div>

      <p className="mt-1 truncate text-[10px] font-bold text-slate-700 sm:text-[11px]">
        {value}
      </p>

    </div>
  );
}

// ============================================================
// DOCTOR NAME
// ============================================================

function formatDoctorName(
  name: string
) {
  const cleanName = name
    .trim()
    .replace(/^(dr\.?\s*)+/i, "")
    .trim();

  return cleanName
    ? `Dr. ${cleanName}`
    : "Dr. Doctor";
}

// ============================================================
// INITIALS
// ============================================================

function getInitials(
  name: string
) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) =>
      part.charAt(0)
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
}