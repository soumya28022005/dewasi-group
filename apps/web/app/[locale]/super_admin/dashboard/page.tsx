"use client";

import { useTranslations } from "next-intl";
import {
  Users,
  UserCheck,
  Stethoscope,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useAdminStats } from "@/lib/hooks/useAdmin";
import { AdminDashboardHeader } from "./components/AdminDashboardHeader";
import { AdminStatCard } from "./components/AdminStatCard";
import { AdminPendingAlert } from "./components/AdminPendingAlert";
import { AdminResourceBreakdown } from "./components/AdminResourceBreakdown";
import { AdminQuickActions } from "./components/AdminQuickActions";
import { AdminDashboardSkeleton } from "./components/AdminDashboardSkeleton";
import { AdminDashboardError } from "./components/AdminDashboardError";

export default function AdminDashboardPage() {
  const t = useTranslations("AdminDashboard");
  const {
    data: stats,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAdminStats();

  if (isLoading && !stats) {
    return <AdminDashboardSkeleton />;
  }

  if (isError && !stats) {
    return <AdminDashboardError onRetry={() => refetch()} />;
  }

  // Safe metrics fallback (zero fake/mock data, handles transient undefined safely)
  const totalUsers = stats?.totalUsers ?? 0;
  const totalPatients = stats?.totalPatients ?? 0;
  const totalDoctors = stats?.totalDoctors ?? 0;
  const verifiedDoctors = stats?.verifiedDoctors ?? 0;
  const unverifiedDoctors = stats?.unverifiedDoctors ?? 0;
  const totalClinics = stats?.totalClinics ?? 0;
  const approvedClinics = stats?.approvedClinics ?? 0;
  const pendingClinics = stats?.pendingClinics ?? 0;

  return (
    <div className="space-y-6">
      {/* Header with Title, Locale Date Badge, Role Pill, and Refresh Trigger */}
      <AdminDashboardHeader
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Pending Action or Operational Health Banner */}
      <AdminPendingAlert
        pendingClinics={pendingClinics}
        unverifiedDoctors={unverifiedDoctors}
      />

      {/* Main KPI Stats Grid (8 Core Platform Metrics) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Users */}
        <AdminStatCard
          title={t("totalUsers")}
          value={totalUsers}
          subtitle={t("totalUsersDesc")}
          icon={Users}
          colorScheme="blue"
          href="/super_admin/users"
          linkText={t("viewDetails")}
        />

        {/* 2. Total Patients */}
        <AdminStatCard
          title={t("totalPatients")}
          value={totalPatients}
          subtitle={t("totalPatientsDesc")}
          icon={UserCheck}
          colorScheme="indigo"
          href="/super_admin/users"
          linkText={t("manage")}
        />

        {/* 3. Total Doctors */}
        <AdminStatCard
          title={t("totalDoctors")}
          value={totalDoctors}
          subtitle={t("totalDoctorsDesc")}
          icon={Stethoscope}
          colorScheme="cyan"
          href="/super_admin/doctors"
          linkText={t("viewDetails")}
        />

        {/* 4. Verified Doctors */}
        <AdminStatCard
          title={t("verifiedDoctors")}
          value={verifiedDoctors}
          subtitle={`${unverifiedDoctors} ${t("unverifiedDoctors").toLowerCase()}`}
          icon={CheckCircle2}
          colorScheme="emerald"
          badgeText={t("verifiedBadge")}
          badgeVariant="healthy"
          href="/super_admin/doctors"
          linkText={t("manage")}
        />

        {/* 5. Unverified Doctors (Pending Verification) */}
        <AdminStatCard
          title={t("unverifiedDoctors")}
          value={unverifiedDoctors}
          subtitle={unverifiedDoctors > 0 ? t("pendingAction") : t("operational")}
          icon={AlertTriangle}
          colorScheme={unverifiedDoctors > 0 ? "amber" : "emerald"}
          badgeText={unverifiedDoctors > 0 ? t("pendingAction") : t("operational")}
          badgeVariant={unverifiedDoctors > 0 ? "warning" : "healthy"}
          href="/super_admin/doctors"
          linkText={t("verifyDoctors")}
        />

        {/* 6. Total Clinics */}
        <AdminStatCard
          title={t("totalClinics")}
          value={totalClinics}
          subtitle={t("totalClinicsDesc")}
          icon={Building2}
          colorScheme="purple"
          href="/super_admin/clinics"
          linkText={t("viewDetails")}
        />

        {/* 7. Approved Clinics */}
        <AdminStatCard
          title={t("approvedClinics")}
          value={approvedClinics}
          subtitle={`${pendingClinics} ${t("pendingClinics").toLowerCase()}`}
          icon={ShieldCheck}
          colorScheme="emerald"
          badgeText={t("approvedBadge")}
          badgeVariant="healthy"
          href="/super_admin/clinics"
          linkText={t("manage")}
        />

        {/* 8. Pending Clinics (Awaiting Approval) */}
        <AdminStatCard
          title={t("pendingClinics")}
          value={pendingClinics}
          subtitle={pendingClinics > 0 ? t("pendingAction") : t("operational")}
          icon={Clock}
          colorScheme={pendingClinics > 0 ? "amber" : "emerald"}
          badgeText={pendingClinics > 0 ? t("pendingAction") : t("operational")}
          badgeVariant={pendingClinics > 0 ? "warning" : "healthy"}
          href="/super_admin/clinics"
          linkText={t("reviewClinics")}
        />
      </div>

      {/* Resource Breakdown Overview Cards with Progress Bars */}
      {stats && <AdminResourceBreakdown stats={stats} />}

      {/* Direct Quick Action Management Cards */}
      <AdminQuickActions
        pendingClinics={pendingClinics}
        unverifiedDoctors={unverifiedDoctors}
      />
    </div>
  );
}
