import { createMockRpcEvent, mapRpcEventToRaw } from "./adapters/stellarRpc.js";
import { serializeProjectionState, createProjectionState } from "./model.js";
import { applyRawEvents } from "./processor.js";

const rpcEvents = [
  createMockRpcEvent({
    id: "0000000000000000001-0000000000",
    contractId: "C_RBAC",
    ledger: 501,
    txHash: "a".repeat(64),
    topics: ["trust_leaf_rbac", "grant", "DOCTOR", "GA_ADMIN", "GA_DOCTOR"],
    value: null,
  }),
  createMockRpcEvent({
    id: "0000000000000000002-0000000000",
    contractId: "C_TRACE",
    ledger: 502,
    txHash: "b".repeat(64),
    topics: [
      "trust_leaf_traceability",
      "batch_created",
      Buffer.from("batch-001".padEnd(32, "0")).subarray(0, 32),
      "GA_CULTIVATOR",
    ],
    value: [Buffer.from("meta-001".padEnd(32, "0")).subarray(0, 32)],
  }),
  createMockRpcEvent({
    id: "0000000000000000003-0000000001",
    contractId: "C_ZK",
    ledger: 503,
    txHash: "c".repeat(64),
    topics: [
      "trust_leaf_zk_medical",
      "prescription_issued",
      Buffer.from("commitment-001".padEnd(32, "0")).subarray(0, 32),
      "GA_DOCTOR",
      Buffer.from("nullifier-001".padEnd(32, "0")).subarray(0, 32),
    ],
    value: [Buffer.from("policy-001".padEnd(32, "0")).subarray(0, 32)],
  }),
];

const rawEvents = rpcEvents.map((event) => mapRpcEventToRaw(event));
const state = createProjectionState();
applyRawEvents(rawEvents, state);

console.log(
  JSON.stringify(
    {
      rawEvents,
      projection: serializeProjectionState(state),
    },
    null,
    2,
  ),
);
