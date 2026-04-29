import Link from "next/link";

import { LanguageSwitcher } from "../language-switcher";
import type { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import type { getIndexedState } from "../lib/trustleaf/indexedState";
import type { getTrustLeafLiveReadiness } from "../lib/trustleaf/liveReadiness";

type Locale = "en" | "es";
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type Deployment = Awaited<ReturnType<typeof getTrustLeafDeployment>>;
type LiveReadiness = ReturnType<typeof getTrustLeafLiveReadiness>;

export function AdminHubRedesign({
  locale,
  indexedState,
  deployment,
  liveReadiness,
}: {
  locale: Locale;
  indexedState: IndexedState;
  deployment: Deployment;
  liveReadiness: LiveReadiness;
}) {
  const copy = getCopy(locale);
  const activeMemberships = indexedState.roleMemberships.filter((membership) => membership.isActive);
  const liveContracts = deployment.contracts.filter((contract) => contract.status === "live");

  const actorCards = [
    { title: copy.patient, body: copy.patientBody, href: "/patient", tone: "emerald" },
    { title: copy.doctor, body: copy.doctorBody, href: "/doctor", tone: "cyan" },
    { title: copy.dispensary, body: copy.dispensaryBody, href: "/dispensary", tone: "amber" },
    { title: copy.superadmin, body: copy.superadminBody, href: "/superadmin", tone: "violet" },
  ] as const;

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#08110e_0%,#0b1814_40%,#efe5d6_40%,#efe8dc_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>

        <section className="rounded-[2.8rem] border border-white/10 bg-[linear-gradient(145deg,#08140f,#10271e_48%,#09140f)] p-8 shadow-[0_30px_110px_rgba(0,0,0,0.26)] md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">{copy.eyebrow}</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.92] text-emerald-50 md:text-7xl">{copy.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300 md:text-base">{copy.body}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricPill label={copy.contracts} value={String(liveContracts.length)} />
              <MetricPill label={copy.memberships} value={String(activeMemberships.length)} />
              <MetricPill label={copy.prescriptions} value={String(indexedState.prescriptions.length)} />
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-4">
          {actorCards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-[2rem] border border-white/8 bg-[#0d1814] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#10201a]">
              <p className={`text-xs uppercase tracking-[0.24em] ${toneClass(card.tone)}`}>{copy.workspace}</p>
              <h2 className="mt-3 font-display text-3xl text-stone-50">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">{card.body}</p>
            </Link>
          ))}
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="rounded-[2.3rem] border border-[#17392d]/10 bg-[#f5ede0] p-6 text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#6d7d75]">{copy.readinessEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-[#13231d]">{copy.readinessTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ReadinessCard title="Passkeys" status={String(liveReadiness.passkeys.backendPhase)} body={liveReadiness.passkeys.profileStorage} />
              <ReadinessCard title="Sponsor" status={liveReadiness.sponsor.ready ? copy.ready : copy.pending} body={liveReadiness.sponsor.mode} />
              <ReadinessCard title="Doctor submit" status={liveReadiness.doctor.ready ? copy.ready : copy.pending} body={liveReadiness.doctor.mode} />
              <ReadinessCard title="Dispensary submit" status={liveReadiness.dispensary.ready ? copy.ready : copy.pending} body={liveReadiness.dispensary.mode} />
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-[#17392d]/10 bg-[#f5ede0] p-6 text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.24em] text-[#6d7d75]">{copy.registryEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-[#13231d]">{copy.registryTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activeMemberships.map((membership) => (
                <article key={membership.id} className="rounded-[1.6rem] border border-[#17392d]/10 bg-white/78 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6d7d75]">{membership.role}</p>
                  <p className="mt-3 font-display text-2xl text-[#13231d]">{shortAccount(membership.account)}</p>
                  <p className="mt-3 text-sm leading-6 text-[#4a5d54]">{membership.account}</p>
                </article>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function getCopy(locale: Locale) {
  return locale === "es"
    ? {
        eyebrow: "Admin hub",
        title: "Una consola madre para ver toda la red sin mezclarla con la landing.",
        body: "Aqui vive la vista general del sistema: actores, readiness y accesos internos. La home publica queda limpia y centrada en pacientes.",
        contracts: "Contratos live",
        memberships: "Actores activos",
        prescriptions: "Recetas indexadas",
        workspace: "Workspace",
        patient: "Paciente",
        patientBody: "Discovery, receta activa e inventario visible sin mostrar paneles internos en la home.",
        doctor: "Medico",
        doctorBody: "Agenda, pacientes y emision dentro de un workspace separado y aprobado.",
        dispensary: "Dispensario",
        dispensaryBody: "Catalogo, inventario y validacion de receta en un rail retail-operativo.",
        superadmin: "Superadmin",
        superadminBody: "Governance, RBAC y aprobaciones manuales de los perfiles regulados.",
        readinessEyebrow: "Readiness",
        readinessTitle: "Que esta realmente listo hoy.",
        registryEyebrow: "Registry",
        registryTitle: "Los actores activos ya se ven como una red.",
        ready: "listo",
        pending: "pendiente",
      }
    : {
        eyebrow: "Admin hub",
        title: "A parent console to visualize the whole network without mixing it into the landing.",
        body: "This is the general system view: actors, readiness, and internal access. The public home stays clean and patient-focused.",
        contracts: "Live contracts",
        memberships: "Active actors",
        prescriptions: "Indexed prescriptions",
        workspace: "Workspace",
        patient: "Patient",
        patientBody: "Discovery, active prescription, and visible inventory without exposing internal dashboards on the home page.",
        doctor: "Doctor",
        doctorBody: "Schedule, patients, and issuance inside a separate approved workspace.",
        dispensary: "Dispensary",
        dispensaryBody: "Catalog, inventory, and prescription validation in one retail-operational rail.",
        superadmin: "Superadmin",
        superadminBody: "Governance, RBAC, and manual approvals for regulated profiles.",
        readinessEyebrow: "Readiness",
        readinessTitle: "What is actually ready today.",
        registryEyebrow: "Registry",
        registryTitle: "Active actors already read like a network.",
        ready: "ready",
        pending: "pending",
      };
}

function shortAccount(account: string) {
  return `${account.slice(0, 4)}...${account.slice(-4)}`;
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/58">{label}</p>
      <p className="mt-4 font-display text-4xl leading-none text-white">{value}</p>
    </article>
  );
}

function ReadinessCard({ title, status, body }: { title: string; status: string; body: string }) {
  return (
    <article className="rounded-[1.6rem] border border-[#17392d]/10 bg-white/78 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl text-[#13231d]">{title}</p>
        <span className="rounded-full bg-[#17392d]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{status}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#4a5d54]">{body}</p>
    </article>
  );
}

function toneClass(tone: "emerald" | "cyan" | "amber" | "violet") {
  if (tone === "emerald") return "text-emerald-300/75";
  if (tone === "cyan") return "text-cyan-300/75";
  if (tone === "amber") return "text-amber-300/75";
  return "text-violet-300/75";
}
