import { db, type OutboxEvent } from "./db";


const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export async function syncOutbox(): Promise<{
  accepted: string[];
  rejected: { eventId: string; reason: string }[];
}> {
  const events = await db.outbox.toArray();
  if (events.length === 0) {
    return { accepted: [], rejected: [] };
  }

  // group by batchId (simple: use first batch only for MVP)
  const batchId = events[0].batchId;
  const batchEvents = events.filter((e) => e.batchId === batchId);

  const res = await fetch(`${API_BASE}/sync/push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      batchId,
      events: batchEvents.map((e) => ({
        eventId: e.eventId,
        deviceId: e.deviceId,
        occurredAt: e.occurredAt,
        entityType: e.entityType,
        entityId: e.entityId,
        op: e.op,
        payload: e.op === "DELETE" ? null : e.payload
      }))
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sync failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  const accepted: string[] = data.acceptedEventIds ?? [];
  const rejected: { eventId: string; reason: string }[] = data.rejected ?? [];

  // remove accepted from outbox
  if (accepted.length > 0) {
    await db.outbox.bulkDelete(accepted);
  }

  // mark appointments for accepted UPSERTs as SYNCED
  const acceptedSet = new Set(accepted);
  for (const e of batchEvents) {
    if (acceptedSet.has(e.eventId) && e.entityType === "APPOINTMENT" && e.op === "UPSERT") {
      await db.appointments.update(e.entityId, {
        syncStatus: "SYNCED",
        lastSyncError: undefined
      });
    }
  }

  // mark failed ones
  for (const r of rejected) {
    const failed = batchEvents.find((e) => e.eventId === r.eventId);
    if (failed?.entityType === "APPOINTMENT") {
      await db.appointments.update(failed.entityId, {
        syncStatus: "FAILED",
        lastSyncError: r.reason
      });
    }
  }

  return { accepted, rejected };
}
