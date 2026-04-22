import "server-only";

import type { QuerySnapshot } from "firebase-admin/firestore";

import type { WalletlessProfileRecord } from "@/app/lib/walletless/types";
import {
  buildWalletlessProfile,
  sanitizeProfile,
} from "@/app/lib/walletless/store";

import {
  getPasskeyUsersCollection,
  isFirestorePasskeyStoreConfigured,
} from "./firestore";

type ResolveProfileArgs = {
  username: string;
  displayName?: string;
  fallbackProfile?: WalletlessProfileRecord | null;
};

type PasskeyProfileRepository = {
  mode: "browser-local" | "durable-db";
  getProfileByUsername(args: ResolveProfileArgs): Promise<WalletlessProfileRecord | null>;
  ensureProfile(args: ResolveProfileArgs): Promise<WalletlessProfileRecord>;
  saveProfile(profile: WalletlessProfileRecord): Promise<WalletlessProfileRecord>;
};

type FirestorePasskeyUserDocument = {
  userId: string;
  username: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  credentialCount: number;
  approvalStatus: "self-serve" | "manual-review";
  smartWalletStatus: "not-enrolled" | "deployment-ready";
};

export function getPasskeyProfileRepository(): PasskeyProfileRepository {
  return isFirestorePasskeyStoreConfigured()
    ? createFirestorePasskeyProfileRepository()
    : createBrowserLocalPasskeyProfileRepository();
}

function createBrowserLocalPasskeyProfileRepository(): PasskeyProfileRepository {
  return {
    mode: "browser-local",
    async getProfileByUsername(args) {
      const username = args.username.trim().toLowerCase();
      if (
        args.fallbackProfile &&
        args.fallbackProfile.username.trim().toLowerCase() === username
      ) {
        return sanitizeProfile(args.fallbackProfile);
      }

      return null;
    },
    async ensureProfile(args) {
      return buildWalletlessProfile({
        username: args.username,
        displayName: args.displayName,
        profile: args.fallbackProfile,
      });
    },
    async saveProfile(profile) {
      return sanitizeProfile(profile);
    },
  };
}

function createFirestorePasskeyProfileRepository(): PasskeyProfileRepository {
  const users = getPasskeyUsersCollection();

  return {
    mode: "durable-db",
    async getProfileByUsername(args) {
      const requested = buildWalletlessProfile({
        username: args.username,
        displayName: args.displayName,
        profile: args.fallbackProfile,
      });
      const snapshot = await users.doc(requested.userId).get();
      if (!snapshot.exists) {
        return null;
      }

      const doc = snapshot.data() as FirestorePasskeyUserDocument | undefined;
      return hydrateFirestoreProfile({
        profileSeed: requested,
        storedUser: doc ?? null,
        credentialsSnapshot: await snapshot.ref.collection("credentials").get(),
      });
    },
    async ensureProfile(args) {
      const fallbackProfile = buildWalletlessProfile({
        username: args.username,
        displayName: args.displayName,
        profile: args.fallbackProfile,
      });
      const userRef = users.doc(fallbackProfile.userId);
      const snapshot = await userRef.get();
      const now = new Date().toISOString();

      if (!snapshot.exists) {
        await userRef.set({
          userId: fallbackProfile.userId,
          username: fallbackProfile.username,
          displayName: fallbackProfile.displayName,
          createdAt: fallbackProfile.createdAt,
          updatedAt: now,
          credentialCount: fallbackProfile.credentials.length,
          approvalStatus: "self-serve",
          smartWalletStatus:
            fallbackProfile.credentials.length > 0 ? "deployment-ready" : "not-enrolled",
        } satisfies FirestorePasskeyUserDocument);

        return fallbackProfile;
      }

      const storedUser = snapshot.data() as FirestorePasskeyUserDocument | undefined;
      const nextDisplayName = args.displayName?.trim() || storedUser?.displayName || fallbackProfile.displayName;
      if (
        storedUser &&
        (storedUser.displayName !== nextDisplayName || storedUser.username !== fallbackProfile.username)
      ) {
        await userRef.set(
          {
            displayName: nextDisplayName,
            username: fallbackProfile.username,
            updatedAt: now,
          },
          { merge: true },
        );
      }

      return hydrateFirestoreProfile({
        profileSeed: {
          ...fallbackProfile,
          displayName: nextDisplayName,
        },
        storedUser: storedUser ?? null,
        credentialsSnapshot: await userRef.collection("credentials").get(),
      });
    },
    async saveProfile(profile) {
      const nextProfile = sanitizeProfile(profile);
      const userRef = users.doc(nextProfile.userId);
      const now = new Date().toISOString();
      const batch = users.firestore.batch();

      batch.set(
        userRef,
        {
          userId: nextProfile.userId,
          username: nextProfile.username,
          displayName: nextProfile.displayName,
          createdAt: nextProfile.createdAt,
          updatedAt: now,
          credentialCount: nextProfile.credentials.length,
          approvalStatus: "self-serve",
          smartWalletStatus:
            nextProfile.credentials.length > 0 ? "deployment-ready" : "not-enrolled",
        } satisfies FirestorePasskeyUserDocument,
        { merge: true },
      );

      for (const credential of nextProfile.credentials) {
        batch.set(
          userRef.collection("credentials").doc(credential.id),
          {
            ...credential,
            updatedAt: now,
          },
          { merge: true },
        );
      }

      await batch.commit();
      return nextProfile;
    },
  };
}

async function hydrateFirestoreProfile(args: {
  profileSeed: WalletlessProfileRecord;
  storedUser: FirestorePasskeyUserDocument | null;
  credentialsSnapshot: QuerySnapshot;
}) {
  return sanitizeProfile({
    userId: args.profileSeed.userId,
    username: args.storedUser?.username ?? args.profileSeed.username,
    displayName: args.storedUser?.displayName ?? args.profileSeed.displayName,
    createdAt: args.storedUser?.createdAt ?? args.profileSeed.createdAt,
    credentials: args.credentialsSnapshot.docs.map((document) => {
      const data = document.data() as WalletlessProfileRecord["credentials"][number];
      return data;
    }),
  });
}
