import { generateRegistrationOptions } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import {
  buildWalletlessProfile,
  listCredentialDescriptors,
} from "@/app/lib/walletless/store";
import { signWalletlessToken } from "@/app/lib/walletless/tokens";
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

  const profile = buildWalletlessProfile({
    username,
    displayName: body?.displayName,
    profile: body?.profile,
  });
  const config = getWalletlessConfig(resolveOrigin(request));
  const options = await generateRegistrationOptions({
    rpName: config.rpName,
    rpID: config.rpId,
    userID: new TextEncoder().encode(profile.userId),
    userName: profile.username,
    userDisplayName: profile.displayName,
    attestationType: "none",
    excludeCredentials: listCredentialDescriptors(profile.credentials),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    preferredAuthenticatorType: "localDevice",
  });

  return Response.json({
    flowToken: signWalletlessToken(
      "walletless-register",
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
