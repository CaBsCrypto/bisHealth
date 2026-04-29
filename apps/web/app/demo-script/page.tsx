import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "../language-switcher";
import { getLocale } from "../lib/locale";
import { PresentationStrip } from "../presentation-strip";

export default async function DemoScriptPage() {
  const locale = await getLocale();
  const copy = getDemoScriptCopy(locale);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5efe4] text-[#12261d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(39,120,87,0.12),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(201,156,70,0.13),transparent_20%),linear-gradient(180deg,#f8f3ea_0%,#f1ebdf_44%,#ece5d9_100%)]" />

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-10">
        <header className="rounded-full border border-[#163c30]/10 bg-white/75 px-4 py-3 shadow-[0_12px_40px_rgba(31,58,47,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#163c30] text-sm font-semibold text-[#eef5f1]">TL</div>
              <div>
                <p className="font-display text-2xl leading-none text-[#12261d]">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#62756d]">{copy.brand}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.back}</Link>
              <Link href="/patient" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.openPatient}</Link>
              <Link href="/admin" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">{copy.openAdmin}</Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-[#163c30] px-5 py-2.5 font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">{copy.liveCta}</Link>
            </div>
          </div>
        </header>

        <PresentationStrip locale={locale} current="demo" />

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-[#163c30]/10 bg-[linear-gradient(145deg,#fffdf9,#f5edde_54%,#eee5d7)] p-7 shadow-[0_30px_110px_rgba(31,58,47,0.10)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#163c30]/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#295847]">
              <span className="h-2 w-2 rounded-full bg-[#2e9d70]" />
              {copy.eyebrow}
            </div>
            <h1 className="font-display mt-8 max-w-4xl text-5xl leading-[0.94] text-[#12261d] md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#31453c] md:text-xl">{copy.body}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.topline.map((item) => (
                <InfoTile key={item.label} label={item.label}>{item.value}</InfoTile>
              ))}
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.presenterEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9]">{copy.presenterTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.presenterTips.map((tip) => (
                <article key={tip} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d5e3dc]">{tip}</article>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-20 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.preflightEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.preflightTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.preflight.map((item) => (
                <ChecklistItem key={item}>{item}</ChecklistItem>
              ))}
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.routesEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.routesTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.routes.map((route) => (
                <Link key={route.href} href={route.href} className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4 transition hover:bg-white">
                  <p className="font-display text-2xl text-[#12261d]">{route.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[#4d5f57]">{route.body}</p>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-20">
          <SectionLead eyebrow={copy.runbookEyebrow} title={copy.runbookTitle} body={copy.runbookBody} />
          <div className="mt-8 grid gap-5">
            {copy.steps.map((step) => (
              <article key={step.step} className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.06)]">
                <div className="grid gap-5 xl:grid-cols-[0.18fr_0.82fr] xl:items-start">
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
          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.liveEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9]">{copy.liveTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.liveChecklist.map((item) => (
                <article key={item} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d5e3dc]">{item}</article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.closeEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.closeTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.closePoints.map((item) => (
                <article key={item} className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4 text-sm leading-7 text-[#31453c]">{item}</article>
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
        brand: "Presenter script",
        back: "Volver al landing",
        openPatient: "Abrir paciente",
        openAdmin: "Abrir admin hub",
        liveCta: "Abrir wallet-less",
        eyebrow: "Guion de demo",
        title: "Como presentar Trust Leaf sin improvisar ni perder claridad.",
        body: "Este guion deja el MVP listo para demo: que abrir, que decir, que mostrar y cuando conviene pasar de mockup a live.",
        topline: [
          { label: "Duracion", value: "6-8 min" },
          { label: "Modo recomendado", value: "Demo primero" },
          { label: "Cierre", value: "Live al final" },
        ],
        presenterEyebrow: "Regla principal",
        presenterTitle: "Explica salud, confianza y experiencia. No blockchain primero.",
        presenterTips: [
          "Empieza por el paciente y no por la tecnologia.",
          "Usa mockup/demo como camino principal.",
          "Activa passkeys o rails live solo al final para probar que la infraestructura existe.",
        ],
        preflightEyebrow: "Checklist previo",
        preflightTitle: "Antes de presentar, deja esto abierto y listo.",
        preflight: [
          "Landing abierta en una pestaña limpia.",
          "Patient, doctor, dispensary y superadmin ya cargados.",
          "Wallet-less listo por si quieres mostrar passkeys.",
          "No dependas del rail live para contar la historia principal.",
        ],
        routesEyebrow: "Rutas clave",
        routesTitle: "Lo minimo que deberias tener a mano.",
        routes: [
          { title: "Landing", body: "Abre con problema, propuesta y red visible.", href: "/" },
          { title: "Patient", body: "Es el centro emocional y comercial del MVP.", href: "/patient" },
          { title: "Doctor", body: "Muestra emision y continuidad clinica.", href: "/doctor" },
          { title: "Dispensary", body: "Muestra inventario, validacion y consume.", href: "/dispensary" },
          { title: "Superadmin", body: "Muestra aprobaciones y gobernanza.", href: "/superadmin" },
          { title: "Command center", body: "Prueba que no es solo mockup.", href: "/command-center" },
        ],
        runbookEyebrow: "Orden recomendado",
        runbookTitle: "Una secuencia facil de seguir frente a jueces.",
        runbookBody: "Primero producto. Despues operacion. Al final infraestructura.",
        stepLabel: "Paso",
        sayLabel: "Que decir",
        showLabel: "Que mostrar",
        steps: [
          { step: "01", runtime: "45s", mode: "Landing", route: "/", title: "Abre con el problema del paciente.", say: "Hoy el paciente resuelve medico, receta y compra en sistemas separados.", show: "Hero, propuesta de valor y red visible." },
          { step: "02", runtime: "60s", mode: "Patient", route: "/patient", title: "Muestra el producto ideal.", say: "Asi deberia sentirse la experiencia final: simple, privada y clara.", show: "Medicos, receta activa, inventario y activacion live al final." },
          { step: "03", runtime: "50s", mode: "Doctor", route: "/doctor", title: "Muestra la operacion clinica.", say: "El medico entra a una red curada y emite recetas privadas sin friccion cripto.", show: "Agenda, pacientes y rail de issue." },
          { step: "04", runtime: "50s", mode: "Dispensary", route: "/dispensary", title: "Cierra el loop comercial.", say: "El dispensario valida elegibilidad y consume la receta para evitar doble uso.", show: "Inventario, validaciones y rail de consume." },
          { step: "05", runtime: "40s", mode: "Superadmin", route: "/superadmin", title: "Explica por que la red esta curada.", say: "Pacientes avanzan solos; medicos y dispensarios entran por aprobacion manual.", show: "Queue, red activa y RBAC." },
          { step: "06", runtime: "40s", mode: "Infra", route: "/command-center", title: "Demuestra que el backend ya existe.", say: "Todo esto corre sobre contratos, indexacion y rails conectados a testnet.", show: "Command center y readiness." },
          { step: "07", runtime: "60s", mode: "Live", route: "/walletless", title: "Remata con passkeys si quieres una prueba real.", say: "La complejidad queda oculta: passkeys para entrar y sponsor para operar.", show: "Wallet-less, sesion y sponsor rail." },
        ],
        liveEyebrow: "Si vas a live",
        liveTitle: "Lo que conviene revisar antes del tramo real.",
        liveChecklist: [
          "Inicia sesion en /walletless antes de tocar rails protegidos.",
          "Ten claras las secrets que habilitan submits reales por actor.",
          "Si algo falla, vuelve a mockup sin romper el relato principal.",
        ],
        closeEyebrow: "Cierre",
        closeTitle: "Tres ideas para terminar fuerte.",
        closePoints: [
          "Trust Leaf unifica un proceso hoy fragmentado.",
          "La privacidad medica se protege mientras la calidad sigue siendo auditable.",
          "El MVP ya demuestra producto, operacion e infraestructura sobre Stellar testnet.",
        ],
      }
    : {
        brand: "Presenter script",
        back: "Back to landing",
        openPatient: "Open patient",
        openAdmin: "Open admin hub",
        liveCta: "Open wallet-less",
        eyebrow: "Demo script",
        title: "How to present Trust Leaf without improvising or losing clarity.",
        body: "This script gets the MVP demo-ready: what to open, what to say, what to show, and when to move from mockup to live.",
        topline: [
          { label: "Duration", value: "6-8 min" },
          { label: "Recommended mode", value: "Demo first" },
          { label: "Finish", value: "Live at the end" },
        ],
        presenterEyebrow: "Main rule",
        presenterTitle: "Explain healthcare, trust, and experience. Not blockchain first.",
        presenterTips: [
          "Begin with the patient, not the technology.",
          "Use mockup/demo as the main path.",
          "Activate passkeys or live rails only at the end to prove the infrastructure exists.",
        ],
        preflightEyebrow: "Preflight checklist",
        preflightTitle: "Before presenting, have this open and ready.",
        preflight: [
          "Landing open in a clean tab.",
          "Patient, doctor, dispensary, and superadmin already loaded.",
          "Wallet-less ready in case you want to show passkeys.",
          "Do not depend on the live rail to tell the main story.",
        ],
        routesEyebrow: "Key routes",
        routesTitle: "The minimum you should keep nearby.",
        routes: [
          { title: "Landing", body: "Open with problem, value, and visible network.", href: "/" },
          { title: "Patient", body: "This is the emotional and commercial center of the MVP.", href: "/patient" },
          { title: "Doctor", body: "Shows issuance and clinical continuity.", href: "/doctor" },
          { title: "Dispensary", body: "Shows inventory, validation, and consume.", href: "/dispensary" },
          { title: "Superadmin", body: "Shows approvals and governance.", href: "/superadmin" },
          { title: "Command center", body: "Proves this is not only mockup.", href: "/command-center" },
        ],
        runbookEyebrow: "Recommended order",
        runbookTitle: "An easy sequence to follow in front of judges.",
        runbookBody: "Product first. Operations second. Infrastructure last.",
        stepLabel: "Step",
        sayLabel: "What to say",
        showLabel: "What to show",
        steps: [
          { step: "01", runtime: "45s", mode: "Landing", route: "/", title: "Open with the patient problem.", say: "Today the patient solves care, prescription, and purchase across disconnected systems.", show: "Hero, value proposition, and visible network." },
          { step: "02", runtime: "60s", mode: "Patient", route: "/patient", title: "Show the ideal product.", say: "This is how the final experience should feel: simple, private, and clear.", show: "Doctors, active prescription, inventory, and live activation at the end." },
          { step: "03", runtime: "50s", mode: "Doctor", route: "/doctor", title: "Show clinical operations.", say: "The doctor enters a curated network and issues private prescriptions without crypto friction.", show: "Schedule, patients, and issue rail." },
          { step: "04", runtime: "50s", mode: "Dispensary", route: "/dispensary", title: "Close the commercial loop.", say: "The dispensary validates eligibility and consumes the prescription to prevent double use.", show: "Inventory, validations, and consume rail." },
          { step: "05", runtime: "40s", mode: "Superadmin", route: "/superadmin", title: "Explain why the network is curated.", say: "Patients move alone; doctors and dispensaries enter through manual approval.", show: "Queue, active network, and RBAC." },
          { step: "06", runtime: "40s", mode: "Infra", route: "/command-center", title: "Prove the backend already exists.", say: "All of this runs on contracts, indexing, and rails connected to testnet.", show: "Command center and readiness." },
          { step: "07", runtime: "60s", mode: "Live", route: "/walletless", title: "Finish with passkeys if you want a real proof.", say: "Complexity stays hidden: passkeys to enter and sponsorship to operate.", show: "Wallet-less, session, and sponsor rail." },
        ],
        liveEyebrow: "If you go live",
        liveTitle: "What to check before the real segment.",
        liveChecklist: [
          "Sign in on /walletless before touching protected rails.",
          "Know which secrets enable real submits per actor.",
          "If anything fails, go back to mockup without breaking the main story.",
        ],
        closeEyebrow: "Closing",
        closeTitle: "Three ideas to end strong.",
        closePoints: [
          "Trust Leaf unifies a process that is fragmented today.",
          "Medical privacy stays protected while quality remains auditable.",
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

function InfoTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="rounded-[1.7rem] border border-[#163c30]/10 bg-white/75 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[#62756d]">{label}</p>
      <p className="font-display mt-4 text-4xl leading-none text-[#12261d]">{children}</p>
    </article>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4 text-sm leading-7 text-[#31453c]">
      {children}
    </article>
  );
}

function SimpleNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[#62756d]">{label}</p>
      <p className="mt-3 text-sm leading-7 text-[#31453c]">{children}</p>
    </div>
  );
}
