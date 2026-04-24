import Link from "next/link";

import { ActorLiveSession } from "../actor-live-session";
import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";
import type { getCommandCenterCopy, getPipelineSteps } from "../lib/i18n";
import type { getTrustLeafDispensaryActionPack, getTrustLeafDoctorActionPack, getTrustLeafPatientActionPack, getTrustLeafSuperAdminActionPack } from "../lib/trustleaf/actionRails";
import type { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import type { getIndexedState } from "../lib/trustleaf/indexedState";

type Locale = "en" | "es";
type CommandCopy = ReturnType<typeof getCommandCenterCopy>;
type PipelineSteps = ReturnType<typeof getPipelineSteps>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type Deployment = Awaited<ReturnType<typeof getTrustLeafDeployment>>;
type PatientActionPack = Awaited<ReturnType<typeof getTrustLeafPatientActionPack>>;
type DoctorActionPack = Awaited<ReturnType<typeof getTrustLeafDoctorActionPack>>;
type DispensaryActionPack = Awaited<ReturnType<typeof getTrustLeafDispensaryActionPack>>;
type SuperAdminActionPack = Awaited<ReturnType<typeof getTrustLeafSuperAdminActionPack>>;

export function CommandCenterRedesign({
  locale,
  copy,
  pipelineSteps,
  indexedState,
  deployment,
  patientActionPack,
  doctorActionPack,
  dispensaryActionPack,
  superAdminActionPack,
}: {
  locale: Locale;
  copy: CommandCopy;
  pipelineSteps: PipelineSteps;
  indexedState: IndexedState;
  deployment: Deployment;
  patientActionPack: PatientActionPack;
  doctorActionPack: DoctorActionPack;
  dispensaryActionPack: DispensaryActionPack;
  superAdminActionPack: SuperAdminActionPack;
}) {
  const latestBatch = indexedState.batches[0] ?? null;
  const latestPrescription = indexedState.prescriptions[0] ?? null;
  const latestReceipt = indexedState.prescriptionConsumptions[0] ?? null;
  const liveContracts = deployment.contracts.filter((contract) => contract.status === "live");
  const opsCopy =
    locale === "es"
      ? {
          eyebrow: "Ops room",
          title: "Una sala de control mas clara para demo y operacion.",
          body: "Command center ya no intenta mostrarlo todo a la vez. Primero muestra salud del sistema. Luego deja abrir cada rail.",
          sessionEyebrow: "Sesion activa",
          sessionTitle: "El rail live ya puede seguirte entre pantallas.",
          sessionBody: "Si ya entraste con passkeys o Freighter, este tablero te lo deja visible antes de abrir rails protegidos o submits live.",
          actorStatus: "Estado del rail",
          actorRoute: "Abrir rail",
          actorApi: "Abrir API",
          ready: "listo",
          review: "revision",
          missing: "pendiente",
          infraEyebrow: "Infra real",
          infraTitle: "Lo que ya esta funcionando debajo del producto.",
          snapshotEyebrow: "Snapshot indexado",
          snapshotTitle: "La lectura rapida ya existe.",
        }
      : {
          eyebrow: "Ops room",
          title: "A clearer control room for demo and operations.",
          body: "Command center no longer tries to show everything at once. It starts with system health, then lets you open each rail.",
          sessionEyebrow: "Active session",
          sessionTitle: "The live rail can now follow you across screens.",
          sessionBody: "If you already entered with passkeys or Freighter, this board keeps it visible before you open protected rails or live submits.",
          actorStatus: "Rail status",
          actorRoute: "Open rail",
          actorApi: "Open API",
          ready: "ready",
          review: "review",
          missing: "pending",
          infraEyebrow: "Real infra",
          infraTitle: "What is already working under the product.",
          snapshotEyebrow: "Indexed snapshot",
          snapshotTitle: "Fast read models already exist.",
        };

  const actorCards = [
    {
      key: "patient",
      title: locale === "es" ? "Paciente" : "Patient",
      body:
        locale === "es"
          ? "La ruta del paciente ya entiende doctor, receta y dispensario sin leer complejidad blockchain."
          : "The patient route already understands doctor, prescription, and dispensary without reading blockchain complexity.",
      status:
        patientActionPack.prescriptionStatus === "ready"
          ? opsCopy.ready
          : patientActionPack.prescriptionStatus === "consumed"
            ? locale === "es"
              ? "consumida"
              : "consumed"
            : opsCopy.missing,
      href: "/patient",
      api: "/api/trustleaf/actor-bridges/patient",
      tone: "cyan",
    },
    {
      key: "doctor",
      title: locale === "es" ? "Medico" : "Doctor",
      body:
        locale === "es"
          ? "La emision de receta ya tiene rail real y submit desde web preparado."
          : "Prescription issuance already has a real rail and a prepared web submit.",
      status: opsCopy.ready,
      href: "/doctor",
      api: "/api/trustleaf/actor-bridges/doctor",
      tone: "emerald",
    },
    {
      key: "dispensary",
      title: locale === "es" ? "Dispensario" : "Dispensary",
      body:
        locale === "es"
          ? "El flujo de validacion y consume ya esta conectado a testnet."
          : "The validation and consume flow is already connected to testnet.",
      status: dispensaryActionPack.matchesPendingPrescription ? opsCopy.ready : opsCopy.review,
      href: "/dispensary",
      api: "/api/trustleaf/actor-bridges/dispensary",
      tone: "amber",
    },
    {
      key: "superadmin",
      title: locale === "es" ? "Superadmin" : "Superadmin",
      body:
        locale === "es"
          ? "RBAC, aprobaciones y gobierno operacional ya tienen bridge real."
          : "RBAC, approvals, and operational governance already have a real bridge.",
      status: opsCopy.ready,
      href: "/superadmin",
      api: "/api/trustleaf/actor-bridges/superadmin",
      tone: "violet",
    },
  ] as const;

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#07100d_0%,#091612_40%,#0d1f18_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>

        <PresentationStrip locale={locale} current="ops" dark />

        <section className="rounded-[2.6rem] border border-emerald-200/10 bg-[linear-gradient(145deg,#0b1511,#0f211a_48%,#0a1611)] p-8 shadow-[0_28px_100px_rgba(0,0,0,0.24)] md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">{opsCopy.eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.96] text-emerald-50 md:text-7xl">{copy.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-300 md:text-lg">{opsCopy.body}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <HeroPill label={copy.liveContracts} value={String(liveContracts.length)} />
              <HeroPill label={copy.eventsIndexed} value={String(indexedState.batchTimeline.length)} />
              <HeroPill label={copy.receipts} value={String(indexedState.prescriptionConsumptions.length)} />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2.1rem] border border-white/8 bg-black/20 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)] xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{opsCopy.sessionEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-stone-50">{opsCopy.sessionTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">{opsCopy.sessionBody}</p>
            <ActorLiveSession locale={locale} />
          </article>

          {actorCards.map((card) => (
            <article key={card.key} className="rounded-[2.1rem] border border-white/8 bg-black/20 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{card.title}</p>
                  <h2 className="mt-3 font-display text-4xl text-stone-50">{card.title}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${toneClass(card.tone)}`}>{card.status}</span>
              </div>
              <p className="mt-4 text-base leading-7 text-stone-300">{card.body}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={card.href} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  {opsCopy.actorRoute}
                </Link>
                <Link href={card.api} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  {opsCopy.actorApi}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <article className="rounded-[2.1rem] border border-white/8 bg-[#08131d]/88 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/70">{opsCopy.snapshotEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-cyan-50">{opsCopy.snapshotTitle}</h2>
            <div className="mt-6 grid gap-4">
              <MetricCard label={copy.batchProvenance} value={latestBatch?.status ?? copy.pending} />
              <MetricCard label={copy.prescription} value={latestPrescription ? shortHash(latestPrescription.id) : copy.pending} />
              <MetricCard label={copy.receipt} value={latestReceipt?.id ?? copy.pending} />
              <MetricCard label={copy.sourceAccount} value={deployment.sourceAccount ?? copy.pending} />
            </div>
          </article>

          <article className="rounded-[2.1rem] border border-white/8 bg-black/20 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">{opsCopy.infraEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-emerald-50">{opsCopy.infraTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {pipelineSteps.map((step) => (
                <article key={step.label} className="rounded-[1.6rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{step.state}</p>
                  <h3 className="mt-3 text-xl text-stone-50">{step.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-300">{step.detail}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/api/indexed-state" className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200">
                {copy.openJson}
              </Link>
              <Link href="/api/trustleaf/deployment" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/5">
                {copy.openDeploymentJson}
              </Link>
              <Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/5">
                {copy.back}
              </Link>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{label}</p>
      <p className="mt-3 font-display text-4xl leading-none text-stone-50">{value}</p>
    </article>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{label}</p>
      <p className="mt-3 break-all text-sm leading-6 text-stone-100">{value}</p>
    </article>
  );
}

function shortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}

function toneClass(tone: "amber" | "cyan" | "emerald" | "violet") {
  return {
    amber: "bg-amber-300/15 text-amber-100",
    cyan: "bg-cyan-300/15 text-cyan-100",
    emerald: "bg-emerald-300/15 text-emerald-100",
    violet: "bg-violet-300/15 text-violet-100",
  }[tone];
}
