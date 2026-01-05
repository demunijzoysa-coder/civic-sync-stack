import { FastifyInstance } from "fastify";
import { SyncPushRequestSchema } from "@civic/shared";
import { validateSyncEvent } from "@civic/sync-core";
import { sql } from "../db";

export async function syncRoutes(app: FastifyInstance) {
  app.post("/sync/push", async (req, reply) => {
    const parsed = SyncPushRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "INVALID_REQUEST",
        details: parsed.error.flatten()
      });
    }

    const { batchId, events } = parsed.data;

    const acceptedEventIds: string[] = [];
    const rejected: { eventId: string; reason: string }[] = [];

    for (const raw of events) {
      try {
        const evt = validateSyncEvent(raw);

        // idempotent insert
        const result = await sql`
          INSERT INTO sync_events
            (event_id, batch_id, device_id, occurred_at, entity_type, entity_id, op, payload)
          VALUES
            (${evt.eventId}::uuid, ${batchId}::uuid, ${evt.deviceId}, ${evt.occurredAt}::timestamptz,
             ${evt.entityType}, ${evt.entityId}::uuid, ${evt.op}, ${evt.payload as any})
          ON CONFLICT (event_id) DO NOTHING
          RETURNING event_id
        `;

        // Either inserted now or already existed — both are "accepted"
        acceptedEventIds.push(evt.eventId);

        // Apply to read model (appointments) only for APPOINTMENT UPSERT (MVP)
        if (evt.entityType === "APPOINTMENT" && evt.op === "UPSERT") {
          const a = evt.payload as any;
          await sql`
            INSERT INTO appointments
              (id, patient_national_id, clinic_id, requested_date, reason, status, created_at, updated_at)
            VALUES
              (${a.id}::uuid, ${a.patientNationalId}, ${a.clinicId}, ${a.requestedDate}::timestamptz,
               ${a.reason}, ${a.status}, ${a.createdAt}::timestamptz, ${a.updatedAt}::timestamptz)
            ON CONFLICT (id) DO UPDATE SET
              patient_national_id = EXCLUDED.patient_national_id,
              clinic_id = EXCLUDED.clinic_id,
              requested_date = EXCLUDED.requested_date,
              reason = EXCLUDED.reason,
              status = EXCLUDED.status,
              updated_at = EXCLUDED.updated_at
          `;
        }
      } catch (err: any) {
        rejected.push({
          eventId: (raw as any)?.eventId ?? "unknown",
          reason: err?.message ?? "Unknown error"
        });
      }
    }

    return reply.send({
      batchId,
      acceptedEventIds,
      rejected
    });
  });
}
