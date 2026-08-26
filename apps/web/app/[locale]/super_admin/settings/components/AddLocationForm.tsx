"use client";

import React, { useState, useEffect } from "react";
import { addSearchLocation, fetchAdminLocations, toggleSearchLocation, deleteSearchLocation } from "@/lib/api";
import { toast } from "react-hot-toast";
import { MapPin, Plus, Trash2, Power } from "lucide-react";

export default function AddLocationForm() {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({ nameEn: "", nameBn: "", nameHi: "" });

  const loadLocations = async () => {
    try {
      const data = await fetchAdminLocations();
      setLocations(data);
    } catch (error) {
      console.error("Failed to load locations");
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSearchLocation({ ...formData, isActive: true });
      toast.success("Location added!");
      setFormData({ nameEn: "", nameBn: "", nameHi: "" });
      loadLocations(); // রিফ্রেশ লিস্ট
    } catch (error: any) {
      toast.error("Failed to add location.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleSearchLocation(id, !currentStatus);
      toast.success(currentStatus ? "Location paused" : "Location activated");
      loadLocations();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteSearchLocation(id);
      toast.success("Location deleted");
      loadLocations();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-indigo-600" />
        <h2 className="text-sm font-bold text-slate-900">Manage Locations</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {/* আপনার আগের ইনপুট ফিল্ডগুলো (nameEn, nameBn, nameHi) এখানে থাকবে... */}
        <div className="flex gap-2">
           <input name="nameEn" value={formData.nameEn} onChange={handleChange} placeholder="English Name" required className="border p-2 rounded text-sm w-full" />
           <input name="nameBn" value={formData.nameBn} onChange={handleChange} placeholder="Bengali Name" required className="border p-2 rounded text-sm w-full" />
           <input name="nameHi" value={formData.nameHi} onChange={handleChange} placeholder="Hindi Name" required className="border p-2 rounded text-sm w-full" />
        </div>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition">
          <Plus className="h-4 w-4 inline mr-1" /> Add
        </button>
      </form>

      {/* Location List with Toggle & Delete */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 mb-3">EXISTING LOCATIONS</h3>
        {locations.map((loc) => (
          <div key={loc.id} className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
            <span className={`text-sm font-semibold ${!loc.isActive ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {loc.nameEn}
            </span>
            <div className="flex gap-2">
              <button onClick={() => handleToggle(loc.id, loc.isActive)} className={`p-1.5 rounded-lg text-white ${loc.isActive ? 'bg-amber-500' : 'bg-emerald-500'}`} title={loc.isActive ? "Pause" : "Activate"}>
                <Power className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(loc.id)} className="p-1.5 rounded-lg bg-rose-500 text-white" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}