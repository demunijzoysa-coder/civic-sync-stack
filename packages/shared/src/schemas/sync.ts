import { z } from "zod";

export const EntityTypeSchema = z.enum(["APPOINTMENT"]);
export type EntityType = z.infer<typeof EntityTypeSchema>;

export const SyncOperationSchema = z.enum(["UPSERT", "DELETE"]);
export type SyncOperation = z.infer<typeof SyncOperationSchema>;

export const SyncEventSchema = z.object({
  eventId: z.string().uuid(),
  deviceId: z.string().min(6).max(128),
  occurredAt: z.string().datetime(),

  entityType: EntityTypeSchema,
  entityId: z.string().uuid(),
  op: SyncOperationSchema,

  // For UPSERT: payload is required. For DELETE: payload can be null.
  payload: z.unknown().nullable().default(null)

});

export type SyncEvent = z.infer<typeof SyncEventSchema>;

export const SyncPushRequestSchema = z.object({
  batchId: z.string().uuid(),
  events: z.array(SyncEventSchema).min(1).max(500)
});
export type SyncPushRequest = z.infer<typeof SyncPushRequestSchema>;

export const SyncPushResponseSchema = z.object({
  batchId: z.string().uuid(),
  acceptedEventIds: z.array(z.string().uuid()),
  rejected: z.array(
    z.object({
      eventId: z.string().uuid(),
      reason: z.string().min(1).max(500)
    })
  )
});
export type SyncPushResponse = z.infer<typeof SyncPushResponseSchema>;
