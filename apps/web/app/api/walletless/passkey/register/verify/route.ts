import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

import { getWalletlessConfig, resolveOrigin } from "@/app/lib/walletless/config";
import { createWalletlessSession } from "@/app/lib/walletless/session";
import {
  addCredential,
  consumePendingChallenge,
  getUserById,
  toSessionView,
} from "@/app/lib/walletless/store";

type RegisterVerifyBody = {
  userId?: string;
  response?: RegistrationResponseJSON;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterVerifyBody | null;
  const userId = body?.userId;
  const response = body?.response;

  if (!userId || !response) {
    return Response.json({ error: "userId and response are required" }, { status: 400 });
  }

  const user = getUserById(userId);
  if (!user) {
    return Response.json({ error: "wallet-less user not found" }, { status: 404 });
  }

  const challenge = consumePendingChallenge(userId, "registration");
  if (!challenge) {
    return Response.json({ error: "registration challenge expired" }, { status: 409 });
  }

  const config = getWalletlessConfig(resolveOrigin(request));
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: config.origin,
    expectedRPID: config.rpId,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return Response.json({ verified: false }, { status: 400 });
  }

  addCredential({
    userId,
    credential: verification.registrationInfo.credential,
    deviceType: verification.registrationInfo.credentialDeviceType,
    backedUp: verification.registrationInfo.credentialBackedUp,
    transports: response.response.transports,
  });

  await createWalletlessSession(user.id, config.origin);

  return Response.json({
    verified: true,
    session: toSessionView(user.id, config.sponsorMode, config.networkPassphrase),
  });
}
