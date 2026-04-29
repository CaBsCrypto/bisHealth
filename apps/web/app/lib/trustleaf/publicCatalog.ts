import "server-only";

import type { Locale } from "@/app/lib/i18n";

import { getIndexedState } from "./indexedState";

const ACTOR_ALIASES: Record<string, { doctor?: string; dispensary?: string }> = {
  GD2MXRXHYBSSY7CXQWAYN5S7OHAUVEULPHV4SYQA3542GIQLUGJ57VNX: {
    doctor: "Dr. Andres Vera",
  },
  GCJLFG6PX6OA6JBJPQP2PXBJ7SD726O4R46IMWD4GBK3CX7HCWEJZRJ6: {
    dispensary: "Green North Dispensary",
  },
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

export async function getTrustLeafPublicCatalog(locale: Locale = "en") {
  const indexedState = await getIndexedState();
  const doctors = indexedState.roleMemberships
    .filter((membership) => membership.isActive && membership.role.includes("DOCTOR"))
    .map((membership, index) => ({
      id: membership.id,
      name:
        ACTOR_ALIASES[membership.account]?.doctor ??
        (locale === "es" ? `Medico ${index + 1}` : `Doctor ${index + 1}`),
      account: membership.account,
      specialty:
        locale === "es"
          ? index % 2 === 0
            ? "Dolor cronico y seguimiento"
            : "Cannabis medicinal y terapia continua"
          : index % 2 === 0
            ? "Chronic pain and follow-up"
            : "Medicinal cannabis and continuity care",
      status: locale === "es" ? "Verificado" : "Verified",
      route: "/doctor",
    }));

  const dispensaries = indexedState.roleMemberships
    .filter((membership) => membership.isActive && membership.role.includes("DISP"))
    .map((membership, index) => ({
      id: membership.id,
      name:
        ACTOR_ALIASES[membership.account]?.dispensary ??
        (locale === "es" ? `Dispensario ${index + 1}` : `Dispensary ${index + 1}`),
      account: membership.account,
      inventoryFocus:
        locale === "es"
          ? index % 2 === 0
            ? "Flor medicinal y aceites"
            : "Catalogo curado y trazabilidad visible"
          : index % 2 === 0
            ? "Medicinal flower and oils"
            : "Curated catalog and visible traceability",
      status: locale === "es" ? "Listo" : "Ready",
      route: "/dispensary",
    }));

  const brands = getAssociatedBrands(locale);
  const products = getAssociatedProducts(locale);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      doctors: doctors.length,
      dispensaries: dispensaries.length,
      brands: brands.length,
      products: products.length,
      prescriptions: indexedState.prescriptions.length,
      consumedPrescriptions: indexedState.prescriptionConsumptions.length,
    },
    doctors,
    dispensaries,
    brands,
    products,
  };
}

function getAssociatedBrands(locale: Locale): PublicBrand[] {
  if (locale === "es") {
    return [
      {
        id: "andes-herbal-lab",
        name: "Andes Herbal Lab",
        category: "Marca asociada",
        body: "Extractos premium y formulaciones pensadas para pacientes con continuidad clinica.",
        heroProduct: "Aceite balance 10:10",
        origin: "Chile",
        productCount: 2,
        featuredIn: ["Green North Dispensary"],
      },
      {
        id: "patagonia-care",
        name: "Patagonia Care",
        category: "Growshop asociado",
        body: "Linea curada de bienestar, formatos simples y presentacion confiable para dispensarios.",
        heroProduct: "Flor medicinal indoor",
        origin: "Patagonia",
        productCount: 2,
        featuredIn: ["Green North Dispensary"],
      },
      {
        id: "verde-clinico",
        name: "Verde Clinico",
        category: "Marca asociada",
        body: "Productos orientados a dolor cronico, descanso y acompanamiento terapeutico.",
        heroProduct: "Gomitas funcionales CBD",
        origin: "LatAm",
        productCount: 2,
        featuredIn: ["Green North Dispensary"],
      },
    ];
  }

  return [
    {
      id: "andes-herbal-lab",
      name: "Andes Herbal Lab",
      category: "Associated brand",
      body: "Premium extracts and formulations designed for patients who need continuity of care.",
      heroProduct: "Balanced 10:10 oil",
      origin: "Chile",
      productCount: 2,
      featuredIn: ["Green North Dispensary"],
    },
    {
      id: "patagonia-care",
      name: "Patagonia Care",
      category: "Associated growshop",
      body: "Curated wellness line, simple formats, and trusted presentation for dispensary shelves.",
      heroProduct: "Indoor medicinal flower",
      origin: "Patagonia",
      productCount: 2,
      featuredIn: ["Green North Dispensary"],
    },
    {
      id: "verde-clinico",
      name: "Verde Clinico",
      category: "Associated brand",
      body: "Products oriented to chronic pain, rest, and therapeutic follow-up.",
      heroProduct: "Functional CBD gummies",
      origin: "LatAm",
      productCount: 2,
      featuredIn: ["Green North Dispensary"],
    },
  ];
}

