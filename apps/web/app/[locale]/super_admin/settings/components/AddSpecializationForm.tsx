"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Loader2, CheckCircle2, AlertTriangle, Stethoscope } from "lucide-react";
import { api } from "@/lib/api";

export default function AddSpecializationForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setMessage({ type: "error", text: "Specialization Name is required." });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (description) formData.append("description", description);
      if (icon) formData.append("icon", icon);

      const res = await api.post("/specializations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setMessage({ type: "success", text: "New Specialization added successfully!" });
        setName("");
        setDescription("");
        setIcon(null);
        setPreview(null);
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to add specialization." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="bg-indigo-50 p-2.5 rounded-xl">
          <Stethoscope className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Add Specialization</h2>
          <p className="text-xs text-slate-500">Create a new doctor category with an icon.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Text Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Category Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cardiology"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Description (Optional)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description about this specialty..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Right: Icon Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Category Icon (Image)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors relative h-[142px]">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              
              {preview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={preview} alt="Preview" className="h-16 w-16 object-contain drop-shadow-sm" />
                  <span className="text-[10px] font-bold text-indigo-600">Change Icon</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">Click to upload icon</p>
                  <p className="text-[9px] text-slate-400">PNG, JPG up to 2MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-60 w-full sm:w-auto"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {isLoading ? "Saving..." : "Add Specialization"}
        </button>
      </form>
    </div>
  );
}