import { MapPin } from "lucide-react";
import { ExtendedDoctor } from "@/types/doctor";

export default function DoctorClinicInfo({
  doctor,
  compact = false,
}: {
  doctor: ExtendedDoctor;
  /** When true, shows only the primary (or first) clinic plus a "+N more" chip,
   * so cards in a grid stay a consistent height regardless of how many clinics
   * a doctor is associated with. */
  compact?: boolean;
}) {
  const location = doctor.clinic?.city ?? doctor.clinic?.clinicName;

  if (doctor.allClinics && doctor.allClinics.length > 0) {
    const sorted = compact
      ? [...doctor.allClinics].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      : doctor.allClinics;
    const visible = compact ? sorted.slice(0, 1) : sorted;
    const remaining = compact ? sorted.length - visible.length : 0;

    return (
      <div className="mt-2 flex flex-col gap-2 w-full">
        {visible.map((clinicItem) => (
          <div key={clinicItem.id} className="flex flex-wrap items-center justify-start gap-1.5 text-xs">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-[#0F766E]" />
              <span className="truncate max-w-[140px]" title={clinicItem.clinicName}>
                {clinicItem.city ? `${clinicItem.clinicName}, ${clinicItem.city}` : clinicItem.clinicName}
              </span>
            </div>
            {clinicItem.associationDetails?.fee != null && (
              <span className="font-bold text-[#252a67] dark:text-blue-400 ml-1">
                ₹{clinicItem.associationDetails.fee}
              </span>
            )}
            {clinicItem.isPrimary && (
              <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold dark:bg-blue-900/30 dark:text-blue-400">
                Primary
              </span>
            )}
          </div>
        ))}
        {remaining > 0 && (
          <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            +{remaining} more location{remaining === 1 ? "" : "s"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1.5 w-full">
      {location && (
        <div className="flex items-center justify-start gap-1 truncate text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
          <span className="truncate">{location}</span>
        </div>
      )}
      {doctor.fee != null && (
        <div className="flex items-center justify-start gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <span className="text-[#252a67] dark:text-blue-400">₹{doctor.fee}</span>
          <span className="text-slate-400">/ visit</span>
        </div>
      )}
    </div>
  );
}