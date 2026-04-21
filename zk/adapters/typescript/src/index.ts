import { createHash } from "node:crypto";
import { buildPoseidon } from "circomlibjs";

export type PrescriptionWitness = {
  patientSecretHex: string;
  prescriptionIdHex: string;
  issuedAtUnix: number;
  validUntilUnix: number;
  dosageClass: number;
  policyNonceHex: string;
  currentDay: number;
};

export type PrescriptionPublicSignals = {
  commitmentHex: string;
  patientNullifierHex: string;
  policyHashHex: string;
  publicInputsHashHex: string;
};

export type PackedProofEnvelope = {
  proofHex: string;
  publicInputsHashHex: string;
};

export const GROTH16_PROOF_LEN_BYTES = 256;
let poseidonPromise: ReturnType<typeof buildPoseidon> | undefined;

function strip0x(value: string): string {
  return value.startsWith("0x") ? value.slice(2) : value;
}

function padHex(value: string): string {
  return strip0x(value).padStart(64, "0");
}

function fieldHexFromNumber(value: number): string {
  return BigInt(value).toString(16).padStart(64, "0");
}

function hashHex(parts: string[]): string {
  const normalized = parts.join("");
  return createHash("sha256").update(Buffer.from(normalized, "hex")).digest("hex");
}

async function poseidonHashHex(parts: bigint[]): Promise<string> {
  if (!poseidonPromise) {
    poseidonPromise = buildPoseidon();
  }

  const poseidon = await poseidonPromise;
  const value = poseidon.F.toObject(poseidon(parts));
  return BigInt(value).toString(16).padStart(64, "0");
}

export async function derivePrescriptionSignals(
  witness: PrescriptionWitness,
): Promise<PrescriptionPublicSignals> {
  const patientSecret = BigInt(witness.patientSecretHex);
  const prescriptionId = BigInt(witness.prescriptionIdHex);
  const issuedAtUnix = BigInt(witness.issuedAtUnix);
  const validUntilUnix = BigInt(witness.validUntilUnix);
  const dosageClass = BigInt(witness.dosageClass);
  const policyNonce = BigInt(witness.policyNonceHex);

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
    fieldHexFromNumber(witness.currentDay),
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

export function packProofEnvelope(
  proofHex: string,
  publicSignals: PrescriptionPublicSignals,
): PackedProofEnvelope {
  const normalizedProofHex = strip0x(proofHex);
  if (normalizedProofHex.length !== GROTH16_PROOF_LEN_BYTES * 2) {
    throw new Error(`Groth16 proof must be ${GROTH16_PROOF_LEN_BYTES} bytes encoded as hex`);
  }

  return {
    proofHex: normalizedProofHex,
    publicInputsHashHex: publicSignals.publicInputsHashHex,
  };
}
