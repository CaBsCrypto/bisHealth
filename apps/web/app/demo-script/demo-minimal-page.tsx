import Link from "next/link";

import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";

export function DemoMinimalPage({ locale }: { locale: "en" | "es" }) {
  const copy = locale === "es"
    ? {
        brand: "Modo demo",
        back: "Volver",
        live: "Abrir live",
        eyebrow: "Demo simple",
        title: "Muestra solo esto.",
        body: "Paciente primero. Operacion despues. Infra al final.",
        open: "Abre estas pantallas",
        order: "Sigue este orden",
        liveTitle: "Si muestras live",
        close: "Que deben recordar",
        routes: [
          { title: "Landing", href: "/" },
          { title: "Patient", href: "/patient" },
          { title: "Doctor", href: "/doctor" },
          { title: "Dispensary", href: "/dispensary" },
          { title: "Superadmin", href: "/superadmin" },
          { title: "Command center", href: "/command-center" },
        ],
        steps: [
          "1. Landing: el problema hoy esta fragmentado.",
          "2. Patient: asi se ve la experiencia ideal.",
          "3. Doctor: el medico emite y hace seguimiento.",
          "4. Dispensary: se valida receta y se muestra inventario.",
          "5. Superadmin: la red es curada, no abierta.",
          "6. Command center: esto ya corre sobre testnet.",
        ],
        livePoints: [
          "Entra antes por /walletless.",
          "Si algo falla, vuelve al camino demo.",
          "No conviertas la demo en debugging.",
        ],
        closePoints: [
          "El flujo del paciente es claro.",
          "La privacidad sigue protegida.",
          "La infraestructura ya existe.",
        ],
      }
    : {
        brand: "Demo mode",
        back: "Back",
        live: "Open live",
        eyebrow: "Simple demo",
        title: "Only show this.",
        body: "Patient first. Operations second. Infrastructure last.",
        open: "Open these screens",
        order: "Follow this order",
        liveTitle: "If you show live",
        close: "What they should remember",
        routes: [
          { title: "Landing", href: "/" },
          { title: "Patient", href: "/patient" },
          { title: "Doctor", href: "/doctor" },
          { title: "Dispensary", href: "/dispensary" },
          { title: "Superadmin", href: "/superadmin" },
          { title: "Command center", href: "/command-center" },
        ],
        steps: [
          "1. Landing: the problem is fragmented today.",
          "2. Patient: this is the ideal experience.",
          "3. Doctor: the doctor issues and follows up.",
          "4. Dispensary: the prescription is validated and inventory is shown.",
          "5. Superadmin: the network is curated, not open.",
          "6. Command center: this already runs on testnet.",
        ],
        livePoints: [
          "Sign in first at /walletless.",
          "If something fails, return to the demo path.",
          "Do not turn the demo into debugging.",
        ],
        closePoints: [
          "The patient flow is clear.",
          "Privacy stays protected.",
          "The infrastructure already exists.",
        ],
      };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a120f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(48,132,95,0.22),transparent_22%),linear-gradient(180deg,#0a120f_0%,#13221b_38%,#efe6d8_38%,#efe9de_100%)]" />

      <section className="relative mx-auto max-w-5xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-white/10 bg-black/15 px-4 py-3 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2eadc] text-sm font-semibold text-[#10211a]">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-white">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/48">{copy.brand}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.back}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-[#f2eadc] px-5 py-2.5 font-semibold text-[#10211a] transition hover:bg-white">{copy.live}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="demo" dark />

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-[linear-gradient(145deg,#091611,#10261d_56%,#16352a)] p-8 shadow-[0_28px_90px_rgba(0,0,0,0.24)] md:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/72">{copy.eyebrow}</p>
          <h1 className="font-display mt-5 text-5xl leading-[0.92] text-white md:text-7xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{copy.body}</p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-[#17392d]/10 bg-[#f4ecdf] p-6 text-[#13231d] shadow-[0_18px_70px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.open}</p>
            <div className="mt-5 grid gap-3">
              {copy.routes.map((route) => (
                <Link key={route.href} href={route.href} className="rounded-[1.3rem] border border-[#163c30]/10 bg-white/72 px-4 py-4 font-display text-2xl text-[#12261d] transition hover:bg-white">
                  {route.title}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#17392d]/10 bg-[#f4ecdf] p-6 text-[#13231d] shadow-[0_18px_70px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.order}</p>
            <div className="mt-5 grid gap-3">
              {copy.steps.map((step) => (
                <article key={step} className="rounded-[1.3rem] border border-[#163c30]/10 bg-white/72 px-4 py-4 text-sm leading-7 text-[#31453c]">
                  {step}
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_22px_80px_rgba(21,50,40,0.16)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.liveTitle}</p>
            <div className="mt-5 grid gap-3">
              {copy.livePoints.map((point) => (
                <article key={point} className="rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-[#d5e3dc]">
                  {point}
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#17392d]/10 bg-[#f4ecdf] p-6 text-[#13231d] shadow-[0_18px_70px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.close}</p>
            <div className="mt-5 grid gap-3">
              {copy.closePoints.map((point) => (
                <article key={point} className="rounded-[1.3rem] border border-[#163c30]/10 bg-white/72 px-4 py-4 text-sm leading-7 text-[#31453c]">
                  {point}
                </article>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
