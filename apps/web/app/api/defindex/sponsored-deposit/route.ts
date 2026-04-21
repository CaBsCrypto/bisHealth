import { getDefindexConfig } from "@/app/lib/defindex/config";
import { getDefindexSdk, resolveDefindexNetwork, safeDefindexCall } from "@/app/lib/defindex/sdk";
import { buildSponsoredFeeBump } from "@/app/lib/stellar/sponsor";
import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { readWalletlessSession } from "@/app/lib/walletless/session";

type SponsoredDepositBody = {
  vaultAddress?: string;
  caller?: string;
  amounts?: number[];
  slippageBps?: number;
  invest?: boolean;
  baseFee?: string;
};

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SponsoredDepositBody | null;
  const vaultAddress = body?.vaultAddress?.trim();
  const caller = body?.caller?.trim();
  const amounts = body?.amounts ?? [];
  const invest = body?.invest ?? true;
  const slippageBps = body?.slippageBps ?? 100;

  if (!vaultAddress || !caller || amounts.length === 0) {
    return Response.json(
      { error: "vaultAddress, caller and at least one amount are required" },
      { status: 400 },
    );
  }

  const defindexConfig = getDefindexConfig();
  const walletlessConfig = getWalletlessConfig(origin);
  const baseFee = body?.baseFee?.trim() || walletlessConfig.recommendedBaseFee;

  if (!defindexConfig.apiKeyConfigured) {
    return Response.json({
      mode: "mock",
      step: "defindex-build",
      requestedBy: session.view.username,
      vaultAddress,
      caller,
      amounts,
      note: "Configure TRUST_LEAF_DEFINDEX_API_KEY to build and sponsor a live DeFindex deposit.",
    });
  }

  const depositResult = await safeDefindexCall(() =>
    getDefindexSdk().depositToVault(
      vaultAddress,
      {
        caller,
        amounts,
        slippageBps,
        invest,
      },
      resolveDefindexNetwork(),
    ),
  );

  if (!depositResult.ok) {
    return Response.json(
      {
        error: depositResult.error,
        step: "defindex-build",
      },
      { status: 409 },
    );
  }

  const innerXdr = depositResult.data.xdr;
  if (!innerXdr) {
    return Response.json(
      {
        error: "DeFindex deposit response did not include an unsigned XDR",
        step: "defindex-build",
      },
      { status: 409 },
    );
  }

  try {
    const sponsorship = buildSponsoredFeeBump({
      innerXdr,
      sponsorSecretKey: walletlessConfig.sponsorSecretKey,
      networkPassphrase: walletlessConfig.networkPassphrase,
      baseFee,
    });

    return Response.json({
      mode: sponsorship.mode,
      step: sponsorship.mode === "fee-bump" ? "sponsored-deposit" : "sponsor-mock",
      requestedBy: session.view.username,
      vaultAddress,
      caller,
      amounts,
      invest,
      slippageBps,
      innerXdr,
      deposit: depositResult.data,
      sponsorship,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected sponsorship error",
        step: "fee-bump",
        innerXdr,
        deposit: depositResult.data,
      },
      { status: 409 },
    );
  }
}
