import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "../language-switcher";
import { getLocale } from "../lib/locale";

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
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#163c30] text-sm font-semibold text-[#eef5f1]">
                TL
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-[#12261d]">Trust Leaf</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#62756d]">{copy.brand}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Link href="/" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">
                {copy.back}
              </Link>
              <Link href="/patient" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">
                {copy.openPatient}
              </Link>
              <Link href="/command-center" className="rounded-full px-4 py-2 text-[#51635b] transition hover:bg-[#163c30]/5 hover:text-[#12261d]">
                {copy.openOps}
              </Link>
              <LanguageSwitcher locale={locale} />
              <Link href="/walletless" className="rounded-full bg-[#163c30] px-5 py-2.5 font-semibold text-[#eef5f1] transition hover:bg-[#214d3f]">
                {copy.liveCta}
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <article className="rounded-[2.8rem] border border-[#163c30]/10 bg-[linear-gradient(145deg,#fffdf9,#f5edde_54%,#eee5d7)] p-7 shadow-[0_30px_110px_rgba(31,58,47,0.10)] md:p-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#163c30]/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#295847]">
              <span className="h-2 w-2 rounded-full bg-[#2e9d70]" />
              {copy.eyebrow}
            </div>

            <h1 className="font-display mt-8 max-w-4xl text-5xl leading-[0.94] text-[#12261d] md:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#31453c] md:text-xl">{copy.body}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.topline.map((item) => (
                <InfoTile key={item.label} label={item.label}>
                  {item.value}
                </InfoTile>
              ))}
            </div>
          </article>

          <aside className="grid gap-5">
            <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)]">
              <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.presenterEyebrow}</p>
              <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9]">{copy.presenterTitle}</h2>
              <div className="mt-6 grid gap-3">
                {copy.presenterTips.map((tip) => (
                  <article key={tip} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d5e3dc]">
                    {tip}
                  </article>
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
          </aside>
        </section>

        <section className="mt-24">
          <SectionLead eyebrow={copy.runbookEyebrow} title={copy.runbookTitle} body={copy.runbookBody} />
          <div className="mt-8 grid gap-5">
            {copy.steps.map((step) => (
              <article key={step.step} className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.06)]">
                <div className="grid gap-5 xl:grid-cols-[0.22fr_0.78fr] xl:items-start">
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
                    <p className="mt-4 max-w-3xl text-base leading-7 text-[#4a5d54]">{step.narrative}</p>

                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
                      <div className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#62756d]">{copy.sayLabel}</p>
                        <p className="mt-3 text-sm leading-7 text-[#31453c]">{step.say}</p>
                      </div>
                      <div className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-[#62756d]">{copy.showLabel}</p>
                        <p className="mt-3 text-sm leading-7 text-[#31453c]">{step.show}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-[#163c30] p-6 text-[#edf5f0] shadow-[0_26px_90px_rgba(21,50,40,0.16)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9dcbb6]">{copy.liveEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#f7fbf9]">{copy.liveTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.liveChecklist.map((item) => (
                <article key={item} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d5e3dc]">
                  {item}
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[2.2rem] border border-[#163c30]/10 bg-white/75 p-6 shadow-[0_18px_70px_rgba(31,58,47,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#62756d]">{copy.closeEyebrow}</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#12261d]">{copy.closeTitle}</h2>
            <div className="mt-6 grid gap-3">
              {copy.closePoints.map((item) => (
                <article key={item} className="rounded-[1.6rem] border border-[#163c30]/10 bg-[#faf6ef] p-4 text-sm leading-7 text-[#31453c]">
                  {item}
                </article>
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
        openOps: "Abrir ops",
        liveCta: "Abrir wallet-less",
        eyebrow: "Guion de demo",
        title: "Como presentar Trust Leaf en 7 minutos sin improvisar.",
        body: "Esta pagina resume el orden ideal de la demo, que decir en cada tramo y cuando conviene mostrar modo demo o activar un rail live.",
        topline: [
          { label: "Duracion", value: "6-8 min" },
          { label: "Modo recomendado", value: "Demo primero, live despues" },
          { label: "Objetivo", value: "Mostrar producto, no complejidad" },
        ],
        presenterEyebrow: "Presenter notes",
        presenterTitle: "La regla principal: explicar salud, no blockchain.",
        presenterTips: [
          "Empieza siempre por el problema del paciente y recien despues menciona passkeys, sponsor o ZK.",
          "Usa el modo demo/mockup como ruta base. Activa un rail live solo cuando quieras probar que la infraestructura existe.",
          "Si algo depende de una secret o de una sesion, dilo como fortaleza operativa, no como limitacion del producto.",
        ],
        routesEyebrow: "Rutas clave",
        routesTitle: "Lo que deberias tener abierto antes de la demo",
        routes: [
          { title: "Landing", body: "Punto de entrada para explicar oportunidad, problema y red profesional.", href: "/" },
          { title: "Patient POV", body: "Corazon narrativo del producto: medico, receta, inventario y journey real.", href: "/patient" },
          { title: "Doctor POV", body: "Muestra operacion clinica y emision de receta con rail listo.", href: "/doctor" },
          { title: "Dispensary POV", body: "Muestra validacion, inventario y consume rail listo.", href: "/dispensary" },
          { title: "Superadmin POV", body: "Explica gobernanza, aprobaciones manuales y control de accesos.", href: "/superadmin" },
          { title: "Command center", body: "Prueba que todo vive sobre contratos e indexacion real de testnet.", href: "/command-center" },
          { title: "Wallet-less", body: "Se usa solo cuando quieres mostrar passkeys, sesion y sponsor real.", href: "/walletless" },
        ],
        runbookEyebrow: "Runbook",
        runbookTitle: "Orden recomendado de la presentacion",
        runbookBody: "Sigue este orden para que la demo crezca en claridad y credibilidad. Primero experiencia. Luego operacion. Al final infraestructura.",
        stepLabel: "Paso",
        sayLabel: "Que decir",
        showLabel: "Que mostrar",
        steps: [
          { step: "01", runtime: "45s", mode: "Narrativa", route: "/", title: "Abre con el problema del paciente.", narrative: "Empieza en la landing y presenta a Trust Leaf como una experiencia de salud y confianza para cannabis medicinal, no como una app cripto.", say: "Hoy el paciente tiene que resolver demasiadas cosas sueltas: encontrar un medico confiable, validar la receta y luego confiar en un dispensario sin ver trazabilidad real.", show: "Hero principal, propuesta paciente-first y lanes de acceso por actor." },
          { step: "02", runtime: "60s", mode: "Demo/mockup", route: "/patient", title: "Presenta el POV del paciente como producto final.", narrative: "Entra al patient POV y recorre la experiencia como si ya estuviera en produccion: encontrar medico, ver receta activa y revisar inventario confiable.", say: "Este es el producto como deberia sentirse: simple, biometrico y sin que el paciente tenga que entender blockchain.", show: "Modo demo/mockup, cards de medicos, receta activa, inventario y el patient live journey rail." },
          { step: "03", runtime: "60s", mode: "Operacion clinica", route: "/doctor", title: "Enseña como opera el medico dentro de la red.", narrative: "Muestra agenda, pacientes activos y el rail de issue_prescription listo. No necesitas ejecutar submit si no tienes la secret cargada.", say: "El medico trabaja dentro de una red curada. Puede emitir una receta privada y el sistema ya sabe como llevarla a testnet.", show: "Doctor lane, panel live submit, estado de rail y command pack." },
          { step: "04", runtime: "60s", mode: "Operacion comercial", route: "/dispensary", title: "Cierra el loop con el dispensario.", narrative: "Muestra inventario, validacion de receta y el rail verify_and_consume ya preparado desde UI.", say: "El dispensario no solo vende. Tambien valida elegibilidad, trazabilidad y consume la receta para evitar doble uso.", show: "Inventory, queue de validacion y panel consume live." },
          { step: "05", runtime: "45s", mode: "Gobernanza", route: "/superadmin", title: "Explica por que la red no esta abierta sin control.", narrative: "El superadmin muestra que medicos y dispensarios son aprobados manualmente y que los accesos viven en RBAC on-chain.", say: "El paciente puede avanzar solo. Pero los actores regulados entran mediante aprobacion manual y permisos verificables.", show: "Approval queue, access registry y RBAC bridge." },
          { step: "06", runtime: "45s", mode: "Infraestructura", route: "/command-center", title: "Demuestra que no es solo maqueta.", narrative: "Muestra command center para probar contratos live, indexacion y rails operativos desde un solo hub.", say: "Aqui demostramos que atras del producto ya hay contratos desplegados, eventos indexados y un rail real de operaciones sobre testnet.", show: "Ops room, contratos live, rails del paciente, medico, dispensario y superadmin." },
          { step: "07", runtime: "60s", mode: "Live rail", route: "/walletless", title: "Activa passkeys solo al final.", narrative: "Si quieres rematar con infraestructura real, abre wallet-less y muestra passkeys, sponsor fee-bump y sesion protegida.", say: "No queremos que el usuario vea seed phrases ni fees. Por eso el login empieza con passkeys y el backend patrocina la operacion.", show: "Registro/login passkey, sponsor config y smoke/live rails." },
        ],
        liveEyebrow: "Si quieres activar live",
        liveTitle: "Checklist para la parte real de la demo",
        liveChecklist: [
          "Inicia sesion en /walletless antes de probar patient journey, doctor submit o dispensary consume.",
          "Si quieres submit real desde web, carga en Vercel `TRUST_LEAF_DOCTOR_SECRET_KEY` y `TRUST_LEAF_DISPENSARY_SECRET_KEY`.",
          "Si algo no esta activo, muestra el rail como evidencia de infraestructura lista y sigue con el modo demo sin romper el flow.",
        ],
        closeEyebrow: "Cierre",
        closeTitle: "Como cerrar la presentacion",
        closePoints: [
          "Trust Leaf convierte un proceso fragmentado en una experiencia unica para el paciente.",
          "La privacidad medica se protege mientras la calidad del producto sigue siendo auditable.",
          "El MVP ya prueba contratos, indexacion, passkeys, sponsor y operacion actor-first sobre Stellar testnet.",
        ],
      }
    : {
        brand: "Presenter script",
        back: "Back to landing",
        openPatient: "Open patient",
        openOps: "Open ops",
        liveCta: "Open wallet-less",
        eyebrow: "Demo script",
        title: "How to present Trust Leaf in 7 minutes without improvising.",
        body: "This page summarizes the ideal demo order, what to say in each segment, and when to stay in demo mode or activate a live rail.",
        topline: [
          { label: "Duration", value: "6-8 min" },
          { label: "Recommended mode", value: "Demo first, live second" },
          { label: "Goal", value: "Show the product, not complexity" },
        ],
        presenterEyebrow: "Presenter notes",
        presenterTitle: "Main rule: explain healthcare, not blockchain.",
        presenterTips: [
          "Always begin with the patient problem and only then mention passkeys, sponsorship, or ZK.",
          "Use demo/mockup mode as the default route. Activate a live rail only when you want to prove the infrastructure exists.",
          "If something depends on a secret or a session, frame it as operational readiness, not as a product weakness.",
        ],
        routesEyebrow: "Key routes",
        routesTitle: "What should be open before the demo",
        routes: [
          { title: "Landing", body: "Entry point to explain opportunity, problem, and the professional network.", href: "/" },
          { title: "Patient POV", body: "Narrative core of the product: doctor, prescription, inventory, and live journey.", href: "/patient" },
          { title: "Doctor POV", body: "Shows clinical operations and the ready issuance rail.", href: "/doctor" },
          { title: "Dispensary POV", body: "Shows validation, inventory, and the ready consume rail.", href: "/dispensary" },
          { title: "Superadmin POV", body: "Shows governance, manual approvals, and access control.", href: "/superadmin" },
          { title: "Command center", body: "Proves everything sits on real testnet contracts and indexing.", href: "/command-center" },
          { title: "Wallet-less", body: "Use only when you want to show passkeys, session, and real sponsorship.", href: "/walletless" },
        ],
        runbookEyebrow: "Runbook",
        runbookTitle: "Recommended presentation order",
        runbookBody: "Follow this sequence so the demo grows in clarity and credibility. Start with experience. Then operations. Finish with infrastructure.",
        stepLabel: "Step",
        sayLabel: "What to say",
        showLabel: "What to show",
        steps: [
          { step: "01", runtime: "45s", mode: "Narrative", route: "/", title: "Open with the patient problem.", narrative: "Start on the landing page and present Trust Leaf as a health and trust experience for medicinal cannabis, not as a crypto app.", say: "Today the patient has to solve too many disconnected things: finding a trustworthy doctor, validating a prescription, and then trusting a dispensary without seeing real traceability.", show: "Main hero, patient-first proposition, and actor lanes." },
          { step: "02", runtime: "60s", mode: "Demo/mockup", route: "/patient", title: "Present the patient POV as the final product.", narrative: "Enter the patient POV and walk the experience as if it were already in production: find care, see the active prescription, and inspect trusted inventory.", say: "This is how the product should feel: simple, biometric, and without forcing the patient to understand blockchain.", show: "Demo/mockup mode, doctor cards, active prescription, inventory, and the patient live journey rail." },
          { step: "03", runtime: "60s", mode: "Clinical operations", route: "/doctor", title: "Show how the doctor operates inside the network.", narrative: "Show schedule, active patients, and the issue_prescription rail. You do not need to trigger submit if the secret is not loaded.", say: "The doctor works inside a curated network. They can issue a private prescription and the system already knows how to move it to testnet.", show: "Doctor lane, live submit panel, rail status, and command pack." },
          { step: "04", runtime: "60s", mode: "Commercial operations", route: "/dispensary", title: "Close the loop with the dispensary.", narrative: "Show inventory, prescription validation, and the verify_and_consume rail already prepared from the UI.", say: "The dispensary does not just sell. It validates eligibility, provenance, and consumes the prescription to prevent double use.", show: "Inventory, validation queue, and live consume panel." },
          { step: "05", runtime: "45s", mode: "Governance", route: "/superadmin", title: "Explain why the network is not open without control.", narrative: "The superadmin shows that doctors and dispensaries are manually approved and that permissions live on-chain in RBAC.", say: "Patients can move by themselves. Regulated operators enter through manual approval and verifiable permissions.", show: "Approval queue, access registry, and RBAC bridge." },
          { step: "06", runtime: "45s", mode: "Infrastructure", route: "/command-center", title: "Prove this is not just a mockup.", narrative: "Show the command center to prove live contracts, indexed events, and operational rails from one hub.", say: "This is where we prove that behind the product we already have deployed contracts, indexed events, and a real operational rail on testnet.", show: "Ops room, live contracts, and patient, doctor, dispensary, and superadmin rails." },
          { step: "07", runtime: "60s", mode: "Live rail", route: "/walletless", title: "Activate passkeys only at the end.", narrative: "If you want to end with real infrastructure, open wallet-less and show passkeys, fee-bump sponsorship, and a protected session.", say: "We do not want the user to see seed phrases or fees. That is why login starts with passkeys and the backend sponsors the operation.", show: "Passkey register/login, sponsor config, and smoke/live rails." },
        ],
        liveEyebrow: "If you want to go live",
        liveTitle: "Checklist for the real segment of the demo",
        liveChecklist: [
          "Sign in on /walletless before testing patient journey, doctor submit, or dispensary consume.",
          "If you want real submits from the web, load `TRUST_LEAF_DOCTOR_SECRET_KEY` and `TRUST_LEAF_DISPENSARY_SECRET_KEY` in Vercel.",
          "If something is not active, present the rail as proof of ready infrastructure and continue in demo mode without breaking the flow.",
        ],
        closeEyebrow: "Closing",
        closeTitle: "How to close the presentation",
        closePoints: [
          "Trust Leaf turns a fragmented process into one patient experience.",
          "Medical privacy stays protected while product quality remains auditable.",
          "The MVP already proves contracts, indexing, passkeys, sponsorship, and actor-first operations on Stellar testnet.",
        ],
      };
}

function SectionLead({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm uppercase tracking-[0.3em] text-[#62756d]">{eyebrow}</p>
      <h2 className="font-display mt-4 text-5xl leading-[0.96] text-[#12261d] md:text-6xl">{title}</h2>
      <p className="mt-5 text-base leading-8 text-[#4b5e56]">{body}</p>
    </div>
  );
}

function InfoTile({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[1.7rem] border border-[#163c30]/10 bg-white/75 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[#62756d]">{label}</p>
      <p className="mt-3 text-base leading-7 text-[#163c30]">{children}</p>
    </article>
  );
}
