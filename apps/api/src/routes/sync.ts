import { FastifyInstance } from "fastify";
import { SyncPushRequestSchema } from "@civic/shared";
import { validateSyncEvent } from "@civic/sync-core";

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

    for (const e of events) {
      try {
        validateSyncEvent(e);
        acceptedEventIds.push(e.eventId);
      } catch (err: any) {
        rejected.push({
          eventId: (e as any)?.eventId ?? "unknown",
          reason: err?.message ?? "Unknown error"
        });
      }
    }

    // NOTE: In Step 9 we persist to Postgres + idempotency.
    return reply.send({
      batchId,
      acceptedEventIds,
      rejected
    });
  });
}
