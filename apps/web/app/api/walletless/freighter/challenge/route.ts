import { prepareFreighterChallenge } from "@/app/lib/freighter/service";
import { resolveOrigin } from "@/app/lib/walletless/config";

type FreighterChallengeBody = {
  address?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as FreighterChallengeBody | null;
  const address = body?.address?.trim();

  if (!address) {
    return Response.json({ error: "address is required" }, { status: 400 });
  }

  try {
    const envelope = await prepareFreighterChallenge({
      origin: resolveOrigin(request),
      address,
    });

    return Response.json(envelope);
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "freighter challenge failed" }, { status: 400 });
  }
}
