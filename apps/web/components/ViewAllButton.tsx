"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ViewAllButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div className="mt-6 flex justify-center">
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}