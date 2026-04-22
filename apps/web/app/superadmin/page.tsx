import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { getLocale } from "../lib/locale";
import { getSuperAdminPageCopy } from "../lib/i18n";
import { getTrustLeafSuperAdminActionPack } from "../lib/trustleaf/actionRails";
import { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import { getIndexedState } from "../lib/trustleaf/indexedState";

export default async function SuperAdminPage() {
  const locale = await getLocale();
  const copy = getSuperAdminPageCopy(locale);
  const indexedState = await getIndexedState();
  const deployment = await getTrustLeafDeployment();

  const activeMemberships = indexedState.roleMemberships.filter((membership) => membership.isActive);
  const activeAdmins = activeMemberships.filter((membership) => membership.role.includes("ADMIN"));
  const activeDoctors = activeMemberships.filter((membership) => membership.role.includes("DOCTOR"));
  const activeDispensaries = activeMemberships.filter(
    (membership) => membership.role.includes("DISP"),
  );
  const liveContracts = deployment.contracts.filter((contract) => contract.status === "live");
  const recentChanges = indexedState.roleChanges.slice(0, 4);
  const superAdminActionPack = await getTrustLeafSuperAdminActionPack();

  const approvalQueue =
    locale === "es"
      ? [
          {
            name: "Andes Relief Clinic",
            type: copy.queueDoctor,
            note: copy.queueDoctorDetail,
          },
          {
            name: "Green North Dispensary",
            type: copy.queueDisp,
            note: copy.queueDispDetail,
          },
        ]
      : [
          {
            name: "Andes Relief Clinic",
            type: copy.queueDoctor,
            note: copy.queueDoctorDetail,
          },
          {
            name: "Green North Dispensary",
            type: copy.queueDisp,
            note: copy.queueDispDetail,
          },
        ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090914_0%,#0e1020_38%,#121a2a_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>

        <section className="rounded-[2.4rem] border border-sky-200/10 bg-[linear-gradient(135deg,rgba(12,16,31,0.98),rgba(11,37,44,0.9)_52%,rgba(17,18,31,0.98))] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.34)] md:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-end">
            <div className="max-w-4xl">
              <p className="text-xs uppercase tracking-[0.34em] text-sky-300/70">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 text-5xl leading-[0.95] text-stone-50 md:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200 md:text-lg">
                {copy.body}
              </p>

              <ActorNav current="superadmin" locale={locale} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/"
                className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 transition hover:bg-white/12"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">{copy.governance}</p>
                <p className="font-display mt-3 text-3xl text-stone-50">{copy.back}</p>
              </Link>
              <Link
                href="/command-center"
                className="rounded-[1.8rem] border border-white/10 bg-black/15 p-5 transition hover:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Indexed ops</p>
                <p className="font-display mt-3 text-3xl text-stone-50">{copy.openCommandCenter}</p>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <MetricCard label={copy.activeAdmins} value={String(activeAdmins.length)} tone="sky" />
            <MetricCard label={copy.activeDoctors} value={String(activeDoctors.length)} tone="emerald" />
            <MetricCard
              label={copy.activeDispensaries}
              value={String(activeDispensaries.length)}
              tone="amber"
            />
            <MetricCard label={copy.liveContracts} value={String(liveContracts.length)} tone="violet" />
            <MetricCard
              label={copy.sourceAccount}
              value={shortValue(deployment.sourceAccount ?? "pending")}
              tone="stone"
            />
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-amber-200/10 bg-[#17130c]/90 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300/70">
              {copy.approvalQueueEyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-amber-50">
              {copy.approvalQueueTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">{copy.approvalQueueBody}</p>

            <div className="mt-6 grid gap-4">
              {approvalQueue.map((item) => (
                <article
                  key={item.name}
                  className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">{item.type}</p>
                      <h3 className="mt-3 text-2xl text-stone-50">{item.name}</h3>
                    </div>
                    <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100">
                      {copy.queueStatus}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{item.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-200/10 bg-[#0b1513]/90 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">
              {copy.registryEyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-emerald-50">
              {copy.registryTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">{copy.registryBody}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activeMemberships.map((membership) => (
                <article
                  key={membership.id}
                  className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
                        {normalizeRole(membership.role)}
                      </p>
                      <h3 className="mt-3 break-all text-xl text-stone-50">
                        {shortValue(membership.account)}
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">
                      live
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-stone-300">
                    <p>
                      {copy.account}: {membership.account}
                    </p>
                    <p>
                      {copy.grantedBy}: {membership.grantedBy ? shortValue(membership.grantedBy) : copy.noGrantor}
                    </p>
                    <p>
                      {copy.grantedAt}: {membership.grantedAtLedger}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[0.94fr_1.06fr]">
          <div className="rounded-[2rem] border border-violet-200/10 bg-[#12101c]/92 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-violet-300/70">
              {copy.actionsEyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-violet-50">
              {copy.actionsTitle}
            </h2>
            <div className="mt-6 grid gap-4">
              <ActionCard href="/doctor" title={copy.actionDoctor} />
              <ActionCard href="/dispensary" title={copy.actionDisp} />
              <ActionCard href="/api/trustleaf/deployment" title={copy.actionReview} />
              <ActionCard href="/api/indexed-state" title={copy.actionIndex} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
              {copy.recentChangesEyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-stone-50">
              {copy.recentChangesTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">{copy.recentChangesBody}</p>

            <div className="mt-6 grid gap-4">
              {recentChanges.length > 0 ? (
                recentChanges.map((change) => (
                  <article
                    key={change.id}
                    className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                          {normalizeRole(change.role)}
                        </p>
                        <h3 className="mt-3 text-2xl text-stone-50">{shortValue(change.account)}</h3>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-stone-200">
                        {change.action}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm leading-6 text-stone-300">
                      <p>
                        {copy.account}: {change.account}
                      </p>
                      <p>
                        {copy.grantedBy}: {change.admin ? shortValue(change.admin) : copy.noGrantor}
                      </p>
                      <p>Ledger: {change.ledger}</p>
                    </div>
                  </article>
                ))
              ) : (
                <article className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5 text-sm text-stone-300">
                  {copy.pendingRoleChanges}
                </article>
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-sky-200/10 bg-[#0c1520]/92 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">
              {locale === "es" ? "RBAC bridge" : "RBAC bridge"}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-sky-50">
              {locale === "es"
                ? "Aprobaciones reales listas para ejecutar."
                : "Real approvals ready to execute."}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">
              {locale === "es"
                ? "Este bloque toma el contrato RBAC live, la cuenta admin y las identidades testnet ya configuradas para generar comandos de grant y revoke por rol."
                : "This block uses the live RBAC contract, the admin account, and the configured testnet identities to generate role grant and revoke commands."}
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <MetricCard
                label={locale === "es" ? "Admin activo" : "Active admin"}
                value={shortValue(superAdminActionPack.adminAccount)}
                tone="sky"
              />
              <MetricCard
                label={locale === "es" ? "Alias fuente" : "Source alias"}
                value={superAdminActionPack.sourceAlias}
                tone="stone"
              />
              <MetricCard
                label={locale === "es" ? "Contrato RBAC" : "RBAC contract"}
                value={shortValue(superAdminActionPack.contractId ?? "pending")}
                tone="violet"
              />
              <MetricCard
                label={locale === "es" ? "Plantillas de rol" : "Role templates"}
                value={String(superAdminActionPack.roleTemplates.length)}
                tone="emerald"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-stone-400">
              {locale === "es" ? "Admin payload" : "Admin payload"}
            </p>
            <h2 className="mt-2 font-display text-4xl leading-tight text-stone-50">
              {locale === "es"
                ? "JSON y handoff del superadmin."
                : "Superadmin JSON and handoff."}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300">
              {locale === "es"
                ? "Con esto ya puedes copiar el pack completo del admin o abrir el endpoint backend-first para que otra UI lo consuma."
                : "You can now copy the full admin pack or open the backend-first endpoint so another UI can consume it."}
            </p>
            <ActionBridgeTools
              locale={locale}
              command={superAdminActionPack.roleTemplates.map((item) => item.grantCommand).join("\n\n")}
              payloadBase64={superAdminActionPack.payloadBase64}
              apiPath="/api/trustleaf/actor-bridges/superadmin"
            />
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-emerald-200/10 bg-[#0b1513]/92 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">
            {locale === "es" ? "Approval templates" : "Approval templates"}
          </p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-emerald-50">
            {locale === "es"
              ? "Grant y revoke listos por actor."
              : "Grant and revoke packs by actor."}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {superAdminActionPack.roleTemplates.map((template) => (
              <article
                key={template.key}
                className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
                      {template.label}
                    </p>
                    <h3 className="mt-3 text-2xl text-stone-50">{shortValue(template.account)}</h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] ${
                      template.isActive
                        ? "bg-emerald-300/15 text-emerald-100"
                        : "bg-amber-300/15 text-amber-100"
                    }`}
                  >
                    {template.isActive ? "live" : copy.queueStatus}
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm leading-6 text-stone-300">
                  <p>{copy.role}: {template.role}</p>
                  <p>{copy.account}: {template.account}</p>
                </div>
                <div className="mt-5 rounded-[1.3rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Grant</p>
                  <p className="mt-3 break-all text-sm leading-6 text-stone-100">{template.grantCommand}</p>
                </div>
                <div className="mt-4 rounded-[1.3rem] border border-white/8 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Revoke</p>
                  <p className="mt-3 break-all text-sm leading-6 text-stone-100">{template.revokeCommand}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "emerald" | "sky" | "stone" | "violet";
}) {
  const toneClass = {
    amber: "border-amber-300/10 bg-amber-300/10 text-amber-100",
    emerald: "border-emerald-300/10 bg-emerald-300/10 text-emerald-100",
    sky: "border-sky-300/10 bg-sky-300/10 text-sky-100",
    stone: "border-white/10 bg-white/5 text-stone-100",
    violet: "border-violet-300/10 bg-violet-300/10 text-violet-100",
  }[tone];

  return (
    <article className={`rounded-[1.6rem] border p-5 ${toneClass}`}>
      <p className="text-sm leading-6 opacity-75">{label}</p>
      <p className="font-display mt-3 text-4xl leading-none">{value}</p>
    </article>
  );
}

function ActionCard({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="rounded-[1.7rem] border border-white/8 bg-black/15 p-5 text-base text-stone-100 transition hover:bg-white/5"
    >
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
