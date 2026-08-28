"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  X,
  UserCog,
  KeyRound,
  Users,
  Mail,
  Phone,
  UserRound,
  CheckCircle2,
  Loader2,
  Stethoscope,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  useClinicReceptionists,
  useAddReceptionist,
  useClinicDoctors,
  useAssignDoctorsToReceptionist,
  useChangeStaffPassword,
  type ClinicReceptionist,
} from "@/lib/hooks/useClinic";

const EMPTY = { name: "", email: "", password: "", phone: "" };

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
      <div className="rounded-[calc(1rem-1.5px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// Replaces global <style jsx> to match the premium design language
const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400 dark:hover:border-soft-300";

// ============================================================
// GRADIENTS FOR RECEPTIONIST CARDS
// ============================================================

const RECEPTIONIST_GRADIENTS = [
  "from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]", // Royal Blue
  "from-[#059669] via-[#10b981] to-[#34d399]", // Leaf Green
  "from-[#667eea] via-[#764ba2] to-[#f093fb]", // Blue → Purple → Pink
  "from-[#f5576c] via-[#f093fb] to-[#fda085]", // Red → Pink → Orange
  "from-[#4facfe] via-[#00f2fe] to-[#667eea]", // Blue → Cyan → Blue
  "from-[#a18cd1] via-[#fbc2eb] to-[#f093fb]", // Light Purple → Pink
  "from-[#fa709a] via-[#fee140] to-[#fa709a]", // Pink → Gold → Pink
  "from-[#30cfd0] via-[#330867] to-[#667eea]", // Cyan → Dark Blue
  "from-[#ff9a9e] via-[#fecfef] to-[#f093fb]", // Light Red → Pink
];

