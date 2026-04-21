import "server-only";

import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { Networks } from "@stellar/stellar-sdk";

import type {
  TrustLeafDeploymentContractView,
  TrustLeafDeploymentView,
} from "@/app/lib/walletless/types";

type ManifestContractEntry = {
  package?: string;
  alias?: string;
  wasm?: string;
  wasmHash?: string;
  contractId?: string;
};

type ManifestShape = {
  generatedAt?: string;
  source?: string;
  network?: {
    rpcUrl?: string;
    networkPassphrase?: string;
  };
  contracts?: {
    rbac?: ManifestContractEntry;
    traceability?: ManifestContractEntry;
    zkMedical?: ManifestContractEntry;
  };
};

const DEFAULT_RPC_URL = "https://soroban-testnet.stellar.org";

export async function getTrustLeafDeployment(): Promise<TrustLeafDeploymentView> {
  const manifestPaths = resolveManifestPaths();
  const manifestMatch = await readFirstManifest(manifestPaths);
  const manifestPath = manifestMatch?.path ?? manifestPaths[0];
  const manifest = manifestMatch?.manifest ?? null;

  if (manifest) {
    return {
      source: "manifest",
      isLive: true,
      generatedAt: manifest.generatedAt ?? null,
      sourceAccount: manifest.source ?? null,
      manifestPath,
      rpcUrl: manifest.network?.rpcUrl ?? process.env.TRUST_LEAF_STELLAR_RPC_URL ?? DEFAULT_RPC_URL,
      networkPassphrase:
        manifest.network?.networkPassphrase ??
        process.env.TRUST_LEAF_NETWORK_PASSPHRASE ??
        Networks.TESTNET,
      contracts: [
        toContractView("rbac", manifest.contracts?.rbac),
        toContractView("traceability", manifest.contracts?.traceability),
        toContractView("zkMedical", manifest.contracts?.zkMedical),
      ],
    };
  }

  const fromEnv = buildDeploymentFromEnv(manifestPath);
  if (fromEnv.contracts.some((contract) => contract.contractId || contract.wasmHash)) {
    return fromEnv;
  }

  return {
    source: "mock",
    isLive: false,
    generatedAt: null,
    sourceAccount: null,
    manifestPath,
    rpcUrl: process.env.TRUST_LEAF_STELLAR_RPC_URL ?? DEFAULT_RPC_URL,
    networkPassphrase: process.env.TRUST_LEAF_NETWORK_PASSPHRASE ?? Networks.TESTNET,
    contracts: [
      {
        key: "rbac",
        package: "trust_leaf_rbac",
        alias: "trustleaf-rbac",
        contractId: null,
        wasmHash: null,
        wasmPath: null,
        status: "pending",
      },
      {
        key: "traceability",
        package: "trust_leaf_traceability",
        alias: "trustleaf-traceability",
        contractId: null,
        wasmHash: null,
        wasmPath: null,
        status: "pending",
      },
      {
        key: "zkMedical",
        package: "trust_leaf_zk_medical",
        alias: "trustleaf-zk-medical",
        contractId: null,
        wasmHash: null,
        wasmPath: null,
        status: "pending",
      },
    ],
  };
}

function resolveManifestPaths() {
  const configuredPath = process.env.TRUST_LEAF_DEPLOYMENT_MANIFEST_PATH;
  const repoManifestPath = path.resolve(
    process.cwd(),
    "..",
    "..",
    "scripts",
    "testnet",
    "out",
    "trustleaf-testnet-manifest.json",
  );
  const appDataManifestPath = path.resolve(process.cwd(), "data", "trustleaf-testnet-manifest.json");

  return [configuredPath, repoManifestPath, appDataManifestPath].filter(
    (value): value is string => Boolean(value),
  );
}

async function readFirstManifest(
  manifestPaths: string[],
): Promise<{ path: string; manifest: ManifestShape } | null> {
  for (const manifestPath of manifestPaths) {
    const manifest = await readManifestIfPresent(manifestPath);
    if (manifest) {
      return {
        path: manifestPath,
        manifest,
      };
    }
  }

  return null;
}

