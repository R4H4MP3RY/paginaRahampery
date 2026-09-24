// Contenido de las páginas /seguros/[slug]. Información general y educativa:
// coberturas, exclusiones y condiciones dependen de cada aseguradora y póliza.

export type Faq = { q: string; a: string };

export type InsurancePage = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  forWhom: string[];
  covers: string[];
  considerations: string[];
  faqs: Faq[];
};

export const insurancePages: InsurancePage[] = [
  {
    slug: "seguro-de-vida",
    h1: "Seguro de vida: protege a tu familia pase lo que pase",
    metaTitle: "Seguro de vida en Zapopan y Guadalajara · Cotiza gratis",
    metaDescription:
      "Cotiza tu seguro de vida con un agente certificado por la CNSF. Te ayudo a calcular la suma asegurada que tu familia necesita. Asesoría en Zapopan y en línea.",
    intro:
      "Un seguro de vida garantiza que las personas que dependen de ti tengan dinero para seguir adelante si tú faltas. Es la base de cualquier plan financiero cuando alguien depende de tus ingresos.",
    forWhom: [
      "Madres y padres de familia con hijos o dependientes económicos.",
      "Personas con créditos hipotecarios, automotrices o deudas que no quieren heredar.",
      "Parejas que comparten gastos y quieren proteger el nivel de vida del otro.",
      "Quienes quieren dejar un patrimonio o combinar protección con ahorro.",
    ],
    covers: [
      "Pago de la suma asegurada a tus beneficiarios en caso de fallecimiento.",
      "Coberturas adicionales según el plan: muerte accidental, invalidez total y permanente o enfermedades graves.",
      "Planes temporales (protección pura por un plazo), vitalicios o con componente de ahorro.",
    ],
    considerations: [
      "La suma asegurada debe cubrir deudas, gastos de tu familia por varios años y metas como la educación de tus hijos.",
      "Mientras más joven y sano contrates, menor suele ser la prima.",
      "Designa beneficiarios y mantenlos actualizados.",
      "Declara tu estado de salud con veracidad: omitir información puede invalidar la póliza.",
    ],
    faqs: [
      {
        q: "¿Cuánta suma asegurada necesito?",
        a: "Depende de tus ingresos, deudas y de cuántos años necesitaría tu familia para reorganizarse. En la asesoría lo calculamos juntos con base en tu situación real.",
      },
      {
        q: "¿Qué diferencia hay entre un seguro temporal y uno con ahorro?",
        a: "El temporal protege durante un plazo definido y suele ser más económico. Los planes con ahorro combinan protección y acumulación de dinero, con una prima mayor. Te explico cuál conviene según tus metas.",
      },
      {
        q: "¿La cotización tiene costo?",
        a: "No. Cotizar es gratuito y sin compromiso.",
      },
    ],
  },
  {
    slug: "gastos-medicos-mayores",
    h1: "Seguro de gastos médicos mayores para ti y tu familia",
    metaTitle: "Seguro de gastos médicos mayores · Mujeres, embarazo y familia",
    metaDescription:
      "Cotiza tu seguro de gastos médicos mayores: hospitalización, cirugías y maternidad. Te explico deducible, coaseguro y periodos de espera. Zapopan y todo México.",
    intro:
      "Una hospitalización o cirugía puede costar cientos de miles de pesos. El seguro de gastos médicos mayores protege tu salud y tus ahorros para que una emergencia no se convierta en una deuda.",
    forWhom: [
      "Personas y familias que quieren atención en hospitales privados.",
      "Mujeres que planean un embarazo y quieren cobertura de maternidad.",
      "Profesionistas independientes sin prestaciones médicas de su empleo.",
      "Quienes tienen seguro de su empresa pero quieren una póliza propia que no dependa de su trabajo.",
    ],
    covers: [
      "Hospitalización, cirugías, honorarios médicos y medicamentos durante la hospitalización.",
      "Estudios de laboratorio y gabinete relacionados con el padecimiento.",
      "Maternidad y complicaciones del embarazo o del recién nacido, según el plan.",
      "Coberturas opcionales como emergencia en el extranjero o reducción de deducible por accidente.",
    ],
    considerations: [
      "Deducible: la cantidad que pagas antes de que la aseguradora empiece a cubrir.",
      "Coaseguro: el porcentaje que te toca pagar después del deducible, normalmente con un tope.",
      "Periodos de espera: padecimientos como maternidad suelen cubrirse solo después de cierto tiempo de antigüedad, por eso conviene contratar antes de planear un embarazo.",
      "Las enfermedades preexistentes normalmente no se cubren, así que es mejor contratar mientras estás sano.",
    ],
    faqs: [
      {
        q: "¿Puedo contratar si ya estoy embarazada?",
        a: "En general, un embarazo en curso no se cubre como maternidad porque existen periodos de espera. Escríbeme y revisamos qué opciones hay para ti y para tu bebé.",
      },
      {
        q: "¿Qué suma asegurada me conviene?",
        a: "Depende del nivel de hospitales que quieras usar y de tu presupuesto. Comparamos planes de distintas aseguradoras para encontrar el equilibrio entre protección y costo.",
      },
      {
        q: "¿Puedo asegurar a toda mi familia en una sola póliza?",
        a: "Sí, la mayoría de las aseguradoras permiten incluir a tu pareja e hijos en la misma póliza.",
      },
    ],
  },
  {
    slug: "gastos-medicos-menores",
    h1: "Seguro de gastos médicos menores: consultas y medicamentos",
    metaTitle: "Seguro de gastos médicos menores · Consultas y estudios",
    metaDescription:
      "Seguro de gastos médicos menores para consultas, medicamentos y estudios del día a día. Complementa tu seguro de gastos médicos mayores. Cotiza gratis.",
    intro:
      "Los gastos médicos del día a día (consultas, estudios y medicamentos) también afectan tu bolsillo. Un seguro de gastos médicos menores te da acceso a atención con copagos accesibles.",
    forWhom: [
      "Familias con niños que van seguido al médico.",
      "Personas que quieren atención preventiva sin gastar de más.",
      "Quienes ya tienen gastos médicos mayores y quieren complementarlo.",
    ],
    covers: [
      "Consultas con médicos generales y especialistas dentro de una red.",
      "Estudios de laboratorio e imagen.",
      "Descuentos o cobertura en medicamentos, según el plan.",
      "Servicios como orientación médica telefónica o dental, dependiendo de la aseguradora.",
    ],
    considerations: [
      "Revisa la red de médicos y clínicas cercanas a tu casa o trabajo.",
      "Compara el copago por consulta y los límites anuales.",
      "No sustituye un seguro de gastos médicos mayores: está pensado para gastos pequeños y frecuentes.",
    ],
    faqs: [
      {
        q: "¿Cubre hospitalización?",
        a: "Normalmente no. Para hospitalización y cirugías necesitas un seguro de gastos médicos mayores. Ambos se complementan.",
      },
      {
        q: "¿Conviene si ya tengo IMSS o ISSSTE?",
        a: "Puede convenir si quieres atención privada más rápida para consultas y estudios. Lo revisamos según tu uso y presupuesto.",
      },
    ],
  },
  {
    slug: "accidentes-personales",
    h1: "Seguro de accidentes personales: protección accesible",
    metaTitle: "Seguro de accidentes personales · Cotiza gratis",
    metaDescription:
      "Seguro de accidentes personales con reembolso de gastos médicos por accidente e indemnización por pérdidas orgánicas. Protección económica para ti y tus hijos.",
    intro:
      "Un accidente puede ocurrir en cualquier momento: en la calle, en el deporte o en casa. Este seguro cubre los gastos médicos y te indemniza si el accidente tiene consecuencias graves, con una prima accesible.",
    forWhom: [
      "Personas que manejan, se transportan en moto o bicicleta diariamente.",
      "Deportistas y personas activas.",
      "Niñas, niños y jóvenes en edad escolar.",
      "Quienes buscan una primera protección con un presupuesto reducido.",
    ],
    covers: [
      "Reembolso de gastos médicos derivados de un accidente.",
      "Indemnización por muerte accidental.",
      "Indemnización por pérdidas orgánicas o invalidez a causa de un accidente.",
    ],
    considerations: [
      "Solo cubre accidentes, no enfermedades.",
      "Revisa las actividades excluidas, como algunos deportes de alto riesgo.",
      "Es un buen complemento de un seguro de vida o de gastos médicos, no un sustituto.",
    ],
    faqs: [
      {
        q: "¿Cubre enfermedades?",
        a: "No. Para enfermedades necesitas un seguro de gastos médicos mayores o menores.",
      },
      {
        q: "¿Puedo asegurar a mis hijos?",
        a: "Sí. Es una opción común para niñas, niños y jóvenes, incluso como complemento del seguro escolar.",
      },
    ],
  },
  {
    slug: "seguro-de-viajero",
    h1: "Seguro de viajero: viaja tranquilo dentro y fuera de México",
    metaTitle: "Seguro de viajero · Gastos médicos en el extranjero",
    metaDescription:
      "Seguro de viajero con gastos médicos en el extranjero, asistencia y equipaje. Ideal para vacaciones, trabajo o visa Schengen. Cotiza gratis.",
    intro:
      "Una emergencia médica fuera de México puede costar muchísimo. El seguro de viajero cubre tus gastos médicos y te da asistencia durante tu viaje.",
    forWhom: [
      "Personas que viajan de vacaciones o por trabajo.",
      "Estudiantes de intercambio.",
      "Viajeros a Europa, donde la visa Schengen exige un seguro médico de viaje.",
    ],
    covers: [
      "Gastos médicos por enfermedad o accidente durante el viaje.",
      "Traslado o repatriación sanitaria.",
      "Pérdida o demora de equipaje y cancelación de viaje, según el plan.",
      "Asistencia en viaje las 24 horas.",
    ],
    considerations: [
      "Revisa que la suma asegurada sea suficiente para el país que visitas.",
      "Si viajas a Europa, confirma que el plan cumpla los requisitos de la visa Schengen.",
      "Contrátalo antes de salir: algunas coberturas solo aplican si lo compras con anticipación.",
    ],
    faqs: [
      {
        q: "¿Mi seguro de gastos médicos me cubre en el extranjero?",
        a: "Algunas pólizas incluyen emergencias en el extranjero con límites. Revisamos tu póliza y te digo si necesitas un seguro de viajero adicional.",
      },
      {
        q: "¿Puedo contratarlo solo por los días de mi viaje?",
        a: "Sí, se contrata por la duración del viaje. También hay planes anuales si viajas con frecuencia.",
      },
    ],
  },
  {
    slug: "seguro-de-auto",
    h1: "Seguro de auto: cotiza y compara en minutos",
    metaTitle: "Seguro de auto en Zapopan y Guadalajara · Cotiza gratis",
    metaDescription:
      "Cotiza tu seguro de auto con cobertura amplia, limitada o de responsabilidad civil. Comparo varias aseguradoras para encontrar la mejor opción para ti.",
    intro:
      "Tu auto es parte de tu patrimonio y un accidente puede costar mucho más que el auto mismo. Te ayudo a comparar coberturas de distintas aseguradoras para que pagues lo justo por la protección que necesitas.",
    forWhom: [
      "Personas que usan su auto a diario o en carretera.",
      "Quienes tienen un auto financiado (la financiera suele pedir cobertura amplia).",
      "Dueños de autos que buscan reducir el costo de su póliza actual.",
    ],
    covers: [
      "Responsabilidad civil por daños a terceros en sus bienes y personas.",
      "Daños materiales a tu auto y robo total (en coberturas amplia y limitada).",
      "Gastos médicos para los ocupantes.",
      "Asistencia legal y asistencia vial.",
    ],
    considerations: [
      "Para circular por carreteras federales la ley exige, como mínimo, un seguro de responsabilidad civil.",
      "Compara el deducible por daños materiales y robo total.",
      "Revisa si la suma asegurada es a valor comercial o convenido.",
    ],
    faqs: [
      {
        q: "¿Qué diferencia hay entre cobertura amplia y limitada?",
        a: "La amplia cubre daños materiales a tu auto, robo total y responsabilidad civil. La limitada cubre robo total y responsabilidad civil, pero no los daños a tu propio auto.",
      },
      {
        q: "¿Puedo cambiarme de aseguradora antes de que venza mi póliza?",
        a: "Sí. Revisamos tu póliza actual y, si encontramos una mejor opción, te ayudo con el cambio.",
      },
    ],
  },
  {
    slug: "seguro-de-hogar",
    h1: "Seguro de hogar: protege tu casa y lo que hay dentro",
    metaTitle: "Seguro de hogar para propietarios y quienes rentan",
    metaDescription:
      "Seguro de hogar contra incendio, robo, fenómenos naturales y responsabilidad civil. Para casa propia o rentada. Cotiza gratis en Zapopan y todo México.",
    intro:
      "Tu casa suele ser tu patrimonio más importante. Un seguro de hogar te protege contra incendios, fenómenos naturales, robo y daños a terceros por un costo menor del que imaginas.",
    forWhom: [
      "Propietarios de casa o departamento.",
      "Personas que rentan y quieren proteger sus pertenencias.",
      "Quienes tienen un crédito hipotecario y buscan una cobertura más completa.",
    ],
    covers: [
      "Daños a la construcción por incendio, explosión y fenómenos hidrometeorológicos.",
      "Terremoto, según el plan.",
      "Robo de contenidos, como muebles y aparatos electrónicos.",
      "Responsabilidad civil familiar por daños a terceros.",
      "Rotura de cristales y asistencias en el hogar.",
    ],
    considerations: [
      "Asegura la construcción por su valor de reconstrucción, no por su valor comercial.",
      "Haz un inventario de tus bienes más valiosos.",
      "Si rentas, puedes asegurar solo tus contenidos y tu responsabilidad civil.",
    ],
    faqs: [
      {
        q: "¿El seguro de mi crédito hipotecario ya cubre mi casa?",
        a: "Normalmente solo cubre la construcción y protege al banco. No suele incluir tus pertenencias ni tu responsabilidad civil. Lo revisamos juntos.",
      },
      {
        q: "¿Cuesta mucho?",
        a: "Suele ser uno de los seguros más accesibles en relación con lo que protege. Te cotizo varias opciones sin costo.",
      },
    ],
  },
  {
    slug: "plan-personal-de-retiro",
    h1: "Plan Personal de Retiro (PPR): ahorra para tu retiro y deduce impuestos",
    metaTitle: "PPR Plan Personal de Retiro · Ahorro con beneficio fiscal",
    metaDescription:
      "Aprende qué es un PPR, cómo funciona su beneficio fiscal y cómo complementa tu AFORE para lograr un retiro digno. Asesoría con agente de seguros certificado.",
    intro:
      "La pensión de la AFORE por sí sola difícilmente mantendrá tu nivel de vida. Un Plan Personal de Retiro te ayuda a ahorrar a largo plazo para un retiro digno y, además, puede darte un beneficio fiscal cada año.",
    forWhom: [
      "Personas asalariadas o independientes que quieren complementar su AFORE.",
      "Quienes presentan declaración anual y buscan deducciones personales.",
      "Personas de 25 a 50 años que quieren aprovechar el tiempo a su favor.",
    ],
    covers: [
      "Ahorro de largo plazo para tu retiro.",
      "Aportaciones deducibles en tu declaración anual, dentro de los límites de la ley (art. 151 de la Ley del ISR).",
      "Protección por fallecimiento o invalidez, según el plan de la aseguradora.",
    ],
    considerations: [
      "La deducción tiene un límite anual: hasta el 10 % de tus ingresos acumulables, sin exceder cinco UMA anuales.",
      "Para conservar el beneficio fiscal, el dinero debe mantenerse hasta los 65 años o hasta una invalidez o incapacidad.",
      "Retirar antes implica pagar impuestos sobre lo retirado.",
      "Consulta con tu contador cómo aplicar la deducción en tu caso particular.",
    ],
    faqs: [
      {
        q: "¿El PPR sustituye a mi AFORE?",
        a: "No, la complementa. La AFORE es obligatoria para trabajadores formales; el PPR es un ahorro voluntario adicional para mejorar tu pensión.",
      },
      {
        q: "¿Cuánto debo ahorrar?",
        a: "Depende de la edad a la que quieras retirarte y del ingreso que quieras tener. Hacemos el cálculo en tu plan financiero.",
      },
      {
        q: "¿Qué pasa si necesito el dinero antes?",
        a: "Puedes retirarlo, pero pierdes el beneficio fiscal y pagas impuestos. Por eso es importante tener también un fondo de emergencia.",
      },
    ],
  },
  {
    slug: "ahorro-para-el-retiro",
    h1: "Planes de ahorro para el retiro y metas de largo plazo",
    metaTitle: "Ahorro para el retiro · Planes con aseguradoras",
    metaDescription:
      "Planes de ahorro con aseguradoras para tu retiro, la educación de tus hijos y otras metas de largo plazo. Ahorro disciplinado con protección incluida.",
    intro:
      "Ahorrar sin un plan es difícil. Los planes de ahorro con aseguradoras te ayudan a apartar dinero de forma disciplinada para tu retiro, la universidad de tus hijos u otras metas, con protección para tu familia.",
    forWhom: [
      "Quienes quieren ahorrar de forma constante y automática.",
      "Madres y padres que planean la educación de sus hijos.",
      "Personas que quieren un retiro digno además de su AFORE.",
    ],
    covers: [
      "Ahorro programado a un plazo definido.",
      "Suma asegurada para tus beneficiarios si faltas durante el plazo del plan.",
      "Planes en pesos, UDIS o dólares, según la aseguradora.",
    ],
    considerations: [
      "Elige el plazo según tu meta: retiro, educación o patrimonio.",
      "Compara la moneda del plan y cómo se protege contra la inflación.",
      "Revisa las penalizaciones por cancelar antes del plazo.",
    ],
    faqs: [
      {
        q: "¿En qué se diferencia de un PPR?",
        a: "El PPR tiene un beneficio fiscal específico y reglas de retiro a partir de los 65 años. Otros planes de ahorro pueden tener plazos más flexibles. Te explico cuál conviene para tu meta.",
      },
      {
        q: "¿Puedo usarlo para la universidad de mis hijos?",
        a: "Sí. Existen planes diseñados para que el dinero esté disponible cuando tus hijos entren a la universidad.",
      },
    ],
  },
];

export function getInsurancePage(slug: string) {
  return insurancePages.find((p) => p.slug === slug);
}
