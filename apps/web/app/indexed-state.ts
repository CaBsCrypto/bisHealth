export type IndexedSnapshot = {
  roleMemberships: Array<{
    id: string;
    role: string;
    account: string;
    grantedBy: string | null;
    grantedAtLedger: number;
    revokedBy: string | null;
    revokedAtLedger: number | null;
    isActive: boolean;
  }>;
  roleChanges: Array<{
    id: string;
    role: string;
    account: string;
    action: string;
    admin: string | null;
    ledger: number;
    txHash: string;
    logIndex: number;
  }>;
  batches: Array<{
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
  }>;
  batchTimeline: Array<{
    id: string;
    batchId: string;
    kind: string;
    actor: string | null;
    eventIndex: number | null;
    eventType: string | null;
    status: string | null;
    documentHash: string;
    ledger: number;
    txHash: string;
    logIndex: number;
  }>;
  prescriptions: Array<{
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
  }>;
  prescriptionConsumptions: Array<{
    id: string;
    prescriptionId: string;
    caller: string;
    patientNullifier: string;
    ledger: number;
    txHash: string;
    logIndex: number;
  }>;
};

export const indexedSnapshot: IndexedSnapshot = {
  roleMemberships: [
    {
      id: "ADMIN:GA_TRUSTLEAF_ADMIN",
      role: "ADMIN",
      account: "GA_TRUSTLEAF_ADMIN",
      grantedBy: null,
      grantedAtLedger: 812345,
      revokedBy: null,
      revokedAtLedger: null,
      isActive: true,
    },
    {
      id: "DOCTOR:GA_DR_VERA",
      role: "DOCTOR",
      account: "GA_DR_VERA",
      grantedBy: "GA_TRUSTLEAF_ADMIN",
      grantedAtLedger: 812352,
      revokedBy: null,
      revokedAtLedger: null,
      isActive: true,
    },
    {
      id: "DISP:GA_GREEN_LEAF",
      role: "DISP",
      account: "GA_GREEN_LEAF",
      grantedBy: "GA_TRUSTLEAF_ADMIN",
      grantedAtLedger: 812361,
      revokedBy: null,
      revokedAtLedger: null,
      isActive: true,
    },
  ],
  roleChanges: [
    {
      id: "9f4a:0",
      role: "ADMIN",
      account: "GA_TRUSTLEAF_ADMIN",
      action: "init",
      admin: null,
      ledger: 812345,
      txHash: "9f4ad58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516001",
      logIndex: 0,
    },
    {
      id: "9f4b:0",
      role: "DOCTOR",
      account: "GA_DR_VERA",
      action: "grant",
      admin: "GA_TRUSTLEAF_ADMIN",
      ledger: 812352,
      txHash: "9f4bd58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516002",
      logIndex: 0,
    },
  ],
  batches: [
    {
      id: "0x746c2d62617463682d3030310000000000000000000000000000000000000000",
      cultivator: "GA_CULT_ANDES",
      lab: "GA_LAB_ANDES",
      metadataHash: "0x01feab2001feab2001feab2001feab2001feab2001feab2001feab2001feab20",
      latestDocumentHash:
        "0x09d1ca5509d1ca5509d1ca5509d1ca5509d1ca5509d1ca5509d1ca5509d1ca55",
      status: "Released",
      eventCount: 2,
      lastActor: "GA_LAB_ANDES",
      createdAtLedger: 812401,
      updatedAtLedger: 812447,
      createdAtTxHash: "ab14d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516010",
      updatedAtTxHash: "ab14d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516099",
    },
  ],
  batchTimeline: [
    {
      id: "ab14:0",
      batchId: "0x746c2d62617463682d3030310000000000000000000000000000000000000000",
      kind: "batch_created",
      actor: "GA_CULT_ANDES",
      eventIndex: null,
      eventType: "batch_created",
      status: "Created",
      documentHash:
        "0x01feab2001feab2001feab2001feab2001feab2001feab2001feab2001feab20",
      ledger: 812401,
      txHash: "ab14d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516010",
      logIndex: 0,
    },
    {
      id: "ab15:1",
      batchId: "0x746c2d62617463682d3030310000000000000000000000000000000000000000",
      kind: "batch_event_added",
      actor: "GA_LAB_ANDES",
      eventIndex: 0,
      eventType: "HARVESTED",
      status: null,
      documentHash:
        "0x02ecbc3302ecbc3302ecbc3302ecbc3302ecbc3302ecbc3302ecbc3302ecbc33",
      ledger: 812420,
      txHash: "ab15d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516020",
      logIndex: 1,
    },
    {
      id: "ab16:0",
      batchId: "0x746c2d62617463682d3030310000000000000000000000000000000000000000",
      kind: "status_updated",
      actor: "GA_LAB_ANDES",
      eventIndex: null,
      eventType: "status_updated",
      status: "Released",
      documentHash:
        "0x09d1ca5509d1ca5509d1ca5509d1ca5509d1ca5509d1ca5509d1ca5509d1ca55",
      ledger: 812447,
      txHash: "ab16d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516099",
      logIndex: 0,
    },
  ],
  prescriptions: [
    {
      id: "0x14d4feaf493cdfe101111ba812f3f61a9ca8234fd5aea944bb7c4849f7f681ea",
      doctor: "GA_DR_VERA",
      patientNullifier:
        "0x121e8368b948d8f641f9e97ae1c314235deb1c3d595874787be47ef31195104c",
      policyHash:
        "0x011124e45f92c16a6fdaa1a452aee204989fd69bd851f55dce30503093c7a2a8",
      isUsed: true,
      lastVerifiedBy: "GA_GREEN_LEAF",
      createdAtLedger: 812510,
      createdAtTxHash: "cd11d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516200",
      consumedAtLedger: 812544,
      consumedAtTxHash: "cd12d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516240",
    },
    {
      id: "0x24d4feaf493cdfe101111ba812f3f61a9ca8234fd5aea944bb7c4849f7f682ff",
      doctor: "GA_DR_VERA",
      patientNullifier:
        "0x221e8368b948d8f641f9e97ae1c314235deb1c3d595874787be47ef3119510abc",
      policyHash:
        "0x031124e45f92c16a6fdaa1a452aee204989fd69bd851f55dce30503093c7b9de",
      isUsed: false,
      lastVerifiedBy: null,
      createdAtLedger: 812560,
      createdAtTxHash: "cd13d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516260",
      consumedAtLedger: null,
      consumedAtTxHash: null,
    },
  ],
  prescriptionConsumptions: [
    {
      id: "cd12:0",
      prescriptionId: "0x14d4feaf493cdfe101111ba812f3f61a9ca8234fd5aea944bb7c4849f7f681ea",
      caller: "GA_GREEN_LEAF",
      patientNullifier:
        "0x121e8368b948d8f641f9e97ae1c314235deb1c3d595874787be47ef31195104c",
      ledger: 812544,
      txHash: "cd12d58f0f99d1f4c430c1ee818307f6108da7d33cd2219974dd76a1dc516240",
      logIndex: 0,
    },
  ],
};
