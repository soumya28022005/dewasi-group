// apps/web/components/SearchBarWithLocations.tsx
'use client';

import { useLocale } from 'next-intl';
import { useSearchLocations } from '@/lib/hooks/useSearchLocations';
import { MapPin, Search } from 'lucide-react'; // Assuming you use lucide-react for icons

export default function SearchBarWithLocations() {
  const locale = useLocale(); // 'en', 'bn', or 'hi'
  const { data: locations, isLoading } = useSearchLocations();

  const getLocalizedName = (loc: any) => {
    if (locale === 'bn') return loc.nameBn;
    if (locale === 'hi') return loc.nameHi;
    return loc.nameEn;
  };

  const handleLocationClick = (locName: string) => {
    // Implement your search filter logic here
    console.log(`Searching in: ${locName}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* 
        flex-col: Mobile (Search bar top, buttons bottom)
        md:flex-row: Desktop (Search bar left, buttons right)
      */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* Main Search Input */}
        <div className="relative w-full md:flex-1 flex items-center bg-white border rounded-full shadow-sm overflow-hidden">
          <button className="pl-4 pr-2 text-gray-500 hover:text-primary transition">
            <MapPin size={20} /> {/* Auto Live Location Icon */}
          </button>
          
          <input 
            type="text" 
            placeholder="Search doctors, clinics, specialties..." 
            className="w-full py-3 px-2 outline-none text-gray-700"
          />
          
          <button className="bg-primary text-white px-6 py-3 hover:bg-primary/90 transition font-medium">
            <Search size={20} className="md:hidden" />
            <span className="hidden md:inline">Search</span>
          </button>
        </div>

        {/* Location Filter Buttons */}
        <div className="w-full md:w-auto flex flex-wrap justify-start md:justify-end gap-2">
          {isLoading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-full"></div>
          ) : (
            locations?.map((loc: any) => (
              <button
                key={loc.id}
                onClick={() => handleLocationClick(getLocalizedName(loc))}
                className="px-4 py-1.5 text-sm md:text-base border border-blue-200 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 whitespace-nowrap"
              >
                {getLocalizedName(loc)}
              </button>
            ))
          )}
        </div>

      </div>
    </div>
  );
}