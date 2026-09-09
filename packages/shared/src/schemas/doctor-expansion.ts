import { z } from "zod";

export const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  clinicId: z.string().min(1, "Clinic ID is required"),
  appointmentId: z.string().optional(),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  items: z.array(prescriptionItemSchema).min(1, "At least one medicine is required"),
  notes: z.string().optional(),
});

export const updateDoctorSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  autoAcceptClinicRequests: z.boolean().optional(),
  defaultConsultationFee: z.number().min(0).optional(),
  digitalSignatureUrl: z.string().url().optional().nullable(),
});

export const doctorEarningsQuerySchema = z.object({
  period: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).default("monthly"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clinicId: z.string().optional(),
});
