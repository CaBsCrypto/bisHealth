import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "./language-switcher";
import { getMarketingData, type Locale } from "./lib/i18n";

type MarketingData = ReturnType<typeof getMarketingData>;

export function HomeRedesign({
  locale,
  marketing,
}: {
  locale: Locale;
  marketing: MarketingData;
}) {
  const copy = getLandingCopy(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5efe4] text-[#12261d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(61,126,94,0.14),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(201,156,70,0.18),transparent_20%),linear-gradient(180deg,#f7f2e8_0%,#efe8db_48%,#ece4d7_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
        <header className="rounded-full border border-[#163c30]/10 bg-white/72 px-4 py-3 shadow-[0_12px_40px_rgba(31,58,47,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#163c30] text-sm font-semibold text-[#eef5f1]">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-[#12261d]">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#62756d]">{copy.brandTag}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a href="#patient-flow" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navHow}</a>
              <a href="#professionals" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navProfessionals}</a>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navScript}</Link>
              <Link href="/command-center" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navCommand}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/patient" className="rounded-full bg-[#163c30] px-5 py-2.5 font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">{copy.navCta}</Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-[#163c30]/10 bg-[linear-gradient(145deg,#fffdf8,#f4ede0_58%,#eee5d8)] p-7 shadow-[0_30px_110px_rgba(31,58,47,0.10)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#163c30]/10 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#295847]">
              <span className="h-2 w-2 rounded-full bg-[#2e9d70]" />
              {copy.announcement}
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.34em] text-[#62756d]">{copy.eyebrow}</p>
            <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.94] text-[#12261d] md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#31453c] md:text-xl">{copy.body}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5a6d64]">{copy.supportingBody}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/patient" className="rounded-full bg-[#163c30] px-6 py-3 text-sm font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">{copy.primaryCta}</Link>
              <a href="#professionals" className="rounded-full border border-[#163c30]/12 bg-white/80 px-6 py-3 text-sm font-semibold text-[#163c30] transition hover:bg-white">{copy.secondaryCta}</a>
              <Link href="/demo-script" className="rounded-full border border-[#163c30]/12 bg-white/80 px-6 py-3 text-sm font-semibold text-[#163c30] transition hover:bg-white">{copy.scriptCta}</Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {marketing.signalStrip.map((signal) => (
                <span key={signal} className="rounded-full border border-[#163c30]/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#476056]">
                  {signal}
                </span>
              ))}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[2.4rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)] md:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.snapshotEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9] md:text-5xl">{copy.snapshotTitle}</h2>
              <p className="mt-4 text-base leading-7 text-[#d4e3db]">{copy.snapshotBody}</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {marketing.heroStats.map((stat) => (
                  <MetricTile key={stat.label} label={stat.label} value={stat.value} dark />
                ))}
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-[#163c30]/10 bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,58,47,0.08)]">
              <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.productionEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.productionTitle}</h2>
              <p className="mt-4 text-base leading-7 text-[#4a5e55]">{copy.productionBody}</p>

              <div className="mt-6 grid gap-3">
                {copy.productionLanes.map((lane) => (
                  <Link key={lane.href} href={lane.href} className="rounded-[1.7rem] border border-[#163c30]/10 bg-[#faf6ef] p-4 transition hover:bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-display text-2xl text-[#12261d]">{lane.title}</p>
                      <span className="rounded-full bg-[#163c30]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{copy.productionBadge}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#4d5f57]">{lane.body}</p>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="patient-flow" className="mt-24 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="rounded-[2.4rem] border border-[#163c30]/10 bg-white/82 p-7 shadow-[0_18px_70px_rgba(31,58,47,0.06)] md:p-8">
            <SectionLead eyebrow={copy.howEyebrow} title={copy.howTitle} body={copy.howBody} compact />
            <div className="mt-8 grid gap-4">
              {marketing.patientBenefits.slice(0, 3).map((card) => (
                <article key={card.name} className="rounded-[1.8rem] border border-[#163c30]/10 bg-[#faf6ef] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#62756d]">{card.name}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-[#12261d]">{card.headline}</h3>
                  <p className="mt-4 text-base leading-7 text-[#4b5e56]">{card.body}</p>
                </article>
              ))}
            </div>
          </article>

          <div className="grid gap-5">
            {marketing.patientJourney.map((step) => (
              <article key={step.step} className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/78 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-6xl leading-none text-[#a1ada7]">{step.step}</span>
                  <span className="rounded-full bg-[#163c30]/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#21483a]">{step.state}</span>
                </div>
                <h3 className="font-display mt-7 text-4xl leading-tight text-[#12261d]">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#4a5d54]">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="professionals" className="mt-24 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.4rem] border border-[#163c30]/10 bg-[#163c30] p-7 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)] md:p-8">
            <SectionLead eyebrow={copy.professionalsEyebrow} title={copy.professionalsTitle} body={copy.professionalsBody} compact dark />
            <div className="mt-8 grid gap-4">
              {marketing.networkRoles.filter((role) => role.href !== "/patient").map((role) => (
                <Link key={role.href} href={role.href} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-3xl text-[#f7fbf9]">{role.name}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#a8c9ba]">{copy.professionalsBadge}</span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-[#d5e3dc]">{role.detail}</p>
                  <p className="mt-5 text-sm font-semibold text-[#f7fbf9]">{role.cta}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2.4rem] border border-[#163c30]/10 bg-white/80 p-7 shadow-[0_18px_70px_rgba(31,58,47,0.06)] md:p-8">
            <SectionLead eyebrow={copy.proofEyebrow} title={copy.proofTitle} body={copy.proofBody} compact />
            <div className="mt-8 grid gap-4">
              {copy.proofPoints.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-[#163c30]/10 bg-[#faf6ef] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#62756d]">{item.metric}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-[#12261d]">{item.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[#4b5e56]">{item.body}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-24 rounded-[2.7rem] border border-[#163c30]/10 bg-[linear-gradient(135deg,#17392d,#244a3d_48%,#10261d)] p-8 text-[#edf5f0] shadow-[0_32px_120px_rgba(21,50,40,0.18)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#99c8b3]">{copy.finalEyebrow}</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl leading-[0.96] text-[#f6fbf8] md:text-6xl">{copy.finalTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#d5e3dc]">{copy.finalBody}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {copy.finalCtas.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#99c8b3]">{item.label}</p>
                  <p className="font-display mt-3 text-3xl text-[#f7fbf9]">{item.value}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function getLandingCopy(locale: Locale) {
  return locale === "es"
    ? {
        brandTag: "Red de confianza medicinal",
        navHow: "Ruta paciente",
        navProfessionals: "Red profesional",
        navScript: "Script demo",
        navCommand: "Ops",
        navCta: "Entrar",
        announcement: "MVP listo para presentacion y testnet",
        eyebrow: "Cannabis medicinal sin friccion cripto",
        title: "Encuentra medico, valida tu receta y compra medicina confiable desde una sola experiencia.",
        body: "Trust Leaf convierte un proceso fragmentado en un journey simple para el paciente y controlado para la red profesional.",
        supportingBody: "Passkeys para entrar. Recetas privadas para proteger salud. Trazabilidad visible para comprar con evidencia. Medicos y dispensarios aprobados manualmente por un superadmin.",
        primaryCta: "Entrar como paciente",
        secondaryCta: "Soy medico o dispensario",
        scriptCta: "Abrir script de demo",
        snapshotEyebrow: "Snapshot del MVP",
        snapshotTitle: "La infraestructura ya existe. Ahora la experiencia tiene que sentirse premium.",
        snapshotBody: "Contratos live, indexacion, sponsor fee y rails operativos ya estan montados. La prioridad actual es llevar todo eso a una UX mucho mas clara y presentable.",
        productionEyebrow: "Arquitectura de producto",
        productionTitle: "Cada actor entra en el momento correcto y con el nivel correcto de control.",
        productionBody: "Paciente autoservicio. Medico y dispensario con aprobacion manual. Superadmin como capa de gobernanza y acceso.",
        productionBadge: "Live",
        productionLanes: [
          { title: "Paciente", body: "Descubre medico, revisa receta activa y avanza hacia un checkout simple.", href: "/patient" },
          { title: "Medico", body: "Opera consultas, seguimiento y emision de receta en una red validada.", href: "/doctor" },
          { title: "Dispensario", body: "Valida elegibilidad, muestra inventario trazable y cierra la venta.", href: "/dispensary" },
          { title: "Superadmin", body: "Aprueba actores regulados, entrega permisos y protege la red.", href: "/superadmin" },
        ],
        howEyebrow: "La ruta del paciente",
        howTitle: "Tres momentos. Una sola historia clara.",
        howBody: "La landing ya no intenta explicar todo. Solo deja claro como Trust Leaf resuelve descubrir atencion, validar elegibilidad y comprar medicina con confianza.",
        professionalsEyebrow: "Red profesional",
        professionalsTitle: "Eres medico o dispensario cannabico? Unete a esta red mundial de trazabilidad y salud.",
        professionalsBody: "Solo perfiles aprobados por el superadmin entran a operar dentro de Trust Leaf. Eso protege calidad, compliance y confianza en toda la red.",
        professionalsBadge: "Acceso aprobado",
        proofEyebrow: "Lo que ya esta probado",
        proofTitle: "No es solo un mockup bonito.",
        proofBody: "Detras de la presentacion ya existe backend real para contratos, indexacion, passkeys MVP, sponsor fee-bump y rails por actor.",
        proofPoints: [
          {
            metric: "Contratos",
            title: "RBAC, trazabilidad y receta privada en testnet.",
            body: "El MVP ya corre sobre los tres contratos core y un manifiesto live que alimenta la app.",
          },
          {
            metric: "Wallet-less",
            title: "Passkeys MVP y sponsor real ya conectados.",
            body: "La infraestructura de login y fee sponsorship ya existe aunque todavia falte la fase durable y smart-wallet final.",
          },
          {
            metric: "Actores",
            title: "Patient, doctor, dispensary y superadmin ya tienen rail propio.",
            body: "Cada POV ya representa una operacion distinta y se conecta con acciones o bridges listos para testnet.",
          },
        ],
        finalEyebrow: "Entrar ahora",
        finalTitle: "Presenta el MVP como producto. Luego abre la infraestructura solo cuando haga falta.",
        finalBody: "La mejor demo de Trust Leaf empieza con el paciente, pasa por la red profesional y termina mostrando que todo ya esta respaldado por Stellar testnet.",
        finalCtas: [
          { label: "Paciente", value: "Entrar como paciente", href: "/patient" },
          { label: "Medico", value: "Ver POV medico", href: "/doctor" },
          { label: "Dispensario", value: "Ver POV dispensario", href: "/dispensary" },
          { label: "Presentacion", value: "Abrir demo script", href: "/demo-script" },
        ],
      }
    : {
        brandTag: "Medicinal trust network",
        navHow: "Patient flow",
        navProfessionals: "Professional network",
        navScript: "Demo script",
        navCommand: "Ops",
        navCta: "Enter",
        announcement: "MVP ready for presentation and testnet",
        eyebrow: "Medicinal cannabis without crypto friction",
        title: "Find a doctor, validate your prescription, and buy trusted medicine from one experience.",
        body: "Trust Leaf turns a fragmented process into one simple journey for the patient and one controlled network for regulated operators.",
        supportingBody: "Passkeys to enter. Private prescriptions to protect health data. Visible traceability to buy with evidence. Doctors and dispensaries are manually approved by a superadmin.",
        primaryCta: "Enter as patient",
        secondaryCta: "I am a doctor or dispensary",
        scriptCta: "Open demo script",
        snapshotEyebrow: "MVP snapshot",
        snapshotTitle: "The infrastructure already exists. Now the experience needs to feel premium.",
        snapshotBody: "Live contracts, indexing, sponsor fee, and actor rails are already in place. The current priority is turning all of that into a clearer, more presentable UX.",
        productionEyebrow: "Product architecture",
        productionTitle: "Each actor enters at the right moment and with the right level of control.",
        productionBody: "Patients self-serve. Doctors and dispensaries join through manual approval. The superadmin acts as the governance and access layer.",
        productionBadge: "Live",
        productionLanes: [
          { title: "Patient", body: "Discover care, review the active prescription, and move into a simple checkout path.", href: "/patient" },
          { title: "Doctor", body: "Run consults, follow-up, and prescription issuance inside a validated network.", href: "/doctor" },
          { title: "Dispensary", body: "Validate eligibility, show traceable inventory, and close the sale.", href: "/dispensary" },
          { title: "Superadmin", body: "Approve regulated actors, grant permissions, and protect the network.", href: "/superadmin" },
        ],
        howEyebrow: "The patient route",
        howTitle: "Three moments. One clear story.",
        howBody: "The landing no longer tries to explain everything. It only makes clear how Trust Leaf helps patients find care, validate eligibility, and buy medicine with confidence.",
        professionalsEyebrow: "Professional network",
        professionalsTitle: "Are you a cannabis doctor or dispensary? Join this global trust and health network.",
        professionalsBody: "Only superadmin-approved profiles can operate inside Trust Leaf. That protects quality, compliance, and trust across the entire network.",
        professionalsBadge: "Approved access",
        proofEyebrow: "What is already proven",
        proofTitle: "This is not just a polished mockup.",
        proofBody: "Behind the presentation there is already real backend for contracts, indexing, MVP passkeys, fee sponsorship, and actor rails.",
        proofPoints: [
          {
            metric: "Contracts",
            title: "RBAC, traceability, and private prescriptions are live on testnet.",
            body: "The MVP already runs on the three core contracts and a live manifest that feeds the application.",
          },
          {
            metric: "Wallet-less",
            title: "MVP passkeys and real sponsorship are already connected.",
            body: "The login and fee sponsorship infrastructure already exists, even if durable identity and final smart-wallet rollout still remain.",
          },
          {
            metric: "Actors",
            title: "Patient, doctor, dispensary, and superadmin each have their own rail.",
            body: "Each POV already represents a distinct operation and connects to actions or bridges ready for testnet.",
          },
        ],
        finalEyebrow: "Enter now",
        finalTitle: "Present the MVP as a product. Open the infrastructure only when it adds value.",
        finalBody: "The strongest Trust Leaf demo starts with the patient, moves through the professional network, and ends by proving everything is already backed by Stellar testnet.",
        finalCtas: [
          { label: "Patient", value: "Enter as patient", href: "/patient" },
          { label: "Doctor", value: "Open doctor POV", href: "/doctor" },
          { label: "Dispensary", value: "Open dispensary POV", href: "/dispensary" },
          { label: "Presentation", value: "Open demo script", href: "/demo-script" },
        ],
      };
}

function SectionLead({
  eyebrow,
  title,
  body,
  compact = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={compact ? "max-w-2xl" : "max-w-3xl"}>
      <p className={`text-sm uppercase tracking-[0.3em] ${dark ? "text-[#99c8b3]" : "text-[#62756d]"}`}>{eyebrow}</p>
      <h2 className={`font-display mt-4 text-5xl leading-[0.96] md:text-6xl ${dark ? "text-[#f7fbf9]" : "text-[#12261d]"}`}>{title}</h2>
      {body ? <p className={`mt-5 text-base leading-8 ${dark ? "text-[#d5e3dc]" : "text-[#4b5e56]"}`}>{body}</p> : null}
    </div>
  );
}

function MetricTile({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: ReactNode;
  dark?: boolean;
}) {
  return (
    <article className={`rounded-[1.7rem] border p-5 ${dark ? "border-white/10 bg-white/6" : "border-[#163c30]/10 bg-white/80"}`}>
      <p className={`text-xs uppercase tracking-[0.24em] ${dark ? "text-[#9dcbb6]" : "text-[#60736a]"}`}>{label}</p>
      <p className={`font-display mt-4 text-4xl leading-none ${dark ? "text-[#f7fbf9]" : "text-[#12261d]"}`}>{value}</p>
    </article>
  );
}
