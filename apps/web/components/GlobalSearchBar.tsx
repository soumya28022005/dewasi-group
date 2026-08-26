"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { fetchSearchLocations } from "@/lib/api";
import { Search, MapPin, ChevronDown } from "lucide-react";

interface Location {
  id: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
}

export default function GlobalSearchBar() {
  const locale = useLocale(); 
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchSearchLocations();
        setLocations(data || []);
      } catch (error) {
        console.error("Failed to load locations", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLocations();
  }, []);

  const getLocalizedName = (loc: Location) => {
    if (locale === "bn") return loc.nameBn;
    if (locale === "hi") return loc.nameHi;
    return loc.nameEn;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedLocation) params.set("location", selectedLocation);
    else params.delete("location");

    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <form 
        onSubmit={handleSearch} 
        className="flex flex-col md:flex-row items-center w-full border border-gray-200 rounded-2xl md:rounded-full bg-white shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent p-1.5"
      >
        
        {/* 1. Location Dropdown (Left Side) */}
        <div className="relative flex items-center w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-gray-200">
          <MapPin className="absolute left-4 text-gray-400" size={20} />
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent py-3 pl-11 pr-10 text-sm md:text-base outline-none cursor-pointer appearance-none text-gray-700 font-medium disabled:opacity-50"
          >
            <option value="">
              {locale === 'bn' ? 'সব লোকেশন' : locale === 'hi' ? 'सभी स्थान' : 'All Locations'}
            </option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.nameEn}>
                {getLocalizedName(loc)}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-4 text-gray-400 pointer-events-none" size={16} />
        </div>

        {/* 2. Main Search Input (Right Side) */}
        <div className="flex flex-1 items-center w-full px-2 md:px-4 mt-2 md:mt-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "bn" ? "ডাক্তার, স্পেশালিটি বা ক্লিনিক খুঁজুন..." : 
              locale === "hi" ? "डॉक्टर, क्लिनिक या विशेषज्ञता खोजें..." : 
              "Search doctors, clinics, specialties..."
            }
            className="w-full py-3 outline-none text-gray-700 bg-transparent text-sm md:text-base"
          />
          
          {/* Search Button */}
          <button 
            type="submit"
            className="bg-primary text-white p-3 md:px-8 md:py-3 rounded-xl md:rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-bold shrink-0 ml-2"
          >
            <Search size={20} />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>
        
      </form>
    </div>
  );
}