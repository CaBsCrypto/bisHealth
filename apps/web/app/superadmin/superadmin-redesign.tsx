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
import { SuperAdminRoleSubmit } from "./superadmin-role-submit";
import { getTrustLeafSuperAdminSubmitConfig } from "../lib/trustleaf/superAdminRbac";

type Locale = "en" | "es";
type SuperAdminCopy = ReturnType<typeof getSuperAdminPageCopy>;
type IndexedState = Awaited<ReturnType<typeof getIndexedState>>;
type Deployment = Awaited<ReturnType<typeof getTrustLeafDeployment>>;
type SuperAdminActionPack = Awaited<ReturnType<typeof getTrustLeafSuperAdminActionPack>>;

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
  const liveContracts = deployment.contracts.filter((contract) => contract.status === "live");
  const recentChanges = indexedState.roleChanges.slice(0, 4);
  const submitConfig = getTrustLeafSuperAdminSubmitConfig();

  const approvalQueue =
    locale === "es"
      ? [
          { name: "Andes Relief Clinic", type: copy.queueDoctor, note: copy.queueDoctorDetail },
          { name: "Green North Dispensary", type: copy.queueDisp, note: copy.queueDispDetail },
        ]
      : [
          { name: "Andes Relief Clinic", type: copy.queueDoctor, note: copy.queueDoctorDetail },
          { name: "Green North Dispensary", type: copy.queueDisp, note: copy.queueDispDetail },
        ];

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0a0b15_0%,#101423_40%,#141b2b_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-900 text-sm font-semibold text-sky-50">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-50">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-400">Superadmin lane</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white">
                {copy.back}
              </Link>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:bg-white/10 hover:text-white">
                {locale === "es" ? "Abrir demo script" : "Open demo script"}
              </Link>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="superadmin" dark />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-white/10 bg-[linear-gradient(145deg,#0c1221,#0d2a33_46%,#162132_100%)] p-7 shadow-[0_30px_110px_rgba(0,0,0,0.28)] md:p-10">
            <p className="text-xs uppercase tracking-[0.34em] text-sky-300/70">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.95] text-stone-50 md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200 md:text-lg">{copy.body}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-5">
              <HeroPill label={copy.activeAdmins} value={String(activeAdmins.length)} />
              <HeroPill label={copy.activeDoctors} value={String(activeDoctors.length)} />
              <HeroPill label={copy.activeDispensaries} value={String(activeDispensaries.length)} />
              <HeroPill label={copy.liveContracts} value={String(liveContracts.length)} />
              <HeroPill label={copy.sourceAccount} value={shortValue(deployment.sourceAccount ?? "pending")} />
            </div>
          </article>

          <aside className="grid gap-6">
            <article className="rounded-[2.3rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <p className="text-xs uppercase tracking-[0.26em] text-stone-400">{locale === "es" ? "Mision del superadmin" : "Superadmin mission"}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-stone-50">
                {locale === "es" ? "Ordenar acceso, confianza y gobernanza." : "Bring order to access, trust, and governance."}
              </h2>
              <div className="mt-6 grid gap-3">
                <SummaryRow label={locale === "es" ? "Admin activo" : "Active admin"} value={shortValue(superAdminActionPack.adminAccount)} />
                <SummaryRow label={locale === "es" ? "Contrato RBAC" : "RBAC contract"} value={shortValue(superAdminActionPack.contractId ?? "pending")} />
                <SummaryRow label={locale === "es" ? "Plantillas listas" : "Ready templates"} value={String(superAdminActionPack.roleTemplates.length)} />
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
              <ActorEntryMode actor="superadmin" locale={locale} demoHref="#approval-flow" />
              <div className="mt-6">
                <ActorNav current="superadmin" locale={locale} />
              </div>
            </article>
          </aside>
        </section>

        <section id="approval-flow" className="mt-10 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <article className="rounded-[2.3rem] border border-amber-200/10 bg-[#17130c]/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300/70">{copy.approvalQueueEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-amber-50">{copy.approvalQueueTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">{copy.approvalQueueBody}</p>

            <div className="mt-6 grid gap-4">
              {approvalQueue.map((item) => (
                <article key={item.name} className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">{item.type}</p>
                      <h3 className="mt-3 text-2xl text-stone-50">{item.name}</h3>
                    </div>
                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100">{copy.queueStatus}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{item.note}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-emerald-200/10 bg-[#0b1513]/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">{copy.registryEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-emerald-50">{copy.registryTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">{copy.registryBody}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activeMemberships.map((membership) => (
                <article key={membership.id} className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">{normalizeRole(membership.role)}</p>
                      <h3 className="mt-3 break-all text-xl text-stone-50">{shortValue(membership.account)}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">live</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-stone-300">
                    <p>{copy.grantedBy}: {membership.grantedBy ? shortValue(membership.grantedBy) : copy.noGrantor}</p>
                    <p>{copy.grantedAt}: {membership.grantedAtLedger}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="rounded-[2.3rem] border border-violet-200/10 bg-[#12101c]/92 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300/70">{copy.actionsEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-violet-50">{copy.actionsTitle}</h2>
            <div className="mt-6 grid gap-4">
              <ActionCard href="/doctor" title={copy.actionDoctor} />
              <ActionCard href="/dispensary" title={copy.actionDisp} />
              <ActionCard href="/command-center" title={copy.openCommandCenter} />
              <ActionCard href="/api/trustleaf/deployment" title={copy.actionReview} />
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">{copy.recentChangesEyebrow}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-stone-50">{copy.recentChangesTitle}</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">{copy.recentChangesBody}</p>

            <div className="mt-6 grid gap-4">
              {recentChanges.length > 0 ? recentChanges.map((change) => (
                <article key={change.id} className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{normalizeRole(change.role)}</p>
                      <h3 className="mt-3 text-2xl text-stone-50">{shortValue(change.account)}</h3>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-stone-200">{change.action}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-stone-300">
                    <p>{copy.grantedBy}: {change.admin ? shortValue(change.admin) : copy.noGrantor}</p>
                    <p>Ledger: {change.ledger}</p>
                  </div>
                </article>
              )) : (
                <article className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5 text-sm text-stone-300">{copy.pendingRoleChanges}</article>
              )}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.3rem] border border-sky-200/10 bg-[#0c1520]/92 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">{locale === "es" ? "RBAC bridge" : "RBAC bridge"}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-sky-50">
              {locale === "es" ? "Aprobaciones reales listas para ejecutar." : "Real approvals ready to execute."}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">
              {locale === "es"
                ? "La parte operativa ya existe: contrato RBAC live, cuenta admin y plantillas de grant y revoke por actor."
                : "The operational layer already exists: live RBAC contract, admin account, and grant/revoke templates by actor."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {superAdminActionPack.roleTemplates.map((template) => (
                <article key={template.key} className="rounded-[1.6rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">{template.label}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-100">{shortValue(template.account)}</p>
                </article>
              ))}
            </div>

            <SuperAdminRoleSubmit
              locale={locale}
              initialAdmin={superAdminActionPack.adminAccount}
              roleTemplates={superAdminActionPack.roleTemplates}
              submitReady={submitConfig.enabled}
              submitMode={submitConfig.mode}
            />
          </article>

          <article className="rounded-[2.3rem] border border-white/10 bg-black/20 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">{locale === "es" ? "Bridge avanzado" : "Advanced bridge"}</p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-stone-50">
              {locale === "es" ? "JSON y handoff del superadmin." : "Superadmin JSON and handoff."}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">
              {locale === "es"
                ? "Este bloque queda como capa final para copiar el pack del admin o abrir el endpoint backend-first."
                : "This block stays as the final layer for copying the admin pack or opening the backend-first endpoint."}
            </p>
            <ActionBridgeTools
              locale={locale}
              command={superAdminActionPack.roleTemplates.map((item) => item.grantCommand).join("\n\n")}
              payloadBase64={superAdminActionPack.payloadBase64}
              apiPath="/api/trustleaf/actor-bridges/superadmin"
            />
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
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{label}</p>
      <p className="mt-2 text-sm leading-7 text-stone-100">{value}</p>
    </div>
  );
}

function ActionCard({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5 text-base text-stone-100 transition hover:bg-white/5">
      {title}
    </Link>
  );
}

function shortValue(value: string) {
  if (value.length <= 14) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function normalizeRole(role: string) {
  return role.replaceAll("_ROLE", "").replaceAll("_", " ");
}
