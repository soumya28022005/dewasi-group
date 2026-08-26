"use client";

import { useTranslations } from "next-intl";
import AvailableDoctorsGrid from "@/components/AvailableDoctorsGrid";
import { Building2, Sparkles } from "lucide-react";

function GradientCard({
  children,
  className = "",
  gradient = "from-[#2563EB] to-[#14B8A6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-[24px] p-[2px] bg-gradient-to-r ${gradient} shadow-sm transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="rounded-[calc(24px-2px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

export default function AvailableDoctorsPage() {
  const t = useTranslations("AvailableDoctors");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      <GradientCard gradient="from-[#2563EB] to-[#14B8A6]">
        <div className="relative overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#1e40af] dark:text-blue-400">
                  {t("findDoctors") || "Find Doctors"}
                </p>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {t("heading") || "Available Doctors"}
              </h1>

              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                {t("subheading") || "Doctors who are currently open for immediate consultation"}
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <div className="flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-800 px-4 py-2 border border-slate-100 dark:border-slate-700">
                <Sparkles className="h-4 w-4 text-[#0F766E]" />
                <span className="text-sm font-semibold text-[#1e40af] dark:text-blue-300">
                  {t("trustedNetwork") || "Trusted Healthcare Network"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>

      <div className="mt-8">
        <AvailableDoctorsGrid />
      </div>
    </main>
  );
}