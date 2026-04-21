import "server-only";

import { createHash } from "node:crypto";

import { buildPoseidon } from "circomlibjs";

type ZkCircuitInput = {
  patientSecret: string;
  prescriptionId: string;
  issuedAtUnix: string;
  validUntilUnix: string;
  dosageClass: string;
  policyNonce: string;
  currentDay: string;
};

export async function deriveSignalsFromCircuitInput(input: ZkCircuitInput) {
  const patientSecret = BigInt(toHexValue(input.patientSecret));
  const prescriptionId = BigInt(toHexValue(input.prescriptionId));
  const issuedAtUnix = BigInt(toNumberValue(input.issuedAtUnix));
  const validUntilUnix = BigInt(toNumberValue(input.validUntilUnix));
  const dosageClass = BigInt(toNumberValue(input.dosageClass));
  const policyNonce = BigInt(toHexValue(input.policyNonce));
  const currentDay = toNumberValue(input.currentDay);

  const policyHashHex = await poseidonHashHex([validUntilUnix, dosageClass, policyNonce]);
  const commitmentHex = await poseidonHashHex([
    patientSecret,
    prescriptionId,
    issuedAtUnix,
    validUntilUnix,
    dosageClass,
    policyNonce,
  ]);
  const patientNullifierHex = await poseidonHashHex([
    patientSecret,
    prescriptionId,
    policyNonce,
  ]);
  const publicInputsHashHex = hashHex([
    fieldHexFromNumber(currentDay),
    commitmentHex,
    patientNullifierHex,
    policyHashHex,
  ]);

  return {
    commitmentHex,
    patientNullifierHex,
    policyHashHex,
    publicInputsHashHex,
  };
}

export function createPackedProofEnvelope(
  proofHex: string,
  publicSignals: {
    publicInputsHashHex: string;
  },
) {
  const normalizedProofHex = strip0x(proofHex);
  if (normalizedProofHex.length !== 256 * 2) {
    throw new Error("Groth16 proof must be 256 bytes encoded as hex");
  }

  return {
    proofHex: normalizedProofHex,
    publicInputsHashHex: publicSignals.publicInputsHashHex,
  };
}

function toHexValue(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("0x")) {
    return trimmed;
  }

  return `0x${BigInt(trimmed).toString(16)}`;
}

function toNumberValue(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`invalid numeric witness field: ${value}`);
  }

  return parsed;
}

function strip0x(value: string) {
  return value.startsWith("0x") ? value.slice(2) : value;
}

function fieldHexFromNumber(value: number) {
  return BigInt(value).toString(16).padStart(64, "0");
}

function hashHex(parts: string[]) {
  return createHash("sha256").update(Buffer.from(parts.join(""), "hex")).digest("hex");
}

let poseidonPromise: ReturnType<typeof buildPoseidon> | undefined;

async function poseidonHashHex(parts: bigint[]) {
  if (!poseidonPromise) {
    poseidonPromise = buildPoseidon();
  }

  const poseidon = await poseidonPromise;
  const value = poseidon.F.toObject(poseidon(parts));
  return BigInt(value).toString(16).padStart(64, "0");
}
