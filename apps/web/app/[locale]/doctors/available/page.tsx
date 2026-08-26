"use client";

import { useTranslations } from "next-intl";
import AvailableDoctorsGrid from "@/components/AvailableDoctorsGrid";
import { Activity, Clock, CheckCircle2, Sparkles, Users, Stethoscope } from "lucide-react";

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#059669]",
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

export default function AvailableDoctorsPage() {
  const t = useTranslations("AvailableDoctors");

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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#10b981] text-white shadow-lg shadow-green-500/30">
                  <Activity className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#059669]">
                  {t("heading")}
                </p>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t("heading")}
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {t("subheading") || "Doctors who are currently open for consultation."}
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e3a8a]/5 to-[#059669]/5 px-4 py-2">
                <Clock className="h-4 w-4 text-[#059669]" />
                <span className="text-xs font-semibold text-[#1e40af]">
                  Live Availability
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          AVAILABLE DOCTORS GRID
      ====================================================== */}
      <div className="mt-8">
        <AvailableDoctorsGrid />
      </div>
    </main>
  );
}