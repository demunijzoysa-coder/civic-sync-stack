import { useEffect, useState } from "react";
import { db, type LocalAppointment, type OutboxEvent } from "./db";
import { syncOutbox } from "./syncClient";

const DEVICE_ID = "web-device-001";

export default function App() {
  const [items, setItems] = useState<LocalAppointment[]>([]);
  const [syncMessage, setSyncMessage] = useState<string>("");

  async function load() {
    const all = await db.appointments.toArray();
    // newest first
    all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    setItems(all);
  }

  async function createOfflineAppointment() {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const appt: LocalAppointment = {
      id,
      patientNationalId: "NIC-OFFLINE",
      clinicId: "CLINIC-01",
      requestedDate: "2026-01-10T09:00:00Z",
      reason: "Offline created appointment",
      status: "DRAFT",
      updatedAt: now,
      syncStatus: "PENDING"
    };

    await db.appointments.put(appt);
    await load();
  }

  async function submitAppointment(id: string) {
    const now = new Date().toISOString();
    const appt = await db.appointments.get(id);
    if (!appt) return;

    const submitted: LocalAppointment = {
      ...appt,
      status: "SUBMITTED",
      updatedAt: now,
      syncStatus: "PENDING",
      lastSyncError: undefined
    };

    await db.appointments.put(submitted);

    const outboxEvent: OutboxEvent = {
      eventId: crypto.randomUUID(),
      batchId: crypto.randomUUID(),
      deviceId: DEVICE_ID,
      occurredAt: now,
      entityType: "APPOINTMENT",
      entityId: submitted.id,
      op: "UPSERT",
      payload: {
        id: submitted.id,
        patientNationalId: submitted.patientNationalId,
        clinicId: submitted.clinicId,
        requestedDate: submitted.requestedDate,
        reason: submitted.reason,
        status: "SUBMITTED",
        createdAt: submitted.updatedAt,
        updatedAt: submitted.updatedAt
      },
      createdAt: now
    };

    await db.outbox.put(outboxEvent);
    await load();
  }

  async function doSync() {
    setSyncMessage("Syncing...");
    try {
      const result = await syncOutbox();
      setSyncMessage(
        `Sync done. accepted=${result.accepted.length}, rejected=${result.rejected.length}`
      );
    } catch (e: any) {
      setSyncMessage(e?.message ?? "Sync failed");
    } finally {
      await load();
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Offline Appointments</h1>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={createOfflineAppointment}>Create appointment (offline)</button>
        <button onClick={doSync}>Sync now</button>
      </div>

      <p style={{ marginTop: 12 }}>{syncMessage}</p>

      <ul style={{ marginTop: 16 }}>
        {items.map((a) => (
          <li key={a.id} style={{ marginBottom: 10 }}>
            <div>
              {a.reason} — <b>{a.status}</b> — <i>{a.syncStatus}</i>
            </div>

            {a.status === "DRAFT" && (
              <button onClick={() => submitAppointment(a.id)}>Submit</button>
            )}

            {a.syncStatus === "FAILED" && a.lastSyncError && (
              <div style={{ color: "tomato" }}>{a.lastSyncError}</div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
