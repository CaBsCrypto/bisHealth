import "server-only";

import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { getTrustLeafDeployment } from "@/app/lib/trustleaf/deployment";
import { getIndexedState } from "@/app/lib/trustleaf/indexedState";
import { getTrustLeafZkFixture } from "@/app/lib/trustleaf/zkFixture";

type TestnetEnvMap = Record<string, string>;

export type TrustLeafDoctorActionPack = {
  doctorAccount: string;
  doctorAlias: string;
  contractId: string | null;
  rpcUrl: string;
  networkPassphrase: string;
  suggestedPatientLabel: string;
  suggestedCommitment: string;
  suggestedPatientNullifier: string;
  suggestedPolicyHash: string;
  scriptPath: string;
  scriptCommand: string;
  payload: {
    contractId: string | null;
    rpcUrl: string;
    networkPassphrase: string;
    sourceAlias: string;
    doctor: string;
    commitment: string;
    patientNullifier: string;
    policyHash: string;
  };
  payloadBase64: string;
};

export type TrustLeafDispensaryActionPack = {
  dispensaryAccount: string;
  dispensaryAlias: string;
  fixtureCommitment: string;
  pendingPrescriptionId: string | null;
  matchesPendingPrescription: boolean;
  scriptPath: string;
  scriptCommand: string;
  payload: {
    contractId: string | null;
    rpcUrl: string | null;
    networkPassphrase: string | null;
    caller: string;
    commitment: string;
    proof: string;
    publicInputsHash: string;
    currentDay: number;
  };
  payloadBase64: string;
};

export type TrustLeafPatientActionPack = {
  doctorAccount: string | null;
  dispensaryAccount: string | null;
  prescriptionId: string | null;
  prescriptionStatus: "ready" | "consumed" | "missing";
  createdAtLedger: number | null;
  consumedAtLedger: number | null;
  patientNullifier: string | null;
  doctorRoute: "/doctor";
  dispensaryRoute: "/dispensary";
  walletlessRoute: "/walletless";
};

export type TrustLeafSuperAdminRoleTemplate = {
  key: string;
  label: string;
  role: "DOCTOR" | "DISP" | "LAB" | "CULT";
  account: string;
  sourceAlias: string;
  isActive: boolean;
  grantCommand: string;
  revokeCommand: string;
};

export type TrustLeafSuperAdminActionPack = {
  adminAccount: string;
  sourceAlias: string;
  contractId: string | null;
  rpcUrl: string;
  networkPassphrase: string;
  payloadBase64: string;
  scriptPath: ".\\scripts\\testnet\\Initialize-TrustLeafTestnet.ps1";
  roleTemplates: TrustLeafSuperAdminRoleTemplate[];
};

