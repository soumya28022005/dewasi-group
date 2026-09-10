"use client";

import { useState } from "react";
import { useDiagnosticCenterStaff } from "@/lib/hooks/useDiagnosticCenter";
import { StaffHeader } from "./components/StaffHeader";
import { StaffList } from "./components/StaffList";
import { AddStaffModal } from "./components/AddStaffModal";
import { ChangeStaffPasswordModal } from "./components/ChangeStaffPasswordModal";
import { StaffEmptyState } from "./components/StaffEmptyState";
import { StaffSkeleton } from "./components/StaffSkeleton";
import { StaffError } from "./components/StaffError";
import type { DiagnosticCenterStaff } from "@doctor-contract/shared";

export default function DiagnosticCenterStaffPage() {
  const {
    data: staff = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDiagnosticCenterStaff();

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [selectedStaffForPassword, setSelectedStaffForPassword] =
    useState<DiagnosticCenterStaff | null>(null);

  const openAddStaffModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddStaffModal = () => {
    setIsAddModalOpen(false);
  };

  const openPasswordModal = (
    staffMember: DiagnosticCenterStaff,
  ) => {
    setSelectedStaffForPassword(staffMember);
  };

  const closePasswordModal = () => {
    setSelectedStaffForPassword(null);
  };

  const handleRefresh = () => {
    void refetch();
  };

  /* =========================================
     Initial Loading
  ========================================= */

  if (isLoading) {
    return (
      <main className="w-full">
        <StaffSkeleton />
      </main>
    );
  }

  /* =========================================
     Error State
  ========================================= */

  if (isError) {
    return (
      <main className="w-full">
        <StaffError
          onRetry={handleRefresh}
        />
      </main>
    );
  }

  /* =========================================
     Main Page
  ========================================= */

  return (
    <main
      className="
        w-full
        space-y-5
        pb-6
      "
    >
      {/* =====================================
          Page Header
      ===================================== */}

      <StaffHeader
        onAddStaff={openAddStaffModal}
        isFetching={isFetching}
        onRefresh={handleRefresh}
      />

      {/* =====================================
          Staff Content
      ===================================== */}

      {staff.length === 0 ? (
        <StaffEmptyState
          onAddStaff={openAddStaffModal}
        />
      ) : (
        <StaffList
          staff={staff}
          onChangePassword={openPasswordModal}
        />
      )}

      {/* =====================================
          Add Staff Modal
      ===================================== */}

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={closeAddStaffModal}
      />

      {/* =====================================
          Change Password Modal
      ===================================== */}

      <ChangeStaffPasswordModal
        isOpen={
          selectedStaffForPassword !== null
        }
        staff={selectedStaffForPassword}
        onClose={closePasswordModal}
      />
    </main>
  );
}
