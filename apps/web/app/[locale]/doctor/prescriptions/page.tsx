"use client";

import { useState, useMemo } from "react";
import {
  useDoctorPrescriptions,
} from "@/lib/hooks/useDoctorExpansion";
import { useSearchClinics } from "@/lib/hooks/useDoctor";
import type { DoctorPrescription } from "@doctor-contract/shared";

import { PrescriptionsHeader } from "./components/PrescriptionsHeader";
import { PrescriptionsFilterBar } from "./components/PrescriptionsFilterBar";
import { PrescriptionCard } from "./components/PrescriptionCard";
import { PrescriptionDetailsModal } from "./components/PrescriptionDetailsModal";
import { CreatePrescriptionModal } from "./components/CreatePrescriptionModal";
import { PrescriptionsSkeleton } from "./components/PrescriptionsSkeleton";
import { PrescriptionsErrorState } from "./components/PrescriptionsErrorState";
import { PrescriptionsEmptyState } from "./components/PrescriptionsEmptyState";

export default function DoctorPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinicId, setSelectedClinicId] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailsPrescription, setDetailsPrescription] = useState<DoctorPrescription | null>(null);

  // Fetch Associated Clinics for dropdown filter
  const { data: clinics = [] } = useSearchClinics();

  // Fetch Prescriptions
  const {
    data: prescriptions = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useDoctorPrescriptions({
    clinicId: selectedClinicId !== "ALL" ? selectedClinicId : undefined,
  });

  // Client-side search & clinic filter logic
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((rx: DoctorPrescription) => {
      // 1. Clinic Filter
      if (selectedClinicId !== "ALL" && rx.clinicId && rx.clinicId !== selectedClinicId) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPatient = rx.patientName?.toLowerCase().includes(query);
        const matchesDiagnosis = rx.diagnosis?.toLowerCase().includes(query);
        const matchesClinic = rx.clinicName?.toLowerCase().includes(query);
        const matchesMedicines = (rx.items || []).some(
          (item) => item.medicineName?.toLowerCase().includes(query)
        );

        if (!matchesPatient && !matchesDiagnosis && !matchesClinic && !matchesMedicines) {
          return false;
        }
      }

      return true;
    });
  }, [prescriptions, selectedClinicId, searchQuery]);

  if (isLoading) {
    return <PrescriptionsSkeleton />;
  }

  if (isError) {
    return (
      <PrescriptionsErrorState
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedClinicId !== "ALL";

  return (
    <div className="space-y-6">
      {/* Header */}
      <PrescriptionsHeader
        totalPrescriptions={prescriptions.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Filter Bar */}
      <PrescriptionsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedClinicId={selectedClinicId}
        onClinicChange={setSelectedClinicId}
        clinics={clinics.map((c) => ({ id: c.id, clinicName: c.clinicName }))}
        totalCount={prescriptions.length}
        filteredCount={filteredPrescriptions.length}
      />

      {/* Prescriptions Grid / Empty State */}
      {filteredPrescriptions.length > 0 ? (
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              onViewDetails={setDetailsPrescription}
            />
          ))}
        </div>
      ) : (
        <PrescriptionsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={() => {
            setSearchQuery("");
            setSelectedClinicId("ALL");
          }}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Details View Modal */}
      <PrescriptionDetailsModal
        prescription={detailsPrescription}
        onClose={() => setDetailsPrescription(null)}
      />

      {/* Issue New Prescription Modal */}
      <CreatePrescriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
