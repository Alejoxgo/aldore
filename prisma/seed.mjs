// Carga datos iniciales. Es idempotente: solo inserta contenido en tablas vacías.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    slug: "desarrollo-web",
    title: "Páginas web y tiendas online",
    icon: "code",
    shortDescription: "Sitios rápidos, modernos y optimizados para Google que convierten visitas en clientes.",
    description:
      "Diseñamos y desarrollamos páginas web corporativas, landing pages y tiendas online pensadas para vender. Cada sitio es rápido, se ve perfecto en el celular y está optimizado para aparecer en Google.\n\nIncluimos panel de administración para que actualices tu contenido sin depender de nadie, integración con WhatsApp, analítica y pasarelas de pago.",
    features: "Diseño a la medida y responsive\nSEO técnico y velocidad\nPanel autoadministrable\nTiendas online con pagos en línea\nHosting, dominio y certificado SSL\nIntegración con WhatsApp y redes",
  },
  {
    slug: "aplicaciones",
    title: "Aplicaciones a la medida",
    icon: "smartphone",
    shortDescription: "Apps móviles y web que digitalizan tus procesos y escalan con tu negocio.",
    description:
      "Construimos aplicaciones móviles (iOS y Android) y plataformas web a la medida: sistemas internos, portales de clientes, marketplaces, apps de reservas y mucho más.\n\nTrabajamos con metodologías ágiles y entregas semanales para que veas avances reales desde el primer sprint.",
    features: "Apps iOS y Android\nPlataformas web y SaaS\nDiseño UX/UI\nArquitectura en la nube escalable\nMantenimiento y evolución continua",
  },
  {
    slug: "chatbots",
    title: "Chatbots con inteligencia artificial",
    icon: "bot",
    shortDescription: "Asistentes 24/7 en WhatsApp, web e Instagram que atienden, venden y agendan por ti.",
    description:
      "Creamos chatbots con IA que entienden lenguaje natural, responden preguntas frecuentes, califican prospectos, toman pedidos y agendan citas, en WhatsApp, tu sitio web, Instagram o Messenger.\n\nLos entrenamos con la información de tu negocio y los conectamos a tu CRM o sistemas internos para que la conversación termine en una venta.",
    features: "WhatsApp Business API\nIA entrenada con tus datos\nAgendamiento y pedidos automáticos\nTraspaso a un asesor humano\nReportes de conversaciones",
  },
  {
    slug: "integraciones-ti",
    title: "Integraciones TI y automatización",
    icon: "plug",
    shortDescription: "Conectamos tu ERP, CRM, facturación, pagos y apps para que la información fluya sola.",
    description:
      "Integramos los sistemas que ya usas (ERP, CRM, facturación electrónica, pasarelas de pago, e-commerce, hojas de cálculo) mediante APIs y automatizaciones.\n\nEliminamos la doble digitación, reducimos errores y te damos datos confiables en tiempo real.",
    features: "APIs REST y webhooks\nFacturación electrónica\nAutomatización de procesos\nSincronización de inventarios y pedidos\nTableros de indicadores",
  },
  {
    slug: "nube-y-soporte",
    title: "Nube, infraestructura y soporte",
    icon: "cloud",
    shortDescription: "Migración a la nube, servidores, copias de seguridad y soporte técnico para tu equipo.",
    description:
      "Administramos tu infraestructura en la nube (AWS, Google Cloud, Azure), configuramos correos corporativos, copias de seguridad y monitoreo 24/7.\n\nAdemás ofrecemos soporte técnico para tu equipo de trabajo con tiempos de respuesta garantizados.",
    features: "Migración a la nube\nCorreo corporativo\nBackups automáticos\nMonitoreo 24/7\nMesa de ayuda",
  },
  {
    slug: "ciberseguridad",
    title: "Ciberseguridad y consultoría TI",
    icon: "shield",
    shortDescription: "Protegemos tu información y te acompañamos en la transformación digital.",
    description:
      "Evaluamos la seguridad de tus sistemas, implementamos buenas prácticas y te ayudamos a cumplir la normativa de protección de datos.\n\nTambién te acompañamos con consultoría para definir la hoja de ruta tecnológica de tu empresa.",
    features: "Auditorías de seguridad\nProtección de datos personales\nPolíticas y capacitación\nHoja de ruta de transformación digital",
  },
];

