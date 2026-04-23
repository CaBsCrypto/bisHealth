import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorEntryMode } from "../actor-entry-mode";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";
import type { getPatientPageCopy } from "../lib/i18n";
import type { getTrustLeafPatientActionPack } from "../lib/trustleaf/actionRails";
import type { getIndexedState } from "../lib/trustleaf/indexedState";
import { PatientJourneySubmit } from "./patient-journey-submit";

type Locale = "en" | "es";
type PatientCopy = ReturnType<typeof getPatientPageCopy>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type PatientActionPack = Awaited<ReturnType<typeof getTrustLeafPatientActionPack>>;

export function PatientRedesign({
  locale,
  copy,
  indexedState,
  patientActionPack,
}: {
  locale: Locale;
  copy: PatientCopy;
  indexedState: IndexedState;
  patientActionPack: PatientActionPack;
}) {
  const activeDoctors = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DOCTOR"),
  );
  const activeDispensaries = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DISP"),
  );
  const activePrescription =
    indexedState.prescriptions.find((prescription) => !prescription.isUsed) ??
    indexedState.prescriptions[0] ??
    null;
  const doctorProfiles = buildDoctorProfiles(locale, activeDoctors);
  const catalogCards = buildCatalogCards(locale, indexedState.batches, activeDispensaries);
  const presenterCommand = [
    "Patient handoff",
    `doctor=${patientActionPack.doctorRoute}`,
    `dispensary=${patientActionPack.dispensaryRoute}`,
    `walletless=${patientActionPack.walletlessRoute}`,
    `prescription=${patientActionPack.prescriptionId ?? "none"}`,
  ].join("\n");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe5] text-stone-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(125,204,169,0.18),transparent_22%),radial-gradient(circle_at_88%_12%,rgba(255,194,107,0.18),transparent_18%),linear-gradient(180deg,#f6f1e8_0%,#efe8dc_44%,#ebe4d8_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-stone-900/10 bg-white/72 px-4 py-3 shadow-[0_10px_40px_rgba(32,26,20,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-900 text-sm font-semibold text-emerald-50">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-500">Patient lane</p>
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
              <Link href="/walletless" className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800">
                {copy.finalCta}
              </Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="patient" />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-stone-900/10 bg-[linear-gradient(145deg,#173628,#214234_44%,#efe7db_100%)] p-7 shadow-[0_30px_110px_rgba(32,26,20,0.16)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {copy.heroStatus}
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-emerald-100/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100/90">{copy.body}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#patient-path" className="rounded-full bg-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100">
                {locale === "es" ? "Ver mi ruta" : "See my route"}
              </a>
              <a href="#inventory" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                {copy.reviewTrail}
              </a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <HeroPill label={copy.activePrescription} value={activePrescription ? (activePrescription.isUsed ? copy.statusConsumed : copy.statusReady) : "--"} />
              <HeroPill label={copy.verifiedDoctors} value={String(activeDoctors.length)} />
              <HeroPill label={copy.verifiedDispensaries} value={String(activeDispensaries.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{locale === "es" ? "Resumen del paciente" : "Patient summary"}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-stone-950">
                {locale === "es" ? "Lo esencial aparece primero." : "The essentials show up first."}
              </h2>
              <div className="mt-6 grid gap-3">
                <SummaryRow label={copy.nextConsult} value={copy.nextConsultValue} />
                <SummaryRow
                  label={locale === "es" ? "Doctor sugerido" : "Suggested doctor"}
                  value={doctorProfiles[0]?.name ?? "--"}
                />
                <SummaryRow
                  label={locale === "es" ? "Dispensario listo" : "Ready dispensary"}
                  value={activeDispensaries[0] ? shortValue(activeDispensaries[0].account) : "--"}
                />
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{locale === "es" ? "Modo de entrada" : "Entry mode"}</p>
              <ActorEntryMode actor="patient" locale={locale} demoHref="#patient-path" />
              <div className="mt-6">
                <ActorNav current="patient" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="patient-path" className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{copy.consultEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.consultTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">{copy.consultBody}</p>

            <div className="mt-6 grid gap-4">
              {doctorProfiles.map((doctor) => (
                <article key={doctor.id} className="rounded-[1.8rem] border border-stone-900/10 bg-[#faf6ef] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{copy.doctorRail}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{doctor.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-stone-600">{doctor.specialty}</p>
                    </div>
                    <span className="rounded-full bg-emerald-900/8 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-900">
                      {copy.doctorAvailable}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoChip label={copy.doctorResponse} value={doctor.responseWindow} />
                    <InfoChip label={copy.doctorJurisdiction} value={doctor.jurisdiction} />
                    <InfoChip label="Account" value={shortValue(doctor.account)} />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-amber-900/10 bg-[linear-gradient(180deg,rgba(255,251,244,0.96),rgba(250,241,222,0.92))] p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">{copy.prescriptionEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{copy.prescriptionTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{copy.prescriptionBody}</p>

            <div className="mt-6 rounded-[1.9rem] border border-amber-900/10 bg-white/72 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-700">{copy.prescriptionLive}</p>
                  <h3 className="mt-3 font-display text-4xl text-stone-950">
                    {activePrescription ? (activePrescription.isUsed ? copy.statusConsumed : copy.statusReady) : copy.waitingUse}
                  </h3>
                </div>
                <span className="rounded-full bg-amber-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-950">
                  {activePrescription && activePrescription.isUsed ? copy.statusConsumed : copy.statusReady}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <InfoChip label={copy.doctor} value={activePrescription ? shortValue(activePrescription.doctor) : "--"} />
                <InfoChip label={copy.issuanceLedger} value={activePrescription ? String(activePrescription.createdAtLedger) : "--"} />
                <InfoChip label={copy.nullifier} value={activePrescription ? shortHash(activePrescription.patientNullifier) : "--"} />
                <InfoChip label={copy.policy} value={activePrescription ? shortHash(activePrescription.policyHash) : "--"} />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {[copy.stepFind, copy.stepPrescription, copy.stepInventory, copy.stepSponsor].map((step, index) => (
                <article key={step} className="rounded-[1.5rem] border border-amber-900/10 bg-white/65 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-700">0{index + 1}</p>
                  <p className="mt-2 text-base leading-7 text-stone-800">{step}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section id="inventory" className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(24,31,28,0.98),rgba(18,23,20,0.98))] p-6 shadow-[0_22px_90px_rgba(20,18,16,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/70">{copy.inventoryEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-50">{copy.inventoryTitle}</h2>
            <p className="mt-4 text-base leading-8 text-stone-300">{copy.inventoryBody}</p>

            <div className="mt-8 grid gap-5 xl:grid-cols-3">
              {catalogCards.map((card) => (
                <article key={card.id} className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">{card.dispensary}</p>
                      <h3 className="mt-3 font-display text-4xl leading-tight text-stone-50">{card.name}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">
                      {copy.readyForPickup}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{card.description}</p>
                  <div className="mt-5 grid gap-3">
                    <InfoChipDark label={copy.batchStatus} value={card.batchStatus} />
                    <InfoChipDark label={copy.labVerified} value={card.lab} />
                    <InfoChipDark label={copy.provenance} value={card.provenance} />
                    <InfoChipDark label={copy.purchaseFlow} value={card.checkoutMode} />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{locale === "es" ? "Cerrar el recorrido" : "Close the journey"}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {locale === "es" ? "Cuando quieras, entra con passkey y activa el lane real." : "When you are ready, enter with a passkey and activate the real lane."}
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-600">
              {locale === "es"
                ? "El modo demo cuenta la historia completa. El rail wallet-less demuestra que la sesion protegida, el sponsor fee y el siguiente paso operativo ya existen."
                : "Demo mode tells the full story. The wallet-less rail proves that protected session handling, fee sponsorship, and the next operational step already exist."}
            </p>

            <PatientJourneySubmit locale={locale} />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={patientActionPack.walletlessRoute} className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800">
                {copy.finalCta}
              </Link>
              <Link href={patientActionPack.doctorRoute} className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5">
                {locale === "es" ? "Abrir medico" : "Open doctor"}
              </Link>
              <Link href={patientActionPack.dispensaryRoute} className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5">
                {locale === "es" ? "Abrir dispensario" : "Open dispensary"}
              </Link>
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-stone-900/10 bg-stone-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{locale === "es" ? "Presenter tools" : "Presenter tools"}</p>
              <h3 className="mt-3 font-display text-3xl">{locale === "es" ? "Bridge avanzado" : "Advanced bridge"}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                {locale === "es"
                  ? "Este bloque queda al final para quien quiera abrir el JSON, copiar el payload o mostrar el handoff tecnico."
                  : "This block stays at the end for anyone who wants to open the JSON, copy the payload, or show the technical handoff."}
              </p>
              <ActionBridgeTools
                locale={locale}
                command={presenterCommand}
                payloadBase64={Buffer.from(JSON.stringify(patientActionPack), "utf8").toString("base64")}
                apiPath="/api/trustleaf/actor-bridges/patient"
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

function buildDoctorProfiles(
  locale: Locale,
  memberships: Array<{ account: string; grantedAtLedger: number }>,
) {
  const seeds =
    locale === "es"
      ? [
          { name: "Dra. Valentina Rivera", specialty: "Dolor cronico y acompanamiento terapeutico", jurisdiction: "Chile", responseWindow: "< 2 h" },
          { name: "Dr. Tomas Andrade", specialty: "Neurologia funcional y seguimiento clinico", jurisdiction: "Argentina", responseWindow: "Hoy" },
          { name: "Dra. Camila Soto", specialty: "Sueno, ansiedad y medicina integrativa", jurisdiction: "Colombia", responseWindow: "< 24 h" },
        ]
      : [
          { name: "Dr. Valentina Rivera", specialty: "Chronic pain and therapeutic care", jurisdiction: "Chile", responseWindow: "< 2 h" },
          { name: "Dr. Tomas Andrade", specialty: "Functional neurology and clinical follow-up", jurisdiction: "Argentina", responseWindow: "Today" },
          { name: "Dr. Camila Soto", specialty: "Sleep, anxiety, and integrative medicine", jurisdiction: "Colombia", responseWindow: "< 24 h" },
        ];

  if (memberships.length === 0) {
    return seeds.map((seed, index) => ({
      id: `seed-${index}`,
      account: `pending-doctor-${index}`,
      ...seed,
    }));
  }

  return memberships.map((membership, index) => ({
    id: membership.account,
    account: membership.account,
    ...seeds[index % seeds.length],
  }));
}

function buildCatalogCards(
  locale: Locale,
  batches: Array<{
    id: string;
    status: string;
    lab: string | null;
    latestDocumentHash: string;
  }>,
  dispensaries: Array<{ account: string }>,
) {
  const concepts =
    locale === "es"
      ? [
          {
            name: "Balance Day Oil",
            description: "Microdosis pensada para alivio funcional durante el dia, con trazabilidad visible antes de la compra.",
            checkoutMode: "Receta validada + retiro asistido",
          },
          {
            name: "Night Relief Gummies",
            description: "Presentacion orientada a descanso y estabilidad nocturna, lista para reservar desde el rail del paciente.",
            checkoutMode: "Reserva + confirmacion del dispensario",
          },
          {
            name: "Calm Vapor Cartridge",
            description: "Formato rapido de comparar para pacientes que priorizan disponibilidad, laboratorio y procedencia.",
            checkoutMode: "Checkout patrocinado",
          },
        ]
      : [
          {
            name: "Balance Day Oil",
            description: "Micro-dose format aimed at daytime relief, with visible traceability before purchase.",
            checkoutMode: "Validated prescription + assisted pickup",
          },
          {
            name: "Night Relief Gummies",
            description: "Format oriented to rest and evening stability, ready to reserve from the patient rail.",
            checkoutMode: "Reservation + dispensary confirmation",
          },
          {
            name: "Calm Vapor Cartridge",
            description: "Fast-to-compare format for patients prioritizing availability, lab evidence, and provenance.",
            checkoutMode: "Sponsored checkout",
          },
        ];

  return concepts.map((concept, index) => {
    const batch = batches[index % Math.max(batches.length, 1)];
    const dispensary = dispensaries[index % Math.max(dispensaries.length, 1)];

    return {
      id: `${concept.name}-${index}`,
      name: concept.name,
      description: concept.description,
      batchStatus: batch?.status ?? "Pending",
      lab: batch?.lab ? shortValue(batch.lab) : "Pending lab",
      provenance: batch ? shortHash(batch.latestDocumentHash) : "Awaiting traceability",
      dispensary: dispensary ? shortValue(dispensary.account) : "Trust Leaf partner",
      checkoutMode: concept.checkoutMode,
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
