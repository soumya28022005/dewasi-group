"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import type { DoctorLeave } from "@doctor-contract/shared";
import { GradientCard } from "@/components/ui/GradientCard";

interface LeaveCalendarProps {
  leaves: DoctorLeave[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenMarkLeaveModal: (date?: string) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function LeaveCalendar({
  leaves,
  selectedDate,
  onSelectDate,
  onOpenMarkLeaveModal,
}: LeaveCalendarProps) {
  // Calendar view state (year and month)
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const parts = selectedDate.split("-").map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return new Date(parts[0], parts[1] - 1, 1);
      }
    }
    return new Date();
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    onSelectDate(todayStr);
  };

  // Map leave dates for fast lookup: date string (YYYY-MM-DD) -> DoctorLeave
  const leavesMap = useMemo(() => {
    const map = new Map<string, DoctorLeave>();
    leaves.forEach((l) => {
      if (l.date) {
        map.set(l.date, l);
      }
    });
    return map;
  }, [leaves]);

  // Generate calendar grid dates
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isLeave: boolean;
      leaveReason?: string | null;
      isToday: boolean;
      isSelected: boolean;
    }> = [];

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(prevDay).padStart(2, "0")}`;
      const leave = leavesMap.get(dateStr);

      days.push({
        dateStr,
        dayNumber: prevDay,
        isCurrentMonth: false,
        isLeave: Boolean(leave),
        leaveReason: leave?.reason,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const leave = leavesMap.get(dateStr);

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isLeave: Boolean(leave),
        leaveReason: leave?.reason,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      });
    }

    // Next month padding to complete 35 or 42 grid cells
    const totalCells = days.length <= 35 ? 35 : 42;
    const remainingCells = totalCells - days.length;
    for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
      const leave = leavesMap.get(dateStr);

      days.push({
        dateStr,
        dayNumber: nextDay,
        isCurrentMonth: false,
        isLeave: Boolean(leave),
        leaveReason: leave?.reason,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
      });
    }

    return days;
  }, [year, month, leavesMap, selectedDate]);

  // Leaves in current month count
  const currentMonthLeavesCount = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return leaves.filter((l) => l.date && l.date.startsWith(prefix)).length;
  }, [leaves, year, month]);

  const selectedLeave = leavesMap.get(selectedDate);

  return (
    <GradientCard variant="indigo" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
        {/* Header with Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <CalendarIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Leave Calendar
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {MONTH_NAMES[month]} {year} • {currentMonthLeavesCount}{" "}
                {currentMonthLeavesCount === 1 ? "leave scheduled" : "leaves scheduled"}
              </p>
            </div>
          </div>

          {/* Controls: Prev, Today, Next, Mark Leave */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCurrentMonth}
                className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenMarkLeaveModal(selectedDate)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Mark Leave</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-900/60" />
            <span>Marked Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-blue-500 bg-blue-50 dark:bg-blue-950" />
            <span>Selected Date</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-blue-600 dark:text-blue-400">●</span>
            <span>Today</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-800/60">
            {WEEKDAY_NAMES.map((day) => (
              <div
                key={day}
                className="py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 bg-white dark:bg-slate-900">
            {calendarDays.map((cell) => {
              const {
                dateStr,
                dayNumber,
                isCurrentMonth,
                isLeave,
                leaveReason,
                isToday,
                isSelected,
              } = cell;

              let cellStyle = "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200";

              if (!isCurrentMonth) {
                cellStyle = "bg-slate-50/50 text-slate-400 dark:bg-slate-800/30 dark:text-slate-600";
              }

              if (isLeave) {
                cellStyle =
                  "bg-rose-50/90 text-rose-900 font-semibold dark:bg-rose-950/40 dark:text-rose-200";
              }

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => {
                    onSelectDate(dateStr);
                  }}
                  onDoubleClick={() => onOpenMarkLeaveModal(dateStr)}
                  className={`group relative flex min-h-[64px] flex-col justify-between border-b border-r border-slate-100 p-1.5 text-left transition hover:bg-blue-50/40 dark:border-slate-800 dark:hover:bg-blue-950/20 ${cellStyle} ${
                    isSelected
                      ? "ring-2 ring-inset ring-blue-500 dark:ring-blue-400"
                      : ""
                  }`}
                  title={
                    isLeave
                      ? `Leave: ${leaveReason || "No reason specified"}`
                      : `Date: ${dateStr}`
                  }
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        isToday
                          ? "bg-blue-600 font-bold text-white shadow-xs"
                          : ""
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {isLeave && (
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                    )}
                  </div>

                  {isLeave ? (
                    <div className="mt-1 line-clamp-1 rounded bg-rose-100/90 px-1 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                      {leaveReason || "On Leave"}
                    </div>
                  ) : (
                    <div className="h-3" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Summary Banner */}
      {selectedDate && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Selected: {selectedDate}
            </span>
            {selectedLeave ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                <AlertCircle className="h-3 w-3" />
                Leave scheduled ({selectedLeave.reason || "No reason"})
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Available for consultations
              </span>
            )}
          </div>

          {!selectedLeave && (
            <button
              type="button"
              onClick={() => onOpenMarkLeaveModal(selectedDate)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Mark this date
            </button>
          )}
        </div>
      )}
      </div>
    </GradientCard>
  );
}
