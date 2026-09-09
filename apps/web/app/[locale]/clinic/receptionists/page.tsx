"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  X,
  Search,
  UserCog,
  KeyRound,
  Users,
  Mail,
  Phone,
  UserRound,
  CheckCircle2,
  Loader2,
  Stethoscope,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import {
  useClinicReceptionists,
  useAddReceptionist,
  useClinicDoctors,
  useAssignDoctorsToReceptionist,
  useChangeStaffPassword,
  type ClinicReceptionist,
} from "@/lib/hooks/useClinic";

// ============================================================
// TYPES
// ============================================================

type Doctor = {
  id: string;
  user: {
    name: string;
  };
};

// ============================================================
// CONSTANTS
// ============================================================

const EMPTY = {
  name: "",
  email: "",
  password: "",
  phone: "",
};

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#252a67] focus:ring-4 focus:ring-[#252a67]/10 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400";

const PRIMARY_GRADIENT =
  "from-[#252a67] via-[#3b4a8f] to-[#14B8A6]";

const GREEN_GRADIENT =
  "from-[#047857] via-[#059669] to-[#14B8A6]";

// ============================================================
// GRADIENT BORDER CARD
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
        shadow-[0_10px_35px_-20px_rgba(37,42,103,0.5)]
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

export default function ClinicReceptionistsPage() {
  const tRec = useTranslations("ClinicReceptionists");
  const tNav = useTranslations("ClinicNav");

  const {
    data: receptionists,
    isLoading,
  } = useClinicReceptionists();

  const { data: doctors } =
    useClinicDoctors();

  const addReceptionist =
    useAddReceptionist();

  // ==========================================================
  // STATE
  // ==========================================================

  const [showAdd, setShowAdd] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [form, setForm] =
    useState(EMPTY);

  const [error, setError] =
    useState("");

  // ==========================================================
  // ADD RECEPTIONIST
  // ==========================================================

  function handleAdd(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    addReceptionist.mutate(
      {
        ...form,
        phone: form.phone || undefined,
      },
      {
        onSuccess: () => {
          setForm(EMPTY);
          setShowAdd(false);
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) =>
          setError(
            err?.response?.data?.message ||
              "Failed to add receptionist"
          ),
      }
    );
  }

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  function closeAddForm() {
    setShowAdd(false);
    setForm(EMPTY);
    setError("");
  }

  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalReceptionists =
    receptionists?.length ?? 0;

  const activeReceptionists =
    receptionists?.filter(
      (receptionist) =>
        receptionist.user.isActive
    ).length ?? 0;

  // ==========================================================
  // SEARCH
  // ==========================================================

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const filteredReceptionists =
    receptionists?.filter(
      (receptionist) => {
        const name =
          receptionist.user?.name
            ?.toLowerCase() ?? "";

        return name.includes(
          normalizedSearch
        );
      }
    ) ?? [];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-4 pb-4 sm:space-y-6">

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <GradientCard>

        <div className="relative overflow-hidden p-4 sm:p-6">

          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Header information */}

            <div className="min-w-0">

              <div className="mb-2.5 flex flex-wrap items-center gap-2">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-md">
                  <Users className="h-4 w-4" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#252a67] sm:text-xs">
                  {tNav("receptionists")}
                </span>

                {totalReceptionists > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#059669]/10 px-2 py-1 text-[9px] font-bold text-[#047857] sm:text-[10px]">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />

                    {activeReceptionists} Active

                  </span>
                )}

              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {tRec("heading")}
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                {tRec("subtitle")}
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
                sm:px-5
                sm:text-sm
                ${
                  showAdd
                    ? "border border-red-200 bg-red-50 text-[#dc2626] hover:bg-red-100"
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
                ? tRec("cancel")
                : tRec("addReceptionist")}

            </button>

          </div>
        </div>

      </GradientCard>

      {/* ======================================================
          ADD RECEPTIONIST
          ====================================================== */}

      {showAdd && (
        <GradientCard gradient={GREEN_GRADIENT}>

          <form
            onSubmit={handleAdd}
            className="p-4 sm:p-6"
          >

            {/* Form heading */}

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#047857] to-[#14B8A6] text-white shadow-md">
                <UserRound className="h-5 w-5" />
              </div>

              <div className="min-w-0">

                <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                  {tRec("addNewReceptionist")}
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                  {tRec("addReceptionistSub")}
                </p>

              </div>

            </div>

            {/* Inputs */}

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">

              <Field
                label={tRec("name")}
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
                  placeholder="Enter full name"
                />
              </Field>

              <Field
                label={tRec("email")}
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
                  placeholder="staff@example.com"
                />
              </Field>

              <Field
                label={tRec("password")}
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

              <Field label={tRec("phone")}>
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

            </div>

            {/* Error */}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-600">

                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                {error}

              </div>
            )}

            {/* Actions */}

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">

              <button
                type="submit"
                disabled={
                  addReceptionist.isPending
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-5 py-3 text-xs font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,42,103,0.65)] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
              >

                {addReceptionist.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {addReceptionist.isPending
                  ? tRec("creating")
                  : tRec("createAccount")}

              </button>

              <button
                type="button"
                onClick={closeAddForm}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto sm:text-sm"
              >
                {tRec("cancel")}
              </button>

            </div>

          </form>

        </GradientCard>
      )}

      {/* ======================================================
          LOADING
          ====================================================== */}

      {isLoading && (
        <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-slate-100 bg-white shadow-[0_5px_25px_-18px_rgba(37,42,103,0.35)] dark:border-soft-300 dark:bg-surface">

          <div className="flex flex-col items-center gap-3">

            <div className="relative flex h-10 w-10 items-center justify-center">

              <div className="absolute inset-0 animate-ping rounded-full bg-[#14B8A6]/10" />

              <div className="relative h-8 w-8 animate-spin rounded-full border-[3px] border-[#252a67] border-t-transparent" />

            </div>

            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              {tRec("loadingReceptionists")}
            </p>

          </div>

        </div>
      )}

      {/* ======================================================
          EMPTY STATE
          ====================================================== */}

      {!isLoading &&
        (!receptionists ||
          receptionists.length === 0) && (
          <GradientCard gradient="from-[#252a67] via-[#3b4a8f] to-[#14B8A6]">

            <div className="px-5 py-9 text-center sm:p-10">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-lg">
                <Users className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-base font-bold text-slate-800">
                {tRec("noReceptionistsTitle")}
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
                {tRec("noReceptionistsSub")}
              </p>

              {!showAdd && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAdd(true)
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:text-sm"
                >
                  <Plus className="h-4 w-4" />
                  {tRec("addReceptionist")}
                </button>
              )}

            </div>

          </GradientCard>
        )}

      {/* ======================================================
          RECEPTIONIST LIST
          ====================================================== */}

      {!isLoading &&
        receptionists &&
        receptionists.length > 0 && (

          <div className="space-y-4 sm:space-y-5">

            {/* ==================================================
                SEARCH BAR
                Always ABOVE the list
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
                placeholder="Search receptionist by name..."
                aria-label="Search receptionist by name"
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

              {/* Clear search */}

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

                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#14B8A6]" />

                  <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                    {tRec("frontDeskStaff")}
                  </h2>

                </div>

                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">

                  {searchQuery.trim()
                    ? `${filteredReceptionists.length} of ${totalReceptionists} staff`
                    : `${totalReceptionists} ${tRec("staffAdded")}`}

                </p>

              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-700 sm:px-3 sm:text-[10px]">

                <TrendingUp className="h-3 w-3" />

                {activeReceptionists} Active

              </div>

            </div>

            {/* ==================================================
                RESULTS
                ================================================== */}

            {filteredReceptionists.length > 0 && (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">

                {filteredReceptionists.map(
                  (receptionist, index) => (
                    <ReceptionistRow
                      key={receptionist.id}
                      receptionist={receptionist}
                      allDoctors={
                        doctors ?? []
                      }
                      index={index}
                    />
                  )
                )}

              </div>
            )}

            {/* ==================================================
                NO SEARCH RESULT
                ================================================== */}

            {searchQuery.trim() &&
              filteredReceptionists.length ===
                0 && (
                <div className="rounded-[22px] border border-slate-200 bg-white px-5 py-10 text-center shadow-[0_8px_30px_-20px_rgba(37,42,103,0.35)] dark:border-soft-300 dark:bg-surface">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#252a67]/[0.06]">

                    <Search className="h-5 w-5 text-[#252a67]" />

                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800">
                    No receptionist found
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">

                    No receptionist matches{" "}

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
// RECEPTIONIST CARD
// ============================================================

function ReceptionistRow({
  receptionist,
  allDoctors,
}: {
  receptionist: ClinicReceptionist;
  allDoctors: Doctor[];
  index: number;
}) {
  const tRec =
    useTranslations("ClinicReceptionists");

  const assignDoctors =
    useAssignDoctorsToReceptionist();

  const changePassword =
    useChangeStaffPassword();

  const [assigning, setAssigning] =
    useState(false);

  const [selectedIds, setSelectedIds] =
    useState<string[]>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      receptionist.assignedDoctors
        ?.map(
          (a: any) => a.doctor?.id
        )
        .filter(Boolean) ?? []
    );

  const [changingPw, setChangingPw] =
    useState(false);

  const [newPassword, setNewPassword] =
    useState("");

  const [pwMessage, setPwMessage] =
    useState("");

  // ==========================================================
  // INITIALS
  // ==========================================================

  const initials = getInitials(
    receptionist.user.name
  );

  // ==========================================================
  // TOGGLE DOCTOR
  // ==========================================================

  function toggleDoctor(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (doctorId) =>
              doctorId !== id
          )
        : [...prev, id]
    );
  }

  // ==========================================================
  // ASSIGN DOCTORS
  // ==========================================================

  function handleAssign() {
    if (selectedIds.length === 0)
      return;

    assignDoctors.mutate(
      {
        receptionistId:
          receptionist.id,
        doctorIds: selectedIds,
      },
      {
        onSuccess: () =>
          setAssigning(false),
      }
    );
  }

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  function handleChangePassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setPwMessage("");

    changePassword.mutate(
      {
        userId:
          receptionist.user.id,
        newPassword,
      },
      {
        onSuccess: () => {
          setPwMessage(
            "Password updated successfully."
          );

          setNewPassword("");

          setTimeout(() => {
            setChangingPw(false);
            setPwMessage("");
          }, 1500);
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) =>
          setPwMessage(
            err?.response?.data?.message ||
              "Failed to update password"
          ),
      }
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <GradientCard>

      <div className="p-3.5 sm:p-5">

        {/* ====================================================
            PROFILE HEADER
            ==================================================== */}

        <div className="flex items-start gap-3">

          {/* Avatar */}

          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-md sm:h-12 sm:w-12 sm:rounded-2xl">

            <span className="text-xs font-bold sm:text-sm">
              {initials}
            </span>

            {receptionist.user.isActive && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            )}

          </div>

          {/* Basic info */}

          <div className="min-w-0 flex-1">

            <div className="flex min-w-0 items-center gap-1.5">

              <p className="min-w-0 truncate text-sm font-bold text-slate-900 sm:text-base">
                {receptionist.user.name}
              </p>

            </div>

            <div className="mt-1.5 flex items-center gap-1.5">

              {receptionist.user.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">

                  <CheckCircle2 className="h-2.5 w-2.5" />

                  Active

                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                  Inactive
                </span>
              )}

            </div>

          </div>

        </div>

        {/* ====================================================
            CONTACT DETAILS
            ==================================================== */}

        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">

          <div className="space-y-1.5">

            <div className="flex min-w-0 items-center gap-2">

              <Mail className="h-3.5 w-3.5 shrink-0 text-[#3b4a8f]" />

              <span className="min-w-0 truncate text-[10px] font-medium text-slate-500 sm:text-[11px]">
                {receptionist.user.email}
              </span>

            </div>

            {receptionist.user.phone && (
              <div className="flex min-w-0 items-center gap-2">

                <Phone className="h-3.5 w-3.5 shrink-0 text-[#14B8A6]" />

                <span className="truncate text-[10px] font-medium text-slate-500 sm:text-[11px]">
                  {receptionist.user.phone}
                </span>

              </div>
            )}

          </div>

        </div>

        {/* ====================================================
            ASSIGNED DOCTORS
            ==================================================== */}

        {(receptionist.assignedDoctors
          ?.length ?? 0) > 0 &&
          !assigning && (

            <div className="mt-3 rounded-xl border border-[#252a67]/10 bg-[#252a67]/[0.035] p-3">

              <div className="mb-2 flex items-center gap-1.5">

                <Stethoscope className="h-3.5 w-3.5 text-[#252a67]" />

                <span className="text-[10px] font-bold text-slate-600">
                  {tRec("manages")}
                </span>

              </div>

              <div className="flex flex-wrap gap-1.5">

                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {receptionist.assignedDoctors.map(
                  (a: any, index) => (

                    <span
                      key={
                        a.id ||
                        a.doctor?.id ||
                        index
                      }
                      className="max-w-full truncate rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-[#252a67] shadow-sm ring-1 ring-[#252a67]/10"
                    >
                      {a.doctor?.user?.name ||
                        "Unknown"}
                    </span>

                  )
                )}

              </div>

            </div>
          )}

        {/* ====================================================
            ACTIONS
            ==================================================== */}

        <div className="mt-3 grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={() => {
              setAssigning(
                (value) => !value
              );
              setChangingPw(false);
            }}
            className={`
              inline-flex
              items-center
              justify-center
              gap-1.5
              rounded-xl
              px-2.5
              py-2.5
              text-[10px]
              font-bold
              transition-all
              ${
                assigning
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "bg-gradient-to-r from-[#252a67] to-[#3b4a8f] text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
              }
            `}
          >

            {assigning ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <UserCog className="h-3.5 w-3.5" />
            )}

            <span className="truncate">
              {assigning
                ? tRec("cancel")
                : tRec("assignDoctors")}
            </span>

          </button>

          <button
            type="button"
            onClick={() => {
              setChangingPw(
                (value) => !value
              );
              setAssigning(false);
            }}
            className={`
              inline-flex
              items-center
              justify-center
              gap-1.5
              rounded-xl
              px-2.5
              py-2.5
              text-[10px]
              font-bold
              transition-all
              ${
                changingPw
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "bg-[#059669]/10 text-[#047857] hover:bg-[#059669]/15"
              }
            `}
          >

            {changingPw ? (
              <X className="h-3.5 w-3.5" />
            ) : (
              <KeyRound className="h-3.5 w-3.5" />
            )}

            <span className="truncate">
              {changingPw
                ? tRec("cancel")
                : tRec("changePassword")}
            </span>

          </button>

        </div>

        {/* ====================================================
            ASSIGN DOCTORS PANEL
            ==================================================== */}

        {assigning && (
          <div className="mt-3 rounded-2xl border border-[#252a67]/10 bg-gradient-to-b from-[#252a67]/[0.045] to-white p-3.5 sm:p-4">

            <div className="mb-3">

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#252a67]/10 text-[#252a67]">
                  <UserCog className="h-3.5 w-3.5" />
                </div>

                <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                  {tRec("assignDoctors")}
                </h3>

              </div>

              <p className="mt-2 text-[10px] leading-relaxed text-slate-500 sm:text-xs">
                {tRec("assignDoctorsSub")}
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              {allDoctors.map(
                (doctor) => {

                  const selected =
                    selectedIds.includes(
                      doctor.id
                    );

                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() =>
                        toggleDoctor(
                          doctor.id
                        )
                      }
                      className={`
                        max-w-full
                        truncate
                        rounded-xl
                        border
                        px-3
                        py-2
                        text-[10px]
                        font-bold
                        transition-all
                        sm:text-xs
                        ${
                          selected
                            ? "border-[#252a67] bg-gradient-to-r from-[#252a67] to-[#3b4a8f] text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#252a67]/30 hover:bg-[#252a67]/[0.03]"
                        }
                      `}
                    >
                      {doctor.user.name}
                    </button>
                  );
                }
              )}

            </div>

            <button
              type="button"
              onClick={handleAssign}
              disabled={
                selectedIds.length === 0 ||
                assignDoctors.isPending
              }
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#3b4a8f] px-4 py-2.5 text-[10px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
            >

              {assignDoctors.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}

              {assignDoctors.isPending
                ? tRec("assigning")
                : tRec("saveAssignments")}

              <ChevronRight className="h-3.5 w-3.5" />

            </button>

          </div>
        )}

        {/* ====================================================
            CHANGE PASSWORD
            ==================================================== */}

        {changingPw && (
          <form
            onSubmit={
              handleChangePassword
            }
            className="mt-3 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/60 to-white p-3.5 sm:p-4"
          >

            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <KeyRound className="h-3.5 w-3.5" />
              </div>

              <div>

                <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                  {tRec("updatePassword")}
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {tRec("updatePasswordSub")}{" "}
                  {receptionist.user.name}.
                </p>

              </div>

            </div>

            <div className="mt-3 space-y-2.5">

              <input
                type="password"
                required
                minLength={6}
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className={inputClasses}
              />

              <button
                type="submit"
                disabled={
                  changePassword.isPending
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#047857] to-[#10B981] px-4 py-2.5 text-[10px] font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:text-xs"
              >

                {changePassword.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}

                {changePassword.isPending
                  ? tRec("updating")
                  : tRec("updatePasswordBtn")}

              </button>

              {pwMessage && (
                <div
                  className={`
                    rounded-xl
                    px-3
                    py-2.5
                    text-[10px]
                    font-semibold
                    ${
                      pwMessage.includes(
                        "successfully"
                      )
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }
                  `}
                >
                  {pwMessage}
                </div>
              )}

            </div>

          </form>
        )}

      </div>

    </GradientCard>
  );
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