export type EventScalar = string | number | boolean | null;

export type RawSorobanEvent = {
  contractId: string;
  txHash: string;
  ledger: number;
  logIndex: number;
  topics: [string, string, ...string[]];
  data: Record<string, EventScalar>;
};

type EventMeta = {
  id: string;
  contractId: string;
  txHash: string;
  ledger: number;
  logIndex: number;
};

export type TrustLeafEvent =
  | (EventMeta & {
      kind: "role_initialized";
      role: string;
      account: string;
    })
  | (EventMeta & {
      kind: "role_granted";
      role: string;
      admin: string;
      account: string;
    })
  | (EventMeta & {
      kind: "role_revoked";
      role: string;
      admin: string;
      account: string;
    })
  | (EventMeta & {
      kind: "batch_created";
      batchId: string;
      cultivator: string;
      metadataHash: string;
    })
  | (EventMeta & {
      kind: "batch_event_added";
      batchId: string;
      eventIndex: number;
      eventType: string;
      documentHash: string;
    })
  | (EventMeta & {
      kind: "lab_assigned";
      batchId: string;
      cultivator: string;
      lab: string;
    })
  | (EventMeta & {
      kind: "status_updated";
      batchId: string;
      actor: string;
      status: string;
      documentHash: string;
    })
  | (EventMeta & {
      kind: "prescription_issued";
      commitment: string;
      doctor: string;
      patientNullifier: string;
      policyHash: string;
    })
  | (EventMeta & {
      kind: "prescription_consumed";
      commitment: string;
      caller: string;
      patientNullifier: string;
    });

export type ProjectionRoute =
  | "mappings/rbac"
  | "mappings/traceability"
  | "mappings/zkMedical"
  | "mappings/unknown";

export function createEventId(txHash: string, logIndex: number): string {
  return `${txHash}:${logIndex}`;
}

export function normalizeSorobanEvent(event: RawSorobanEvent): TrustLeafEvent | null {
  const [contract, action, ...rest] = event.topics;
  const meta = {
    id: createEventId(event.txHash, event.logIndex),
    contractId: event.contractId,
    txHash: event.txHash,
    ledger: event.ledger,
    logIndex: event.logIndex,
  };

  switch (`${contract}:${action}`) {
    case "trust_leaf_rbac:init":
      return {
        ...meta,
        kind: "role_initialized",
        role: expectTopic(rest, 0, "role"),
        account: expectTopic(rest, 1, "account"),
      };
    case "trust_leaf_rbac:grant":
      return {
        ...meta,
        kind: "role_granted",
        role: expectTopic(rest, 0, "role"),
        admin: expectTopic(rest, 1, "admin"),
        account: expectTopic(rest, 2, "account"),
      };
    case "trust_leaf_rbac:revoke":
      return {
        ...meta,
        kind: "role_revoked",
        role: expectTopic(rest, 0, "role"),
        admin: expectTopic(rest, 1, "admin"),
        account: expectTopic(rest, 2, "account"),
      };
    case "trust_leaf_traceability:batch_created":
      return {
        ...meta,
        kind: "batch_created",
        batchId: expectTopic(rest, 0, "batchId"),
        cultivator: expectTopic(rest, 1, "cultivator"),
        metadataHash: expectString(event.data.metadata_hash, "metadata_hash"),
      };
    case "trust_leaf_traceability:batch_event":
      return {
        ...meta,
        kind: "batch_event_added",
        batchId: expectTopic(rest, 0, "batchId"),
        eventIndex: expectNumber(rest[1], "eventIndex"),
        eventType: expectString(event.data.event_type, "event_type"),
        documentHash: expectString(event.data.document_hash, "document_hash"),
      };
    case "trust_leaf_traceability:lab_assigned":
      return {
        ...meta,
        kind: "lab_assigned",
        batchId: expectTopic(rest, 0, "batchId"),
        cultivator: expectTopic(rest, 1, "cultivator"),
        lab: expectTopic(rest, 2, "lab"),
      };
    case "trust_leaf_traceability:status_updated":
      return {
        ...meta,
        kind: "status_updated",
        batchId: expectTopic(rest, 0, "batchId"),
        actor: expectTopic(rest, 1, "actor"),
        status: expectString(event.data.status, "status"),
        documentHash: expectString(event.data.document_hash, "document_hash"),
      };
    case "trust_leaf_zk_medical:prescription_issued":
      return {
        ...meta,
        kind: "prescription_issued",
        commitment: expectTopic(rest, 0, "commitment"),
        doctor: expectTopic(rest, 1, "doctor"),
        patientNullifier: expectTopic(rest, 2, "patientNullifier"),
        policyHash: expectString(event.data.policy_hash, "policy_hash"),
      };
    case "trust_leaf_zk_medical:prescription_consumed":
      return {
        ...meta,
        kind: "prescription_consumed",
        commitment: expectTopic(rest, 0, "commitment"),
        caller: expectTopic(rest, 1, "caller"),
        patientNullifier: expectTopic(rest, 2, "patientNullifier"),
      };
    default:
      return null;
  }
}

function expectTopic(topics: string[], index: number, name: string): string {
  const value = topics[index];
  if (!value) {
    throw new Error(`missing topic ${name}`);
  }
  return value;
}

function expectString(value: EventScalar, name: string): string {
  if (typeof value !== "string") {
    throw new Error(`expected ${name} to be a string`);
  }
  return value;
}

function expectNumber(value: EventScalar, name: string): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string" && value.length > 0 && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  throw new Error(`expected ${name} to be numeric`);
}
