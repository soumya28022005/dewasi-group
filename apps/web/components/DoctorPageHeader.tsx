import React from "react";
import { Building2, Sparkles } from "lucide-react";

interface DoctorPageHeaderProps {
  title: string;
  subtitle: string;
}

export function DoctorPageHeader({ title, subtitle }: DoctorPageHeaderProps) {
  return (
    <div className="relative rounded-[24px] p-[2px] bg-gradient-to-r from-[#2563EB] to-[#14B8A6] mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#2563EB] rounded-lg p-1.5">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#2563EB] font-bold text-sm tracking-widest uppercase">
              FIND DOCTORS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg">
            {subtitle}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-full border border-slate-100 dark:border-slate-700">
          <Sparkles className="w-4 h-4 text-[#0F766E]" />
          <span className="text-sm font-semibold text-[#1E3A8A] dark:text-blue-300">
            Trusted Healthcare Network
          </span>
        </div>
      </div>
    </div>
  );
}