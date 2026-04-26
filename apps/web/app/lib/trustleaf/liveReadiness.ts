import "server-only";

import { getStellarPasskeysConfig } from "@/app/lib/stellar/passkeys";
import { getWalletlessConfig } from "@/app/lib/walletless/config";

import { getTrustLeafDoctorSubmitConfig } from "./doctorIssue";
import { getTrustLeafDispensarySubmitConfig } from "./dispensaryConsume";
import { getTrustLeafSuperAdminSubmitConfig } from "./superAdminRbac";

export function getTrustLeafLiveReadiness() {
  const walletlessConfig = getWalletlessConfig(
    process.env.TRUST_LEAF_ORIGIN ?? "https://trust-leaf-web.vercel.app",
  );
  const passkeysConfig = getStellarPasskeysConfig();
  const doctorSubmit = getTrustLeafDoctorSubmitConfig();
  const dispensarySubmit = getTrustLeafDispensarySubmitConfig();
  const superadminSubmit = getTrustLeafSuperAdminSubmitConfig();

  return {
    sponsor: {
      mode: walletlessConfig.sponsorMode,
      publicKey: walletlessConfig.sponsorPublicKey,
      ready: walletlessConfig.sponsorMode === "fee-bump",
    },
    passkeys: {
      integrationMode: passkeysConfig.integrationMode,
      backendPhase: passkeysConfig.backendPhase,
      profileStorage: passkeysConfig.profileStorage,
      ready: passkeysConfig.backendPhase >= 2,
      missingPieces: passkeysConfig.missingPieces,
    },
    doctor: {
      mode: doctorSubmit.mode,
      ready: doctorSubmit.enabled,
      publicKey: doctorSubmit.doctorPublicKey,
    },
    dispensary: {
      mode: dispensarySubmit.mode,
      ready: dispensarySubmit.enabled,
      publicKey: dispensarySubmit.dispensaryPublicKey,
    },
    superadmin: {
      mode: superadminSubmit.mode,
      ready: superadminSubmit.enabled,
      publicKey: superadminSubmit.adminPublicKey,
    },
  };
}
