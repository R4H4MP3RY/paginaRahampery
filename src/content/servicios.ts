import type { Faq } from "@/content/seguros";
import type { Service } from "@/lib/site";

export type ServicePage = {
  slug: string;
  audience: Service["audience"];
  navLabel: string;
  h1: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  problemsTitle: string;
  problems: { title: string; text: string }[];
  processTitle: string;
  process: string[];
  faqs: Faq[];
  whatsappMessage: string;
};

export const servicePages: ServicePage[] = [
  {
    slug: "finanzas-personales",
    audience: "personas",
    navLabel: "Para ti",
    eyebrow: "Coach financiero personal",
    h1: "Toma el control de tus finanzas personales con un plan a tu medida",
    metaTitle: "Coach financiero personal en Zapopan · Finanzas personales",
    metaDescription:
      "Coaching de finanzas personales: mide tu salud financiera, sal de deudas, ahorra e invierte con un plan a tu medida. Consultoría desde $350 MXN. Presencial en la ZMG y en línea.",
    intro:
      "Nadie nos enseñó a manejar el dinero en la escuela. Te acompaño a entender tus finanzas, ordenar tus gastos y construir un plan realista para cumplir tus metas, sueños y objetivos sin dejar de disfrutar tu vida.",
    problemsTitle: "Te ayudo a…",
    problems: [
      { title: "Salir de deudas", text: "Ordenamos tus deudas y creamos una estrategia para liquidarlas sin ahogarte." },
      { title: "Ahorrar de verdad", text: "Definimos cuánto, para qué y cómo ahorrar, empezando por tu fondo de emergencia." },
      { title: "Entender las inversiones", text: "Aprendes cómo funcionan las distintas opciones para invertir tu dinero con criterio propio." },
      { title: "Planear tu retiro", text: "Calculamos qué necesitas para un retiro digno, más allá de tu AFORE." },
      { title: "Proteger a tu familia", text: "Revisamos qué seguros necesitas y cuáles no, para no pagar de más." },
      { title: "Cumplir tus metas", text: "Casa, auto, viajes o educación: convertimos cada meta en un plan con fechas y montos." },
    ],
    processTitle: "¿Qué revisamos en tu diagnóstico de salud financiera?",
    process: [
      "Tus ingresos, gastos y capacidad de ahorro.",
      "Tus deudas: tasas, plazos y prioridad de pago.",
      "Tu fondo de emergencia y tu protección (seguros).",
      "Tu ahorro para el retiro y tus inversiones actuales.",
      "Tus metas de corto, mediano y largo plazo.",
    ],
    faqs: [
      {
        q: "¿Necesito ganar mucho para tener un plan financiero?",
        a: "No. Un plan financiero sirve precisamente para aprovechar mejor lo que ganas hoy, sea poco o mucho.",
      },
      {
        q: "¿Cuál es la diferencia entre la consultoría y el plan financiero?",
        a: "La consultoría es una sesión de una hora para revisar un tema o hacer tu diagnóstico. El plan financiero es un acompañamiento de 12 meses con sesiones trimestrales para dar seguimiento y ajustar tu plan.",
      },
      {
        q: "¿Me dices en qué invertir?",
        a: "Te enseño cómo funcionan las distintas opciones de inversión, sus riesgos y costos, para que decidas con información. No doy recomendaciones personalizadas de compra o venta de valores.",
      },
      {
        q: "¿Las sesiones son en línea?",
        a: "Pueden ser en línea desde cualquier parte de México o presenciales en la Zona Metropolitana de Guadalajara.",
      },
    ],
    whatsappMessage: "Hola, quiero mejorar mis finanzas personales. Deseo recibir más información.",
  },
  {
    slug: "finanzas-para-empresas",
    audience: "empresas",
    navLabel: "Empresas",
    eyebrow: "Consultoría para MIPyMES",
    h1: "Finanzas claras para que tu negocio crezca",
    metaTitle: "Consultoría financiera para MIPyMES en Zapopan y Guadalajara",
    metaDescription:
      "Consultoría financiera para micro, pequeñas y medianas empresas: información financiera, modelo de negocio, estructura y metas. Desde $500 MXN por hora, sin plazo mínimo.",
    intro:
      "Muchos negocios venden bien pero no saben si realmente ganan dinero. Te ayudo a entender los números de tu empresa, revisar tu modelo de negocio y definir los cambios que te acercan a tus metas.",
    problemsTitle: "Trabajamos en…",
    problems: [
      { title: "Tu información financiera", text: "Ingresos, costos, márgenes y flujo de efectivo explicados en claro." },
      { title: "Tu modelo de negocio", text: "Revisamos cómo generas valor y dinero, y dónde hay oportunidades de mejora." },
      { title: "La estructura de tu empresa", text: "Roles, procesos y organización para que el negocio no dependa solo de ti." },
      { title: "Separar lo personal del negocio", text: "Definimos tu sueldo como dueño y dejamos de mezclar las cuentas." },
      { title: "Metas y crecimiento", text: "Establecemos metas medibles y un plan de acción para alcanzarlas." },
      { title: "Protección del negocio", text: "Identificamos los riesgos que podrían detener tu operación." },
    ],
    processTitle: "¿Cómo trabajamos?",
    process: [
      "Sesión inicial para conocer tu negocio y revisar tu información financiera.",
      "Diagnóstico de la situación financiera, el modelo de negocio y la estructura.",
      "Definición de metas y de los cambios a implementar.",
      "Sesiones de seguimiento (2 a 3 al mes) para acompañarte en la implementación.",
    ],
    faqs: [
      {
        q: "¿Hay un plazo mínimo de contratación?",
        a: "No. El acompañamiento funciona por sesiones, como una terapia: continúas mientras te sea útil.",
      },
      {
        q: "¿Mi negocio es muy pequeño para una consultoría?",
        a: "No. Entre más temprano ordenes las finanzas de tu negocio, más fácil es crecer sin tropiezos.",
      },
      {
        q: "¿Emites factura?",
        a: "Sí, facturo las consultorías como persona física.",
      },
    ],
    whatsappMessage: "Hola, quiero información sobre la consultoría financiera para mi empresa.",
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((p) => p.slug === slug);
}
