export type SponsorMode = "mock" | "fee-bump";

export type SmartWalletStatus = "not-enrolled" | "deployment-ready";

export type WalletlessSessionView = {
  userId: string;
  username: string;
  displayName: string;
  sponsorMode: SponsorMode;
  smartWalletStatus: SmartWalletStatus;
  smartWalletHint: string;
  credentialCount: number;
  networkPassphrase: string;
};

export type WalletlessConfigView = {
  rpName: string;
  rpId: string;
  origin: string;
  sponsorMode: SponsorMode;
  sponsorPublicKey: string | null;
  networkPassphrase: string;
  recommendedBaseFee: string;
};

export type StellarPasskeysConfigView = {
  integrationMode: "webauthn-mvp" | "passkey-kit-ready";
  smartWalletModel: "contract-account";
  recommendedSdk: string;
  warning: string;
  rpcUrl: string;
  networkPassphrase: string;
  factoryContractId: string | null;
  walletWasmHash: string | null;
  launchtubeUrl: string | null;
  mercuryUrl: string | null;
};

export type DefindexVaultView = {
  key: string;
  label: string;
  contractId: string;
  strategy?: string;
  asset?: string;
  kind: "factory" | "vault" | "strategy";
};

export type DefindexConfigView = {
  environment: "testnet" | "mainnet" | "custom";
  apiBaseUrl: string;
  apiKeyConfigured: boolean;
  partnerIntegrationMode: "mock" | "live-ready";
  factoryContractId: string;
  vaultWasmHash: string;
  recommendedFlow: string;
  vaults: DefindexVaultView[];
};

export type TrustLeafDeploymentContractView = {
  key: "rbac" | "traceability" | "zkMedical";
  package: string;
  alias: string;
  contractId: string | null;
  wasmHash: string | null;
  wasmPath: string | null;
  status: "live" | "configured" | "pending";
};

export type TrustLeafDeploymentView = {
  source: "manifest" | "env" | "mock";
  isLive: boolean;
  generatedAt: string | null;
  sourceAccount: string | null;
  manifestPath: string | null;
  rpcUrl: string;
  networkPassphrase: string;
  contracts: TrustLeafDeploymentContractView[];
};
