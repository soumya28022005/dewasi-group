"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  Stethoscope,
  Users,
  Calendar,
  Inbox,
  FlaskConical,
  BarChart3,
  CalendarClock,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  UserCheck,
  UserX,
  XCircle,
  Building2,
  ChevronRight,
  Activity,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  useClinicProfile,
  useClinicDoctors,
  useClinicReceptionists,
  useWorkingHours,
  useHolidays,
  useReceivedDoctorRequests,
} from "@/lib/hooks/useClinic";
import { useDailyDashboard } from "@/lib/hooks/useReports";
import { useSentReferrals } from "@/lib/hooks/useReferrals";

const DAYS_ORDER = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

// Localized helper to avoid missing message console warnings in next-intl
const LOCALIZED_EXTRA: Record<string, Record<string, string>> = {
  appointmentOverview: {
    en: "Appointment Overview",
    bn: "অ্যাপয়েন্টমেন্ট ওভারভিউ",
    hi: "अपॉइंटमेंट अवलोकन",
  },
  recentPatients: {
    en: "Recent Patients",
    bn: "সাম্প্রতিক রোগী",
    hi: "हाल के मरीज",
  },
  viewAll: {
    en: "View All",
    bn: "সকল দেখুন",
    hi: "सभी देखें",
  },
  total: {
    en: "Total",
    bn: "मোট",
    hi: "कुल",
  },
  noAppointmentData: {
    en: "No appointment data today",
    bn: "আজকের কোনো অ্যাপয়েন্টমেন্ট তথ্য নেই",
    hi: "आज का कोई अपॉइंटमेंट डेटा नहीं है",
  },
  upcoming: {
    en: "Upcoming",
    bn: "আসন্ন",
    hi: "आगामी",
  },
  pending: {
    en: "Pending",
    bn: "অপেক্ষমাণ",
    hi: "लंबित",
  },
};

function useExtraText() {
  const locale = useLocale();
  return (key: string) =>
    LOCALIZED_EXTRA[key]?.[locale] || LOCALIZED_EXTRA[key]?.["en"] || key;
}

// ============================================================
// GRADIENT BORDER CARD COMPONENT
// ============================================================

