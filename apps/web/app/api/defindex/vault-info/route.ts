import { getDefindexConfig } from "@/app/lib/defindex/config";
import { getDefindexSdk, resolveDefindexNetwork, safeDefindexCall } from "@/app/lib/defindex/sdk";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vaultAddress = url.searchParams.get("vaultAddress")?.trim();

  if (!vaultAddress) {
    return Response.json({ error: "vaultAddress is required" }, { status: 400 });
  }

  const config = getDefindexConfig();
  const result = await safeDefindexCall(() =>
    getDefindexSdk().getVaultInfo(vaultAddress, resolveDefindexNetwork()),
  );

  return Response.json({
    mode: config.partnerIntegrationMode,
    vaultAddress,
    vaultInfo: result.ok ? result.data : null,
    error: result.ok ? null : result.error,
    checkedAt: new Date().toISOString(),
  });
}
