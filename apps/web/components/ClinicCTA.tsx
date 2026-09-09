"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ClinicCTA() {
  const t = useTranslations("ClinicCTA");

  return (
    <section id="clinics" className="px-5 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl bg-[var(--color-primary)] p-10 text-center md:flex-row md:text-left dark:bg-[#1D44A8]">
        <div>
          <h2 className="text-xl font-bold text-white md:text-2xl">
            {t("heading")}
          </h2>
          <p className="mt-2 max-w-md text-sm text-blue-100">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href="/register"
          className="whitespace-nowrap rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-blue-50"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
