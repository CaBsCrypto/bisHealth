import {
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

import { EventScalar, RawSorobanEvent } from "../types.js";

type RpcGetEventsRequest = {
  startLedger?: number;
  endLedger?: number;
  cursor?: string;
  limit?: number;
  contractIds: string[];
  topicFilters?: string[][];
};

type RpcResponseEnvelope<T> = {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
};

type RpcEventRecord = {
  id: string;
  contractId: string;
  ledger: number;
  txHash: string;
  topic: string[];
  value: string;
  type: "contract" | "system";
  cursor: string;
};

type RpcGetEventsResult = {
  latestLedger: number;
  cursor?: string;
  events: RpcEventRecord[];
};

export type StellarRpcEventPage = {
  latestLedger: number;
  nextCursor?: string;
  events: RawSorobanEvent[];
  rpcEventIds: string[];
};

export type StellarRpcClientOptions = {
  endpoint: string;
  headers?: Record<string, string>;
};

export class StellarRpcTrustLeafClient {
  private readonly endpoint: string;
  private readonly headers: Record<string, string>;

  constructor(options: StellarRpcClientOptions) {
    this.endpoint = options.endpoint;
    this.headers = options.headers ?? {};
  }

  async getEvents(request: RpcGetEventsRequest): Promise<StellarRpcEventPage> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...this.headers,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "trust-leaf-indexer",
        method: "getEvents",
        params: {
          ...(request.cursor ? { cursor: request.cursor } : {}),
          ...(request.startLedger ? { startLedger: request.startLedger } : {}),
          ...(request.endLedger ? { endLedger: request.endLedger } : {}),
          pagination: {
            limit: request.limit ?? 100,
          },
          filters: [
            {
              type: "contract",
              contractIds: request.contractIds,
              ...(request.topicFilters && request.topicFilters.length > 0
                ? { topics: request.topicFilters }
                : {}),
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`stellar rpc getEvents failed with ${response.status}`);
    }

    const payload = (await response.json()) as RpcResponseEnvelope<RpcGetEventsResult>;
    if (!payload.result) {
      const message = payload.error?.message ?? "unknown stellar rpc error";
      throw new Error(message);
    }

    return {
      latestLedger: payload.result.latestLedger,
      nextCursor: payload.result.cursor,
      events: payload.result.events
        .filter((event) => event.type === "contract")
        .map((event) => mapRpcEventToRaw(event)),
      rpcEventIds: payload.result.events.map((event) => event.id),
    };
  }
}

export function mapRpcEventToRaw(event: RpcEventRecord): RawSorobanEvent {
  const topics = event.topic.map((encoded) => decodeTopicSegment(encoded));
  const [contract, action] = topics;
  if (!contract || !action) {
    throw new Error("stellar rpc event does not contain contract/action topics");
  }

  return {
    contractId: event.contractId,
    txHash: event.txHash,
    ledger: event.ledger,
    logIndex: deriveLogIndex(event.id),
    topics: topics as [string, string, ...string[]],
    data: decodeEventPayload(contract, action, event.value),
  };
}

export function createMockRpcEvent(input: {
  id: string;
  contractId: string;
  ledger: number;
  txHash: string;
  topics: unknown[];
  value: unknown;
  cursor?: string;
}): RpcEventRecord {
  return {
    id: input.id,
    contractId: input.contractId,
    ledger: input.ledger,
    txHash: input.txHash,
    type: "contract",
    cursor: input.cursor ?? input.id,
    topic: input.topics.map((segment) => encodeScValBase64(segment)),
    value: encodeScValBase64(input.value),
  };
}

function encodeScValBase64(value: unknown): string {
  return nativeToScVal(value).toXDR("base64");
}

function decodeTopicSegment(encoded: string): string {
  const scv = xdr.ScVal.fromXDR(encoded, "base64");
  return scalarToTopicString(normalizeNativeValue(scValToNative(scv)));
}

function decodeEventPayload(
  contract: string,
  action: string,
  encoded: string,
): Record<string, EventScalar> {
  const scv = xdr.ScVal.fromXDR(encoded, "base64");
  const decoded = normalizeNativeValue(scValToNative(scv));
  const fieldOrder = payloadFieldOrder(contract, action);

  if (fieldOrder.length === 0) {
    return {};
  }

  if (Array.isArray(decoded)) {
    return Object.fromEntries(
      fieldOrder.map((field, index) => [field, normalizeScalar(decoded[index] ?? null)]),
    );
  }

  if (isRecord(decoded)) {
    return Object.fromEntries(
      fieldOrder.map((field) => [field, normalizeScalar(decoded[field] ?? null)]),
    );
  }

  if (fieldOrder.length === 1) {
    return {
      [fieldOrder[0]]: normalizeScalar(decoded),
    };
  }

  throw new Error(`cannot decode payload for ${contract}:${action}`);
}

function payloadFieldOrder(contract: string, action: string): string[] {
  switch (`${contract}:${action}`) {
    case "trust_leaf_traceability:batch_created":
      return ["metadata_hash"];
    case "trust_leaf_traceability:batch_event":
      return ["event_type", "document_hash"];
    case "trust_leaf_traceability:status_updated":
      return ["status", "document_hash"];
    case "trust_leaf_zk_medical:prescription_issued":
      return ["policy_hash"];
    default:
      return [];
  }
}

function deriveLogIndex(eventId: string): number {
  const maybeIndex = eventId.split("-").at(-1);
  if (maybeIndex && /^\d+$/.test(maybeIndex)) {
    return Number(maybeIndex);
  }
  return 0;
}

function normalizeNativeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Address) {
    return value.toString();
  }

  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return `0x${Buffer.from(value).toString("hex")}`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeNativeValue(item));
  }

  if (value instanceof Map) {
    return Object.fromEntries(
      [...value.entries()].map(([key, nested]) => [
        scalarToTopicString(normalizeNativeValue(key)),
        normalizeNativeValue(nested),
      ]),
    );
  }

  if (typeof value === "object") {
    if (typeof (value as { toString?: () => string }).toString === "function") {
      const maybeString = (value as { toString: () => string }).toString();
      if (maybeString !== "[object Object]") {
        return maybeString;
      }
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        normalizeNativeValue(nested),
      ]),
    );
  }

  return String(value);
}

function scalarToTopicString(value: unknown): string {
  const scalar = normalizeScalar(value);
  if (scalar === null) {
    return "null";
  }
  return String(scalar);
}

function normalizeScalar(value: unknown): EventScalar {
  if (value === null || value === undefined) {
    return null;
  }

  if (Array.isArray(value) && value.length === 1) {
    return normalizeScalar(value[0]);
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
