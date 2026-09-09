"use client";

import { Camera, Stethoscope, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { GradientCard } from "../../dashboard/components/GradientCard";

interface ProfileAvatarProps {
  name: string;
  photoUrl?: string | null;
  onOpenPhotoModal: () => void;
}

export function ProfileAvatar({
  name,
  photoUrl,
  onOpenPhotoModal,
}: ProfileAvatarProps) {
  // Generate initials fallback
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DR";

  return (
    <GradientCard gradient="from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6]">
      <div className="flex flex-col items-center justify-between p-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          {/* Avatar Container */}
          <div className="relative">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] font-bold text-white shadow-lg shadow-blue-900/30">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-black tracking-wider">{initials}</span>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenPhotoModal}
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-2 ring-white hover:bg-blue-600 transition-all dark:bg-slate-800 dark:ring-slate-900"
              title="Upload Profile Photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Doctor Identity Info */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {name ? `Dr. ${name}` : "Doctor"}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                Verified Practitioner
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Medical Practitioner • Verified Practitioner Account
            </p>
          </div>
        </div>

        {/* Upload Action CTA Button */}
        <button
          type="button"
          onClick={onOpenPhotoModal}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all sm:mt-0"
        >
          <Camera className="h-3.5 w-3.5" />
          <span>Change Profile Photo</span>
        </button>
      </div>
    </GradientCard>
  );
}
