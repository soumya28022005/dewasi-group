"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Inbox,
  Building2,
  Stethoscope,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useDoctorDashboard } from "@/lib/hooks/useDoctor";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatCard } from "./components/StatCard";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardError } from "./components/DashboardError";
import { DoctorQuickActions } from "./components/DoctorQuickActions";
import { DoctorQueueOverview } from "./components/DoctorQueueOverview";

export default function DoctorDashboardPage() {
  const t = useTranslations("DoctorDashboard");
  const { data: stats, isLoading, isError, error, refetch } = useDoctorDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : undefined;
    return <DashboardError onRetry={() => refetch()} message={errorMessage} />;
  }

  const waitingToday = stats?.waitingToday ?? 0;
  const completedToday = stats?.completedToday ?? 0;
  const totalToday = stats?.totalAppointmentsToday ?? 0;
  const activeQueueStatus = stats?.activeQueueStatus || "Active";

  return (
    <div className="space-y-6">
      {/* 1. Greeting Banner Header with Verified Badge & Date */}
      <DashboardHeader />

      {/* 2. Primary 4 KPI Stat Cards with Vibrant Gradient Borders */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("todayAppointments")}
          value={totalToday}
          subtitle={`${waitingToday} waiting in queue`}
          icon={CalendarDays}
          colorScheme="blue"
        />

        <StatCard
          title={t("completedToday")}
          value={completedToday}
          subtitle={t("completedTodaySub")}
          icon={CheckCircle2}
          colorScheme="emerald"
        />

        <StatCard
          title={t("waitingPatients")}
          value={waitingToday}
          subtitle={t("waitingPatientsSub")}
          icon={Clock}
          colorScheme="amber"
        />

        <StatCard
          title={t("pendingRequests")}
          value={stats?.pendingRequestsCount ?? 0}
          subtitle={t("pendingRequestsSub")}
          icon={Inbox}
          colorScheme="indigo"
        />
      </div>

      {/* 3. Secondary 2 KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title={t("associatedClinics")}
          value={stats?.associatedClinicsCount ?? 0}
          subtitle={t("associatedClinicsSub")}
          icon={Building2}
          colorScheme="cyan"
        />

        <StatCard
          title={t("avgConsultationTime")}
          value={
            stats?.avgConsultationMinutes !== undefined &&
            stats?.avgConsultationMinutes !== null
              ? `${stats.avgConsultationMinutes} ${t("mins")}`
              : undefined
          }
          subtitle={t("avgConsultationTimeSub")}
          icon={Stethoscope}
          colorScheme="purple"
        />
      </div>

      {/* 4. Split Queue Overview & Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Live Queue Status & Patient Consultation Overview */}
        <div className="lg:col-span-2">
          <DoctorQueueOverview
            waitingCount={waitingToday}
            completedCount={completedToday}
            totalAppointments={totalToday}
            activeStatus={activeQueueStatus}
          />
        </div>

        {/* Right 1 Col: Quick Actions Shortcuts with Gradient Border */}
        <div className="lg:col-span-1">
          <DoctorQuickActions />
        </div>
      </div>
    </div>
  );
}
