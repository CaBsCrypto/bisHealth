import "server-only";

import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { getTrustLeafDeployment } from "@/app/lib/trustleaf/deployment";
import { getIndexedState } from "@/app/lib/trustleaf/indexedState";
import {
  createPackedProofEnvelope,
  deriveSignalsFromCircuitInput,
} from "@/app/lib/trustleaf/zkSignals";

type TrustLeafZkLabFile = {
  fixture: {
    currentDay: number;
    commitment: string;
    patientNullifier: string;
    policyHash: string;
    publicInputsHash: string;
    proofHex: string;
    proofBytes: number;
  };
  circuitInput: Record<string, string>;
  publicInputs: string[];
  publicInputOrder: string[];
  note: string;
};

export type TrustLeafZkFixtureView = {
  fixture: TrustLeafZkLabFile["fixture"];
  circuitInput: TrustLeafZkLabFile["circuitInput"];
  publicInputs: string[];
  publicInputOrder: string[];
  note: string;
  derivedSignals: {
    commitmentHex: string;
    patientNullifierHex: string;
    policyHashHex: string;
    publicInputsHashHex: string;
  };
  matchesFixture: {
    commitment: boolean;
    patientNullifier: boolean;
    policyHash: boolean;
    publicInputsHash: boolean;
    all: boolean;
  };
  packedProofEnvelope: {
    proofHex: string;
    publicInputsHashHex: string;
  };
  contractId: string | null;
  verifyAndConsumeArgs: {
    caller: string | null;
    commitment: string;
    proof: string;
    publicInputsHash: string;
    currentDay: number;
  };
  liveStatus: {
    issueTxHash: string | null;
    consumeTxHash: string | null;
    consumedAtLedger: number | null;
    lastVerifiedBy: string | null;
    indexedConsumed: boolean;
  };
};

export async function getTrustLeafZkFixture(): Promise<TrustLeafZkFixtureView> {
  const [lab, deployment, indexedState] = await Promise.all([
    readLabFile(),
    getTrustLeafDeployment(),
    getIndexedState(),
  ]);
  const derivedSignals = await deriveSignalsFromCircuitInput({
    patientSecret: lab.circuitInput.patientSecret,
    prescriptionId: lab.circuitInput.prescriptionId,
    issuedAtUnix: lab.circuitInput.issuedAtUnix,
    validUntilUnix: lab.circuitInput.validUntilUnix,
    dosageClass: lab.circuitInput.dosageClass,
    policyNonce: lab.circuitInput.policyNonce,
    currentDay: lab.circuitInput.currentDay,
  });
  const packedProofEnvelope = createPackedProofEnvelope(lab.fixture.proofHex, derivedSignals);
  const matchesFixture = {
    commitment: normalizeHex(derivedSignals.commitmentHex) === normalizeHex(lab.fixture.commitment),
    patientNullifier:
      normalizeHex(derivedSignals.patientNullifierHex) ===
      normalizeHex(lab.fixture.patientNullifier),
    policyHash: normalizeHex(derivedSignals.policyHashHex) === normalizeHex(lab.fixture.policyHash),
    publicInputsHash:
      normalizeHex(derivedSignals.publicInputsHashHex) ===
      normalizeHex(lab.fixture.publicInputsHash),
    all: false,
  };
  matchesFixture.all =
    matchesFixture.commitment &&
    matchesFixture.patientNullifier &&
    matchesFixture.policyHash &&
    matchesFixture.publicInputsHash;

  const consumedPrescription = indexedState.prescriptions.find(
    (item) => normalizeHex(item.id) === normalizeHex(lab.fixture.commitment) && item.isUsed,
  );

  return {
    fixture: lab.fixture,
    circuitInput: lab.circuitInput,
    publicInputs: lab.publicInputs,
    publicInputOrder: lab.publicInputOrder,
    note: lab.note,
    derivedSignals,
    matchesFixture,
    packedProofEnvelope,
    contractId:
      deployment.contracts.find((contract) => contract.key === "zkMedical")?.contractId ?? null,
    verifyAndConsumeArgs: {
      caller: consumedPrescription?.lastVerifiedBy ?? null,
      commitment: lab.fixture.commitment,
      proof: lab.fixture.proofHex,
      publicInputsHash: lab.fixture.publicInputsHash,
      currentDay: lab.fixture.currentDay,
    },
    liveStatus: {
      issueTxHash: consumedPrescription?.createdAtTxHash ?? null,
      consumeTxHash: consumedPrescription?.consumedAtTxHash ?? null,
      consumedAtLedger: consumedPrescription?.consumedAtLedger ?? null,
      lastVerifiedBy: consumedPrescription?.lastVerifiedBy ?? null,
      indexedConsumed: Boolean(consumedPrescription?.isUsed),
    },
  };
}

async function readLabFile(): Promise<TrustLeafZkLabFile> {
  const labPath = path.resolve(process.cwd(), "data", "trustleaf-zk-lab.json");
  await access(labPath);
  const raw = await readFile(labPath, "utf8");
  return JSON.parse(raw) as TrustLeafZkLabFile;
}

function normalizeHex(value: string) {
  return value.startsWith("0x") ? value.slice(2) : value;
}
