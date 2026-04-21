"use client";

import { browserSupportsWebAuthn, startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { useEffect, useState, useTransition } from "react";

import { getWalletlessWorkbenchCopy, type Locale } from "@/app/lib/i18n";
import type {
  DefindexConfigView,
  StellarPasskeysConfigView,
  WalletlessConfigView,
  WalletlessProfileRecord,
  WalletlessSessionView,
} from "@/app/lib/walletless/types";

type RegistrationOptionsEnvelope = {
  flowToken: string;
  options: Parameters<typeof startRegistration>[0]["optionsJSON"];
};

type AuthenticationOptionsEnvelope = {
  flowToken: string;
  options: Parameters<typeof startAuthentication>[0]["optionsJSON"];
};

type PasskeyVerificationEnvelope = {
  verified: boolean;
  profile: WalletlessProfileRecord;
  session: WalletlessSessionView;
};

type SessionEnvelope = {
  authenticated: boolean;
  session: WalletlessSessionView | null;
};

type ZkCircuitInput = {
  patientSecret: string;
  prescriptionId: string;
  issuedAtUnix: string;
  validUntilUnix: string;
  dosageClass: string;
  policyNonce: string;
  currentDay: string;
};

type ZkFixtureEnvelope = {
  fixture: {
    currentDay: number;
    commitment: string;
    patientNullifier: string;
    policyHash: string;
    publicInputsHash: string;
    proofHex: string;
    proofBytes: number;
  };
  circuitInput: ZkCircuitInput;
  publicInputs: string[];
  publicInputOrder: string[];
  contractId: string | null;
  note: string;
  derivedSignals: {
    commitmentHex: string;
    patientNullifierHex: string;
    policyHashHex: string;
    publicInputsHashHex: string;
  };
  matchesFixture: {
    commitment: boolean;
    patientNullifier: boolean;
    policyHash: boolean;
    publicInputsHash: boolean;
    all: boolean;
  };
  packedProofEnvelope: {
    proofHex: string;
    publicInputsHashHex: string;
  };
  verifyAndConsumeArgs: {
    caller: string | null;
    commitment: string;
    proof: string;
    publicInputsHash: string;
    currentDay: number;
  };
  consumePack: {
    payload: {
      contractId: string | null;
      rpcUrl: string | null;
      networkPassphrase: string | null;
      caller: string | null;
      commitment: string;
      proof: string;
      publicInputsHash: string;
      currentDay: number;
    };
    payloadBase64: string;
    scriptPath: string;
    scriptCommand: string;
  };
  liveStatus: {
    issueTxHash: string | null;
    consumeTxHash: string | null;
    consumedAtLedger: number | null;
    lastVerifiedBy: string | null;
    indexedConsumed: boolean;
  };
};

export function WalletlessWorkbench({ locale }: { locale: Locale }) {
  const copy = getWalletlessWorkbenchCopy(locale);
  const [config, setConfig] = useState<WalletlessConfigView | null>(null);
  const [stellarPasskeysConfig, setStellarPasskeysConfig] =
    useState<StellarPasskeysConfigView | null>(null);
  const [defindexConfig, setDefindexConfig] = useState<DefindexConfigView | null>(null);
  const [session, setSession] = useState<WalletlessSessionView | null>(null);
  const [profile, setProfile] = useState<WalletlessProfileRecord | null>(null);
  const [username, setUsername] = useState("patient.andes");
  const [displayName, setDisplayName] = useState("Paciente Andes");
  const [innerXdr, setInnerXdr] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [status, setStatus] = useState(copy.loading);
  const [sponsorResponse, setSponsorResponse] = useState<Record<string, unknown> | null>(null);
  const [defindexHealth, setDefindexHealth] = useState<Record<string, unknown> | null>(null);
  const [defindexFactory, setDefindexFactory] = useState<Record<string, unknown> | null>(null);
  const [defindexVaultInfo, setDefindexVaultInfo] = useState<Record<string, unknown> | null>(null);
  const [defindexDepositResponse, setDefindexDepositResponse] = useState<Record<string, unknown> | null>(null);
  const [defindexSponsoredResponse, setDefindexSponsoredResponse] = useState<Record<string, unknown> | null>(null);
  const [zkFixture, setZkFixture] = useState<ZkFixtureEnvelope | null>(null);
  const [zkPreview, setZkPreview] = useState<ZkFixtureEnvelope | null>(null);
  const [zkCircuitInput, setZkCircuitInput] = useState<ZkCircuitInput | null>(null);
  const [defindexCaller, setDefindexCaller] = useState("");
  const [defindexAmounts, setDefindexAmounts] = useState("1000000");
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");
  const [supportsPasskeys, setSupportsPasskeys] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const sponsorSmokeSummary = getSponsorSmokeSummary(sponsorResponse);

  useEffect(() => {
    setSupportsPasskeys(browserSupportsWebAuthn());

    void (async () => {
      try {
        const [
          nextConfig,
          nextSession,
          nextStellarPasskeysConfig,
          nextDefindexConfig,
          nextZkFixture,
        ] =
          await Promise.all([
            fetchJson<WalletlessConfigView>("/api/walletless/config"),
            fetchJson<SessionEnvelope>("/api/walletless/session"),
            fetchJson<StellarPasskeysConfigView>("/api/stellar/passkeys"),
            fetchJson<DefindexConfigView>("/api/defindex/vaults"),
            fetchJson<ZkFixtureEnvelope>("/api/zk/fixture"),
          ]);

        setConfig(nextConfig);
        setSession(nextSession.session);
        const storedProfile = getStoredWalletlessProfile(nextSession.session?.username ?? username);
        if (storedProfile) {
          setProfile(storedProfile);
          setUsername(storedProfile.username);
          setDisplayName(storedProfile.displayName);
        } else if (nextSession.session) {
          setUsername(nextSession.session.username);
          setDisplayName(nextSession.session.displayName);
        }
        setStellarPasskeysConfig(nextStellarPasskeysConfig);
        setDefindexConfig(nextDefindexConfig);
        setZkFixture(nextZkFixture);
        setZkPreview(nextZkFixture);
        setZkCircuitInput(nextZkFixture.circuitInput);
        setSelectedVaultAddress(nextDefindexConfig.vaults.find((vault) => vault.kind === "vault")?.contractId ?? "");
        setBaseFee(nextConfig.recommendedBaseFee);
        setStatus(
          nextSession.authenticated
            ? copy.restored
            : copy.prompt,
        );

        const [health, factory] = await Promise.all([
          fetchJson<Record<string, unknown>>("/api/defindex/health"),
          fetchJson<Record<string, unknown>>("/api/defindex/factory"),
        ]);
        setDefindexHealth(health);
        setDefindexFactory(factory);
      } catch (error) {
        setStatus(getErrorMessage(error, copy.unexpectedError));
      }
    })();
  }, []);

  useEffect(() => {
    const storedProfile = getStoredWalletlessProfile(username);
    if (!storedProfile) {
      setProfile(null);
      return;
    }

    setProfile(storedProfile);
    setDisplayName(storedProfile.displayName);
  }, [username]);

  function runAction(action: () => Promise<void>) {
    startTransition(() => {
      void action().catch((error) => {
        setStatus(getErrorMessage(error, copy.unexpectedError));
      });
    });
  }

  function handleRegister() {
    runAction(async () => {
      ensurePasskeySupport(copy.browserUnsupported);
      setStatus(copy.registerChallenge);
      const existingProfile = getStoredWalletlessProfile(username);

      const registration = await fetchJson<RegistrationOptionsEnvelope>(
        "/api/walletless/passkey/register/options",
        jsonRequest({
          username,
          displayName,
          profile: existingProfile,
        }),
      );

      const response = await startRegistration({
        optionsJSON: registration.options,
      });

      setStatus(copy.verifyRegistration);

      const verification = await fetchJson<PasskeyVerificationEnvelope>(
        "/api/walletless/passkey/register/verify",
        jsonRequest({
          flowToken: registration.flowToken,
          response,
          profile: existingProfile,
        }),
      );

      storeWalletlessProfile(verification.profile);
      setProfile(verification.profile);
      setUsername(verification.profile.username);
      setDisplayName(verification.profile.displayName);
      setSession(verification.session);
      setSponsorResponse(null);
      setStatus(copy.registrationDone);
    });
  }

  function handleLogin() {
    runAction(async () => {
      ensurePasskeySupport(copy.browserUnsupported);
      setStatus(copy.loginChallenge);
      const existingProfile = getStoredWalletlessProfile(username);
      if (!existingProfile) {
        throw new Error("No passkey profile found on this device for that username");
      }

      const login = await fetchJson<AuthenticationOptionsEnvelope>(
        "/api/walletless/passkey/login/options",
        jsonRequest({
          username,
          profile: existingProfile,
        }),
      );

      const response = await startAuthentication({
        optionsJSON: login.options,
      });

      setStatus(copy.verifyLogin);

      const verification = await fetchJson<PasskeyVerificationEnvelope>(
        "/api/walletless/passkey/login/verify",
        jsonRequest({
          flowToken: login.flowToken,
          response,
          profile: existingProfile,
        }),
      );

      storeWalletlessProfile(verification.profile);
      setProfile(verification.profile);
      setUsername(verification.profile.username);
      setDisplayName(verification.profile.displayName);
      setSession(verification.session);
      setSponsorResponse(null);
      setStatus(copy.loginDone);
    });
  }

  function handleLogout() {
    runAction(async () => {
      await fetchJson<{ cleared: boolean }>("/api/walletless/session", {
        method: "DELETE",
      });

      setSession(null);
      setProfile(getStoredWalletlessProfile(username));
      setSponsorResponse(null);
      setStatus(copy.logoutDone);
    });
  }

  function handleSponsor() {
    runAction(async () => {
      if (!session) {
        throw new Error(copy.needSignin);
      }

      if (!innerXdr.trim()) {
        throw new Error(copy.needInnerXdr);
      }

      setStatus(copy.sponsorBuilding);

      const response = await fetchJson<Record<string, unknown>>("/api/walletless/sponsor-fee", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          innerXdr,
          baseFee,
        }),
      });

      setSponsorResponse(response);
      setStatus(
        response.mode === "fee-bump"
          ? copy.sponsorDone
          : copy.sponsorMock,
      );
    });
  }

  function handleSponsorSmoke() {
    runAction(async () => {
      if (!session) {
        throw new Error(copy.needSignin);
      }

      setStatus(copy.sponsorSmokeBuilding);

      const response = await fetchJson<Record<string, unknown>>("/api/walletless/sponsor-smoke", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          baseFee,
        }),
      });

      const smokeInnerXdr = getNestedString(response, ["innerXdr"]);
      if (smokeInnerXdr) {
        setInnerXdr(smokeInnerXdr);
      }

      setSponsorResponse(response);
      setStatus(copy.sponsorSmokeDone);
    });
  }

  function handleZkCircuitInputChange(field: keyof ZkCircuitInput, value: string) {
    setZkCircuitInput((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function handleRebuildZkPreview() {
    runAction(async () => {
      if (!zkCircuitInput || !zkFixture) {
        throw new Error(copy.loadingZkFixture);
      }

      setStatus(copy.buildZkPreview);
      const response = await fetchJson<ZkFixtureEnvelope>(
        "/api/zk/derive",
        jsonRequest({
          circuitInput: zkCircuitInput,
          proofHex: zkFixture.fixture.proofHex,
        }),
      );

      setZkPreview(response);
      setStatus(copy.buildZkPreviewDone);
    });
  }

  function handleResetZkPreview() {
    if (!zkFixture) {
      return;
    }

    setZkCircuitInput(zkFixture.circuitInput);
    setZkPreview(zkFixture);
    setStatus(copy.zkResetDone);
  }

  function handleCopyZkCommand() {
    runAction(async () => {
      if (!zkPreview?.consumePack.scriptCommand) {
        throw new Error(copy.loadingZkFixture);
      }

      if (!globalThis.navigator?.clipboard) {
        throw new Error(copy.unexpectedError);
      }

      await globalThis.navigator.clipboard.writeText(zkPreview.consumePack.scriptCommand);
      setStatus(copy.copyZkCommandDone);
    });
  }

  function handleLoadDefindexVault() {
    runAction(async () => {
      if (!selectedVaultAddress.trim()) {
        throw new Error(copy.needVault);
      }

      setStatus(copy.loadVault);
      const response = await fetchJson<Record<string, unknown>>(
        `/api/defindex/vault-info?vaultAddress=${encodeURIComponent(selectedVaultAddress)}`,
      );
      setDefindexVaultInfo(response);
      setStatus(copy.vaultLoaded);
    });
  }

  function handleBuildDefindexDeposit() {
    runAction(async () => {
      if (!selectedVaultAddress.trim()) {
        throw new Error(copy.needVault);
      }

      if (!defindexCaller.trim()) {
        throw new Error(copy.needCaller);
      }

      const amounts = defindexAmounts
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0);

      if (amounts.length === 0) {
        throw new Error(copy.needAmount);
      }

      setStatus(copy.buildDeposit);

      const response = await fetchJson<Record<string, unknown>>("/api/defindex/build-deposit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          vaultAddress: selectedVaultAddress,
          caller: defindexCaller,
          amounts,
          invest: true,
          slippageBps: 100,
        }),
      });

      setDefindexDepositResponse(response);
      setDefindexSponsoredResponse(null);
      const liveInnerXdr = getNestedString(response, ["result", "xdr"]);
      if (liveInnerXdr) {
        setInnerXdr(liveInnerXdr);
      }
      setStatus(
        response.mode === "mock"
          ? copy.buildDepositMock
          : copy.buildDepositDone,
      );
    });
  }

  function handleBuildSponsoredDefindexDeposit() {
    runAction(async () => {
      if (!selectedVaultAddress.trim()) {
        throw new Error(copy.needVault);
      }

      if (!defindexCaller.trim()) {
        throw new Error(copy.needCaller);
      }

      const amounts = defindexAmounts
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0);

      if (amounts.length === 0) {
        throw new Error(copy.needAmount);
      }

      setStatus(copy.buildSponsoredDeposit);

      const response = await fetchJson<Record<string, unknown>>("/api/defindex/sponsored-deposit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          vaultAddress: selectedVaultAddress,
          caller: defindexCaller,
          amounts,
          invest: true,
          slippageBps: 100,
          baseFee,
        }),
      });

      setDefindexSponsoredResponse(response);
      const inner = getNestedString(response, ["innerXdr"]);
      if (inner) {
        setInnerXdr(inner);
      }
      const outer = getNestedString(response, ["sponsorship", "feeBumpXdr"]);
      if (outer) {
        setSponsorResponse(response);
      }

      setStatus(
        response.mode === "fee-bump"
          ? copy.buildSponsoredDone
          : copy.buildSponsoredMock,
      );
    });
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-5">
        <article className="overflow-hidden rounded-[2rem] border border-emerald-200/10 bg-[linear-gradient(135deg,rgba(17,47,34,0.94),rgba(7,16,13,0.96))]">
          <div className="border-b border-white/8 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.34em] text-emerald-300/75">
              {copy.passkeyDesk}
            </p>
            <h2 className="mt-3 text-3xl text-emerald-50 md:text-4xl">
              {copy.passkeyTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              {copy.passkeyBody}
            </p>
          </div>

          <div className="grid gap-5 p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/70">
                {copy.deviceReadiness}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <SummaryPill
                  label={copy.passkeys}
                  tone={supportsPasskeys ? "emerald" : "amber"}
                  value={supportsPasskeys ? copy.supported : copy.unavailable}
                />
                <SummaryPill
                  label={copy.sponsorMode}
                  tone={config?.sponsorMode === "fee-bump" ? "sky" : "amber"}
                  value={config?.sponsorMode === "fee-bump" ? copy.liveFeeBump : copy.mockSponsor}
                />
                <SummaryPill
                  label={copy.network}
                  tone="stone"
                  value={config?.networkPassphrase.includes("Test") ? copy.testnet : copy.custom}
                />
              </div>

              <dl className="mt-6 space-y-3 text-sm text-stone-300">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <dt className="uppercase tracking-[0.18em] text-stone-400">{copy.rpId}</dt>
                  <dd className="mt-2 break-all text-stone-100">{config?.rpId ?? copy.loadingText}</dd>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <dt className="uppercase tracking-[0.18em] text-stone-400">{copy.origin}</dt>
                  <dd className="mt-2 break-all text-stone-100">{config?.origin ?? copy.loadingText}</dd>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <dt className="uppercase tracking-[0.18em] text-stone-400">{copy.sponsorAccount}</dt>
                  <dd className="mt-2 break-all text-stone-100">
                    {config?.sponsorPublicKey ?? copy.notConfiguredYet}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-stone-300">
                  {copy.username}
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-emerald-300/50"
                    placeholder="patient.andes"
                  />
                </label>
                <label className="text-sm text-stone-300">
                  {copy.displayName}
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-emerald-300/50"
                    placeholder="Paciente Andes"
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={isPending}
                  className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.registerPasskey}
                </button>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isPending}
                  className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-emerald-200/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.signIn}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isPending || !session}
                  className="rounded-full border border-amber-200/20 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.clearSession}
                </button>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-emerald-200/10 bg-emerald-300/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/80">
                  {copy.statusChannel}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-200">{status}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-sky-200/10 bg-[linear-gradient(160deg,rgba(8,18,26,0.95),rgba(4,11,17,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.34em] text-sky-300/75">{copy.feeLane}</p>
          <h2 className="mt-3 text-3xl text-sky-50">{copy.feeTitle}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
            {copy.feeBody}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[0.72fr_0.28fr]">
            <label className="text-sm text-stone-300">
              {copy.innerXdr}
              <textarea
                value={innerXdr}
                onChange={(event) => setInnerXdr(event.target.value)}
                rows={8}
                className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-stone-100 outline-none transition focus:border-sky-300/50"
                placeholder="AAAAAgAAA..."
              />
            </label>
            <div className="space-y-4">
              <label className="block text-sm text-stone-300">
                {copy.baseFee}
                <input
                  value={baseFee}
                  onChange={(event) => setBaseFee(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-sky-300/50"
                />
              </label>
              <button
                type="button"
                onClick={handleSponsor}
                disabled={isPending || !session}
                className="w-full rounded-[1.5rem] bg-sky-300 px-5 py-4 text-sm font-semibold text-sky-950 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copy.buildSponsorPayload}
              </button>
              <button
                type="button"
                onClick={handleSponsorSmoke}
                disabled={isPending || !session}
                className="w-full rounded-[1.5rem] border border-sky-300/30 px-5 py-4 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copy.runSponsorSmoke}
              </button>
              <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4 text-sm text-stone-300">
                <p className="uppercase tracking-[0.2em] text-sky-300/70">{copy.guardrails}</p>
                <p className="mt-3 leading-7">
                  {copy.guardrailsBody}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-5">
        <article className="rounded-[2rem] border border-amber-200/10 bg-[linear-gradient(180deg,rgba(28,20,10,0.96),rgba(18,12,6,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.34em] text-amber-300/75">{copy.sessionMirror}</p>
          <h2 className="mt-3 text-3xl text-amber-50">{copy.sessionTitle}</h2>

          {session ? (
            <div className="mt-6 grid gap-4">
              <SessionRow label={copy.user}>{session.displayName}</SessionRow>
              <SessionRow label={copy.handle}>{session.username}</SessionRow>
              <SessionRow label={copy.walletHint}>{session.smartWalletHint}</SessionRow>
              <SessionRow label={copy.smartWalletStatus}>{session.smartWalletStatus}</SessionRow>
              <SessionRow label={copy.passkeysStored}>{String(session.credentialCount)}</SessionRow>
              <SessionRow label={copy.network}>{session.networkPassphrase}</SessionRow>
              <SessionRow label="Local profile cache">
                {profile ? `${profile.credentials.length} device credential(s) ready` : "No device cache found yet"}
              </SessionRow>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/5 p-5 text-sm leading-7 text-stone-300">
              {copy.noSession}
            </div>
          )}

          <div className="mt-6 rounded-[1.5rem] border border-amber-200/10 bg-black/15 p-4 text-sm leading-7 text-stone-300">
            {copy.deploymentReadyNote}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-[#091512]/85 p-6">
          <p className="text-xs uppercase tracking-[0.34em] text-emerald-300/75">{copy.sponsorOutput}</p>
          <h2 className="mt-3 text-3xl text-emerald-50">{copy.sponsorOutputTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            {copy.sponsorOutputBody}
          </p>

          {sponsorSmokeSummary ? (
            <div className="mt-6 rounded-[1.5rem] border border-emerald-200/10 bg-emerald-300/8 p-5">
              <div className="flex flex-wrap gap-3">
                <SummaryPill
                  label={copy.sponsorLiveResult}
                  tone={sponsorSmokeSummary.submitted ? "emerald" : "amber"}
                  value={sponsorSmokeSummary.submitted ? copy.submittedTx : copy.pendingTx}
                />
                <SummaryPill
                  label={copy.sponsorMode}
                  tone="sky"
                  value={String(sponsorResponse?.mode ?? copy.loadingMode)}
                />
              </div>

              <div className="mt-5 grid gap-4">
                <InfoRow label={copy.transactionHash}>
                  {sponsorSmokeSummary.hash}
                </InfoRow>
                <InfoRow label={copy.feeSourceLabel}>
                  {sponsorSmokeSummary.feeSource ?? copy.loadingText}
                </InfoRow>
                <InfoRow label={copy.smokeSourceLabel}>
                  {sponsorSmokeSummary.sourceAccount ?? copy.loadingText}
                </InfoRow>
              </div>

              {sponsorSmokeSummary.explorerUrl ? (
                <a
                  href={sponsorSmokeSummary.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/5"
                >
                  {copy.openExplorer}
                </a>
              ) : null}
            </div>
          ) : null}

          <pre className="mt-6 overflow-x-auto rounded-[1.5rem] border border-white/8 bg-black/30 p-4 text-xs leading-6 text-stone-200">
            {JSON.stringify(
              sponsorResponse ?? {
                mode: config?.sponsorMode ?? copy.loadingMode,
                note: copy.noSponsorCallYet,
              },
              null,
              2,
            )}
          </pre>
        </article>

        <article className="rounded-[2rem] border border-fuchsia-200/10 bg-[linear-gradient(180deg,rgba(20,10,20,0.96),rgba(12,8,16,0.98))] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-fuchsia-300/75">{copy.zkRail}</p>
              <h2 className="mt-3 text-3xl text-fuchsia-50">{copy.zkTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
                {copy.zkBody}
              </p>
            </div>
            <a
              href="/api/zk/fixture"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/5"
            >
              {copy.openZkJson}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <SummaryPill
              label={copy.proofBytes}
              tone="fuchsia"
              value={zkPreview ? String(zkPreview.fixture.proofBytes) : copy.loadingText}
            />
            <SummaryPill
              label={copy.liveStatus}
              tone={zkPreview?.liveStatus.indexedConsumed ? "emerald" : "amber"}
              value={zkPreview?.liveStatus.indexedConsumed ? copy.consumedLive : copy.pendingLive}
            />
            <SummaryPill
              label={copy.witnessCheck}
              tone={zkPreview?.matchesFixture.all ? "emerald" : "amber"}
              value={zkPreview?.matchesFixture.all ? copy.matchingWitness : copy.mismatchWitness}
            />
            <SummaryPill
              label={copy.currentDay}
              tone="stone"
              value={zkPreview ? String(zkPreview.fixture.currentDay) : copy.loadingText}
            />
            <SummaryPill
              label={copy.zkRail}
              tone="stone"
              value={zkPreview?.matchesFixture.all ? copy.baselineFixture : copy.derivedPreview}
            />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/15 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-300/70">
                  {copy.witnessLab}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300">
                  {copy.witnessLabBody}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRebuildZkPreview}
                  disabled={isPending || !zkCircuitInput || !zkFixture}
                  className="rounded-full bg-fuchsia-300 px-4 py-2 text-sm font-semibold text-fuchsia-950 transition hover:bg-fuchsia-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.deriveZkPreview}
                </button>
                <button
                  type="button"
                  onClick={handleResetZkPreview}
                  disabled={isPending || !zkFixture}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.resetWitness}
                </button>
                <button
                  type="button"
                  onClick={handleCopyZkCommand}
                  disabled={isPending || !zkPreview}
                  className="rounded-full border border-fuchsia-300/30 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-300/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.copyZkCommand}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(["patientSecret", "prescriptionId", "issuedAtUnix", "validUntilUnix", "dosageClass", "policyNonce", "currentDay"] as const).map(
                (field) => (
                  <label key={field} className="text-sm text-stone-300">
                    {getZkFieldLabel(locale, field)}
                    <input
                      value={zkCircuitInput?.[field] ?? ""}
                      onChange={(event) => handleZkCircuitInputChange(field, event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-fuchsia-300/50"
                      spellCheck={false}
                    />
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <InfoRow label={copy.zkContract}>
              {zkPreview?.contractId ?? copy.loadingText}
            </InfoRow>
            <InfoRow label={copy.commitmentLabel}>
              {zkPreview?.fixture.commitment ?? copy.loadingText}
            </InfoRow>
            <InfoRow label={copy.publicInputsHashLabel}>
              {zkPreview?.fixture.publicInputsHash ?? copy.loadingText}
            </InfoRow>
            <InfoRow label={copy.consumeReceipt}>
              {zkPreview?.liveStatus.consumeTxHash ?? copy.waitingConsume}
            </InfoRow>
            <InfoRow label={copy.consumePack}>
              {zkPreview?.consumePack.payloadBase64 ?? copy.loadingText}
            </InfoRow>
            <InfoRow label={copy.scriptCommand}>
              {zkPreview?.consumePack.scriptCommand ?? copy.loadingText}
            </InfoRow>
          </div>

          <pre className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/8 bg-black/25 p-4 text-xs leading-6 text-stone-200">
            {JSON.stringify(
              zkPreview
                ? {
                    note: zkPreview.note,
                    circuitInput: zkPreview.circuitInput,
                    publicInputs: zkPreview.publicInputs,
                    publicInputOrder: zkPreview.publicInputOrder,
                    derivedSignals: zkPreview.derivedSignals,
                    matchesFixture: zkPreview.matchesFixture,
                    packedProofEnvelope: {
                      ...zkPreview.packedProofEnvelope,
                      proofHex: `${zkPreview.packedProofEnvelope.proofHex.slice(0, 24)}...${zkPreview.packedProofEnvelope.proofHex.slice(-24)}`,
                    },
                    verifyAndConsumeArgs: {
                      ...zkPreview.verifyAndConsumeArgs,
                      proof: `${zkPreview.verifyAndConsumeArgs.proof.slice(0, 24)}...${zkPreview.verifyAndConsumeArgs.proof.slice(-24)}`,
                    },
                    consumePack: {
                      ...zkPreview.consumePack,
                      payloadBase64: `${zkPreview.consumePack.payloadBase64.slice(0, 24)}...${zkPreview.consumePack.payloadBase64.slice(-24)}`,
                      scriptCommand: zkPreview.consumePack.scriptCommand,
                    },
                    liveStatus: zkPreview.liveStatus,
                  }
                : {
                    note: copy.loadingZkFixture,
                  },
              null,
              2,
            )}
          </pre>
        </article>

        <article className="rounded-[2rem] border border-violet-200/10 bg-[linear-gradient(180deg,rgba(14,16,27,0.96),rgba(9,10,18,0.98))] p-6">
          <p className="text-xs uppercase tracking-[0.34em] text-violet-300/75">{copy.ecosystemRails}</p>
          <h2 className="mt-3 text-3xl text-violet-50">{copy.ecosystemTitle}</h2>
          <div className="mt-6 grid gap-5">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <SummaryPill
                  label={copy.stellarPasskeys}
                  tone={stellarPasskeysConfig?.integrationMode === "passkey-kit-ready" ? "emerald" : "amber"}
                  value={
                    stellarPasskeysConfig?.integrationMode === "passkey-kit-ready"
                      ? copy.factoryWired
                      : copy.mvpWebauthn
                  }
                />
                <SummaryPill
                  label={copy.model}
                  tone="sky"
                  value={stellarPasskeysConfig?.smartWalletModel === "contract-account" ? copy.smartWallet : copy.unknown}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {copy.recommendedSdk}: {stellarPasskeysConfig?.recommendedSdk ?? copy.loadingMode}.
                {` `}
                {stellarPasskeysConfig?.warning ?? copy.loadingWarning}
              </p>
              <div className="mt-4 grid gap-3">
                <InfoRow label={copy.rpc}>{stellarPasskeysConfig?.rpcUrl ?? copy.loadingText}</InfoRow>
                <InfoRow label={copy.factoryContract}>
                  {stellarPasskeysConfig?.factoryContractId ?? copy.pendingFactory}
                </InfoRow>
                <InfoRow label={copy.walletWasmHash}>
                  {stellarPasskeysConfig?.walletWasmHash ?? copy.pendingWasm}
                </InfoRow>
                <InfoRow label={copy.relayer}>
                  {stellarPasskeysConfig?.launchtubeUrl ?? copy.relayerPending}
                </InfoRow>
                <InfoRow label={copy.indexer}>
                  {stellarPasskeysConfig?.mercuryUrl ?? copy.mercuryPending}
                </InfoRow>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <SummaryPill
                  label={copy.defindex}
                  tone={defindexConfig?.partnerIntegrationMode === "live-ready" ? "emerald" : "amber"}
                  value={
                    defindexConfig?.partnerIntegrationMode === "live-ready"
                      ? copy.apiKeyReady
                      : copy.testnetMapped
                  }
                />
                <SummaryPill
                  label={copy.environment}
                  tone="stone"
                  value={defindexConfig?.environment ?? copy.loadingEnvironment}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {defindexConfig?.recommendedFlow ?? "Loading DeFindex integration posture..."}
              </p>
              <div className="mt-4 grid gap-3">
                <InfoRow label={copy.apiBase}>{defindexConfig?.apiBaseUrl ?? copy.loadingText}</InfoRow>
                <InfoRow label={copy.factoryContract}>
                  {defindexConfig?.factoryContractId ?? copy.loadingText}
                </InfoRow>
                <InfoRow label={copy.walletWasmHash}>
                  {defindexConfig?.vaultWasmHash ?? copy.loadingText}
                </InfoRow>
                <InfoRow label={copy.sdkHealth}>
                  {defindexHealth
                    ? JSON.stringify(
                        {
                          reachable: defindexHealth.reachable,
                          error: defindexHealth.error,
                        },
                        null,
                        2,
                      )
                    : copy.loadingHealth}
                </InfoRow>
                <InfoRow label={copy.sdkFactory}>
                  {defindexFactory ? JSON.stringify(defindexFactory, null, 2) : copy.loadingFactory}
                </InfoRow>
              </div>
              <div className="mt-5 space-y-3">
                {defindexConfig?.vaults.map((vault) => (
                  <div key={vault.key} className="rounded-2xl border border-white/8 bg-black/15 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-stone-100">{vault.label}</p>
                      <span className="rounded-full bg-violet-300/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-200">
                        {vault.kind}
                      </span>
                    </div>
                    <p className="mt-3 break-all text-xs leading-6 text-stone-300">
                      {vault.contractId}
                    </p>
                  </div>
                )) ?? (
                  <div className="rounded-2xl border border-white/8 bg-black/15 p-4 text-sm text-stone-300">
                    {copy.loadingDeployments}
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-black/15 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-violet-300/70">
                  {copy.depositBuilder}
                </p>
                <div className="mt-4 grid gap-4">
                  <label className="text-sm text-stone-300">
                    {copy.vault}
                    <select
                      value={selectedVaultAddress}
                      onChange={(event) => setSelectedVaultAddress(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-violet-300/50"
                    >
                      <option value="">{copy.selectVault}</option>
                      {defindexConfig?.vaults
                        .filter((vault) => vault.kind === "vault")
                        .map((vault) => (
                          <option key={vault.key} value={vault.contractId}>
                            {vault.label}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="text-sm text-stone-300">
                    {copy.callerAddress}
                    <input
                      value={defindexCaller}
                      onChange={(event) => setDefindexCaller(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-violet-300/50"
                      placeholder="G..."
                    />
                  </label>
                  <label className="text-sm text-stone-300">
                    {copy.amounts}
                    <input
                      value={defindexAmounts}
                      onChange={(event) => setDefindexAmounts(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none transition focus:border-violet-300/50"
                      placeholder={copy.amountPlaceholder}
                    />
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleLoadDefindexVault}
                    disabled={isPending || !selectedVaultAddress}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {copy.loadVaultInfo}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuildDefindexDeposit}
                    disabled={isPending || !selectedVaultAddress}
                    className="rounded-full bg-violet-300 px-4 py-2 text-sm font-semibold text-violet-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {copy.buildDepositXdr}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuildSponsoredDefindexDeposit}
                    disabled={isPending || !selectedVaultAddress || !session}
                    className="rounded-full border border-sky-300/30 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {copy.buildSponsoredDepositButton}
                  </button>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-black/25 p-4 text-xs leading-6 text-stone-200">
                  {JSON.stringify(
                    {
                      vaultInfo: defindexVaultInfo,
                      depositPreview: defindexDepositResponse,
                      sponsoredDepositPreview: defindexSponsoredResponse,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "sky" | "stone" | "fuchsia";
}) {
  const toneMap = {
    emerald: "bg-emerald-300/15 text-emerald-100",
    amber: "bg-amber-300/15 text-amber-100",
    sky: "bg-sky-300/15 text-sky-100",
    stone: "bg-white/10 text-stone-100",
    fuchsia: "bg-fuchsia-300/15 text-fuchsia-100",
  };

  return (
    <div className={`rounded-full px-4 py-2 text-sm ${toneMap[tone]}`}>
      <span className="mr-2 text-xs uppercase tracking-[0.18em] text-stone-300">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SessionRow({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-300/70">{label}</p>
      <p className="mt-3 break-all text-sm leading-7 text-stone-100">{children}</p>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: string }) {
  return (
    <div className="rounded-[1.25rem] border border-white/8 bg-black/15 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70">{label}</p>
      <p className="mt-3 break-all text-sm leading-7 text-stone-100">{children}</p>
    </div>
  );
}

const WALLETLESS_PROFILE_STORAGE_KEY = "trustleaf_walletless_profiles_v1";

function getStoredWalletlessProfile(username: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const profiles = readStoredWalletlessProfiles();
  return profiles[normalizeWalletlessUsername(username)] ?? null;
}

function storeWalletlessProfile(profile: WalletlessProfileRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const profiles = readStoredWalletlessProfiles();
  profiles[normalizeWalletlessUsername(profile.username)] = profile;
  window.localStorage.setItem(WALLETLESS_PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}

function readStoredWalletlessProfiles() {
  if (typeof window === "undefined") {
    return {} as Record<string, WalletlessProfileRecord>;
  }

  try {
    const raw = window.localStorage.getItem(WALLETLESS_PROFILE_STORAGE_KEY);
    if (!raw) {
      return {} as Record<string, WalletlessProfileRecord>;
    }

    const parsed = JSON.parse(raw) as Record<string, WalletlessProfileRecord>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {} as Record<string, WalletlessProfileRecord>;
  }
}

function normalizeWalletlessUsername(username: string) {
  return username.trim().toLowerCase();
}

function ensurePasskeySupport(message: string) {
  if (!browserSupportsWebAuthn()) {
    throw new Error(message);
  }
}

function jsonRequest(payload: unknown): RequestInit {
  return {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };
}

async function fetchJson<T>(input: string, init?: RequestInit) {
  const response = await fetch(input, init);
  const payload = (await response.json().catch(() => null)) as
    | (T & { error?: string })
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? `Request failed with status ${response.status}`);
  }

  return payload as T;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function getNestedString(source: Record<string, unknown>, path: string[]) {
  let current: unknown = source;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : null;
}

function getSponsorSmokeSummary(source: Record<string, unknown> | null) {
  if (!source) {
    return null;
  }

  const smoke = getNestedRecord(source, ["smoke"]);
  const hash = getNestedString(source, ["smoke", "hash"]);
  if (!smoke || !hash) {
    return null;
  }

  const submitted = getNestedBoolean(source, ["smoke", "submitted"]);
  const feeSource = getNestedString(source, ["feeSource"]);
  const sourceAccount = getNestedString(source, ["smoke", "sourceAccount"]);

  return {
    hash,
    submitted,
    feeSource,
    sourceAccount,
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${hash}`,
  };
}

function getNestedRecord(source: Record<string, unknown>, path: string[]) {
  let current: unknown = source;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current && typeof current === "object" ? (current as Record<string, unknown>) : null;
}

function getNestedBoolean(source: Record<string, unknown>, path: string[]) {
  let current: unknown = source;
  for (const key of path) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return false;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current === true;
}

function getZkFieldLabel(locale: Locale, field: keyof ZkCircuitInput) {
  const labels =
    locale === "es"
      ? {
          patientSecret: "Secreto del paciente",
          prescriptionId: "Prescription ID",
          issuedAtUnix: "Emitida en Unix",
          validUntilUnix: "Valida hasta Unix",
          dosageClass: "Clase de dosis",
          policyNonce: "Policy nonce",
          currentDay: "Current day",
        }
      : {
          patientSecret: "Patient secret",
          prescriptionId: "Prescription ID",
          issuedAtUnix: "Issued at Unix",
          validUntilUnix: "Valid until Unix",
          dosageClass: "Dosage class",
          policyNonce: "Policy nonce",
          currentDay: "Current day",
        };

  return labels[field];
}
