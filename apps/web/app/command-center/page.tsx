import Link from "next/link";

import { ActionBridgeTools } from "../action-bridge-tools";
import { CommandCenterRedesign } from "./command-center-redesign";
import { LanguageSwitcher } from "../language-switcher";
import { getCommandCenterCopy, getPipelineSteps } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import {
  getTrustLeafDispensaryActionPack,
  getTrustLeafDoctorActionPack,
  getTrustLeafPatientActionPack,
  getTrustLeafSuperAdminActionPack,
} from "../lib/trustleaf/actionRails";
import { getTrustLeafDeployment } from "../lib/trustleaf/deployment";
import { getIndexedState } from "../lib/trustleaf/indexedState";
import { getTrustLeafLiveReadiness } from "../lib/trustleaf/liveReadiness";

export default async function CommandCenterPage() {
  const locale = await getLocale();
  const copy = getCommandCenterCopy(locale);
  const pipelineSteps = getPipelineSteps(locale);
  const [
    indexedState,
    deployment,
    patientActionPack,
    doctorActionPack,
    dispensaryActionPack,
    superAdminActionPack,
    liveReadiness,
  ] = await Promise.all([
    getIndexedState(),
    getTrustLeafDeployment(),
    getTrustLeafPatientActionPack(),
    getTrustLeafDoctorActionPack(null),
    getTrustLeafDispensaryActionPack(null),
    getTrustLeafSuperAdminActionPack(),
    Promise.resolve(getTrustLeafLiveReadiness()),
  ]);
  const latestBatch = indexedState.batches[0] ?? null;
  const latestPrescription = indexedState.prescriptions[0] ?? null;
  const opsCopy =
    locale === "es"
      ? {
          eyebrow: "Ops room",
          title: "Los cuatro rails ya se pueden orquestar desde un solo punto.",
          body: "Este tablero junta lectura indexada, bridges operativos y accesos rapidos para paciente, medico, dispensario y superadmin. Sirve para demo, para operacion y para handoffs futuros de frontend.",
          patient: "Paciente",
          patientBody:
            "Ve el estado de la receta activa, el medico asignado y el dispensario listo antes de abrir el flujo final.",
          patientStatusReady: "listo para handoff",
          patientStatusConsumed: "ya consumida",
          patientStatusMissing: "sin receta activa",
          doctor: "Medico",
          doctorBody:
            "Prepara una emision real de receta privada con command pack, payload base64 y sugerencias de commitment.",
          dispensary: "Dispensario",
          dispensaryBody:
            "Prepara el verify_and_consume live con el fixture actual y revisa si coincide con la receta pendiente.",
          superadmin: "Superadmin",
          superadminBody:
            "Opera RBAC con grants y revokes reales para sostener una red curada de actores aprobados.",
          openLane: "Abrir POV",
          openApi: "Abrir API",
          status: "Estado",
          route: "Ruta",
          doctorAccount: "Cuenta medica",
          dispensaryAccount: "Cuenta dispensario",
          adminAccount: "Cuenta admin",
          prescription: "Receta",
          patientNullifier: "Nullifier",
          script: "Script",
          roleTemplates: "Templates RBAC",
          match: "Match fixture",
          yes: "si",
          no: "no",
        }
      : {
          eyebrow: "Ops room",
          title: "All four rails can now be orchestrated from one place.",
          body: "This board combines indexed read models, operational bridges, and quick access for patient, doctor, dispensary, and superadmin. It is useful for demos, operations, and future frontend handoffs.",
          patient: "Patient",
          patientBody:
            "Inspect the active prescription, assigned doctor, and ready dispensary before opening the final flow.",
          patientStatusReady: "ready for handoff",
          patientStatusConsumed: "already consumed",
          patientStatusMissing: "no active prescription",
          doctor: "Doctor",
          doctorBody:
            "Prepare a real private prescription issuance with a command pack, base64 payload, and suggested commitment.",
          dispensary: "Dispensary",
          dispensaryBody:
            "Prepare the live verify_and_consume action with the current fixture and check whether it matches the pending prescription.",
          superadmin: "Superadmin",
          superadminBody:
            "Operate RBAC with live grants and revokes to sustain a curated network of approved operators.",
          openLane: "Open POV",
          openApi: "Open API",
          status: "Status",
          route: "Route",
          doctorAccount: "Doctor account",
          dispensaryAccount: "Dispensary account",
          adminAccount: "Admin account",
          prescription: "Prescription",
          patientNullifier: "Nullifier",
          script: "Script",
          roleTemplates: "RBAC templates",
          match: "Fixture match",
          yes: "yes",
          no: "no",
        };

  return (
    <CommandCenterRedesign
      locale={locale}
      copy={copy}
      pipelineSteps={pipelineSteps}
      indexedState={indexedState}
      deployment={deployment}
      patientActionPack={patientActionPack}
      doctorActionPack={doctorActionPack}
      dispensaryActionPack={dispensaryActionPack}
      superAdminActionPack={superAdminActionPack}
      liveReadiness={liveReadiness}
    />
  );
}

