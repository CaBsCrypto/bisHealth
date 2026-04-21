import { generateRegistrationOptions } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import {
  findOrCreateUser,
  listCredentialDescriptors,
  setPendingChallenge,
} from "@/app/lib/walletless/store";

type RegisterOptionsBody = {
  username?: string;
  displayName?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterOptionsBody | null;
  const username = body?.username?.trim();

  if (!username) {
    return Response.json({ error: "username is required" }, { status: 400 });
  }

  const user = findOrCreateUser(username, body?.displayName);
  const config = getWalletlessConfig(resolveOrigin(request));
  const options = await generateRegistrationOptions({
    rpName: config.rpName,
    rpID: config.rpId,
    userID: new TextEncoder().encode(user.id),
    userName: user.username,
    userDisplayName: user.displayName,
    attestationType: "none",
    excludeCredentials: listCredentialDescriptors(user.id),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    preferredAuthenticatorType: "localDevice",
  });

  setPendingChallenge(user.id, "registration", options.challenge);

  return Response.json({
    userId: user.id,
    options,
  });
}
