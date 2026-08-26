"use client";

import { Search, MapPin, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import DoctorGrid from "./DoctorGrid";
import { fetchSearchLocations } from "@/lib/api"; // API থেকে লোকেশন আনার ফাংশন

// লোকেশনের টাইপ ডিফাইন করা হলো
interface Location {
  id: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
}

export default function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  // আপনার আগের স্টেটগুলো
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  // নতুন লোকেশনের স্টেটগুলো
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // পেজ লোড হলে ব্যাকএন্ড থেকে লোকেশনগুলো নিয়ে আসবে
  useEffect(() => {
    setIsLoading(true);
    fetchSearchLocations()
      .then((data) => {
        console.log("Locations received from backend:", data); // এটি কনসোলে ডেটা দেখাবে
        
        // ডেটা যদি অ্যারে হয়, তবে সরাসরি সেভ করবে
        if (Array.isArray(data)) {
          setLocations(data);
        } 
        // ডেটা যদি অবজেক্টের ভেতরে থাকে (যেমন: { data: [...] }), তবে ভেতর থেকে বের করে নেবে
        else if (data && Array.isArray(data.data)) {
          setLocations(data.data);
        }
      })
      .catch((err) => console.error("Failed to load locations", err))
      .finally(() => setIsLoading(false));
  }, []);

  // ভাষা অনুযায়ী লোকেশনের নাম ঠিক করা
  const getLocalizedName = (loc: Location) => {
    if (locale === "bn") return loc.nameBn;
    if (locale === "hi") return loc.nameHi;
    return loc.nameEn;
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setAppliedQuery(query);
    setAppliedLocation(selectedLocation); // লোকেশনটিও অ্যাপ্লাই করা হলো
  }

  return (
    <section id="search" className="bg-[var(--color-bg-soft)] px-5 py-10 md:py-14">
      <form
        onSubmit={handleSearch}
        className="mx-auto flex flex-col md:flex-row w-full max-w-4xl items-center gap-2 rounded-2xl md:rounded-full border-2 border-[var(--color-primary)]/20 bg-white p-1.5 shadow-lg shadow-blue-900/[0.06] transition-colors focus-within:border-[var(--color-primary)] dark:bg-surface dark:shadow-black/30"
      >
        
        {/* ১. লোকেশন ড্রপডাউন (বাম পাশে) */}
        <div className="relative flex w-full md:w-1/3 items-center border-b border-gray-200 md:border-b-0 md:border-r shrink-0 py-2 md:py-0 px-3">
          <MapPin className="text-[var(--color-primary)] shrink-0" size={20} />
          
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer appearance-none dark:text-ink-800 disabled:opacity-50"
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
          
          <ChevronDown className="absolute right-3 text-gray-400 pointer-events-none shrink-0" size={16} />
        </div>

        {/* ২. সার্চ ইনপুট (মাঝখানে) */}
        <div className="flex w-full flex-1 items-center px-3 py-2 md:py-0">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchUnifiedPlaceholder")}
            className="w-full min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-ink-800 dark:placeholder:text-ink-400"
          />
        </div>

        {/* ৩. সার্চ বাটন (ডান পাশে) */}
        <button
          type="submit"
          className="flex w-full md:w-auto shrink-0 items-center justify-center gap-1.5 rounded-xl md:rounded-full bg-[var(--color-primary)] px-6 py-3 md:py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          <Search className="h-4 w-4" />
          <span>{t("searchButton")}</span>
        </button>

      </form>

      {/* সার্চ করার পর রেজাল্ট দেখানোর জায়গা */}
      {(appliedQuery || appliedLocation) && (
        <div className="mx-auto mt-8 max-w-6xl">
          {/* DoctorGrid-এ location প্রপস পাঠানো হলো যাতে এটি লোকেশন অনুযায়ী ফিল্টার করতে পারে */}
          <DoctorGrid query={appliedQuery} city={appliedLocation} />
        </div>
      )}
    </section>
  );
}