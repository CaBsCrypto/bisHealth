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

import { getTrustLeafDispensaryActionPack } from "./actionRails";
import { getTrustLeafDeployment } from "./deployment";
import { getTrustLeafZkFixture } from "./zkFixture";

const DEFAULT_POLL_ATTEMPTS = 8;

export type TrustLeafDispensaryConsumeInput = {
  caller?: string | null;
  commitment?: string | null;
  proof?: string | null;
  publicInputsHash?: string | null;
  currentDay?: number | null;
  baseFee?: string | null;
};

export function getTrustLeafDispensarySubmitConfig() {
  const dispensarySecretKey = process.env.TRUST_LEAF_DISPENSARY_SECRET_KEY ?? null;
  const dispensaryPublicKey = dispensarySecretKey
    ? Keypair.fromSecret(dispensarySecretKey).publicKey()
    : null;

  return {
    enabled: Boolean(dispensarySecretKey),
    dispensaryPublicKey,
    mode: dispensarySecretKey ? ("server-signing" as const) : ("missing-secret" as const),
  };
}

export async function submitDispensaryConsumePrescription(
  input: TrustLeafDispensaryConsumeInput,
  requestedBy: string,
) {
  const submitConfig = getTrustLeafDispensarySubmitConfig();
  if (!submitConfig.enabled || !process.env.TRUST_LEAF_DISPENSARY_SECRET_KEY) {
    throw new Error("TRUST_LEAF_DISPENSARY_SECRET_KEY is not configured");
  }

  const [deployment, dispensaryActionPack, zkFixture] = await Promise.all([
    getTrustLeafDeployment(),
    getTrustLeafDispensaryActionPack(submitConfig.dispensaryPublicKey),
    getTrustLeafZkFixture(),
  ]);
  const contractId =
    deployment.contracts.find((contract) => contract.key === "zkMedical")?.contractId ?? null;

  if (!contractId) {
    throw new Error("Live ZK medical contract is not configured");
  }

  const dispensaryKeypair = Keypair.fromSecret(process.env.TRUST_LEAF_DISPENSARY_SECRET_KEY);
  const caller = normalizeCallerAddress(input.caller, dispensaryKeypair.publicKey());
  if (caller !== dispensaryKeypair.publicKey()) {
    throw new Error("Configured dispensary secret does not match the requested caller account");
  }

  const commitment = normalizeHex32(
    input.commitment ?? dispensaryActionPack.payload.commitment,
    "commitment",
  );
  const proof = normalizeHexBytes(input.proof ?? zkFixture.consumePack.payload.proof, "proof");
  const publicInputsHash = normalizeHex32(
    input.publicInputsHash ?? dispensaryActionPack.payload.publicInputsHash,
    "publicInputsHash",
  );
  const currentDay = normalizeCurrentDay(
    input.currentDay ?? dispensaryActionPack.payload.currentDay ?? zkFixture.fixture.currentDay,
  );
  const rpcUrl = deployment.rpcUrl || process.env.TRUST_LEAF_STELLAR_RPC_URL;
  const networkPassphrase =
    deployment.networkPassphrase ||
    process.env.TRUST_LEAF_NETWORK_PASSPHRASE ||
    Networks.TESTNET;

  if (!rpcUrl) {
    throw new Error("TRUST_LEAF_STELLAR_RPC_URL is not configured");
  }

  const server = new rpc.Server(rpcUrl);
  const sourceAccount = await server.getAccount(dispensaryKeypair.publicKey());
  const contract = new Contract(contractId);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: normalizeBaseFee(input.baseFee),
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        "verify_and_consume",
        new Address(caller).toScVal(),
        xdr.ScVal.scvBytes(Buffer.from(commitment, "hex")),
        xdr.ScVal.scvBytes(Buffer.from(proof, "hex")),
        xdr.ScVal.scvBytes(Buffer.from(publicInputsHash, "hex")),
        xdr.ScVal.scvU64(xdr.Uint64.fromString(String(currentDay))),
      ),
    )
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(transaction);
  prepared.sign(dispensaryKeypair);

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
    caller,
    commitment,
    proof,
    publicInputsHash,
    currentDay,
    envelopeXdr: prepared.toXDR(),
    submission,
    polled,
    explorerUrl: submission.hash
      ? `https://stellar.expert/explorer/testnet/tx/${submission.hash}`
      : null,
  };
}

function normalizeCallerAddress(value: string | null | undefined, fallback: string) {
  const candidate = value?.trim() || fallback;
  if (!candidate.startsWith("G")) {
    throw new Error("caller must be a valid Stellar account address");
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

function normalizeHexBytes(value: string | null | undefined, label: string) {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
    throw new Error(`${label} must be an even-length hex value`);
  }
  return normalized;
}

function normalizeCurrentDay(value: number | null | undefined) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new Error("currentDay must be a positive integer");
  }
  return Math.trunc(normalized);
}

function normalizeBaseFee(value: string | null | undefined) {
  const normalized = value?.trim() || process.env.TRUST_LEAF_BASE_FEE || String(BASE_FEE);
  if (!/^[0-9]+$/.test(normalized)) {
    throw new Error("baseFee must be numeric");
  }
  return normalized;
}
