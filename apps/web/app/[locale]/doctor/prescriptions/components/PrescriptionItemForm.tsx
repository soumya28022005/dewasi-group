"use client";

import { useState } from "react";
import { Plus, Pill } from "lucide-react";
import toast from "react-hot-toast";

export type RawPrescriptionItem = {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
};

interface PrescriptionItemFormProps {
  onAddItem: (item: RawPrescriptionItem) => void;
}

const FREQUENCY_PRESETS = ["1-0-1 (BD)", "1-1-1 (TDS)", "1-0-0 (OD)", "0-0-1 (HS)", "As Needed (PRN)"];
const DURATION_PRESETS = ["3 days", "5 days", "7 days", "10 days", "14 days", "1 month"];

export function PrescriptionItemForm({ onAddItem }: PrescriptionItemFormProps) {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("500mg");
  const [frequency, setFrequency] = useState("1-0-1 (BD)");
  const [duration, setDuration] = useState("5 days");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!medicineName.trim()) {
      toast.error("Please enter medicine name");
      return;
    }
    if (!dosage.trim()) {
      toast.error("Please enter dosage");
      return;
    }

    onAddItem({
      medicineName: medicineName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      instructions: instructions.trim() || undefined,
    });

    // Reset fields for next medicine
    setMedicineName("");
    setInstructions("");
    toast.success("Medicine added to prescription!");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span>Add Medicine Item</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Medicine Name */}
        <div className="space-y-1 sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Medicine Name *
          </label>
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="e.g. Paracetamol / Amoxicillin"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Dosage */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Dosage *
          </label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 500mg / 10ml / 1 Tablet"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Frequency *
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {FREQUENCY_PRESETS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Duration *
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {DURATION_PRESETS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Instructions */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Instructions (Optional)
          </label>
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. After meals / Before bed"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex h-8 items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Medicine</span>
        </button>
      </div>
    </div>
  );
}
