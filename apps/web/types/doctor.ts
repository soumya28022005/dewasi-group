import type { Doctor as SharedDoctor } from "@doctor-contract/shared";

export type ExtendedDoctor = SharedDoctor & {
  isVerified?: boolean;
  isFeatured?: boolean;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  clinic?: {
    id: string;
    clinicName: string;
    city?: string;
  };
  allClinics?: Array<{
    id: string;
    clinicName: string;
    city?: string;
    isPrimary: boolean;
    associationDetails: {
      fee?: number;
      startTime?: string;
      queueMode?: string;
    };
  }>;
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string | null;
  };
};