function LegacyCommandCenterPage({
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
  locale: "en" | "es";
  copy: ReturnType<typeof getCommandCenterCopy>;
  pipelineSteps: ReturnType<typeof getPipelineSteps>;
  indexedState: Awaited<ReturnType<typeof getIndexedState>>;
  deployment: Awaited<ReturnType<typeof getTrustLeafDeployment>>;
  patientActionPack: Awaited<ReturnType<typeof getTrustLeafPatientActionPack>>;
  doctorActionPack: Awaited<ReturnType<typeof getTrustLeafDoctorActionPack>>;
  dispensaryActionPack: Awaited<ReturnType<typeof getTrustLeafDispensaryActionPack>>;
  superAdminActionPack: Awaited<ReturnType<typeof getTrustLeafSuperAdminActionPack>>;
}) {
  const latestBatch = indexedState.batches[0] ?? null;
  const latestPrescription = indexedState.prescriptions[0] ?? null;
  const opsCopy =
    locale === "es"
      ? {
          eyebrow: "Ops room",
          title: "Los cuatro rails ya se pueden orquestar desde un solo punto.",
          body: "Este tablero junta lectura indexada, bridges operativos y accesos rapidos para paciente, medico, dispensario y superadmin. Sirve para demo, para operacion y para handoffs futuros de frontend.",
          patient: "Paciente",
          patientBody:
            "Ve el estado de la receta activa, el medico asignado y el dispensario listo antes de abrir el flujo final.",
          patientStatusReady: "listo para handoff",
          patientStatusConsumed: "ya consumida",
          patientStatusMissing: "sin receta activa",
          doctor: "Medico",
          doctorBody:
            "Prepara una emision real de receta privada con command pack, payload base64 y sugerencias de commitment.",
          dispensary: "Dispensario",
          dispensaryBody:
            "Prepara el verify_and_consume live con el fixture actual y revisa si coincide con la receta pendiente.",
          superadmin: "Superadmin",
          superadminBody:
            "Opera RBAC con grants y revokes reales para sostener una red curada de actores aprobados.",
          openLane: "Abrir POV",
          openApi: "Abrir API",
          status: "Estado",
          route: "Ruta",
          doctorAccount: "Cuenta medica",
          dispensaryAccount: "Cuenta dispensario",
          adminAccount: "Cuenta admin",
          prescription: "Receta",
          patientNullifier: "Nullifier",
          script: "Script",
          roleTemplates: "Templates RBAC",
          match: "Match fixture",
          yes: "si",
          no: "no",
        }
      : {
          eyebrow: "Ops room",
          title: "All four rails can now be orchestrated from one place.",
          body: "This board combines indexed read models, operational bridges, and quick access for patient, doctor, dispensary, and superadmin. It is useful for demos, operations, and future frontend handoffs.",
          patient: "Patient",
          patientBody:
            "Inspect the active prescription, assigned doctor, and ready dispensary before opening the final flow.",
          patientStatusReady: "ready for handoff",
          patientStatusConsumed: "already consumed",
          patientStatusMissing: "no active prescription",
          doctor: "Doctor",
          doctorBody:
            "Prepare a real private prescription issuance with a command pack, base64 payload, and suggested commitment.",
          dispensary: "Dispensary",
          dispensaryBody:
            "Prepare the live verify_and_consume action with the current fixture and check whether it matches the pending prescription.",
          superadmin: "Superadmin",
          superadminBody:
            "Operate RBAC with live grants and revokes to sustain a curated network of approved operators.",
          openLane: "Open POV",
          openApi: "Open API",
          status: "Status",
          route: "Route",
          doctorAccount: "Doctor account",
          dispensaryAccount: "Dispensary account",
          adminAccount: "Admin account",
          prescription: "Prescription",
          patientNullifier: "Nullifier",
          script: "Script",
          roleTemplates: "RBAC templates",
          match: "Fixture match",
          yes: "yes",
          no: "no",
        };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07100d_0%,#091612_40%,#0d1f18_100%)] text-stone-100">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>
        <div className="flex flex-col gap-5 rounded-[2rem] border border-emerald-200/10 bg-black/20 p-8 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/75">
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl text-emerald-50 md:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300">
              {copy.body}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/api/indexed-state"
              className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
            >
              {copy.openJson}
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-emerald-200/40 hover:bg-white/5"
            >
              {copy.back}
            </Link>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-cyan-200/10 bg-[#08131d]/88 p-6">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/70">
              {opsCopy.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl text-cyan-50 md:text-4xl">{opsCopy.title}</h2>
            <p className="mt-4 text-base leading-7 text-stone-300">{opsCopy.body}</p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <section className="rounded-[1.8rem] border border-white/8 bg-black/15 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">
                    {opsCopy.patient}
                  </p>
                  <h3 className="mt-3 text-2xl text-stone-50">{opsCopy.patient}</h3>
                </div>
                <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-100">
                  {patientActionPack.prescriptionStatus === "ready"
                    ? opsCopy.patientStatusReady
                    : patientActionPack.prescriptionStatus === "consumed"
                      ? opsCopy.patientStatusConsumed
                      : opsCopy.patientStatusMissing}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">{opsCopy.patientBody}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MetricCard
                  label={opsCopy.prescription}
                  value={patientActionPack.prescriptionId ?? copy.pending}
                />
                <MetricCard
                  label={opsCopy.patientNullifier}
                  value={patientActionPack.patientNullifier ?? copy.pending}
                />
                <MetricCard
                  label={opsCopy.doctorAccount}
                  value={patientActionPack.doctorAccount ?? copy.pending}
                />
                <MetricCard
                  label={opsCopy.dispensaryAccount}
                  value={patientActionPack.dispensaryAccount ?? copy.pending}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/patient"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  {opsCopy.openLane}
                </Link>
                <Link
                  href="/api/trustleaf/actor-bridges/patient"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {opsCopy.openApi}
                </Link>
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-white/8 bg-black/15 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
                    {opsCopy.doctor}
                  </p>
                  <h3 className="mt-3 text-2xl text-stone-50">{opsCopy.doctor}</h3>
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">
                  {shortHash(doctorActionPack.doctorAccount)}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">{opsCopy.doctorBody}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MetricCard label={opsCopy.doctorAccount} value={doctorActionPack.doctorAccount} />
                <MetricCard
                  label={opsCopy.prescription}
                  value={doctorActionPack.suggestedCommitment}
                />
                <MetricCard
                  label={opsCopy.patientNullifier}
                  value={doctorActionPack.suggestedPatientNullifier}
                />
                <MetricCard label={opsCopy.script} value={doctorActionPack.scriptPath} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/doctor"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {opsCopy.openLane}
                </Link>
              </div>
              <ActionBridgeTools
                locale={locale}
                command={doctorActionPack.scriptCommand}
                payloadBase64={doctorActionPack.payloadBase64}
                apiPath="/api/trustleaf/actor-bridges/doctor"
              />
            </section>

            <section className="rounded-[1.8rem] border border-white/8 bg-black/15 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-300/70">
                    {opsCopy.dispensary}
                  </p>
                  <h3 className="mt-3 text-2xl text-stone-50">{opsCopy.dispensary}</h3>
                </div>
                <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-100">
                  {opsCopy.match}:{" "}
                  {dispensaryActionPack.matchesPendingPrescription ? opsCopy.yes : opsCopy.no}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">{opsCopy.dispensaryBody}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MetricCard
                  label={opsCopy.dispensaryAccount}
                  value={dispensaryActionPack.dispensaryAccount}
                />
                <MetricCard
                  label={opsCopy.prescription}
                  value={dispensaryActionPack.pendingPrescriptionId ?? copy.pending}
                />
                <MetricCard
                  label={opsCopy.match}
                  value={
                    dispensaryActionPack.matchesPendingPrescription ? opsCopy.yes : opsCopy.no
                  }
                />
                <MetricCard label={opsCopy.script} value={dispensaryActionPack.scriptPath} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/dispensary"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {opsCopy.openLane}
                </Link>
              </div>
              <ActionBridgeTools
                locale={locale}
                command={dispensaryActionPack.scriptCommand}
                payloadBase64={dispensaryActionPack.payloadBase64}
                apiPath="/api/trustleaf/actor-bridges/dispensary"
              />
            </section>

            <section className="rounded-[1.8rem] border border-white/8 bg-black/15 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-violet-300/70">
                    {opsCopy.superadmin}
                  </p>
                  <h3 className="mt-3 text-2xl text-stone-50">{opsCopy.superadmin}</h3>
                </div>
                <span className="rounded-full bg-violet-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-100">
                  {superAdminActionPack.roleTemplates.length} {opsCopy.roleTemplates}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-stone-300">{opsCopy.superadminBody}</p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <MetricCard label={opsCopy.adminAccount} value={superAdminActionPack.adminAccount} />
                <MetricCard label={copy.contractId} value={superAdminActionPack.contractId ?? copy.pending} />
                <MetricCard label={copy.sourceAccount} value={superAdminActionPack.sourceAlias} />
                <MetricCard
                  label={opsCopy.roleTemplates}
                  value={String(superAdminActionPack.roleTemplates.length)}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/superadmin"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {opsCopy.openLane}
                </Link>
              </div>
              <ActionBridgeTools
                locale={locale}
                command={superAdminActionPack.roleTemplates
                  .map((template) => template.grantCommand)
                  .join("\n\n")}
                payloadBase64={superAdminActionPack.payloadBase64}
                apiPath="/api/trustleaf/actor-bridges/superadmin"
              />
            </section>
          </div>
        </section>

        <div className="mt-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-emerald-200/10 bg-[#091512]/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">
                  {copy.batchProvenance}
                </p>
                <h2 className="mt-2 text-3xl text-emerald-50">{copy.publicQualityTrail}</h2>
              </div>
              <span className="rounded-full bg-emerald-300/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-emerald-200">
                {latestBatch?.status ?? copy.pending}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MetricCard label={copy.cultivator} value={latestBatch?.cultivator ?? copy.pending} />
              <MetricCard label={copy.lab} value={latestBatch?.lab ?? copy.pending} />
              <MetricCard label={copy.eventsIndexed} value={String(latestBatch?.eventCount ?? 0)} />
            </div>

            <div className="mt-6 space-y-4">
              {indexedState.batchTimeline.length > 0 ? (
                indexedState.batchTimeline.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-2xl border border-white/8 bg-white/5 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/70">
                          {event.kind.replaceAll("_", " ")}
                        </p>
                        <h3 className="mt-2 text-xl text-stone-50">
                          {event.eventType ?? event.status ?? copy.milestone}
                        </h3>
                      </div>
                      <p className="text-sm text-stone-400">{copy.ledger} {event.ledger}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-300">
                      {copy.actor}: {event.actor ?? copy.system} | {copy.documentHash}: {shortHash(event.documentHash)}
                    </p>
                  </article>
                ))
              ) : (
                <EmptyState title={copy.noIndexedData} body={copy.waitingForFirstIngest} />
              )}
            </div>
          </section>

          <div className="grid gap-5">
            <section className="rounded-[2rem] border border-amber-200/10 bg-[#17120a]/90 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-300/70">
                {copy.lifecycle}
              </p>
              <h2 className="mt-2 text-3xl text-amber-50">{copy.privateByDesign}</h2>
              <div className="mt-6 grid gap-4">
                {indexedState.prescriptions.length > 0 ? (
                  indexedState.prescriptions.map((rx) => (
                    <article
                      key={rx.id}
                      className="rounded-2xl border border-white/8 bg-black/15 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm uppercase tracking-[0.18em] text-amber-200/80">
                          {shortHash(rx.id)}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                            rx.isUsed
                              ? "bg-emerald-300/15 text-emerald-200"
                              : "bg-white/10 text-stone-200"
                          }`}
                        >
                          {rx.isUsed ? copy.consumed : copy.reserved}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-stone-300">
                        {copy.doctor}: {rx.doctor}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-stone-300">
                        {copy.nullifier}: {shortHash(rx.patientNullifier)}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-stone-300">
                        {copy.lastVerifier}: {rx.lastVerifiedBy ?? copy.waitingCheckout}
                      </p>
                    </article>
                  ))
                ) : (
                  <EmptyState title={copy.noIndexedData} body={copy.waitingForFirstIngest} />
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-sky-200/10 bg-[#0b141b]/90 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300/70">{copy.walletlessFlow}</p>
              <h2 className="mt-2 text-3xl text-sky-50">{copy.uxPipeline}</h2>
              <div className="mt-6 space-y-4">
                {pipelineSteps.map((step) => (
                  <div key={step.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base text-stone-100">{step.label}</p>
                      <span className="rounded-full bg-sky-300/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-200">
                        {step.state}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-300">{step.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/70">
                {copy.receipts}
              </p>
              <h2 className="mt-2 text-3xl text-emerald-50">
                {copy.history}
              </h2>
            </div>
            <p className="text-sm text-stone-400">
              {copy.latestProof}: {latestPrescription ? shortHash(latestPrescription.id) : copy.noIndexedData}
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {indexedState.prescriptionConsumptions.length > 0 ? (
              indexedState.prescriptionConsumptions.map((receipt) => (
                <article
                  key={receipt.id}
                  className="rounded-2xl border border-white/8 bg-black/15 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
                    {copy.receipt} {receipt.id}
                  </p>
                  <h3 className="mt-3 text-xl text-stone-50">{receipt.caller}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-300">
                    {copy.prescription}: {shortHash(receipt.prescriptionId)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-300">
                    {copy.patientNullifier}: {shortHash(receipt.patientNullifier)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-400">
                    {copy.ledger} {receipt.ledger} | {copy.log} {receipt.logIndex}
                  </p>
                </article>
              ))
            ) : (
              <EmptyState title={copy.noIndexedData} body={copy.waitingForFirstIngest} />
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-violet-200/10 bg-[#0d1018]/90 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-violet-300/70">
                {copy.testnetBridge}
              </p>
              <h2 className="mt-2 text-3xl text-violet-50">{copy.deploymentTruth}</h2>
            </div>
            <Link
              href="/api/trustleaf/deployment"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-violet-200/40 hover:bg-white/5"
            >
              {copy.openDeploymentJson}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <MetricCard label={copy.source} value={deployment.source} />
            <MetricCard label={copy.liveContracts} value={String(deployment.contracts.filter((contract) => contract.status === "live").length)} />
            <MetricCard label={copy.sourceAccount} value={deployment.sourceAccount ?? copy.pending} />
            <MetricCard label={copy.manifestPath} value={deployment.manifestPath ?? copy.notConfigured} />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {deployment.contracts.map((contract) => (
              <article
                key={contract.key}
                className="rounded-2xl border border-white/8 bg-black/15 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-violet-300/70">
                      {contract.alias}
                    </p>
                    <h3 className="mt-2 text-xl text-stone-50">{contract.package}</h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                      contract.status === "live"
                        ? "bg-emerald-300/15 text-emerald-200"
                        : contract.status === "configured"
                          ? "bg-amber-300/15 text-amber-200"
                          : "bg-white/10 text-stone-200"
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>
                <p className="mt-4 break-all text-sm leading-6 text-stone-300">
                  {copy.contractId}: {contract.contractId ?? copy.pendingDeployment}
                </p>
                <p className="mt-2 break-all text-sm leading-6 text-stone-400">
                  {copy.wasmHash}: {contract.wasmHash ?? copy.pendingUpload}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <p className="text-sm text-stone-300">{label}</p>
      <p className="mt-3 text-lg break-all text-emerald-50">{value}</p>
    </div>
  );
}

function shortHash(value: string) {
  if (value.length <= 18) {
    return value;
  }
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-stone-400">{title}</p>
      <p className="mt-3 text-sm leading-6 text-stone-300">{body}</p>
    </div>
  );
}
