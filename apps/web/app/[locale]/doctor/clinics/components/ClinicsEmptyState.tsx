"use client";

import { Link } from "@/i18n/routing";
import { Building2, Inbox } from "lucide-react";

export function ClinicsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        <Building2 className="h-6 w-6" />
      </div>

      <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
        You are not currently associated with any clinic.
      </h2>

      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
        Connect with medical centers to manage patient queues, consultation schedules, and practice hours across multiple healthcare locations.
      </p>

      <Link
        href="/doctor/requests"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
      >
        <Inbox className="h-4 w-4" />
        <span>Connect with a Clinic</span>
      </Link>
    </div>
  );
}
