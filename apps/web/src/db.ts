import Dexie from "dexie";

export type LocalAppointment = {
  id: string;
  patientNationalId: string;
  clinicId: string;
  requestedDate: string;
  reason: string;
  status: "DRAFT" | "SUBMITTED";
  updatedAt: string;

  // sync metadata
  syncStatus: "PENDING" | "SYNCED" | "FAILED";
  lastSyncError?: string;
};


export type OutboxEvent = {
  eventId: string;
  batchId: string;
  deviceId: string;
  occurredAt: string;

  entityType: "APPOINTMENT";
  entityId: string;
  op: "UPSERT" | "DELETE";
  payload: unknown;

  createdAt: string;
};



class CivicDB extends Dexie {
  appointments!: Dexie.Table<LocalAppointment, string>;
  outbox!: Dexie.Table<OutboxEvent, string>;

  constructor() {
    super("civic-db");
   this.version(2).stores({
  appointments: "id, updatedAt, syncStatus",
  outbox: "eventId, createdAt, batchId"
});

  }
}

export const db = new CivicDB();
