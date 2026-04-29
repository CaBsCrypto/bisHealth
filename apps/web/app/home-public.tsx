import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "./language-switcher";
import { getMarketingData, type Locale } from "./lib/i18n";
import type { IndexedSnapshot } from "./indexed-state";

type MarketingData = ReturnType<typeof getMarketingData>;

type DirectoryCard = {
  name: string;
  body: string;
  badge: string;
  meta: string;
  live: boolean;
};

const ACTOR_ALIASES: Record<string, string> = {
  GD2MXRXHYBSSY7CXQWAYN5S7OHAUVEULPHV4SYQA3542GIQLUGJ57VNX: "Dr. Andres Vera",
  GCJLFG6PX6OA6JBJPQP2PXBJ7SD726O4R46IMWD4GBK3CX7HCWEJZRJ6: "Green North Dispensary",
};

export function HomePublic({
  locale,
  marketing,
  indexedState,
}: {
  locale: Locale;
  marketing: MarketingData;
  indexedState: IndexedSnapshot;
}) {
  const copy = getCopy(locale);
  const doctors = buildDoctors(indexedState, locale);
  const dispensaries = buildDispensaries(indexedState, locale);
  const liveDoctorCount = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DOCTOR"),
  ).length;
  const liveDispCount = indexedState.roleMemberships.filter(
    (membership) => membership.isActive && membership.role.includes("DISP"),
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#07120f] text-[#f4efe6]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(42,131,95,0.28),transparent_24%),radial-gradient(circle_at_88%_8%,rgba(214,164,72,0.18),transparent_18%),linear-gradient(180deg,#081310_0%,#0d1f18_44%,#efe5d6_44%,#efe7da_100%)]" />
      <section className="relative mx-auto max-w-7xl px-5 py-5 md:px-8 md:py-8">
        <header className="rounded-full border border-white/10 bg-black/15 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.2)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2eadc] text-sm font-semibold text-[#10211a]">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-white">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/48">{copy.brandTag}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a href="#how" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.navHow}</a>
              <a href="#network" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.navNetwork}</a>
              <LanguageSwitcher locale={locale} />
              <Link href="/patient" className="rounded-full bg-[#f2eadc] px-5 py-2.5 font-semibold text-[#10211a] transition hover:bg-white">{copy.navCta}</Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-7 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
          <article className="rounded-[3rem] border border-white/10 bg-[linear-gradient(160deg,rgba(17,33,26,0.98),rgba(19,51,39,0.92)_55%,rgba(31,87,65,0.78)_100%)] p-7 shadow-[0_36px_120px_rgba(0,0,0,0.28)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-emerald-100/90">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {copy.announcement}
            </div>
            <p className="mt-10 text-sm uppercase tracking-[0.34em] text-white/45">{copy.eyebrow}</p>
            <h1 className="font-display mt-5 max-w-5xl text-5xl leading-[0.9] text-white md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/76 md:text-xl">{copy.body}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/patient" className="rounded-full bg-[#f2eadc] px-6 py-3 text-sm font-semibold text-[#11211a] transition hover:bg-white">{copy.primaryCta}</Link>
              <Link href="/walletless" className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">{copy.liveCta}</Link>
              <Link href="/demo-script" className="rounded-full px-5 py-3 text-sm font-semibold text-white/68 transition hover:text-white">{copy.mockCta}</Link>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              <HeroStat label={copy.metricDoctors} value={String(liveDoctorCount)} />
              <HeroStat label={copy.metricDisp} value={String(liveDispCount)} />
              <HeroStat label={copy.metricRx} value={String(indexedState.prescriptions.length)} />
            </div>
          </article>

          <article className="rounded-[2.4rem] border border-white/10 bg-white/8 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{copy.rightEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-[0.94] text-white">{copy.rightTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.rightPoints.map((point) => (
                <article key={point.title} className="rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/48">{point.badge}</p>
                  <p className="mt-2 font-display text-2xl text-white">{point.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/72">{point.body}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section id="how" className="mt-20 rounded-[3rem] border border-[#17392d]/10 bg-[#efe5d7] p-7 text-[#13231d] shadow-[0_28px_100px_rgba(20,24,22,0.08)] md:p-9">
          <p className="text-sm uppercase tracking-[0.3em] text-[#6d7d75]">{copy.howEyebrow}</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.92] text-[#13231d] md:text-6xl">{copy.howTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {marketing.patientJourney.map((step) => (
              <article key={step.step} className="rounded-[2rem] border border-[#17392d]/10 bg-[linear-gradient(180deg,#fffdf8,#f8f1e6)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-6xl leading-none text-[#c0c9c4]">{step.step}</span>
                  <span className="rounded-full bg-[#17392d]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{step.state}</span>
                </div>
                <h3 className="font-display mt-7 text-4xl leading-[0.94] text-[#13231d]">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#4a5d54]">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="network" className="mt-20 grid gap-6 xl:grid-cols-2">
          <SurfaceCard eyebrow={copy.doctorsEyebrow} title={copy.doctorsTitle} body={copy.doctorsBody} dark>
            <div className="mt-8 grid gap-4">
              {doctors.map((card) => <DirectorySurface key={card.name} card={card} dark />)}
            </div>
          </SurfaceCard>
          <SurfaceCard eyebrow={copy.dispensaryEyebrow} title={copy.dispensaryTitle} body={copy.dispensaryBody} light>
            <div className="mt-8 grid gap-4">
              {dispensaries.map((card) => <DirectorySurface key={card.name} card={card} />)}
            </div>
          </SurfaceCard>
        </section>

        <section className="mt-20 rounded-[2.8rem] border border-[#17392d]/10 bg-[linear-gradient(135deg,#f6efe5,#eee1cf)] p-8 text-[#13231d] shadow-[0_24px_90px_rgba(20,24,22,0.08)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#6b7b73]">{copy.finalEyebrow}</p>
              <h2 className="font-display mt-4 max-w-4xl text-5xl leading-[0.92] text-[#13231d] md:text-6xl">{copy.finalTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#4a5d54]">{copy.finalBody}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/patient" className="rounded-full bg-[#163c30] px-6 py-3 text-sm font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">{copy.primaryCta}</Link>
              <Link href="/walletless" className="rounded-full border border-[#17392d]/12 bg-white/72 px-6 py-3 text-sm font-semibold text-[#163c30] transition hover:bg-white">{copy.liveCta}</Link>
              <Link href="/demo-script" className="rounded-full border border-[#17392d]/12 bg-white/72 px-6 py-3 text-sm font-semibold text-[#163c30] transition hover:bg-white">{copy.mockCta}</Link>
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
        brandTag: "Red medicinal privada y trazable",
        navHow: "Como funciona",
        navNetwork: "Red verificada",
        navCta: "Entrar",
        announcement: "MVP listo para jueces, grants y testnet",
        eyebrow: "Cannabis medicinal con calidad de producto real",
        title: "Encuentra medico, valida tu receta y compra con confianza.",
        body: "Trust Leaf organiza todo el journey del paciente en una experiencia privada, simple y mucho mas clara.",
        primaryCta: "Entrar como paciente",
        liveCta: "Entrar con passkeys o Freighter",
        mockCta: "Ver demo/mockup",
        metricDoctors: "Medicos verificados",
        metricDisp: "Dispensarios listos",
        metricRx: "Recetas en red",
        rightEyebrow: "Que cambia",
        rightTitle: "Lo importante se entiende en segundos.",
        rightPoints: [
          { badge: "01", title: "Encuentras atencion", body: "Ves medicos aprobados sin entrar a dashboards internos." },
          { badge: "02", title: "Tu receta sigue privada", body: "La red valida lo necesario sin exponer informacion medica." },
          { badge: "03", title: "Compras mirando inventario", body: "El paciente revisa dispensario, lote y readiness antes de salir." },
        ],
        howEyebrow: "Ruta paciente",
        howTitle: "Tres pasos. Nada mas.",
        doctorsEyebrow: "Medicos visibles",
        doctorsTitle: "Profesionales que ya pueden operar en la red.",
        doctorsBody: "La landing publica solo muestra discovery: quien puede atenderte y que tipo de soporte ofrece.",
        dispensaryEyebrow: "Dispensarios visibles",
        dispensaryTitle: "Puntos de venta listos para validar y entregar.",
        dispensaryBody: "El paciente ve actores verificados y readiness operativo, no paneles internos.",
        finalEyebrow: "Entrar ahora",
        finalTitle: "Primero entiendes el producto. Despues descubres la infraestructura.",
        finalBody: "Eso es exactamente lo que deberia pasar frente a un jurado o un paciente real.",
      }
    : {
        brandTag: "Private and traceable medicinal network",
        navHow: "How it works",
        navNetwork: "Verified network",
        navCta: "Enter",
        announcement: "MVP ready for judges, grants, and testnet",
        eyebrow: "Medicinal cannabis with real product quality",
        title: "Find care, validate your prescription, and buy with confidence.",
        body: "Trust Leaf organizes the full patient journey into one private, simple, and much clearer experience.",
        primaryCta: "Enter as patient",
        liveCta: "Enter with passkeys or Freighter",
        mockCta: "View demo/mockup",
        metricDoctors: "Verified doctors",
        metricDisp: "Ready dispensaries",
        metricRx: "Prescriptions on network",
        rightEyebrow: "What changes",
        rightTitle: "The important part becomes clear in seconds.",
        rightPoints: [
          { badge: "01", title: "You find care", body: "You see approved doctors without entering internal dashboards." },
          { badge: "02", title: "Your prescription stays private", body: "The network validates what is needed without exposing medical context." },
          { badge: "03", title: "You buy against visible inventory", body: "The patient reviews dispensary, batch, and readiness before leaving home." },
        ],
        howEyebrow: "Patient route",
        howTitle: "Three steps. Nothing else.",
        doctorsEyebrow: "Visible doctors",
        doctorsTitle: "Professionals who can already operate on the network.",
        doctorsBody: "The public landing only shows discovery: who can care for you and what support they offer.",
        dispensaryEyebrow: "Visible dispensaries",
        dispensaryTitle: "Retail points ready to validate and deliver.",
        dispensaryBody: "Patients see verified actors and operational readiness, not internal dashboards.",
        finalEyebrow: "Enter now",
        finalTitle: "You understand the product first. Then you discover the infrastructure.",
        finalBody: "That is exactly what should happen in front of judges or a real patient.",
      };
}

function buildDoctors(snapshot: IndexedSnapshot, locale: Locale): DirectoryCard[] {
  const live = snapshot.roleMemberships
    .filter((membership) => membership.isActive && membership.role.includes("DOCTOR"))
    .map((membership) => ({
      name: ACTOR_ALIASES[membership.account] ?? `Doctor ${membership.account.slice(-6)}`,
      body: locale === "es" ? "Recetas privadas activas y onboarding curado." : "Private prescriptions and curated onboarding.",
      badge: locale === "es" ? "Live en testnet" : "Live on testnet",
      meta: shortAccount(membership.account),
      live: true,
    }));
  const preview = locale === "es"
    ? [{ name: "Dra. Camila Rojas", body: "Dolor cronico y seguimiento longitudinal.", badge: "Preview", meta: "Preview", live: false }]
    : [{ name: "Dr. Camila Rojas", body: "Chronic pain and longitudinal follow-up.", badge: "Preview", meta: "Preview", live: false }];
  return [...live, ...preview].slice(0, 3);
}

function buildDispensaries(snapshot: IndexedSnapshot, locale: Locale): DirectoryCard[] {
  const live = snapshot.roleMemberships
    .filter((membership) => membership.isActive && membership.role.includes("DISP"))
    .map((membership) => ({
      name: ACTOR_ALIASES[membership.account] ?? `Dispensary ${membership.account.slice(-6)}`,
      body: locale === "es" ? "Listo para validar receta y mostrar stock." : "Ready to validate prescriptions and show stock.",
      badge: locale === "es" ? "Live en testnet" : "Live on testnet",
      meta: shortAccount(membership.account),
      live: true,
    }));
  const preview = locale === "es"
    ? [{ name: "Patagonia Care", body: "Catalogo premium y laboratorio visible.", badge: "Preview", meta: "Preview", live: false }]
    : [{ name: "Patagonia Care", body: "Premium catalog and visible lab status.", badge: "Preview", meta: "Preview", live: false }];
  return [...live, ...preview].slice(0, 3);
}

function shortAccount(account: string) {
  return `${account.slice(0, 4)}...${account.slice(-4)}`;
}

function HeroStat({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5">
      <p className={`text-xs uppercase tracking-[0.24em] ${dark ? "text-[#9dcbb6]" : "text-white/48"}`}>{label}</p>
      <p className="font-display mt-4 text-4xl leading-none text-white">{value}</p>
    </article>
  );
}

function SurfaceCard({
  eyebrow,
  title,
  body,
  children,
  dark = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
  dark?: boolean;
  light?: boolean;
}) {
  const styles = dark
    ? "border-white/10 bg-[linear-gradient(160deg,#13271f,#17392d_55%,#224536)] text-white shadow-[0_28px_100px_rgba(0,0,0,0.22)]"
    : light
      ? "border-[#17392d]/10 bg-[#f4ecdf] text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)]"
      : "border-[#17392d]/10 bg-[#f3ebde] text-[#10211a] shadow-[0_22px_70px_rgba(0,0,0,0.16)]";

  return (
    <article className={`rounded-[2.4rem] border p-6 md:p-8 ${styles}`}>
      <p className={`text-[11px] uppercase tracking-[0.28em] ${dark ? "text-emerald-100/58" : "text-[#5b6d65]"}`}>{eyebrow}</p>
      <h2 className={`font-display mt-4 text-4xl leading-[0.94] ${dark ? "text-white" : "text-[#10211a]"}`}>{title}</h2>
      <p className={`mt-4 text-base leading-7 ${dark ? "text-white/72" : "text-[#4a5d54]"}`}>{body}</p>
      {children}
    </article>
  );
}

function DirectorySurface({ card, dark = false }: { card: DirectoryCard; dark?: boolean }) {
  return (
    <article className={`rounded-[1.8rem] border p-5 ${dark ? "border-white/10 bg-white/6" : "border-[#17392d]/10 bg-white/76"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[11px] uppercase tracking-[0.24em] ${dark ? "text-white/48" : "text-[#6d7d75]"}`}>{card.badge}</p>
          <h3 className={`font-display mt-3 text-3xl leading-tight ${dark ? "text-white" : "text-[#13231d]"}`}>{card.name}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${card.live ? (dark ? "bg-emerald-300/16 text-emerald-100" : "bg-emerald-500/10 text-emerald-700") : dark ? "bg-white/10 text-white/72" : "bg-[#17392d]/6 text-[#21483a]"}`}>{card.meta}</span>
      </div>
      <p className={`mt-4 text-sm leading-7 ${dark ? "text-white/72" : "text-[#4a5d54]"}`}>{card.body}</p>
    </article>
  );
}
