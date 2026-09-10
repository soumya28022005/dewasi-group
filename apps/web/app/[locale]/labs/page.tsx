"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck, Loader2, Building2, Home, Search } from "lucide-react";
import { useAllDiagnosticCenters } from "@/lib/hooks/useDiagnosticCenter";
import { fetchSearchLocations } from "@/lib/api";

interface Location {
  id: string;
  nameEn: string;
  nameBn: string;
  nameHi: string;
  isActive?: boolean;
}

export default function AllLabsPage() {
  const t = useTranslations("DiagnosticCenter");
  const locale = useLocale();
  const { data: centers = [], isLoading, error } = useAllDiagnosticCenters();
  
  // 🟢 States
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);

  // 🟢 Fetch Locations from Backend
  useEffect(() => {
    setIsLocationsLoading(true);
    fetchSearchLocations()
      .then((data) => {
        if (Array.isArray(data)) {
          setLocations(data);
        } else if (data && Array.isArray(data.data)) {
          setLocations(data.data);
        }
      })
      .catch((err) => console.error("Failed to load locations", err))
      .finally(() => setIsLocationsLoading(false));
  }, []);

  const getLocalizedName = (loc: Location) => {
    if (locale === "bn") return loc.nameBn;
    if (locale === "hi") return loc.nameHi;
    return loc.nameEn;
  };

  // 🟢 Advanced Filter Logic
  const filteredCenters = centers.filter((center: any) => {
    if (homeServiceOnly && center.hasHomeService !== true) return false;

    if (selectedCity !== "All") {
      const selected = selectedCity.toLowerCase().trim();
      const cityMatch = center.city?.toLowerCase().includes(selected);
      const addressMatch = center.address?.toLowerCase().includes(selected);
      
      if (!cityMatch && !addressMatch) return false;
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      
      const matchLabName = center.centerName?.toLowerCase().includes(query);
      const matchTestName = center.centerTests?.some((ct: any) => {
        return ct.diagnosticTest?.name?.toLowerCase().includes(query);
      });
      
      if (!matchLabName && !matchTestName) return false;
    }

    return true;
  });

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;
  if (error) return <div className="flex min-h-[60vh] flex-col items-center justify-center text-slate-500"><p>Failed to load diagnostic centers.</p></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          Available Diagnostic Centers
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Find and book tests at our trusted and verified laboratory partners.
        </p>

        {/* 🟢 Search & Filter Bar */}
        <div className="mt-8 flex w-full max-w-4xl flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:w-48">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={isLocationsLoading}
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="All">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.nameEn}>
                  {getLocalizedName(loc)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Test Name (e.g. CBC) or Lab Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <button
            onClick={() => setHomeServiceOnly(!homeServiceOnly)}
            className={`flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 text-sm font-semibold transition-all ${
              homeServiceOnly
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
            }`}
          >
            <Home className="h-4 w-4" />
            {homeServiceOnly ? "Home Service Only" : "Home Service"}
          </button>
        </div>
      </div>

      {filteredCenters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
          <Building2 className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No Labs Found</h3>
          <p className="text-slate-500">No diagnostic centers match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCenters.map((center: any) => {
            // 🟢 WhatsApp Number Formatting Logic
            const cleanWa = center.whatsapp ? center.whatsapp.replace(/[^0-9]/g, '') : '';
            const waNumber = cleanWa.length === 10 ? `91${cleanWa}` : cleanWa;

            return (
              <Link
                key={center.id}
                href={`/labs/${center.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex h-40 items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                  {center.logo ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm dark:border-slate-800">
                      <Image 
                        src={center.logo} 
                        alt={center.centerName} 
                        fill 
                        sizes="96px"
                        className="object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 shadow-sm dark:border-slate-800 dark:bg-blue-900/30">
                      <Building2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1 dark:text-white group-hover:text-blue-600">
                      {center.centerName}
                    </h3>
                    {center.isApproved && <ShieldCheck className="h-5 w-5 shrink-0 text-blue-500" />}
                  </div>

                  {(center.address || center.city) && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <p className="line-clamp-2">
                        {center.address} {center.city ? `, ${center.city}` : ""}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {center.isOnline && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span> Online
                      </span>
                    )}
                    {center.hasHomeService && (
                      <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <Home className="h-3 w-3" /> Home Service
                      </span>
                    )}
                  </div>

                  {/* 🟢 Quick Actions - Fixed Hydration Issue with <button> */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {center.phone && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = `tel:${center.phone}`;
                        }}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[11px] font-semibold hover:bg-blue-200 transition dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        📞 Call
                      </button>
                    )}
                    {center.whatsapp && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://wa.me/${waNumber}`, '_blank');
                        }}
                        className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-semibold hover:bg-green-200 transition dark:bg-green-900/30 dark:text-green-400"
                      >
                        💬 WhatsApp
                      </button>
                    )}
                    {center.googleMapsUrl && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(center.googleMapsUrl, '_blank');
                        }}
                        className="flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[11px] font-semibold hover:bg-red-200 transition dark:bg-red-900/30 dark:text-red-400"
                      >
                        📍 Maps
                      </button>
                    )}
                  </div>

                  {/* 🟢 Display max 5 tests in the UI */}
                  {center.centerTests && center.centerTests.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Available Tests:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {center.centerTests.slice(0, 5).map((ct: any) => (
                          <span 
                            key={ct.id} 
                            className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-[11px] font-medium text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50"
                          >
                            {ct.diagnosticTest?.name}
                          </span>
                        ))}
                        {center.centerTests.length > 5 && (
                          <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            +{center.centerTests.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-5">
                    <span className="inline-flex w-full items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-white dark:group-hover:bg-blue-600">
                      View Tests & Details
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}