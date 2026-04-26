import "server-only";

import {
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
} from "@stellar/stellar-sdk";

import { getTrustLeafDeployment } from "./deployment";
import { getTrustLeafSuperAdminActionPack } from "./actionRails";

const DEFAULT_POLL_ATTEMPTS = 8;

export type TrustLeafSuperAdminRole = "DOCTOR" | "DISP" | "LAB" | "CULT";
export type TrustLeafSuperAdminAction = "grant_role" | "revoke_role";

export type TrustLeafSuperAdminRoleUpdateInput = {
  admin?: string | null;
  role?: TrustLeafSuperAdminRole | null;
  account?: string | null;
  action?: TrustLeafSuperAdminAction | null;
  baseFee?: string | null;
};

export function getTrustLeafSuperAdminSubmitConfig() {
  const adminSecretKey = process.env.TRUST_LEAF_ADMIN_SECRET_KEY ?? null;
  const adminPublicKey = adminSecretKey ? Keypair.fromSecret(adminSecretKey).publicKey() : null;

  return {
    enabled: Boolean(adminSecretKey),
    adminPublicKey,
    mode: adminSecretKey ? ("server-signing" as const) : ("missing-secret" as const),
  };
}

export async function submitSuperAdminRoleUpdate(
  input: TrustLeafSuperAdminRoleUpdateInput,
  requestedBy: string,
) {
  const submitConfig = getTrustLeafSuperAdminSubmitConfig();
  if (!submitConfig.enabled || !process.env.TRUST_LEAF_ADMIN_SECRET_KEY) {
    throw new Error("TRUST_LEAF_ADMIN_SECRET_KEY is not configured");
  }

  const [deployment, actionPack] = await Promise.all([
    getTrustLeafDeployment(),
    getTrustLeafSuperAdminActionPack(),
  ]);
  const contractId =
    deployment.contracts.find((contract) => contract.key === "rbac")?.contractId ?? null;

  if (!contractId) {
    throw new Error("Live RBAC contract is not configured");
  }

  const adminKeypair = Keypair.fromSecret(process.env.TRUST_LEAF_ADMIN_SECRET_KEY);
  const admin = normalizeAddress(input.admin, adminKeypair.publicKey(), "admin");
  if (admin !== adminKeypair.publicKey()) {
    throw new Error("Configured admin secret does not match the requested admin account");
  }

  const role = normalizeRole(input.role ?? actionPack.roleTemplates[0]?.role ?? null);
  const roleTemplate = actionPack.roleTemplates.find((template) => template.role === role) ?? null;
  const account = normalizeAddress(input.account, roleTemplate?.account ?? null, "account");
  const action = normalizeAction(input.action);
  const rpcUrl = deployment.rpcUrl || process.env.TRUST_LEAF_STELLAR_RPC_URL;
  const networkPassphrase =
    deployment.networkPassphrase ||
    process.env.TRUST_LEAF_NETWORK_PASSPHRASE ||
    Networks.TESTNET;

  if (!rpcUrl) {
    throw new Error("TRUST_LEAF_STELLAR_RPC_URL is not configured");
  }

  const server = new rpc.Server(rpcUrl);
  const sourceAccount = await server.getAccount(adminKeypair.publicKey());
  const contract = new Contract(contractId);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: normalizeBaseFee(input.baseFee),
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        action,
        new Address(admin).toScVal(),
        nativeToScVal(role, { type: "symbol" }),
        new Address(account).toScVal(),
      ),
    )
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(transaction);
  prepared.sign(adminKeypair);

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
    admin,
    role,
    account,
    action,
    envelopeXdr: prepared.toXDR(),
    submission,
    polled,
    explorerUrl: submission.hash
      ? `https://stellar.expert/explorer/testnet/tx/${submission.hash}`
      : null,
  };
}

function normalizeAddress(
  value: string | null | undefined,
  fallback: string | null,
  label: "admin" | "account",
) {
  const candidate = value?.trim() || fallback;
  if (!candidate || !candidate.startsWith("G")) {
    throw new Error(`${label} must be a valid Stellar account address`);
  }
  return candidate;
}

function normalizeRole(value: TrustLeafSuperAdminRole | null | undefined) {
  if (value === "DOCTOR" || value === "DISP" || value === "LAB" || value === "CULT") {
    return value;
  }
  throw new Error("role must be one of DOCTOR, DISP, LAB, or CULT");
}

function normalizeAction(value: TrustLeafSuperAdminAction | null | undefined) {
  if (value === "grant_role" || value === "revoke_role") {
    return value;
  }
  return "grant_role";
}

function normalizeBaseFee(value: string | null | undefined) {
  const normalized = value?.trim() || process.env.TRUST_LEAF_BASE_FEE || String(BASE_FEE);
  if (!/^[0-9]+$/.test(normalized)) {
    throw new Error("baseFee must be numeric");
  }
  return normalized;
}
