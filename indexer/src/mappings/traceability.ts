import { Batch, BatchTimelineItem, ProjectionState } from "../model.js";
import { TrustLeafEvent } from "../types.js";

export function applyTraceabilityEvent(state: ProjectionState, event: TrustLeafEvent): void {
  switch (event.kind) {
    case "batch_created": {
      const batch: Batch = {
        id: event.batchId,
        cultivator: event.cultivator,
        lab: null,
        metadataHash: event.metadataHash,
        latestDocumentHash: event.metadataHash,
        status: "Created",
        eventCount: 0,
        lastActor: event.cultivator,
        createdAtLedger: event.ledger,
        updatedAtLedger: event.ledger,
        createdAtTxHash: event.txHash,
        updatedAtTxHash: event.txHash,
      };

      state.batches.set(batch.id, batch);
      state.batchTimeline.set(event.id, {
        id: event.id,
        batchId: event.batchId,
        kind: "batch_created",
        actor: event.cultivator,
        eventIndex: null,
        eventType: "batch_created",
        status: "Created",
        documentHash: event.metadataHash,
        ledger: event.ledger,
        txHash: event.txHash,
        logIndex: event.logIndex,
      });
      return;
    }
    case "batch_event_added": {
      const batch = requireBatch(state, event.batchId);
      batch.latestDocumentHash = event.documentHash;
      batch.eventCount = Math.max(batch.eventCount, event.eventIndex + 1);
      batch.updatedAtLedger = event.ledger;
      batch.updatedAtTxHash = event.txHash;
      state.batches.set(batch.id, batch);

      const timelineItem: BatchTimelineItem = {
        id: event.id,
        batchId: event.batchId,
        kind: "batch_event_added",
        actor: batch.lab ?? batch.cultivator,
        eventIndex: event.eventIndex,
        eventType: event.eventType,
        status: null,
        documentHash: event.documentHash,
        ledger: event.ledger,
        txHash: event.txHash,
        logIndex: event.logIndex,
      };
      state.batchTimeline.set(timelineItem.id, timelineItem);
      return;
    }
    case "lab_assigned": {
      const batch = requireBatch(state, event.batchId);
      batch.lab = event.lab;
      batch.lastActor = event.cultivator;
      batch.updatedAtLedger = event.ledger;
      batch.updatedAtTxHash = event.txHash;
      state.batches.set(batch.id, batch);

      state.batchTimeline.set(event.id, {
        id: event.id,
        batchId: event.batchId,
        kind: "lab_assigned",
        actor: event.cultivator,
        eventIndex: null,
        eventType: "lab_assigned",
        status: null,
        documentHash: batch.latestDocumentHash,
        ledger: event.ledger,
        txHash: event.txHash,
        logIndex: event.logIndex,
      });
      return;
    }
    case "status_updated": {
      const batch = requireBatch(state, event.batchId);
      batch.status = event.status;
      batch.latestDocumentHash = event.documentHash;
      batch.lastActor = event.actor;
      batch.updatedAtLedger = event.ledger;
      batch.updatedAtTxHash = event.txHash;
      state.batches.set(batch.id, batch);

      state.batchTimeline.set(event.id, {
        id: event.id,
        batchId: event.batchId,
        kind: "status_updated",
        actor: event.actor,
        eventIndex: null,
        eventType: "status_updated",
        status: event.status,
        documentHash: event.documentHash,
        ledger: event.ledger,
        txHash: event.txHash,
        logIndex: event.logIndex,
      });
      return;
    }
    default:
      return;
  }
}

function requireBatch(state: ProjectionState, batchId: string): Batch {
  const batch = state.batches.get(batchId);
  if (!batch) {
    throw new Error(`missing batch ${batchId}`);
  }
  return batch;
}
