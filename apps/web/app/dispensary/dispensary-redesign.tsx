import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorEntryMode } from "../actor-entry-mode";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
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
  const inventoryCards = buildInventoryCards(locale, indexedState.batches, selectedDispensary?.account ?? null);
  const salesHistory = indexedState.prescriptionConsumptions.slice(0, 4);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f3ec] text-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(255,181,107,0.18),transparent_22%),radial-gradient(circle_at_86%_12%,rgba(119,205,157,0.16),transparent_22%),linear-gradient(180deg,#fbf7f1_0%,#f3ede3_40%,#eee6d8_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-stone-900/10 bg-white/80 px-4 py-3 shadow-[0_10px_34px_rgba(41,37,36,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-900 text-sm font-semibold text-amber-50">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-500">Dispensary lane</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950">
                {copy.back}
              </Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950">
                {locale === "es" ? "Abrir demo script" : "Open demo script"}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-amber-800">
                {copy.finalCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-stone-900/10 bg-[linear-gradient(145deg,#2f1c0d,#5f3918_44%,#f9f2e7_100%)] p-7 shadow-[0_30px_110px_rgba(41,37,36,0.14)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-50">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              {copy.heroStatus}
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-amber-100/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100/90">{copy.body}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <HeroPill label={copy.liveInventory} value={String(inventoryCards.length)} />
              <HeroPill label={copy.pendingValidations} value={String(pendingPrescriptions.length)} />
              <HeroPill label={copy.releasedBatches} value={String(releasedBatches.length)} />
              <HeroPill label={copy.verifiedSales} value={String(salesHistory.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{locale === "es" ? "Resumen comercial" : "Commercial summary"}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-stone-950">
                {locale === "es" ? "Catalogo claro. Validacion visible. Checkout confiable." : "Clear catalog. Visible validation. Trusted checkout."}
              </h2>
              <div className="mt-6 grid gap-3">
                <SummaryRow label={locale === "es" ? "Cuenta activa" : "Active account"} value={selectedDispensary ? shortValue(selectedDispensary.account) : "--"} />
                <SummaryRow label={locale === "es" ? "Receta pendiente" : "Pending prescription"} value={dispensaryActionPack.pendingPrescriptionId ? shortHash(dispensaryActionPack.pendingPrescriptionId) : "--"} />
                <SummaryRow label={locale === "es" ? "Receipt reciente" : "Recent receipt"} value={salesHistory[0]?.id ?? "--"} />
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
              <ActorEntryMode actor="dispensary" locale={locale} demoHref="#dispensary-flow" />
              <div className="mt-6">
                <ActorNav current="dispensary" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="dispensary-flow" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">{copy.inventoryEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.inventoryTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">{copy.inventoryBody}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {inventoryCards.map((card) => (
                <article key={card.id} className="rounded-[1.8rem] border border-stone-900/10 bg-[#faf6ef] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-amber-700">{card.format}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{card.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-stone-600">{card.description}</p>
                    </div>
                    <span className="rounded-full bg-amber-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-900">{card.price}</span>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <InfoChip label={copy.batchStatus} value={card.batchStatus} />
                    <InfoChip label={copy.lab} value={card.lab} />
                    <InfoChip label={copy.provenance} value={card.provenance} />
                    <InfoChip label={copy.stockState} value={card.stockState} />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-sky-900/10 bg-[linear-gradient(180deg,rgba(245,250,255,0.96),rgba(232,242,255,0.92))] p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-700">{copy.validationEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.validationTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{copy.validationBody}</p>

            <div className="mt-6 grid gap-4">
              {pendingPrescriptions.slice(0, 3).map((prescription) => (
                <article key={prescription.id} className="rounded-[1.8rem] border border-sky-900/10 bg-white/80 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-sky-700">{copy.readyForCheckout}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{shortHash(prescription.id)}</h3>
                    </div>
                    <span className="rounded-full bg-sky-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-900">{copy.waitingReview}</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoChip label={copy.doctor} value={shortValue(prescription.doctor)} />
                    <InfoChip label={copy.nullifier} value={shortHash(prescription.patientNullifier)} />
                    <InfoChip label={copy.commitment} value={shortHash(prescription.id)} />
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{copy.salesEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.salesTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{copy.salesBody}</p>

            <div className="mt-6 grid gap-4">
              {salesHistory.map((receipt) => (
                <article key={receipt.id} className="rounded-[1.8rem] border border-emerald-900/10 bg-[#f4faf6] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{copy.receipt}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{receipt.id}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-900">live</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoChip label={copy.caller} value={shortValue(receipt.caller)} />
                    <InfoChip label={copy.ledger} value={String(receipt.ledger)} />
                    <InfoChip label={copy.nullifier} value={shortHash(receipt.patientNullifier)} />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-stone-900/10 bg-stone-950 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-400">{locale === "es" ? "Live rail" : "Live rail"}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-50">
              {locale === "es" ? "Validar y consumir una receta real." : "Validate and consume a real prescription."}
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-300">
              {locale === "es"
                ? "Este rail deja al dispensario muy cerca del submit real desde web y sigue funcionando como bridge de presentacion mientras afinamos el ultimo tramo."
                : "This rail brings the dispensary very close to direct web submission and still works as a presentation bridge while we finish the last stretch."}
            </p>

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

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoChipDark label={locale === "es" ? "Cuenta activa" : "Active account"} value={shortValue(dispensaryActionPack.dispensaryAccount)} />
              <InfoChipDark label={locale === "es" ? "Alias fuente" : "Source alias"} value={dispensaryActionPack.dispensaryAlias} />
              <InfoChipDark label={locale === "es" ? "Fixture match" : "Fixture match"} value={dispensaryActionPack.matchesPendingPrescription ? "ready" : "review"} />
              <InfoChipDark label={locale === "es" ? "Payload base64" : "Payload base64"} value={dispensaryActionPack.payloadBase64} />
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{locale === "es" ? "Bridge avanzado" : "Advanced bridge"}</p>
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

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-200/70">{label}</p>
      <p className="font-display mt-3 text-3xl leading-none text-white">{value}</p>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-stone-900/10 bg-[#faf6ef] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-stone-900">{value}</p>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-stone-900/10 bg-stone-900/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-stone-900">{value}</p>
    </div>
  );
}

function InfoChipDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-black/15 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-stone-100">{value}</p>
    </div>
  );
}

function buildInventoryCards(
  locale: Locale,
  batches: Array<{
    id: string;
    status: string;
    lab: string | null;
    latestDocumentHash: string;
  }>,
  dispensaryAccount: string | null,
) {
  const concepts =
    locale === "es"
      ? [
          { name: "Relief Day Drops", format: "Aceite sublingual", description: "Formato de control fino para pacientes que necesitan alivio funcional durante el dia.", stockState: "Disponible hoy", price: "USDC 28" },
          { name: "Rest Night Gummies", format: "Gummies nocturnas", description: "Presentacion orientada a descanso y continuidad de tratamiento con retiro rapido.", stockState: "Stock medio", price: "USDC 22" },
          { name: "Calm Inhale Cart", format: "Vape medicinal", description: "Opcion de accion rapida para pacientes que priorizan disponibilidad y verificacion de lote.", stockState: "Ultimas unidades", price: "USDC 34" },
        ]
      : [
          { name: "Relief Day Drops", format: "Sublingual oil", description: "Fine-control format for patients who need functional relief during the day.", stockState: "Available today", price: "USDC 28" },
          { name: "Rest Night Gummies", format: "Night gummies", description: "Format oriented to rest and treatment continuity with fast pickup.", stockState: "Medium stock", price: "USDC 22" },
          { name: "Calm Inhale Cart", format: "Medical vape", description: "Fast-acting option for patients prioritizing availability and batch verification.", stockState: "Last units", price: "USDC 34" },
        ];

  return concepts.map((concept, index) => {
    const batch = batches[index % Math.max(batches.length, 1)];
    return {
      id: `${concept.name}-${index}`,
      ...concept,
      batchStatus: batch?.status ?? "Pending",
      lab: batch?.lab ? shortValue(batch.lab) : locale === "es" ? "Lab pendiente" : "Pending lab",
      provenance: batch ? shortHash(batch.latestDocumentHash) : locale === "es" ? "Esperando trazabilidad" : "Awaiting traceability",
      dispensary: dispensaryAccount ? shortValue(dispensaryAccount) : "Trust Leaf partner",
    };
  });
}

function shortValue(value: string) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function shortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}