export async function getTrustLeafDoctorActionPack(doctorAccount: string | null) {
  const [deployment, testnetEnv] = await Promise.all([
    getTrustLeafDeployment(),
    readTestnetEnvIfPresent(),
  ]);
  const doctorAlias = testnetEnv.TRUST_LEAF_DOCTOR_SOURCE || "trustleaf-doctor";
  const account = doctorAccount || testnetEnv.TRUST_LEAF_DOCTOR_ADDRESS || "trustleaf-doctor";
  const contractId =
    deployment.contracts.find((contract) => contract.key === "zkMedical")?.contractId ?? null;
  const suggestedPatientLabel = "patient-next-consult";
  const suggestedCommitment = deriveHex32(`trustleaf:commitment:${account}:${suggestedPatientLabel}`);
  const suggestedPatientNullifier = deriveHex32(
    `trustleaf:nullifier:${account}:${suggestedPatientLabel}`,
  );
  const suggestedPolicyHash = deriveHex32(`trustleaf:policy:${account}:30day-balanced-dose`);
  const payload = {
    contractId,
    rpcUrl: deployment.rpcUrl,
    networkPassphrase: deployment.networkPassphrase,
    sourceAlias: doctorAlias,
    doctor: account,
    commitment: suggestedCommitment,
    patientNullifier: suggestedPatientNullifier,
    policyHash: suggestedPolicyHash,
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
  const commandParts = [
    "powershell",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `"stellar contract invoke --id ${contractId ?? "<zk-medical-contract>"} --source-account ${doctorAlias} --rpc-url ${deployment.rpcUrl} --network-passphrase '${deployment.networkPassphrase}' --send=yes -- issue_prescription --doctor ${account} --commitment ${suggestedCommitment} --patient_nullifier ${suggestedPatientNullifier} --policy_hash ${suggestedPolicyHash}"`,
  ];

  return {
    doctorAccount: account,
    doctorAlias,
    contractId,
    rpcUrl: deployment.rpcUrl,
    networkPassphrase: deployment.networkPassphrase,
    suggestedPatientLabel,
    suggestedCommitment,
    suggestedPatientNullifier,
    suggestedPolicyHash,
    scriptPath: ".\\scripts\\testnet\\Seed-TrustLeafTestnet.ps1",
    scriptCommand: commandParts.join(" "),
    payload,
    payloadBase64,
  } satisfies TrustLeafDoctorActionPack;
}

export async function getTrustLeafDispensaryActionPack(dispensaryAccount: string | null) {
  const [deployment, indexedState, fixture, testnetEnv] = await Promise.all([
    getTrustLeafDeployment(),
    getIndexedState(),
    getTrustLeafZkFixture(),
    readTestnetEnvIfPresent(),
  ]);
  const dispensaryAlias = testnetEnv.TRUST_LEAF_DISPENSARY_SOURCE || "trustleaf-dispensary";
  const account =
    dispensaryAccount || testnetEnv.TRUST_LEAF_DISPENSARY_ADDRESS || "<dispensary-address>";
  const pendingPrescription =
    indexedState.prescriptions.find((prescription) => !prescription.isUsed) ?? null;
  const payload = {
    ...fixture.consumePack.payload,
    caller: account,
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
    dispensaryAlias,
    "-Caller",
    account,
  ].join(" ");

  return {
    dispensaryAccount: account,
    dispensaryAlias,
    fixtureCommitment: fixture.fixture.commitment,
    pendingPrescriptionId: pendingPrescription?.id ?? null,
    matchesPendingPrescription:
      normalizeHex(pendingPrescription?.id ?? "") === normalizeHex(fixture.fixture.commitment),
    scriptPath: fixture.consumePack.scriptPath,
    scriptCommand,
    payload,
    payloadBase64,
  } satisfies TrustLeafDispensaryActionPack;
}

export async function getTrustLeafPatientActionPack() {
  const indexedState = await getIndexedState();
  const activePrescription =
    indexedState.prescriptions.find((prescription) => !prescription.isUsed) ??
    indexedState.prescriptions[0] ??
    null;
  const activeDispensary =
    indexedState.roleMemberships.find(
      (membership) => membership.isActive && membership.role.includes("DISP"),
    ) ?? null;

  return {
    doctorAccount: activePrescription?.doctor ?? null,
    dispensaryAccount: activeDispensary?.account ?? null,
    prescriptionId: activePrescription?.id ?? null,
    prescriptionStatus: !activePrescription
      ? "missing"
      : activePrescription.isUsed
        ? "consumed"
        : "ready",
    createdAtLedger: activePrescription?.createdAtLedger ?? null,
    consumedAtLedger: activePrescription?.consumedAtLedger ?? null,
    patientNullifier: activePrescription?.patientNullifier ?? null,
    doctorRoute: "/doctor",
    dispensaryRoute: "/dispensary",
    walletlessRoute: "/walletless",
  } satisfies TrustLeafPatientActionPack;
}

export async function getTrustLeafSuperAdminActionPack() {
  const [deployment, indexedState, testnetEnv] = await Promise.all([
    getTrustLeafDeployment(),
    getIndexedState(),
    readTestnetEnvIfPresent(),
  ]);
  const sourceAlias = testnetEnv.TRUST_LEAF_SOURCE || deployment.sourceAccount || "trustleaf-admin";
  const adminAccount =
    testnetEnv.TRUST_LEAF_ADMIN_ADDRESS ||
    indexedState.roleMemberships.find(
      (membership) => membership.isActive && membership.role.includes("ADMIN"),
    )?.account ||
    "<admin-address>";
  const contractId =
    deployment.contracts.find((contract) => contract.key === "rbac")?.contractId ?? null;
  const candidates = [
    {
      key: "doctor",
      label: "Doctor approval",
      role: "DOCTOR" as const,
      account: testnetEnv.TRUST_LEAF_DOCTOR_ADDRESS,
    },
    {
      key: "dispensary",
      label: "Dispensary approval",
      role: "DISP" as const,
      account: testnetEnv.TRUST_LEAF_DISPENSARY_ADDRESS,
    },
    {
      key: "lab",
      label: "Lab approval",
      role: "LAB" as const,
      account: testnetEnv.TRUST_LEAF_LAB_ADDRESS,
    },
    {
      key: "cultivator",
      label: "Cultivator approval",
      role: "CULT" as const,
      account: testnetEnv.TRUST_LEAF_CULTIVATOR_ADDRESS,
    },
  ].filter((candidate): candidate is { key: string; label: string; role: "DOCTOR" | "DISP" | "LAB" | "CULT"; account: string } => Boolean(candidate.account));

  const roleTemplates = candidates.map((candidate) => {
    const isActive = indexedState.roleMemberships.some(
      (membership) =>
        membership.isActive &&
        membership.account === candidate.account &&
        membership.role.includes(candidate.role),
    );

    return {
      key: candidate.key,
      label: candidate.label,
      role: candidate.role,
      account: candidate.account,
      sourceAlias,
      isActive,
      grantCommand: buildRbacRoleCommand({
        contractId,
        sourceAlias,
        rpcUrl: deployment.rpcUrl,
        networkPassphrase: deployment.networkPassphrase,
        adminAccount,
        role: candidate.role,
        account: candidate.account,
        action: "grant_role",
      }),
      revokeCommand: buildRbacRoleCommand({
        contractId,
        sourceAlias,
        rpcUrl: deployment.rpcUrl,
        networkPassphrase: deployment.networkPassphrase,
        adminAccount,
        role: candidate.role,
        account: candidate.account,
        action: "revoke_role",
      }),
    } satisfies TrustLeafSuperAdminRoleTemplate;
  });

  return {
    adminAccount,
    sourceAlias,
    contractId,
    rpcUrl: deployment.rpcUrl,
    networkPassphrase: deployment.networkPassphrase,
    payloadBase64: Buffer.from(
      JSON.stringify({
        adminAccount,
        sourceAlias,
        contractId,
        rpcUrl: deployment.rpcUrl,
        networkPassphrase: deployment.networkPassphrase,
        roleTemplates,
      }),
      "utf8",
    ).toString("base64"),
    scriptPath: ".\\scripts\\testnet\\Initialize-TrustLeafTestnet.ps1",
    roleTemplates,
  } satisfies TrustLeafSuperAdminActionPack;
}

async function readTestnetEnvIfPresent(): Promise<TestnetEnvMap> {
  const envPath = path.resolve(process.cwd(), "..", "..", "scripts", "testnet", "trustleaf.testnet.env");

  try {
    await access(envPath);
    const raw = await readFile(envPath, "utf8");
    return raw.split(/\r?\n/).reduce<TestnetEnvMap>((map, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        return map;
      }

      const pair = trimmed.split("=", 2);
      if (pair.length !== 2) {
        return map;
      }

      map[pair[0].trim()] = pair[1].trim();
      return map;
    }, {});
  } catch {
    return {};
  }
}

function deriveHex32(seed: string) {
  return createHash("sha256").update(seed).digest("hex");
}

function buildRbacRoleCommand(args: {
  contractId: string | null;
  sourceAlias: string;
  rpcUrl: string;
  networkPassphrase: string;
  adminAccount: string;
  role: "DOCTOR" | "DISP" | "LAB" | "CULT";
  account: string;
  action: "grant_role" | "revoke_role";
}) {
  return [
    "powershell",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `"stellar contract invoke --id ${args.contractId ?? "<rbac-contract>"} --source-account ${args.sourceAlias} --rpc-url ${args.rpcUrl} --network-passphrase '${args.networkPassphrase}' --send=yes -- ${args.action} --admin ${args.adminAccount} --role ${args.role} --account ${args.account}"`,
  ].join(" ");
}

function normalizeHex(value: string) {
  return value.startsWith("0x") ? value.slice(2).toLowerCase() : value.toLowerCase();
}
