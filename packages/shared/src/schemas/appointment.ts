import { z } from "zod";

export const AppointmentStatusSchema = z.enum([
  "DRAFT",
  "SUBMITTED",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED"
]);

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  patientNationalId: z.string().min(4).max(32),
  clinicId: z.string().min(2).max(64),
  requestedDate: z.string().datetime(),
  reason: z.string().min(1).max(500),
  status: AppointmentStatusSchema,

  // audit fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Appointment = z.infer<typeof AppointmentSchema>;
