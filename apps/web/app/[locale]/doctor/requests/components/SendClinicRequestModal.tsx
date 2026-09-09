"use client";

import { useState } from "react";
import {
  X,
  Search,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useSearchClinics, useDoctorSendClinicRequest } from "@/lib/hooks/useDoctor";
import type { DayOfWeek, ClinicSearchResult } from "@doctor-contract/shared";
import toast from "react-hot-toast";

interface SendClinicRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK: { label: string; value: DayOfWeek }[] = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

export function SendClinicRequestModal({
  isOpen,
  onClose,
}: SendClinicRequestModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<ClinicSearchResult | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [fee, setFee] = useState<string>("");

  // Search clinics query
  const { data: clinics = [], isLoading: isSearching } = useSearchClinics(
    searchQuery.trim() || undefined
  );

  // Send clinic request mutation
  const sendRequestMutation = useDoctorSendClinicRequest();

  if (!isOpen) return null;

  const handleSelectClinic = (clinic: ClinicSearchResult) => {
    setSelectedClinic(clinic);
  };

  const handleClearSelection = () => {
    setSelectedClinic(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClinic) {
      toast.error("Please select a clinic to send the request to.");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Please specify both start and end times for your shift.");
      return;
    }

    let parsedFee: number | undefined = undefined;
    if (fee.trim()) {
      const num = parseFloat(fee);
      if (isNaN(num) || num < 0) {
        toast.error("Please enter a valid consultation fee.");
        return;
      }
      parsedFee = num;
    }

    try {
      await sendRequestMutation.mutateAsync({
        clinicId: selectedClinic.id,
        dayOfWeek,
        startTime,
        endTime,
        fee: parsedFee,
      });

      toast.success("Connection request sent to clinic successfully.");
      onClose();
      // Reset form
      setSelectedClinic(null);
      setSearchQuery("");
      setFee("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to send clinic connection request.";
      toast.error(errorMsg);
    }
  };

  const isPending = sendRequestMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Connect with a Clinic
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit an affiliation request with your desired shift timings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* 1. Clinic Search & Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Clinic <span className="text-rose-500">*</span>
            </label>

            {selectedClinic ? (
              <div className="mt-1.5 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900/50 dark:bg-blue-950/30">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedClinic.clinicName}
                    </h4>
                    <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {[selectedClinic.address, selectedClinic.city]
                        .filter(Boolean)
                        .join(", ") || "Location unlisted"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="mt-1.5 space-y-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search clinics by name or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
                  />
                </div>

                {/* Search Results Dropdown/List */}
                <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100 bg-white dark:border-slate-700 dark:divide-slate-800 dark:bg-slate-850">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4 text-xs text-slate-400">
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-blue-600" />
                      <span>Searching clinics...</span>
                    </div>
                  ) : clinics.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      {searchQuery
                        ? "No medical clinics found matching your search."
                        : "Type above to search registered clinics."}
                    </div>
                  ) : (
                    clinics.map((clinic) => (
                      <button
                        key={clinic.id}
                        type="button"
                        onClick={() => handleSelectClinic(clinic)}
                        className="w-full flex items-center justify-between p-2.5 text-left text-xs transition hover:bg-blue-50/50 dark:hover:bg-slate-800"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {clinic.clinicName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {[clinic.address, clinic.city]
                              .filter(Boolean)
                              .join(", ") || "Location unlisted"}
                          </div>
                        </div>
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                          Select
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Day of Week */}
          <div>
            <label
              htmlFor="shift-day"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Shift Day of Week <span className="text-rose-500">*</span>
            </label>
            <select
              id="shift-day"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
              disabled={isPending}
              className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Shift Timings (Start and End) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="start-time"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                id="start-time"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isPending}
                className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
              />
            </div>

            <div>
              <label
                htmlFor="end-time"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                End Time <span className="text-rose-500">*</span>
              </label>
              <input
                id="end-time"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isPending}
                className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
              />
            </div>
          </div>

          {/* 4. Consultation Fee (Optional) */}
          <div>
            <label
              htmlFor="consultation-fee"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Consultation Fee (₹){" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="consultation-fee"
              type="number"
              min="0"
              step="10"
              placeholder="e.g. 500"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              disabled={isPending}
              className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 shadow-xs transition hover:bg-slate-100/70 focus:border-blue-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/60 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || !selectedClinic}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Send Connection Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