const products = [
  {
    slug: "castorly",
    name: "Castorly",
    tagline: "Calma en cada llamada.",
    description:
      "Castorly es tu centro de trabajo para el Service Desk: llamadas, tickets, conocimiento y Cástor, en un solo lugar.\n\nCástor es el asistente integrado que te acompaña mientras atiendes llamadas, gestionas tickets y consultas artículos, para que tu equipo resuelva más rápido y con menos estrés.\n\nLas cuentas las aprueba el administrador de cada organización y el acceso está protegido con conexión segura y verificación en dos pasos.",
    features: "Llamadas del Service Desk en un solo lugar\nGestión de tickets\nBase de conocimiento y artículos\nCástor, asistente que te acompaña en cada caso\nVerificación en dos pasos\nCuentas aprobadas por el administrador",
    price: "",
    priceNote: "",
    ctaLabel: "Solicitar acceso",
    ctaUrl: "https://castorly.co/register",
    featured: true,
    order: 0,
  },
  {
    slug: "nodara-bot",
    name: "Nodara Bot",
    tagline: "Chatbot de WhatsApp listo en 7 días.",
    description:
      "Un asistente virtual con IA que atiende a tus clientes en WhatsApp las 24 horas, responde preguntas frecuentes, toma pedidos y agenda citas.\n\nIncluye configuración, entrenamiento con la información de tu negocio y panel de conversaciones.",
    features: "WhatsApp oficial\nRespuestas con IA\nAgenda y pedidos\nPanel de conversaciones",
    price: "Desde $290.000 COP/mes",
    priceNote: "Implementación incluida",
    ctaLabel: "Quiero mi chatbot",
    order: 1,
  },
  {
    slug: "nodara-web",
    name: "Nodara Web",
    tagline: "Tu página web autoadministrable, lista en 10 días.",
    description:
      "Una página web profesional con panel de administración, hosting, dominio y certificado SSL incluidos. Ideal para pymes y emprendedores que necesitan presencia digital rápida y efectiva.",
    features: "Diseño profesional\nPanel administrable\nHosting y dominio\nFormulario de contacto y WhatsApp",
    price: "Desde $1.200.000 COP",
    priceNote: "Pago único",
    ctaLabel: "Cotizar",
    order: 2,
  },
];

const plans = [
  {
    name: "Emprendedor",
    price: "$1.200.000",
    period: "COP · pago único",
    description: "Para empezar con presencia digital profesional.",
    features: "Landing page de 1 página\nDiseño responsive\nFormulario y botón de WhatsApp\nHosting y dominio por 1 año\nCertificado SSL",
    order: 0,
  },
  {
    name: "Empresarial",
    price: "$3.500.000",
    period: "COP · pago único",
    description: "Sitio completo y autoadministrable.",
    features: "Hasta 8 secciones\nPanel de administración\nBlog y SEO on-page\nIntegración con Google Analytics\nHosting y dominio por 1 año\n3 meses de soporte",
    highlighted: true,
    order: 1,
  },
  {
    name: "E-commerce",
    price: "$6.900.000",
    period: "COP · desde",
    description: "Tienda online lista para vender.",
    features: "Catálogo ilimitado\nPasarela de pagos\nGestión de inventario y pedidos\nIntegración con facturación electrónica\nCapacitación del equipo\n6 meses de soporte",
    order: 2,
  },
];

const testimonials = [
  { name: "Laura Gómez", role: "Gerente", company: "Distribuidora Andina", quote: "Integraron nuestro ERP con la tienda online y dejamos de digitar pedidos a mano. Ahorramos horas cada semana.", order: 0 },
  { name: "Carlos Restrepo", role: "Fundador", company: "Clínica Dental Sonríe", quote: "El chatbot agenda citas por WhatsApp incluso de madrugada. Nuestra agenda nunca había estado tan llena.", order: 1 },
  { name: "Andrea Martínez", role: "Directora comercial", company: "Grupo Inmobiliario Altos", quote: "La nueva página web se ve espectacular y la podemos actualizar nosotros mismos. Los leads se duplicaron.", order: 2 },
];

const faqs = [
  { question: "¿Cuánto tiempo toma desarrollar una página web?", answer: "Una landing page está lista en 7 a 10 días hábiles. Un sitio corporativo completo toma de 3 a 5 semanas, y una tienda online de 4 a 8 semanas, según el alcance.", order: 0 },
  { question: "¿Puedo editar mi página yo mismo?", answer: "Sí. Todos nuestros sitios incluyen un panel de administración sencillo para que cambies textos, imágenes, productos y precios sin conocimientos técnicos.", order: 1 },
  { question: "¿Qué es Castorly?", answer: "Es nuestra plataforma para equipos de Service Desk: reúne llamadas, tickets, base de conocimiento y a Cástor, un asistente que te acompaña en cada caso. Puedes solicitar acceso en castorly.co.", order: 2 },
  { question: "¿Trabajan con empresas fuera de mi ciudad?", answer: "Sí, trabajamos 100 % remoto con clientes en toda Latinoamérica y coordinamos reuniones por videollamada.", order: 3 },
  { question: "¿Ofrecen soporte después de la entrega?", answer: "Todos los proyectos incluyen un periodo de soporte y garantía. Además ofrecemos planes de mantenimiento mensual.", order: 4 },
];

async function seedIfEmpty(name, delegate, rows) {
  if ((await delegate.count()) > 0) {
    console.log(`• ${name}: ya tiene datos, se omite.`);
    return;
  }
  for (const data of rows) await delegate.create({ data });
  console.log(`✓ ${name}: ${rows.length} registros creados.`);
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@nodara.co").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "CambiaEsta123!";
  if ((await prisma.user.count()) === 0) {
    await prisma.user.create({ data: { email, name: "Administrador", passwordHash: await bcrypt.hash(password, 12) } });
    console.log(`✓ Usuario admin creado: ${email}  (cambia la contraseña al ingresar)`);
  } else {
    console.log("• Usuarios: ya existen, se omite.");
  }

  await seedIfEmpty("Servicios", prisma.service, services.map((s, i) => ({ ...s, order: i })));
  await seedIfEmpty("Productos", prisma.product, products);
  await seedIfEmpty("Planes", prisma.plan, plans);
  await seedIfEmpty("Testimonios", prisma.testimonial, testimonials);
  await seedIfEmpty("Preguntas frecuentes", prisma.faq, faqs);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
