"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Loader2, Pencil, X, Navigation, CheckCircle2, Building2, Sparkles } from "lucide-react";
import DoctorGrid from "@/components/DoctorGrid";
import { useLocationCity } from "@/lib/hooks/useLocationCity";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-[28px] p-[2.5px] bg-gradient-to-r ${gradient} shadow-xl transition-all duration-300 hover:shadow-2xl ${className}`}>
      <div className="rounded-[calc(28px-2.5px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DoctorsPage() {
  const t = useTranslations("DoctorSearch");
  const { city, status, setManualCity } = useLocationCity();

  const [editingLocation, setEditingLocation] = useState(false);
  const [manualInput, setManualInput] = useState("");

  function applyManualLocation(e: React.FormEvent) {
    e.preventDefault();
    if (manualInput.trim()) {
      setManualCity(manualInput.trim());
      setEditingLocation(false);
    }
  }

  function clearLocation() {
    setManualCity("");
    setManualInput("");
    setEditingLocation(false);
  }

  function cancelEditing() {
    setEditingLocation(false);
    setManualInput("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* =====================================================
          PAGE HEADER - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#059669]">
        <div className="relative overflow-hidden p-6 sm:p-8">
          {/* Decorative gradient blobs */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#3b82f6]/10 to-[#059669]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#1e3a8a]/5 to-[#3b82f6]/10 blur-2xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30">
                  <Building2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1e40af]">
                  Find Doctors
                </p>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t("heading")}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Search for trusted doctors near you
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e3a8a]/5 to-[#059669]/5 px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#059669]" />
                <span className="text-xs font-semibold text-[#1e40af]">
                  Trusted Healthcare Network
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          LOCATION BAR - Premium Gradient
      ====================================================== */}
      <div className="mt-6">
        <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-lg shadow-green-500/30">
                <MapPin className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {status === "loading" && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin text-[#059669]" />
                    {t("locationDetecting")}
                  </div>
                )}

                {status !== "loading" && !editingLocation && city && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {t("locationShowing")}{" "}
                      <strong className="text-[#059669]">{city}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#059669] to-[#10b981] px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  </div>
                )}

                {status !== "loading" && !editingLocation && !city && (
                  <span className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <Navigation className="h-4 w-4 text-[#059669]" />
                    {t("locationPrompt")}
                  </span>
                )}

                {editingLocation && (
                  <form onSubmit={applyManualLocation} className="flex flex-wrap items-center gap-2 w-full">
                    <input
                      autoFocus
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder={t("locationInputPlaceholder") || "Enter city name..."}
                      className="flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#059669] focus:ring-[3px] focus:ring-[#059669]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      disabled={!manualInput.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t("locationApply")}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      {t("cancel") || "Cancel"}
                    </button>
                  </form>
                )}
              </div>

              {/* Action Buttons */}
              {status !== "loading" && !editingLocation && (
                <div className="flex shrink-0 gap-2">
                  {city && (
                    <button
                      type="button"
                      onClick={() => {
                        setManualInput(city);
                        setEditingLocation(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#059669]/20 bg-white px-4 py-2.5 text-xs font-semibold text-[#059669] transition hover:bg-[#059669]/5"
                    >
                      <Pencil className="h-4 w-4" />
                      {t("locationChange")}
                    </button>
                  )}
                  {city && (
                    <button
                      type="button"
                      onClick={clearLocation}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#f5576c]/20 bg-white px-4 py-2.5 text-xs font-semibold text-[#f5576c] transition hover:bg-[#f5576c]/5"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </button>
                  )}
                  {!city && (
                    <button
                      type="button"
                      onClick={() => setEditingLocation(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <MapPin className="h-4 w-4" />
                      {t("locationChange")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          DOCTOR GRID
      ====================================================== */}
      <div className="mt-8">
        <DoctorGrid query="" city={city ?? undefined} />
      </div>
    </main>
  );
}