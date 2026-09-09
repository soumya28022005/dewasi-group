"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDiagnosticCenterIncomingReferrals } from "@/lib/hooks/useDiagnosticCenter";
import { ReferralHeader } from "./components/ReferralHeader";
import { ReferralList } from "./components/ReferralList";
import { ReferralDetailsModal } from "./components/ReferralDetailsModal";
import { PrintReferralSlipModal } from "./components/PrintReferralSlipModal";
import { ReferralPagination } from "./components/ReferralPagination";
import { ReferralSkeleton } from "./components/ReferralSkeleton";
import { ReferralEmptyState } from "./components/ReferralEmptyState";
import { ReferralError } from "./components/ReferralError";
import type { DiagnosticCenterIncomingReferral } from "@doctor-contract/shared";

const PAGE_LIMIT = 20;

function DiagnosticCenterReferralsContent() {
  const searchParams = useSearchParams();
  const deepLinkedReferralId = searchParams.get("referralId");

  const [page, setPage] = useState(1);
  const [selectedReferral, setSelectedReferral] =
    useState<DiagnosticCenterIncomingReferral | null>(null);
  const [printReferral, setPrintReferral] =
    useState<DiagnosticCenterIncomingReferral | null>(null);

  const {
    data: referrals = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDiagnosticCenterIncomingReferrals({ page, limit: PAGE_LIMIT });

  // Handle URL deep-linking (?referralId=<id>)
  useEffect(() => {
    if (deepLinkedReferralId && referrals.length > 0) {
      const match = referrals.find((r) => r.id === deepLinkedReferralId);
      if (match) {
        setSelectedReferral(match);
      }
    }
  }, [deepLinkedReferralId, referrals]);

  if (isLoading) {
    return <ReferralSkeleton />;
  }

  if (isError) {
    return <ReferralError onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with CSV Export & Refresh */}
      <ReferralHeader
        page={page}
        count={referrals.length}
        referrals={referrals}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 2. Referrals Content or Empty State */}
      {referrals.length === 0 && page === 1 ? (
        <ReferralEmptyState />
      ) : (
        <div className="space-y-6">
          <ReferralList
            referrals={referrals}
            onViewDetails={(ref) => setSelectedReferral(ref)}
          />

          <ReferralPagination
            page={page}
            returnedCount={referrals.length}
            limit={PAGE_LIMIT}
            isLoading={isFetching}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* 3. Referral Details Modal */}
      <ReferralDetailsModal
        isOpen={!!selectedReferral}
        referral={selectedReferral}
        onClose={() => setSelectedReferral(null)}
        onPrint={(ref) => setPrintReferral(ref)}
      />

      {/* 4. Printable Diagnostic Lab Work Order Modal */}
      <PrintReferralSlipModal
        isOpen={!!printReferral}
        referral={printReferral}
        onClose={() => setPrintReferral(null)}
      />
    </div>
  );
}

export default function DiagnosticCenterReferralsPage() {
  return (
    <Suspense fallback={<ReferralSkeleton />}>
      <DiagnosticCenterReferralsContent />
    </Suspense>
  );
}
