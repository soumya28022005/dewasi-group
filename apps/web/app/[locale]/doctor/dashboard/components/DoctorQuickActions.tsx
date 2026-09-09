"use client";

import {
  ListOrdered,
  FileText,
  CalendarClock,
  Users,
  Building2,
  FlaskConical,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { GradientCard } from "./GradientCard";

interface ActionItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const DOCTOR_ACTIONS: ActionItem[] = [
  {
    title: "Live Patient Queue",
    href: "/doctor/queue",
    icon: ListOrdered,
    badge: "Live",
  },
  {
    title: "Write Prescription",
    href: "/doctor/prescriptions",
    icon: FileText,
  },
  {
    title: "Manage Schedule & Slots",
    href: "/doctor/schedule",
    icon: CalendarClock,
  },
  {
    title: "Patient Directory",
    href: "/doctor/patients",
    icon: Users,
  },
  {
    title: "Clinic Affiliations",
    href: "/doctor/clinics",
    icon: Building2,
  },
  {
    title: "Diagnostic Referrals",
    href: "/doctor/referrals",
    icon: FlaskConical,
  },
  {
    title: "Earnings & Payouts",
    href: "/doctor/earnings",
    icon: TrendingUp,
  },
];

export function DoctorQuickActions() {
  return (
    <GradientCard gradient="from-[#ec4899] via-[#f43f5e] to-[#fb7185]" className="h-full">
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct clinical & management shortcuts
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {DOCTOR_ACTIONS.map(({ title, href, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-blue-400"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400" />
                  <span>{title}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {badge && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      {badge}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
