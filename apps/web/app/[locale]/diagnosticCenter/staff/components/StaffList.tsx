"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Users, Filter } from "lucide-react";
import { StaffCard } from "./StaffCard";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface StaffListProps {
  staff: DiagnosticCenterStaff[];
  onChangePassword: (staff: DiagnosticCenterStaff) => void;
}

export function StaffList({ staff, onChangePassword }: StaffListProps) {
  const t = useTranslations("DiagnosticCenterStaff");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const name = (s.name || s.user?.name || "").toLowerCase();
      const email = (s.email || s.user?.email || "").toLowerCase();
      const phone = (s.phone || s.user?.phone || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);

      const isActive = s.isActive ?? s.user?.isActive ?? true;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "INACTIVE" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [staff, searchQuery, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-colors sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "ALL"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {t("allStaff")} ({staff.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("ACTIVE")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "ACTIVE"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {t("active")}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("INACTIVE")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === "INACTIVE"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {t("inactive")}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      {/* Staff Grid or Empty Filter State */}
      {filteredStaff.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Filter className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
            {t("noStaffTitle")}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t("noStaffDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {filteredStaff.map((s, idx) => (
            <StaffCard
              key={s.id || s.userId || s.user?.id || `staff-${idx}`}
              staff={s}
              onChangePassword={onChangePassword}
            />
          ))}
        </div>
      )}
    </div>
  );
}