function GradientCard({
  children,
  className = "",
  gradient = "from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]",
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[3.5px] bg-gradient-to-r ${gradient} shadow-lg ${className}`}>
      <div className="rounded-[calc(1rem-1px)] bg-white dark:bg-slate-900 h-full">
        {children}
      </div>
    </div>
  );
}

// ============================================================
// RESTRAINED ENTERPRISE MEDICAL DONUT CHART
// ============================================================

interface ChartSegment {
  key: string;
  label: string;
  count: number;
  color: string;
  hoverColor: string;
}

function AppointmentDonutChart({
  completed,
  upcoming,
  pending,
  cancelled,
  tDash,
}: {
  completed: number;
  upcoming: number;
  pending: number;
  cancelled: number;
  tDash: any;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const getText = useExtraText();

  const total = completed + upcoming + pending + cancelled;

  const segments: ChartSegment[] = useMemo(
    () => [
      {
        key: "completed",
        label: tDash("statusCompleted"),
        count: completed,
        color: "#10B981",
        hoverColor: "#059669",
      },
      {
        key: "upcoming",
        label: getText("upcoming"),
        count: upcoming,
        color: "#2563EB",
        hoverColor: "#1D4ED8",
      },
      {
        key: "pending",
        label: getText("pending"),
        count: pending,
        color: "#F59E0B",
        hoverColor: "#D97706",
      },
      {
        key: "cancelled",
        label: tDash("statusCancelled"),
        count: cancelled,
        color: "#E11D48",
        hoverColor: "#BE123C",
      },
    ],
    [completed, upcoming, pending, cancelled, tDash, getText]
  );

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const calculatedSlices = useMemo(() => {
    if (total === 0) return [];
    let accumulatedPercent = 0;
    return segments.map((seg) => {
      const percent = seg.count / total;
      const strokeDasharray = `${percent * circumference} ${
        circumference - percent * circumference
      }`;
      const strokeDashoffset = -accumulatedPercent * circumference;
      accumulatedPercent += percent;
      return {
        ...seg,
        percent,
        percentageFormatted: (percent * 100).toFixed(1),
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [segments, total, circumference]);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
          <Activity className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {getText("noAppointmentData")}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
          Appointments scheduled today will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-around py-2">
      <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="10"
          />

          {calculatedSlices.map((slice, index) => (
            <circle
              key={slice.key}
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={hoveredIndex === index ? slice.hoverColor : slice.color}
              strokeWidth={hoveredIndex === index ? "12" : "10"}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {hoveredIndex !== null
              ? calculatedSlices[hoveredIndex].count
              : total}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {hoveredIndex !== null
              ? calculatedSlices[hoveredIndex].label
              : getText("total")}
          </span>
        </div>
      </div>

      <div className="w-full sm:w-auto space-y-2">
        {calculatedSlices.map((slice, index) => (
          <div
            key={slice.key}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center justify-between gap-6 rounded-lg px-3 py-2 transition-colors cursor-pointer text-xs ${
              hoveredIndex === index
                ? "bg-slate-100 dark:bg-slate-800 font-semibold"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-700 dark:text-slate-300">
                {slice.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">
                {slice.count}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 w-10 text-right">
                ({slice.percentageFormatted}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD PAGE
// ============================================================

export default function ClinicDashboardPage() {
  const tDash = useTranslations("ClinicDashboard");
  const tStatus = useTranslations("Status");
  const getText = useExtraText();
  const { user } = useAuth();

  // Data Hooks
  const { data: clinic, isLoading: clinicLoading } = useClinicProfile();
  const { data: doctors, isLoading: doctorsLoading } = useClinicDoctors();
  const { data: receptionists, isLoading: receptionistsLoading } =
    useClinicReceptionists();
  const { data: dailyDashboard, isLoading: dailyLoading } = useDailyDashboard();
  const { data: requests, isLoading: requestsLoading } =
    useReceivedDoctorRequests();
  const { data: referrals, isLoading: referralsLoading } = useSentReferrals();
  const { data: workingHours } = useWorkingHours();
  const { data: holidays } = useHolidays();

  const greetingKey = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "goodMorning";
    if (hour < 17) return "goodAfternoon";
    return "goodEvening";
  }, []);

  const pendingRequests = useMemo(() => {
    return requests?.filter((req) => req.status === "PENDING") ?? [];
  }, [requests]);

  const todaySchedule = useMemo(() => {
    const dayName = DAYS_ORDER[new Date().getDay()];
    return workingHours?.find((wh) => wh.dayOfWeek === dayName);
  }, [workingHours]);

  const nextHoliday = useMemo(() => {
    if (!holidays || holidays.length === 0) return null;
    const todayStr = new Date().toISOString().split("T")[0];
    return holidays
      .filter((h) => h.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [holidays]);

  const isLoadingAll =
    clinicLoading ||
    doctorsLoading ||
    receptionistsLoading ||
    dailyLoading ||
    requestsLoading ||
    referralsLoading;

  if (isLoadingAll) {
    return (
      <div className="space-y-6 animate-pulse p-1">
        <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800 lg:col-span-2" />
          <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  const todayAppointmentsCount = dailyDashboard?.totalAppointments ?? 0;
  const statusBreakdown = dailyDashboard?.statusBreakdown ?? {};

  const completedCount = statusBreakdown["COMPLETED"] ?? 0;
  const upcomingCount =
    (statusBreakdown["CHECKED_IN"] ?? 0) + (statusBreakdown["WAITING"] ?? 0);
  const pendingCount = pendingRequests.length;
  const cancelledCount = statusBreakdown["CANCELLED"] ?? 0;

  return (
    <div className="space-y-6">
      {/* =====================================================
          1. HEADER / WELCOME CARD - Gradient Border
      ====================================================== */}
      <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
        <div className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {tDash(greetingKey)}, {user?.name || clinic?.clinicName || "Clinic Admin"}
                </h1>

                {clinic?.isApproved ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/60">
                    <Clock3 className="h-3 w-3" />
                    {tStatus("PENDING")}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {clinic?.clinicName ? `${clinic.clinicName} · ` : ""}
                {tDash("subtitle")}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>
                {new Date().toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </GradientCard>

      {/* =====================================================
          2. KPI STAT CARDS - Each with different gradient border
      ====================================================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* CARD 1: TODAY'S APPOINTMENTS - Blue Gradient */}
        <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {tDash("todayAppointments")}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {todayAppointmentsCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {statusBreakdown["WAITING"] ?? 0} waiting in queue
            </p>
          </div>
        </GradientCard>

        {/* CARD 2: ACTIVE DOCTORS - Indigo Gradient */}
        <GradientCard gradient="from-[#4f46e5] via-[#6366f1] to-[#818cf8]">
          <Link href="/clinic/add-patient" className="block h-full transition-transform hover:scale-[1.02]">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {tDash("activeDoctors")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Stethoscope className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {doctors?.length ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {doctors?.filter((d) => d.user.isActive).length ?? 0} active & available
              </p>
            </div>
          </Link>
        </GradientCard>

        {/* CARD 3: RECEPTION STAFF - Purple Gradient */}
        <GradientCard gradient="from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]">
          <Link href="/clinic/receptionists" className="block h-full transition-transform hover:scale-[1.02]">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {tDash("receptionStaff")}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {receptionists?.length ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {receptionists?.filter((r) => r.user.isActive).length ?? 0} front desk
              </p>
            </div>
          </Link>
        </GradientCard>

        {/* CARD 4: TOTAL PATIENTS - Emerald Gradient */}
        <GradientCard gradient="from-[#059669] via-[#10b981] to-[#34d399]">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {tDash("totalPatients")}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {dailyDashboard?.totalPatients ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              +{dailyDashboard?.newPatients ?? 0} new today
            </p>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          3. MIDDLE SECTION: APPOINTMENTS QUEUE & QUICK ACTIONS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* TODAY'S APPOINTMENTS QUEUE (2 COLS) - Blue/Purple Gradient */}
        <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]" className="lg:col-span-2">
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {tDash("todayAppointments")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tDash("queueOverview")}
                </p>
              </div>

              <Link
                href="/clinic/requests"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <span>{getText("viewAll")}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Status Badges Strip */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 mb-4">
              <StatusBadge
                label={tDash("statusWaiting")}
                count={statusBreakdown["WAITING"] ?? 0}
                icon={Clock3}
                colorClass="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50"
              />
              <StatusBadge
                label={tDash("statusCheckedIn")}
                count={statusBreakdown["CHECKED_IN"] ?? 0}
                icon={UserCheck}
                colorClass="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50"
              />
              <StatusBadge
                label={tDash("statusCompleted")}
                count={statusBreakdown["COMPLETED"] ?? 0}
                icon={CheckCircle2}
                colorClass="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
              />
              <StatusBadge
                label={tDash("statusCancelled")}
                count={statusBreakdown["CANCELLED"] ?? 0}
                icon={XCircle}
                colorClass="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50"
              />
              <StatusBadge
                label={tDash("statusAbsent")}
                count={statusBreakdown["ABSENT"] ?? 0}
                icon={UserX}
                colorClass="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              />
            </div>

            {/* Queue Items */}
            {!dailyDashboard?.queueSummary ||
            dailyDashboard.queueSummary.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No active appointments queued for today.
                </p>
                <Link
                  href="/clinic/requests"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {tDash("viewRequests")}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {dailyDashboard.queueSummary.slice(0, 4).map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                        #{q.currentToken}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {q.doctorName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Token #{q.currentToken} of {q.lastTokenIssued}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GradientCard>

        {/* QUICK ACTIONS PANEL (1 COL) - Pink/Orange Gradient */}
        <GradientCard gradient="from-[#ec4899] via-[#f43f5e] to-[#fb923c]">
          <div className="p-5">
            <div>
              <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {tDash("quickActions")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct management shortcuts
                </p>
              </div>

              <div className="space-y-2">
                <QuickActionButton
                  href="/clinic/requests"
                  icon={Inbox}
                  label={tDash("viewRequests")}
                  badge="Requests"
                />
                <QuickActionButton
                  href="/clinic/doctors"
                  icon={Stethoscope}
                  label={tDash("addDoctor")}
                />
                <QuickActionButton
                  href="/clinic/receptionists"
                  icon={Users}
                  label={tDash("addReceptionist")}
                />
                <QuickActionButton
                  href="/clinic/referrals"
                  icon={FlaskConical}
                  label={tDash("createReferral")}
                />
                <QuickActionButton
                  href="/clinic/schedule"
                  icon={CalendarClock}
                  label={tDash("manageSchedule")}
                />
                <QuickActionButton
                  href="/clinic/reports"
                  icon={BarChart3}
                  label={tDash("viewReports")}
                />
                <QuickActionButton
                  href="/clinic"
                  icon={Building2}
                  label={tDash("analyticsSnapshot")}
                />
              </div>
            </div>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          4. BOTTOM SECTION: DONUT CHART & RECENT PATIENTS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* APPOINTMENT OVERVIEW — DONUT CHART (2 COLS) - Cyan/Blue Gradient */}
        <GradientCard gradient="from-[#0891b2] via-[#06b6d4] to-[#3b82f6]" className="lg:col-span-2">
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {getText("appointmentOverview")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status breakdown of appointments today
                </p>
              </div>

              <Link
                href="/clinic/reports"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <span>{tDash("viewReports")}</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <AppointmentDonutChart
              completed={completedCount}
              upcoming={upcomingCount}
              pending={pendingCount}
              cancelled={cancelledCount}
              tDash={tDash}
            />
          </div>
        </GradientCard>

        {/* RECENT PATIENTS / SCHEDULE SNAPSHOT (1 COL) - Teal/Green Gradient */}
        <GradientCard gradient="from-[#0d9488] via-[#14b8a6] to-[#10b981]">
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {getText("recentPatients")}
              </h2>
              <Link
                href="/clinic/reports"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {getText("viewAll")}
              </Link>
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 p-3.5 space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Today's Status
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    todaySchedule && !todaySchedule.isClosed
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60"
                      : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60"
                  }`}
                >
                  {todaySchedule && !todaySchedule.isClosed
                    ? tDash("openStatus")
                    : tDash("closedStatus")}
                </span>
              </div>
              {todaySchedule && !todaySchedule.isClosed && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hours: {todaySchedule.openTime || "09:00"} -{" "}
                  {todaySchedule.closeTime || "18:00"}
                </p>
              )}
            </div>

            {/* Next Holiday Card */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50 p-3.5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {tDash("nextHoliday")}
              </p>
              {nextHoliday ? (
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {nextHoliday.date}
                  </span>
                  <span className="truncate text-slate-500 dark:text-slate-400">
                    {nextHoliday.reason || "Closure"}
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {tDash("noUpcomingHolidays")}
                </p>
              )}
            </div>
          </div>
        </GradientCard>
      </div>

      {/* =====================================================
          5. PENDING ACTIONS & ALERTS - Amber/Orange Gradient
      ====================================================== */}
      <GradientCard gradient="from-[#f59e0b] via-[#f97316] to-[#ef4444]">
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {tDash("pendingActions")}
            </h2>
          </div>

          {pendingRequests.length === 0 && (!referrals || referrals.length === 0) ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tDash("noPendingActions")}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pendingRequests.length > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <div>
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                      {pendingRequests.length} {tDash("pendingRequests")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400">
                      {tDash("pendingDoctorRequestsDesc")}
                    </p>
                  </div>
                  <Link
                    href="/clinic/requests"
                    className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-xs"
                  >
                    {tDash("viewRequests")}
                  </Link>
                </div>
              )}

              {referrals && referrals.length > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
                  <div>
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                      {referrals.length} Sent Referrals
                    </p>
                    <p className="mt-0.5 text-[11px] text-blue-700 dark:text-blue-400">
                      {tDash("sentReferralsDesc")}
                    </p>
                  </div>
                  <Link
                    href="/clinic/referrals"
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    {tDash("viewReferrals")}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

// ============================================================
// RESTRAINED SUB-COMPONENTS
// ============================================================

function StatusBadge({
  label,
  count,
  icon: Icon,
  colorClass,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg border p-2.5 text-center transition-all ${colorClass}`}
    >
      <Icon className="h-3.5 w-3.5 mb-1" />
      <span className="text-base font-bold">{count}</span>
      <span className="mt-0.5 text-[10px] font-medium tracking-tight">
        {label}
      </span>
    </div>
  );
}

function QuickActionButton({
  href,
  icon: Icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-slate-500 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400 transition-colors" />
        <span className="truncate">{label}</span>
      </div>

      {badge ? (
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/60">
          {badge}
        </span>
      ) : (
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
      )}
    </Link>
  );
}