import "server-only";

import {
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";

import { getTrustLeafDoctorActionPack } from "./actionRails";
import { getTrustLeafDeployment } from "./deployment";

const DEFAULT_POLL_ATTEMPTS = 8;

export type TrustLeafDoctorIssueInput = {
  doctor?: string | null;
  commitment?: string | null;
  patientNullifier?: string | null;
  policyHash?: string | null;
  baseFee?: string | null;
};

export function getTrustLeafDoctorSubmitConfig() {
  const doctorSecretKey = process.env.TRUST_LEAF_DOCTOR_SECRET_KEY ?? null;
  const doctorPublicKey = doctorSecretKey ? Keypair.fromSecret(doctorSecretKey).publicKey() : null;

  return {
    enabled: Boolean(doctorSecretKey),
    doctorPublicKey,
    mode: doctorSecretKey ? ("server-signing" as const) : ("missing-secret" as const),
  };
}

export async function submitDoctorIssuePrescription(
  input: TrustLeafDoctorIssueInput,
  requestedBy: string,
) {
  const submitConfig = getTrustLeafDoctorSubmitConfig();
  if (!submitConfig.enabled || !process.env.TRUST_LEAF_DOCTOR_SECRET_KEY) {
    throw new Error("TRUST_LEAF_DOCTOR_SECRET_KEY is not configured");
  }

  const [deployment, doctorActionPack] = await Promise.all([
    getTrustLeafDeployment(),
    getTrustLeafDoctorActionPack(submitConfig.doctorPublicKey),
  ]);
  const contractId =
    deployment.contracts.find((contract) => contract.key === "zkMedical")?.contractId ?? null;

  if (!contractId) {
    throw new Error("Live ZK medical contract is not configured");
  }

  const doctorKeypair = Keypair.fromSecret(process.env.TRUST_LEAF_DOCTOR_SECRET_KEY);
  const doctor = normalizeDoctorAddress(input.doctor, doctorKeypair.publicKey());
  if (doctor !== doctorKeypair.publicKey()) {
    throw new Error("Configured doctor secret does not match the requested doctor account");
  }

  const commitment = normalizeHex32(input.commitment ?? doctorActionPack.suggestedCommitment, "commitment");
  const patientNullifier = normalizeHex32(
    input.patientNullifier ?? doctorActionPack.suggestedPatientNullifier,
    "patientNullifier",
  );
  const policyHash = normalizeHex32(input.policyHash ?? doctorActionPack.suggestedPolicyHash, "policyHash");
  const rpcUrl = deployment.rpcUrl || process.env.TRUST_LEAF_STELLAR_RPC_URL;
  const networkPassphrase =
    deployment.networkPassphrase ||
    process.env.TRUST_LEAF_NETWORK_PASSPHRASE ||
    Networks.TESTNET;

  if (!rpcUrl) {
    throw new Error("TRUST_LEAF_STELLAR_RPC_URL is not configured");
  }

  const server = new rpc.Server(rpcUrl);
  const sourceAccount = await server.getAccount(doctorKeypair.publicKey());
  const contract = new Contract(contractId);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: normalizeBaseFee(input.baseFee),
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "issue_prescription",
        new Address(doctor).toScVal(),
        xdr.ScVal.scvBytes(Buffer.from(commitment, "hex")),
        xdr.ScVal.scvBytes(Buffer.from(patientNullifier, "hex")),
        xdr.ScVal.scvBytes(Buffer.from(policyHash, "hex")),
      ),
    )
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(transaction);
  prepared.sign(doctorKeypair);

  const submission = await server.sendTransaction(prepared);
  const polled = submission.hash
    ? await server
        .pollTransaction(submission.hash, { attempts: DEFAULT_POLL_ATTEMPTS })
        .catch(() => null)
    : null;

  return {
    requestedBy,
    mode: submitConfig.mode,
    contractId,
    rpcUrl,
    networkPassphrase,
    doctor,
    commitment,
    patientNullifier,
    policyHash,
    envelopeXdr: prepared.toXDR(),
    submission,
    polled,
    explorerUrl: submission.hash
      ? `https://stellar.expert/explorer/testnet/tx/${submission.hash}`
      : null,
  };
}

function normalizeDoctorAddress(value: string | null | undefined, fallback: string) {
  const candidate = value?.trim() || fallback;
  if (!candidate.startsWith("G")) {
    throw new Error("doctor must be a valid Stellar account address");
  }
  return candidate;
}

function normalizeHex32(value: string | null | undefined, label: string) {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(normalized)) {
    throw new Error(`${label} must be a 32-byte hex value`);
  }
  return normalized;
}

function normalizeBaseFee(value: string | null | undefined) {
  const normalized = value?.trim() || process.env.TRUST_LEAF_BASE_FEE || String(BASE_FEE);
  if (!/^[0-9]+$/.test(normalized)) {
    throw new Error("baseFee must be numeric");
  }
  return normalized;
}
