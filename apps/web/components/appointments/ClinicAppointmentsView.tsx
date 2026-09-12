"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Users,
  Stethoscope,
  Phone,
  Filter,
  Award,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useClinicAppointments } from "@/lib/hooks/useAppointments";
import type { AppointmentStatus } from "@doctor-contract/shared";

// ------------------------------------------------------------
// This view is shared by /clinic/appointments and
// /receptionist/appointments. All it needs is the list of doctors the
// caller is allowed to filter by (their clinic's doctors, or the
// receptionist's assigned doctors) — the appointment data itself always
// comes from GET /appointments/clinic, which the backend scopes to the
// caller's OWN clinic no matter which doctor is picked here (Part 11).
// ------------------------------------------------------------

type SimpleDoctor = { id: string; name: string };

const STATUS_OPTIONS: { value: AppointmentStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "WAITING", label: "Waiting" },
  { value: "CHECKED_IN", label: "Checked In" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ABSENT", label: "Absent" },
];

const STATUS_BADGE: Record<string, string> = {
  WAITING: "bg-amber-100 text-amber-700",
  CHECKED_IN: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  ABSENT: "bg-slate-200 text-slate-600",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function formatDoctorName(name?: string) {
  if (!name?.trim()) return "Dr. Doctor";
  const clean = name.trim().replace(/^(dr\.?\s*)+/i, "").trim();
  return clean ? `Dr. ${clean}` : "Dr. Doctor";
}

export default function ClinicAppointmentsView({
  doctors,
  isLoadingDoctors,
  title = "Appointments",
  subtitle = "All appointments at your clinic — filter by doctor, status, or date.",
}: {
  doctors: SimpleDoctor[];
  isLoadingDoctors?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const [doctorId, setDoctorId] = useState<string>("ALL");
  const [status, setStatus] = useState<AppointmentStatus | "ALL">("ALL");
  // "ALL" dates = no date filter at all (full history); default to today
  // since that's what a receptionist is looking at 95% of the time.
  const [dateFilter, setDateFilter] = useState<string>(todayStr());
  const [showAllDates, setShowAllDates] = useState(false);

  const filters = useMemo(
    () => ({
      doctorId: doctorId === "ALL" ? undefined : doctorId,
      status: status === "ALL" ? undefined : status,
      date: showAllDates ? undefined : dateFilter,
    }),
    [doctorId, status, dateFilter, showAllDates]
  );

  const { data: appointments, isLoading, isFetching, refetch } = useClinicAppointments(filters);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-3 py-4 sm:space-y-6 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ==================================================
          FILTER BAR (Part 10) — doctor / status / date
          ================================================== */}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-3 sm:p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </div>

        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          disabled={isLoadingDoctors}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#252a67]"
        >
          <option value="ALL">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {formatDoctorName(d.name)}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AppointmentStatus | "ALL")}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#252a67]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          disabled={showAllDates}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#252a67] disabled:opacity-50"
        />

        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            checked={showAllDates}
            onChange={(e) => setShowAllDates(e.target.checked)}
          />
          All dates
        </label>
      </div>

      {/* ==================================================
          RESULTS
          ================================================== */}

      {isLoading ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#252a67] border-t-transparent" />
        </div>
      ) : (appointments ?? []).length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-10 text-center">
          <Calendar className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">No appointments match these filters</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
              <tr>
                <th className="px-3 py-2.5 sm:px-4">Token</th>
                <th className="px-3 py-2.5 sm:px-4">Patient</th>
                <th className="px-3 py-2.5 sm:px-4">Doctor</th>
                <th className="px-3 py-2.5 sm:px-4">Date</th>
                <th className="px-3 py-2.5 sm:px-4">Queue</th>
                <th className="px-3 py-2.5 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments!.map((appt) => {
                const patientName = appt.patient?.user?.name || appt.patient?.name || "—";
                const patientPhone = appt.patient?.user?.phone || "";
                return (
                  <tr key={appt.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 font-bold text-slate-900 sm:px-4">
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-3 w-3 text-[#252a67]" />#{appt.token}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 sm:px-4">
                      <div className="font-semibold text-slate-800">{patientName}</div>
                      {patientPhone && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Phone className="h-2.5 w-2.5" />
                          {patientPhone}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 sm:px-4">
                      <span className="inline-flex items-center gap-1">
                        <Stethoscope className="h-3 w-3 text-[#14B8A6]" />
                        {formatDoctorName(appt.doctor?.user?.name)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 sm:px-4">
                      {new Date(appt.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 sm:px-4">
                      {appt.queue?.currentToken != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Activity className="h-3 w-3 text-slate-400" />
                          Now #{appt.queue.currentToken}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2.5 sm:px-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          STATUS_BADGE[appt.status] ?? STATUS_BADGE.WAITING
                        }`}
                      >
                        {appt.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <Users className="h-3 w-3" />
        Showing appointments for your clinic only — never another clinic's, even for a shared doctor.
      </p>
    </div>
  );
}
