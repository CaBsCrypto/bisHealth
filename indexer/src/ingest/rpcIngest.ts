import path from "node:path";

import { StellarRpcTrustLeafClient } from "../adapters/stellarRpc.js";
import {
  createProjectionState,
  ProjectionState,
  serializeProjectionState,
  type SerializedProjectionState,
} from "../model.js";
import { applyRawEvents } from "../processor.js";
import { FileCursorStore } from "./cursorStore.js";

export type RpcIngestOptions = {
  endpoint: string;
  contractIds: string[];
  startLedger?: number;
  endLedger?: number;
  pageLimit?: number;
  maxPages?: number;
  cursorFile?: string;
  headers?: Record<string, string>;
  initialState?: ProjectionState;
};

export type RpcIngestSummary = {
  ingestedEvents: number;
  pagesFetched: number;
  latestLedger: number | null;
  nextCursor?: string;
  projection: SerializedProjectionState;
};

export async function ingestFromStellarRpc(
  options: RpcIngestOptions,
): Promise<RpcIngestSummary> {
  const client = new StellarRpcTrustLeafClient({
    endpoint: options.endpoint,
    headers: options.headers,
  });
  const cursorFile =
    options.cursorFile ??
    path.resolve(process.cwd(), ".state", "trust-leaf-rpc-cursor.json");
  const cursorStore = new FileCursorStore(cursorFile);
  const cursorState = await cursorStore.load();
  const state = options.initialState ?? createProjectionState();

  let nextCursor: string | undefined;
  let resumeStartLedger = cursorState.rpc?.latestLedger
    ? cursorState.rpc.latestLedger + 1
    : options.startLedger;
  let latestLedger: number | null = null;
  let pagesFetched = 0;
  let ingestedEvents = 0;

  while (pagesFetched < (options.maxPages ?? 1)) {
    const startLedger = resumeStartLedger ?? 1;
    const page = await fetchPageWithLedgerRangeRecovery(client, {
      contractIds: options.contractIds,
      startLedger,
      endLedger: nextCursor ? undefined : options.endLedger,
      limit: options.pageLimit ?? 100,
    });

    latestLedger = page.latestLedger;
    nextCursor = page.nextCursor;
    resumeStartLedger = (page.latestLedger ?? startLedger) + 1;
    pagesFetched += 1;
    ingestedEvents += page.events.length;
    applyRawEvents(page.events, state);

    if (page.events.length === 0) {
      break;
    }
  }

  await cursorStore.save({
    rpc: {
      cursor: undefined,
      latestLedger: latestLedger ?? undefined,
      lastIngestedAt: new Date().toISOString(),
    },
  });

  return {
    ingestedEvents,
    pagesFetched,
    latestLedger,
    nextCursor,
    projection: serializeProjectionState(state),
  };
}

async function fetchPageWithLedgerRangeRecovery(
  client: StellarRpcTrustLeafClient,
  request: {
    contractIds: string[];
    startLedger?: number;
    endLedger?: number;
    cursor?: string;
    limit?: number;
  },
) {
  try {
    return await client.getEvents(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const recoveredStartLedger = extractRpcRangeStart(message);
    if (!request.cursor && recoveredStartLedger !== null) {
      return client.getEvents({
        ...request,
        startLedger: recoveredStartLedger,
      });
    }

    throw error;
  }
}

function extractRpcRangeStart(message: string): number | null {
  const match = message.match(/ledger range:\s*(\d+)\s*-\s*(\d+)/i);
  if (!match) {
    return null;
  }

  return Number(match[1]);
}
