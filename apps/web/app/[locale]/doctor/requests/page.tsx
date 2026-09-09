"use client";

import { useState, useMemo } from "react";
import {
  useDoctorReceivedRequests,
  useDoctorSentRequests,
} from "@/lib/hooks/useDoctor";
import type { DoctorRequest } from "@doctor-contract/shared";

import { RequestsHeader } from "./components/RequestsHeader";
import { RequestsTabs, type TabType, type StatusFilterType } from "./components/RequestsTabs";
import { ReceivedRequestsList } from "./components/ReceivedRequestsList";
import { SentRequestsList } from "./components/SentRequestsList";
import { SendClinicRequestModal } from "./components/SendClinicRequestModal";
import { RespondRequestModal } from "./components/RespondRequestModal";
import { CancelRequestModal } from "./components/CancelRequestModal";
import { RequestsSkeleton } from "./components/RequestsSkeleton";
import { RequestsError } from "./components/RequestsError";

export default function DoctorRequestsPage() {
  // Active Tab & Filters
  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");

  // Modal states
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [respondModalState, setRespondModalState] = useState<{
    isOpen: boolean;
    request: DoctorRequest | null;
    action: "ACCEPT" | "REJECT" | null;
  }>({
    isOpen: false,
    request: null,
    action: null,
  });
  const [cancelModalState, setCancelModalState] = useState<{
    isOpen: boolean;
    request: DoctorRequest | null;
  }>({
    isOpen: false,
    request: null,
  });

  // Queries
  const {
    data: receivedRequests = [],
    isLoading: loadingReceived,
    isFetching: fetchingReceived,
    isError: isErrorReceived,
    error: errorReceived,
    refetch: refetchReceived,
  } = useDoctorReceivedRequests();

  const {
    data: sentRequests = [],
    isLoading: loadingSent,
    isFetching: fetchingSent,
    isError: isErrorSent,
    error: errorSent,
    refetch: refetchSent,
  } = useDoctorSentRequests();

  const isInitialLoading = loadingReceived || loadingSent;
  const isRefreshing = fetchingReceived || fetchingSent;

  // Filtered lists
  const filteredReceivedRequests = useMemo(() => {
    if (statusFilter === "ALL") return receivedRequests;
    return receivedRequests.filter((r) => r.status === statusFilter);
  }, [receivedRequests, statusFilter]);

  const filteredSentRequests = useMemo(() => {
    if (statusFilter === "ALL") return sentRequests;
    return sentRequests.filter((r) => r.status === statusFilter);
  }, [sentRequests, statusFilter]);

  const pendingReceivedCount = useMemo(() => {
    return receivedRequests.filter((r) => r.status === "PENDING").length;
  }, [receivedRequests]);

  const handleRefreshAll = () => {
    refetchReceived();
    refetchSent();
  };

  const handleOpenRespondModal = (
    request: DoctorRequest,
    action: "ACCEPT" | "REJECT"
  ) => {
    setRespondModalState({
      isOpen: true,
      request,
      action,
    });
  };

  const handleOpenCancelModal = (request: DoctorRequest) => {
    setCancelModalState({
      isOpen: true,
      request,
    });
  };

  // Loading State
  if (isInitialLoading) {
    return <RequestsSkeleton />;
  }

  // Error State
  if (isErrorReceived || isErrorSent) {
    const errorMsg =
      errorReceived instanceof Error
        ? errorReceived.message
        : errorSent instanceof Error
        ? errorSent.message
        : undefined;

    return <RequestsError onRetry={handleRefreshAll} message={errorMsg} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <RequestsHeader
        onRefresh={handleRefreshAll}
        isRefreshing={isRefreshing}
        onOpenSendModal={() => setIsSendModalOpen(true)}
        pendingReceivedCount={pendingReceivedCount}
      />

      {/* 2. Tabs & Status Filters */}
      <RequestsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        receivedCount={receivedRequests.length}
        pendingReceivedCount={pendingReceivedCount}
        sentCount={sentRequests.length}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* 3. Requests List */}
      {activeTab === "received" ? (
        <ReceivedRequestsList
          requests={filteredReceivedRequests}
          onAccept={(req) => handleOpenRespondModal(req, "ACCEPT")}
          onReject={(req) => handleOpenRespondModal(req, "REJECT")}
        />
      ) : (
        <SentRequestsList
          requests={filteredSentRequests}
          onCancel={handleOpenCancelModal}
          onOpenSendModal={() => setIsSendModalOpen(true)}
        />
      )}

      {/* 4. Modals */}
      <SendClinicRequestModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />

      <RespondRequestModal
        isOpen={respondModalState.isOpen}
        onClose={() =>
          setRespondModalState({ isOpen: false, request: null, action: null })
        }
        request={respondModalState.request}
        action={respondModalState.action}
      />

      <CancelRequestModal
        isOpen={cancelModalState.isOpen}
        onClose={() => setCancelModalState({ isOpen: false, request: null })}
        request={cancelModalState.request}
      />
    </div>
  );
}
