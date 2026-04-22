import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { getDispensaryPageCopy } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import { getTrustLeafDispensaryActionPack } from "../lib/trustleaf/actionRails";
import { getIndexedState } from "../lib/trustleaf/indexedState";

export default async function DispensaryPage() {
  const locale = await getLocale();
  const copy = getDispensaryPageCopy(locale);
  const indexedState = await getIndexedState();

  const dispensaryMemberships = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DISP"),
  );
  const selectedDispensary = dispensaryMemberships[0] ?? null;
  const pendingPrescriptions = indexedState.prescriptions.filter((prescription) => !prescription.isUsed);
  const releasedBatches = indexedState.batches.filter((batch) =>
    batch.status.toLowerCase().includes("released"),
  );
  const inventoryCards = buildInventoryCards(locale, indexedState.batches, selectedDispensary?.account ?? null);
  const salesHistory = indexedState.prescriptionConsumptions.slice(0, 4);
  const dispensaryActionPack = await getTrustLeafDispensaryActionPack(
    selectedDispensary?.account ?? null,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f3ec] text-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(255,181,107,0.18),transparent_22%),radial-gradient(circle_at_86%_12%,rgba(119,205,157,0.16),transparent_22%),linear-gradient(180deg,#fbf7f1_0%,#f3ede3_40%,#eee6d8_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:py-10">
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
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950"
              >
                {copy.back}
              </Link>
              <Link
                href="/superadmin"
                className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950"
              >
                {copy.openSuperadmin}
              </Link>
              <Link
                href="/command-center"
                className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950"
              >
                {copy.openCommandCenter}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link
                href="/walletless"
                className="rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-amber-800"
              >
                {copy.finalCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[2.8rem] border border-stone-900/10 bg-[linear-gradient(135deg,rgba(44,24,12,0.98),rgba(99,62,24,0.92)_42%,rgba(250,244,236,0.96))] px-6 py-8 shadow-[0_28px_120px_rgba(41,37,36,0.14)] md:px-8 md:py-10 xl:px-10">
          <div className="grid gap-10 xl:grid-cols-[1fr_0.95fr] xl:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-50">
                <span className="h-2 w-2 rounded-full bg-amber-300 hero-pulse" />
                {copy.heroStatus}
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-amber-100/70">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-4xl text-6xl leading-[0.95] text-white md:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100/90">{copy.body}</p>

              <ActorNav current="dispensary" locale={locale} />
            </div>

            <aside className="grid gap-4 md:grid-cols-2">
              <HeroMetricCard label={copy.liveInventory} value={String(inventoryCards.length)} tone="amber" />
              <HeroMetricCard label={copy.pendingValidations} value={String(pendingPrescriptions.length)} tone="sky" />
              <HeroMetricCard label={copy.releasedBatches} value={String(releasedBatches.length)} tone="emerald" />
              <HeroMetricCard label={copy.verifiedSales} value={String(salesHistory.length)} tone="stone" />
            </aside>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.2rem] border border-stone-900/10 bg-white/80 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">{copy.inventoryEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.inventoryTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">{copy.inventoryBody}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {inventoryCards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-[1.9rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-amber-700">{card.format}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{card.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-stone-600">{card.description}</p>
                    </div>
                    <span className="rounded-full bg-amber-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-900">
                      {card.price}
                    </span>
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
          </div>

          <div className="rounded-[2.2rem] border border-sky-900/10 bg-[linear-gradient(180deg,rgba(245,250,255,0.96),rgba(232,242,255,0.92))] p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-700">{copy.validationEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.validationTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{copy.validationBody}</p>

            <div className="mt-6 grid gap-4">
              {pendingPrescriptions.slice(0, 3).map((prescription) => (
                <article
                  key={prescription.id}
                  className="rounded-[1.8rem] border border-sky-900/10 bg-white/80 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-sky-700">{copy.readyForCheckout}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{shortHash(prescription.id)}</h3>
                    </div>
                    <span className="rounded-full bg-sky-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-900">
                      {copy.waitingReview}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <InfoChip label={copy.doctor} value={shortValue(prescription.doctor)} />
                    <InfoChip label={copy.nullifier} value={shortHash(prescription.patientNullifier)} />
                    <InfoChip label={copy.commitment} value={shortHash(prescription.id)} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2.2rem] border border-stone-900/10 bg-white/80 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{copy.actionRailEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.actionRailTitle}</h2>
            <div className="mt-6 grid gap-4">
              {[copy.actionInventory, copy.actionValidation, copy.actionCheckout, copy.actionHistory].map((step, index) => (
                <article
                  key={step}
                  className="rounded-[1.7rem] border border-stone-900/10 bg-stone-950 px-5 py-5 text-stone-100"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-400">0{index + 1}</p>
                  <p className="mt-3 text-lg leading-8">{step}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(244,252,247,0.96),rgba(232,246,236,0.92))] p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{copy.salesEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.salesTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{copy.salesBody}</p>

            <div className="mt-6 grid gap-4">
              {salesHistory.map((receipt) => (
                <article
                  key={receipt.id}
                  className="rounded-[1.8rem] border border-emerald-900/10 bg-white/80 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{copy.receipt}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{receipt.id}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-900">
                      live
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoChip label={copy.caller} value={shortValue(receipt.caller)} />
                    <InfoChip label={copy.ledger} value={String(receipt.ledger)} />
                    <InfoChip label={copy.nullifier} value={shortHash(receipt.patientNullifier)} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.2rem] border border-sky-900/10 bg-[linear-gradient(180deg,rgba(243,248,255,0.96),rgba(232,240,252,0.92))] p-6 shadow-[0_18px_60px_rgba(41,37,36,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-700">
              {locale === "es" ? "Bridge testnet" : "Testnet bridge"}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {locale === "es"
                ? "Valida una receta real desde la cola del dispensario."
                : "Validate a real prescription from the dispensary queue."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">
              {locale === "es"
                ? "Este pack reutiliza el payload ZK reproducible y lo amarra a la cuenta activa del dispensario para cerrar el rail `verify_and_consume`."
                : "This pack reuses the reproducible ZK payload and binds it to the active dispensary account so you can close the `verify_and_consume` rail."}
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoChip
                label={locale === "es" ? "Cuenta dispensario" : "Dispensary account"}
                value={shortValue(dispensaryActionPack.dispensaryAccount)}
              />
              <InfoChip
                label={locale === "es" ? "Alias fuente" : "Source alias"}
                value={dispensaryActionPack.dispensaryAlias}
              />
              <InfoChip
                label={locale === "es" ? "Receta pendiente" : "Pending prescription"}
                value={
                  dispensaryActionPack.pendingPrescriptionId
                    ? shortHash(dispensaryActionPack.pendingPrescriptionId)
                    : locale === "es"
                      ? "Sin receta pendiente"
                      : "No pending prescription"
                }
              />
              <InfoChip
                label={locale === "es" ? "Match fixture" : "Fixture match"}
                value={
                  dispensaryActionPack.matchesPendingPrescription
                    ? locale === "es"
                      ? "Si, lista para replay"
                      : "Yes, ready for replay"
                    : locale === "es"
                      ? "No exacto, revisar payload"
                      : "Not exact, review payload"
                }
              />
            </div>

            <div className="mt-6 grid gap-3">
              <InfoChip
                label={locale === "es" ? "Commitment fixture" : "Fixture commitment"}
                value={dispensaryActionPack.fixtureCommitment}
              />
              <InfoChip
                label={locale === "es" ? "Script path" : "Script path"}
                value={dispensaryActionPack.scriptPath}
              />
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-stone-900/10 bg-stone-950 p-6 shadow-[0_18px_60px_rgba(41,37,36,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-400">
              {locale === "es" ? "Command pack" : "Command pack"}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-50">
              {locale === "es"
                ? "Comando listo para consumir la receta."
                : "Ready-to-run consume command."}
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-300">
              {locale === "es"
                ? "Esto conecta el POV del dispensario con el script live de testnet. Sirve para demos, dry-runs operativos y validacion manual mientras cerramos submit directo desde web."
                : "This connects the dispensary POV to the live testnet script. It works for demos, operational dry-runs, and manual validation while we finish direct web submission."}
            </p>

            <div className="mt-6 grid gap-3">
              <InfoChipDark
                label={locale === "es" ? "Payload base64" : "Payload base64"}
                value={dispensaryActionPack.payloadBase64}
              />
            </div>

            <pre className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-xs leading-6 text-stone-200">
              {dispensaryActionPack.scriptCommand}
            </pre>
            <ActionBridgeTools
              locale={locale}
              command={dispensaryActionPack.scriptCommand}
              payloadBase64={dispensaryActionPack.payloadBase64}
              apiPath="/api/trustleaf/actor-bridges/dispensary"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function HeroMetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "emerald" | "sky" | "stone";
}) {
  const toneClass = {
    amber: "border-amber-200/20 bg-amber-200/10 text-amber-50",
    emerald: "border-emerald-200/20 bg-emerald-200/10 text-emerald-50",
    sky: "border-sky-200/20 bg-sky-200/10 text-sky-50",
    stone: "border-white/15 bg-white/10 text-stone-50",
  }[tone];

  return (
    <article className={`rounded-[1.8rem] border p-5 backdrop-blur ${toneClass}`}>
      <p className="text-sm leading-6 opacity-75">{label}</p>
      <p className="font-display mt-3 text-4xl leading-none">{value}</p>
    </article>
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
  locale: "en" | "es",
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
          {
            name: "Relief Day Drops",
            format: "Aceite sublingual",
            description: "Formato de control fino para pacientes que necesitan alivio funcional durante el dia.",
            stockState: "Disponible hoy",
            price: "USDC 28",
          },
          {
            name: "Rest Night Gummies",
            format: "Gummies nocturnas",
            description: "Presentacion orientada a descanso y continuidad de tratamiento con retiro rapido.",
            stockState: "Stock medio",
            price: "USDC 22",
          },
          {
            name: "Calm Inhale Cart",
            format: "Vape medicinal",
            description: "Opcion de accion rapida para pacientes que priorizan disponibilidad y verificacion de lote.",
            stockState: "Ultimas unidades",
            price: "USDC 34",
          },
        ]
      : [
          {
            name: "Relief Day Drops",
            format: "Sublingual oil",
            description: "Fine-control format for patients who need functional relief during the day.",
            stockState: "Available today",
            price: "USDC 28",
          },
          {
            name: "Rest Night Gummies",
            format: "Night gummies",
            description: "Format oriented to rest and treatment continuity with fast pickup.",
            stockState: "Medium stock",
            price: "USDC 22",
          },
          {
            name: "Calm Inhale Cart",
            format: "Medicinal vape",
            description: "Fast-acting option for patients prioritizing availability and verified batches.",
            stockState: "Last units",
            price: "USDC 34",
          },
        ];

  return concepts.map((concept, index) => {
    const batch = batches[index % Math.max(batches.length, 1)];
    return {
      id: `${concept.name}-${index}`,
      ...concept,
      batchStatus: batch?.status ?? "Pending",
      lab: batch?.lab ? shortValue(batch.lab) : "Pending lab",
      provenance: batch ? shortHash(batch.latestDocumentHash) : "Awaiting trail",
      dispensary: dispensaryAccount ? shortValue(dispensaryAccount) : "Trust Leaf partner",
    };
  });
}

function shortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}

function shortValue(value: string) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
