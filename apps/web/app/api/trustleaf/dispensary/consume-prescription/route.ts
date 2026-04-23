import { submitDispensaryConsumePrescription } from "@/app/lib/trustleaf/dispensaryConsume";
import { resolveOrigin } from "@/app/lib/walletless/config";
import { readWalletlessSession } from "@/app/lib/walletless/session";

type DispensaryConsumeBody = {
  caller?: string;
  commitment?: string;
  proof?: string;
  publicInputsHash?: string;
  currentDay?: number;
  baseFee?: string;
};

export async function POST(request: Request) {
  const origin = resolveOrigin(request);
  const session = await readWalletlessSession(origin);

  if (!session) {
    return Response.json({ error: "wallet-less session required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as DispensaryConsumeBody | null;

  try {
    const result = await submitDispensaryConsumePrescription(body ?? {}, session.view.username);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected dispensary consume error",
      },
      { status: 409 },
    );
  }
}
