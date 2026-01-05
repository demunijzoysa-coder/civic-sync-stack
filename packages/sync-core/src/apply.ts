import { z } from "zod";
import { SyncEventSchema, type SyncEvent } from "@civic/shared";
import { InvalidPayloadError, UnknownEntityTypeError } from "./errors";
import { getRegistryItem } from "./registry";

export type ValidatedSyncEvent = Omit<SyncEvent, "payload"> & {
  payload: unknown | null;
};


export function validateSyncEvent(input: unknown): ValidatedSyncEvent {
  const parsed = SyncEventSchema.safeParse(input);
  if (!parsed.success) {
    throw new InvalidPayloadError(parsed.error.message);
  }

  const evt = parsed.data;

  // DELETE: payload must be null (strict)
  if (evt.op === "DELETE") {
    if (evt.payload !== null) {
      throw new InvalidPayloadError(
        "DELETE events must have payload=null"
      );
    }
    return { ...evt, payload: null };

  }

  // UPSERT: payload must validate against the entity schema
  let registryItem;
  try {
    registryItem = getRegistryItem(evt.entityType);
  } catch {
    throw new UnknownEntityTypeError(String(evt.entityType));
  }

  const payloadParsed = registryItem.upsertSchema.safeParse(evt.payload);
  if (!payloadParsed.success) {
    throw new InvalidPayloadError(payloadParsed.error.message);
  }

  return {
    ...evt,
    payload: payloadParsed.data
  };
}
