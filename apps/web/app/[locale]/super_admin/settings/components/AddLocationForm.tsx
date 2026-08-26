"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { addSearchLocation } from "@/lib/api";
import { toast } from "react-hot-toast";
import { MapPin, Plus } from "lucide-react";

export default function AddLocationForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameBn: "",
    nameHi: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addSearchLocation(formData);
      toast.success("Search location added successfully!");
      setFormData({ nameEn: "", nameBn: "", nameHi: "" });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to add search location."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <MapPin className="h-4 w-4" />
        </div>
        <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Manage Search Locations
        </h2>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        Add custom locations in English, Bengali, and Hindi for the public search bar filters.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            English Name
          </label>
          <input
            name="nameEn"
            type="text"
            required
            value={formData.nameEn}
            onChange={handleChange}
            placeholder="e.g. Durgapur"
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-xs outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Bengali Name (বাংলা)
          </label>
          <input
            name="nameBn"
            type="text"
            required
            value={formData.nameBn}
            onChange={handleChange}
            placeholder="উদাঃ দুর্গাপুর"
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-xs outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            Hindi Name (हिन्दी)
          </label>
          <input
            name="nameHi"
            type="text"
            required
            value={formData.nameHi}
            onChange={handleChange}
            placeholder="उदा: दुर्गापुर"
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-xs outline-none transition focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{loading ? "Adding..." : "Add Location"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}