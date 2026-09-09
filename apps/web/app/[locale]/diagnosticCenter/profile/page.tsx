"use client";

import { useDiagnosticCenterProfile } from "@/lib/hooks/useDiagnosticCenter";
import { ProfileHeader } from "./components/ProfileHeader";
import { LogoUploader } from "./components/LogoUploader";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { ProfileError } from "./components/ProfileError";

export default function DiagnosticCenterProfilePage() {
  const {
    data: center,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDiagnosticCenterProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return <ProfileError onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <ProfileHeader
        isApproved={center?.isApproved}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 2. Logo Uploader */}
      <LogoUploader
        currentLogo={center?.logo}
        centerName={center?.centerName}
      />

      {/* 3. Profile Details Form */}
      <ProfileForm center={center} />
    </div>
  );
}
