"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

const locales = [
  { code: "bn", label: "বাংলা" },
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(code: string) {
    if (code === locale) return;
    router.replace(pathname, { locale: code });
  }

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-1 shadow-sm dark:border-soft-300 dark:bg-soft-50">
      {locales.map((l) => {
        const isActive = locale === l.code;

        return (
          <button
            key={l.code}
            type="button"
            onClick={() => switchTo(l.code)}
            aria-pressed={isActive}
            className={`
              rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-gray-500 hover:bg-white hover:text-gray-800 dark:text-ink-500 dark:hover:bg-surface dark:hover:text-ink-800"
              }
            `}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}