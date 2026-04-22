import { Networks } from "@stellar/stellar-sdk";

import { isFirestorePasskeyStoreConfigured } from "@/app/lib/passkeys/firestore";
import type { StellarPasskeysConfigView } from "@/app/lib/walletless/types";

const DEFAULT_RPC_URL = "https://soroban-testnet.stellar.org";
const PASSKEY_KIT_WARNING =
  "Passkey Kit is widely referenced in the Stellar ecosystem, but its repo currently marks it as demo material and not audited.";

export function getStellarPasskeysConfig(): StellarPasskeysConfigView {
  const factoryContractId = process.env.TRUST_LEAF_PASSKEY_FACTORY_CONTRACT_ID ?? null;
  const walletWasmHash = process.env.TRUST_LEAF_PASSKEY_WALLET_WASM_HASH ?? null;
  const launchtubeUrl = process.env.TRUST_LEAF_LAUNCHTUBE_URL ?? null;
  const mercuryUrl = process.env.TRUST_LEAF_MERCURY_URL ?? null;
  const integrationMode =
    factoryContractId && walletWasmHash ? "passkey-kit-ready" : "webauthn-mvp";
  const durableProfileStore =
    (process.env.TRUST_LEAF_PASSKEY_PROFILE_STORE ?? "").toLowerCase() === "durable-db" ||
    Boolean(process.env.TRUST_LEAF_PASSKEY_DATABASE_URL) ||
    isFirestorePasskeyStoreConfigured();
  const backendPhase =
    normalizeBackendPhase(
      process.env.TRUST_LEAF_PASSKEYS_PHASE,
      durableProfileStore,
      integrationMode,
    );
  const missingPieces = [
    ...(backendPhase < 2 ? ["durable-profile-store"] : []),
    ...(integrationMode !== "passkey-kit-ready"
      ? ["passkey-factory-contract", "passkey-wallet-wasm-hash"]
      : []),
    ...(!launchtubeUrl ? ["launchtube-relayer"] : []),
    ...(!mercuryUrl ? ["mercury-indexer"] : []),
  ];

  return {
    integrationMode,
    smartWalletModel: "contract-account",
    recommendedSdk: "passkey-kit",
    warning: PASSKEY_KIT_WARNING,
    backendPhase,
    profileStorage: durableProfileStore ? "durable-db" : "browser-local",
    missingPieces,
    rpcUrl: process.env.TRUST_LEAF_STELLAR_RPC_URL ?? DEFAULT_RPC_URL,
    networkPassphrase: process.env.TRUST_LEAF_NETWORK_PASSPHRASE ?? Networks.TESTNET,
    factoryContractId,
    walletWasmHash,
    launchtubeUrl,
    mercuryUrl,
  };
}

function normalizeBackendPhase(
  rawPhase: string | undefined,
  durableProfileStore: boolean,
  integrationMode: StellarPasskeysConfigView["integrationMode"],
): 1 | 2 | 3 {
  const parsed = Number(rawPhase);
  if (parsed === 1 || parsed === 2 || parsed === 3) {
    return parsed;
  }

  if (integrationMode === "passkey-kit-ready") {
    return 3;
  }

  return durableProfileStore ? 2 : 1;
}
