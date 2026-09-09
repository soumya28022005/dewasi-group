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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffForPassword, setSelectedStaffForPassword] =
    useState<DiagnosticCenterStaff | null>(null);

  if (isLoading) {
    return <StaffSkeleton />;
  }

  if (isError) {
    return <StaffError onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <StaffHeader
        onAddStaff={() => setIsAddModalOpen(true)}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 2. Staff Content / Empty State */}
      {staff.length === 0 ? (
        <StaffEmptyState onAddStaff={() => setIsAddModalOpen(true)} />
      ) : (
        <StaffList
          staff={staff}
          onChangePassword={(s) => setSelectedStaffForPassword(s)}
        />
      )}

      {/* 3. Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* 4. Change Password Modal */}
      <ChangeStaffPasswordModal
        isOpen={!!selectedStaffForPassword}
        staff={selectedStaffForPassword}
        onClose={() => setSelectedStaffForPassword(null)}
      />
    </div>
  );
}
