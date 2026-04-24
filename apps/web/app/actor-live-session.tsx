"use client";

import { useEffect, useState } from "react";

import type { Locale } from "./lib/i18n";
import type { WalletlessSessionView } from "./lib/walletless/types";

type SessionEnvelope = {
  authenticated: boolean;
  session: WalletlessSessionView | null;
};

export function ActorLiveSession({ locale }: { locale: Locale }) {
  const copy =
    locale === "es"
      ? {
          eyebrow: "Sesion live",
          loading: "Revisando si ya existe una sesion activa...",
          inactive: "Aun no hay sesion activa. Entra con passkeys o Freighter para probar endpoints protegidos desde este mismo POV.",
          active: "Sesion activa detectada",
          passkey: "Passkey session",
          freighter: "Freighter session",
          handle: "Handle",
          wallet: "Wallet hint",
          ready: "Ya puedes volver a este POV y usar el rail live.",
        }
      : {
          eyebrow: "Live session",
          loading: "Checking whether a live session is already active...",
          inactive: "No active session yet. Enter with passkeys or Freighter to test protected endpoints from this same POV.",
          active: "Active session detected",
          passkey: "Passkey session",
          freighter: "Freighter session",
          handle: "Handle",
          wallet: "Wallet hint",
          ready: "You can now return to this POV and use the live rail.",
        };

  const [session, setSession] = useState<WalletlessSessionView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/walletless/session", {
          credentials: "same-origin",
        });
        const payload = (await response.json().catch(() => null)) as SessionEnvelope | null;

        if (!cancelled) {
          setSession(payload?.session ?? null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const entryRail = session?.username.startsWith("freighter-") ? copy.freighter : copy.passkey;

  return (
    <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-black/15 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{copy.eyebrow}</p>
      {loading ? (
        <p className="mt-3 text-sm leading-7 text-white/70">{copy.loading}</p>
      ) : session ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SessionCell label={copy.active} value={entryRail} />
          <SessionCell label={copy.handle} value={session.username} />
          <SessionCell label={copy.wallet} value={session.smartWalletHint} />
          <p className="md:col-span-3 text-sm leading-7 text-white/70">{copy.ready}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-7 text-white/70">{copy.inactive}</p>
      )}
    </div>
  );
}

function SessionCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-white">{value}</p>
    </div>
  );
}
