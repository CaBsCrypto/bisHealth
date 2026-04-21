import { serializeProjectionState } from "./model.js";
import { applyRawEvents } from "./processor.js";
import { RawSorobanEvent } from "./types.js";

const demoEvents: RawSorobanEvent[] = [
  {
    contractId: "CDUMMYRBAC",
    txHash: "tx-init",
    ledger: 101,
    logIndex: 0,
    topics: ["trust_leaf_rbac", "init", "ADMIN", "GA_ADMIN"],
    data: {},
  },
  {
    contractId: "CDUMMYTRACE",
    txHash: "tx-batch",
    ledger: 102,
    logIndex: 0,
    topics: ["trust_leaf_traceability", "batch_created", "0xbatch001", "GA_CULTIVATOR"],
    data: {
      metadata_hash: "0xmeta001",
    },
  },
  {
    contractId: "CDUMMYZK",
    txHash: "tx-rx",
    ledger: 103,
    logIndex: 0,
    topics: [
      "trust_leaf_zk_medical",
      "prescription_issued",
      "0xcommitment001",
      "GA_DOCTOR",
      "0xnullifier001",
    ],
    data: {
      policy_hash: "0xpolicy001",
    },
  },
  {
    contractId: "CDUMMYZK",
    txHash: "tx-consume",
    ledger: 104,
    logIndex: 1,
    topics: [
      "trust_leaf_zk_medical",
      "prescription_consumed",
      "0xcommitment001",
      "GA_DISPENSARY",
      "0xnullifier001",
    ],
    data: {},
  },
];

const state = applyRawEvents(demoEvents);

console.log(JSON.stringify(serializeProjectionState(state), null, 2));
