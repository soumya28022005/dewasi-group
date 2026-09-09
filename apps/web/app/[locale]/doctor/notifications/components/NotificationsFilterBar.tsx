"use client";

import { Search, Filter, X } from "lucide-react";
import type { NotificationType } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

export type StatusFilter = "ALL" | "UNREAD" | "READ";
export type CategoryFilter = "ALL" | "REQUESTS" | "APPOINTMENTS" | "CLINIC" | "SYSTEM";

interface NotificationsFilterBarProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function NotificationsFilterBar({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}: NotificationsFilterBarProps) {
  const hasActiveFilters = statusFilter !== "ALL" || categoryFilter !== "ALL" || searchQuery.length > 0;

  return (
    <GradientCard variant="slate">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
            {(["ALL", "UNREAD", "READ"] as StatusFilter[]).map((st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {st === "ALL" && "All"}
                  {st === "UNREAD" && "Unread"}
                  {st === "READ" && "Read"}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown & Search Bar */}
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center md:justify-end">
            {/* Category Dropdown */}
            <div className="relative min-w-[170px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-8 text-xs font-semibold text-slate-700 transition-colors focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">All Categories</option>
                <option value="REQUESTS">Connection Requests</option>
                <option value="APPOINTMENTS">Appointments</option>
                <option value="CLINIC">Clinic Approval & Status</option>
                <option value="SYSTEM">Verification & System</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-8 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Counter & Clear Filters */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <span>
            Showing <strong className="font-semibold text-slate-700 dark:text-slate-300">{filteredCount}</strong> of{" "}
            <strong className="font-semibold text-slate-700 dark:text-slate-300">{totalCount}</strong> notifications
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onStatusChange("ALL");
                onCategoryChange("ALL");
                onSearchChange("");
              }}
              className="font-bold text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </GradientCard>
  );
}
