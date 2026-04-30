import Link from "next/link";

import { LanguageSwitcher } from "./language-switcher";
import { getMarketingData, type Locale } from "./lib/i18n";
import { getTrustLeafPublicCatalog } from "./lib/trustleaf/publicCatalog";
import { PublicExperiencePortal } from "./public-experience-portal";

type MarketingData = ReturnType<typeof getMarketingData>;
type PublicCatalog = Awaited<ReturnType<typeof getTrustLeafPublicCatalog>>;

export function HomePublicNext({
  locale,
  marketing,
  catalog,
}: {
  locale: Locale;
  marketing: MarketingData;
  catalog: PublicCatalog;
}) {
  const copy = getCopy(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f2f6f2] text-[#1a3b32]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(45,90,76,0.1),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(197,164,126,0.12),transparent_24%),linear-gradient(180deg,#f2f6f2_0%,#eef3ef_35%,#f6f1ea_100%)]" />

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-5 md:px-8 md:pb-28 md:pt-7">
        <header className="sticky top-4 z-40 rounded-full border border-[#1a3b32]/8 bg-[#f2f6f2]/85 px-4 py-3 shadow-[0_18px_60px_rgba(14,31,25,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a3b32] text-sm font-bold text-[#f2f6f2]">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-[#1a3b32]">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#1a3b32]/45">
                  {copy.brandTag}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a
                href="#ecosystem"
                className="rounded-full px-4 py-2 text-[#1a3b32]/72 transition hover:bg-[#1a3b32]/6 hover:text-[#1a3b32]"
              >
                {copy.navEcosystem}
              </a>
              <a
                href="#process"
                className="rounded-full px-4 py-2 text-[#1a3b32]/72 transition hover:bg-[#1a3b32]/6 hover:text-[#1a3b32]"
              >
                {copy.navProcess}
              </a>
              <a
                href="#network"
                className="rounded-full px-4 py-2 text-[#1a3b32]/72 transition hover:bg-[#1a3b32]/6 hover:text-[#1a3b32]"
              >
                {copy.navNetwork}
              </a>
              <a
                href="#portal"
                className="rounded-full px-4 py-2 text-[#1a3b32]/72 transition hover:bg-[#1a3b32]/6 hover:text-[#1a3b32]"
              >
                {copy.navPortal}
              </a>
              <LanguageSwitcher locale={locale} />
              <Link
                href="/patient"
                className="rounded-full bg-[#1a3b32] px-5 py-2.5 font-semibold text-[#f2f6f2] transition hover:bg-[#254d40]"
              >
                {copy.navCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-7 pt-10 xl:grid-cols-[1.08fr_0.92fr] xl:items-center xl:pt-16">
          <article className="rounded-[3rem] border border-[#1a3b32]/8 bg-[linear-gradient(155deg,#fbfdfb,#f4f8f4_55%,#ecf2ed)] p-7 shadow-[0_28px_100px_rgba(14,31,25,0.08)] md:p-10">
            <span className="inline-flex items-center gap-3 rounded-full border border-[#c5a47e]/25 bg-[#c5a47e]/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#8f6b45]">
              <span className="h-2 w-2 rounded-full bg-[#c5a47e]" />
              {copy.announcement}
            </span>
            <p className="mt-10 text-sm uppercase tracking-[0.32em] text-[#1a3b32]/45">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.94] text-[#1a3b32] md:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#2d5a4c]/82 md:text-xl">{copy.body}</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#2d5a4c]/62">{copy.supportingBody}</p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/patient"
                className="rounded-[2rem] bg-[#1a3b32] px-6 py-3 text-sm font-semibold text-[#f2f6f2] transition hover:bg-[#254d40]"
              >
                {copy.primaryCta}
              </Link>
              <Link
                href="/walletless"
                className="rounded-[2rem] border border-[#1a3b32]/12 bg-white px-6 py-3 text-sm font-semibold text-[#1a3b32] transition hover:bg-[#f7faf7]"
              >
                {copy.secondaryCta}
              </Link>
              <Link
                href="/demo-script"
                className="rounded-[2rem] px-5 py-3 text-sm font-semibold text-[#2d5a4c]/72 transition hover:text-[#1a3b32]"
              >
                {copy.tertiaryCta}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-3">
              <StatCard label={copy.metricDoctors} value={String(catalog.metrics.doctors)} />
              <StatCard label={copy.metricDispensaries} value={String(catalog.metrics.dispensaries)} />
              <StatCard label={copy.metricProducts} value={String(catalog.metrics.products)} />
            </div>
          </article>

          <article className="rounded-[2.5rem] border border-[#1a3b32]/8 bg-[#17392d] p-6 text-[#f2f6f2] shadow-[0_30px_100px_rgba(14,31,25,0.2)] md:p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#f2f6f2]/48">{copy.heroPanelEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-[0.96] text-white md:text-5xl">
              {copy.heroPanelTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#f2f6f2]/72">{copy.heroPanelBody}</p>

            <div className="mt-7 space-y-3">
              {copy.heroPanelPoints.map((item) => (
                <article key={item.title} className="rounded-[1.7rem] border border-white/10 bg-white/6 p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#c5a47e]">{item.badge}</p>
                  <h3 className="font-display mt-3 text-2xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#f2f6f2]/70">{item.body}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section id="ecosystem" className="mt-20 rounded-[3rem] border border-[#1a3b32]/8 bg-white/80 p-7 shadow-[0_22px_80px_rgba(14,31,25,0.06)] md:p-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#2d5a4c]/45">{copy.ecosystemEyebrow}</p>
              <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#1a3b32] md:text-6xl">
                {copy.ecosystemTitle}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#2d5a4c]/68">{copy.ecosystemBody}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {copy.ecosystemItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[#1a3b32]/8 bg-[linear-gradient(180deg,#fffefb,#f4f7f4)] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6b45]">{item.badge}</p>
                <h3 className="font-display mt-6 text-3xl leading-tight text-[#1a3b32]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#2d5a4c]/68">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 xl:grid-cols-2">
          <SurfaceCard eyebrow={copy.problemEyebrow} title={copy.problemTitle} body={copy.problemBody}>
            <div className="mt-7 grid gap-4">
              {copy.problemPoints.map((point) => (
                <SimpleCallout key={point.title} title={point.title} body={point.body} />
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard
            eyebrow={copy.solutionEyebrow}
            title={copy.solutionTitle}
            body={copy.solutionBody}
            dark
          >
            <div className="mt-7 grid gap-4">
              {copy.solutionPoints.map((point) => (
                <SimpleCallout key={point.title} title={point.title} body={point.body} dark />
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section id="process" className="mt-20 rounded-[3rem] border border-[#1a3b32]/8 bg-[#efe7da] p-7 shadow-[0_24px_90px_rgba(14,31,25,0.06)] md:p-9">
          <p className="text-sm uppercase tracking-[0.3em] text-[#2d5a4c]/45">{copy.processEyebrow}</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#1a3b32] md:text-6xl">{copy.processTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {marketing.patientJourney.map((step) => (
              <article
                key={step.step}
                className="rounded-[2rem] border border-[#1a3b32]/8 bg-[linear-gradient(180deg,#fffdf8,#f7f0e6)] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-6xl leading-none text-[#c3c8c3]">{step.step}</span>
                  <span className="rounded-full bg-[#1a3b32]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#254d40]">
                    {step.state}
                  </span>
                </div>
                <h3 className="font-display mt-7 text-4xl leading-[0.96] text-[#1a3b32]">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#2d5a4c]/72">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="network" className="mt-20 grid gap-6 xl:grid-cols-3">
          <SurfaceCard eyebrow={copy.doctorsEyebrow} title={copy.doctorsTitle} body={copy.doctorsBody}>
            <div className="mt-7 grid gap-4">
              {catalog.doctors.slice(0, 3).map((doctor) => (
                <DirectoryCard
                  key={doctor.id}
                  badge={doctor.status}
                  title={doctor.name}
                  meta={doctor.specialty}
                  body={doctor.account}
                />
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard eyebrow={copy.dispensaryEyebrow} title={copy.dispensaryTitle} body={copy.dispensaryBody}>
            <div className="mt-7 grid gap-4">
              {catalog.dispensaries.slice(0, 3).map((dispensary) => (
                <DirectoryCard
                  key={dispensary.id}
                  badge={dispensary.status}
                  title={dispensary.name}
                  meta={dispensary.inventoryFocus}
                  body={dispensary.account}
                />
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard eyebrow={copy.brandsEyebrow} title={copy.brandsTitle} body={copy.brandsBody}>
            <div className="mt-7 grid gap-4">
              {catalog.brands.slice(0, 3).map((brand) => (
                <DirectoryCard
                  key={brand.id}
                  badge={brand.category}
                  title={brand.name}
                  meta={brand.heroProduct}
                  body={brand.body}
                />
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="mt-20 grid gap-6 xl:grid-cols-2">
          {marketing.trustPanels.map((panel) => (
            <article
              key={panel.title}
              className="rounded-[2.5rem] border border-[#1a3b32]/8 bg-[linear-gradient(160deg,#183a2f,#214b3d)] p-7 text-[#f2f6f2] shadow-[0_24px_90px_rgba(14,31,25,0.16)] md:p-8"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#c5a47e]">{panel.metric}</p>
              <h2 className="font-display mt-5 text-4xl leading-[0.96] text-white">{panel.title}</h2>
              <p className="mt-5 text-base leading-8 text-[#f2f6f2]/72">{panel.body}</p>
            </article>
          ))}
        </section>

        <PublicExperiencePortal locale={locale} catalog={catalog} />

        <section className="mt-20 rounded-[3rem] border border-[#1a3b32]/8 bg-[linear-gradient(145deg,#f6efe5,#efe1cf)] p-8 shadow-[0_24px_90px_rgba(14,31,25,0.06)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#2d5a4c]/45">{copy.faqEyebrow}</p>
              <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#1a3b32] md:text-6xl">{copy.faqTitle}</h2>
            </div>
            <div className="grid gap-4">
              {marketing.faqs.map((faq) => (
                <article key={faq.question} className="rounded-[1.9rem] border border-[#1a3b32]/8 bg-white/72 p-5">
                  <h3 className="font-display text-2xl leading-tight text-[#1a3b32]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#2d5a4c]/72">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-[3rem] border border-[#1a3b32]/8 bg-[#17392d] p-8 text-[#f2f6f2] shadow-[0_30px_100px_rgba(14,31,25,0.18)] md:p-10">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#f2f6f2]/46">{copy.finalEyebrow}</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl leading-[0.92] text-white md:text-6xl">{copy.finalTitle}</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#f2f6f2]/72">{copy.finalBody}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/patient"
                className="rounded-[2rem] bg-[#f2f6f2] px-6 py-3 text-sm font-semibold text-[#17392d] transition hover:bg-white"
              >
                {copy.primaryCta}
              </Link>
              <Link
                href="/walletless"
                className="rounded-[2rem] border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {copy.secondaryCta}
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function getCopy(locale: Locale) {
  return locale === "es"
    ? {
        brandTag: "Acceso medicinal privado y confiable",
        navEcosystem: "Ecosistema",
        navProcess: "Proceso",
        navNetwork: "Red",
        navPortal: "Portal",
        navCta: "Entrar",
        announcement: "Nueva experiencia publica basada en Trust Leaf UI",
        eyebrow: "Cannabis medicinal premium, centrado en el paciente",
        title: "Tu tratamiento sin fricciones, con medicos, receta y acceso en una sola red.",
        body: "Trust Leaf organiza la atencion, la validacion de receta y la compra de medicina trazable dentro de una experiencia mucho mas clara para el paciente.",
        supportingBody:
          "Pacientes pueden entrar solos. Medicos, dispensarios y marcas asociadas aparecen dentro de una red curada que luego conectaremos con toda la logica real ya viva en Next, Supabase, passkeys y Soroban.",
        primaryCta: "Entrar como paciente",
        secondaryCta: "Ver experiencia wallet-less",
        tertiaryCta: "Abrir demo",
        metricDoctors: "Medicos visibles",
        metricDispensaries: "Dispensarios visibles",
        metricProducts: "Productos visibles",
        heroPanelEyebrow: "Lo que cambia",
        heroPanelTitle: "Primero entiendes el producto. Despues descubres la infraestructura.",
        heroPanelBody:
          "La nueva landing no mezcla dashboards internos. Explica el valor para pacientes y presenta el ecosistema regulado como una red confiable.",
        heroPanelPoints: [
          { badge: "01", title: "Encuentras atencion", body: "Ves medicos verificados y entiendes quien puede ayudarte." },
          { badge: "02", title: "Tu receta sigue privada", body: "La validacion de red existe sin exponer datos medicos sensibles." },
          { badge: "03", title: "Compras con contexto", body: "Dispensarios, marcas y productos se muestran como una experiencia real." },
        ],
        ecosystemEyebrow: "Ecosistema",
        ecosystemTitle: "Una sola red para pacientes, medicos, dispensarios y marcas.",
        ecosystemBody:
          "La landing publica presenta el sistema completo, pero cada actor conserva su propia superficie interna. Eso evita mezclar onboarding profesional con la historia principal del paciente.",
        ecosystemItems: [
          { badge: "Paciente", title: "Paciente", body: "Solicita atencion, recibe receta privada y explora productos confiables." },
          { badge: "Medico", title: "Medico", body: "Atiende, agenda y mantiene continuidad clinica dentro de la red." },
          { badge: "Dispensario", title: "Dispensario", body: "Publica inventario, trazabilidad y valida la elegibilidad de compra." },
          { badge: "Marca", title: "Growshop", body: "Muestra productos y se conecta con la comunidad desde una capa comercial." },
          { badge: "Admin", title: "Admin", body: "Gestiona cuentas, aprobaciones e interacciones a nivel plataforma." },
        ],
        problemEyebrow: "Problema actual",
        problemTitle: "La medicina todavia se siente fragmentada.",
        problemBody:
          "Hoy el paciente salta entre profesionales, recetas y puntos de venta desconectados. Eso rompe la confianza y complica algo que deberia sentirse mucho mas simple.",
        problemPoints: [
          { title: "Busqueda ineficiente", body: "Encontrar medicos y puntos confiables sigue siendo lento y opaco." },
          { title: "Recetas aisladas", body: "La informacion clinica y la compra viven en sistemas que no se hablan." },
        ],
        solutionEyebrow: "Solucion",
        solutionTitle: "Trust Leaf conecta todo el journey en una sola experiencia.",
        solutionBody:
          "La nueva UI pone al paciente primero y usa la red regulada como soporte: medicos visibles, dispensarios confiables, productos trazables y acceso mas claro.",
        solutionPoints: [
          { title: "Red curada", body: "Medicos, dispensarios y marcas se presentan como actores verificados." },
          { title: "Flujo continuo", body: "Consulta, receta y acceso a producto ya no se sienten como pasos sueltos." },
        ],
        processEyebrow: "Como funciona",
        processTitle: "Un flujo simple para algo que hoy es demasiado complejo.",
        doctorsEyebrow: "Medicos",
        doctorsTitle: "Profesionales visibles para el paciente.",
        doctorsBody: "El directorio medico se muestra como discovery publico, no como dashboard tecnico.",
        dispensaryEyebrow: "Dispensarios",
        dispensaryTitle: "Puntos de acceso que ya pueden operar en la red.",
        dispensaryBody: "Inventario, readiness y validacion se presentan desde producto, no desde infraestructura.",
        brandsEyebrow: "Marcas y growshops",
        brandsTitle: "Productos y partners que enriquecen la experiencia.",
        brandsBody: "Las marcas asociadas ya pueden contarse como parte del ecosistema publico y comercial.",
        faqEyebrow: "FAQ",
        faqTitle: "Lo importante deberia entenderse rapido.",
        finalEyebrow: "Entrar ahora",
        finalTitle: "La experiencia publica ya puede verse como producto, no como experimento.",
        finalBody:
          "Este es el mejor puente entre la UI nueva y el backend que ya tenemos: una landing publica mucho mas fuerte encima de rails reales de identidad, catalogo y trazabilidad.",
      }
    : {
        brandTag: "Private and trusted medicinal access",
        navEcosystem: "Ecosystem",
        navProcess: "Process",
        navNetwork: "Network",
        navPortal: "Portal",
        navCta: "Enter",
        announcement: "New public experience based on Trust Leaf UI",
        eyebrow: "Premium medicinal cannabis, centered around the patient",
        title: "Your treatment without friction, with doctors, prescription, and access in one network.",
        body: "Trust Leaf organizes care, private prescription validation, and traceable medicine access into a much clearer patient experience.",
        supportingBody:
          "Patients can self-serve. Doctors, dispensaries, and partner brands appear inside a curated network that we can now connect to the real logic already alive in Next, Supabase, passkeys, and Soroban.",
        primaryCta: "Enter as patient",
        secondaryCta: "View wallet-less experience",
        tertiaryCta: "Open demo",
        metricDoctors: "Visible doctors",
        metricDispensaries: "Visible dispensaries",
        metricProducts: "Visible products",
        heroPanelEyebrow: "What changes",
        heroPanelTitle: "You understand the product first. Then you discover the infrastructure.",
        heroPanelBody:
          "The new landing does not mix internal dashboards. It explains patient value first and presents the regulated ecosystem as a trusted network.",
        heroPanelPoints: [
          { badge: "01", title: "You find care", body: "You see verified doctors and understand who can help you." },
          { badge: "02", title: "Your prescription stays private", body: "The network validation exists without exposing sensitive medical context." },
          { badge: "03", title: "You buy with context", body: "Dispensaries, brands, and products are presented like a real product experience." },
        ],
        ecosystemEyebrow: "Ecosystem",
        ecosystemTitle: "One network for patients, doctors, dispensaries, and brands.",
        ecosystemBody:
          "The public landing presents the full system, while each actor keeps its own internal surface. That avoids mixing professional onboarding with the main patient story.",
        ecosystemItems: [
          { badge: "Patient", title: "Patient", body: "Requests care, receives a private prescription, and explores trusted products." },
          { badge: "Doctor", title: "Doctor", body: "Delivers care, manages schedule, and maintains clinical continuity." },
          { badge: "Dispensary", title: "Dispensary", body: "Publishes inventory, traceability, and validates eligibility to purchase." },
          { badge: "Brand", title: "Growshop", body: "Shows products and connects with the community through a commercial surface." },
          { badge: "Admin", title: "Admin", body: "Manages accounts, approvals, and platform interactions." },
        ],
        problemEyebrow: "Current problem",
        problemTitle: "Medicine still feels fragmented.",
        problemBody:
          "Today the patient jumps between professionals, prescriptions, and disconnected retail points. That breaks trust around something that should feel much simpler.",
        problemPoints: [
          { title: "Inefficient discovery", body: "Finding trusted doctors and access points is still slow and opaque." },
          { title: "Isolated prescriptions", body: "Clinical context and product access still live in systems that do not talk to each other." },
        ],
        solutionEyebrow: "Solution",
        solutionTitle: "Trust Leaf connects the full journey in one experience.",
        solutionBody:
          "The new UI puts the patient first and uses the regulated network as support: visible doctors, trusted dispensaries, traceable products, and clearer access.",
        solutionPoints: [
          { title: "Curated network", body: "Doctors, dispensaries, and brands are presented as verified actors." },
          { title: "Continuous flow", body: "Consultation, prescription, and product access no longer feel like isolated steps." },
        ],
        processEyebrow: "How it works",
        processTitle: "A simple flow for something that is still too complex.",
        doctorsEyebrow: "Doctors",
        doctorsTitle: "Professionals visible to the patient.",
        doctorsBody: "The doctor directory is shown as public discovery, not as a technical dashboard.",
        dispensaryEyebrow: "Dispensaries",
        dispensaryTitle: "Access points already able to operate on the network.",
        dispensaryBody: "Inventory, readiness, and validation are presented from product, not infrastructure.",
        brandsEyebrow: "Brands and growshops",
        brandsTitle: "Products and partners that enrich the experience.",
        brandsBody: "Associated brands can now be told as part of the public and commercial ecosystem.",
        faqEyebrow: "FAQ",
        faqTitle: "The important part should become clear fast.",
        finalEyebrow: "Enter now",
        finalTitle: "The public experience can now look like a product, not an experiment.",
        finalBody:
          "This is the best bridge between the new UI and the backend we already have: a much stronger public landing on top of real identity, catalog, and traceability rails.",
      };
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.7rem] border border-[#1a3b32]/8 bg-white px-5 py-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[#2d5a4c]/45">{label}</p>
      <p className="font-display mt-4 text-4xl leading-none text-[#1a3b32]">{value}</p>
    </article>
  );
}

function SurfaceCard({
  eyebrow,
  title,
  body,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const styles = dark
    ? "border-[#1a3b32]/10 bg-[linear-gradient(160deg,#17392d,#214b3d)] text-[#f2f6f2] shadow-[0_24px_90px_rgba(14,31,25,0.16)]"
    : "border-[#1a3b32]/8 bg-white/80 text-[#1a3b32] shadow-[0_18px_70px_rgba(14,31,25,0.06)]";

  return (
    <article className={`rounded-[2.5rem] border p-7 md:p-8 ${styles}`}>
      <p className={`text-[11px] uppercase tracking-[0.28em] ${dark ? "text-[#c5a47e]" : "text-[#2d5a4c]/45"}`}>{eyebrow}</p>
      <h2 className={`font-display mt-4 text-4xl leading-[0.96] ${dark ? "text-white" : "text-[#1a3b32]"}`}>{title}</h2>
      <p className={`mt-4 text-base leading-8 ${dark ? "text-[#f2f6f2]/72" : "text-[#2d5a4c]/72"}`}>{body}</p>
      {children}
    </article>
  );
}

function SimpleCallout({ title, body, dark = false }: { title: string; body: string; dark?: boolean }) {
  return (
    <article className={`rounded-[1.7rem] border p-4 ${dark ? "border-white/10 bg-white/6" : "border-[#1a3b32]/8 bg-[#f8faf8]"}`}>
      <h3 className={`font-display text-2xl ${dark ? "text-white" : "text-[#1a3b32]"}`}>{title}</h3>
      <p className={`mt-2 text-sm leading-7 ${dark ? "text-[#f2f6f2]/70" : "text-[#2d5a4c]/72"}`}>{body}</p>
    </article>
  );
}

function DirectoryCard({
  badge,
  title,
  meta,
  body,
}: {
  badge: string;
  title: string;
  meta: string;
  body: string;
}) {
  return (
    <article className="rounded-[1.8rem] border border-[#1a3b32]/8 bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6b45]">{badge}</p>
      <h3 className="font-display mt-3 text-3xl leading-tight text-[#1a3b32]">{title}</h3>
      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#2d5a4c]/56">{meta}</p>
      <p className="mt-4 break-words text-sm leading-7 text-[#2d5a4c]/72">{body}</p>
    </article>
  );
}
