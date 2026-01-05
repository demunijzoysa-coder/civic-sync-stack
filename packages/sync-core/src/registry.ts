import { z } from "zod";
import {
  EntityTypeSchema,
  type EntityType,
  AppointmentSchema
} from "@civic/shared";

export type EntityRegistryItem = {
  entityType: EntityType;
  // schema for UPSERT payload
  upsertSchema: z.ZodTypeAny;
};

const REGISTRY: Record<EntityType, EntityRegistryItem> = {
  APPOINTMENT: {
    entityType: "APPOINTMENT",
    upsertSchema: AppointmentSchema
  }
};

export function getRegistryItem(entityType: unknown): EntityRegistryItem {
  const parsed = EntityTypeSchema.safeParse(entityType);
  if (!parsed.success) {
    // caller will handle unknown entity type
    throw new Error(`Invalid entityType: ${String(entityType)}`);
  }
  return REGISTRY[parsed.data];
}
