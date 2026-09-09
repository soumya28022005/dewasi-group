"use client";

import { Moon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const t = useTranslations("Theme");

  return (
    <button
      type="button"
      onClick={() => {
        // Disabled for now: Dark mode changes will be implemented later
      }}
      aria-label={t("toggleLabel")}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-soft-100 hover:text-[var(--color-primary-text)]"
    >
      <Moon className="h-4 w-4" />
    </button>
  );
}
