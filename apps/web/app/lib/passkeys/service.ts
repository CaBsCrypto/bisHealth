import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

import { getWalletlessConfig } from "@/app/lib/walletless/config";
import { createWalletlessSession } from "@/app/lib/walletless/session";
import {
  addCredential,
  getCredential,
  listCredentialDescriptors,
  toSessionView,
  toWebAuthnCredential,
  updateCredentialCounter,
} from "@/app/lib/walletless/store";
import { signWalletlessToken, verifyWalletlessToken } from "@/app/lib/walletless/tokens";
import { getPasskeyProfileRepository } from "./repository";
import type {
  WalletlessProfileRecord,
  WalletlessSessionView,
} from "@/app/lib/walletless/types";

type RegisterFlowToken = {
  userId: string;
  username: string;
  displayName: string;
  challenge: string;
};

type LoginFlowToken = {
  userId: string;
  username: string;
  displayName: string;
  challenge: string;
};

export type PreparePasskeyRegistrationArgs = {
  origin: string;
  username: string;
  displayName?: string;
  profile?: WalletlessProfileRecord | null;
};

export type PreparePasskeyAuthenticationArgs = {
  origin: string;
  username: string;
  profile?: WalletlessProfileRecord | null;
};

export type VerifyPasskeyRegistrationArgs = {
  origin: string;
  flowToken: string;
  response: RegistrationResponseJSON;
  profile?: WalletlessProfileRecord | null;
};

export type VerifyPasskeyAuthenticationArgs = {
  origin: string;
  flowToken: string;
  response: AuthenticationResponseJSON;
  profile?: WalletlessProfileRecord | null;
};

export type PasskeyOptionsEnvelope = {
  flowToken: string;
  options: ReturnType<typeof generateRegistrationOptions> extends Promise<infer T>
    ? T
    : never;
};

export type PasskeyAuthenticationEnvelope = {
  flowToken: string;
  options: ReturnType<typeof generateAuthenticationOptions> extends Promise<infer T>
    ? T
    : never;
};

export type PasskeyVerificationResult = {
  verified: boolean;
  profile: WalletlessProfileRecord;
  session: WalletlessSessionView;
};

export async function preparePasskeyRegistration(
  args: PreparePasskeyRegistrationArgs,
): Promise<PasskeyOptionsEnvelope> {
  const repository = getPasskeyProfileRepository();
  const profile = await repository.ensureProfile({
    username: args.username,
    displayName: args.displayName,
    fallbackProfile: args.profile,
  });
  const config = getWalletlessConfig(args.origin);
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

  return {
    flowToken: signWalletlessToken<RegisterFlowToken>(
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
  };
}

export async function verifyPasskeyRegistration(
  args: VerifyPasskeyRegistrationArgs,
): Promise<PasskeyVerificationResult> {
  const flow = verifyWalletlessToken<RegisterFlowToken>(args.flowToken, "walletless-register");
  if (!flow) {
    throw new Error("registration challenge expired");
  }

  const repository = getPasskeyProfileRepository();
  const profile = await repository.ensureProfile({
    username: flow.data.username,
    displayName: flow.data.displayName,
    fallbackProfile: args.profile,
  });
  const config = getWalletlessConfig(args.origin);
  const verification = await verifyRegistrationResponse({
    response: args.response,
    expectedChallenge: flow.data.challenge,
    expectedOrigin: config.origin,
    expectedRPID: config.rpId,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    throw new Error("registration verification failed");
  }

  const { profile: nextProfile } = addCredential({
    profile,
    credential: verification.registrationInfo.credential,
    deviceType: verification.registrationInfo.credentialDeviceType,
    backedUp: verification.registrationInfo.credentialBackedUp,
    transports: args.response.response.transports,
  });
  const savedProfile = await repository.saveProfile(nextProfile);
  const summary = await createWalletlessSession(savedProfile, config.origin);

  return {
    verified: true,
    profile: savedProfile,
    session: toSessionView(summary, config.sponsorMode, config.networkPassphrase),
  };
}

export async function preparePasskeyAuthentication(
  args: PreparePasskeyAuthenticationArgs,
): Promise<PasskeyAuthenticationEnvelope> {
  const repository = getPasskeyProfileRepository();
  const profile = await repository.getProfileByUsername({
    username: args.username,
    fallbackProfile: args.profile,
  });
  if (!profile || profile.credentials.length === 0) {
    throw new Error("user does not have registered passkeys");
  }

  const config = getWalletlessConfig(args.origin);
  const options = await generateAuthenticationOptions({
    rpID: config.rpId,
    allowCredentials: listCredentialDescriptors(profile.credentials),
    userVerification: "preferred",
  });

  return {
    flowToken: signWalletlessToken<LoginFlowToken>(
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
  };
}

export async function verifyPasskeyAuthentication(
  args: VerifyPasskeyAuthenticationArgs,
): Promise<PasskeyVerificationResult> {
  const flow = verifyWalletlessToken<LoginFlowToken>(args.flowToken, "walletless-login");
  if (!flow) {
    throw new Error("authentication challenge expired");
  }

  const repository = getPasskeyProfileRepository();
  const profile = await repository.getProfileByUsername({
    username: flow.data.username,
    displayName: flow.data.displayName,
    fallbackProfile: args.profile,
  });
  if (!profile) {
    throw new Error("credential not registered");
  }
  const credential = getCredential(profile, args.response.id);
  if (!credential) {
    throw new Error("credential not registered");
  }

  const config = getWalletlessConfig(args.origin);
  const verification = await verifyAuthenticationResponse({
    response: args.response,
    expectedChallenge: flow.data.challenge,
    expectedOrigin: config.origin,
    expectedRPID: config.rpId,
    credential: toWebAuthnCredential(credential),
    requireUserVerification: true,
  });

  if (!verification.verified) {
    throw new Error("authentication verification failed");
  }

  const nextProfile = updateCredentialCounter(
    profile,
    credential.id,
    verification.authenticationInfo.newCounter,
  );
  const savedProfile = await repository.saveProfile(nextProfile);
  const summary = await createWalletlessSession(savedProfile, config.origin);

  return {
    verified: true,
    profile: savedProfile,
    session: toSessionView(summary, config.sponsorMode, config.networkPassphrase),
  };
}
