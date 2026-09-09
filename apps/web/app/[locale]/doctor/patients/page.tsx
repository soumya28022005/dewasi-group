"use client";

import { useState, useMemo } from "react";
import { useDoctorPatients } from "@/lib/hooks/useDoctorExpansion";
import { useSearchClinics } from "@/lib/hooks/useDoctor";

import { PatientsHeader } from "./components/PatientsHeader";
import { PatientsFilterBar } from "./components/PatientsFilterBar";
import { PatientCard } from "./components/PatientCard";
import { PatientsPagination } from "./components/PatientsPagination";
import { PatientsSkeleton } from "./components/PatientsSkeleton";
import { PatientsErrorState } from "./components/PatientsErrorState";
import { PatientsEmptyState } from "./components/PatientsEmptyState";

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinicId, setSelectedClinicId] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch Clinics for dropdown filter
  const { data: clinics = [] } = useSearchClinics();

  // Fetch Patients
  const {
    data: apiResponse = { patients: [], total: 0, page: 1, limit: 10 },
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useDoctorPatients({
    search: searchQuery || undefined,
    clinicId: selectedClinicId !== "ALL" ? selectedClinicId : undefined,
    page,
    limit,
  });

  const patientsList = apiResponse.patients || [];
  const totalRecords = apiResponse.total || patientsList.length;

  // Client-side search & clinic filter fallback for deterministic behavior
  const filteredPatients = useMemo(() => {
    return patientsList.filter((p) => {
      if (selectedClinicId !== "ALL" && p.clinicId && p.clinicId !== selectedClinicId) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesPhone = p.phone?.toLowerCase().includes(query);
        const matchesEmail = p.email?.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }
      return true;
    });
  }, [patientsList, selectedClinicId, searchQuery]);

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  if (isLoading) {
    return <PatientsSkeleton />;
  }

  if (isError) {
    return (
      <PatientsErrorState
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const hasActiveFilters = searchQuery.trim().length > 0 || selectedClinicId !== "ALL";

  return (
    <div className="space-y-6">
      {/* Header */}
      <PatientsHeader
        totalPatients={totalRecords}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Filter Bar */}
      <PatientsFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        selectedClinicId={selectedClinicId}
        onClinicChange={(c) => {
          setSelectedClinicId(c);
          setPage(1);
        }}
        clinics={clinics.map((c) => ({ id: c.id, clinicName: c.clinicName }))}
        totalCount={totalRecords}
        filteredCount={filteredPatients.length}
      />

      {/* Patient Cards List / Empty State */}
      {filteredPatients.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id || patient.patientId} patient={patient} />
            ))}
          </div>

          {/* Pagination */}
          <PatientsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <PatientsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={() => {
            setSearchQuery("");
            setSelectedClinicId("ALL");
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
