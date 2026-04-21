import type { DefindexConfigView, DefindexVaultView } from "@/app/lib/walletless/types";

const TESTNET_FACTORY = "CDSCWE4GLNBYYTES2OCYDFQA2LLY4RBIAX6ZI32VSUXD7GO6HRPO4A32";
const TESTNET_VAULT_HASH = "f345228dca59c6605789620e9ec62ff4847a0927c33dac7581a955fe746016be";

const DEFAULT_TESTNET_VAULTS: DefindexVaultView[] = [
  {
    key: "factory",
    label: "DeFindex Factory",
    contractId: TESTNET_FACTORY,
    kind: "factory",
  },
  {
    key: "usdc_paltalabs_vault",
    label: "PaltaLabs USDC Vault",
    contractId: "CBMVK2JK6NTOT2O4HNQAIQFJY232BHKGLIMXDVQVHIIZKDACXDFZDWHN",
    asset: "USDC",
    kind: "vault",
  },
  {
    key: "xlm_paltalabs_vault",
    label: "PaltaLabs XLM Vault",
    contractId: "CCLV4H7WTLJQ7ATLHBBQV2WW3OINF3FOY5XZ7VPHZO7NH3D2ZS4GFSF6",
    asset: "XLM",
    kind: "vault",
  },
  {
    key: "usdc_blend_strategy",
    label: "USDC Blend Strategy",
    contractId: "CALLOM5I7XLQPPOPQMYAHUWW4N7O3JKT42KQ4ASEEVBXDJQNJOALFSUY",
    asset: "USDC",
    strategy: "blend",
    kind: "strategy",
  },
  {
    key: "xlm_blend_strategy",
    label: "XLM Blend Strategy",
    contractId: "CDVLOSPJPQOTB6ZCWO5VSGTOLGMKTXSFWYTUP572GTPNOWX4F76X3HPM",
    asset: "XLM",
    strategy: "blend",
    kind: "strategy",
  },
];

export function getDefindexConfig(): DefindexConfigView {
  const apiBaseUrl = process.env.TRUST_LEAF_DEFINDEX_API_BASE_URL ?? "https://api.defindex.io";
  const apiKeyConfigured = Boolean(process.env.TRUST_LEAF_DEFINDEX_API_KEY);
  const requestedNetwork = process.env.TRUST_LEAF_DEFINDEX_NETWORK?.toLowerCase();
  const environment =
    requestedNetwork === "mainnet"
      ? "mainnet"
      : requestedNetwork === "testnet"
        ? "testnet"
        : apiBaseUrl.includes("main")
          ? "mainnet"
          : "testnet";

  return {
    environment,
    apiBaseUrl,
    apiKeyConfigured,
    partnerIntegrationMode: apiKeyConfigured ? "live-ready" : "mock",
    factoryContractId: process.env.TRUST_LEAF_DEFINDEX_FACTORY_CONTRACT_ID ?? TESTNET_FACTORY,
    vaultWasmHash: process.env.TRUST_LEAF_DEFINDEX_VAULT_WASM_HASH ?? TESTNET_VAULT_HASH,
    recommendedFlow:
      "Use DeFindex after passkey auth for treasury, vault deposit, or a staged dispensary checkout abstraction.",
    vaults: DEFAULT_TESTNET_VAULTS,
  };
}
