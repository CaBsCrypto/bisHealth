import { generateAuthenticationOptions } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import {
  buildWalletlessProfile,
  listCredentialDescriptors,
} from "@/app/lib/walletless/store";
import { signWalletlessToken } from "@/app/lib/walletless/tokens";
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

  const profile = buildWalletlessProfile({
    username,
    profile: body?.profile,
  });
  if (profile.credentials.length === 0) {
    return Response.json({ error: "user does not have registered passkeys" }, { status: 409 });
  }

  const config = getWalletlessConfig(resolveOrigin(request));
  const options = await generateAuthenticationOptions({
    rpID: config.rpId,
    allowCredentials: listCredentialDescriptors(profile.credentials),
    userVerification: "preferred",
  });

  return Response.json({
    flowToken: signWalletlessToken(
      "walletless-login",
      {
        userId: profile.userId,
        username: profile.username,
        displayName: profile.displayName,
        challenge: options.challenge,
      },
      60 * 10,
    ),
    options,
  });
}
