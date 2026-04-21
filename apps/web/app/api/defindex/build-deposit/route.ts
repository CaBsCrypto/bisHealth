import { getDefindexConfig } from "@/app/lib/defindex/config";
import { getDefindexSdk, resolveDefindexNetwork, safeDefindexCall } from "@/app/lib/defindex/sdk";

type BuildDepositBody = {
  vaultAddress?: string;
  caller?: string;
  amounts?: number[];
  slippageBps?: number;
  invest?: boolean;
};

export async function POST(request: Request) {
  const config = getDefindexConfig();
  const body = (await request.json().catch(() => null)) as BuildDepositBody | null;
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

  if (!config.apiKeyConfigured) {
    return Response.json({
      mode: "mock",
      operation: "deposit",
      vaultAddress,
      caller,
      amounts,
      slippageBps,
      invest,
      xdr: null,
      simulationResponse: null,
      note: "Configure TRUST_LEAF_DEFINDEX_API_KEY to build a live unsigned XDR through the SDK.",
    });
  }

  const result = await safeDefindexCall(() =>
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

  return Response.json({
    mode: config.partnerIntegrationMode,
    operation: "deposit",
    vaultAddress,
    caller,
    amounts,
    slippageBps,
    invest,
    network: resolveDefindexNetwork(),
    result: result.ok ? result.data : null,
    error: result.ok ? null : result.error,
    checkedAt: new Date().toISOString(),
  });
}
