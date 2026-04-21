import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { buildSponsoredFeeBump } from "@/app/lib/stellar/sponsor";
import { readWalletlessSession } from "@/app/lib/walletless/session";

type SponsorFeeBody = {
  innerXdr?: string;
  baseFee?: string;
  networkPassphrase?: string;
};

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SponsorFeeBody | null;
  const innerXdr = body?.innerXdr?.trim();

  if (!innerXdr) {
    return Response.json({ error: "innerXdr is required" }, { status: 400 });
  }

  const config = getWalletlessConfig(origin);
  const networkPassphrase = body?.networkPassphrase ?? config.networkPassphrase;
  const baseFee = body?.baseFee?.trim() || config.recommendedBaseFee;

  try {
    const sponsorship = buildSponsoredFeeBump({
      innerXdr,
      sponsorSecretKey: config.sponsorSecretKey,
      networkPassphrase,
      baseFee,
    });

    return Response.json({
      ...sponsorship,
      requestedBy: session.view.username,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected sponsorship error",
      },
      { status: 409 },
    );
  }
}
