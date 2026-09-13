"use client";

import { Clock } from "lucide-react";
import type { DoctorScheduleSlot } from "@doctor-contract/shared";

function sessionLabel(startTime: string) {
  if (startTime < "12:00") return "Morning";
  if (startTime < "17:00") return "Afternoon";
  return "Evening";
}

export function SessionSelector({
  schedules,
  selectedScheduleId,
  onSelect,
}: {
  schedules: DoctorScheduleSlot[];
  selectedScheduleId: string;
  onSelect: (scheduleId: string) => void;
}) {
  const activeSchedules = schedules.filter((s) => s.isActive);

  // A single session doesn't need a picker cluttering the screen.
  if (activeSchedules.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
      <span className="flex items-center gap-1 pl-1 text-[11px] font-bold text-slate-400">
        <Clock className="h-3.5 w-3.5" />
        Session:
      </span>
      {activeSchedules.map((schedule) => {
        const isSelected = schedule.id === selectedScheduleId;
        return (
          <button
            key={schedule.id}
            type="button"
            onClick={() => onSelect(schedule.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              isSelected
                ? "bg-[#252a67] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {sessionLabel(schedule.startTime)} · {schedule.startTime}–{schedule.endTime}
          </button>
        );
      })}
    </div>
  );
}
