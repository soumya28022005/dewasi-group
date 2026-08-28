"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Loader2, Pencil, X, Navigation, CheckCircle2, Building2, Sparkles } from "lucide-react";
import DoctorGrid from "@/components/DoctorGrid";
import { useLocationCity } from "@/lib/hooks/useLocationCity";

function GradientCard({
  children,
  className = "",
  gradient = "from-[#252a67] via-[#3b4a8f] to-[#14B8A6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-[24px] p-[3px] bg-gradient-to-r ${gradient} shadow-[0_4px_20px_-6px_rgba(37,42,103,0.3)] transition-all duration-300 hover:shadow-[0_12px_36px_-8px_rgba(20,184,166,0.35)] ${className}`}>
      <div className="rounded-[calc(24px-3px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

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
      
      <GradientCard>
        <div className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#252a67]/[0.06] to-[#14B8A6]/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#252a67] to-[#3b4a8f] text-white shadow-sm">
                  <Building2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#252a67] dark:text-blue-300">
                  {t("findDoctors") || "Find Doctors"}
                </p>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {t("heading")}
              </h1>

              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                {t("subheading") || "Search for trusted doctors near you"}
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <div className="flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-800 px-4 py-2 border border-slate-100 dark:border-slate-700">
                <Sparkles className="h-4 w-4 text-[#14B8A6]" />
                <span className="text-sm font-semibold text-[#252a67] dark:text-blue-300">
                  {t("trustedNetwork") || "Trusted Healthcare Network"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>

      <div className="mt-6">
        <GradientCard gradient="from-[#252a67] via-[#3b4a8f] to-[#14B8A6]">
          <div className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#252a67] to-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20">
                <MapPin className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                {status === "loading" && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin text-[#14B8A6]" />
                    {t("locationDetecting")}
                  </div>
                )}

                {status !== "loading" && !editingLocation && city && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {t("locationShowing")}{" "}
                      <strong className="text-[#252a67]">{city}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#252a67] to-[#14B8A6] px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      {t("active") || "Active"}
                    </span>
                  </div>
                )}

                {status !== "loading" && !editingLocation && !city && (
                  <span className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <Navigation className="h-4 w-4 text-[#14B8A6]" />
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
                      className="flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[#14B8A6]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      disabled={!manualInput.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#14B8A6] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#14B8A6]/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

              {status !== "loading" && !editingLocation && (
                <div className="flex shrink-0 gap-2">
                  {city && (
                    <button
                      type="button"
                      onClick={() => {
                        setManualInput(city);
                        setEditingLocation(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#14B8A6]/25 bg-white px-4 py-2.5 text-xs font-semibold text-[#0f766e] transition hover:bg-[#14B8A6]/5"
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
                      {t("clear") || "Clear"}
                    </button>
                  )}
                  {!city && (
                    <button
                      type="button"
                      onClick={() => setEditingLocation(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#252a67] to-[#14B8A6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#14B8A6]/25 transition hover:-translate-y-0.5 hover:shadow-xl"
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

      <div className="mt-8">
        <DoctorGrid query="" city={city ?? undefined} />
      </div>
    </main>
  );
}