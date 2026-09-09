"use client";

import type { AuthUser } from "@doctor-contract/shared";
import { User, Mail, Phone, Shield, Stethoscope, Award, FileText } from "lucide-react";
import { ProfileField } from "./ProfileField";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ProfileInformationProps {
  user: AuthUser | null;
  specialization?: string | null;
  qualification?: string | null;
}

export function ProfileInformation({
  user,
  specialization,
  qualification,
}: ProfileInformationProps) {
  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#6366f1]">
      <div className="p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Verified Account Information
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Personal, contact & medical credentials
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Full Name */}
          <ProfileField
            label="Full Name"
            value={user?.name}
            icon={User}
            isLocked={true}
          />

          {/* Email Address */}
          <ProfileField
            label="Email Address"
            value={user?.email}
            icon={Mail}
            isLocked={true}
          />

          {/* Phone Number */}
          <ProfileField
            label="Phone Number"
            value={user?.phone}
            icon={Phone}
            isLocked={true}
            fallbackText="Not provided"
          />

          {/* Account Role */}
          <ProfileField
            label="Account Role"
            value={user?.role}
            icon={Shield}
            isLocked={true}
          />

          {/* Specialization */}
          <ProfileField
            label="Medical Specialization"
            value={specialization}
            icon={Stethoscope}
            isLocked={true}
            fallbackText="General Physician"
          />

          {/* Qualification */}
          <ProfileField
            label="Qualification & Degrees"
            value={qualification}
            icon={Award}
            isLocked={true}
            fallbackText="MBBS"
          />
        </div>

        <p className="mt-5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Note: Core identity and contact credentials are authenticated via verified platform credentials.
        </p>
      </div>
    </GradientCard>
  );
}
