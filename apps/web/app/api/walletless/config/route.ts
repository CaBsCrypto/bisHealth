import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";

export async function GET(request: Request) {
  const config = getWalletlessConfig(resolveOrigin(request));
  return Response.json({
    rpName: config.rpName,
    rpId: config.rpId,
    origin: config.origin,
    sponsorMode: config.sponsorMode,
    sponsorPublicKey: config.sponsorPublicKey,
    networkPassphrase: config.networkPassphrase,
    recommendedBaseFee: config.recommendedBaseFee,
  });
}
