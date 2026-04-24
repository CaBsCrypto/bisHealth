import "server-only";

import type { WalletlessProfileRecord } from "@/app/lib/walletless/types";
import {
  buildWalletlessProfile,
  sanitizeProfile,
} from "@/app/lib/walletless/store";

import {
  getSupabasePasskeyUserById,
  getSupabasePasskeyUserByUsername,
  isSupabasePasskeyStoreConfigured,
  listSupabasePasskeyCredentials,
  type SupabasePasskeyCredentialRow,
  type SupabasePasskeyUserRow,
  upsertSupabasePasskeyCredentials,
  upsertSupabasePasskeyUser,
} from "./supabase";

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

export function getPasskeyProfileRepository(): PasskeyProfileRepository {
  return isSupabasePasskeyStoreConfigured()
    ? createSupabasePasskeyProfileRepository()
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

function createSupabasePasskeyProfileRepository(): PasskeyProfileRepository {
  return {
    mode: "durable-db",
    async getProfileByUsername(args) {
      const requested = buildWalletlessProfile({
        username: args.username,
        displayName: args.displayName,
        profile: args.fallbackProfile,
      });
      const storedUser = await getSupabasePasskeyUserByUsername(requested.username);
      if (!storedUser) {
        return null;
      }

      return hydrateSupabaseProfile({
        profileSeed: requested,
        storedUser,
        credentials: await listSupabasePasskeyCredentials(storedUser.user_id),
      });
    },
    async ensureProfile(args) {
      const fallbackProfile = buildWalletlessProfile({
        username: args.username,
        displayName: args.displayName,
        profile: args.fallbackProfile,
      });
      const storedUser = await getSupabasePasskeyUserById(fallbackProfile.userId);

      if (!storedUser) {
        await upsertSupabasePasskeyUser(toSupabaseUserRow(fallbackProfile, null));

        return fallbackProfile;
      }

      const nextDisplayName =
        args.displayName?.trim() || storedUser.display_name || fallbackProfile.displayName;
      if (
        storedUser.display_name !== nextDisplayName ||
        storedUser.username !== fallbackProfile.username
      ) {
        await upsertSupabasePasskeyUser(
          toSupabaseUserRow(
            {
              ...fallbackProfile,
              displayName: nextDisplayName,
            },
            storedUser,
          ),
        );
      }

      return hydrateSupabaseProfile({
        profileSeed: {
          ...fallbackProfile,
          displayName: nextDisplayName,
        },
        storedUser,
        credentials: await listSupabasePasskeyCredentials(fallbackProfile.userId),
      });
    },
    async saveProfile(profile) {
      const nextProfile = sanitizeProfile(profile);
      const storedUser = await getSupabasePasskeyUserById(nextProfile.userId);

      await upsertSupabasePasskeyUser(
        toSupabaseUserRow(nextProfile, storedUser),
      );

      await upsertSupabasePasskeyCredentials(
        nextProfile.credentials.map((credential) => toSupabaseCredentialRow(nextProfile.userId, credential)),
      );
      return nextProfile;
    },
  };
}

async function hydrateSupabaseProfile(args: {
  profileSeed: WalletlessProfileRecord;
  storedUser: SupabasePasskeyUserRow | null;
  credentials: SupabasePasskeyCredentialRow[];
}) {
  return sanitizeProfile({
    userId: args.profileSeed.userId,
    username: args.storedUser?.username ?? args.profileSeed.username,
    displayName: args.storedUser?.display_name ?? args.profileSeed.displayName,
    createdAt: args.storedUser?.created_at ?? args.profileSeed.createdAt,
    credentials: args.credentials.map((credential) => ({
      id: credential.credential_id,
      publicKey: credential.public_key,
      counter: credential.counter,
      transports: Array.isArray(credential.transports) ? credential.transports : undefined,
      deviceType: credential.device_type,
      backedUp: credential.backed_up,
      createdAt: credential.created_at,
    })),
  });
}

function toSupabaseUserRow(
  profile: WalletlessProfileRecord,
  existing: SupabasePasskeyUserRow | null,
): SupabasePasskeyUserRow {
  const now = new Date().toISOString();

  return {
    user_id: profile.userId,
    username: profile.username,
    display_name: profile.displayName,
    created_at: existing?.created_at ?? profile.createdAt,
    updated_at: now,
    credential_count: profile.credentials.length,
    approval_status: existing?.approval_status ?? "self-serve",
    smart_wallet_status:
      profile.credentials.length > 0
        ? "deployment-ready"
        : (existing?.smart_wallet_status ?? "not-enrolled"),
  };
}

function toSupabaseCredentialRow(
  userId: string,
  credential: WalletlessProfileRecord["credentials"][number],
): SupabasePasskeyCredentialRow {
  const now = new Date().toISOString();

  return {
    credential_id: credential.id,
    user_id: userId,
    public_key: credential.publicKey,
    counter: credential.counter,
    transports: credential.transports ?? null,
    device_type: credential.deviceType,
    backed_up: credential.backedUp,
    created_at: credential.createdAt,
    updated_at: now,
  };
}
