import { buildTrustLeafPatientJourneySession } from "@/app/lib/trustleaf/patientJourney";
import { resolveOrigin } from "@/app/lib/walletless/config";
import { readWalletlessSession } from "@/app/lib/walletless/session";

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  try {
    const result = await buildTrustLeafPatientJourneySession({
      origin,
      session,
    });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected patient journey error",
      },
      { status: 409 },
    );
  }
}
