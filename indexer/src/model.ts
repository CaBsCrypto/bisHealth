export type RoleMembership = {
  id: string;
  role: string;
  account: string;
  grantedBy: string | null;
  grantedAtLedger: number;
  revokedBy: string | null;
  revokedAtLedger: number | null;
  isActive: boolean;
};

export type RoleChange = {
  id: string;
  role: string;
  account: string;
  action: "init" | "grant" | "revoke";
  admin: string | null;
  ledger: number;
  txHash: string;
  logIndex: number;
};

export type Batch = {
  id: string;
  cultivator: string;
  lab: string | null;
  metadataHash: string;
  latestDocumentHash: string;
  status: string;
  eventCount: number;
  lastActor: string | null;
  createdAtLedger: number;
  updatedAtLedger: number;
  createdAtTxHash: string;
  updatedAtTxHash: string;
};

export type BatchTimelineItem = {
  id: string;
  batchId: string;
  kind: "batch_created" | "batch_event_added" | "lab_assigned" | "status_updated";
  actor: string | null;
  eventIndex: number | null;
  eventType: string | null;
  status: string | null;
  documentHash: string;
  ledger: number;
  txHash: string;
  logIndex: number;
};

export type Prescription = {
  id: string;
  doctor: string;
  patientNullifier: string;
  policyHash: string;
  isUsed: boolean;
  lastVerifiedBy: string | null;
  createdAtLedger: number;
  createdAtTxHash: string;
  consumedAtLedger: number | null;
  consumedAtTxHash: string | null;
};

export type PrescriptionConsumption = {
  id: string;
  prescriptionId: string;
  caller: string;
  patientNullifier: string;
  ledger: number;
  txHash: string;
  logIndex: number;
};

export type ProjectionState = {
  roleMemberships: Map<string, RoleMembership>;
  roleChanges: Map<string, RoleChange>;
  batches: Map<string, Batch>;
  batchTimeline: Map<string, BatchTimelineItem>;
  prescriptions: Map<string, Prescription>;
  prescriptionConsumptions: Map<string, PrescriptionConsumption>;
};

export type SerializedProjectionState = {
  roleMemberships: RoleMembership[];
  roleChanges: RoleChange[];
  batches: Batch[];
  batchTimeline: BatchTimelineItem[];
  prescriptions: Prescription[];
  prescriptionConsumptions: PrescriptionConsumption[];
};

export function createProjectionState(): ProjectionState {
  return {
    roleMemberships: new Map(),
    roleChanges: new Map(),
    batches: new Map(),
    batchTimeline: new Map(),
    prescriptions: new Map(),
    prescriptionConsumptions: new Map(),
  };
}

export function serializeProjectionState(state: ProjectionState): SerializedProjectionState {
  return {
    roleMemberships: [...state.roleMemberships.values()],
    roleChanges: [...state.roleChanges.values()],
    batches: [...state.batches.values()],
    batchTimeline: [...state.batchTimeline.values()],
    prescriptions: [...state.prescriptions.values()],
    prescriptionConsumptions: [...state.prescriptionConsumptions.values()],
  };
}

export function deserializeProjectionState(
  snapshot: SerializedProjectionState,
): ProjectionState {
  return {
    roleMemberships: new Map(snapshot.roleMemberships.map((item) => [item.id, item])),
    roleChanges: new Map(snapshot.roleChanges.map((item) => [item.id, item])),
    batches: new Map(snapshot.batches.map((item) => [item.id, item])),
    batchTimeline: new Map(snapshot.batchTimeline.map((item) => [item.id, item])),
    prescriptions: new Map(snapshot.prescriptions.map((item) => [item.id, item])),
    prescriptionConsumptions: new Map(
      snapshot.prescriptionConsumptions.map((item) => [item.id, item]),
    ),
  };
}
