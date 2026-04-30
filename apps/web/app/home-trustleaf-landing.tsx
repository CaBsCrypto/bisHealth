import Link from "next/link";
import type { ReactNode } from "react";
import {
  Globe,
  Leaf,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Users,
} from "lucide-react";

import { LanguageSwitcher } from "./language-switcher";
import { PublicExperiencePortal } from "./public-experience-portal";
import { getMarketingData, type Locale } from "./lib/i18n";
import { getTrustLeafPublicCatalog } from "./lib/trustleaf/publicCatalog";

type MarketingData = ReturnType<typeof getMarketingData>;
type PublicCatalog = Awaited<ReturnType<typeof getTrustLeafPublicCatalog>>;

export function HomeTrustLeafLanding({
  locale,
  marketing,
  catalog,
}: {
  locale: Locale;
  marketing: MarketingData;
  catalog: PublicCatalog;
}) {
  const isEs = locale === "es";
  const networkItems = [
    { title: isEs ? "Comunidad de Pacientes" : "Patient Community", icon: <Users size={16} /> },
    { title: isEs ? "Especialistas Medicos" : "Medical Specialists", icon: <Stethoscope size={16} /> },
    { title: isEs ? "Red de Dispensarios" : "Dispensary Network", icon: <Store size={16} /> },
    { title: "Trust ID Digital", icon: <Sparkles size={16} /> },
    { title: isEs ? "Validacion Juridica" : "Legal Validation", icon: <ShieldCheck size={16} /> },
  ];

  const metrics = [
    { label: isEs ? "Medicos visibles" : "Visible doctors", value: String(catalog.metrics.doctors) },
    { label: isEs ? "Dispensarios activos" : "Active dispensaries", value: String(catalog.metrics.dispensaries) },
    { label: isEs ? "Productos visibles" : "Visible products", value: String(catalog.metrics.products) },
    { label: isEs ? "Marcas asociadas" : "Partner brands", value: String(catalog.metrics.brands) },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-brand-ivory text-brand-green-deep">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 h-[50vw] w-[50vw] translate-x-1/4 -translate-y-1/4 rounded-full bg-brand-green-mid/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[40vw] w-[40vw] -translate-x-1/4 translate-y-1/4 rounded-full bg-brand-gold/[0.03] blur-[100px]" />
      </div>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-brand-green-deep/5 bg-brand-ivory/80 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-brand-green-deep p-1.5 text-brand-ivory"><Leaf size={20} /></div>
            <span className="text-lg font-bold tracking-tight md:text-xl">Trust Leaf</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#experience" className="transition-colors hover:text-brand-green-mid">Trust Network</a>
            <a href="#ecosystem" className="transition-colors hover:text-brand-green-mid">Marketplace</a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <a href="#portal" className="rounded-full bg-brand-green-deep px-4 py-2 text-xs font-bold text-brand-ivory md:px-5 md:text-sm">
              {isEs ? "Portal Paciente" : "Patient Portal"}
            </a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pb-32 md:pt-48">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-brand-gold/20 bg-brand-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gold">
            {isEs ? "Acceso Global Unificado" : "Unified Global Access"}
          </span>
          <h1 className="font-serif text-4xl font-medium leading-[1.15] md:text-7xl">
            {isEs ? "Tu Tratamiento Sin Fricciones, En Todo el Mundo." : "Your Treatment Without Friction, Worldwide."}
          </h1>
          <p className="mx-auto mb-10 mt-6 max-w-2xl px-4 text-base font-medium leading-relaxed text-brand-green-mid/80 md:px-0 md:text-xl">
            {isEs
              ? "Conectamos pacientes con medicos verificados, una red confiable de dispensarios y productos trazables para que el acceso se sienta claro desde el primer minuto."
              : "We connect patients with verified doctors, a trusted dispensary network, and traceable products so access feels clear from the first minute."}
          </p>
          <div className="flex flex-col items-stretch justify-center gap-4 px-6 sm:flex-row sm:items-center sm:px-0">
            <Link href="/patient" className="rounded-2xl bg-brand-green-deep px-10 py-5 text-base font-bold text-brand-ivory shadow-2xl shadow-brand-green-deep/30 md:rounded-[32px] md:text-lg">
              {isEs ? "Entrar al flujo paciente" : "Enter patient flow"}
            </Link>
            <Link href="/walletless" className="flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-green-deep/10 bg-white/50 px-10 py-5 text-base font-bold text-brand-green-deep md:rounded-[32px] md:text-lg">
              <ShieldCheck size={20} className="text-brand-gold" />
              {isEs ? "Explorar acceso wallet-less" : "Explore wallet-less access"}
            </Link>
          </div>
        </div>
      </section>

      <section id="ecosystem" className="border-y border-brand-green-deep/5 py-8 md:py-12">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 md:gap-12">
            <span className="block w-full text-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green-mid md:w-auto">
              {isEs ? "Nuestra Red de Confianza" : "Our Trust Network"}
            </span>
            {networkItems.map((item) => (
              <div key={item.title} className="group flex items-center gap-2 md:grayscale md:hover:grayscale-0">
                <div className="text-brand-green-mid group-hover:text-brand-green-deep">{item.icon}</div>
                <span className="whitespace-nowrap text-xs font-bold">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-neutral/50 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-serif text-4xl leading-tight md:text-5xl">
              {isEs ? "La Medicina No Deberia Estar Sujeta a Fronteras." : "Medicine Should Not Be Limited by Borders."}
            </h2>
            <p className="mb-16 text-lg leading-relaxed text-brand-green-mid/70">
              {isEs
                ? "Hoy encontrar atencion especializada y acceder a medicina de calidad sigue siendo un camino fragmentado. El paciente pierde tiempo, contexto y confianza."
                : "Today, finding specialized care and accessing quality medicine is still a fragmented path. The patient loses time, context, and trust."}
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <ProblemCard title={isEs ? "Busqueda ineficiente" : "Inefficient discovery"} body={isEs ? "Todavia cuesta localizar medicos y dispensarios que cumplan con estandares de seguridad y legitimidad." : "It is still hard to find doctors and dispensaries that meet safety and legitimacy standards."} />
              <ProblemCard title={isEs ? "Validez localizada" : "Localized validity"} body={isEs ? "Las recetas y la informacion relevante quedan atrapadas en experiencias desconectadas." : "Prescriptions and relevant context remain trapped in disconnected experiences."} />
            </div>
            <div className="flex items-center">
              <div className="w-full rounded-3xl bg-brand-green-deep p-8 text-brand-ivory">
                <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-brand-gold">
                  {isEs ? "El modelo tradicional" : "The traditional model"}
                </span>
                <p className="font-serif text-xl italic leading-relaxed">
                  {isEs
                    ? '"Tener que empezar de cero cada vez que buscas un nuevo profesional sigue siendo una barrera inaceptable."'
                    : '"Having to start from scratch every time you look for a new professional is still an unacceptable barrier."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="bg-white px-6 py-12 md:px-12 md:py-16">
        <div className="container mx-auto flex flex-col items-center gap-10 md:gap-16 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-brand-gold">
              {isEs ? "La Red Trust Leaf" : "The Trust Leaf Network"}
            </span>
            <h2 className="mb-8 font-serif text-3xl leading-tight md:text-5xl">
              {isEs ? "Un ecosistema disenado para tu libertad." : "An ecosystem designed for your freedom."}
            </h2>
            <div className="space-y-6">
              <SolutionItem icon={<Stethoscope className="text-brand-gold" size={24} />} title={isEs ? "Directorio de especialistas" : "Specialist directory"} body={isEs ? "Accede a profesionales visibles y verificados que pueden operar dentro de una red curada." : "Access visible, verified professionals who can operate inside a curated network."} />
              <SolutionItem icon={<MapPin className="text-brand-gold" size={24} />} title={isEs ? "Red de acceso y beneficios" : "Access and benefits network"} body={isEs ? "Explora dispensarios, productos y marcas asociadas desde una experiencia mucho mas clara." : "Explore dispensaries, products, and partner brands through a much clearer experience."} />
              <SolutionItem icon={<Globe className="text-brand-gold" size={24} />} title={isEs ? "Identidad medica soberana" : "Sovereign medical identity"} body={isEs ? "Passkeys, privacidad y rails modernos escondiendo la complejidad cripto del paciente." : "Passkeys, privacy, and modern rails that hide crypto complexity from the patient."} />
            </div>
          </div>
          <div className="relative w-full lg:w-1/2">
            <div className="relative z-10 overflow-hidden rounded-[40px] border border-brand-green-mid/5 bg-white p-2 shadow-[-20px_20px_60px_-15px_rgba(0,0,0,0.1)]">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200" alt="Trust ID Digitalization" className="aspect-[4/5] w-full rounded-[32px] object-cover lg:aspect-[5/6]" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-10 -left-10 -z-10 h-48 w-48 rounded-full bg-brand-gold/10 blur-[80px]" />
            <div className="absolute -right-10 -top-10 -z-10 h-64 w-64 rounded-full bg-brand-green-mid/5 blur-[100px]" />
          </div>
        </div>
      </section>

      <section className="border-y border-brand-green-mid/5 bg-white px-6 py-10 md:px-12">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center font-serif text-xl uppercase tracking-[0.2em] text-brand-green-deep/30 md:text-2xl">
            {isEs ? "Impacto en la Red" : "Network Impact"}
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <div className="mb-2 font-serif text-4xl md:text-6xl">{metric.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-gold md:text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-green-deep px-6 py-20 text-brand-ivory md:px-12 md:py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center md:mb-20">
            <h2 className="mb-6 font-serif text-3xl md:text-5xl">{isEs ? "Tu Camino hacia el Bienestar" : "Your Journey to Wellbeing"}</h2>
            <p className="mx-auto max-w-2xl text-sm text-brand-ivory/60 md:text-base">
              {isEs
                ? "Un recorrido mas simple para pasar de necesidad a atencion, receta y compra con menos friccion."
                : "A simpler route from need to care, prescription, and purchase with less friction."}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-4 md:gap-8">
            {marketing.patientJourney.map((step, index) => (
              <div key={step.step} className="relative rounded-3xl border border-white/10 bg-white/5 p-6 md:rounded-2xl md:p-8">
                <div className="mb-6 text-brand-gold">
                  {[<Users key="1" size={24} />, <Sparkles key="2" size={24} />, <Store key="3" size={24} />, <ShieldCheck key="4" size={24} />][index]}
                </div>
                <div className="absolute right-6 top-6 font-serif text-3xl font-bold text-white/5 md:right-8 md:top-8 md:text-4xl">0{index + 1}</div>
                <h4 className="mb-3 text-lg font-bold md:text-xl">{step.title}</h4>
                <p className="text-xs leading-relaxed text-brand-ivory/70 md:text-sm">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-green-deep px-6 py-16 text-brand-ivory md:px-12">
        <div className="container mx-auto text-center">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-brand-gold">
            {isEs ? "Estandares Globales" : "Global Standards"}
          </span>
          <h2 className="mb-12 font-serif text-3xl md:text-5xl">{isEs ? "Seguridad de Grado Institucional." : "Institutional Grade Security."}</h2>
          <div className="grid gap-12 md:grid-cols-3">
            <TrustCard icon={<Lock className="text-brand-gold" size={32} />} title={isEs ? "Identidad soberana" : "Sovereign identity"} body={isEs ? "La informacion sensible del paciente no se expone como un PDF publico ni como una wallet complicada." : "Sensitive patient information is not exposed as a public PDF or as a complicated wallet setup."} />
            <TrustCard icon={<Globe className="text-brand-gold" size={32} />} title={isEs ? "Cumplimiento y red curada" : "Compliance and curated network"} body={isEs ? "La red separa pacientes autoservicio de actores que requieren validacion manual y control operativo." : "The network separates self-serve patients from actors that require manual validation and operational control."} />
            <TrustCard icon={<ShieldCheck className="text-brand-gold" size={32} />} title={isEs ? "Privacidad blindada" : "Shielded privacy"} body={isEs ? "Lo tecnico existe para habilitar confianza, no para interrumpir la experiencia del paciente." : "The technical layer exists to enable trust, not to interrupt the patient experience."} />
          </div>
        </div>
      </section>

      <section className="bg-brand-neutral/30 px-6 py-16 md:px-12">
        <div className="container mx-auto">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[40px] border border-brand-green-mid/5 bg-white p-12 shadow-xl">
            <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-6 font-serif text-3xl leading-tight md:text-4xl">
                  {isEs ? "Eres profesional de la salud, dispensario o partner?" : "Are you a healthcare professional, dispensary, or partner?"}
                </h2>
                <p className="text-lg font-medium leading-relaxed text-brand-green-mid/70">
                  {isEs
                    ? "Unete a la infraestructura que esta definiendo una experiencia premium para cannabis medicinal."
                    : "Join the infrastructure defining a premium medicinal cannabis experience."}
                </p>
              </div>
              <Link href="/admin" className="rounded-2xl bg-brand-green-deep px-8 py-5 font-bold text-brand-ivory shadow-xl shadow-brand-green-deep/10">
                {isEs ? "Abrir admin hub" : "Open admin hub"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-ivory px-6 py-16 md:px-12">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-serif text-3xl md:text-4xl">{isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions"}</h2>
          <div className="space-y-4">
            {marketing.faqs.slice(0, 3).map((faq) => (
              <div key={faq.question} className="border-b border-brand-green-mid/10 py-6">
                <h3 className="font-bold">{faq.question}</h3>
                <p className="mt-4 text-sm leading-relaxed text-brand-green-mid/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12">
        <PublicExperiencePortal locale={locale} catalog={catalog} />
      </div>

      <section className="px-6 py-16 text-center md:px-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 font-serif text-3xl leading-tight md:mb-8 md:text-6xl">
            {isEs
              ? "El futuro del bienestar puede sentirse simple, privado y trazable."
              : "The future of wellbeing can feel simple, private, and traceable."}
          </h2>
          <p className="mx-auto mb-10 max-w-lg px-4 text-sm font-medium leading-relaxed text-brand-green-mid/70 md:mb-12 md:text-base">
            {isEs
              ? "La nueva UI publica ya cuenta una historia mucho mas cercana al producto final y puede apoyarse en el backend real que ya construimos."
              : "The new public UI now tells a story much closer to the final product and can already lean on the real backend we built."}
          </p>
          <Link href="/patient" className="inline-block rounded-2xl bg-brand-green-deep px-10 py-5 text-lg font-bold text-brand-ivory md:rounded-full">
            {isEs ? "Empezar ahora" : "Start now"}
          </Link>
        </div>
      </section>
    </main>
  );
}

function ProblemCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-3xl border border-red-50 bg-white p-8 shadow-sm">
      <div className="shrink-0 text-red-400"><ShieldCheck size={28} /></div>
      <div>
        <h4 className="mb-1 text-lg font-bold">{title}</h4>
        <p className="text-sm text-brand-green-mid/70">{body}</p>
      </div>
    </div>
  );
}

function SolutionItem({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <h4 className="text-base font-bold md:text-lg">{title}</h4>
        <p className="text-sm leading-relaxed text-brand-green-mid/70 md:text-base">{body}</p>
      </div>
    </div>
  );
}

function TrustCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="mb-6 inline-block rounded-2xl bg-brand-gold/10 p-4">{icon}</div>
      <h4 className="mb-4 text-xl font-bold">{title}</h4>
      <p className="text-sm leading-relaxed text-brand-ivory/60">{body}</p>
    </div>
  );
}
