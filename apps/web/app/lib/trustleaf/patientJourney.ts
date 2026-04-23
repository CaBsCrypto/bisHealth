import "server-only";

import { getStellarPasskeysConfig } from "@/app/lib/stellar/passkeys";
import { getWalletlessConfig } from "@/app/lib/walletless/config";
import type { WalletlessResolvedSession } from "@/app/lib/walletless/session";

import { getTrustLeafPatientActionPack } from "./actionRails";

export async function buildTrustLeafPatientJourneySession(args: {
  origin: string;
  session: WalletlessResolvedSession;
}) {
  const [patientActionPack] = await Promise.all([getTrustLeafPatientActionPack()]);
  const walletlessConfig = getWalletlessConfig(args.origin);
  const passkeysConfig = getStellarPasskeysConfig();
  const nextStep = resolveNextStep(patientActionPack.prescriptionStatus);

  return {
    requestedBy: args.session.view.username,
    generatedAt: new Date().toISOString(),
    session: args.session.view,
    patientRail: {
      doctorAccount: patientActionPack.doctorAccount,
      dispensaryAccount: patientActionPack.dispensaryAccount,
      prescriptionId: patientActionPack.prescriptionId,
      prescriptionStatus: patientActionPack.prescriptionStatus,
      createdAtLedger: patientActionPack.createdAtLedger,
      consumedAtLedger: patientActionPack.consumedAtLedger,
      patientNullifier: patientActionPack.patientNullifier,
    },
    readiness: {
      sponsorMode: walletlessConfig.sponsorMode,
      sponsorPublicKey: walletlessConfig.sponsorPublicKey,
      passkeyIntegrationMode: passkeysConfig.integrationMode,
      passkeyBackendPhase: passkeysConfig.backendPhase,
      passkeyProfileStorage: passkeysConfig.profileStorage,
      nextStep,
    },
    routes: {
      patient: "/patient",
      doctor: patientActionPack.doctorRoute,
      dispensary: patientActionPack.dispensaryRoute,
      walletless: patientActionPack.walletlessRoute,
    },
    notes: buildNotes(patientActionPack.prescriptionStatus, walletlessConfig.sponsorMode),
  };
}

function resolveNextStep(status: "ready" | "consumed" | "missing") {
  switch (status) {
    case "ready":
      return "review-inventory-and-confirm-dispensary";
    case "consumed":
      return "request-renewal-with-doctor";
    default:
      return "book-first-consult";
  }
}

function buildNotes(
  status: "ready" | "consumed" | "missing",
  sponsorMode: "mock" | "fee-bump",
) {
  const notes = [];

  if (status === "missing") {
    notes.push("The patient still needs a clinical consult before a private prescription can be issued.");
  }
  if (status === "ready") {
    notes.push("The patient already has an active private prescription and can move toward dispensary confirmation.");
  }
  if (status === "consumed") {
    notes.push("The current prescription is already consumed, so the next journey step is a clinical renewal.");
  }
  if (sponsorMode === "fee-bump") {
    notes.push("Fee sponsorship is active, so the patient does not need to understand or hold XLM for the session.");
  } else {
    notes.push("The wallet-less rail is still in mock sponsor mode for this session.");
  }

  return notes;
}
