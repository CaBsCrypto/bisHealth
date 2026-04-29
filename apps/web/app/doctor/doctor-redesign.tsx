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

type PatientItem = {
  id: string;
  name: string;
  note: string;
  status: string;
};

type ConsultItem = {
  id: string;
  time: string;
  title: string;
  note: string;
};

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

  const ui =
    locale === "es"
      ? {
          lane: "Doctor lane",
          openDemo: "Abrir demo script",
          heroTitle: "Tu jornada clinica deberia sentirse clara, breve y lista para actuar.",
          heroBody: "Este POV existe para una cosa: ver pacientes, emitir receta y seguir la operacion sin ruido innecesario.",
          focusEyebrow: "Hoy",
          focusTitle: "La agenda, los pacientes y la receta viven en el mismo lugar.",
          focusBody: "El medico no deberia leer blockchain. Deberia entender a quien atender y que emitir ahora.",
          patientsEyebrow: "Pacientes activos",
          patientsTitle: "Una lista corta, accionable y legible.",
          liveEyebrow: "Live rail",
          liveTitle: "Emitir receta real desde este workspace.",
          liveBody: "La parte tecnica queda contenida abajo. Primero el trabajo clinico. Luego el submit real.",
          activeDoctor: "Cuenta activa",
          livePatients: "Pacientes",
          liveRx: "Recetas",
          liveConsults: "Consultas",
          nextAction: "Siguiente accion",
          openWalletless: "Abrir wallet-less",
          advanced: "Bridge tecnico",
        }
      : {
          lane: "Doctor lane",
          openDemo: "Open demo script",
          heroTitle: "Your clinical day should feel clear, short, and ready to act.",
          heroBody: "This POV exists for one thing: see patients, issue prescriptions, and keep operations moving without unnecessary noise.",
          focusEyebrow: "Today",
          focusTitle: "Schedule, patients, and prescription live in one place.",
          focusBody: "The doctor should not read blockchain. They should understand who to see and what to issue next.",
          patientsEyebrow: "Active patients",
          patientsTitle: "A short list you can actually act on.",
          liveEyebrow: "Live rail",
          liveTitle: "Issue a real prescription from this workspace.",
          liveBody: "Technical detail stays contained below. Clinical work first. Real submit second.",
          activeDoctor: "Active account",
          livePatients: "Patients",
          liveRx: "Prescriptions",
          liveConsults: "Consults",
          nextAction: "Next action",
          openWalletless: "Open wallet-less",
          advanced: "Technical bridge",
        };

  const consults = buildConsults(locale, selectedDoctor?.account ?? null);
  const patients = buildPatients(locale, doctorPrescriptions);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f2f6fb] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(123,192,255,0.18),transparent_22%),radial-gradient(circle_at_88%_10%,rgba(107,224,197,0.18),transparent_22%),linear-gradient(180deg,#f5f9fd_0%,#edf3fa_42%,#e9f0f9_100%)]" />
      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-3 shadow-[0_10px_34px_rgba(15,23,42,0.05)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-950 text-sm font-semibold text-sky-50">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-slate-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{ui.lane}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950">{copy.back}</Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950">{ui.openDemo}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-sky-950 px-5 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-900">{ui.openWalletless}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="doctor" />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <article className="rounded-[2.9rem] border border-slate-900/10 bg-[linear-gradient(145deg,#071b31,#0f3552_42%,#edf5fb_100%)] p-7 shadow-[0_32px_120px_rgba(15,23,42,0.14)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-sky-50">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              {copy.heroStatus}
            </div>
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-sky-100/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl">{ui.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100/88">{ui.heroBody}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <HeroPill label={ui.activeDoctor} value={selectedDoctor ? shortValue(selectedDoctor.account) : "--"} />
              <HeroPill label={ui.livePatients} value={String(patients.length)} />
              <HeroPill label={ui.liveRx} value={String(doctorPrescriptions.length)} />
              <HeroPill label={ui.liveConsults} value={String(consults.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-slate-900/10 bg-white/88 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{ui.focusEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-slate-950">{ui.focusTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{ui.focusBody}</p>
              <div className="mt-6 grid gap-3">
                {consults.map((consult) => (
                  <SimpleRow key={consult.id} label={consult.time} title={consult.title} body={consult.note} />
                ))}
              </div>
            </article>
            <article className="rounded-[2.3rem] border border-slate-900/10 bg-white/88 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <ActorEntryMode actor="doctor" locale={locale} demoHref="#patients" />
              <div className="mt-6">
                <ActorNav current="doctor" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="patients" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2.3rem] border border-slate-900/10 bg-white/88 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{ui.patientsEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">{ui.patientsTitle}</h2>
            <div className="mt-6 grid gap-4">
              {patients.map((patient) => (
                <article key={patient.id} className="rounded-[1.8rem] border border-slate-900/10 bg-[#f7fbff] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{patient.status}</p>
                      <h3 className="mt-3 font-display text-[2rem] text-slate-950">{patient.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{patient.note}</p>
                    </div>
                    <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-900">{ui.nextAction}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-slate-900/10 bg-[linear-gradient(180deg,#061018,#0b1622_42%,#101b29_100%)] p-6 shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{ui.liveEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.92] text-slate-50">{ui.liveTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">{ui.liveBody}</p>

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
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{ui.advanced}</p>
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

function buildConsults(locale: Locale, doctorAccount: string | null): ConsultItem[] {
  const account = doctorAccount ? shortValue(doctorAccount) : "--";
  return locale === "es"
    ? [
        { id: "1", time: "09:30", title: "Primera consulta", note: `Paciente nuevo, receta privada y cuenta ${account}.` },
        { id: "2", time: "12:00", title: "Renovacion", note: "Seguimiento de tratamiento y ajuste de dosis." },
      ]
    : [
        { id: "1", time: "09:30", title: "First consult", note: `New patient, private prescription, account ${account}.` },
        { id: "2", time: "12:00", title: "Renewal", note: "Treatment follow-up and dosage adjustment." },
      ];
}

function buildPatients(locale: Locale, prescriptions: IndexedState["prescriptions"]): PatientItem[] {
  const live = prescriptions.slice(0, 2).map((prescription, index) => ({
    id: prescription.id,
    name: locale === "es" ? `Paciente ${index + 1}` : `Patient ${index + 1}`,
    note: locale === "es" ? "Receta privada activa y seguimiento abierto." : "Active private prescription and open follow-up.",
    status: prescription.isUsed ? (locale === "es" ? "Consumida" : "Consumed") : (locale === "es" ? "Lista para emitir" : "Ready to issue"),
  }));

  const preview = locale === "es"
    ? [{ id: "preview", name: "Paciente demo", note: "Mockup de continuidad clinica para presentar el flujo.", status: "Preview" }]
    : [{ id: "preview", name: "Demo patient", note: "Continuity-of-care mockup for presenting the flow.", status: "Preview" }];

  return [...live, ...preview].slice(0, 3);
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.8rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-200/70">{label}</p>
      <p className="font-display mt-3 text-[2.2rem] leading-none text-white">{value}</p>
    </article>
  );
}

function SimpleRow({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="rounded-[1.4rem] border border-slate-900/10 bg-[#f4f8fc] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function shortValue(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
