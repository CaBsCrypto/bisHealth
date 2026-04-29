import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "../language-switcher";
import { PresentationStrip } from "../presentation-strip";

export function DemoPresenterPage({ locale }: { locale: "en" | "es" }) {
  const copy = getDemoScriptCopy(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#07120f] text-[#f3eee4]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(53,144,105,0.24),transparent_24%),radial-gradient(circle_at_84%_10%,rgba(201,156,70,0.16),transparent_20%),linear-gradient(180deg,#07120f_0%,#0b1f18_40%,#efe5d7_40%,#efe8dc_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-white/10 bg-black/15 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.2)] backdrop-blur">
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
              <Link href="/patient" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.openPatient}</Link>
              <Link href="/admin" className="rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">{copy.openAdmin}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-[#f2eadc] px-5 py-2.5 font-semibold text-[#10211a] transition hover:bg-white">{copy.liveCta}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="demo" dark />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
          <article className="rounded-[2.8rem] border border-white/10 bg-[linear-gradient(150deg,#08140f,#10271e_56%,#1a4a38)] p-7 shadow-[0_30px_110px_rgba(0,0,0,0.26)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-100/90">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {copy.eyebrow}
            </div>
            <h1 className="font-display mt-8 max-w-4xl text-5xl leading-[0.92] text-white md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 md:text-xl">{copy.body}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.topline.map((item) => (
                <HeroTile key={item.label} label={item.label}>{item.value}</HeroTile>
              ))}
            </div>
          </article>

          <article className="rounded-[2.3rem] border border-white/10 bg-black/20 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.18)]">
            <p className="text-xs uppercase tracking-[0.28em] text-white/48">{copy.presenterEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-white">{copy.presenterTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.presenterTips.map((tip) => (
                <article key={tip} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/76">{tip}</article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[2.2rem] border border-[#17392d]/10 bg-[#f4ecdf] p-6 text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.openingEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.openingTitle}</h2>
            <p className="mt-5 rounded-[1.7rem] border border-[#163c30]/10 bg-white/72 p-5 text-base leading-8 text-[#31453c]">{copy.openingLine}</p>
          </article>

          <article className="rounded-[2.2rem] border border-[#17392d]/10 bg-[#f4ecdf] p-6 text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.preflightEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.preflightTitle}</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {copy.preflight.map((item) => (
                <ChecklistItem key={item}>{item}</ChecklistItem>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-20">
          <SectionLead eyebrow={copy.routesEyebrow} title={copy.routesTitle} body={copy.routesBody} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copy.routes.map((route) => (
              <Link key={route.href} href={route.href} className="rounded-[1.8rem] border border-[#17392d]/10 bg-[#f5ede0] p-5 text-[#13231d] shadow-[0_18px_70px_rgba(31,58,47,0.06)] transition hover:-translate-y-0.5 hover:bg-white">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-3xl">{route.title}</p>
                  <span className="rounded-full bg-[#163c30]/6 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#21483a]">{route.tag}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#4d5f57]">{route.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionLead eyebrow={copy.runbookEyebrow} title={copy.runbookTitle} body={copy.runbookBody} />
          <div className="mt-8 grid gap-5">
            {copy.steps.map((step) => (
              <article key={step.step} className="rounded-[2.2rem] border border-[#17392d]/10 bg-[#f5ede0] p-6 text-[#13231d] shadow-[0_18px_70px_rgba(31,58,47,0.06)]">
                <div className="grid gap-5 xl:grid-cols-[0.16fr_0.84fr] xl:items-start">
                  <div className="rounded-[1.8rem] bg-[#163c30] px-5 py-6 text-[#f3faf6]">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#99c8b3]">{copy.stepLabel}</p>
                    <p className="font-display mt-3 text-5xl leading-none">{step.step}</p>
                    <p className="mt-3 text-sm leading-6 text-[#d5e3dc]">{step.runtime}</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#163c30]/7 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#21483a]">{step.mode}</span>
                      <span className="rounded-full border border-[#163c30]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#4a5d54]">{step.route}</span>
                    </div>
                    <h3 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{step.title}</h3>
                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
                      <SimpleNote label={copy.sayLabel}>{step.say}</SimpleNote>
                      <SimpleNote label={copy.showLabel}>{step.show}</SimpleNote>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2.2rem] border border-white/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.liveEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9]">{copy.liveTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.liveChecklist.map((item) => (
                <article key={item} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d5e3dc]">{item}</article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-[#17392d]/10 bg-[#f4ecdf] p-6 text-[#13231d] shadow-[0_20px_80px_rgba(20,24,22,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.closeEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.closeTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.closePoints.map((item) => (
                <article key={item} className="rounded-[1.6rem] border border-[#163c30]/10 bg-white/72 p-4 text-sm leading-7 text-[#31453c]">{item}</article>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

function getDemoScriptCopy(locale: "en" | "es") {
  return locale === "es"
    ? {
        brand: "Presenter mode",
        back: "Volver al landing",
        openPatient: "Abrir paciente",
        openAdmin: "Abrir admin hub",
        liveCta: "Abrir wallet-less",
        eyebrow: "Demo preparado",
        title: "Un guion corto para que el MVP se entienda y se sienta serio.",
        body: "Esta pagina ya no es documentacion. Es una mesa de presentacion: abre, navega, remata y vuelve a control sin improvisar.",
        topline: [
          { label: "Duracion", value: "6-8 min" },
          { label: "Narrativa", value: "Producto primero" },
          { label: "Cierre", value: "Live si conviene" },
        ],
        presenterEyebrow: "Regla central",
        presenterTitle: "No vendas blockchain. Vende salud, privacidad y confianza.",
        presenterTips: [
          "Empieza por el paciente y no por la infraestructura.",
          "Usa el camino demo como ruta principal; deja el live como prueba final.",
          "Si una accion real falla, vuelve a la historia y no al debug.",
        ],
        openingEyebrow: "Primeros 20 segundos",
        openingTitle: "La frase que abre la demo.",
        openingLine:
          "Trust Leaf unifica atencion medica, receta privada y compra segura en una sola experiencia que hoy esta fragmentada.",
        preflightEyebrow: "Checklist previo",
        preflightTitle: "Lo minimo que debe estar listo antes de compartir pantalla.",
        preflight: [
          "Landing abierta en una pestaña limpia.",
          "Patient, doctor, dispensary y superadmin ya cargados.",
          "Wallet-less listo si decides mostrar passkeys o Freighter.",
          "No dependas del rail live para contar la historia principal.",
        ],
        routesEyebrow: "Quick launch",
        routesTitle: "Las vistas que si vale la pena abrir.",
        routesBody: "Cada una tiene un rol claro dentro de la historia. No abras todo.",
        routes: [
          { title: "Landing", tag: "Inicio", body: "Problema, propuesta y discovery visible para pacientes.", href: "/" },
          { title: "Patient", tag: "Core", body: "La mejor pantalla para explicar el producto real.", href: "/patient" },
          { title: "Doctor", tag: "Operacion", body: "Donde el medico emite y sigue continuidad clinica.", href: "/doctor" },
          { title: "Dispensary", tag: "Retail", body: "Donde se valida la receta y se muestra inventario.", href: "/dispensary" },
          { title: "Superadmin", tag: "Governance", body: "Donde se ve por que esta red es curada.", href: "/superadmin" },
          { title: "Command center", tag: "Infra", body: "La prueba corta de que esto ya corre en testnet.", href: "/command-center" },
        ],
        runbookEyebrow: "Orden recomendado",
        runbookTitle: "Una secuencia que funciona frente a jueces.",
        runbookBody: "Abre contexto. Muestra producto. Cierra con prueba.",
        stepLabel: "Paso",
        sayLabel: "Que decir",
        showLabel: "Que mostrar",
        steps: [
          { step: "01", runtime: "45s", mode: "Landing", route: "/", title: "Abre con el journey roto del paciente.", say: "Hoy el paciente resuelve medico, receta y compra en sistemas separados.", show: "Hero, propuesta de valor y medicos/dispensarios visibles." },
          { step: "02", runtime: "60s", mode: "Patient", route: "/patient", title: "Muestra la experiencia ideal.", say: "Asi se deberia sentir: privada, simple y sin friccion cripto visible.", show: "Medicos, receta activa e inventario listo para compra." },
          { step: "03", runtime: "50s", mode: "Doctor", route: "/doctor", title: "Entra al lado clinico.", say: "El medico opera dentro de una red aprobada y emite sin exponerse a complejidad tecnica.", show: "Agenda, pacientes y rail de issue." },
          { step: "04", runtime: "50s", mode: "Dispensary", route: "/dispensary", title: "Cierra el loop de venta.", say: "El dispensario valida elegibilidad y consume la receta para evitar doble uso.", show: "Inventario, validacion y consume." },
          { step: "05", runtime: "40s", mode: "Superadmin", route: "/superadmin", title: "Explica por que esta red es confiable.", say: "Pacientes entran solos; medicos y dispensarios son aprobados manualmente.", show: "Queue, red activa y RBAC." },
          { step: "06", runtime: "40s", mode: "Infra", route: "/command-center", title: "Prueba que el backend existe.", say: "No es solo mockup: hay contratos, indexing y readiness real en testnet.", show: "Readiness board y estado live." },
          { step: "07", runtime: "60s", mode: "Live", route: "/walletless", title: "Si conviene, remata con identidad real.", say: "Passkeys y Freighter existen como capa de acceso; la complejidad queda detras.", show: "Sesion, sponsor y acceso wallet-less." },
        ],
        liveEyebrow: "Si vas a live",
        liveTitle: "Las tres cosas que debes recordar antes del tramo real.",
        liveChecklist: [
          "Inicia sesion en /walletless antes de tocar rails protegidos.",
          "Ten presentes las secrets que habilitan submits por actor.",
          "Si algo no responde, vuelve a mockup sin romper el relato principal.",
        ],
        closeEyebrow: "Cierre",
        closeTitle: "Tres ideas para terminar fuerte.",
        closePoints: [
          "Trust Leaf convierte un proceso fragmentado en una sola experiencia.",
          "La privacidad medica sigue protegida mientras el sistema sigue siendo auditable.",
          "El MVP ya demuestra producto, operacion e infraestructura sobre Stellar testnet.",
        ],
      }
    : {
        brand: "Presenter mode",
        back: "Back to landing",
        openPatient: "Open patient",
        openAdmin: "Open admin hub",
        liveCta: "Open wallet-less",
        eyebrow: "Demo prepared",
        title: "A short script so the MVP feels clear and serious.",
        body: "This page is no longer documentation. It is a presentation desk: open, navigate, close strong, and return to control without improvising.",
        topline: [
          { label: "Duration", value: "6-8 min" },
          { label: "Narrative", value: "Product first" },
          { label: "Finish", value: "Live if needed" },
        ],
        presenterEyebrow: "Core rule",
        presenterTitle: "Do not sell blockchain. Sell healthcare, privacy, and trust.",
        presenterTips: [
          "Begin with the patient, not the infrastructure.",
          "Use the demo path as the main route; keep live as final proof.",
          "If a real action fails, go back to the story, not to debugging.",
        ],
        openingEyebrow: "First 20 seconds",
        openingTitle: "The sentence that opens the demo.",
        openingLine:
          "Trust Leaf unifies care, private prescriptions, and safe purchase into one experience that is fragmented today.",
        preflightEyebrow: "Preflight checklist",
        preflightTitle: "What should be ready before you share your screen.",
        preflight: [
          "Landing open in a clean tab.",
          "Patient, doctor, dispensary, and superadmin already loaded.",
          "Wallet-less ready if you decide to show passkeys or Freighter.",
          "Do not depend on the live rail to tell the main story.",
        ],
        routesEyebrow: "Quick launch",
        routesTitle: "The views actually worth opening.",
        routesBody: "Each one has a clear role in the story. Do not open everything.",
        routes: [
          { title: "Landing", tag: "Start", body: "Problem, value, and visible discovery for patients.", href: "/" },
          { title: "Patient", tag: "Core", body: "The best screen to explain the real product.", href: "/patient" },
          { title: "Doctor", tag: "Operations", body: "Where the doctor issues and manages continuity.", href: "/doctor" },
          { title: "Dispensary", tag: "Retail", body: "Where prescriptions are validated and inventory is shown.", href: "/dispensary" },
          { title: "Superadmin", tag: "Governance", body: "Where you show why this network is curated.", href: "/superadmin" },
          { title: "Command center", tag: "Infra", body: "The short proof that this already runs on testnet.", href: "/command-center" },
        ],
        runbookEyebrow: "Recommended order",
        runbookTitle: "A sequence that works in front of judges.",
        runbookBody: "Open context. Show product. Close with proof.",
        stepLabel: "Step",
        sayLabel: "What to say",
        showLabel: "What to show",
        steps: [
          { step: "01", runtime: "45s", mode: "Landing", route: "/", title: "Open with the broken patient journey.", say: "Today the patient solves care, prescription, and purchase across disconnected systems.", show: "Hero, value proposition, and visible doctors/dispensaries." },
          { step: "02", runtime: "60s", mode: "Patient", route: "/patient", title: "Show the ideal experience.", say: "This is how it should feel: private, simple, and without visible crypto friction.", show: "Doctors, active prescription, and inventory ready for purchase." },
          { step: "03", runtime: "50s", mode: "Doctor", route: "/doctor", title: "Enter the clinical side.", say: "The doctor operates inside an approved network and issues without carrying technical complexity.", show: "Schedule, patients, and the issue rail." },
          { step: "04", runtime: "50s", mode: "Dispensary", route: "/dispensary", title: "Close the sales loop.", say: "The dispensary validates eligibility and consumes the prescription to prevent double use.", show: "Inventory, validation, and consume." },
          { step: "05", runtime: "40s", mode: "Superadmin", route: "/superadmin", title: "Explain why the network is trustworthy.", say: "Patients enter alone; doctors and dispensaries are manually approved.", show: "Queue, active network, and RBAC." },
          { step: "06", runtime: "40s", mode: "Infra", route: "/command-center", title: "Prove the backend exists.", say: "This is not only mockup: contracts, indexing, and live readiness already exist on testnet.", show: "Readiness board and live status." },
          { step: "07", runtime: "60s", mode: "Live", route: "/walletless", title: "If useful, finish with real identity access.", say: "Passkeys and Freighter exist as the access layer; complexity stays behind the product.", show: "Session, sponsor, and wallet-less access." },
        ],
        liveEyebrow: "If you go live",
        liveTitle: "The three things to remember before the real segment.",
        liveChecklist: [
          "Sign in on /walletless before touching protected rails.",
          "Keep in mind which secrets enable actor submits.",
          "If something does not respond, go back to mockup without breaking the story.",
        ],
        closeEyebrow: "Closing",
        closeTitle: "Three ideas to end strong.",
        closePoints: [
          "Trust Leaf turns a fragmented process into one experience.",
          "Medical privacy stays protected while the system remains auditable.",
          "The MVP already demonstrates product, operations, and infrastructure on Stellar testnet.",
        ],
      };
}

function SectionLead({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.3em] text-[#62756d]">{eyebrow}</p>
      <h2 className="font-display mt-4 text-5xl leading-[0.96] text-[#12261d] md:text-6xl">{title}</h2>
      <p className="mt-5 text-base leading-8 text-[#4b5e56]">{body}</p>
    </div>
  );
}

function HeroTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-white/48">{label}</p>
      <p className="font-display mt-4 text-4xl leading-none text-white">{children}</p>
    </article>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-[1.6rem] border border-[#163c30]/10 bg-white/72 p-4 text-sm leading-7 text-[#31453c]">
      {children}
    </article>
  );
}

function SimpleNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.6rem] border border-[#163c30]/10 bg-white/72 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[#62756d]">{label}</p>
      <p className="mt-3 text-sm leading-7 text-[#31453c]">{children}</p>
    </div>
  );
}
