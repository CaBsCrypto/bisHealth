import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  deserializeProjectionState,
  type SerializedProjectionState,
} from "../model.js";
import { ingestFromStellarRpc } from "../ingest/rpcIngest.js";

const endpoint = process.env.TRUST_LEAF_RPC_URL;
if (!endpoint) {
  throw new Error("TRUST_LEAF_RPC_URL is required");
}

const contractIds = (process.env.TRUST_LEAF_CONTRACT_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
if (contractIds.length === 0) {
  throw new Error("TRUST_LEAF_CONTRACT_IDS is required");
}

const outputFile =
  process.env.TRUST_LEAF_OUTPUT_FILE ??
  path.resolve(process.cwd(), "..", "apps", "web", "data", "trustleaf-indexed-state.json");
const initialState = deserializeProjectionState(await readProjectionIfPresent(outputFile));

const summary = await ingestFromStellarRpc({
  endpoint,
  contractIds,
  startLedger: parseOptionalNumber(process.env.TRUST_LEAF_START_LEDGER),
  endLedger: parseOptionalNumber(process.env.TRUST_LEAF_END_LEDGER),
  pageLimit: parseOptionalNumber(process.env.TRUST_LEAF_PAGE_LIMIT),
  maxPages: parseOptionalNumber(process.env.TRUST_LEAF_MAX_PAGES) ?? 1,
  cursorFile: process.env.TRUST_LEAF_CURSOR_FILE,
  initialState,
});

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(summary.projection, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      ...summary,
      outputFile,
    },
    null,
    2,
  ),
);

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`invalid numeric env value: ${value}`);
  }
  return parsed;
}

async function readProjectionIfPresent(outputFile: string): Promise<SerializedProjectionState> {
  try {
    await access(outputFile);
    const raw = await readFile(outputFile, "utf8");
    return JSON.parse(raw) as SerializedProjectionState;
  } catch {
    return {
      roleMemberships: [],
      roleChanges: [],
      batches: [],
      batchTimeline: [],
      prescriptions: [],
      prescriptionConsumptions: [],
    };
  }
}
