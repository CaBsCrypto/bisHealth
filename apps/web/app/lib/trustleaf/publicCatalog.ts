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

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      doctors: doctors.length,
      dispensaries: dispensaries.length,
      brands: brands.length,
      prescriptions: indexedState.prescriptions.length,
      consumedPrescriptions: indexedState.prescriptionConsumptions.length,
    },
    doctors,
    dispensaries,
    brands,
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
      },
      {
        id: "patagonia-care",
        name: "Patagonia Care",
        category: "Growshop asociado",
        body: "Linea curada de bienestar, formatos simples y presentacion confiable para dispensarios.",
        heroProduct: "Flor medicinal indoor",
        origin: "Patagonia",
      },
      {
        id: "verde-clinico",
        name: "Verde Clinico",
        category: "Marca asociada",
        body: "Productos orientados a dolor cronico, descanso y acompanamiento terapeutico.",
        heroProduct: "Gomitas funcionales CBD",
        origin: "LatAm",
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
    },
    {
      id: "patagonia-care",
      name: "Patagonia Care",
      category: "Associated growshop",
      body: "Curated wellness line, simple formats, and trusted presentation for dispensary shelves.",
      heroProduct: "Indoor medicinal flower",
      origin: "Patagonia",
    },
    {
      id: "verde-clinico",
      name: "Verde Clinico",
      category: "Associated brand",
      body: "Products oriented to chronic pain, rest, and therapeutic follow-up.",
      heroProduct: "Functional CBD gummies",
      origin: "LatAm",
    },
  ];
}