async function readManifestIfPresent(manifestPath: string): Promise<ManifestShape | null> {
  try {
    await access(manifestPath);
    const raw = await readFile(manifestPath, "utf8");
    return JSON.parse(raw) as ManifestShape;
  } catch {
    return null;
  }
}

function toContractView(
  key: TrustLeafDeploymentContractView["key"],
  entry?: ManifestContractEntry,
): TrustLeafDeploymentContractView {
  return {
    key,
    package: entry?.package ?? defaultPackageFor(key),
    alias: entry?.alias ?? defaultAliasFor(key),
    contractId: entry?.contractId ?? null,
    wasmHash: entry?.wasmHash ?? null,
    wasmPath: entry?.wasm ?? null,
    status: entry?.contractId ? "live" : entry?.wasmHash ? "configured" : "pending",
  };
}

function buildDeploymentFromEnv(manifestPath: string): TrustLeafDeploymentView {
  return {
    source: "env",
    isLive: Boolean(
      process.env.TRUST_LEAF_RBAC_CONTRACT_ID &&
        process.env.TRUST_LEAF_TRACEABILITY_CONTRACT_ID &&
        process.env.TRUST_LEAF_ZK_MEDICAL_CONTRACT_ID,
    ),
    generatedAt: null,
    sourceAccount: process.env.TRUST_LEAF_SOURCE_ACCOUNT ?? null,
    manifestPath,
    rpcUrl: process.env.TRUST_LEAF_STELLAR_RPC_URL ?? DEFAULT_RPC_URL,
    networkPassphrase: process.env.TRUST_LEAF_NETWORK_PASSPHRASE ?? Networks.TESTNET,
    contracts: [
      {
        key: "rbac",
        package: "trust_leaf_rbac",
        alias: process.env.TRUST_LEAF_RBAC_ALIAS ?? "trustleaf-rbac",
        contractId: process.env.TRUST_LEAF_RBAC_CONTRACT_ID ?? null,
        wasmHash: process.env.TRUST_LEAF_RBAC_WASM_HASH ?? null,
        wasmPath: null,
        status: process.env.TRUST_LEAF_RBAC_CONTRACT_ID
          ? "live"
          : process.env.TRUST_LEAF_RBAC_WASM_HASH
            ? "configured"
            : "pending",
      },
      {
        key: "traceability",
        package: "trust_leaf_traceability",
        alias: process.env.TRUST_LEAF_TRACEABILITY_ALIAS ?? "trustleaf-traceability",
        contractId: process.env.TRUST_LEAF_TRACEABILITY_CONTRACT_ID ?? null,
        wasmHash: process.env.TRUST_LEAF_TRACEABILITY_WASM_HASH ?? null,
        wasmPath: null,
        status: process.env.TRUST_LEAF_TRACEABILITY_CONTRACT_ID
          ? "live"
          : process.env.TRUST_LEAF_TRACEABILITY_WASM_HASH
            ? "configured"
            : "pending",
      },
      {
        key: "zkMedical",
        package: "trust_leaf_zk_medical",
        alias: process.env.TRUST_LEAF_ZK_MEDICAL_ALIAS ?? "trustleaf-zk-medical",
        contractId: process.env.TRUST_LEAF_ZK_MEDICAL_CONTRACT_ID ?? null,
        wasmHash: process.env.TRUST_LEAF_ZK_MEDICAL_WASM_HASH ?? null,
        wasmPath: null,
        status: process.env.TRUST_LEAF_ZK_MEDICAL_CONTRACT_ID
          ? "live"
          : process.env.TRUST_LEAF_ZK_MEDICAL_WASM_HASH
            ? "configured"
            : "pending",
      },
    ],
  };
}

function defaultPackageFor(key: TrustLeafDeploymentContractView["key"]) {
  switch (key) {
    case "rbac":
      return "trust_leaf_rbac";
    case "traceability":
      return "trust_leaf_traceability";
    case "zkMedical":
      return "trust_leaf_zk_medical";
  }
}

function defaultAliasFor(key: TrustLeafDeploymentContractView["key"]) {
  switch (key) {
    case "rbac":
      return "trustleaf-rbac";
    case "traceability":
      return "trustleaf-traceability";
    case "zkMedical":
      return "trustleaf-zk-medical";
  }
}
