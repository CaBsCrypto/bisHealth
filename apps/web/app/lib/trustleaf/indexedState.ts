import "server-only";

import { access, readFile } from "node:fs/promises";
import path from "node:path";

import {
  indexedSnapshot as fallbackIndexedSnapshot,
  type IndexedSnapshot,
} from "@/app/indexed-state";

export async function getIndexedState(): Promise<IndexedSnapshot> {
  const indexedStatePath = resolveIndexedStatePath();
  const liveSnapshot = await readIndexedStateIfPresent(indexedStatePath);
  return normalizeIndexedState(liveSnapshot ?? fallbackIndexedSnapshot);
}

function resolveIndexedStatePath() {
  return (
    process.env.TRUST_LEAF_INDEXED_STATE_PATH ??
    path.resolve(process.cwd(), "data", "trustleaf-indexed-state.json")
  );
}

async function readIndexedStateIfPresent(indexedStatePath: string): Promise<IndexedSnapshot | null> {
  try {
    await access(indexedStatePath);
    const raw = await readFile(indexedStatePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return isIndexedSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isIndexedSnapshot(value: unknown): value is IndexedSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<IndexedSnapshot>;
  return (
    Array.isArray(candidate.roleMemberships) &&
    Array.isArray(candidate.roleChanges) &&
    Array.isArray(candidate.batches) &&
    Array.isArray(candidate.batchTimeline) &&
    Array.isArray(candidate.prescriptions) &&
    Array.isArray(candidate.prescriptionConsumptions)
  );
}

function normalizeIndexedState(snapshot: IndexedSnapshot): IndexedSnapshot {
  return {
    roleMemberships: [...snapshot.roleMemberships].sort((left, right) => {
      if (left.isActive !== right.isActive) {
        return Number(right.isActive) - Number(left.isActive);
      }
      return right.grantedAtLedger - left.grantedAtLedger;
    }),
    roleChanges: [...snapshot.roleChanges].sort(
      (left, right) => compareLedgerItems(right.ledger, right.logIndex, left.ledger, left.logIndex),
    ),
    batches: [...snapshot.batches].sort(
      (left, right) =>
        compareLedgerItems(
          right.updatedAtLedger,
          0,
          left.updatedAtLedger,
          0,
        ) || right.eventCount - left.eventCount,
    ),
    batchTimeline: [...snapshot.batchTimeline].sort((left, right) =>
      compareLedgerItems(right.ledger, right.logIndex, left.ledger, left.logIndex),
    ),
    prescriptions: [...snapshot.prescriptions].sort(
      (left, right) =>
        compareLedgerItems(
          right.createdAtLedger,
          right.isUsed ? 1 : 0,
          left.createdAtLedger,
          left.isUsed ? 1 : 0,
        ),
    ),
    prescriptionConsumptions: [...snapshot.prescriptionConsumptions].sort((left, right) =>
      compareLedgerItems(right.ledger, right.logIndex, left.ledger, left.logIndex),
    ),
  };
}

function compareLedgerItems(
  leftLedger: number,
  leftLogIndex: number,
  rightLedger: number,
  rightLogIndex: number,
) {
  if (leftLedger !== rightLedger) {
    return leftLedger - rightLedger;
  }

  return leftLogIndex - rightLogIndex;
}
