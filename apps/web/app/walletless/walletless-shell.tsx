import Link from "next/link";

import { LanguageSwitcher } from "../language-switcher";
import type { getWalletlessPageCopy } from "../lib/i18n";
import type { StellarPasskeysConfigView, WalletlessConfigView } from "../lib/walletless/types";
import { WalletlessWorkbench } from "./walletless-workbench";

type Locale = "en" | "es";
type WalletlessCopy = ReturnType<typeof getWalletlessPageCopy>;

export function WalletlessShell({
  locale,
  copy,
  config,
  passkeys,
}: {
  locale: Locale;
  copy: WalletlessCopy;
  config: WalletlessConfigView;
  passkeys: StellarPasskeysConfigView;
}) {
  const shellCopy =
    locale === "es"
      ? {
          summaryEyebrow: "Estado actual",
          summaryTitle: "Lo que esta listo hoy en wallet-less.",
          sponsor: "Sponsor",
          passkeys: "Passkeys",
          phase: "Backend phase",
          stableEyebrow: "Como mirar esta pantalla",
          stableTitle: "Primero producto, despues laboratorio.",
          stableBody: "Wallet-less sigue siendo el lugar para validar login, sponsor y rails protegidos. Ahora esta mejor enmarcado para demo y para operacion.",
          commandCenter: "Abrir command center",
        }
      : {
          summaryEyebrow: "Current status",
          summaryTitle: "What is ready today in wallet-less.",
          sponsor: "Sponsor",
          passkeys: "Passkeys",
          phase: "Backend phase",
          stableEyebrow: "How to read this screen",
          stableTitle: "Product first, lab second.",
          stableBody: "Wallet-less remains the place to validate login, sponsorship, and protected rails. It is now framed better for demos and operations.",
          commandCenter: "Open command center",
        };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#153628_0%,#091612_45%,#050b09_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-emerald-200/10 bg-white/5 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-900 text-sm font-semibold text-emerald-50">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-emerald-50">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-400">Wallet-less lane</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white">
                {copy.back}
              </Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white">
                {locale === "es" ? "Abrir demo script" : "Open demo script"}
              </Link>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-emerald-200/10 bg-[linear-gradient(145deg,#0c2118,#123427_48%,#0a1811_100%)] p-8 shadow-[0_28px_100px_rgba(0,0,0,0.24)] md:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">{copy.eyebrow}</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.96] text-emerald-50 md:text-7xl">{copy.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-stone-300 md:text-lg">{copy.body}</p>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-400">{shellCopy.summaryEyebrow}</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-stone-50">{shellCopy.summaryTitle}</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <MetricCard label={shellCopy.sponsor} value={config.sponsorMode} />
                <MetricCard label={shellCopy.passkeys} value={passkeys.integrationMode} />
                <MetricCard label={shellCopy.phase} value={String(passkeys.backendPhase)} />
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-400">{shellCopy.stableEyebrow}</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-stone-50">{shellCopy.stableTitle}</h2>
              <p className="mt-4 text-base leading-7 text-stone-300">{shellCopy.stableBody}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/command-center" className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200">
                  {shellCopy.commandCenter}
                </Link>
                <Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/5">
                  {copy.back}
                </Link>
              </div>
            </article>
          </aside>
        </section>

        <section className="mt-8 rounded-[2.3rem] border border-white/10 bg-black/20 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
          <WalletlessWorkbench locale={locale} />
        </section>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{label}</p>
      <p className="mt-3 font-display text-3xl leading-none text-stone-50">{value}</p>
    </article>
  );
}
