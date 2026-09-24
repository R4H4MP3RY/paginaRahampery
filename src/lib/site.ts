// Fuente única de datos de marca. Todo lo que aparece en páginas, metadata,
// JSON-LD y sitemap sale de aquí para que no haya datos contradictorios.

export const site = {
  name: "Rahampery Contreras",
  legalName: "Héctor Rahampery Hernández Contreras",
  title: "Rahampery Contreras | Coach Financiero en Zapopan y todo México",
  description:
    "Coach financiero en Zapopan, Jalisco. Te ayudo a aprovechar, proteger y hacer crecer tu dinero con un plan financiero a tu medida. Consultorías para personas y MIPyMES, seguros y planes de retiro.",
  url: "https://rahamperycontreras.mx",
  locale: "es_MX",
  slogan: "La clave del éxito está en hacer diferente lo que hacemos comúnmente.",
  foundedAt: "2020-03",
  location: {
    locality: "Zapopan",
    region: "Jalisco",
    country: "MX",
    areaServed: "Zona Metropolitana de Guadalajara (presencial) y todo México (en línea)",
  },
  whatsapp: {
    number: "523317231325",
    display: "33 1723 1325",
    message: "Deseo recibir más información para mejorar mi situación financiera.",
  },
  cnsf: {
    cedula: "C358869",
    tipo: "A",
    ramo: "Riesgos personales y familiares",
    // La cédula vence el 09/11/2026: renovar y actualizar esta fecha.
    vigenteHasta: "2026-11-09",
  },
  quoteEmail: "contacto@rahamperycontreras.mx",
  supportEmail: "hola@rahamperycontreras.mx",
  legalEmail: "legal@rahamperycontreras.mx",
  // Domicilio para el aviso de privacidad (obligatorio por ley). No se muestra en el resto del sitio.
  privacyAddress: "Paseo de los Nísperos 1753, Col. Tabachines, C.P. 45188, Zapopan, Jalisco, México",
  social: {
    instagram: "https://www.instagram.com/rahamperycontreras/",
    facebook: "https://www.facebook.com/rahamperycontreras/",
    linkedin: "https://mx.linkedin.com/in/h%C3%A9ctor-rahampery-hern%C3%A1ndez-contreras-822106119",
    youtube: "https://www.youtube.com/@rahamperycontre",
    adviceme: "https://adviceme.mx/perfil?id_user=5749",
  },
} as const;

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export type Service = {
  slug: string;
  name: string;
  audience: "personas" | "empresas";
  price: string;
  summary: string;
};

export const services: Service[] = [
  {
    slug: "consultoria-personal",
    name: "Consultoría financiera 1 a 1",
    audience: "personas",
    price: "$350 MXN por hora",
    summary:
      "Medimos tu salud financiera, aterrizamos tus metas, sueños y objetivos, y encontramos opciones de mejora.",
  },
  {
    slug: "plan-financiero-personal",
    name: "Plan financiero personal",
    audience: "personas",
    price: "$200 MXN al mes o $2,000 MXN al año",
    summary:
      "Acompañamiento durante 12 meses con sesiones trimestrales para medir tu salud financiera y actualizar tu plan.",
  },
  {
    slug: "consultoria-mipymes",
    name: "Consultoría 1 a 1 para MIPyMES",
    audience: "empresas",
    price: "$500 MXN por hora",
    summary:
      "Revisamos la información financiera, el modelo de negocio y la estructura de tu empresa para definir metas y cambios a implementar.",
  },
  {
    slug: "plan-financiero-empresarial",
    name: "Plan financiero empresarial",
    audience: "empresas",
    price: "$350 MXN por hora · 2 a 3 sesiones al mes",
    summary: "Acompañamiento continuo para tu negocio, sin plazo mínimo de contratación.",
  },
];

export type InsuranceCategory = "salud" | "patrimonio" | "retiro" | "empresa";

export const insuranceCategories: Record<InsuranceCategory, string> = {
  salud: "Tu vida y tu salud",
  patrimonio: "Tu patrimonio",
  retiro: "Tu retiro",
  empresa: "Tu negocio",
};

