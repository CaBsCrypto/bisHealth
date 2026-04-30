"use client";

import { useMemo, useState } from "react";

type PublicDoctor = {
  id: string;
  name: string;
  specialty: string;
  status: string;
  route: string;
};

type PublicDispensary = {
  id: string;
  name: string;
  inventoryFocus: string;
  status: string;
  route: string;
};

type PublicBrand = {
  id: string;
  name: string;
  category: string;
  body: string;
  heroProduct: string;
  origin: string;
  productCount: number;
  featuredIn: string[];
};

type PublicProduct = {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  format: string;
  strain: string;
  thc: string;
  cbd: string;
  traceability: string;
  availableAt: string[];
};

type PublicCatalog = {
  doctors: PublicDoctor[];
  dispensaries: PublicDispensary[];
  brands: PublicBrand[];
  products: PublicProduct[];
  metrics: {
    doctors: number;
    dispensaries: number;
    brands: number;
    products: number;
    prescriptions: number;
    consumedPrescriptions: number;
  };
};

type PortalTab = "overview" | "doctors" | "dispensaries" | "products" | "brands";

const tabs: PortalTab[] = ["overview", "doctors", "dispensaries", "products", "brands"];

export function PublicExperiencePortal({
  locale,
  catalog,
}: {
  locale: "es" | "en";
  catalog: PublicCatalog;
}) {
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const copy = getPortalCopy(locale);

  const featuredBrand = catalog.brands[0] ?? null;
  const featuredProducts = useMemo(() => catalog.products.slice(0, 4), [catalog.products]);

  return (
    <section
      id="portal"
      className="mt-20 rounded-[3rem] border border-[#1a3b32]/8 bg-[linear-gradient(160deg,#0f241d,#18372d_40%,#f4efe6_40%,#f4efe6_100%)] shadow-[0_28px_120px_rgba(14,31,25,0.12)]"
    >
      <div className="grid gap-0 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="border-b border-white/8 p-7 text-[#f2f6f2] xl:border-b-0 xl:border-r xl:border-r-white/8 xl:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c5a47e]">{copy.eyebrow}</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.92] text-white md:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[#f2f6f2]/72">{copy.body}</p>

          <div className="mt-8 grid gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-[1.6rem] border px-4 py-4 text-left transition ${
                  activeTab === tab
                    ? "border-[#c5a47e]/40 bg-[#c5a47e]/12 text-white"
                    : "border-white/10 bg-white/6 text-[#f2f6f2]/72 hover:bg-white/10 hover:text-white"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#c5a47e]">
                  {copy.tabBadge}
                </p>
                <p className="font-display mt-2 text-2xl">{copy.tabs[tab].title}</p>
                <p className="mt-2 text-sm leading-6">{copy.tabs[tab].body}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="p-6 md:p-8">
          <div className="rounded-[2.4rem] border border-[#1a3b32]/8 bg-[#fcfaf6] p-5 shadow-[0_18px_70px_rgba(14,31,25,0.06)] md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a3b32]/8 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#2d5a4c]/45">{copy.previewLabel}</p>
                <h3 className="font-display mt-2 text-3xl text-[#1a3b32]">{copy.tabs[activeTab].title}</h3>
              </div>
              <div className="rounded-full border border-[#1a3b32]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a4c]">
                {copy.liveMock}
              </div>
            </div>

            {activeTab === "overview" ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <PortalKpi label={copy.overview.doctors} value={String(catalog.metrics.doctors)} />
                <PortalKpi label={copy.overview.dispensaries} value={String(catalog.metrics.dispensaries)} />
                <PortalKpi label={copy.overview.brands} value={String(catalog.metrics.brands)} />
                <PortalKpi label={copy.overview.products} value={String(catalog.metrics.products)} />
                <article className="rounded-[1.8rem] border border-[#1a3b32]/8 bg-[linear-gradient(180deg,#fff,#f4f7f4)] p-5 lg:col-span-2">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6b45]">{copy.overview.featured}</p>
                  <h4 className="font-display mt-3 text-3xl text-[#1a3b32]">
                    {featuredBrand?.name ?? copy.overview.pending}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-[#2d5a4c]/72">
                    {featuredBrand?.body ?? copy.overview.pendingBody}
                  </p>
                </article>
              </div>
            ) : null}

            {activeTab === "doctors" ? (
              <div className="mt-6 grid gap-4">
                {catalog.doctors.map((doctor) => (
                  <PortalCard
                    key={doctor.id}
                    badge={doctor.status}
                    title={doctor.name}
                    subtitle={doctor.specialty}
                    body={copy.doctors.cardBody}
                    meta={doctor.route}
                  />
                ))}
              </div>
            ) : null}

            {activeTab === "dispensaries" ? (
              <div className="mt-6 grid gap-4">
                {catalog.dispensaries.map((dispensary) => (
                  <PortalCard
                    key={dispensary.id}
                    badge={dispensary.status}
                    title={dispensary.name}
                    subtitle={dispensary.inventoryFocus}
                    body={copy.dispensaries.cardBody}
                    meta={dispensary.route}
                  />
                ))}
              </div>
            ) : null}

            {activeTab === "products" ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {featuredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-[1.8rem] border border-[#1a3b32]/8 bg-[linear-gradient(180deg,#fff,#f8f3eb)] p-5"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6b45]">{product.brandName}</p>
                    <h4 className="font-display mt-3 text-3xl leading-tight text-[#1a3b32]">
                      {product.name}
                    </h4>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#2d5a4c]/54">
                      {product.format}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <MiniSpec label="THC" value={product.thc} />
                      <MiniSpec label="CBD" value={product.cbd} />
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#2d5a4c]/72">{product.traceability}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "brands" ? (
              <div className="mt-6 grid gap-4">
                {catalog.brands.map((brand) => (
                  <article
                    key={brand.id}
                    className="rounded-[1.8rem] border border-[#1a3b32]/8 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6b45]">{brand.category}</p>
                        <h4 className="font-display mt-3 text-3xl text-[#1a3b32]">{brand.name}</h4>
                        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#2d5a4c]/54">
                          {brand.origin}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#1a3b32]/6 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#254d40]">
                        {brand.productCount} {copy.brands.products}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#2d5a4c]/72">{brand.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function getPortalCopy(locale: "es" | "en") {
  return locale === "es"
    ? {
        eyebrow: "Portal publico",
        title: "Prueba la direccion del nuevo UI antes de tocar los POVs internos.",
        body: "Este portal resume como se veran discovery, productos y actores visibles cuando usemos la UI nueva de Trust Leaf sobre el backend real.",
        tabBadge: "Vista",
        previewLabel: "Preview",
        liveMock: "mock + live data",
        tabs: {
          overview: {
            title: "Resumen paciente",
            body: "Que entiende alguien nuevo al entrar.",
          },
          doctors: {
            title: "Directorio medico",
            body: "Medicos visibles y su propuesta de atencion.",
          },
          dispensaries: {
            title: "Dispensarios",
            body: "Puntos de venta y readiness operativo.",
          },
          products: {
            title: "Productos",
            body: "Catalogo premium y trazabilidad visible.",
          },
          brands: {
            title: "Marcas",
            body: "Growshops y partners asociados.",
          },
        },
        overview: {
          doctors: "Medicos",
          dispensaries: "Dispensarios",
          brands: "Marcas",
          products: "Productos",
          featured: "Marca destacada",
          pending: "Trust Leaf network",
          pendingBody: "La red ya puede contar una historia publica mucho mas fuerte con datos reales debajo.",
        },
        doctors: {
          cardBody: "Actor visible para discovery publico. Luego su flujo real vive en el POV medico.",
        },
        dispensaries: {
          cardBody: "Actor visible para discovery publico. Luego su operacion real vive en el POV dispensario.",
        },
        brands: {
          products: "productos",
        },
      }
    : {
        eyebrow: "Public portal",
        title: "Test the new UI direction before we touch the internal POVs.",
        body: "This portal summarizes how discovery, products, and visible actors can look once we run the new Trust Leaf UI on top of the real backend.",
        tabBadge: "View",
        previewLabel: "Preview",
        liveMock: "mock + live data",
        tabs: {
          overview: {
            title: "Patient overview",
            body: "What a new visitor should understand immediately.",
          },
          doctors: {
            title: "Doctor directory",
            body: "Visible doctors and their care proposition.",
          },
          dispensaries: {
            title: "Dispensaries",
            body: "Retail points and operational readiness.",
          },
          products: {
            title: "Products",
            body: "Premium catalog and visible traceability.",
          },
          brands: {
            title: "Brands",
            body: "Growshops and associated partners.",
          },
        },
        overview: {
          doctors: "Doctors",
          dispensaries: "Dispensaries",
          brands: "Brands",
          products: "Products",
          featured: "Featured brand",
          pending: "Trust Leaf network",
          pendingBody: "The network can already tell a much stronger public story with real data underneath.",
        },
        doctors: {
          cardBody: "Visible actor for public discovery. The real action continues later inside the doctor POV.",
        },
        dispensaries: {
          cardBody: "Visible actor for public discovery. The real operation continues later inside the dispensary POV.",
        },
        brands: {
          products: "products",
        },
      };
}

function PortalKpi({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.6rem] border border-[#1a3b32]/8 bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#2d5a4c]/45">{label}</p>
      <p className="font-display mt-3 text-4xl leading-none text-[#1a3b32]">{value}</p>
    </article>
  );
}

function PortalCard({
  badge,
  title,
  subtitle,
  body,
  meta,
}: {
  badge: string;
  title: string;
  subtitle: string;
  body: string;
  meta: string;
}) {
  return (
    <article className="rounded-[1.8rem] border border-[#1a3b32]/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6b45]">{badge}</p>
          <h4 className="font-display mt-3 text-3xl leading-tight text-[#1a3b32]">{title}</h4>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#2d5a4c]/54">{subtitle}</p>
        </div>
        <span className="rounded-full bg-[#1a3b32]/6 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#254d40]">
          {meta}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#2d5a4c]/72">{body}</p>
    </article>
  );
}

function MiniSpec({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.2rem] border border-[#1a3b32]/8 bg-white px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#2d5a4c]/45">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#1a3b32]">{value}</p>
    </article>
  );
}
