"use client";

import { Search, X } from "lucide-react";
import { GradientCard } from "@/components/ui/GradientCard";

interface ReferralsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function ReferralsFilterBar({
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}: ReferralsFilterBarProps) {
  return (
    <GradientCard variant="slate">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by patient name, center, or test name..."
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

        {/* Count Summary */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong className="font-semibold text-slate-700 dark:text-slate-300">{filteredCount}</strong> of{" "}
          <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalCount}</strong> referrals
        </div>
      </div>
    </GradientCard>
  );
}
