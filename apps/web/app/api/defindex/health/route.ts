import { getDefindexConfig } from "@/app/lib/defindex/config";
import { getDefindexSdk, resolveDefindexNetwork, safeDefindexCall } from "@/app/lib/defindex/sdk";

export async function GET() {
  const config = getDefindexConfig();
  const result = await safeDefindexCall(() => getDefindexSdk().healthCheck());

  return Response.json({
    mode: config.partnerIntegrationMode,
    environment: config.environment,
    defaultNetwork: resolveDefindexNetwork(),
    apiBaseUrl: config.apiBaseUrl,
    reachable: result.ok,
    detail: result.ok ? result.data : null,
    error: result.ok ? null : result.error,
    checkedAt: new Date().toISOString(),
  });
}
