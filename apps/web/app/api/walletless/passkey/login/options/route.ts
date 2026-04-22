import { preparePasskeyAuthentication } from "@/app/lib/passkeys/service";
import { resolveOrigin } from "@/app/lib/walletless/config";
import type { WalletlessProfileRecord } from "@/app/lib/walletless/types";

type LoginOptionsBody = {
  username?: string;
  profile?: WalletlessProfileRecord | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginOptionsBody | null;
  const username = body?.username?.trim();

  if (!username) {
    return Response.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const envelope = await preparePasskeyAuthentication({
      origin: resolveOrigin(request),
      username,
      profile: body?.profile,
    });

    return Response.json(envelope);
  } catch (error) {
    if (error instanceof Error && error.message === "user does not have registered passkeys") {
      return Response.json({ error: error.message }, { status: 409 });
    }

    return Response.json({ error: "authentication options failed" }, { status: 400 });
  }
}
