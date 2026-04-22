import { preparePasskeyRegistration } from "@/app/lib/passkeys/service";
import { resolveOrigin } from "@/app/lib/walletless/config";
import type { WalletlessProfileRecord } from "@/app/lib/walletless/types";

type RegisterOptionsBody = {
  username?: string;
  displayName?: string;
  profile?: WalletlessProfileRecord | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterOptionsBody | null;
  const username = body?.username?.trim();

  if (!username) {
    return Response.json({ error: "username is required" }, { status: 400 });
  }

  const envelope = await preparePasskeyRegistration({
    origin: resolveOrigin(request),
    username,
    displayName: body?.displayName,
    profile: body?.profile,
  });

  return Response.json(envelope);
}
