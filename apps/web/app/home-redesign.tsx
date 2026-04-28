import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "./language-switcher";
import { getMarketingData, type Locale } from "./lib/i18n";
import { PresentationStrip } from "./presentation-strip";

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
    <main className="min-h-screen overflow-hidden bg-[#efe7d9] text-[#13231d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(27,91,68,0.20),transparent_24%),radial-gradient(circle_at_92%_18%,rgba(201,151,71,0.18),transparent_18%),linear-gradient(180deg,#f5efe5_0%,#ede3d4_54%,#e8dece_100%)]" />

      <section className="relative mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
        <header className="rounded-full border border-[#17392d]/10 bg-white/78 px-4 py-3 shadow-[0_12px_40px_rgba(28,54,44,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#17392d] text-sm font-semibold text-[#edf5f1]">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-[#13231d]">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#687970]">{copy.brandTag}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a href="#journey" className="rounded-full px-4 py-2 text-[#55665d] transition hover:bg-[#17392d]/5 hover:text-[#13231d]">{copy.navJourney}</a>
              <a href="#network" className="rounded-full px-4 py-2 text-[#55665d] transition hover:bg-[#17392d]/5 hover:text-[#13231d]">{copy.navNetwork}</a>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-[#55665d] transition hover:bg-[#17392d]/5 hover:text-[#13231d]">{copy.navScript}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/patient" className="rounded-full bg-[#17392d] px-5 py-2.5 font-semibold text-[#edf5f1] transition hover:bg-[#23483a]">{copy.navCta}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="landing" />

        <section className="mt-8 rounded-[2.8rem] border border-[#17392d]/10 bg-[linear-gradient(140deg,#fffdf8,#f4ebdc_44%,#eadfcf_100%)] p-6 shadow-[0_35px_120px_rgba(28,54,44,0.10)] md:p-8 xl:p-10">
          <div className="grid gap-7 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <article className="max-w-4xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#17392d]/10 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#295847]">
                <span className="h-2 w-2 rounded-full bg-[#2f9d70]" />
                {copy.announcement}
              </div>

              <p className="mt-8 text-sm uppercase tracking-[0.34em] text-[#6b7b73]">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.92] text-[#13231d] md:text-7xl">{copy.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#31443c] md:text-xl">{copy.body}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/patient" className="rounded-full bg-[#17392d] px-6 py-3 text-sm font-semibold text-[#edf5f1] transition hover:bg-[#23483a]">{copy.primaryCta}</Link>
                <a href="#network" className="rounded-full border border-[#17392d]/12 bg-white/78 px-6 py-3 text-sm font-semibold text-[#17392d] transition hover:bg-white">{copy.secondaryCta}</a>
                <Link href="/demo-script" className="rounded-full px-5 py-3 text-sm font-semibold text-[#52645b] transition hover:text-[#17392d]">{copy.scriptCta}</Link>
              </div>

              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {copy.quickPoints.map((point) => (
                  <article key={point.label} className="rounded-[1.7rem] border border-[#17392d]/10 bg-white/72 p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a7b73]">{point.label}</p>
                    <p className="mt-3 text-sm leading-6 text-[#1f332a]">{point.value}</p>
                  </article>
                ))}
              </div>
            </article>

            <div className="grid gap-5">
              <article className="rounded-[2.3rem] bg-[#17392d] p-6 text-[#edf5f1] shadow-[0_24px_80px_rgba(22,48,39,0.18)]">
                <p className="text-xs uppercase tracking-[0.26em] text-[#9ecab7]">{copy.signalEyebrow}</p>
                <h2 className="font-display mt-4 text-4xl leading-[0.98] text-[#f7fbf9] md:text-5xl">{copy.signalTitle}</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#d6e5dd]">{copy.signalBody}</p>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {marketing.heroStats.map((stat) => (
                    <MetricTile key={stat.label} label={stat.label} value={stat.value} dark />
                  ))}
                </div>
              </article>

              <article className="rounded-[2.2rem] border border-[#17392d]/10 bg-white/78 p-5 shadow-[0_18px_70px_rgba(28,54,44,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.26em] text-[#6b7b73]">{copy.productEyebrow}</p>
                  <span className="rounded-full bg-[#17392d]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{copy.productBadge}</span>
                </div>
                <h3 className="font-display mt-4 text-3xl leading-tight text-[#13231d]">{copy.productTitle}</h3>
                <div className="mt-5 grid gap-3">
                  {copy.productMoments.map((moment) => (
                    <div key={moment.title} className="rounded-[1.5rem] border border-[#17392d]/10 bg-[#faf5ec] px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6c7d75]">{moment.step}</p>
                      <p className="mt-2 font-display text-2xl text-[#13231d]">{moment.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#4c5e56]">{moment.body}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {marketing.signalStrip.map((signal) => (
              <span key={signal} className="rounded-full border border-[#17392d]/10 bg-white/68 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#486056]">
                {signal}
              </span>
            ))}
          </div>
        </section>

        <section id="journey" className="mt-24 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[2.4rem] border border-[#17392d]/10 bg-white/78 p-7 shadow-[0_18px_70px_rgba(28,54,44,0.06)] md:p-8">
            <SectionLead eyebrow={copy.journeyEyebrow} title={copy.journeyTitle} body={copy.journeyBody} compact />

            <div className="mt-8 grid gap-4">
              {marketing.patientBenefits.slice(0, 3).map((card) => (
                <article key={card.name} className="rounded-[1.8rem] border border-[#17392d]/10 bg-[#fbf7f0] p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a7a72]">{card.name}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-[#13231d]">{card.headline}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4a5d54]">{card.body}</p>
                </article>
              ))}
            </div>
          </article>

          <div className="grid gap-5 md:grid-cols-3">
            {marketing.patientJourney.map((step) => (
              <article key={step.step} className="rounded-[2.2rem] border border-[#17392d]/10 bg-[linear-gradient(180deg,#fffdf9,#f6efe4)] p-6 shadow-[0_18px_70px_rgba(28,54,44,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-6xl leading-none text-[#b1bbb6]">{step.step}</span>
                  <span className="rounded-full bg-[#17392d]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{step.state}</span>
                </div>
                <h3 className="font-display mt-8 text-4xl leading-[0.96] text-[#13231d]">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#4b5e56]">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="network" className="mt-24 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.5rem] border border-[#17392d]/10 bg-[#17392d] p-7 text-[#edf5f1] shadow-[0_26px_90px_rgba(21,50,40,0.16)] md:p-8">
            <SectionLead eyebrow={copy.networkEyebrow} title={copy.networkTitle} body={copy.networkBody} compact dark />

            <div className="mt-8 grid gap-4">
              {marketing.networkRoles.filter((role) => role.href !== "/patient").map((role) => (
                <Link key={role.href} href={role.href} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-3xl text-[#f7fbf9]">{role.name}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#a8c9ba]">{copy.networkBadge}</span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-[#d5e3dc]">{role.detail}</p>
                  <p className="mt-5 text-sm font-semibold text-[#f7fbf9]">{role.cta}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-[#17392d]/10 bg-white/78 p-7 shadow-[0_18px_70px_rgba(28,54,44,0.06)] md:p-8">
            <SectionLead eyebrow={copy.proofEyebrow} title={copy.proofTitle} body={copy.proofBody} compact />

            <div className="mt-8 grid gap-4">
              {copy.proofPoints.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-[#17392d]/10 bg-[#faf5ec] p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6a7a72]">{item.metric}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-[#13231d]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4a5d54]">{item.body}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-24 rounded-[2.8rem] border border-[#17392d]/10 bg-[linear-gradient(135deg,#16352a,#23493b_48%,#10231b)] p-8 text-[#edf5f1] shadow-[0_32px_120px_rgba(21,50,40,0.18)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#99c8b3]">{copy.finalEyebrow}</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl leading-[0.94] text-[#f6fbf8] md:text-6xl">{copy.finalTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#d5e3dc]">{copy.finalBody}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {copy.finalCtas.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#99c8b3]">{item.label}</p>
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
        brandTag: "Red medicinal privada y trazable",
        navJourney: "Ruta paciente",
        navNetwork: "Red profesional",
        navScript: "Script demo",
        navCta: "Entrar",
        announcement: "MVP listo para jueces, grants y testnet",
        eyebrow: "Cannabis medicinal con experiencia premium",
        title: "Tu consulta, tu receta y tu medicina. En una sola experiencia confiable.",
        body: "Trust Leaf convierte un proceso fragmentado en una ruta clara: el paciente encuentra atencion, protege su privacidad y compra medicina trazable sin friccion cripto.",
        primaryCta: "Entrar como paciente",
        secondaryCta: "Soy medico o dispensario",
        scriptCta: "Abrir script de demo",
        quickPoints: [
          { label: "Acceso", value: "Passkeys y sponsor en segundo plano." },
          { label: "Privacidad", value: "La receta no expone datos medicos sensibles." },
          { label: "Compra", value: "Inventario, lote y laboratorio visibles antes de pagar." },
        ],
        signalEyebrow: "Lo que ya existe",
        signalTitle: "La parte dificil ya esta montada. Ahora se presenta como producto.",
        signalBody: "Detras de esta experiencia ya viven contratos Soroban, identidad wallet-less, sponsor fee-bump, trazabilidad e indexacion live sobre Stellar testnet.",
        productEyebrow: "Experiencia en produccion",
        productBadge: "Patient-first",
        productTitle: "El paciente avanza. La complejidad se queda atras.",
        productMoments: [
          { step: "01", title: "Encuentra un medico aprobado", body: "No parte desde wallets ni seeds. Parte desde necesidad medica real." },
          { step: "02", title: "Recibe una receta privada", body: "La red verifica elegibilidad sin volver publico el contexto del paciente." },
          { step: "03", title: "Compra con evidencia", body: "El dispensario muestra origen, laboratorio y estado de liberacion antes de vender." },
        ],
        journeyEyebrow: "La ruta del paciente",
        journeyTitle: "Tres momentos que los jueces pueden entender en segundos.",
        journeyBody: "La landing deja una sola idea clara: Trust Leaf conecta atencion, receta y compra segura en un flujo continuo.",
        networkEyebrow: "Red profesional",
        networkTitle: "Eres medico o dispensario cannabico? Unete a esta red mundial de trazabilidad y salud.",
        networkBody: "Solo los perfiles aprobados por el superadmin operan en Trust Leaf. Eso protege cumplimiento, calidad y confianza en toda la red.",
        networkBadge: "Acceso aprobado",
        proofEyebrow: "Prueba real",
        proofTitle: "Esto no depende solo de slides bonitos.",
        proofBody: "Los cimientos tecnicos ya existen y alimentan la app hoy. La presentacion solo los ordena mejor.",
        proofPoints: [
          {
            metric: "Contratos",
            title: "RBAC, trazabilidad y receta privada ya viven en testnet.",
            body: "El MVP ya corre sobre los contratos core y un deployment que la app consulta en vivo.",
          },
          {
            metric: "Identidad",
            title: "Passkeys, Supabase y fee sponsorship ya estan conectados.",
            body: "La entrada wallet-less ya funciona como MVP serio y permite una experiencia mas cercana a producto final.",
          },
          {
            metric: "Operaciones",
            title: "Paciente, medico, dispensario y superadmin ya tienen su propio rail.",
            body: "Cada actor tiene una historia clara dentro del sistema y una capa operativa preparada para testnet.",
          },
        ],
        finalEyebrow: "Entrar ahora",
        finalTitle: "Presenta una app de salud moderna. Luego revela que ya corre sobre Stellar.",
        finalBody: "La mejor demo de Trust Leaf empieza como producto, no como blockchain deck. Primero convence al paciente. Despues demuestra la infraestructura.",
        finalCtas: [
          { label: "Paciente", value: "Entrar como paciente", href: "/patient" },
          { label: "Medico", value: "Ver POV medico", href: "/doctor" },
          { label: "Dispensario", value: "Ver POV dispensario", href: "/dispensary" },
          { label: "Presentacion", value: "Abrir demo script", href: "/demo-script" },
        ],
      }
    : {
        brandTag: "Private and traceable medicinal network",
        navJourney: "Patient route",
        navNetwork: "Professional network",
        navScript: "Demo script",
        navCta: "Enter",
        announcement: "MVP ready for judges, grants, and testnet",
        eyebrow: "Medicinal cannabis with a premium experience",
        title: "Your consult, your prescription, your medicine. In one trusted experience.",
        body: "Trust Leaf turns a fragmented process into one clear route: the patient finds care, protects their privacy, and buys traceable medicine without crypto friction.",
        primaryCta: "Enter as patient",
        secondaryCta: "I am a doctor or dispensary",
        scriptCta: "Open demo script",
        quickPoints: [
          { label: "Access", value: "Passkeys and sponsored fees in the background." },
          { label: "Privacy", value: "The prescription does not expose sensitive medical data." },
          { label: "Purchase", value: "Inventory, batch, and lab signals are visible before checkout." },
        ],
        signalEyebrow: "What already exists",
        signalTitle: "The hard part is already built. Now it is presented like a product.",
        signalBody: "Behind this experience already live Soroban contracts, wallet-less identity, fee sponsorship, traceability, and live indexing on Stellar testnet.",
        productEyebrow: "Production feel",
        productBadge: "Patient-first",
        productTitle: "The patient moves forward. Complexity stays behind.",
        productMoments: [
          { step: "01", title: "Find an approved doctor", body: "The story starts from a real medical need, not from wallets or seed phrases." },
          { step: "02", title: "Receive a private prescription", body: "The network verifies eligibility without making the patient's context public." },
          { step: "03", title: "Buy with evidence", body: "The dispensary shows origin, lab work, and release status before selling." },
        ],
        journeyEyebrow: "The patient route",
        journeyTitle: "Three moments judges can understand in seconds.",
        journeyBody: "The landing leaves one clear idea: Trust Leaf connects care, prescription, and safe purchase in one continuous flow.",
        networkEyebrow: "Professional network",
        networkTitle: "Are you a cannabis doctor or dispensary? Join this global trust and health network.",
        networkBody: "Only profiles approved by the superadmin can operate inside Trust Leaf. That protects compliance, quality, and trust across the entire network.",
        networkBadge: "Approved access",
        proofEyebrow: "Real proof",
        proofTitle: "This does not depend on pretty slides alone.",
        proofBody: "The technical foundation already exists and powers the application today. The presentation now simply gives it better shape.",
        proofPoints: [
          {
            metric: "Contracts",
            title: "RBAC, traceability, and private prescriptions already live on testnet.",
            body: "The MVP already runs on the core contracts and a deployment the app reads live.",
          },
          {
            metric: "Identity",
            title: "Passkeys, Supabase, and fee sponsorship are already connected.",
            body: "The wallet-less entry flow already works as a serious MVP and feels much closer to a finished product.",
          },
          {
            metric: "Operations",
            title: "Patient, doctor, dispensary, and superadmin already have their own rail.",
            body: "Each actor has a clear story inside the system and an operational layer prepared for testnet.",
          },
        ],
        finalEyebrow: "Enter now",
        finalTitle: "Present a modern health product first. Then reveal it already runs on Stellar.",
        finalBody: "The strongest Trust Leaf demo starts as a product, not as a blockchain deck. Win the patient first. Then prove the infrastructure underneath.",
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
