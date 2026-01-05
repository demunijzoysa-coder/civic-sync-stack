import { z } from "zod";

/**
 * ISO 8601 timestamp string. Example: "2026-01-05T12:34:56.000Z"
 */
export const IsoDateTimeString = z
  .string()
  .datetime({ offset: true })
  .describe("ISO 8601 datetime string with timezone offset");

export type IsoDateTimeString = z.infer<typeof IsoDateTimeString>;

/**
 * ULID is great for offline-first: sortable, unique, safe to generate client-side.
 * We'll use string format validation at boundaries only (not perfect, but practical).
 */
export const UlidString = z
  .string()
  .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/, "Invalid ULID format")
  .describe("ULID string");

export type UlidString = z.infer<typeof UlidString>;
