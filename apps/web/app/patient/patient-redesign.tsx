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

type DoctorProfile = {
  id: string;
  name: string;
  specialty: string;
  responseWindow: string;
  jurisdiction: string;
  account: string;
};

type InventoryCard = {
  id: string;
  name: string;
  description: string;
  batchStatus: string;
  lab: string;
  provenance: string;
  checkoutMode: string;
  dispensary: string;
};

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
  const inventoryCards = buildCatalogCards(locale, indexedState.batches, activeDispensaries);
  const presenterCommand = [
    "Patient handoff",
    `doctor=${patientActionPack.doctorRoute}`,
    `dispensary=${patientActionPack.dispensaryRoute}`,
    `walletless=${patientActionPack.walletlessRoute}`,
    `prescription=${patientActionPack.prescriptionId ?? "none"}`,
  ].join("\n");

  const ui =
    locale === "es"
      ? {
          lane: "Patient lane",
          openDemo: "Abrir demo script",
          openWalletless: "Abrir wallet-less",
          heroIntro: "El paciente deberia sentir una sola historia, no cuatro sistemas distintos.",
          heroSecondary: "Aqui descubre medicos, entiende el estado de su receta y ve dispensarios listos sin tocar complejidad interna.",
          routeCta: "Ver mi ruta",
          stockCta: "Explorar inventario",
          summaryEyebrow: "Resumen vivo",
          summaryTitle: "Lo importante sube primero.",
          summaryBody: "La experiencia empieza con tres certezas: a quien consultar, si la receta ya esta lista y donde comprar con confianza.",
          nextDoctor: "Doctor recomendado",
          nextDisp: "Dispensario listo",
          consultIntro: "Médicos verificados",
          consultTitle: "Elegir atencion deberia sentirse premium y simple.",
          consultBody: "Los perfiles visibles son los que realmente pueden operar en la red. El paciente solo necesita comparar disponibilidad, especialidad y jurisdiccion.",
          rxIntro: "Receta activa",
          rxTitle: "Una receta protegida, valida y lista para moverse contigo.",
          rxBody: "El estado medico sigue siendo privado, pero la red puede verificar lo necesario para abrir compra y seguimiento sin friccion.",
          inventoryIntro: "Dispensarios e inventario",
          inventoryTitle: "El paciente deberia poder mirar antes de salir de casa.",
          inventoryBody: "Cada card muestra el tipo de inventario esperado en produccion: readiness del lote, señal de laboratorio y modo de compra.",
          activateIntro: "Activar rail live",
          activateTitle: "Cuando quieras, entra con passkey o Freighter y convierte el mockup en sesion real.",
          activateBody: "La parte tecnica queda al final, donde corresponde. Primero producto. Luego activacion live.",
          liveBridge: "Bridge tecnico",
          liveBridgeBody: "Este bloque queda abajo para demos tecnicas, payloads o handoffs de frontend futuro.",
          readyForPickup: copy.readyForPickup,
          livePreview: "Live preview",
        }
      : {
          lane: "Patient lane",
          openDemo: "Open demo script",
          openWalletless: "Open wallet-less",
          heroIntro: "The patient should feel one story, not four disconnected systems.",
          heroSecondary: "Here they discover doctors, understand prescription state, and see ready dispensaries without touching internal complexity.",
          routeCta: "See my route",
          stockCta: "Explore inventory",
          summaryEyebrow: "Live summary",
          summaryTitle: "The important things surface first.",
          summaryBody: "The experience begins with three certainties: who to consult, whether the prescription is ready, and where to buy with confidence.",
          nextDoctor: "Recommended doctor",
          nextDisp: "Ready dispensary",
          consultIntro: "Verified doctors",
          consultTitle: "Choosing care should feel premium and simple.",
          consultBody: "Visible profiles are the ones that can actually operate on the network. The patient only needs to compare availability, specialty, and jurisdiction.",
          rxIntro: "Active prescription",
          rxTitle: "A protected prescription that stays valid and moves with you.",
          rxBody: "Medical state stays private, but the network can verify what is needed to unlock purchase and follow-up without friction.",
          inventoryIntro: "Dispensaries and inventory",
          inventoryTitle: "Patients should be able to look before leaving home.",
          inventoryBody: "Each card shows the kind of production inventory view we want: batch readiness, lab signal, and purchase mode.",
          activateIntro: "Activate live rail",
          activateTitle: "When you are ready, sign in with passkeys or Freighter and turn the mockup into a live session.",
          activateBody: "Technical detail stays at the end, where it belongs. Product first. Live activation second.",
          liveBridge: "Technical bridge",
          liveBridgeBody: "This block stays at the bottom for technical demos, payloads, or future frontend handoffs.",
          readyForPickup: copy.readyForPickup,
          livePreview: "Live preview",
        };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f3eee6] text-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(119,199,164,0.2),transparent_22%),radial-gradient(circle_at_88%_14%,rgba(236,182,94,0.16),transparent_18%),linear-gradient(180deg,#f7f2eb_0%,#efe7db_40%,#ece4d7_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-stone-900/10 bg-white/75 px-4 py-3 shadow-[0_12px_40px_rgba(32,26,20,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950 text-sm font-semibold text-emerald-50">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-500">{ui.lane}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950">{copy.back}</Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950">{ui.openDemo}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-900">{ui.openWalletless}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="patient" />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <article className="rounded-[3rem] border border-stone-900/10 bg-[linear-gradient(145deg,#173528,#234437_46%,#f3eadb_100%)] p-7 shadow-[0_30px_110px_rgba(32,26,20,0.14)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {copy.heroStatus}
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-emerald-100/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-white md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-100/88">{ui.heroIntro}</p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-stone-100/70">{ui.heroSecondary}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#care" className="rounded-full bg-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100">{ui.routeCta}</a>
              <a href="#inventory" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">{ui.stockCta}</a>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <HeroPill label={copy.activePrescription} value={activePrescription ? (activePrescription.isUsed ? copy.statusConsumed : copy.statusReady) : "--"} />
              <HeroPill label={copy.verifiedDoctors} value={String(activeDoctors.length)} />
              <HeroPill label={copy.verifiedDispensaries} value={String(activeDispensaries.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{ui.summaryEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-stone-950">{ui.summaryTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">{ui.summaryBody}</p>
              <div className="mt-6 grid gap-3">
                <SummaryRow label={copy.nextConsult} value={copy.nextConsultValue} />
                <SummaryRow label={ui.nextDoctor} value={doctorProfiles[0]?.name ?? "--"} />
                <SummaryRow label={ui.nextDisp} value={activeDispensaries[0] ? shortValue(activeDispensaries[0].account) : "--"} />
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-500">{ui.livePreview}</p>
              <ActorEntryMode actor="patient" locale={locale} demoHref="#care" />
              <div className="mt-6">
                <ActorNav current="patient" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="care" className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-white/82 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{ui.consultIntro}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{ui.consultTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">{ui.consultBody}</p>
            <div className="mt-6 grid gap-4">
              {doctorProfiles.map((doctor) => (
                <article key={doctor.id} className="rounded-[1.8rem] border border-stone-900/10 bg-[#faf6ef] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{copy.doctorRail}</p>
                      <h3 className="mt-3 font-display text-3xl text-stone-950">{doctor.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-stone-600">{doctor.specialty}</p>
                    </div>
                    <span className="rounded-full bg-emerald-900/8 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-900">{copy.doctorAvailable}</span>
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
            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">{ui.rxIntro}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{ui.rxTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{ui.rxBody}</p>

            <div className="mt-6 rounded-[1.9rem] border border-amber-900/10 bg-white/72 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-700">{copy.prescriptionLive}</p>
                  <h3 className="mt-3 font-display text-4xl text-stone-950">{activePrescription ? (activePrescription.isUsed ? copy.statusConsumed : copy.statusReady) : copy.waitingUse}</h3>
                </div>
                <span className="rounded-full bg-amber-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-950">{activePrescription && activePrescription.isUsed ? copy.statusConsumed : copy.statusReady}</span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <InfoChip label={copy.doctor} value={activePrescription ? shortValue(activePrescription.doctor) : "--"} />
                <InfoChip label={copy.issuanceLedger} value={activePrescription ? String(activePrescription.createdAtLedger) : "--"} />
                <InfoChip label={copy.nullifier} value={activePrescription ? shortHash(activePrescription.patientNullifier) : "--"} />
                <InfoChip label={copy.policy} value={activePrescription ? shortHash(activePrescription.policyHash) : "--"} />
              </div>
            </div>
          </article>
        </section>

        <section id="inventory" className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.3rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(24,31,28,0.98),rgba(18,23,20,0.98))] p-6 shadow-[0_22px_90px_rgba(20,18,16,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/70">{ui.inventoryIntro}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-50">{ui.inventoryTitle}</h2>
            <p className="mt-4 text-base leading-8 text-stone-300">{ui.inventoryBody}</p>
            <div className="mt-8 grid gap-5 xl:grid-cols-3">
              {inventoryCards.map((card) => (
                <article key={card.id} className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">{card.dispensary}</p>
                      <h3 className="mt-3 font-display text-4xl leading-tight text-stone-50">{card.name}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">{ui.readyForPickup}</span>
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
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{ui.activateIntro}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">{ui.activateTitle}</h2>
            <p className="mt-4 text-base leading-8 text-stone-600">{ui.activateBody}</p>

            <PatientJourneySubmit locale={locale} />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={patientActionPack.walletlessRoute} className="rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-900">{copy.finalCta}</Link>
              <Link href={patientActionPack.doctorRoute} className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5">{locale === "es" ? "Abrir medico" : "Open doctor"}</Link>
              <Link href={patientActionPack.dispensaryRoute} className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5">{locale === "es" ? "Abrir dispensario" : "Open dispensary"}</Link>
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-stone-900/10 bg-stone-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{ui.liveBridge}</p>
              <h3 className="mt-3 font-display text-3xl">{locale === "es" ? "Presenter rail" : "Presenter rail"}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-300">{ui.liveBridgeBody}</p>
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

function buildDoctorProfiles(locale: Locale, memberships: IndexedState["roleMemberships"]): DoctorProfile[] {
  const liveProfiles = memberships.map((membership, index) => ({
    id: membership.id,
    name: index === 0 ? "Dr. Andres Vera" : `${locale === "es" ? "Doctor" : "Doctor"} ${membership.account.slice(-4)}`,
    specialty:
      locale === "es"
        ? index === 0
          ? "Neurologia del dolor, cannabinoides y seguimiento longitudinal."
          : "Consulta regulada con emision de receta privada."
        : index === 0
          ? "Pain neurology, cannabinoid care, and longitudinal follow-up."
          : "Regulated consult flow with private prescription issuance.",
    responseWindow: locale === "es" ? "24 horas" : "24 hours",
    jurisdiction: locale === "es" ? "Chile / remoto" : "Chile / remote",
    account: membership.account,
  }));

  const previewProfiles: DoctorProfile[] =
    locale === "es"
      ? [
          {
            id: "preview-doctor-1",
            name: "Dra. Camila Rojas",
            specialty: "Dolor cronico, seguimiento de tratamientos y renovaciones digitales.",
            responseWindow: "48 horas",
            jurisdiction: "LatAm / remoto",
            account: "preview",
          },
        ]
      : [
          {
            id: "preview-doctor-1",
            name: "Dr. Camila Rojas",
            specialty: "Chronic pain, treatment follow-up, and digital renewals.",
            responseWindow: "48 hours",
            jurisdiction: "LatAm / remote",
            account: "preview",
          },
        ];

  return [...liveProfiles, ...previewProfiles].slice(0, 3);
}

function buildCatalogCards(
  locale: Locale,
  batches: IndexedState["batches"],
  dispensaries: IndexedState["roleMemberships"],
): InventoryCard[] {
  const batch = batches[0] ?? null;
  const dispensary = dispensaries[0]?.account ?? "--";

  const liveCard: InventoryCard = {
    id: batch?.id ?? "live-batch",
    name: locale === "es" ? "Andes Calm 10:10" : "Andes Calm 10:10",
    description:
      locale === "es"
        ? "Aceite medicinal con trazabilidad visible, laboratorio conectado y estado listo para validacion de receta."
        : "Medicinal oil with visible traceability, linked lab evidence, and readiness for prescription validation.",
    batchStatus: batch?.status ?? "Released",
    lab: batch?.lab ? shortValue(batch.lab) : "--",
    provenance: batch?.cultivator ? shortValue(batch.cultivator) : "--",
    checkoutMode: locale === "es" ? "Prescripcion + sponsor" : "Prescription + sponsor",
    dispensary: shortValue(dispensary),
  };

  const previewCard: InventoryCard = {
    id: "preview-batch",
    name: locale === "es" ? "Night Relief Capsules" : "Night Relief Capsules",
    description:
      locale === "es"
        ? "Vista mockup del catalogo ideal: disponibilidad, formulacion y lote antes de acercarse al punto de venta."
        : "Mockup view of the ideal catalog: availability, formulation, and batch status before visiting the retail point.",
    batchStatus: locale === "es" ? "Preview ready" : "Preview ready",
    lab: locale === "es" ? "Lab preview" : "Lab preview",
    provenance: locale === "es" ? "Trace preview" : "Trace preview",
    checkoutMode: locale === "es" ? "Mockup guided flow" : "Mockup guided flow",
    dispensary: locale === "es" ? "Patagonia Care" : "Patagonia Care",
  };

  return [liveCard, previewCard];
}

function shortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}

function shortValue(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

