import { generateAuthenticationOptions } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import {
  getUserByUsername,
  listCredentialDescriptors,
  setPendingChallenge,
} from "@/app/lib/walletless/store";

type LoginOptionsBody = {
  username?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginOptionsBody | null;
  const username = body?.username?.trim();

  if (!username) {
    return Response.json({ error: "username is required" }, { status: 400 });
  }

  const user = getUserByUsername(username);
  if (!user) {
    return Response.json({ error: "wallet-less user not found" }, { status: 404 });
  }

  if (user.credentials.length === 0) {
    return Response.json({ error: "user does not have registered passkeys" }, { status: 409 });
  }

  const config = getWalletlessConfig(resolveOrigin(request));
  const options = await generateAuthenticationOptions({
    rpID: config.rpId,
    allowCredentials: listCredentialDescriptors(user.id),
    userVerification: "preferred",
  });

  setPendingChallenge(user.id, "authentication", options.challenge);

  return Response.json({
    userId: user.id,
    options,
  });
}
