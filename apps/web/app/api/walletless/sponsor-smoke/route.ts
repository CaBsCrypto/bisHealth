import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { runSponsorSmokeTest } from "@/app/lib/stellar/sponsorSmoke";
import { readWalletlessSession } from "@/app/lib/walletless/session";

type SponsorSmokeBody = {
  baseFee?: string;
};

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SponsorSmokeBody | null;
  const config = getWalletlessConfig(origin);
  const baseFee = body?.baseFee?.trim() || config.recommendedBaseFee;

  try {
    const sponsorship = await runSponsorSmokeTest({
      sponsorSecretKey: config.sponsorSecretKey,
      networkPassphrase: config.networkPassphrase,
      baseFee,
      requestedBy: session.view.username,
    });

    return Response.json({
      ...sponsorship,
      requestedBy: session.view.username,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected sponsor smoke error",
      },
      { status: 409 },
    );
  }
}
