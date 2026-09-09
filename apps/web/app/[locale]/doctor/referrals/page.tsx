"use client";

import { useState, useMemo } from "react";
import { useSentReferrals, type SentReferral } from "@/lib/hooks/useReferrals";

import { ReferralsHeader } from "./components/ReferralsHeader";
import { ReferralsFilterBar } from "./components/ReferralsFilterBar";
import { ReferralCard } from "./components/ReferralCard";
import { NewReferralModal } from "./components/NewReferralModal";
import { ReferralsSkeleton } from "./components/ReferralsSkeleton";
import { ReferralsErrorState } from "./components/ReferralsErrorState";
import { ReferralsEmptyState } from "./components/ReferralsEmptyState";

export default function DoctorReferralsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch sent test referrals
  const {
    data: sentReferrals = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSentReferrals();

  // Filtered referrals logic
  const filteredReferrals = useMemo(() => {
    if (!searchQuery.trim()) return sentReferrals;
    const query = searchQuery.toLowerCase().trim();

    return sentReferrals.filter((ref: SentReferral) => {
      const patientName = ref.patient?.name?.toLowerCase() || "";
      const patientPhone = (ref.patient?.phone || ref.patient?.user?.phone || "").toLowerCase();
      const centerName = ref.diagnosticCenter?.centerName?.toLowerCase() || "";
      const testNames = (ref.testNames || []).join(" ").toLowerCase();

      return (
        patientName.includes(query) ||
        patientPhone.includes(query) ||
        centerName.includes(query) ||
        testNames.includes(query)
      );
    });
  }, [sentReferrals, searchQuery]);

  if (isLoading) {
    return <ReferralsSkeleton />;
  }

  if (isError) {
    return (
      <ReferralsErrorState
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReferralsHeader
        sentCount={sentReferrals.length}
        onOpenModal={() => setIsModalOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Filter Bar */}
      <ReferralsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={sentReferrals.length}
        filteredCount={filteredReferrals.length}
      />

      {/* Sent Referrals List or Empty State */}
      {filteredReferrals.length > 0 ? (
        <div className="space-y-4">
          {filteredReferrals.map((referral) => (
            <ReferralCard key={referral.id} referral={referral} />
          ))}
        </div>
      ) : (
        <ReferralsEmptyState
          hasSearchQuery={searchQuery.trim().length > 0}
          onClearSearch={() => setSearchQuery("")}
          onOpenModal={() => setIsModalOpen(true)}
        />
      )}

      {/* New Referral Modal */}
      <NewReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