export default function ClinicReceptionistsPage() {
  const tRec = useTranslations("ClinicReceptionists");
  const tNav = useTranslations("ClinicNav");
  const { data: receptionists, isLoading } = useClinicReceptionists();
  const { data: doctors } = useClinicDoctors();
  const addReceptionist = useAddReceptionist();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    addReceptionist.mutate(
      { ...form, phone: form.phone || undefined },
      {
        onSuccess: () => {
          setForm(EMPTY);
          setShowAdd(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) =>
          setError(
            err?.response?.data?.message || "Failed to add receptionist"
          ),
      }
    );
  }

  function closeAddForm() {
    setShowAdd(false);
    setForm(EMPTY);
    setError("");
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                <Users className="h-4 w-4" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#1e40af]">
                {tNav("receptionists")}
              </span>

              {receptionists && receptionists.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-2 py-0.5 text-[9px] font-bold text-white">
                  <Sparkles className="h-3 w-3" />
                  {receptionists.length} Active
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {tRec("heading")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {tRec("subtitle")}
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
            {showAdd ? tRec("cancel") : tRec("addReceptionist")}
          </button>
        </div>
      </GradientCard>

      {/* =====================================================
          ADD RECEPTIONIST FORM - Gradient Border
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
                    {tRec("addNewReceptionist")}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {tRec("addReceptionistSub")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={tRec("name")} required>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClasses}
                  placeholder="Enter full name"
                />
              </Field>

              <Field label={tRec("email")} required>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClasses}
                  placeholder="staff@example.com"
                />
              </Field>

              <Field label={tRec("password")} required>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={inputClasses}
                  placeholder="Minimum 6 characters"
                />
              </Field>

              <Field label={tRec("phone")}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClasses}
                  placeholder="Phone number"
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
                disabled={addReceptionist.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
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
                className="rounded-xl border border-[#1e40af]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#1e40af] transition hover:bg-[#1e40af]/5"
              >
                {tRec("cancel")}
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
              {tRec("loadingReceptionists")}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}
      {!isLoading && (!receptionists || receptionists.length === 0) && (
        <GradientCard gradient="from-[#f093fb] via-[#f5576c] to-[#fda085]">
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#f5576c] to-[#fda085] text-white shadow-lg shadow-pink-500/30">
              <Users className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-800">
              {tRec("noReceptionistsTitle")}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {tRec("noReceptionistsSub")}
            </p>

            {!showAdd && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                {tRec("addReceptionist")}
              </button>
            )}
          </div>
        </GradientCard>
      )}

      {/* =====================================================
          RECEPTIONIST LIST - 1 col mobile, 2 tablet, 3 desktop
      ====================================================== */}
      {!isLoading && receptionists && receptionists.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">{tRec("frontDeskStaff")}</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {receptionists.length} {tRec("staffAdded")}
              </p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-3 py-1 text-[10px] font-bold text-white">
              <TrendingUp className="h-3 w-3" />
              {receptionists.filter(r => r.user.isActive).length} Active
            </div>
          </div>

          {/* ✅ 1 column mobile, 2 tablet, 3 desktop */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {receptionists.map((r, index) => (
              <ReceptionistRow
                key={r.id}
                receptionist={r}
                allDoctors={doctors ?? []}
                gradient={RECEPTIONIST_GRADIENTS[index % RECEPTIONIST_GRADIENTS.length]}
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
// Receptionist Row Component - Each with different gradient
// ============================================================
function ReceptionistRow({
  receptionist,
  allDoctors,
  gradient,
}: {
  receptionist: ClinicReceptionist;
  allDoctors: { id: string; user: { name: string } }[];
  gradient: string;
}) {
  const tRec = useTranslations("ClinicReceptionists");
  const assignDoctors = useAssignDoctorsToReceptionist();
  const changePassword = useChangeStaffPassword();

  const [assigning, setAssigning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    receptionist.assignedDoctors?.map((a: any) => a.doctor?.id).filter(Boolean) ?? []
  );

  const [changingPw, setChangingPw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  function toggleDoctor(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function handleAssign() {
    if (selectedIds.length === 0) return;
    assignDoctors.mutate(
      { receptionistId: receptionist.id, doctorIds: selectedIds },
      { onSuccess: () => setAssigning(false) }
    );
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage("");
    changePassword.mutate(
      { userId: receptionist.user.id, newPassword },
      {
        onSuccess: () => {
          setPwMessage("Password updated successfully.");
          setNewPassword("");
          setTimeout(() => {
            setChangingPw(false);
            setPwMessage("");
          }, 1500);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) =>
          setPwMessage(
            err?.response?.data?.message || "Failed to update password"
          ),
      }
    );
  }

  return (
    <GradientCard gradient={gradient}>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
              <span className="text-sm font-bold">
                {getInitials(receptionist.user.name)}
              </span>
            </div>

            {/* Basic info */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {receptionist.user.name}
                </p>

                {receptionist.user.isActive ? (
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

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#3b82f6]" />
                  <span className="truncate">{receptionist.user.email}</span>
                </div>

                {receptionist.user.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-[#3b82f6]" />
                    <span className="truncate">{receptionist.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex shrink-0 gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => {
                setAssigning((v) => !v);
                setChangingPw(false);
              }}
              className={
                assigning
                  ? "inline-flex items-center gap-1.5 rounded-lg border border-[#f5576c]/30 bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#f5576c]"
                  : "inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md shadow-blue-500/30"
              }
            >
              {assigning ? (
                <X className="h-3 w-3" />
              ) : (
                <UserCog className="h-3 w-3" />
              )}
              {tRec("assignDoctors")}
            </button>
            <button
              type="button"
              onClick={() => {
                setChangingPw((v) => !v);
                setAssigning(false);
              }}
              className={
                changingPw
                  ? "inline-flex items-center gap-1.5 rounded-lg border border-[#f5576c]/30 bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#f5576c]"
                  : "inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#059669] to-[#10b981] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md shadow-green-500/30"
              }
            >
              {changingPw ? (
                <X className="h-3 w-3" />
              ) : (
                <KeyRound className="h-3 w-3" />
              )}
              {tRec("changePassword")}
            </button>
          </div>
        </div>

        {/* Assigned Doctors Display */}
        {(receptionist.assignedDoctors?.length ?? 0) > 0 && !assigning && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e40af]/5 to-transparent px-3 py-2">
            <Stethoscope className="mr-1 h-4 w-4 text-[#1e40af]" />
            <span className="text-[11px] font-semibold text-slate-600">
              {tRec("manages")}
            </span>
            <div className="flex flex-wrap gap-1">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {receptionist.assignedDoctors.map((a: any, index) => (
                <span
                  key={a.id || a.doctor?.id || index}
                  className="rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-2 py-0.5 text-[9px] font-bold text-white"
                >
                  {a.doctor?.user?.name || "Unknown"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            ASSIGN DOCTORS PANEL
        ================================================== */}
        {assigning && (
          <div className="mt-5 rounded-2xl border border-[#1e40af]/10 bg-gradient-to-b from-[#1e40af]/5 to-white p-4">
            <h3 className="text-sm font-bold text-slate-800">
              {tRec("assignDoctors")}
            </h3>
            <p className="mb-3 mt-1 text-xs text-slate-500">
              {tRec("assignDoctorsSub")}
            </p>

            <div className="flex flex-wrap gap-2">
              {allDoctors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDoctor(d.id)}
                  className={
                    "rounded-xl border px-3 py-2 text-xs font-bold transition-all " +
                    (selectedIds.includes(d.id)
                      ? "border-[#1e40af] bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#1e40af]/40")
                  }
                >
                  {d.user.name}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleAssign}
                disabled={selectedIds.length === 0 || assignDoctors.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assignDoctors.isPending && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {assignDoctors.isPending ? tRec("assigning") : tRec("saveAssignments")}
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            CHANGE PASSWORD PANEL
        ================================================== */}
        {changingPw && (
          <form
            onSubmit={handleChangePassword}
            className="mt-5 rounded-2xl border border-[#059669]/10 bg-gradient-to-b from-[#059669]/5 to-white p-4"
          >
            <h3 className="text-sm font-bold text-slate-800">
              {tRec("updatePassword")}
            </h3>
            <p className="mb-3 mt-1 text-xs text-slate-500">
              {tRec("updatePasswordSub")} {receptionist.user.name}.
            </p>

            <div className="flex max-w-sm flex-col gap-3">
              <input
                type="password"
                required
                minLength={6}
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClasses}
              />
              <button
                type="submit"
                disabled={changePassword.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {changePassword.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {changePassword.isPending ? tRec("updating") : tRec("updatePasswordBtn")}
              </button>

              {pwMessage && (
                <div
                  className={`mt-1 rounded-xl px-3 py-2 text-xs font-semibold ${
                    pwMessage.includes("successfully")
                      ? "bg-[#059669]/10 text-[#059669]"
                      : "bg-[#f5576c]/10 text-[#f5576c]"
                  }`}
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