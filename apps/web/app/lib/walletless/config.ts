import { Keypair, Networks } from "@stellar/stellar-sdk";

import type { SponsorMode, WalletlessConfigView } from "./types";

export type WalletlessServerConfig = WalletlessConfigView & {
  sponsorSecretKey: string | null;
};

const DEFAULT_BASE_FEE = "1000";

export function resolveOrigin(request: Request) {
  if (process.env.TRUST_LEAF_ORIGIN) {
    return process.env.TRUST_LEAF_ORIGIN;
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function getWalletlessConfig(origin: string): WalletlessServerConfig {
  const normalizedOrigin = process.env.TRUST_LEAF_ORIGIN ?? origin;
  const url = new URL(normalizedOrigin);
  const rpId = process.env.TRUST_LEAF_RP_ID ?? url.hostname;
  const rpName = process.env.TRUST_LEAF_RP_NAME ?? "Trust Leaf";
  const sponsorSecretKey = process.env.TRUST_LEAF_SPONSOR_SECRET_KEY ?? null;
  const sponsorPublicKey = sponsorSecretKey ? Keypair.fromSecret(sponsorSecretKey).publicKey() : null;
  const sponsorMode: SponsorMode = sponsorSecretKey ? "fee-bump" : "mock";

  return {
    rpName,
    rpId,
    origin: normalizedOrigin,
    sponsorMode,
    sponsorPublicKey,
    networkPassphrase: process.env.TRUST_LEAF_NETWORK_PASSPHRASE ?? Networks.TESTNET,
    recommendedBaseFee: process.env.TRUST_LEAF_BASE_FEE ?? DEFAULT_BASE_FEE,
    sponsorSecretKey,
  };
}
