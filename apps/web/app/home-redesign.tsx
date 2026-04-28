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
    <main className="min-h-screen overflow-hidden bg-[#0d1713] text-[#f4efe6]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(69,164,121,0.24),transparent_24%),radial-gradient(circle_at_90%_12%,rgba(232,175,74,0.18),transparent_20%),linear-gradient(180deg,#10201a_0%,#0d1713_42%,#efe4d2_42%,#ebe0ce_100%)]" />

      <section className="relative mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
        <header className="rounded-full border border-white/10 bg-white/6 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2eadc] text-sm font-semibold text-[#11211a]">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-white">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/50">{copy.brandTag}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a href="#journey" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.navJourney}</a>
              <a href="#network" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.navNetwork}</a>
              <Link href="/demo-script" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.navScript}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/patient" className="rounded-full bg-[#f2eadc] px-5 py-2.5 font-semibold text-[#11211a] transition hover:bg-white">{copy.navCta}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="landing" dark />

        <section className="mt-8 grid gap-7 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
            <article className="rounded-[3rem] border border-white/10 bg-[linear-gradient(160deg,rgba(17,33,26,0.98),rgba(19,51,39,0.92)_55%,rgba(31,87,65,0.78)_100%)] p-7 shadow-[0_36px_120px_rgba(0,0,0,0.28)] md:p-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-emerald-100/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {copy.announcement}
              </div>

              <p className="mt-10 text-sm uppercase tracking-[0.34em] text-white/45">{copy.eyebrow}</p>
              <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.9] text-white md:text-7xl">{copy.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 md:text-xl">{copy.body}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/patient" className="rounded-full bg-[#f2eadc] px-6 py-3 text-sm font-semibold text-[#11211a] transition hover:bg-white">{copy.primaryCta}</Link>
                <a href="#network" className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">{copy.secondaryCta}</a>
                <Link href="/demo-script" className="rounded-full px-5 py-3 text-sm font-semibold text-white/68 transition hover:text-white">{copy.scriptCta}</Link>
              </div>

              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {copy.quickPoints.map((point) => (
                  <DarkInfoCard key={point.label} label={point.label}>
                    {point.value}
                  </DarkInfoCard>
                ))}
              </div>
            </article>

            <div className="grid gap-5">
              <article className="rounded-[2.4rem] border border-white/10 bg-[#f3ebde] p-6 text-[#10211a] shadow-[0_22px_70px_rgba(0,0,0,0.16)]">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#5b6d65]">{copy.productEyebrow}</p>
                <h2 className="font-display mt-4 text-4xl leading-[0.94] text-[#10211a]">{copy.productTitle}</h2>
                <div className="mt-6 grid gap-3">
                  {copy.productMoments.map((moment) => (
                    <div key={moment.title} className="rounded-[1.6rem] border border-[#17392d]/10 bg-white/72 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6f8078]">{moment.step}</p>
                      <p className="mt-2 font-display text-2xl text-[#10211a]">{moment.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#42554d]">{moment.body}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2.4rem] border border-white/10 bg-white/8 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{copy.signalEyebrow}</p>
                <h2 className="font-display mt-4 text-4xl leading-[0.94] text-white">{copy.signalTitle}</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/72">{copy.signalBody}</p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {marketing.heroStats.map((stat) => (
                    <MetricTile key={stat.label} label={stat.label} value={stat.value} dark />
                  ))}
                </div>
              </article>
            </div>
        </section>

        <section id="journey" className="mt-20 rounded-[3rem] border border-[#17392d]/10 bg-[#efe5d7] p-7 text-[#13231d] shadow-[0_28px_100px_rgba(20,24,22,0.08)] md:p-9">
          <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#6d7d75]">{copy.journeyEyebrow}</p>
              <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#13231d] md:text-6xl">{copy.journeyTitle}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#4a5d54]">{copy.journeyBody}</p>

              <div className="mt-8 grid gap-4">
                {marketing.patientBenefits.slice(0, 2).map((card) => (
                  <article key={card.name} className="rounded-[1.9rem] border border-[#17392d]/10 bg-white/72 p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#6c7c74]">{card.name}</p>
                    <h3 className="font-display mt-3 text-3xl leading-tight text-[#13231d]">{card.headline}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#4b5e56]">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {marketing.patientJourney.map((step) => (
                <article key={step.step} className="rounded-[2.1rem] border border-[#17392d]/10 bg-[linear-gradient(180deg,#fffdf8,#f8f1e6)] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-6xl leading-none text-[#c0c9c4]">{step.step}</span>
                    <span className="rounded-full bg-[#17392d]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{step.state}</span>
                  </div>
                  <h3 className="font-display mt-7 text-4xl leading-[0.94] text-[#13231d]">{step.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[#4a5d54]">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="network" className="mt-20 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[2.7rem] border border-white/10 bg-[linear-gradient(160deg,#13271f,#17392d_55%,#224536)] p-7 shadow-[0_28px_100px_rgba(0,0,0,0.22)] md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-100/58">{copy.networkEyebrow}</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.92] text-white md:text-6xl">{copy.networkTitle}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">{copy.networkBody}</p>

            <div className="mt-8 grid gap-4">
              {marketing.networkRoles.filter((role) => role.href !== "/patient").map((role) => (
                <Link key={role.href} href={role.href} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-3xl text-white">{role.name}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-100/72">{copy.networkBadge}</span>
                  </div>
                  <p className="mt-4 text-base leading-7 text-white/72">{role.detail}</p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2.7rem] border border-[#17392d]/10 bg-[#f4ecdf] p-7 text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)] md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-[#6d7d75]">{copy.proofEyebrow}</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#13231d] md:text-6xl">{copy.proofTitle}</h2>
            <p className="mt-5 text-base leading-8 text-[#4a5d54]">{copy.proofBody}</p>

            <div className="mt-8 grid gap-4">
              {copy.proofPoints.map((item) => (
                <article key={item.title} className="rounded-[1.8rem] border border-[#17392d]/10 bg-white/76 p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6d7d75]">{item.metric}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-[#13231d]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4a5d54]">{item.body}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-20 rounded-[2.8rem] border border-[#17392d]/10 bg-[linear-gradient(135deg,#f6efe5,#eee1cf)] p-8 text-[#13231d] shadow-[0_24px_90px_rgba(20,24,22,0.08)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#6b7b73]">{copy.finalEyebrow}</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl leading-[0.92] text-[#13231d] md:text-6xl">{copy.finalTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#4a5d54]">{copy.finalBody}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {copy.finalCtas.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-[1.8rem] border border-[#17392d]/10 bg-white/70 p-5 transition hover:bg-white">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6c7c74]">{item.label}</p>
                  <p className="font-display mt-3 text-3xl text-[#13231d]">{item.value}</p>
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
        eyebrow: "Cannabis medicinal con calidad de producto real",
        title: "La forma mas simple de llegar desde una consulta hasta una medicina confiable.",
        body: "Trust Leaf une pacientes, medicos y dispensarios en una experiencia privada, trazable y mucho mas clara que el proceso actual.",
        primaryCta: "Entrar como paciente",
        secondaryCta: "Soy medico o dispensario",
        scriptCta: "Abrir script de demo",
        quickPoints: [
          { label: "Passkeys", value: "Entrada biometrica sin seed phrases." },
          { label: "Privacidad", value: "La receta no se vuelve un PDF expuesto." },
          { label: "Compra", value: "El paciente revisa origen y disponibilidad antes de salir." },
        ],
        signalEyebrow: "Infraestructura real",
        signalTitle: "No es solo una idea bien presentada.",
        signalBody: "La identidad wallet-less, el sponsor fee-bump, la trazabilidad y los contratos Soroban ya viven detras de la experiencia.",
        productEyebrow: "Lo que siente el paciente",
        productBadge: "Patient-first",
        productTitle: "Menos burocracia. Menos friccion. Mas confianza.",
        productMoments: [
          { step: "01", title: "Encontrar ayuda", body: "Medicos verificados dentro de la misma red." },
          { step: "02", title: "Recibir una receta privada", body: "Valida para la red, protegida para la persona." },
          { step: "03", title: "Comprar con evidencia", body: "Inventario, lote y laboratorio visibles antes del checkout." },
        ],
        journeyEyebrow: "Ruta paciente",
        journeyTitle: "Una historia clara en tres pasos.",
        journeyBody: "La landing tiene una sola tarea: mostrar que Trust Leaf hace que el journey del paciente se vea finalmente moderno.",
        networkEyebrow: "Red profesional",
        networkTitle: "Eres medico o dispensario cannabico? Unete a esta red mundial de trazabilidad y salud.",
        networkBody: "El paciente entra solo. Los actores regulados entran con validacion manual. Eso le da confianza al ecosistema entero.",
        networkBadge: "Acceso aprobado",
        proofEyebrow: "Lo que ya esta probado",
        proofTitle: "El MVP ya tiene base para sostener esta promesa.",
        proofBody: "La presentacion ya no depende de explicar tecnologia todo el tiempo. La tecnologia ahora respalda una experiencia mas limpia.",
        proofPoints: [
          { metric: "Contratos", title: "RBAC, trazabilidad y receta privada corren en testnet.", body: "La app ya consulta ese deployment live y lo usa como fuente real." },
          { metric: "Identidad", title: "Passkeys, Supabase y sponsor ya funcionan como MVP serio.", body: "La complejidad de entrada se escondio donde realmente corresponde." },
          { metric: "Actores", title: "Paciente, medico, dispensario y superadmin ya tienen su propio rail.", body: "Cada uno entra a un lane distinto con un nivel distinto de control." },
        ],
        finalEyebrow: "Entrar ahora",
        finalTitle: "Primero se ve como producto. Despues se descubre que ya corre sobre Stellar.",
        finalBody: "Eso es exactamente lo que deberia pasar frente a un jurado: claridad primero, infraestructura despues.",
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
        eyebrow: "Medicinal cannabis with real product quality",
        title: "The simplest way to move from a consult to trusted medicine.",
        body: "Trust Leaf brings patients, doctors, and dispensaries into one private, traceable experience that feels much clearer than the current process.",
        primaryCta: "Enter as patient",
        secondaryCta: "I am a doctor or dispensary",
        scriptCta: "Open demo script",
        quickPoints: [
          { label: "Passkeys", value: "Biometric entry without seed phrases." },
          { label: "Privacy", value: "The prescription does not become an exposed PDF." },
          { label: "Purchase", value: "Patients review origin and availability before leaving home." },
        ],
        signalEyebrow: "Real infrastructure",
        signalTitle: "This is not only a well-presented idea.",
        signalBody: "Wallet-less identity, fee sponsorship, traceability, and Soroban contracts already sit behind the experience.",
        productEyebrow: "What the patient feels",
        productBadge: "Patient-first",
        productTitle: "Less bureaucracy. Less friction. More trust.",
        productMoments: [
          { step: "01", title: "Find help", body: "Verified doctors inside the same network." },
          { step: "02", title: "Receive a private prescription", body: "Valid for the network, protected for the person." },
          { step: "03", title: "Buy with evidence", body: "Inventory, batch, and lab signals are visible before checkout." },
        ],
        journeyEyebrow: "Patient route",
        journeyTitle: "One clear story in three steps.",
        journeyBody: "The landing has one job: show that Trust Leaf finally makes the patient journey feel modern.",
        networkEyebrow: "Professional network",
        networkTitle: "Are you a cannabis doctor or dispensary? Join this global trust and health network.",
        networkBody: "Patients enter on their own. Regulated actors enter through manual approval. That protects trust across the whole ecosystem.",
        networkBadge: "Approved access",
        proofEyebrow: "What is already proven",
        proofTitle: "The MVP already has the foundation to support this promise.",
        proofBody: "The presentation no longer depends on over-explaining technology. The technology now supports a cleaner experience.",
        proofPoints: [
          { metric: "Contracts", title: "RBAC, traceability, and private prescriptions run on testnet.", body: "The app already reads that deployment live and uses it as a real source of truth." },
          { metric: "Identity", title: "Passkeys, Supabase, and sponsorship already work as a serious MVP.", body: "Entry complexity has been hidden where it actually belongs." },
          { metric: "Actors", title: "Patient, doctor, dispensary, and superadmin already have separate rails.", body: "Each one enters a different lane with a different level of control." },
        ],
        finalEyebrow: "Enter now",
        finalTitle: "It looks like a product first. Then you learn it already runs on Stellar.",
        finalBody: "That is exactly what should happen in front of judges: clarity first, infrastructure second.",
        finalCtas: [
          { label: "Patient", value: "Enter as patient", href: "/patient" },
          { label: "Doctor", value: "Open doctor POV", href: "/doctor" },
          { label: "Dispensary", value: "Open dispensary POV", href: "/dispensary" },
          { label: "Presentation", value: "Open demo script", href: "/demo-script" },
        ],
      };
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

function DarkInfoCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-white/6 p-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/48">{label}</p>
      <p className="mt-3 text-sm leading-6 text-white/78">{children}</p>
    </article>
  );
}
