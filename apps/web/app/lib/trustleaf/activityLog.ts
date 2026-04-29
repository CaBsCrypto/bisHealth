import "server-only";

import { getTrustLeafDeployment } from "./deployment";
import { getIndexedState } from "./indexedState";
import { listTrustLeafOnboardingQueue } from "./onboarding";

type ActivityTone = "emerald" | "amber" | "violet" | "sky";

export type TrustLeafActivityItem = {
  id: string;
  kind:
    | "onboarding_submitted"
    | "onboarding_reviewed"
    | "role_change"
    | "prescription_consumed"
    | "batch_released"
    | "deployment_live";
  title: string;
  body: string;
  actor: string;
  createdAt: string;
  tone: ActivityTone;
  source: "preview-fallback" | "durable-db" | "indexed-state" | "deployment";
};

export async function getTrustLeafActivityLog(limit = 12) {
  const [indexedState, deployment, onboardingQueue] = await Promise.all([
    getIndexedState(),
    getTrustLeafDeployment(),
    listTrustLeafOnboardingQueue(),
  ]);

  const onboardingItems: TrustLeafActivityItem[] = onboardingQueue.applications.map((application) => ({
    id: `onboarding-${application.applicationId}`,
    kind: application.status === "submitted" ? "onboarding_submitted" : "onboarding_reviewed",
    title:
      application.status === "submitted"
        ? `${humanizeActorType(application.actorType)} onboarding`
        : `${humanizeActorType(application.actorType)} ${application.status}`,
    body:
      application.status === "submitted"
        ? application.organizationName
          ? `${application.fullName} submitted ${application.organizationName} for review.`
          : `${application.fullName} submitted an onboarding request.`
        : application.organizationName
          ? `${application.organizationName} is now ${application.status}.`
          : `${application.fullName} is now ${application.status}.`,
    actor: application.email,
    createdAt: application.createdAt,
    tone:
      application.status === "approved"
        ? "emerald"
        : application.status === "rejected"
          ? "amber"
          : application.actorType === "doctor"
            ? "emerald"
            : application.actorType === "dispensary"
              ? "amber"
              : "violet",
    source: onboardingQueue.storageMode,
  }));

  const roleItems: TrustLeafActivityItem[] = indexedState.roleChanges.slice(0, 6).map((change) => ({
    id: `role-${change.id}`,
    kind: "role_change",
    title: `${change.action.toUpperCase()} ${change.role}`,
    body: `${shortAccount(change.account)} was updated through RBAC.`,
    actor: change.admin ?? "network-init",
    createdAt: ledgerToIso(change.ledger),
    tone: "violet",
    source: "indexed-state",
  }));

  const receiptItems: TrustLeafActivityItem[] = indexedState.prescriptionConsumptions.slice(0, 4).map((receipt) => ({
    id: `consume-${receipt.id}`,
    kind: "prescription_consumed",
    title: "Prescription consumed",
    body: `Receipt ${shortHash(receipt.prescriptionId)} was consumed by ${shortAccount(receipt.caller)}.`,
    actor: receipt.caller,
    createdAt: ledgerToIso(receipt.ledger),
    tone: "amber",
    source: "indexed-state",
  }));

  const batchItems: TrustLeafActivityItem[] = indexedState.batches
    .filter((batch) => batch.status.toLowerCase() === "released")
    .slice(0, 3)
    .map((batch) => ({
      id: `batch-${batch.id}`,
      kind: "batch_released",
      title: "Batch released",
      body: `${shortHash(batch.id)} reached released status with ${batch.eventCount} indexed events.`,
      actor: batch.lastActor ?? batch.cultivator,
      createdAt: ledgerToIso(batch.updatedAtLedger),
      tone: "sky",
      source: "indexed-state",
    }));

  const deploymentItems: TrustLeafActivityItem[] =
    deployment.isLive && deployment.generatedAt
      ? [
          {
            id: "deployment-live",
            kind: "deployment_live",
            title: "Deployment live",
            body: `Contracts are live and served from ${deployment.source}.`,
            actor: deployment.sourceAccount ?? "trustleaf-admin",
            createdAt: deployment.generatedAt,
            tone: "emerald",
            source: "deployment",
          },
        ]
      : [];

  return [...onboardingItems, ...roleItems, ...receiptItems, ...batchItems, ...deploymentItems]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, limit);
}

function humanizeActorType(actorType: string) {
  if (actorType === "doctor") return "Doctor";
  if (actorType === "dispensary") return "Dispensary";
  if (actorType === "growshop") return "Growshop";
  return "Patient";
}

function shortAccount(account: string) {
  if (account.length < 10) return account;
  return `${account.slice(0, 4)}...${account.slice(-4)}`;
}

function shortHash(value: string) {
  if (value.length < 14) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function ledgerToIso(ledger: number) {
  const base = Date.UTC(2026, 3, 1, 0, 0, 0);
  return new Date(base + ledger * 1000).toISOString();
}
