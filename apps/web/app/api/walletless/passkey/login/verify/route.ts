import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { createWalletlessSession } from "@/app/lib/walletless/session";
import {
  consumePendingChallenge,
  getCredential,
  getUserById,
  toSessionView,
  updateCredentialCounter,
} from "@/app/lib/walletless/store";

type LoginVerifyBody = {
  userId?: string;
  response?: AuthenticationResponseJSON;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginVerifyBody | null;
  const userId = body?.userId;
  const response = body?.response;

  if (!userId || !response) {
    return Response.json({ error: "userId and response are required" }, { status: 400 });
  }

  const user = getUserById(userId);
  if (!user) {
    return Response.json({ error: "wallet-less user not found" }, { status: 404 });
  }

  const challenge = consumePendingChallenge(userId, "authentication");
  if (!challenge) {
    return Response.json({ error: "authentication challenge expired" }, { status: 409 });
  }

  const credential = getCredential(userId, response.id);
  if (!credential) {
    return Response.json({ error: "credential not registered" }, { status: 404 });
  }

  const config = getWalletlessConfig(resolveOrigin(request));
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: config.origin,
    expectedRPID: config.rpId,
    credential,
    requireUserVerification: true,
  });

  if (!verification.verified) {
    return Response.json({ verified: false }, { status: 400 });
  }

  updateCredentialCounter(userId, credential.id, verification.authenticationInfo.newCounter);
  await createWalletlessSession(user.id, config.origin);

  return Response.json({
    verified: true,
    session: toSessionView(user.id, config.sponsorMode, config.networkPassphrase),
  });
}
