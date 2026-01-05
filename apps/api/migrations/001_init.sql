CREATE TABLE IF NOT EXISTS sync_events (
  event_id UUID PRIMARY KEY,
  batch_id UUID NOT NULL,
  device_id TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  op TEXT NOT NULL,
  payload JSONB,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_events_entity
  ON sync_events (entity_type, entity_id);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY,
  patient_national_id TEXT NOT NULL,
  clinic_id TEXT NOT NULL,
  requested_date TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
