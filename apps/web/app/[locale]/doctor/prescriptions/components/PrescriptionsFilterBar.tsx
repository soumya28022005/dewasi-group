"use client";

import { Search, Building2, X } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface PrescriptionsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedClinicId: string;
  onClinicChange: (clinicId: string) => void;
  clinics: { id: string; clinicName: string }[];
  totalCount: number;
  filteredCount: number;
}

export function PrescriptionsFilterBar({
  searchQuery,
  onSearchChange,
  selectedClinicId,
  onClinicChange,
  clinics,
  totalCount,
  filteredCount,
}: PrescriptionsFilterBarProps) {
  const hasActiveFilters = searchQuery.length > 0 || selectedClinicId !== "ALL";

  return (
    <GradientCard variant="slate">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by patient name, diagnosis, or medicine..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Clinic Selector & Counter */}
        <div className="flex items-center gap-3">
          {clinics.length > 0 && (
            <div className="relative min-w-[180px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <select
                value={selectedClinicId}
                onChange={(e) => onClinicChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-8 text-xs font-semibold text-slate-700 transition-colors focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">All Associated Clinics</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinicName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong className="font-semibold text-slate-700 dark:text-slate-300">{filteredCount}</strong> of{" "}
            <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalCount}</strong> prescriptions
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                onClinicChange("ALL");
              }}
              className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </GradientCard>
  );
}
