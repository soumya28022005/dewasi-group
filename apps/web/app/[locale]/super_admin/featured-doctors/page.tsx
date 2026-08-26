"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Star, Trash2, Loader2, User, Search, ChevronDown, Check } from "lucide-react";
import { api, setFeaturedDoctor, fetchFeaturedDoctors } from "@/lib/api";

export default function FeaturedDoctorsPage() {
  const [featuredDoctors, setFeaturedDoctors] = useState<any[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [featuredOrder, setFeaturedOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Searchable Dropdown States
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [featuredRes, allDoctorsRes] = await Promise.all([
        fetchFeaturedDoctors(),
        // Update this line to fetch from the doctors endpoint directly
        api.get('/doctors?limit=100').then(res => res.data?.data?.doctors || res.data?.data || [])
      ]);
      setFeaturedDoctors(featuredRes);
      setAllDoctors(allDoctorsRes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedDoctorId("");
    setSearchQuery("");
    setFeaturedOrder(0);
  };

  // Filter doctors based on search query
  const filteredDoctors = allDoctors.filter(doc => 
    doc.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDoctor = (doc: any) => {
    // doc.id is now strictly the DoctorId
    setSelectedDoctorId(doc.id); 
    setSearchQuery(doc.user?.name || "Unknown"); 
    setIsDropdownOpen(false);
  };

  // Add to Featured
  const handleAddFeatured = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return alert("Please search and select a doctor from the list");

    setIsSubmitting(true);
    try {
      await setFeaturedDoctor(selectedDoctorId, true, Number(featuredOrder));
      setIsModalOpen(false);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Failed to add featured doctor", error);
      alert("Failed to add. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove from Featured
  const handleRemoveFeatured = async (doctorId: string) => {
    if (!confirm("Are you sure you want to remove this doctor from the featured list?")) return;

    try {
      await setFeaturedDoctor(doctorId, false, 0);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Failed to remove", error);
      alert("Failed to remove doctor");
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Doctors</h1>
          <p className="text-sm text-slate-500">Manage doctors highlighted on the home page</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Featured Doctor
        </button>
      </div>

      {/* Featured Doctors List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : featuredDoctors.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-slate-500">
            <Star className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p>No featured doctors added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Display Order</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Doctor Info</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Clinic</th>
                  <th className="p-4 text-right font-semibold text-slate-600 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {featuredDoctors.map((doc) => (
                  <tr key={doc.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                        {doc.featuredOrder}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {doc.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500">{doc.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {doc.clinic?.clinicName || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRemoveFeatured(doc.id)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Remove from featured"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Doctor Modal with Searchable Dropdown */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 animate-in zoom-in-95 duration-200">
            <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">Add Featured Doctor</h2>
            
            <form onSubmit={handleAddFeatured} className="space-y-5">
              
              {/* Searchable Custom Dropdown */}
              <div ref={dropdownRef} className="relative">
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Search & Select Doctor
                </label>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      if (selectedDoctorId) setSelectedDoctorId(""); // Clear selection if typing
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-xl border border-slate-300 bg-transparent pl-10 pr-10 py-2.5 text-sm outline-none transition-colors focus:border-amber-600 focus:ring-1 focus:ring-amber-600 dark:border-slate-700 dark:text-white"
                  />
                  <ChevronDown className={`absolute right-3 top-3 h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {filteredDoctors.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">No doctors found matching "{searchQuery}"</div>
                    ) : (
                      filteredDoctors.map((doc) => {
                        // Directly use doc.id since we are fetching from doctors API
                        const isSelected = selectedDoctorId === doc.id;
                        
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => handleSelectDoctor(doc)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                              isSelected 
                                ? "bg-amber-50 dark:bg-amber-500/10" 
                                : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-4">
                              {/* Use doc.user.name and doc.user.email */}
                              <p className={`truncate font-medium ${isSelected ? "text-amber-700 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"}`}>
                                {doc.user?.name}
                              </p>
                              <p className="truncate text-xs text-slate-500">{doc.user?.email}</p>
                            </div>
                            {isSelected && <Check className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Display Order */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={featuredOrder}
                  onChange={(e) => setFeaturedOrder(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-amber-600 focus:ring-1 focus:ring-amber-600 dark:border-slate-700 dark:text-white"
                  placeholder="e.g., 1"
                />
                <p className="mt-1.5 text-xs text-slate-500">Lower numbers appear first on the platform.</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedDoctorId}
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Featured Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}