export type Insurance = {
  slug: string;
  name: string;
  keyword: string;
  category: InsuranceCategory;
  // true = no se muestra ni se acepta en el formulario hasta confirmar la cédula necesaria.
  hidden?: boolean;
  // Texto de ayuda (placeholder) del campo "Describe lo que necesitas" del formulario.
  quoteHint?: string;
};

// Qué información necesito para cotizar cada tipo de seguro.
const hints = {
  vidaRetiro:
    "Por favor compárteme el monto de dinero aproximado que puedes destinar para este producto financiero, si eres una persona que fuma y lo que gustes agregar.",
  salud:
    "Por favor indícame si vas a estar solo en la póliza o si hay más personas; de cada una, escribe su nombre completo, fecha de nacimiento y parentesco, y lo que gustes agregar.",
  viajero: "Por favor escribe tu itinerario, fechas y lugares a visitar, y lo que quieras agregar.",
  auto: "Por favor indícame el código postal de donde vives actualmente y la marca, modelo y versión que vienen en la factura de tu auto o en la carátula de tu póliza actual, y lo que gustes agregar.",
  hogar:
    "Por favor compárteme la dirección del hogar que deseas asegurar, el número de pisos que tiene y si eres dueño o rentas.",
};

// Cada seguro tendrá su propia página (/seguros/[slug]) para posicionar su palabra clave.
export const insurances: Insurance[] = [
  { slug: "seguro-de-vida", name: "Seguro de vida", keyword: "seguro de vida", category: "salud", quoteHint: hints.vidaRetiro },
  { slug: "gastos-medicos-mayores", name: "Gastos médicos mayores", keyword: "seguro de gastos médicos mayores", category: "salud", quoteHint: hints.salud },
  { slug: "gastos-medicos-menores", name: "Gastos médicos menores", keyword: "seguro de gastos médicos menores", category: "salud", quoteHint: hints.salud },
  { slug: "accidentes-personales", name: "Accidentes personales", keyword: "seguro de accidentes personales", category: "salud", quoteHint: hints.salud },
  { slug: "seguro-de-viajero", name: "Seguro de viajero", keyword: "seguro de viajero", category: "salud", quoteHint: hints.viajero },
  { slug: "seguro-de-auto", name: "Seguro de auto", keyword: "seguro de auto", category: "patrimonio", quoteHint: hints.auto },
  { slug: "seguro-de-hogar", name: "Seguro de hogar", keyword: "seguro de hogar", category: "patrimonio", quoteHint: hints.hogar },
  { slug: "plan-personal-de-retiro", name: "Plan Personal de Retiro (PPR)", keyword: "PPR plan personal de retiro", category: "retiro", quoteHint: hints.vidaRetiro },
  { slug: "ahorro-para-el-retiro", name: "Planes de ahorro para el retiro", keyword: "ahorro para el retiro", category: "retiro", quoteHint: hints.vidaRetiro },
  // OJO: los riesgos empresariales suelen requerir cédula B. Confirmar con la promotoría
  // si se pueden ofrecer con cédula A (o a través de quién) antes de publicarlos.
  { slug: "seguro-de-negocio", name: "Seguro de negocio", keyword: "seguro para negocio", category: "empresa", hidden: true },
  { slug: "seguro-hombre-clave", name: "Seguro de hombre clave", keyword: "seguro de hombre clave", category: "empresa", hidden: true },
];

// Solo nombres en texto: usar logotipos requiere autorización de cada aseguradora.
export const insurers = [
  "MetLife",
  "Allianz",
  "AXA",
  "Chubb",
  "Zurich",
  "Quálitas",
  "Seguros Banorte",
  "Seguros El Potosí",
  "Seguros Afirme",
  "ANA Seguros",
  "General de Seguros",
];

export const offeredInsurances = insurances.filter((i) => !i.hidden);

export const legalDisclaimer =
  "El contenido de este sitio es educativo y no constituye una recomendación personalizada de inversión en valores. Rahampery Contreras no está registrado como asesor en inversiones ante la CNBV. Los seguros son emitidos y facturados por las aseguradoras correspondientes.";
