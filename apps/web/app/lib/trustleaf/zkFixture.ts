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
  circuitInput: TrustLeafZkCircuitInput;
  publicInputs: string[];
  publicInputOrder: string[];
  note: string;
};

export type TrustLeafZkCircuitInput = {
  patientSecret: string;
  prescriptionId: string;
  issuedAtUnix: string;
  validUntilUnix: string;
  dosageClass: string;
  policyNonce: string;
  currentDay: string;
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
  consumePack: {
    payload: {
      contractId: string | null;
      rpcUrl: string | null;
      networkPassphrase: string | null;
      caller: string | null;
      commitment: string;
      proof: string;
      publicInputsHash: string;
      currentDay: number;
    };
    payloadBase64: string;
    scriptPath: string;
    scriptCommand: string;
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
  return buildTrustLeafZkFixtureView();
}

export async function deriveTrustLeafZkFixture(options?: {
  circuitInput?: Partial<TrustLeafZkCircuitInput>;
  proofHex?: string;
}): Promise<TrustLeafZkFixtureView> {
  return buildTrustLeafZkFixtureView(options);
}

async function buildTrustLeafZkFixtureView(options?: {
  circuitInput?: Partial<TrustLeafZkCircuitInput>;
  proofHex?: string;
}): Promise<TrustLeafZkFixtureView> {
  const [lab, deployment, indexedState] = await Promise.all([
    readLabFile(),
    getTrustLeafDeployment(),
    getIndexedState(),
  ]);
  const circuitInput = {
    ...lab.circuitInput,
    ...options?.circuitInput,
  };
  const derivedSignals = await deriveSignalsFromCircuitInput({
    patientSecret: circuitInput.patientSecret,
    prescriptionId: circuitInput.prescriptionId,
    issuedAtUnix: circuitInput.issuedAtUnix,
    validUntilUnix: circuitInput.validUntilUnix,
    dosageClass: circuitInput.dosageClass,
    policyNonce: circuitInput.policyNonce,
    currentDay: circuitInput.currentDay,
  });
  const proofHex = options?.proofHex ?? lab.fixture.proofHex;
  const packedProofEnvelope = createPackedProofEnvelope(proofHex, derivedSignals);
  const fixture = {
    currentDay: Number(circuitInput.currentDay),
    commitment: derivedSignals.commitmentHex,
    patientNullifier: derivedSignals.patientNullifierHex,
    policyHash: derivedSignals.policyHashHex,
    publicInputsHash: derivedSignals.publicInputsHashHex,
    proofHex,
    proofBytes: normalizeHex(proofHex).length / 2,
  };
  const publicInputs = [
    circuitInput.currentDay.trim(),
    decimalStringFromHex(derivedSignals.commitmentHex),
    decimalStringFromHex(derivedSignals.patientNullifierHex),
    decimalStringFromHex(derivedSignals.policyHashHex),
  ];
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
    (item) => normalizeHex(item.id) === normalizeHex(fixture.commitment) && item.isUsed,
  );
  const caller = consumedPrescription?.lastVerifiedBy ?? null;
  const payload = {
    contractId:
      deployment.contracts.find((contract) => contract.key === "zkMedical")?.contractId ?? null,
    rpcUrl: deployment.rpcUrl ?? null,
    networkPassphrase: deployment.networkPassphrase ?? null,
    caller,
    commitment: fixture.commitment,
    proof: proofHex,
    publicInputsHash: fixture.publicInputsHash,
    currentDay: fixture.currentDay,
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
  const scriptCommand = [
    "powershell",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    ".\\scripts\\testnet\\Invoke-ZkConsumePayload.ps1",
    "-PayloadBase64",
    `'${payloadBase64}'`,
    "-SourceAlias",
    "bob",
    "-Caller",
    caller ?? "<dispensary-address>",
  ].join(" ");

  return {
    fixture,
    circuitInput,
    publicInputs,
    publicInputOrder: lab.publicInputOrder,
    note: matchesFixture.all
      ? lab.note
      : `${lab.note} Derived from the editable witness composer in the wallet-less workbench.`,
    derivedSignals,
    matchesFixture,
    packedProofEnvelope,
    contractId: payload.contractId,
    verifyAndConsumeArgs: {
      caller,
      commitment: fixture.commitment,
      proof: proofHex,
      publicInputsHash: fixture.publicInputsHash,
      currentDay: fixture.currentDay,
    },
    consumePack: {
      payload,
      payloadBase64,
      scriptPath: ".\\scripts\\testnet\\Invoke-ZkConsumePayload.ps1",
      scriptCommand,
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

function decimalStringFromHex(value: string) {
  return BigInt(`0x${normalizeHex(value)}`).toString(10);
}
