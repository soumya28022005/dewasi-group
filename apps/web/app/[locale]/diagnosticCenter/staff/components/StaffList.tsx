"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Search,
  Users,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { StaffCard } from "./StaffCard";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

interface StaffListProps {
  staff: DiagnosticCenterStaff[];
  onChangePassword: (staff: DiagnosticCenterStaff) => void;
}

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export function StaffList({
  staff,
  onChangePassword,
}: StaffListProps) {
  const t = useTranslations("DiagnosticCenterStaff");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const name = (
        s.name ||
        s.user?.name ||
        ""
      ).toLowerCase();

      const email = (
        s.email ||
        s.user?.email ||
        ""
      ).toLowerCase();

      const phone = (
        s.phone ||
        s.user?.phone ||
        ""
      ).toLowerCase();

      const q = searchQuery
        .toLowerCase()
        .trim();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q);

      const isActive =
        s.isActive ??
        s.user?.isActive ??
        true;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "INACTIVE" && !isActive);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    staff,
    searchQuery,
    statusFilter,
  ]);

  const activeCount = useMemo(
    () =>
      staff.filter(
        (s) =>
          s.isActive ??
          s.user?.isActive ??
          true,
      ).length,
    [staff],
  );

  const inactiveCount =
    staff.length - activeCount;

  const hasFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "ALL";

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("ALL");
  }

  function getFilterButtonClass(
    filter: StatusFilter,
  ) {
    const active =
      statusFilter === filter;

    return `
      relative
      inline-flex
      h-9
      items-center
      gap-1.5
      rounded-xl
      px-3
      text-[10px]
      font-bold
      transition-all
      duration-200
      ${
        active
          ? `
            bg-slate-950
            text-white
            shadow-[0_6px_18px_-8px_rgba(15,23,42,0.65)]
            dark:bg-white
            dark:text-slate-950
          `
          : `
            text-slate-500
            hover:bg-slate-100
            hover:text-slate-900
            dark:text-slate-400
            dark:hover:bg-slate-800
            dark:hover:text-white
          `
      }
    `;
  }

  return (
    <section className="space-y-4">
      {/* =========================================
          Toolbar
      ========================================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[22px]
          border
          border-slate-200/80
          bg-white
          p-3
          shadow-[0_6px_30px_-18px_rgba(15,23,42,0.18)]
          dark:border-slate-800
          dark:bg-slate-950
          dark:shadow-[0_6px_30px_-18px_rgba(0,0,0,0.55)]
        "
      >
        {/* Accent */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-blue-500
            to-transparent
            opacity-60
          "
        />

        <div
          className="
            flex
            flex-col
            gap-3
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* =====================================
              Filter Section
          ===================================== */}

          <div className="flex min-w-0 items-center gap-2">
            {/* Filter Icon */}
            <div
              className="
                hidden
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                text-slate-400
                sm:flex
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-500
              "
            >
              <SlidersHorizontal
                className="h-3.5 w-3.5"
                strokeWidth={1.9}
              />
            </div>

            {/* Tabs */}
            <div
              className="
                flex
                min-w-0
                items-center
                rounded-xl
                border
                border-slate-200
                bg-slate-50/70
                p-0.5
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              {/* All */}
              <button
                type="button"
                onClick={() =>
                  setStatusFilter("ALL")
                }
                className={getFilterButtonClass(
                  "ALL",
                )}
              >
                <Users
                  className="h-3 w-3"
                  strokeWidth={2}
                />

                <span>
                  {t("allStaff")}
                </span>

                <span
                  className={`
                    ml-0.5
                    rounded-md
                    px-1.5
                    py-0.5
                    text-[9px]
                    ${
                      statusFilter === "ALL"
                        ? "bg-white/10 text-white dark:bg-slate-950/10 dark:text-slate-950"
                        : "bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }
                  `}
                >
                  {staff.length}
                </span>
              </button>

              {/* Active */}
              <button
                type="button"
                onClick={() =>
                  setStatusFilter("ACTIVE")
                }
                className={getFilterButtonClass(
                  "ACTIVE",
                )}
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-500
                  "
                />

                <span>
                  {t("active")}
                </span>

                <span
                  className={`
                    ml-0.5
                    rounded-md
                    px-1.5
                    py-0.5
                    text-[9px]
                    ${
                      statusFilter === "ACTIVE"
                        ? "bg-white/10 text-white dark:bg-slate-950/10 dark:text-slate-950"
                        : "bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }
                  `}
                >
                  {activeCount}
                </span>
              </button>

              {/* Inactive */}
              <button
                type="button"
                onClick={() =>
                  setStatusFilter("INACTIVE")
                }
                className={getFilterButtonClass(
                  "INACTIVE",
                )}
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-slate-400
                  "
                />

                <span>
                  {t("inactive")}
                </span>

                <span
                  className={`
                    ml-0.5
                    rounded-md
                    px-1.5
                    py-0.5
                    text-[9px]
                    ${
                      statusFilter === "INACTIVE"
                        ? "bg-white/10 text-white dark:bg-slate-950/10 dark:text-slate-950"
                        : "bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }
                  `}
                >
                  {inactiveCount}
                </span>
              </button>
            </div>
          </div>

          {/* =====================================
              Search
          ===================================== */}

          <div className="flex items-center gap-2">
            <div
              className="
                group/search
                relative
                w-full
                lg:w-[280px]
                xl:w-[320px]
              "
            >
              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  h-3.5
                  w-3.5
                  -translate-y-1/2
                  text-slate-400
                  transition-colors
                  group-focus-within/search:text-blue-500
                "
                strokeWidth={1.9}
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value,
                  )
                }
                placeholder={t(
                  "searchPlaceholder",
                )}
                className="
                  h-9
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/70
                  pl-10
                  pr-9
                  text-[11px]
                  font-medium
                  text-slate-900
                  outline-none
                  transition-all
                  duration-200
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:bg-white
                  focus:shadow-[0_0_0_4px_rgba(59,130,246,0.07)]
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                  dark:focus:border-blue-500
                  dark:focus:bg-slate-900
                  dark:focus:shadow-[0_0_0_4px_rgba(59,130,246,0.10)]
                "
              />

              {/* Clear Search */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  aria-label="Clear search"
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-6
                    w-6
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition-colors
                    hover:bg-slate-200
                    hover:text-slate-700
                    dark:hover:bg-slate-800
                    dark:hover:text-slate-200
                  "
                >
                  <X
                    className="h-3 w-3"
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>

            {/* Clear All */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  hidden
                  h-9
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-[10px]
                  font-bold
                  text-slate-500
                  transition-all
                  hover:border-slate-300
                  hover:bg-slate-50
                  hover:text-slate-900
                  sm:inline-flex
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:text-slate-400
                  dark:hover:border-slate-700
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filter summary */}
        {hasFilters && (
          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              border-t
              border-slate-100
              pt-3
              dark:border-slate-800
            "
          >
            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.1em]
                text-slate-400
              "
            >
              Showing
            </span>

            <span
              className="
                rounded-md
                bg-blue-50
                px-1.5
                py-0.5
                text-[9px]
                font-bold
                text-blue-600
                dark:bg-blue-950/40
                dark:text-blue-400
              "
            >
              {filteredStaff.length}
            </span>

            <span
              className="
                text-[10px]
                text-slate-400
              "
            >
              of {staff.length} staff members
            </span>
          </div>
        )}
      </div>

      {/* =========================================
          Results
      ========================================= */}

      {filteredStaff.length === 0 ? (
        <div
          className="
            relative
            flex
            min-h-[300px]
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-[26px]
            border
            border-slate-200/80
            bg-white
            px-6
            py-12
            text-center
            shadow-[0_8px_40px_-20px_rgba(15,23,42,0.14)]
            dark:border-slate-800
            dark:bg-slate-950
            dark:shadow-[0_8px_40px_-20px_rgba(0,0,0,0.50)]
          "
        >
          {/* Background glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-48
              w-48
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-slate-100
              blur-3xl
              dark:bg-slate-900
            "
          />

          <div className="relative">
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-[20px]
                border
                border-slate-200
                bg-slate-50
                text-slate-400
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-500
              "
            >
              {hasFilters ? (
                <Search
                  className="h-6 w-6"
                  strokeWidth={1.7}
                />
              ) : (
                <Filter
                  className="h-6 w-6"
                  strokeWidth={1.7}
                />
              )}
            </div>
          </div>

          <h3
            className="
              relative
              mt-5
              text-[15px]
              font-bold
              tracking-[-0.015em]
              text-slate-900
              dark:text-white
            "
          >
            {hasFilters
              ? "No matching staff"
              : t("noStaffTitle")}
          </h3>

          <p
            className="
              relative
              mt-1.5
              max-w-sm
              text-[11px]
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {hasFilters
              ? "Try adjusting your search or status filter to find what you are looking for."
              : t("noStaffDesc")}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                relative
                mt-5
                inline-flex
                h-9
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-[10px]
                font-bold
                text-slate-700
                shadow-sm
                transition-all
                hover:-translate-y-px
                hover:border-slate-300
                hover:bg-slate-50
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-slate-700
                dark:hover:bg-slate-800
              "
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          {filteredStaff.map(
            (s, idx) => (
              <StaffCard
                key={
                  s.id ||
                  s.userId ||
                  s.user?.id ||
                  `staff-${idx}`
                }
                staff={s}
                onChangePassword={
                  onChangePassword
                }
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}
