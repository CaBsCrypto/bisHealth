import Link from "next/link";

import { ActorLiveSession } from "../actor-live-session";
import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";
import type { getCommandCenterCopy, getPipelineSteps } from "../lib/i18n";
import type { getTrustLeafDispensaryActionPack, getTrustLeafDoctorActionPack, getTrustLeafPatientActionPack, getTrustLeafSuperAdminActionPack } from "../lib/trustleaf/actionRails";
import type { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import type { getIndexedState } from "../lib/trustleaf/indexedState";
import type { getTrustLeafLiveReadiness } from "../lib/trustleaf/liveReadiness";

type Locale = "en" | "es";
type CommandCopy = ReturnType<typeof getCommandCenterCopy>;
type PipelineSteps = ReturnType<typeof getPipelineSteps>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type Deployment = Awaited<ReturnType<typeof getTrustLeafDeployment>>;
type PatientActionPack = Awaited<ReturnType<typeof getTrustLeafPatientActionPack>>;
type DoctorActionPack = Awaited<ReturnType<typeof getTrustLeafDoctorActionPack>>;
type DispensaryActionPack = Awaited<ReturnType<typeof getTrustLeafDispensaryActionPack>>;
type SuperAdminActionPack = Awaited<ReturnType<typeof getTrustLeafSuperAdminActionPack>>;
type LiveReadiness = ReturnType<typeof getTrustLeafLiveReadiness>;

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
  liveReadiness,
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
  liveReadiness: LiveReadiness;
}) {
  const latestBatch = indexedState.batches[0] ?? null;
  const latestPrescription = indexedState.prescriptions[0] ?? null;
  const latestReceipt = indexedState.prescriptionConsumptions[0] ?? null;
  const liveContracts = deployment.contracts.filter((contract) => contract.status === "live");
  const opsCopy =
    locale === "es"
      ? {
          eyebrow: "Ops room",
          title: "Una sala de control corta, clara y util.",
          body: "Primero salud real del sistema. Despues, acceso directo a cada rail.",
          sessionEyebrow: "Sesion activa",
          sessionTitle: "El rail live ya puede seguirte entre pantallas.",
          sessionBody: "Si ya entraste con passkeys o Freighter, este tablero te lo deja visible antes de abrir rails protegidos o submits live.",
          actorStatus: "Estado del rail",
          actorRoute: "Abrir rail",
          actorApi: "Abrir API",
          ready: "listo",
          review: "revision",
          missing: "pendiente",
          liveReadinessEyebrow: "Readiness live",
          liveReadinessTitle: "Lo que realmente puede ejecutar hoy.",
          liveReadinessBody: "Sin rodeos. Si falta una key o un rail live, se ve aqui.",
          infraEyebrow: "Infra real",
          infraTitle: "Infra real, no promesas.",
          snapshotEyebrow: "Snapshot indexado",
          snapshotTitle: "El snapshot ya responde.",
          mode: "Modo",
          account: "Cuenta",
          profileStore: "Store de perfil",
          none: "ninguno",
        }
      : {
          eyebrow: "Ops room",
          title: "A shorter, clearer control room.",
          body: "Real system health first. Direct access to each rail second.",
          sessionEyebrow: "Active session",
          sessionTitle: "The live rail can now follow you across screens.",
          sessionBody: "If you already entered with passkeys or Freighter, this board keeps it visible before you open protected rails or live submits.",
          actorStatus: "Rail status",
          actorRoute: "Open rail",
          actorApi: "Open API",
          ready: "ready",
          review: "review",
          missing: "pending",
          liveReadinessEyebrow: "Live readiness",
          liveReadinessTitle: "What can actually execute today.",
          liveReadinessBody: "No narrative padding. If a key or live rail is missing, it shows here.",
          infraEyebrow: "Real infra",
          infraTitle: "Real infra, not promises.",
          snapshotEyebrow: "Indexed snapshot",
          snapshotTitle: "The snapshot already answers.",
          mode: "Mode",
          account: "Account",
          profileStore: "Profile store",
          none: "none",
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

        <section className="rounded-[2.8rem] border border-emerald-200/10 bg-[linear-gradient(145deg,#08140f,#0d2119_46%,#09140f)] p-8 shadow-[0_30px_110px_rgba(0,0,0,0.26)] md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">{opsCopy.eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.92] text-emerald-50 md:text-7xl">{opsCopy.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 md:text-base">{opsCopy.body}</p>
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
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{opsCopy.liveReadinessEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-stone-50">{opsCopy.liveReadinessTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300">{opsCopy.liveReadinessBody}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <ReadinessCard
                title="Sponsor"
                status={liveReadiness.sponsor.ready ? opsCopy.ready : opsCopy.missing}
                tone={liveReadiness.sponsor.ready ? "emerald" : "amber"}
                rows={[
                  { label: opsCopy.mode, value: liveReadiness.sponsor.mode },
                  { label: opsCopy.account, value: liveReadiness.sponsor.publicKey ?? opsCopy.missing },
                ]}
              />
              <ReadinessCard
                title="Passkeys"
                status={liveReadiness.passkeys.ready ? opsCopy.ready : opsCopy.review}
                tone={liveReadiness.passkeys.ready ? "emerald" : "violet"}
                rows={[
                  { label: opsCopy.mode, value: liveReadiness.passkeys.integrationMode },
                  { label: "Phase", value: String(liveReadiness.passkeys.backendPhase) },
                  { label: opsCopy.profileStore, value: liveReadiness.passkeys.profileStorage },
                ]}
              />
              <ReadinessCard
                title="Doctor"
                status={liveReadiness.doctor.ready ? opsCopy.ready : opsCopy.missing}
                tone={liveReadiness.doctor.ready ? "emerald" : "amber"}
                rows={[
                  { label: opsCopy.mode, value: liveReadiness.doctor.mode },
                  { label: opsCopy.account, value: liveReadiness.doctor.publicKey ?? opsCopy.missing },
                ]}
              />
              <ReadinessCard
                title="Dispensary"
                status={liveReadiness.dispensary.ready ? opsCopy.ready : opsCopy.missing}
                tone={liveReadiness.dispensary.ready ? "emerald" : "amber"}
                rows={[
                  { label: opsCopy.mode, value: liveReadiness.dispensary.mode },
                  { label: opsCopy.account, value: liveReadiness.dispensary.publicKey ?? opsCopy.missing },
                ]}
              />
              <ReadinessCard
                title="Superadmin"
                status={liveReadiness.superadmin.ready ? opsCopy.ready : opsCopy.missing}
                tone={liveReadiness.superadmin.ready ? "emerald" : "amber"}
                rows={[
                  { label: opsCopy.mode, value: liveReadiness.superadmin.mode },
                  { label: opsCopy.account, value: liveReadiness.superadmin.publicKey ?? opsCopy.missing },
                  {
                    label: "Passkey gaps",
                    value: liveReadiness.passkeys.missingPieces.slice(0, 2).join(", ") || opsCopy.none,
                  },
                ]}
              />
            </div>
          </article>

          <article className="rounded-[2.1rem] border border-white/8 bg-black/20 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)] xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{opsCopy.sessionEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl text-stone-50">{opsCopy.sessionTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300">{opsCopy.sessionBody}</p>
            <ActorLiveSession locale={locale} />
          </article>

          {actorCards.map((card) => (
            <article key={card.key} className="rounded-[2.1rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.16))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{card.title}</p>
                  <h2 className="mt-3 font-display text-3xl text-stone-50">{card.title}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${toneClass(card.tone)}`}>{card.status}</span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">{card.body}</p>
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
    <article className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{label}</p>
      <p className="mt-3 font-display text-[2.6rem] leading-none text-stone-50">{value}</p>
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

function ReadinessCard({
  title,
  status,
  tone,
  rows,
}: {
  title: string;
  status: string;
  tone: "amber" | "emerald" | "violet";
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <article className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.12))] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{title}</p>
          <h3 className="mt-3 text-xl text-stone-50">{title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${toneClass(tone)}`}>
          {status}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="rounded-[1rem] border border-white/8 bg-black/15 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">{row.label}</p>
            <p className="mt-2 break-all text-sm leading-6 text-stone-100">{row.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
