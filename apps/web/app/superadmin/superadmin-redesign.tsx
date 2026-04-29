import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorEntryMode } from "../actor-entry-mode";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";
import type { getSuperAdminPageCopy } from "../lib/i18n";
import type { getTrustLeafSuperAdminActionPack } from "../lib/trustleaf/actionRails";
import type { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import type { getIndexedState } from "../lib/trustleaf/indexedState";
import { getTrustLeafSuperAdminSubmitConfig } from "../lib/trustleaf/superAdminRbac";
import { SuperAdminRoleSubmit } from "./superadmin-role-submit";

type Locale = "en" | "es";
type SuperAdminCopy = ReturnType<typeof getSuperAdminPageCopy>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type Deployment = Awaited<ReturnType<typeof getTrustLeafDeployment>>;
type SuperAdminActionPack = Awaited<ReturnType<typeof getTrustLeafSuperAdminActionPack>>;

type QueueItem = {
  id: string;
  name: string;
  note: string;
  status: string;
};

export function SuperAdminRedesign({
  locale,
  copy,
  indexedState,
  deployment,
  superAdminActionPack,
}: {
  locale: Locale;
  copy: SuperAdminCopy;
  indexedState: IndexedState;
  deployment: Deployment;
  superAdminActionPack: SuperAdminActionPack;
}) {
  const activeMemberships = indexedState.roleMemberships.filter((membership) => membership.isActive);
  const activeAdmins = activeMemberships.filter((membership) => membership.role.includes("ADMIN"));
  const activeDoctors = activeMemberships.filter((membership) => membership.role.includes("DOCTOR"));
  const activeDispensaries = activeMemberships.filter((membership) => membership.role.includes("DISP"));
  const submitConfig = getTrustLeafSuperAdminSubmitConfig();

  const ui =
    locale === "es"
      ? {
          lane: "Superadmin lane",
          openDemo: "Abrir demo script",
          heroTitle: "El superadmin deberia ver aprobaciones, red y control en una sola pantalla limpia.",
          heroBody: "Este POV existe para decidir quien entra, quien opera y que parte de la red ya esta lista.",
          queueEyebrow: "Cola de aprobacion",
          queueTitle: "Que perfiles merecen tu atencion ahora.",
          registryEyebrow: "Red activa",
          registryTitle: "Los actores aprobados ya se leen como un sistema curado.",
          liveEyebrow: "Live rail",
          liveTitle: "Otorgar o revocar accesos reales desde este workspace.",
          liveBody: "La ejecucion on-chain queda al final. Primero claridad de gobernanza. Despues la accion real.",
          activeAdmins: "Admins",
          activeDoctors: "Medicos",
          activeDisp: "Dispensarios",
          contracts: "Contratos",
          openWalletless: "Abrir wallet-less",
          advanced: "Bridge tecnico",
        }
      : {
          lane: "Superadmin lane",
          openDemo: "Open demo script",
          heroTitle: "The superadmin should see approvals, network state, and control in one clean screen.",
          heroBody: "This POV exists to decide who enters, who operates, and which part of the network is already ready.",
          queueEyebrow: "Approval queue",
          queueTitle: "Which profiles deserve attention now.",
          registryEyebrow: "Active network",
          registryTitle: "Approved actors already read like a curated system.",
          liveEyebrow: "Live rail",
          liveTitle: "Grant or revoke real access from this workspace.",
          liveBody: "On-chain execution stays at the end. Governance clarity first. Real action second.",
          activeAdmins: "Admins",
          activeDoctors: "Doctors",
          activeDisp: "Dispensaries",
          contracts: "Contracts",
          openWalletless: "Open wallet-less",
          advanced: "Technical bridge",
        };

  const liveContracts = deployment.contracts.filter((contract) => contract.status === "live");
  const queue = buildQueue(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0a0b15_0%,#101423_40%,#141b2b_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-900 text-sm font-semibold text-sky-50">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-50">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-400">{ui.lane}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white">{copy.back}</Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white">{ui.openDemo}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-sky-900 px-5 py-2.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-800">{ui.openWalletless}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="superadmin" dark />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <article className="rounded-[2.9rem] border border-white/10 bg-[linear-gradient(145deg,#0b1020,#0b2531_44%,#141c2d_100%)] p-7 shadow-[0_32px_120px_rgba(0,0,0,0.28)] md:p-10">
            <p className="text-xs uppercase tracking-[0.34em] text-sky-300/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-stone-50 md:text-7xl">{ui.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-200/88">{ui.heroBody}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <HeroPill label={ui.activeAdmins} value={String(activeAdmins.length)} />
              <HeroPill label={ui.activeDoctors} value={String(activeDoctors.length)} />
              <HeroPill label={ui.activeDisp} value={String(activeDispensaries.length)} />
              <HeroPill label={ui.contracts} value={String(liveContracts.length)} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-white/10 bg-white/6 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-400">{ui.queueEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-stone-50">{ui.queueTitle}</h2>
              <div className="mt-6 grid gap-3">
                {queue.map((item) => (
                  <SimpleRowDark key={item.id} label={item.status} title={item.name} body={item.note} />
                ))}
              </div>
            </article>
            <article className="rounded-[2.3rem] border border-white/10 bg-white/6 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <ActorEntryMode actor="superadmin" locale={locale} demoHref="#registry" />
              <div className="mt-6">
                <ActorNav current="superadmin" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="registry" className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="rounded-[2.3rem] border border-white/10 bg-white/6 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/70">{ui.registryEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-50">{ui.registryTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activeMemberships.map((membership) => (
                <article key={membership.id} className="rounded-[1.7rem] border border-white/8 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">{membership.role}</p>
                  <p className="mt-3 font-display text-2xl text-stone-50">{shortValue(membership.account)}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">{membership.account}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,31,0.84),rgba(8,14,24,0.96))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300/70">{ui.liveEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.92] text-sky-50">{ui.liveTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">{ui.liveBody}</p>

            <SuperAdminRoleSubmit
              locale={locale}
              initialAdmin={superAdminActionPack.adminAccount}
              roleTemplates={superAdminActionPack.roleTemplates}
              submitReady={submitConfig.enabled}
              submitMode={submitConfig.mode}
            />

            <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{ui.advanced}</p>
              <ActionBridgeTools
                locale={locale}
                command={superAdminActionPack.roleTemplates.map((item) => item.grantCommand).join("\n\n")}
                payloadBase64={superAdminActionPack.payloadBase64}
                apiPath="/api/trustleaf/actor-bridges/superadmin"
              />
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function buildQueue(locale: Locale): QueueItem[] {
  return locale === "es"
    ? [
        { id: "1", name: "Andes Relief Clinic", note: "Medico con onboarding pendiente de aprobacion manual.", status: "Doctor" },
        { id: "2", name: "Green North Dispensary", note: "Dispensario listo para recibir acceso operacional.", status: "Dispensary" },
      ]
    : [
        { id: "1", name: "Andes Relief Clinic", note: "Doctor profile waiting for manual approval.", status: "Doctor" },
        { id: "2", name: "Green North Dispensary", note: "Dispensary ready to receive operational access.", status: "Dispensary" },
      ];
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-200/70">{label}</p>
      <p className="font-display mt-3 text-3xl leading-none text-white">{value}</p>
    </article>
  );
}

function SimpleRowDark({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <article className="rounded-[1.4rem] border border-white/8 bg-black/20 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{label}</p>
      <p className="mt-2 font-display text-2xl text-stone-50">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{body}</p>
    </article>
  );
}

function shortValue(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
