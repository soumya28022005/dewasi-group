"use client";

import {
  useDiagnosticCenterProfile,
  useDiagnosticCenterStaff,
} from "@/lib/hooks/useDiagnosticCenter";
import { DashboardHeader } from "./components/DashboardHeader";
import { CenterOverviewCard } from "./components/CenterOverviewCard";
import { StaffSummaryCard } from "./components/StaffSummaryCard";
import { DashboardQuickActions } from "./components/DashboardQuickActions";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { DashboardError } from "./components/DashboardError";

export default function DiagnosticCenterDashboardPage() {
  const {
    data: center,
    isLoading: loadingProfile,
    isFetching: fetchingProfile,
    isError: errorProfile,
    refetch: refetchProfile,
  } = useDiagnosticCenterProfile();

  const {
    data: staff = [],
    isLoading: loadingStaff,
    isFetching: fetchingStaff,
    isError: errorStaff,
    refetch: refetchStaff,
  } = useDiagnosticCenterStaff();

  const isInitialLoading = loadingProfile || loadingStaff;
  const isFetching = fetchingProfile || fetchingStaff;

  const handleRefreshAll = () => {
    refetchProfile();
    refetchStaff();
  };

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  if (errorProfile || errorStaff) {
    return <DashboardError onRetry={handleRefreshAll} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <DashboardHeader
        centerName={center?.centerName}
        isApproved={center?.isApproved}
        isFetching={isFetching}
        onRefresh={handleRefreshAll}
      />

      {/* 2. Center Overview Card */}
      <CenterOverviewCard center={center} />

      {/* 3. Staff Summary Card */}
      <StaffSummaryCard staffList={staff} />

      {/* 4. Dashboard Quick Actions */}
      <DashboardQuickActions />
    </div>
  );
}
