"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api";

const DEFAULT_SPECIALTIES = [
  { id: "1", name: "Physician", iconUrl: "/categories/physician.png" },
  { id: "2", name: "Pediatrics", iconUrl: "/categories/pediatrics.png" },
  { id: "3", name: "Gynecology", iconUrl: "/categories/gynecology.png" },
  { id: "4", name: "Orthopedic", iconUrl: "/categories/orthopedic.png" },
  { id: "5", name: "ENT", iconUrl: "/categories/ent.png" },
  { id: "6", name: "Dental", iconUrl: "/categories/dental.png" },
  { id: "7", name: "Dermatology", iconUrl: "/categories/dermatology.png" },
  { id: "8", name: "Ophthalmology", iconUrl: "/categories/ophthalmology.png" },
  { id: "9", name: "Surgeon", iconUrl: "/categories/surgeon.png" },
  { id: "10", name: "Cardiology", iconUrl: "/categories/cardiology.png" },
  { id: "11", name: "Gastroenterology", iconUrl: "/categories/gastroenterology.png" },
  { id: "12", name: "Pulmonology", iconUrl: "/categories/pulmonology.png" },
  { id: "13", name: "Urology", iconUrl: "/categories/urology.png" },
  { id: "14", name: "Endocrinology", iconUrl: "/categories/endocrinology.png" },
  { id: "15", name: "Neurology", iconUrl: "/categories/neurology.png" },
  { id: "16", name: "Nephrology", iconUrl: "/categories/nephrology.png" },
  { id: "17", name: "Rheumatology", iconUrl: "/categories/rheumatology.png" },
  { id: "18", name: "Psychiatry", iconUrl: "/categories/psychiatry.png" },
  { id: "19", name: "Oncology", iconUrl: "/categories/oncology.png" },
  { id: "20", name: "Physiotherapy", iconUrl: "/categories/physiotherapy.png" },
  { id: "21", name: "Nutrition", iconUrl: "/categories/nutrition.png" },
];

export default function Specialties() {
  const t = useTranslations("Specialties");
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const res = await api.get("/specializations");
        if (res.data?.success && res.data.data?.specializations?.length > 0) {
          setSpecialties(res.data.data.specializations);
        } else {
          setSpecialties(DEFAULT_SPECIALTIES);
        }
      } catch {
        setSpecialties(DEFAULT_SPECIALTIES);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpecialties();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Section Header */}
      <div className="mx-auto mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">
          {t("title") || "Search by Specialty"}
        </h2>
        <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-[#2563EB] to-[#0F766E]" />
      </div>

      {/* Category Grid - Follow exact structure but premium */}
      <div
        id="categories"
        className="flex flex-wrap justify-center gap-3 md:gap-6"
      >
        {specialties.map((spec) => (
          <Link
            key={spec.id}
            href={`/doctors?specialty=${encodeURIComponent(spec.name)}`}
            className="
              group relative block w-[7rem] h-[7rem] md:w-40 md:h-40
              rounded-2xl
              border border-slate-200
              bg-white
              p-2 pt-3 md:p-4 md:pt-4
              text-center
              cursor-pointer
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-lg
              hover:border-[#2563EB]/40
              dark:border-slate-700
              dark:bg-slate-900
              dark:hover:border-[#2563EB]/50
            "
          >
            {/* Icon */}
            <div className="mb-2 flex justify-center">
              {spec.iconUrl ? (
                <img
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  src={spec.iconUrl}
                  alt={spec.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=Icon";
                  }}
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#0F766E] text-2xl font-bold text-white">
                  {spec.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="font-medium text-slate-700 text-xs md:text-sm px-1 truncate dark:text-slate-200">
              {spec.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}