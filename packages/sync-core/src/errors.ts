export class SyncCoreError extends Error {
  public readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export class UnknownEntityTypeError extends SyncCoreError {
  constructor(entityType: string) {
    super("UNKNOWN_ENTITY_TYPE", `Unknown entityType: ${entityType}`);
  }
}

export class InvalidPayloadError extends SyncCoreError {
  constructor(message: string) {
    super("INVALID_PAYLOAD", message);
  }
}
