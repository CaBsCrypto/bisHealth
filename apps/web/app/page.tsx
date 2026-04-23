import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "./language-switcher";
import { getMarketingData, type Locale } from "./lib/i18n";
import { getLocale } from "./lib/locale";

export default async function HomePage() {
  const locale = await getLocale();
  const marketing = getMarketingData(locale);
  const copy = getLandingCopy(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe6] text-[#12261d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(33,122,89,0.12),transparent_25%),radial-gradient(circle_at_84%_10%,rgba(194,154,82,0.15),transparent_20%),linear-gradient(180deg,#f6f2e9_0%,#f1ebe0_42%,#ece6db_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
        <header className="rounded-full border border-[#163c30]/10 bg-white/70 px-4 py-3 shadow-[0_12px_40px_rgba(31,58,47,0.08)] backdrop-blur">
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
              <a href="#how-it-works" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navHow}</a>
              <a href="#professionals" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navProfessionals}</a>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navScript}</Link>
              <Link href="/walletless" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navDemo}</Link>
              <Link href="/command-center" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.navCommand}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/patient" className="rounded-full bg-[#163c30] px-5 py-2.5 font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">{copy.navCta}</Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <article className="overflow-hidden rounded-[2.8rem] border border-[#163c30]/10 bg-[linear-gradient(145deg,#fdfbf6,#f4edde_54%,#efe8dc)] p-7 shadow-[0_30px_110px_rgba(31,58,47,0.10)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#163c30]/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#295847]">
              <span className="h-2 w-2 rounded-full bg-[#2e9d70]" />
              {copy.announcement}
            </div>

            <p className="mt-8 text-sm uppercase tracking-[0.34em] text-[#62756d]">{copy.eyebrow}</p>
            <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.94] text-[#12261d] md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#31453c] md:text-xl">{copy.body}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5a6d64]">{copy.supportingBody}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/patient" className="rounded-full bg-[#163c30] px-6 py-3 text-sm font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">{copy.primaryCta}</Link>
              <a href="#professionals" className="rounded-full border border-[#163c30]/12 bg-white/70 px-6 py-3 text-sm font-semibold text-[#163c30] transition hover:bg-white">{copy.secondaryCta}</a>
              <Link href="/walletless" className="rounded-full px-4 py-3 text-sm text-[#51635b] transition hover:text-[#163c30]">{copy.tertiaryCta}</Link>
              <Link href="/demo-script" className="rounded-full border border-[#163c30]/12 bg-white/70 px-6 py-3 text-sm font-semibold text-[#163c30] transition hover:bg-white">{copy.scriptCta}</Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <InfoTile label={copy.consultLabel}>{copy.consultValue}</InfoTile>
              <InfoTile label={copy.rxLabel}>{copy.rxValue}</InfoTile>
              <InfoTile label={copy.inventoryLabel}>{copy.inventoryValue}</InfoTile>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[2.4rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)] md:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.patientValueEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9] md:text-5xl">{copy.patientValueTitle}</h2>
              <p className="mt-4 text-base leading-7 text-[#d4e3db]">{copy.patientValueBody}</p>
              <div className="mt-6 grid gap-3">
                <DarkPoint>{copy.patientPointOne}</DarkPoint>
                <DarkPoint>{copy.patientPointTwo}</DarkPoint>
                <DarkPoint>{copy.patientPointThree}</DarkPoint>
              </div>
            </article>

            <article className="rounded-[2.3rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_20px_80px_rgba(31,58,47,0.08)]">
              <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.productionEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.productionTitle}</h2>
              <p className="mt-4 text-base leading-7 text-[#4a5e55]">{copy.productionBody}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {copy.productionLanes.map((lane) => (
                  <Link key={lane.href} href={lane.href} className="rounded-[1.7rem] border border-[#163c30]/10 bg-[#faf6ef] p-4 transition hover:bg-white">
                    <p className="font-display text-2xl text-[#12261d]">{lane.title}</p>
                    <p className="mt-3 text-sm leading-6 text-[#4d5f57]">{lane.body}</p>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="mt-24">
          <SectionLead eyebrow={copy.howEyebrow} title={copy.howTitle} body={copy.howBody} />
          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {marketing.patientJourney.map((step) => (
              <article key={step.step} className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-6xl leading-none text-[#9ea9a3]">{step.step}</span>
                  <span className="rounded-full bg-[#163c30]/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#21483a]">{step.state}</span>
                </div>
                <h3 className="font-display mt-8 text-4xl leading-tight text-[#12261d]">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#4a5d54]">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2.3rem] border border-[#163c30]/10 bg-[#f7f3eb] p-6 shadow-[0_18px_70px_rgba(31,58,47,0.06)] md:p-8">
            <SectionLead eyebrow={copy.trustEyebrow} title={copy.trustTitle} body={copy.trustBody} compact />
            <div className="mt-8 grid gap-4">
              {marketing.patientBenefits.slice(0, 3).map((card) => (
                <div key={card.name} className="rounded-[1.8rem] border border-[#163c30]/10 bg-white/80 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#62756d]">{card.name}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-[#12261d]">{card.headline}</h3>
                  <p className="mt-4 text-base leading-7 text-[#4b5e56]">{card.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article id="professionals" className="rounded-[2.3rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)] md:p-8">
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
        </section>

        <section className="mt-24">
          <SectionLead eyebrow={copy.faqEyebrow} title={copy.faqTitle} body={copy.faqBody} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {marketing.faqs.slice(0, 3).map((item) => (
              <article key={item.question} className="rounded-[2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.05)]">
                <h3 className="font-display text-3xl leading-tight text-[#12261d]">{item.question}</h3>
                <p className="mt-4 text-base leading-7 text-[#4b5e56]">{item.answer}</p>
              </article>
            ))}
          </div>
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
        navHow: "Como funciona",
        navProfessionals: "Red profesional",
        navScript: "Script demo",
        navDemo: "Demo",
        navCommand: "Command center",
        navCta: "Entrar",
        announcement: "MVP listo para evolucionar a producto real",
        eyebrow: "Experiencia paciente primero",
        title: "Encuentra medico, valida tu receta y consigue medicina confiable.",
        body: "Trust Leaf conecta pacientes, medicos y dispensarios en un flujo simple de salud, no en una experiencia cripto complicada.",
        supportingBody: "El paciente entra con passkeys. Los medicos y dispensarios se suman mediante aprobacion manual del superadmin. La privacidad medica se protege y la trazabilidad del producto se vuelve visible.",
        primaryCta: "Entrar como paciente",
        secondaryCta: "Soy medico o dispensario",
        tertiaryCta: "Ver demo tecnica",
        scriptCta: "Abrir script de demo",
        consultLabel: "Medico verificado",
        consultValue: "Agenda consulta y seguimiento en una sola cuenta",
        rxLabel: "Receta validada",
        rxValue: "Privada para el paciente, verificable para la red",
        inventoryLabel: "Inventario confiable",
        inventoryValue: "Lote, laboratorio y estado visibles antes de comprar",
        patientValueEyebrow: "Lo que gana el paciente",
        patientValueTitle: "Todo lo importante, en una sola app.",
        patientValueBody: "Trust Leaf no deberia sentirse como una herramienta web3. Deberia sentirse como la mejor forma de encontrar atencion, ver una receta valida y descubrir medicina confiable.",
        patientPointOne: "Encontrar medicos aprobados dentro de la misma red",
        patientPointTwo: "Ver la receta activa, su vigencia y su estado",
        patientPointThree: "Explorar inventario real del dispensario antes de salir",
        productionEyebrow: "Vision de producto",
        productionTitle: "Asi deberia verse Trust Leaf en produccion.",
        productionBody: "Pacientes avanzan solos. Medicos y dispensarios operan dentro de una red aprobada. El superadmin conserva el control operativo del ecosistema.",
        productionLanes: [
          { title: "Paciente", body: "Descubre medico, recibe receta privada y revisa inventario listo para compra.", href: "/patient" },
          { title: "Medico", body: "Gestiona consultas, seguimientos y recetas dentro de una red validada.", href: "/doctor" },
          { title: "Dispensario", body: "Publica medicina trazable, valida recetas y opera con evidencia.", href: "/dispensary" },
          { title: "Superadmin", body: "Aprueba actores regulados, entrega permisos y protege la red.", href: "/superadmin" },
        ],
        howEyebrow: "Como funciona",
        howTitle: "Del problema del paciente a la compra segura",
        howBody: "Una sola ruta clara: encontrar atencion, recibir una receta privada y comprar medicina con trazabilidad real.",
        trustEyebrow: "Por que funciona",
        trustTitle: "Claridad para el usuario. Confianza para la red.",
        trustBody: "La experiencia final debe ser simple para el paciente y confiable para cada actor regulado.",
        professionalsEyebrow: "Red profesional",
        professionalsTitle: "Eres medico o dispensario cannabico? Unite a esta red mundial de trazabilidad y salud",
        professionalsBody: "Solo perfiles aprobados por el superadmin acceden a operaciones medicas y comerciales dentro de Trust Leaf.",
        professionalsBadge: "Acceso aprobado",
        faqEyebrow: "FAQ",
        faqTitle: "Lo esencial, explicado simple",
        faqBody: "La landing debe responder rapido las dudas clave, no abrir mas complejidad.",
        finalEyebrow: "Entrar ahora",
        finalTitle: "Pacientes autoservicio. Red profesional aprobada manualmente.",
        finalBody: "Trust Leaf esta disenado para escalar como producto real: onboarding simple para pacientes y control operativo para actores regulados.",
        finalCtas: [
          { label: "Paciente", value: "Entrar como paciente", href: "/patient" },
          { label: "Medico", value: "Soy medico", href: "/doctor" },
          { label: "Dispensario", value: "Soy dispensario", href: "/dispensary" },
          { label: "Superadmin", value: "Abrir superadmin", href: "/superadmin" },
        ],
      }
    : {
        brandTag: "Medicinal trust network",
        navHow: "How it works",
        navProfessionals: "Professional network",
        navScript: "Demo script",
        navDemo: "Demo",
        navCommand: "Command center",
        navCta: "Enter",
        announcement: "MVP ready to evolve into a real product",
        eyebrow: "Patient-first experience",
        title: "Find a doctor, validate your prescription, and access trusted medicine.",
        body: "Trust Leaf connects patients, doctors, and dispensaries in a simple healthcare flow, not in a confusing crypto experience.",
        supportingBody: "Patients enter with passkeys. Doctors and dispensaries join through manual superadmin approval. Medical privacy stays protected while product traceability becomes visible.",
        primaryCta: "Enter as patient",
        secondaryCta: "I am a doctor or dispensary",
        tertiaryCta: "View technical demo",
        scriptCta: "Open demo script",
        consultLabel: "Verified doctor",
        consultValue: "Book consults and follow-ups from one account",
        rxLabel: "Validated prescription",
        rxValue: "Private for the patient, verifiable for the network",
        inventoryLabel: "Trusted inventory",
        inventoryValue: "Batch, lab, and release state visible before purchase",
        patientValueEyebrow: "What the patient gets",
        patientValueTitle: "Everything important, in one app.",
        patientValueBody: "Trust Leaf should not feel like a web3 tool. It should feel like the best way to find care, review a valid prescription, and discover trusted medicine.",
        patientPointOne: "Find approved doctors inside the same network",
        patientPointTwo: "See the active prescription, expiry window, and state",
        patientPointThree: "Browse real dispensary inventory before leaving home",
        productionEyebrow: "Product vision",
        productionTitle: "This is how Trust Leaf should feel in production.",
        productionBody: "Patients self-serve. Doctors and dispensaries operate inside an approved network. The superadmin keeps operational control of the ecosystem.",
        productionLanes: [
          { title: "Patient", body: "Discover a doctor, receive a private prescription, and review inventory ready for purchase.", href: "/patient" },
          { title: "Doctor", body: "Manage consults, follow-ups, and prescriptions inside a validated network.", href: "/doctor" },
          { title: "Dispensary", body: "Publish traceable medicine, validate prescriptions, and operate with evidence.", href: "/dispensary" },
          { title: "Superadmin", body: "Approve regulated actors, grant permissions, and protect the network.", href: "/superadmin" },
        ],
        howEyebrow: "How it works",
        howTitle: "From patient need to safe purchase",
        howBody: "One clear route: find care, receive a private prescription, and buy medicine with real traceability.",
        trustEyebrow: "Why it works",
        trustTitle: "Clarity for the user. Trust for the network.",
        trustBody: "The final experience should be simple for the patient and reliable for every regulated actor.",
        professionalsEyebrow: "Professional network",
        professionalsTitle: "Are you a cannabis doctor or dispensary? Join this global trust and health network",
        professionalsBody: "Only superadmin-approved profiles can access clinical and commercial operations inside Trust Leaf.",
        professionalsBadge: "Approved access",
        faqEyebrow: "FAQ",
        faqTitle: "The essentials, explained simply",
        faqBody: "The landing should answer the main questions fast, not add more complexity.",
        finalEyebrow: "Enter now",
        finalTitle: "Patients self-serve. The professional network is manually approved.",
        finalBody: "Trust Leaf is designed to scale like a real product: simple onboarding for patients and operational control for regulated actors.",
        finalCtas: [
          { label: "Patient", value: "Enter as patient", href: "/patient" },
          { label: "Doctor", value: "I am a doctor", href: "/doctor" },
          { label: "Dispensary", value: "I am a dispensary", href: "/dispensary" },
          { label: "Superadmin", value: "Open superadmin", href: "/superadmin" },
        ],
      };
}

function SectionLead({ eyebrow, title, body, compact = false, dark = false }: { eyebrow: string; title: string; body?: string; compact?: boolean; dark?: boolean }) {
  return (
    <div className={compact ? "max-w-2xl" : "max-w-3xl"}>
      <p className={`text-sm uppercase tracking-[0.3em] ${dark ? "text-[#99c8b3]" : "text-[#62756d]"}`}>{eyebrow}</p>
      <h2 className={`font-display mt-4 text-5xl leading-[0.96] md:text-6xl ${dark ? "text-[#f7fbf9]" : "text-[#12261d]"}`}>{title}</h2>
      {body ? <p className={`mt-5 text-base leading-8 ${dark ? "text-[#d5e3dc]" : "text-[#4b5e56]"}`}>{body}</p> : null}
    </div>
  );
}

function InfoTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.7rem] border border-[#163c30]/10 bg-white/80 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-[#60736a]">{label}</p>
      <p className="mt-3 text-sm leading-7 text-[#1f332a]">{children}</p>
    </div>
  );
}

function DarkPoint({ children }: { children: ReactNode }) {
  return <div className="rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-[#dbe9e3]">{children}</div>;
}
