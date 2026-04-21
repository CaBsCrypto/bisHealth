import Link from "next/link";

import { LanguageSwitcher } from "../language-switcher";
import { getDoctorPageCopy } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import { getIndexedState } from "../lib/trustleaf/indexedState";

export default async function DoctorPage() {
  const locale = await getLocale();
  const copy = getDoctorPageCopy(locale);
  const indexedState = await getIndexedState();

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

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:py-10">
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
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950"
              >
                {copy.back}
              </Link>
              <Link
                href="/superadmin"
                className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950"
              >
                {copy.openSuperadmin}
              </Link>
              <Link
                href="/walletless"
                className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-950"
              >
                {copy.openWalletless}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link
                href="/walletless"
                className="rounded-full bg-sky-950 px-5 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-900"
              >
                {copy.finalCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[2.8rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(8,25,45,0.98),rgba(17,62,92,0.92)_48%,rgba(238,245,252,0.98))] px-6 py-8 shadow-[0_28px_120px_rgba(15,23,42,0.12)] md:px-8 md:py-10 xl:px-10">
          <div className="grid gap-10 xl:grid-cols-[1fr_0.95fr] xl:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-sky-50">
                <span className="h-2 w-2 rounded-full bg-sky-300 hero-pulse" />
                {copy.heroStatus}
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-sky-100/70">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-4xl text-6xl leading-[0.95] text-white md:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100/90">{copy.body}</p>
            </div>

            <aside className="grid gap-4 md:grid-cols-2">
              <HeroMetricCard label={copy.activePatients} value={String(patientRoster.length)} tone="sky" />
              <HeroMetricCard
                label={copy.activePrescriptions}
                value={String(doctorPrescriptions.filter((prescription) => !prescription.isUsed).length)}
                tone="emerald"
              />
              <HeroMetricCard label={copy.upcomingConsults} value={String(consultSchedule.length)} tone="amber" />
              <HeroMetricCard label={copy.liveReceipts} value={String(consumedReceipts.length)} tone="stone" />
            </aside>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2.2rem] border border-slate-900/10 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-700">{copy.scheduleEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">{copy.scheduleTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{copy.scheduleBody}</p>

            <div className="mt-6 rounded-[1.8rem] border border-sky-950/10 bg-sky-950 px-5 py-5 text-sky-50">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-200/75">{copy.morningWindow}</p>
              <p className="font-display mt-3 text-4xl">{copy.morningValue}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {consultSchedule.map((consult) => (
              <article
                key={consult.id}
                className="rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,255,255,0.7))] p-5 shadow-[0_12px_44px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-sky-700">{consult.time}</p>
                    <h3 className="mt-3 font-display text-3xl text-slate-950">{consult.patientName}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{consult.reason}</p>
                  </div>
                  <span className="rounded-full bg-sky-950/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-950">
                    {copy.scheduleStatus}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <InfoChip label={copy.doctorAccount} value={shortValue(consult.doctorAccount)} />
                  <InfoChip label={copy.nextReview} value={consult.nextWindow} />
                  <InfoChip label="Mode" value={consult.mode} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.2rem] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(247,253,250,0.96),rgba(234,247,239,0.94))] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{copy.patientRosterEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">
              {copy.patientRosterTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">{copy.patientRosterBody}</p>

            <div className="mt-6 grid gap-4">
              {patientRoster.map((patient) => (
                <article
                  key={patient.id}
                  className="rounded-[1.8rem] border border-emerald-900/10 bg-white/80 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{patient.tag}</p>
                      <h3 className="mt-3 font-display text-3xl text-slate-950">{patient.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{patient.context}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${
                        patient.priority === "high"
                          ? "bg-amber-900/10 text-amber-900"
                          : "bg-emerald-900/10 text-emerald-900"
                      }`}
                    >
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
          </div>

          <div className="rounded-[2.2rem] border border-slate-900/10 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{copy.actionRailEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-950">
              {copy.actionRailTitle}
            </h2>
            <div className="mt-6 grid gap-4">
              {[copy.actionConsult, copy.actionPrescription, copy.actionRenewal, copy.actionPatient].map((step, index) => (
                <article
                  key={step}
                  className="rounded-[1.7rem] border border-slate-900/10 bg-slate-950 px-5 py-5 text-slate-100"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">0{index + 1}</p>
                  <p className="mt-3 text-lg leading-8">{step}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2.3rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(11,17,24,0.98),rgba(16,23,33,0.98))] p-6 shadow-[0_22px_90px_rgba(15,23,42,0.12)]">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300/70">{copy.prescriptionEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-slate-50">
              {copy.prescriptionTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">{copy.prescriptionBody}</p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {doctorPrescriptions.slice(0, 3).map((prescription) => (
              <article
                key={prescription.id}
                className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">
                      {shortHash(prescription.id)}
                    </p>
                    <h3 className="mt-3 font-display text-3xl leading-tight text-slate-50">
                      {prescription.isUsed ? copy.consumed : copy.reserved}
                    </h3>
                  </div>
                  <span className="rounded-full bg-sky-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-100">
                    {copy.issued}
                  </span>
                </div>
                <div className="mt-5 grid gap-3">
                  <InfoChipDark label={copy.doctorAccount} value={shortValue(prescription.doctor)} />
                  <InfoChipDark label={copy.createdLedger} value={String(prescription.createdAtLedger)} />
                  <InfoChipDark
                    label={copy.verifiedBy}
                    value={prescription.lastVerifiedBy ? shortValue(prescription.lastVerifiedBy) : copy.waitingVerification}
                  />
                  <InfoChipDark label="Nullifier" value={shortHash(prescription.patientNullifier)} />
                </div>
              </article>
            ))}
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
    stone: "border-white/15 bg-white/10 text-slate-50",
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
    <div className="rounded-[1.3rem] border border-slate-900/10 bg-slate-900/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-slate-900">{value}</p>
    </div>
  );
}

function InfoChipDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-black/15 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-slate-100">{value}</p>
    </div>
  );
}

function buildConsultSchedule(locale: "en" | "es", doctorAccount: string | null) {
  return locale === "es"
    ? [
        {
          id: "consult-1",
          time: "09:30",
          patientName: "Marina P.",
          reason: "Reevaluacion de dolor cronico y ajuste de formulacion.",
          nextWindow: "Hoy 11:00",
          mode: "Video",
          doctorAccount: doctorAccount ?? "doctor-live",
        },
        {
          id: "consult-2",
          time: "12:15",
          patientName: "Josefina R.",
          reason: "Renovacion de receta y seguimiento de tolerancia nocturna.",
          nextWindow: "Hoy 14:00",
          mode: "Presencial",
          doctorAccount: doctorAccount ?? "doctor-live",
        },
        {
          id: "consult-3",
          time: "16:40",
          patientName: "Daniel C.",
          reason: "Primera consulta para onboarding terapeutico y education rail.",
          nextWindow: "Mañana",
          mode: "Video",
          doctorAccount: doctorAccount ?? "doctor-live",
        },
      ]
    : [
        {
          id: "consult-1",
          time: "09:30",
          patientName: "Marina P.",
          reason: "Chronic pain reassessment and formulation adjustment.",
          nextWindow: "Today 11:00",
          mode: "Video",
          doctorAccount: doctorAccount ?? "doctor-live",
        },
        {
          id: "consult-2",
          time: "12:15",
          patientName: "Josefina R.",
          reason: "Prescription renewal and nighttime tolerance follow-up.",
          nextWindow: "Today 14:00",
          mode: "In person",
          doctorAccount: doctorAccount ?? "doctor-live",
        },
        {
          id: "consult-3",
          time: "16:40",
          patientName: "Daniel C.",
          reason: "First consult for therapeutic onboarding and education rail.",
          nextWindow: "Tomorrow",
          mode: "Video",
          doctorAccount: doctorAccount ?? "doctor-live",
        },
      ];
}

function buildPatientRoster(
  locale: "en" | "es",
  prescriptions: Array<{
    id: string;
    isUsed: boolean;
    createdAtLedger: number;
    consumedAtLedger: number | null;
  }>,
) {
  const seeds =
    locale === "es"
      ? [
          {
            name: "Valeria M.",
            tag: "Control de continuidad",
            context: "Paciente estable con buen resultado y renovacion cercana.",
            lastVisit: "Hace 14 dias",
            nextReview: "En 3 dias",
            renewalState: "Renovar hoy",
            priority: "high" as const,
          },
          {
            name: "Ignacio T.",
            tag: "Seguimiento terapeutico",
            context: "Tratamiento activo con necesidad de ajuste de dosis.",
            lastVisit: "Hace 7 dias",
            nextReview: "Mañana",
            renewalState: "En observacion",
            priority: "normal" as const,
          },
          {
            name: "Paula N.",
            tag: "Nueva adherencia",
            context: "Primera receta emitida, revisar experiencia con dispensario.",
            lastVisit: "Hoy",
            nextReview: "En 5 dias",
            renewalState: "Receta vigente",
            priority: "normal" as const,
          },
        ]
      : [
          {
            name: "Valeria M.",
            tag: "Continuity check",
            context: "Stable patient with good outcome and a near-term renewal.",
            lastVisit: "14 days ago",
            nextReview: "In 3 days",
            renewalState: "Renew today",
            priority: "high" as const,
          },
          {
            name: "Ignacio T.",
            tag: "Therapeutic follow-up",
            context: "Active treatment with dosage adjustment needs.",
            lastVisit: "7 days ago",
            nextReview: "Tomorrow",
            renewalState: "Under observation",
            priority: "normal" as const,
          },
          {
            name: "Paula N.",
            tag: "New adherence",
            context: "First prescription issued, review dispensary experience.",
            lastVisit: "Today",
            nextReview: "In 5 days",
            renewalState: "Prescription active",
            priority: "normal" as const,
          },
        ];

  return seeds.map((seed, index) => {
    const prescription = prescriptions[index % Math.max(prescriptions.length, 1)];
    return {
      id: prescription?.id ?? `${seed.name}-${index}`,
      ...seed,
      renewalState:
        prescription && prescription.isUsed
          ? locale === "es"
            ? "Consumida, emitir nueva"
            : "Consumed, issue new"
          : seed.renewalState,
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
