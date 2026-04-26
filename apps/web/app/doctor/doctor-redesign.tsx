import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorEntryMode } from "../actor-entry-mode";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";
import type { getDoctorPageCopy } from "../lib/i18n";
import type { getTrustLeafDoctorActionPack } from "../lib/trustleaf/actionRails";
import type { getTrustLeafDoctorSubmitConfig } from "../lib/trustleaf/doctorIssue";
import type { getIndexedState } from "../lib/trustleaf/indexedState";
import { DoctorIssueSubmit } from "./doctor-issue-submit";

type Locale = "en" | "es";
type DoctorCopy = ReturnType<typeof getDoctorPageCopy>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type DoctorActionPack = Awaited<ReturnType<typeof getTrustLeafDoctorActionPack>>;
type DoctorSubmitConfig = ReturnType<typeof getTrustLeafDoctorSubmitConfig>;

export function DoctorRedesign({
  locale,
  copy,
  indexedState,
  doctorActionPack,
  doctorSubmitConfig,
}: {
  locale: Locale;
  copy: DoctorCopy;
  indexedState: IndexedState;
  doctorActionPack: DoctorActionPack;
  doctorSubmitConfig: DoctorSubmitConfig;
}) {
  const doctorMemberships = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DOCTOR"),
  );
  const selectedDoctor = doctorMemberships[0] ?? null;
  const doctorPrescriptions = selectedDoctor
    ? indexedState.prescriptions.filter((prescription) => prescription.doctor === selectedDoctor.account)
    : indexedState.prescriptions;
  const consumedReceipts = indexedState.prescriptionConsumptions.slice(0, 3);
  const patientRoster = buildPatientRoster(locale, doctorPrescriptions);
  const consultSchedule = buildConsultSchedule(locale, selectedDoctor?.account ?? null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f2f6fb] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(123,192,255,0.18),transparent_22%),radial-gradient(circle_at_88%_10%,rgba(107,224,197,0.18),transparent_22%),linear-gradient(180deg,#f5f9fd_0%,#edf3fa_42%,#e9f0f9_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-3 shadow-[0_10px_34px_rgba(15,23,42,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-950 text-sm font-semibold text-sky-50">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-slate-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Doctor lane</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950">
                {copy.back}
              </Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950">
                {locale === "es" ? "Abrir demo script" : "Open demo script"}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-sky-950 px-5 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-900">
                {copy.finalCta}
              </Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="doctor" />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <article className="rounded-[2.9rem] border border-slate-900/10 bg-[linear-gradient(145deg,#071b31,#0f3552_42%,#edf5fb_100%)] p-7 shadow-[0_32px_120px_rgba(15,23,42,0.14)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-sky-50">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              {copy.heroStatus}
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-sky-100/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl">{copy.title}</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-100/90 md:text-base">{copy.body}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <HeroPill label={copy.activePatients} value={String(patientRoster.length)} />
              <HeroPill label={copy.activePrescriptions} value={String(doctorPrescriptions.filter((prescription) => !prescription.isUsed).length)} />
              <HeroPill label={copy.upcomingConsults} value={String(consultSchedule.length)} />
              <HeroPill label={copy.liveReceipts} value={String(consumedReceipts.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,250,255,0.9))] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{locale === "es" ? "Resumen del dia" : "Day summary"}</p>
              <h2 className="font-display mt-4 text-3xl leading-tight text-slate-950">
                {locale === "es" ? "La operacion clinica deberia sentirse limpia." : "Clinical operations should feel clean."}
              </h2>
              <div className="mt-6 grid gap-3">
                <SummaryRow label={copy.morningWindow} value={copy.morningValue} />
                <SummaryRow label={locale === "es" ? "Cuenta activa" : "Active account"} value={selectedDoctor ? shortValue(selectedDoctor.account) : "--"} />
                <SummaryRow label={locale === "es" ? "Proxima prioridad" : "Next priority"} value={patientRoster[0]?.name ?? "--"} />
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,250,255,0.9))] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <ActorEntryMode actor="doctor" locale={locale} demoHref="#doctor-flow" />
              <div className="mt-6">
                <ActorNav current="doctor" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="doctor-flow" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2.3rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,248,252,0.94))] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-700">{copy.scheduleEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">{copy.scheduleTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">{copy.scheduleBody}</p>

            <div className="mt-6 grid gap-4">
              {consultSchedule.map((consult) => (
                <article key={consult.id} className="rounded-[1.8rem] border border-slate-900/10 bg-[linear-gradient(180deg,#f7fbff,#eef5fb)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-sky-700">{consult.time}</p>
                      <h3 className="mt-3 font-display text-[2rem] text-slate-950">{consult.patientName}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{consult.reason}</p>
                    </div>
                    <span className="rounded-full bg-sky-950/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-950">{copy.scheduleStatus}</span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoChip label={copy.nextReview} value={consult.nextWindow} />
                    <InfoChip label="Mode" value={consult.mode} />
                    <InfoChip label={copy.doctorAccount} value={shortValue(consult.doctorAccount)} />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(248,254,251,0.96),rgba(236,248,242,0.95))] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{copy.patientRosterEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">{copy.patientRosterTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-700">{copy.patientRosterBody}</p>

            <div className="mt-6 grid gap-4">
              {patientRoster.map((patient) => (
                <article key={patient.id} className="rounded-[1.8rem] border border-emerald-900/10 bg-white/88 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{patient.tag}</p>
                      <h3 className="mt-3 font-display text-[2rem] text-slate-950">{patient.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{patient.context}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${patient.priority === "high" ? "bg-amber-900/10 text-amber-900" : "bg-emerald-900/10 text-emerald-900"}`}>
                      {patient.priority === "high" ? copy.priorityHigh : copy.priorityNormal}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <InfoChip label={copy.lastVisit} value={patient.lastVisit} />
                    <InfoChip label={copy.nextReview} value={patient.nextReview} />
                    <InfoChip label={copy.renewalState} value={patient.renewalState} />
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.3rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(244,248,252,0.94))] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{copy.actionRailEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">{copy.actionRailTitle}</h2>
            <div className="mt-6 grid gap-4">
              {[copy.actionConsult, copy.actionPrescription, copy.actionRenewal, copy.actionPatient].map((step, index) => (
                <article key={step} className="rounded-[1.7rem] border border-slate-900/10 bg-[linear-gradient(180deg,#08131f,#0d1b29)] px-5 py-5 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">0{index + 1}</p>
                  <p className="mt-3 text-lg leading-8">{step}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-slate-900/10 bg-[#f4f8fc] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{locale === "es" ? "Vista de emision" : "Issuance view"}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoChip label={copy.doctorAccount} value={shortValue(doctorActionPack.doctorAccount)} />
                <InfoChip label={locale === "es" ? "Alias fuente" : "Source alias"} value={doctorActionPack.doctorAlias} />
                <InfoChip label={locale === "es" ? "Paciente sugerido" : "Suggested patient"} value={doctorActionPack.suggestedPatientLabel} />
                <InfoChip label={locale === "es" ? "Contrato ZK" : "ZK contract"} value={shortValue(doctorActionPack.contractId ?? "pending")} />
              </div>
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-slate-900/10 bg-[linear-gradient(180deg,#061018,#0b1622_42%,#101b29_100%)] p-6 shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{locale === "es" ? "Live rail" : "Live rail"}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.92] text-slate-50">
              {locale === "es" ? "Emitir receta real desde este POV." : "Issue a real prescription from this POV."}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              {locale === "es"
                ? "El submit real ya esta montado. Si faltan secrets, la experiencia sigue sirviendo como preview operativo."
                : "The real submit rail is already mounted. If secrets are still missing, the experience still works as an operational preview."}
            </p>

            <DoctorIssueSubmit
              locale={locale}
              initialDoctor={doctorActionPack.doctorAccount}
              initialCommitment={doctorActionPack.suggestedCommitment}
              initialPatientNullifier={doctorActionPack.suggestedPatientNullifier}
              initialPolicyHash={doctorActionPack.suggestedPolicyHash}
              submitReady={doctorSubmitConfig.enabled}
              submitMode={doctorSubmitConfig.mode}
            />

            <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{locale === "es" ? "Bridge avanzado" : "Advanced bridge"}</p>
              <ActionBridgeTools
                locale={locale}
                command={doctorActionPack.scriptCommand}
                payloadBase64={doctorActionPack.payloadBase64}
                apiPath="/api/trustleaf/actor-bridges/doctor"
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
    <article className="rounded-[1.8rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/70">{label}</p>
      <p className="font-display mt-3 text-[2.6rem] leading-none text-white">{value}</p>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-900/10 bg-[#f4f8fc] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-900">{value}</p>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-slate-900/10 bg-slate-900/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-slate-900">{value}</p>
    </div>
  );
}

function buildConsultSchedule(locale: Locale, doctorAccount: string | null) {
  return locale === "es"
    ? [
        { id: "consult-1", time: "09:30", patientName: "Marina P.", reason: "Reevaluacion de dolor cronico y ajuste de formulacion.", nextWindow: "Hoy 11:00", mode: "Video", doctorAccount: doctorAccount ?? "doctor-live" },
        { id: "consult-2", time: "12:15", patientName: "Josefina R.", reason: "Renovacion de receta y seguimiento de tolerancia nocturna.", nextWindow: "Hoy 14:00", mode: "Presencial", doctorAccount: doctorAccount ?? "doctor-live" },
        { id: "consult-3", time: "16:40", patientName: "Daniel C.", reason: "Primera consulta para onboarding terapeutico y education rail.", nextWindow: "Manana 09:00", mode: "Video", doctorAccount: doctorAccount ?? "doctor-live" },
      ]
    : [
        { id: "consult-1", time: "09:30", patientName: "Marina P.", reason: "Chronic pain re-evaluation and formulation adjustment.", nextWindow: "Today 11:00", mode: "Video", doctorAccount: doctorAccount ?? "doctor-live" },
        { id: "consult-2", time: "12:15", patientName: "Josefina R.", reason: "Prescription renewal and night tolerance follow-up.", nextWindow: "Today 14:00", mode: "In-person", doctorAccount: doctorAccount ?? "doctor-live" },
        { id: "consult-3", time: "16:40", patientName: "Daniel C.", reason: "First consult for therapeutic onboarding and education rail.", nextWindow: "Tomorrow 09:00", mode: "Video", doctorAccount: doctorAccount ?? "doctor-live" },
      ];
}

function buildPatientRoster(
  locale: Locale,
  doctorPrescriptions: Array<{
    id: string;
    isUsed: boolean;
    createdAtLedger: number;
  }>,
) {
  const seeds =
    locale === "es"
      ? [
          { name: "Marina P.", context: "Control funcional para dolor persistente.", lastVisit: "Hace 7 dias", nextReview: "Hoy", renewalState: "Lista para emitir", priority: "normal" as const, tag: "Seguimiento" },
          { name: "Josefina R.", context: "Renovacion de formula nocturna y tolerancia.", lastVisit: "Hace 14 dias", nextReview: "48 h", renewalState: "Renovacion prioritaria", priority: "high" as const, tag: "Renovacion" },
          { name: "Daniel C.", context: "Ingreso a primera receta con onboarding guiado.", lastVisit: "Nuevo", nextReview: "72 h", renewalState: "Primera emision", priority: "normal" as const, tag: "Nuevo paciente" },
        ]
      : [
          { name: "Marina P.", context: "Functional control for persistent pain.", lastVisit: "7 days ago", nextReview: "Today", renewalState: "Ready to issue", priority: "normal" as const, tag: "Follow-up" },
          { name: "Josefina R.", context: "Night formula renewal and tolerance follow-up.", lastVisit: "14 days ago", nextReview: "48 h", renewalState: "Priority renewal", priority: "high" as const, tag: "Renewal" },
          { name: "Daniel C.", context: "First prescription onboarding with guided intake.", lastVisit: "New", nextReview: "72 h", renewalState: "First issuance", priority: "normal" as const, tag: "New patient" },
        ];

  if (doctorPrescriptions.length === 0) {
    return seeds.map((seed, index) => ({ id: `seed-${index}`, ...seed }));
  }

  return doctorPrescriptions.slice(0, 3).map((prescription, index) => ({
    id: prescription.id,
    ...seeds[index % seeds.length],
  }));
}

function shortValue(value: string) {
  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
