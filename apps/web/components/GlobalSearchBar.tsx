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
  
  // URL থেকে আগের সার্চ করা ডেটা নেওয়া
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    fetchSearchLocations()
      .then((data) => {
        if (Array.isArray(data)) setLocations(data);
      })
      .catch((error) => console.error("Failed to load locations:", error));
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

    // সার্চ বাটন চাপলে URL আপডেট হবে এবং রেজাল্ট ফিল্টার হবে
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* 
        ডেস্কটপে (md) সবকিছু এক লাইনে (flex-row) থাকবে।
        বর্ডার এবং শ্যাডো পুরো ফর্মটার চারপাশে থাকবে।
      */}
      <form 
        onSubmit={handleSearch} 
        className="flex flex-col md:flex-row items-center w-full bg-white rounded-2xl md:rounded-full border border-gray-200 shadow-lg p-1.5 md:p-2 gap-2 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
      >
        
        {/* ১. Location Choice Dropdown (বাম পাশে) */}
        <div className="relative w-full md:w-1/3 flex items-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-l-full px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200 shrink-0">
          <MapPin className="text-primary shrink-0" size={20} />
          
          {/* <select> ব্যবহার করা হয়েছে যাতে ইউজার শুধু অ্যাডমিনের অ্যাড করা লোকেশনই সিলেক্ট করতে পারে */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-transparent text-gray-700 font-semibold outline-none cursor-pointer appearance-none px-3 text-sm md:text-base"
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
          
          <ChevronDown className="text-gray-400 shrink-0 pointer-events-none absolute right-3" size={16} />
        </div>

        {/* ২. Search Input (মাঝখানে) */}
        <div className="flex-1 w-full flex items-center px-3 py-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "bn" ? "ডাক্তার, স্পেশালিটি বা ক্লিনিক..." : 
              locale === "hi" ? "डॉक्टर, क्लिनिक या विशेषज्ञता..." : 
              "Search doctors, clinics, specialties..."
            }
            className="w-full outline-none bg-transparent text-gray-700 text-sm md:text-base"
          />
        </div>

        {/* ৩. Search Button (ডান পাশে) */}
        <button 
          type="submit" 
          className="w-full md:w-auto bg-primary text-white font-bold py-3 px-8 rounded-xl md:rounded-full hover:bg-primary/90 transition flex justify-center items-center gap-2 shrink-0"
        >
          <Search size={18} />
          <span className="md:hidden lg:inline">Search</span>
        </button>
        
      </form>
    </div>
  );
}