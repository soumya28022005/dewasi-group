"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  X,
  Send,
  FlaskConical,
  User,
  Building2,
  FileText,
  Plus,
  CheckCircle2,
  Loader2,
  CalendarDays,
  MapPin,
  Phone,
  Sparkles,
  TrendingUp,
  Award,
  Stethoscope,
} from "lucide-react";
import {
  useSearchPatientByPhone,
  useSearchDiagnosticCenters,
  useCreateReferral,
  useSentReferrals,
  type PatientLookup,
  type DiagnosticCenterLookup,
} from "@/lib/hooks/useReferrals";

// ============================================================
// GRADIENT BORDER CARD COMPONENT - THICKER BORDER
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
    <div className={`relative rounded-2xl p-[3px] bg-gradient-to-r ${gradient} shadow-xl ${className}`}>
      <div className="rounded-[calc(1rem-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// Replaces global <style jsx> to match the clean layout design language
const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[var(--color-primary)]/15 dark:border-soft-300 dark:bg-surface-100 dark:text-ink-800 dark:placeholder:text-ink-400 dark:hover:border-soft-300";

export default function ClinicReferralsPage() {
  const t = useTranslations("ClinicReferrals");
  const { data: sent, isLoading: loadingSent } = useSentReferrals();

  // Patient search
  const searchPatient = useSearchPatientByPhone();
  const [phone, setPhone] = useState("");
  const [patient, setPatient] = useState<PatientLookup | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);

  // Center search
  const searchCenters = useSearchDiagnosticCenters();
  const [centerQuery, setCenterQuery] = useState("");
  const [centers, setCenters] = useState<DiagnosticCenterLookup[]>([]);
  const [selectedCenter, setSelectedCenter] =
    useState<DiagnosticCenterLookup | null>(null);

  // Tests + notes
  const [testInput, setTestInput] = useState("");
  const [tests, setTests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const createReferral = useCreateReferral();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handlePatientSearch(e: React.FormEvent) {
    e.preventDefault();
    setPatientNotFound(false);
    setPatient(null);
    searchPatient.mutate(phone, {
      onSuccess: (result) => {
        if (result) setPatient(result);
        else setPatientNotFound(true);
      },
    });
  }

  function handleCenterSearch(e: React.FormEvent) {
    e.preventDefault();
    setSelectedCenter(null);
    searchCenters.mutate(centerQuery, {
      onSuccess: (result) => setCenters(result),
    });
  }

  function addTest() {
    const text = testInput.trim();
    if (text && !tests.includes(text)) {
      setTests([...tests, text]);
      setTestInput("");
    }
  }

  function removeTest(text: string) {
    setTests(tests.filter((x) => x !== text));
  }

  function handleSend() {
    setError("");
    if (!patient || !selectedCenter || tests.length === 0) return;

    createReferral.mutate(
      {
        patientId: patient.id,
        diagnosticCenterId: selectedCenter.id,
        testNames: tests,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setPatient(null);
          setPhone("");
          setSelectedCenter(null);
          setCenters([]);
          setCenterQuery("");
          setTests([]);
          setNotes("");
          setTimeout(() => setSuccess(false), 3000);
        },
        onError: (err: any) =>
          setError(err?.response?.data?.message || "Failed to send referral"),
      }
    );
  }

  const canSend = !!patient && !!selectedCenter && tests.length > 0;

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
                <FlaskConical className="h-4 w-4" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-[#1e40af]">
                {t("tagline")}
              </span>

              {sent && sent.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-2 py-0.5 text-[9px] font-bold text-white">
                  <Sparkles className="h-3 w-3" />
                  {sent.length} Sent
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t("heading")}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t("subtitle")}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-green-500/30">
            <TrendingUp className="h-4 w-4" />
            {sent?.length ?? 0} Total Referrals
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          CREATE REFERRAL CARD - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#667eea] via-[#764ba2] to-[#f093fb]">
        <div className="p-5 sm:p-6 space-y-6">
          {/* STEP 1: FIND PATIENT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-xs font-bold text-white shadow-md shadow-blue-500/30">
                1
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                {t("step1Title")}
              </h2>
            </div>

            <form onSubmit={handlePatientSearch} className="flex gap-2">
              <input
                required
                placeholder={t("phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClasses}
              />
              <button
                type="submit"
                disabled={searchPatient.isPending}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searchPatient.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {t("searchBtn")}
              </button>
            </form>

            {patientNotFound && (
              <div className="rounded-xl border border-[#f5576c]/20 bg-gradient-to-r from-[#f5576c]/5 to-white p-3 text-xs font-semibold text-[#f5576c]">
                {t("patientNotFound")}
              </div>
            )}

            {patient && (
              <div className="flex items-center justify-between rounded-2xl border border-[#1e40af]/10 bg-gradient-to-r from-[#1e40af]/5 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {patient.name}{" "}
                      {patient.isGuest && (
                        <span className="ml-1 rounded-md bg-gradient-to-r from-[#f59e0b] to-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">
                          {t("guestBadge")}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-[#1e40af]" />
                        {patient.phone}
                      </span>
                      {patient.age && (
                        <span>
                          • {patient.age} {t("yrs")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPatient(null)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-[#f5576c]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* STEP 2: FIND CENTER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] text-xs font-bold text-white shadow-md shadow-green-500/30">
                2
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                {t("step2Title")}
              </h2>
            </div>

            <form onSubmit={handleCenterSearch} className="flex gap-2">
              <input
                required
                placeholder={t("centerPlaceholder")}
                value={centerQuery}
                onChange={(e) => setCenterQuery(e.target.value)}
                className={inputClasses}
              />
              <button
                type="submit"
                disabled={searchCenters.isPending}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searchCenters.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {t("searchBtn")}
              </button>
            </form>

            {centers.length > 0 && !selectedCenter && (
              <div className="grid gap-2 pt-1">
                {centers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCenter(c)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left text-sm transition hover:border-[#1e40af]/40 hover:bg-[#1e40af]/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e40af]/10 to-[#3b82f6]/10 text-[#1e40af]">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">
                          {c.centerName}
                        </span>
                        {c.city && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3 text-[#1e40af]" />
                            {c.city}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1e40af]">
                      {t("selectBtn")}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedCenter && (
              <div className="flex items-center justify-between rounded-2xl border border-[#059669]/10 bg-gradient-to-r from-[#059669]/5 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-lg shadow-green-500/30">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedCenter.centerName}
                    </p>
                    {selectedCenter.city && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3 text-[#059669]" />
                        {selectedCenter.city}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCenter(null)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-[#f5576c]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* STEP 3: TESTS & NOTES */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-xs font-bold text-white shadow-md shadow-purple-500/30">
                3
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                {t("step3Title")}
              </h2>
            </div>

            <div className="flex gap-2">
              <input
                placeholder={t("testsPlaceholder")}
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTest();
                  }
                }}
                className={inputClasses}
              />
              <button
                type="button"
                onClick={addTest}
                className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#667eea]/30 bg-white px-5 py-2.5 text-xs font-bold text-[#667eea] transition hover:bg-[#667eea]/5"
              >
                <Plus className="h-4 w-4" />
                {t("addBtn")}
              </button>
            </div>

            {tests.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tests.map((tItem) => (
                  <span
                    key={tItem}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/30"
                  >
                    {tItem}
                    <button
                      type="button"
                      onClick={() => removeTest(tItem)}
                      className="rounded-full p-0.5 hover:bg-white/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2">
              <textarea
                placeholder={t("notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputClasses} resize-none`}
                rows={2}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-[#f5576c]/20 bg-gradient-to-r from-[#f5576c]/5 to-white p-3 text-xs font-semibold text-[#f5576c]">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-[#059669]/20 bg-gradient-to-r from-[#059669]/10 to-transparent p-3 text-xs font-bold text-[#059669]">
              <CheckCircle2 className="h-4 w-4" />
              {t("successMsg")}
            </div>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend || createReferral.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
          >
            {createReferral.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {createReferral.isPending ? t("sendingBtn") : t("sendBtn")}
          </button>
        </div>
      </GradientCard>

      {/* =====================================================
          SENT REFERRALS HISTORY - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#059669]">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  {t("historyTitle")}
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t("historySub")}
              </p>
            </div>
          </div>

          {loadingSent ? (
            <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <p className="text-sm font-medium text-slate-500">
                  {t("loadingHistory")}
                </p>
              </div>
            </div>
          ) : !sent || sent.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-800">
                {t("noReferralsTitle")}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {t("noReferralsSub")}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sent.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:shadow-lg space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white shadow-md shadow-blue-500/30">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {r.patient.user?.name || r.patient.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {t("patientRef")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Building2 className="h-4 w-4 text-[#1e40af]" />
                    <span>
                      {t("centerLabel")} {r.diagnosticCenter.centerName}
                    </span>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-[#1e40af]/5 to-[#059669]/5 p-3 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t("prescribedTests")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.testNames.map((test, index) => (
                        <span
                          key={index}
                          className="rounded-lg border border-[#1e40af]/20 bg-white px-2.5 py-1 text-xs font-bold text-[#1e40af] shadow-sm"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>

                  {r.notes && (
                    <p className="text-xs italic text-slate-500">
                      <span className="font-semibold not-italic text-slate-700">
                        {t("notesLabel")}{" "}
                      </span>
                      {r.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}