function getAssociatedProducts(locale: Locale): PublicProduct[] {
  if (locale === "es") {
    return [
      {
        id: "andes-balance-1010",
        brandId: "andes-herbal-lab",
        brandName: "Andes Herbal Lab",
        name: "Aceite Balance 10:10",
        format: "Aceite sublingual",
        strain: "Blend terapeutico",
        thc: "10%",
        cbd: "10%",
        traceability: "Lote y laboratorio visibles",
        availableAt: ["Green North Dispensary"],
      },
      {
        id: "andes-night-drop",
        brandId: "andes-herbal-lab",
        brandName: "Andes Herbal Lab",
        name: "Night Drop",
        format: "Tintura nocturna",
        strain: "Formula descanso",
        thc: "4%",
        cbd: "18%",
        traceability: "Perfil de laboratorio verificado",
        availableAt: ["Green North Dispensary"],
      },
      {
        id: "patagonia-flower",
        brandId: "patagonia-care",
        brandName: "Patagonia Care",
        name: "Flor Indoor Patagonia",
        format: "Flor medicinal",
        strain: "Patagonia Calm",
        thc: "17%",
        cbd: "1%",
        traceability: "Origen de cultivo visible",
        availableAt: ["Green North Dispensary"],
      },
      {
        id: "patagonia-softgel",
        brandId: "patagonia-care",
        brandName: "Patagonia Care",
        name: "Softgel Balance",
        format: "Softgels",
        strain: "Uso diario",
        thc: "2%",
        cbd: "12%",
        traceability: "Liberacion y stock indexados",
        availableAt: ["Green North Dispensary"],
      },
      {
        id: "verde-gummies",
        brandId: "verde-clinico",
        brandName: "Verde Clinico",
        name: "Gomitas CBD Focus",
        format: "Gomitas funcionales",
        strain: "CBD functional",
        thc: "0%",
        cbd: "20mg",
        traceability: "Marca asociada verificada",
        availableAt: ["Green North Dispensary"],
      },
      {
        id: "verde-rest-oil",
        brandId: "verde-clinico",
        brandName: "Verde Clinico",
        name: "Rest Oil",
        format: "Aceite terapeutico",
        strain: "Sleep formula",
        thc: "3%",
        cbd: "15%",
        traceability: "Historial de batch disponible",
        availableAt: ["Green North Dispensary"],
      },
    ];
  }

  return [
    {
      id: "andes-balance-1010",
      brandId: "andes-herbal-lab",
      brandName: "Andes Herbal Lab",
      name: "Balance 10:10 Oil",
      format: "Sublingual oil",
      strain: "Therapeutic blend",
      thc: "10%",
      cbd: "10%",
      traceability: "Visible batch and lab",
      availableAt: ["Green North Dispensary"],
    },
    {
      id: "andes-night-drop",
      brandId: "andes-herbal-lab",
      brandName: "Andes Herbal Lab",
      name: "Night Drop",
      format: "Night tincture",
      strain: "Rest formula",
      thc: "4%",
      cbd: "18%",
      traceability: "Verified lab profile",
      availableAt: ["Green North Dispensary"],
    },
    {
      id: "patagonia-flower",
      brandId: "patagonia-care",
      brandName: "Patagonia Care",
      name: "Patagonia Indoor Flower",
      format: "Medicinal flower",
      strain: "Patagonia Calm",
      thc: "17%",
      cbd: "1%",
      traceability: "Visible cultivation origin",
      availableAt: ["Green North Dispensary"],
    },
    {
      id: "patagonia-softgel",
      brandId: "patagonia-care",
      brandName: "Patagonia Care",
      name: "Balance Softgel",
      format: "Softgels",
      strain: "Daily use",
      thc: "2%",
      cbd: "12%",
      traceability: "Indexed release and stock",
      availableAt: ["Green North Dispensary"],
    },
    {
      id: "verde-gummies",
      brandId: "verde-clinico",
      brandName: "Verde Clinico",
      name: "CBD Focus Gummies",
      format: "Functional gummies",
      strain: "CBD functional",
      thc: "0%",
      cbd: "20mg",
      traceability: "Verified associated brand",
      availableAt: ["Green North Dispensary"],
    },
    {
      id: "verde-rest-oil",
      brandId: "verde-clinico",
      brandName: "Verde Clinico",
      name: "Rest Oil",
      format: "Therapeutic oil",
      strain: "Sleep formula",
      thc: "3%",
      cbd: "15%",
      traceability: "Batch history available",
      availableAt: ["Green North Dispensary"],
    },
  ];
}
