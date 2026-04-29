import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorEntryMode } from "../actor-entry-mode";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";
import type { getDispensaryPageCopy } from "../lib/i18n";
import type { getTrustLeafDispensaryActionPack } from "../lib/trustleaf/actionRails";
import type { getTrustLeafDispensarySubmitConfig } from "../lib/trustleaf/dispensaryConsume";
import type { getIndexedState } from "../lib/trustleaf/indexedState";
import { DispensaryConsumeSubmit } from "./dispensary-consume-submit";

type Locale = "en" | "es";
type DispensaryCopy = ReturnType<typeof getDispensaryPageCopy>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type DispensaryActionPack = Awaited<ReturnType<typeof getTrustLeafDispensaryActionPack>>;
type DispensarySubmitConfig = ReturnType<typeof getTrustLeafDispensarySubmitConfig>;

type InventoryItem = {
  id: string;
  name: string;
  note: string;
  price: string;
};

type ValidationItem = {
  id: string;
  title: string;
  note: string;
  status: string;
};

export function DispensaryRedesign({
  locale,
  copy,
  indexedState,
  dispensaryActionPack,
  dispensarySubmitConfig,
}: {
  locale: Locale;
  copy: DispensaryCopy;
  indexedState: IndexedState;
  dispensaryActionPack: DispensaryActionPack;
  dispensarySubmitConfig: DispensarySubmitConfig;
}) {
  const dispensaryMemberships = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DISP"),
  );
  const selectedDispensary = dispensaryMemberships[0] ?? null;
  const pendingPrescriptions = indexedState.prescriptions.filter((prescription) => !prescription.isUsed);
  const releasedBatches = indexedState.batches.filter((batch) => batch.status.toLowerCase().includes("released"));

  const ui =
    locale === "es"
      ? {
          lane: "Dispensary lane",
          openDemo: "Abrir demo script",
          heroTitle: "El dispensario deberia ver stock, validacion y venta en una sola mirada.",
          heroBody: "Este POV existe para operar inventario y validar recetas sin ruido tecnico en medio del retail.",
          focusEyebrow: "Catalogo",
          focusTitle: "Lo importante es saber que se puede vender hoy.",
          focusBody: "Producto visible, lote listo y validacion pendiente. Nada mas para empezar.",
          validationEyebrow: "Validaciones",
          validationTitle: "Que recetas estan listas para convertirse en venta.",
          liveEyebrow: "Live rail",
          liveTitle: "Consumir una receta real desde este workspace.",
          liveBody: "La capa tecnica queda abajo. Primero claridad operativa. Despues submit real.",
          activeDisp: "Cuenta activa",
          liveInventory: "Inventario",
          liveRx: "Recetas",
          liveBatches: "Lotes",
          openWalletless: "Abrir wallet-less",
          advanced: "Bridge tecnico",
        }
      : {
          lane: "Dispensary lane",
          openDemo: "Open demo script",
          heroTitle: "The dispensary should see stock, validation, and sale in one glance.",
          heroBody: "This POV exists to operate inventory and validate prescriptions without technical noise in the middle of retail.",
          focusEyebrow: "Catalog",
          focusTitle: "What matters is knowing what can be sold today.",
          focusBody: "Visible product, ready batch, and pending validation. Nothing else to start.",
          validationEyebrow: "Validations",
          validationTitle: "Which prescriptions are ready to become a sale.",
          liveEyebrow: "Live rail",
          liveTitle: "Consume a real prescription from this workspace.",
          liveBody: "The technical layer stays below. Operational clarity first. Real submit second.",
          activeDisp: "Active account",
          liveInventory: "Inventory",
          liveRx: "Prescriptions",
          liveBatches: "Batches",
          openWalletless: "Open wallet-less",
          advanced: "Technical bridge",
        };

  const inventory = buildInventory(locale, releasedBatches);
  const validations = buildValidations(locale, pendingPrescriptions);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f3ec] text-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(255,181,107,0.18),transparent_22%),radial-gradient(circle_at_86%_12%,rgba(119,205,157,0.16),transparent_22%),linear-gradient(180deg,#fbf7f1_0%,#f3ede3_40%,#eee6d8_100%)]" />
      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-stone-900/10 bg-white/80 px-4 py-3 shadow-[0_10px_34px_rgba(41,37,36,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-900 text-sm font-semibold text-amber-50">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-500">{ui.lane}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950">{copy.back}</Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950">{ui.openDemo}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-amber-800">{ui.openWalletless}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="dispensary" />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <article className="rounded-[2.9rem] border border-stone-900/10 bg-[linear-gradient(145deg,#241206,#563111_44%,#faf2e5_100%)] p-7 shadow-[0_32px_120px_rgba(41,37,36,0.14)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-50">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              {copy.heroStatus}
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-amber-100/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl">{ui.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-100/88">{ui.heroBody}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <HeroPill label={ui.activeDisp} value={selectedDispensary ? shortValue(selectedDispensary.account) : "--"} />
              <HeroPill label={ui.liveInventory} value={String(inventory.length)} />
              <HeroPill label={ui.liveRx} value={String(validations.length)} />
              <HeroPill label={ui.liveBatches} value={String(releasedBatches.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/88 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{ui.focusEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-stone-950">{ui.focusTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{ui.focusBody}</p>
              <div className="mt-6 grid gap-3">
                {inventory.map((item) => (
                  <SimpleRow key={item.id} label={item.price} title={item.name} body={item.note} />
                ))}
              </div>
            </article>
            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/88 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
              <ActorEntryMode actor="dispensary" locale={locale} demoHref="#validation" />
              <div className="mt-6">
                <ActorNav current="dispensary" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="validation" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/88 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-700">{ui.validationEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{ui.validationTitle}</h2>
            <div className="mt-6 grid gap-4">
              {validations.map((item) => (
                <article key={item.id} className="rounded-[1.8rem] border border-stone-900/10 bg-[#f7fbff] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-sky-700">{item.status}</p>
                      <h3 className="mt-3 font-display text-[2rem] text-stone-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">{item.note}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-stone-900/10 bg-[linear-gradient(180deg,#160e08,#24160c_42%,#2c1a0d_100%)] p-6 shadow-[0_22px_70px_rgba(41,37,36,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{ui.liveEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.92] text-stone-50">{ui.liveTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">{ui.liveBody}</p>

            <DispensaryConsumeSubmit
              locale={locale}
              initialCaller={dispensaryActionPack.dispensaryAccount}
              initialCommitment={dispensaryActionPack.payload.commitment}
              initialProof={dispensaryActionPack.payload.proof}
              initialPublicInputsHash={dispensaryActionPack.payload.publicInputsHash}
              initialCurrentDay={dispensaryActionPack.payload.currentDay}
              submitReady={dispensarySubmitConfig.enabled}
              submitMode={dispensarySubmitConfig.mode}
            />

            <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{ui.advanced}</p>
              <ActionBridgeTools
                locale={locale}
                command={dispensaryActionPack.scriptCommand}
                payloadBase64={dispensaryActionPack.payloadBase64}
                apiPath="/api/trustleaf/actor-bridges/dispensary"
              />
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function buildInventory(locale: Locale, batches: IndexedState["batches"]): InventoryItem[] {
  const live = batches.slice(0, 2).map((batch, index) => ({
    id: batch.id,
    name: index === 0 ? "Andes Calm 10:10" : locale === "es" ? "Extracto Balance" : "Balance Extract",
    note: locale === "es" ? `Lote ${batch.status} y laboratorio visible.` : `Batch ${batch.status} with visible lab evidence.`,
    price: index === 0 ? "$42" : "$36",
  }));
  const preview = locale === "es"
    ? [{ id: "preview", name: "Night Relief", note: "Vista mockup para retail y pickup.", price: "$39" }]
    : [{ id: "preview", name: "Night Relief", note: "Mockup retail and pickup view.", price: "$39" }];
  return [...live, ...preview].slice(0, 3);
}

function buildValidations(locale: Locale, prescriptions: IndexedState["prescriptions"]): ValidationItem[] {
  const live = prescriptions.slice(0, 2).map((prescription) => ({
    id: prescription.id,
    title: shortHash(prescription.id),
    note: locale === "es" ? "Receta lista para validacion y consume." : "Prescription ready for validation and consume.",
    status: locale === "es" ? "Waiting review" : "Waiting review",
  }));
  const preview = locale === "es"
    ? [{ id: "preview", title: "Preview flow", note: "Mockup de validacion para la demo comercial.", status: "Preview" }]
    : [{ id: "preview", title: "Preview flow", note: "Validation mockup for the commercial demo.", status: "Preview" }];
  return [...live, ...preview].slice(0, 3);
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.8rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-200/70">{label}</p>
      <p className="font-display mt-3 text-[2.2rem] leading-none text-white">{value}</p>
    </article>
  );
}

function SimpleRow({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="rounded-[1.4rem] border border-stone-900/10 bg-[#faf6ef] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 font-display text-2xl text-stone-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{body}</p>
    </article>
  );
}

function shortValue(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function shortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}
