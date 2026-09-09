"use client";

import { useState } from "react";
import { useDoctorEarnings } from "@/lib/hooks/useDoctorExpansion";
import { useSearchClinics } from "@/lib/hooks/useDoctor";

import { EarningsHeader } from "./components/EarningsHeader";
import {
  EarningsPeriodFilter,
  type EarningsPeriod,
} from "./components/EarningsPeriodFilter";
import { EarningsSummary } from "./components/EarningsSummary";
import { ClinicEarningsBreakdown } from "./components/ClinicEarningsBreakdown";
import { EarningsChart } from "./components/EarningsChart";
import { EarningsSkeleton } from "./components/EarningsSkeleton";
import { EarningsErrorState } from "./components/EarningsErrorState";
import { EarningsEmptyState } from "./components/EarningsEmptyState";

export default function DoctorEarningsPage() {
  const [period, setPeriod] = useState<EarningsPeriod>("monthly");
  const [selectedClinicId, setSelectedClinicId] = useState("ALL");

  // Associated Clinics lookup for filter
  const { data: clinics = [] } = useSearchClinics();

  // Fetch Practice Earnings
  const {
    data: earningsSummary = {
      period: "monthly",
      totalEarnings: 0,
      totalConsultations: 0,
      clinicBreakdown: [],
    },
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useDoctorEarnings({
    period,
    clinicId: selectedClinicId !== "ALL" ? selectedClinicId : undefined,
  });

  if (isLoading) {
    return <EarningsSkeleton />;
  }

  if (isError) {
    return (
      <EarningsErrorState
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const hasData =
    earningsSummary.totalEarnings > 0 ||
    (earningsSummary.clinicBreakdown && earningsSummary.clinicBreakdown.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <EarningsHeader
        totalEarnings={earningsSummary.totalEarnings}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Period & Clinic Filter */}
      <EarningsPeriodFilter
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        selectedClinicId={selectedClinicId}
        onClinicChange={setSelectedClinicId}
        clinics={clinics.map((c) => ({ id: c.id, clinicName: c.clinicName }))}
      />

      {/* Financial Metrics Summary */}
      <EarningsSummary summary={earningsSummary} />

      {/* Analytics Breakdown & Visual Chart */}
      {hasData ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ClinicEarningsBreakdown
            breakdown={earningsSummary.clinicBreakdown || []}
            grandTotalEarnings={earningsSummary.totalEarnings}
          />
          <EarningsChart breakdown={earningsSummary.clinicBreakdown || []} />
        </div>
      ) : (
        <EarningsEmptyState selectedPeriod={period} />
      )}
    </div>
  );
}
