import { Networks } from "@stellar/stellar-sdk";

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

  return {
    integrationMode,
    smartWalletModel: "contract-account",
    recommendedSdk: "passkey-kit",
    warning: PASSKEY_KIT_WARNING,
    rpcUrl: process.env.TRUST_LEAF_STELLAR_RPC_URL ?? DEFAULT_RPC_URL,
    networkPassphrase: process.env.TRUST_LEAF_NETWORK_PASSPHRASE ?? Networks.TESTNET,
    factoryContractId,
    walletWasmHash,
    launchtubeUrl,
    mercuryUrl,
  };
}
