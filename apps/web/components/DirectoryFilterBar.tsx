"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function DirectoryFilterBar({ 
  onSearch, 
  defaultCity 
}: { 
  onSearch: (q: string) => void; 
  defaultCity?: string | null; 
}) {
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState(defaultCity || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 rounded-xl sm:rounded-full border border-slate-200 bg-white p-2 shadow-sm focus-within:border-[#14B8A6] focus-within:ring-1 focus-within:ring-[#14B8A6] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex w-full sm:w-1/3 items-center gap-2 px-3 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 py-2 sm:py-0">
        <MapPin className="h-4 w-4 text-[#14B8A6] shrink-0" />
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter city..."
          className="w-full bg-transparent text-sm outline-none text-slate-800 dark:text-slate-200"
        />
      </div>
      <div className="flex w-full flex-1 items-center gap-2 px-3 py-2 sm:py-0">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by doctor or clinic name..."
          className="w-full bg-transparent text-sm outline-none text-slate-800 dark:text-slate-200"
        />
      </div>
      <button type="submit" className="w-full sm:w-auto rounded-lg sm:rounded-full bg-[#252a67] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b4a8f]">
        Search
      </button>
    </form>
  );
}