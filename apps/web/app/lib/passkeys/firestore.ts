import "server-only";

import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const DEFAULT_COLLECTION_PREFIX = "trustleaf";

export type FirestorePasskeyRuntimeConfig = {
  enabled: boolean;
  projectId: string | null;
  collectionPrefix: string;
};

export function getFirestorePasskeyRuntimeConfig(): FirestorePasskeyRuntimeConfig {
  return {
    enabled: Boolean(readServiceAccount()),
    projectId:
      process.env.TRUST_LEAF_FIREBASE_PROJECT_ID ??
      parseServiceAccountJson(process.env.TRUST_LEAF_FIREBASE_SERVICE_ACCOUNT_JSON)?.project_id ??
      null,
    collectionPrefix:
      process.env.TRUST_LEAF_FIREBASE_COLLECTION_PREFIX?.trim() || DEFAULT_COLLECTION_PREFIX,
  };
}

export function isFirestorePasskeyStoreConfigured() {
  return getFirestorePasskeyRuntimeConfig().enabled;
}

export function getPasskeyUsersCollection() {
  const db = getPasskeyFirestore();
  const { collectionPrefix } = getFirestorePasskeyRuntimeConfig();

  return db.collection(`${collectionPrefix}_passkey_users`);
}

function getPasskeyFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

function getFirebaseAdminApp(): App {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const serviceAccount = readServiceAccount();
  if (!serviceAccount) {
    throw new Error("Firestore passkey store is not configured");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

function readServiceAccount(): ServiceAccount | null {
  const fromJson = parseServiceAccountJson(process.env.TRUST_LEAF_FIREBASE_SERVICE_ACCOUNT_JSON);
  if (fromJson) {
    return {
      projectId: fromJson.project_id,
      clientEmail: fromJson.client_email,
      privateKey: normalizePrivateKey(fromJson.private_key),
    };
  }

  const projectId = process.env.TRUST_LEAF_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.TRUST_LEAF_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.TRUST_LEAF_FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  };
}

function parseServiceAccountJson(rawValue: string | undefined) {
  if (!rawValue?.trim()) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
  } catch {
    return null;
  }
}

function normalizePrivateKey(privateKey: string | undefined) {
  return privateKey?.replace(/\\n/g, "\n");
}
