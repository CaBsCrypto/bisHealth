import "server-only";

import { DefindexSDK, SupportedNetworks } from "@defindex/sdk";

import { getDefindexConfig } from "./config";

let cachedSdk: DefindexSDK | null = null;

export function resolveDefindexNetwork() {
  const rawNetwork = process.env.TRUST_LEAF_DEFINDEX_NETWORK?.toLowerCase();
  if (rawNetwork === SupportedNetworks.MAINNET) {
    return SupportedNetworks.MAINNET;
  }
  return SupportedNetworks.TESTNET;
}

export function getDefindexSdk() {
  if (!cachedSdk) {
    cachedSdk = new DefindexSDK({
      apiKey: process.env.TRUST_LEAF_DEFINDEX_API_KEY,
      baseUrl: getDefindexConfig().apiBaseUrl,
      defaultNetwork: resolveDefindexNetwork(),
      timeout: 30000,
    });
  }

  return cachedSdk;
}

export async function safeDefindexCall<T>(action: () => Promise<T>) {
  try {
    return {
      ok: true as const,
      data: await action(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected DeFindex SDK error";
    return {
      ok: false as const,
      error: message,
    };
  }
}
