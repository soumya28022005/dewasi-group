"use client";

import { useTranslations } from "next-intl";
import { Inbox } from "lucide-react";

export function ReferralEmptyState() {
  const t = useTranslations("DiagnosticCenterReferrals");

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
        <Inbox className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        {t("noReferrals")}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        {t("noReferralsDescription")}
      </p>
    </div>
  );
}
