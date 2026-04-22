import Link from "next/link";

import { ActorNav } from "../actor-nav";
import { LanguageSwitcher } from "../language-switcher";
import { getPatientPageCopy } from "../lib/i18n";
import { getLocale } from "../lib/locale";
import { getTrustLeafPatientActionPack } from "../lib/trustleaf/actionRails";
import { getIndexedState } from "../lib/trustleaf/indexedState";

export default async function PatientPage() {
  const locale = await getLocale();
  const copy = getPatientPageCopy(locale);
  const indexedState = await getIndexedState();

  const activeDoctors = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DOCTOR"),
  );
  const activeDispensaries = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DISP"),
  );
  const activePrescription =
    indexedState.prescriptions.find((prescription) => !prescription.isUsed) ??
    indexedState.prescriptions[0] ??
    null;
  const doctorProfiles = buildDoctorProfiles(locale, activeDoctors);
  const catalogCards = buildCatalogCards(locale, indexedState.batches, activeDispensaries);
  const patientActionPack = await getTrustLeafPatientActionPack();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0e8] text-stone-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(125,204,169,0.24),transparent_22%),radial-gradient(circle_at_88%_12%,rgba(255,194,107,0.2),transparent_20%),linear-gradient(180deg,#f7f2ea_0%,#ece7db_40%,#ebe6dc_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:py-10">
        <header className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-900 text-sm font-semibold text-emerald-50">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-stone-950">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-stone-500">
                  Patient lane
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950"
              >
                {copy.back}
              </Link>
              <Link
                href="/walletless"
                className="rounded-full px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-900/5 hover:text-stone-950"
              >
                {copy.openWalletless}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link
                href="/walletless"
                className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800"
              >
                {copy.finalCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-[2.8rem] border border-stone-900/10 bg-[linear-gradient(135deg,rgba(18,45,34,0.98),rgba(42,72,52,0.9)_42%,rgba(245,240,232,0.96))] px-6 py-8 shadow-[0_28px_120px_rgba(42,34,24,0.16)] md:px-8 md:py-10 xl:px-10">
          <div className="grid gap-10 xl:grid-cols-[1fr_0.92fr] xl:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-50">
                <span className="h-2 w-2 rounded-full bg-emerald-300 hero-pulse" />
                {copy.heroStatus}
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] text-emerald-100/70">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-4xl text-6xl leading-[0.95] text-white md:text-7xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100/90">{copy.body}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="#find-care"
                  className="rounded-full bg-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
                >
                  {copy.bookCta}
                </Link>
                <Link
                  href="#inventory"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  {copy.reviewTrail}
                </Link>
              </div>

              <ActorNav current="patient" locale={locale} />
            </div>

            <aside className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              <HeroMetricCard
                label={copy.activePrescription}
                value={activePrescription ? (activePrescription.isUsed ? copy.statusConsumed : copy.statusReady) : "--"}
                tone="emerald"
              />
              <HeroMetricCard
                label={copy.verifiedDoctors}
                value={String(activeDoctors.length)}
                tone="sky"
              />
              <HeroMetricCard
                label={copy.verifiedDispensaries}
                value={String(activeDispensaries.length)}
                tone="amber"
              />
              <HeroMetricCard
                label={copy.liveProducts}
                value={String(catalogCards.length)}
                tone="stone"
              />
            </aside>
          </div>
        </section>

        <section id="find-care" className="mt-10 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2.2rem] border border-stone-900/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">{copy.consultEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {copy.consultTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">{copy.consultBody}</p>

            <div className="mt-6 rounded-[1.8rem] border border-emerald-900/10 bg-emerald-900 px-5 py-5 text-emerald-50">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/75">{copy.nextConsult}</p>
              <p className="font-display mt-3 text-4xl">{copy.nextConsultValue}</p>
            </div>
          </div>

          <div className="grid gap-4">
            {doctorProfiles.map((doctor) => (
              <article
                key={doctor.id}
                className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.68))] p-5 shadow-[0_12px_44px_rgba(32,26,20,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{copy.doctorRail}</p>
                    <h3 className="mt-3 font-display text-3xl text-stone-950">{doctor.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-stone-600">{doctor.specialty}</p>
                  </div>
                  <span className="rounded-full bg-emerald-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-900">
                    {copy.doctorAvailable}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <InfoChip label={copy.doctorResponse} value={doctor.responseWindow} />
                  <InfoChip label={copy.doctorJurisdiction} value={doctor.jurisdiction} />
                  <InfoChip label="Account" value={shortValue(doctor.account)} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[0.96fr_1.04fr]">
          <div className="rounded-[2.2rem] border border-amber-900/10 bg-[linear-gradient(180deg,rgba(255,251,244,0.94),rgba(250,241,222,0.92))] p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-700">{copy.prescriptionEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {copy.prescriptionTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">{copy.prescriptionBody}</p>

            {activePrescription ? (
              <div className="mt-6 rounded-[1.9rem] border border-amber-900/10 bg-white/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-amber-700">{copy.prescriptionLive}</p>
                    <h3 className="mt-3 font-display text-4xl text-stone-950">
                      {activePrescription.isUsed ? copy.statusConsumed : copy.statusReady}
                    </h3>
                  </div>
                  <span className="rounded-full bg-amber-900/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-amber-950">
                    {activePrescription.isUsed ? copy.statusConsumed : copy.statusReady}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <InfoChip label={copy.doctor} value={shortValue(activePrescription.doctor)} />
                  <InfoChip label={copy.nullifier} value={shortHash(activePrescription.patientNullifier)} />
                  <InfoChip label={copy.policy} value={shortHash(activePrescription.policyHash)} />
                  <InfoChip
                    label={copy.issuanceLedger}
                    value={String(activePrescription.createdAtLedger)}
                  />
                  <InfoChip
                    label={copy.consumptionLedger}
                    value={
                      activePrescription.consumedAtLedger
                        ? String(activePrescription.consumedAtLedger)
                        : copy.waitingUse
                    }
                  />
                  <InfoChip label="Commitment" value={shortHash(activePrescription.id)} />
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[1.9rem] border border-amber-900/10 bg-white/70 p-5 text-sm text-stone-700">
                {copy.waitingUse}
              </div>
            )}
          </div>

          <div className="rounded-[2.2rem] border border-stone-900/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">{copy.journeyEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {copy.journeyTitle}
            </h2>
            <div className="mt-6 grid gap-4">
              {[copy.stepFind, copy.stepPrescription, copy.stepInventory, copy.stepSponsor].map((step, index) => (
                <article
                  key={step}
                  className="rounded-[1.7rem] border border-stone-900/10 bg-stone-950 px-5 py-5 text-stone-100"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-400">0{index + 1}</p>
                  <p className="mt-3 text-lg leading-8">{step}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="rounded-[2.2rem] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(244,252,247,0.96),rgba(232,246,236,0.92))] p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">
              {locale === "es" ? "Live handoff" : "Live handoff"}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {locale === "es"
                ? "Tu ruta real desde consulta hasta retiro."
                : "Your real route from consult to pickup."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">
              {locale === "es"
                ? "Este bloque une los rails del medico, la receta privada y el dispensario ya aprobados en testnet para que el paciente entienda el siguiente paso sin leer complejidad blockchain."
                : "This block connects the doctor, private prescription, and approved dispensary rails already live on testnet so the patient can understand the next step without reading blockchain complexity."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.7rem] border border-emerald-900/10 bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
                  {locale === "es" ? "Doctor listo" : "Doctor ready"}
                </p>
                <p className="mt-3 font-display text-3xl text-stone-950">
                  {patientActionPack.doctorAccount ? shortValue(patientActionPack.doctorAccount) : "--"}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {locale === "es"
                    ? "El rail clinico ya puede emitir la receta privada que se ancla en Soroban."
                    : "The clinical rail can already issue the private prescription anchored on Soroban."}
                </p>
                <Link
                  href={patientActionPack.doctorRoute}
                  className="mt-5 inline-flex rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800"
                >
                  {locale === "es" ? "Ver POV medico" : "Open doctor POV"}
                </Link>
              </article>

              <article className="rounded-[1.7rem] border border-amber-900/10 bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-700">
                  {locale === "es" ? "Receta activa" : "Active prescription"}
                </p>
                <p className="mt-3 font-display text-3xl text-stone-950">
                  {patientActionPack.prescriptionStatus === "ready"
                    ? locale === "es"
                      ? "Lista"
                      : "Ready"
                    : patientActionPack.prescriptionStatus === "consumed"
                      ? locale === "es"
                        ? "Consumida"
                        : "Consumed"
                      : "--"}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {patientActionPack.prescriptionId
                    ? shortHash(patientActionPack.prescriptionId)
                    : locale === "es"
                      ? "Aun sin receta activa"
                      : "No active prescription yet"}
                </p>
                <div className="mt-4 grid gap-3">
                  <InfoChip
                    label={copy.issuanceLedger}
                    value={
                      patientActionPack.createdAtLedger
                        ? String(patientActionPack.createdAtLedger)
                        : copy.waitingUse
                    }
                  />
                  <InfoChip
                    label={copy.nullifier}
                    value={
                      patientActionPack.patientNullifier
                        ? shortHash(patientActionPack.patientNullifier)
                        : copy.waitingUse
                    }
                  />
                </div>
              </article>

              <article className="rounded-[1.7rem] border border-sky-900/10 bg-white/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-sky-700">
                  {locale === "es" ? "Dispensario listo" : "Dispensary ready"}
                </p>
                <p className="mt-3 font-display text-3xl text-stone-950">
                  {patientActionPack.dispensaryAccount
                    ? shortValue(patientActionPack.dispensaryAccount)
                    : "--"}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {locale === "es"
                    ? "El dispensario ya tiene un bridge listo para validar y consumir la receta al momento del retiro."
                    : "The dispensary already has a bridge ready to validate and consume the prescription at pickup time."}
                </p>
                <Link
                  href={patientActionPack.dispensaryRoute}
                  className="mt-5 inline-flex rounded-full border border-sky-900/15 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-900/5"
                >
                  {locale === "es" ? "Ver POV dispensario" : "Open dispensary POV"}
                </Link>
              </article>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-stone-900/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(32,26,20,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">
              {locale === "es" ? "Patient next step" : "Patient next step"}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-950">
              {locale === "es"
                ? "Entrar con passkey y cerrar el recorrido."
                : "Enter with passkey and close the journey."}
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-600">
              {locale === "es"
                ? "Cuando el paciente entra por passkeys, el rail wallet-less queda listo para sponsor fee, recibir updates de sesion y preparar un checkout simple."
                : "When the patient enters through passkeys, the wallet-less rail is ready for fee sponsorship, session updates, and a simple checkout handoff."}
            </p>

            <div className="mt-6 grid gap-4">
              {[
                locale === "es"
                  ? "1. Elige medico aprobado y abre la consulta."
                  : "1. Choose an approved doctor and open the consult.",
                locale === "es"
                  ? "2. Recibe la receta privada y sigue su vigencia."
                  : "2. Receive the private prescription and track its validity.",
                locale === "es"
                  ? "3. Revisa inventario y confirma el dispensario."
                  : "3. Review inventory and confirm the dispensary.",
                locale === "es"
                  ? "4. Entra con passkey para completar el lane patrocinado."
                  : "4. Enter with a passkey to complete the sponsored lane.",
              ].map((step) => (
                <article
                  key={step}
                  className="rounded-[1.6rem] border border-stone-900/10 bg-stone-950 px-5 py-4 text-stone-100"
                >
                  <p className="text-base leading-8">{step}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={patientActionPack.walletlessRoute}
                className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-800"
              >
                {copy.finalCta}
              </Link>
              <Link
                href={patientActionPack.doctorRoute}
                className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5"
              >
                {locale === "es" ? "Abrir medico" : "Open doctor"}
              </Link>
              <Link
                href={patientActionPack.dispensaryRoute}
                className="rounded-full border border-stone-900/10 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-900/5"
              >
                {locale === "es" ? "Abrir dispensario" : "Open dispensary"}
              </Link>
            </div>
          </div>
        </section>

        <section id="inventory" className="mt-10 rounded-[2.3rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(24,31,28,0.98),rgba(18,23,20,0.98))] p-6 shadow-[0_22px_90px_rgba(20,18,16,0.12)]">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/70">{copy.inventoryEyebrow}</p>
            <h2 className="font-display mt-3 text-5xl leading-[0.96] text-stone-50">
              {copy.inventoryTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-stone-300">{copy.inventoryBody}</p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {catalogCards.map((card) => (
              <article
                key={card.id}
                className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
                      {card.dispensary}
                    </p>
                    <h3 className="mt-3 font-display text-4xl leading-tight text-stone-50">
                      {card.name}
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">
                    {copy.readyForPickup}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-300">{card.description}</p>
                <div className="mt-5 grid gap-3">
                  <InfoChipDark label={copy.batchStatus} value={card.batchStatus} />
                  <InfoChipDark label={copy.labVerified} value={card.lab} />
                  <InfoChipDark label={copy.provenance} value={card.provenance} />
                  <InfoChipDark label={copy.purchaseFlow} value={card.checkoutMode} />
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
    stone: "border-white/15 bg-white/10 text-stone-50",
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
    <div className="rounded-[1.3rem] border border-stone-900/10 bg-stone-900/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-stone-900">{value}</p>
    </div>
  );
}

function InfoChipDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-white/10 bg-black/15 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{label}</p>
      <p className="mt-2 break-all text-sm leading-6 text-stone-100">{value}</p>
    </div>
  );
}

function buildDoctorProfiles(
  locale: "en" | "es",
  memberships: Array<{ account: string; grantedAtLedger: number }>,
) {
  const seeds =
    locale === "es"
      ? [
          { name: "Dra. Valentina Rivera", specialty: "Dolor cronico y acompanamiento terapeutico", jurisdiction: "Chile", responseWindow: "< 2 h" },
          { name: "Dr. Tomas Andrade", specialty: "Neurologia funcional y seguimiento clinico", jurisdiction: "Argentina", responseWindow: "Hoy" },
          { name: "Dra. Camila Soto", specialty: "Sueño, ansiedad y medicina integrativa", jurisdiction: "Colombia", responseWindow: "< 24 h" },
        ]
      : [
          { name: "Dr. Valentina Rivera", specialty: "Chronic pain and therapeutic care", jurisdiction: "Chile", responseWindow: "< 2 h" },
          { name: "Dr. Tomas Andrade", specialty: "Functional neurology and clinical follow-up", jurisdiction: "Argentina", responseWindow: "Today" },
          { name: "Dr. Camila Soto", specialty: "Sleep, anxiety, and integrative medicine", jurisdiction: "Colombia", responseWindow: "< 24 h" },
        ];

  if (memberships.length === 0) {
    return seeds.map((seed, index) => ({
      id: `seed-${index}`,
      account: `pending-doctor-${index}`,
      ...seed,
    }));
  }

  return memberships.map((membership, index) => ({
    id: membership.account,
    account: membership.account,
    ...seeds[index % seeds.length],
  }));
}

function buildCatalogCards(
  locale: "en" | "es",
  batches: Array<{
    id: string;
    status: string;
    lab: string | null;
    latestDocumentHash: string;
  }>,
  dispensaries: Array<{ account: string }>,
) {
  const concepts =
    locale === "es"
      ? [
          {
            name: "Balance Day Oil",
            description: "Microdosis pensada para alivio funcional durante el dia, con trazabilidad visible antes de la compra.",
            checkoutMode: "Receta validada + retiro asistido",
          },
          {
            name: "Night Relief Gummies",
            description: "Presentacion orientada a descanso y estabilidad nocturna, lista para reservar desde el rail del paciente.",
            checkoutMode: "Reserva + confirmacion del dispensario",
          },
          {
            name: "Calm Vapor Cartridge",
            description: "Formato rapido de comparar para pacientes que priorizan disponibilidad, laboratorio y procedencia.",
            checkoutMode: "Checkout patrocinado",
          },
        ]
      : [
          {
            name: "Balance Day Oil",
            description: "Micro-dose format aimed at daytime relief, with visible traceability before purchase.",
            checkoutMode: "Validated prescription + assisted pickup",
          },
          {
            name: "Night Relief Gummies",
            description: "Format oriented to rest and evening stability, ready to reserve from the patient rail.",
            checkoutMode: "Reservation + dispensary confirmation",
          },
          {
            name: "Calm Vapor Cartridge",
            description: "Fast-to-compare format for patients prioritizing availability, lab evidence, and provenance.",
            checkoutMode: "Sponsored checkout",
          },
        ];

  return concepts.map((concept, index) => {
    const batch = batches[index % Math.max(batches.length, 1)];
    const dispensary = dispensaries[index % Math.max(dispensaries.length, 1)];

    return {
      id: `${concept.name}-${index}`,
      name: concept.name,
      description: concept.description,
      batchStatus: batch?.status ?? "Pending",
      lab: batch?.lab ? shortValue(batch.lab) : "Pending lab",
      provenance: batch ? shortHash(batch.latestDocumentHash) : "Awaiting traceability",
      dispensary: dispensary ? shortValue(dispensary.account) : "Trust Leaf partner",
      checkoutMode: concept.checkoutMode,
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
