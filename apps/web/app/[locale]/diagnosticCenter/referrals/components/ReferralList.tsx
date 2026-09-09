"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter } from "lucide-react";
import { ReferralCard } from "./ReferralCard";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

interface ReferralListProps {
  referrals: DiagnosticCenterIncomingReferral[];
  onViewDetails: (referral: DiagnosticCenterIncomingReferral) => void;
}

export function ReferralList({ referrals, onViewDetails }: ReferralListProps) {
  const t = useTranslations("DiagnosticCenterReferrals");
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side only search filtering within the currently loaded page
  const filteredReferrals = useMemo(() => {
    if (!searchQuery.trim()) return referrals;
    const q = searchQuery.toLowerCase().trim();

    return referrals.filter((ref) => {
      const patientName = (
        ref.patient?.name ||
        ref.patient?.user?.name ||
        ""
      ).toLowerCase();
      const patientPhone = (
        ref.patient?.phone ||
        ref.patient?.user?.phone ||
        ""
      ).toLowerCase();
      const clinicName = (ref.referringClinic?.clinicName || "").toLowerCase();
      const testNames = (ref.testNames || []).join(" ").toLowerCase();

      return (
        patientName.includes(q) ||
        patientPhone.includes(q) ||
        clinicName.includes(q) ||
        testNames.includes(q)
      );
    });
  }, [referrals, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Client-side Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs transition-colors sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
          {t("loadedCount")}: <span className="font-bold text-slate-900 dark:text-slate-100">{filteredReferrals.length}</span>
        </div>
      </div>

      {/* Referrals Cards Grid */}
      {filteredReferrals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Filter className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
            {t("noReferrals")}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t("noReferralsDescription")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReferrals.map((referral) => (
            <ReferralCard
              key={referral.id}
              referral={referral}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
