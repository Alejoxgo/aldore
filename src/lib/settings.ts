import { prisma } from "./db";

type Field = { key: string; label: string; type?: "text" | "textarea" | "url"; default: string; help?: string };
export type SettingsGroup = { id: string; title: string; description?: string; fields: Field[] };

/** Todos los textos editables del sitio. Agregar un campo aquí lo hace editable en /admin/contenido. */
export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "marca",
    title: "Marca y SEO",
    fields: [
      { key: "site.name", label: "Nombre de la empresa", default: "Aldore" },
      { key: "site.tagline", label: "Eslogan", default: "Software para empresas que no pueden parar" },
      { key: "seo.title", label: "Título SEO", default: "Aldore | Desarrollo web, apps, chatbots e integraciones TI" },
      {
        key: "seo.description",
        label: "Descripción SEO",
        type: "textarea",
        default:
          "Creamos páginas web, aplicaciones, chatbots con IA e integraciones TI para empresas que quieren crecer. Conoce también Castorly, nuestra plataforma para Service Desk.",
      },
    ],
  },
  {
    id: "hero",
    title: "Portada (Hero)",
    fields: [
      { key: "hero.title", label: "Título principal", help: "Encierra una palabra entre *asteriscos* para resaltarla.", default: "Software bien hecho para empresas que *no pueden* parar." },
      {
        key: "hero.subtitle",
        label: "Subtítulo",
        type: "textarea",
        default:
          "Hacemos páginas web, aplicaciones, chatbots e integraciones para empresas en Colombia y Latinoamérica. Somos un equipo pequeño: hablas directamente con quien escribe el código.",
      },
      { key: "hero.ctaPrimary", label: "Botón principal", default: "Cuéntanos tu proyecto" },
      { key: "hero.ctaSecondary", label: "Botón secundario", default: "Conoce Castorly" },
      { key: "hero.stat1Value", label: "Dato 1 – valor", default: "+120" },
      { key: "hero.stat1Label", label: "Dato 1 – texto", default: "proyectos entregados" },
      { key: "hero.stat2Value", label: "Dato 2 – valor", default: "48 h" },
      { key: "hero.stat2Label", label: "Dato 2 – texto", default: "para enviarte una propuesta" },
      { key: "hero.stat3Value", label: "Dato 3 – valor", default: "1" },
      { key: "hero.stat3Label", label: "Dato 3 – texto", default: "producto propio en producción: Castorly" },
    ],
  },
  {
    id: "secciones",
    title: "Títulos de secciones",
    fields: [
      { key: "services.title", label: "Servicios – título", default: "Lo que *hacemos*" },
      {
        key: "services.subtitle",
        label: "Servicios – subtítulo",
        type: "textarea",
        default: "Seis frentes, un mismo equipo. Puedes contratarnos para uno solo o para todos.",
      },
      { key: "products.title", label: "Productos – título", default: "Productos *propios*" },
      { key: "products.subtitle", label: "Productos – subtítulo", type: "textarea", default: "Herramientas que construimos, usamos y mantenemos nosotros." },
      { key: "plans.title", label: "Planes – título", default: "Páginas web con precio *cerrado*" },
      { key: "plans.subtitle", label: "Planes – subtítulo", type: "textarea", default: "Sabes cuánto pagas antes de empezar. Hosting, dominio y SSL incluidos el primer año." },
      { key: "process.title", label: "Proceso – título", default: "Sin sorpresas, de principio a fin" },
      {
        key: "process.steps",
        label: "Proceso – pasos (uno por línea, formato: Título | Descripción)",
        type: "textarea",
        default:
          "Llamada inicial | 30 minutos para entender qué necesitas. Si no somos los indicados, te lo decimos.\nPropuesta | En 48 horas recibes alcance, precio y fechas por escrito.\nConstrucción | Cada semana te mostramos avances en un enlace que abres desde el celular.\nEntrega y soporte | Publicamos, capacitamos a tu equipo y seguimos disponibles.",
      },
      { key: "testimonials.title", label: "Testimonios – título", default: "Clientes" },
      { key: "faq.title", label: "Preguntas frecuentes – título", default: "Preguntas *frecuentes*" },
    ],
  },
  {
    id: "tecnologia",
    title: "Tecnología e integraciones",
    description: "Franja de tecnologías bajo la portada, terminal animada y diagrama de integraciones.",
    fields: [
      { key: "tech.title", label: "Título de la franja de tecnologías", default: "Con qué construimos" },
      {
        key: "tech.stack",
        label: "Tecnologías (una por línea)",
        type: "textarea",
        default: "Next.js\nReact\nReact Native\nNode.js\nPython\nPostgreSQL\nDocker\nAWS\nGoogle Cloud\nWhatsApp Business API\nOpenAI\nClaude\nn8n\nREST · Webhooks",
      },
      {
        key: "hero.terminal",
        label: "Terminal de la portada (una línea por renglón; empieza con $ para comandos y ✓ para resultados)",
        type: "textarea",
        default:
          "$ aldore new tienda-online --stack next,postgres\n✓ Proyecto creado · diseño aprobado por el cliente\n$ aldore connect erp --webhooks\n✓ 1.284 productos sincronizados\n$ aldore bot train --canal whatsapp\n✓ Bot entrenado con 312 preguntas frecuentes\n$ aldore deploy --prod\n▲ Publicado en 41 s → https://tu-empresa.co",
      },
      { key: "integrations.title", label: "Integraciones – título", default: "Tus sistemas, hablando entre sí." },
      {
        key: "integrations.text",
        label: "Integraciones – texto",
        type: "textarea",
        default: "Conectamos lo que ya usas para que un pedido, una factura o un ticket viajen solos de un sistema a otro, sin copiar y pegar.",
      },
      {
        key: "integrations.nodes",
        label: "Integraciones – sistemas del diagrama (uno por línea, máx. 8)",
        type: "textarea",
        default: "ERP\nCRM\nFacturación\nPagos\nWhatsApp\nTienda online\nCastorly\nBI",
      },
    ],
  },
  {
    id: "castorly",
    title: "Sección Castorly",
    description: "Bloque destacado de la portada y página /castorly. Los detalles del producto se editan en Productos.",
    fields: [
      { key: "castorly.badge", label: "Etiqueta", default: "Nuestra app" },
      { key: "castorly.title", label: "Título", default: "Castorly: *calma* en cada llamada" },
      {
        key: "castorly.text",
        label: "Texto",
        type: "textarea",
        default:
          "Castorly es el centro de trabajo para tu Service Desk: llamadas, tickets, base de conocimiento y Cástor, el asistente que te acompaña, todo en un solo lugar.",
      },
      { key: "castorly.cta", label: "Texto del botón", default: "Conocer Castorly" },
      { key: "castorly.url", label: "Enlace a la app", type: "url", default: "https://castorly.co" },
      { key: "castorly.urlLabel", label: "Texto del botón de la app", default: "Ir a castorly.co" },
      { key: "castorly.imageUrl", label: "Captura principal (URL)", type: "url", help: "Puede ser una ruta del sitio como /castorly/panel.png o una URL completa.", default: "" },
      { key: "castorly.mascotUrl", label: "Imagen de la mascota (el castor)", type: "url", help: "PNG o SVG con fondo transparente. Aparece junto a la captura.", default: "" },
      { key: "castorly.mascotName", label: "Nombre de la mascota", default: "Cástor" },
      {
        key: "castorly.gallery",
        label: "Galería de capturas",
        type: "textarea",
        help: "Una imagen por línea. Opcional: agrega una descripción después de una barra, por ejemplo /castorly/tickets.png | Bandeja de tickets",
        default: "",
      },
    ],
  },
  {
    id: "cta",
    title: "Llamado a la acción final",
    fields: [
      { key: "cta.title", label: "Título", default: "Cuéntanos qué *necesitas*" },
      { key: "cta.text", label: "Texto", type: "textarea", default: "Respondemos en menos de 48 horas con una propuesta concreta y sin compromiso." },
    ],
  },
  {
    id: "puerta",
    title: "Puerta by Aldore (QR / NFC)",
    description: "Sección de la portada y página /puerta. Las páginas de cada cliente se crean en Puertas.",
    fields: [
      { key: "puerta.badge", label: "Etiqueta", default: "Nuevo · Puerta by Aldore" },
      { key: "puerta.title", label: "Título", help: "Encierra una palabra entre *asteriscos* para resaltarla.", default: "Tu negocio, a *un toque*." },
      {
        key: "puerta.text",
        label: "Texto",
        type: "textarea",
        default:
          "Un sticker NFC o un código QR en cada mesa, mostrador o vitrina. Tus clientes lo tocan con el celular y ven tu carta, te dejan reseña en Google, te escriben por WhatsApp, se conectan al WiFi y conocen tus medios de pago. Sin descargar nada.",
      },
      {
        key: "puerta.uses",
        label: "Para quién (uno por línea)",
        type: "textarea",
        default: "Restaurantes y cafés\nBares y discotecas\nTiendas y almacenes\nPeluquerías y spas\nConsultorios y clínicas\nHoteles y eventos",
      },
      {
        key: "puerta.steps",
        label: "Cómo funciona (Título | texto, uno por línea)",
        type: "textarea",
        default:
          "Diseñamos tu Puerta | Con tu logo, tus colores y los botones que necesitas.\nLa ponemos en tu local | Te entregamos los QR impresos y los stickers NFC listos para pegar.\nMides y cambias cuando quieras | Ves cuántas personas la abren y cambiamos la carta o los enlaces sin reimprimir nada.",
      },
      {
        key: "puerta.plans",
        label: "Planes (Nombre | precio | nota | incluye; separado; por punto y coma)",
        type: "textarea",
        default:
          "QR | $90.000 | pago único | Página Puerta con tu marca; Hasta 6 botones; QR en alta calidad para imprimir; Cambios ilimitados el primer mes\nQR + NFC | $190.000 | pago único | Todo lo del plan QR; 10 stickers NFC personalizados; Estadísticas de visitas y toques; Instalación en Medellín y Bogotá\nMultisede | A la medida | según puntos | Varias sedes o puntos de venta; Stickers y QR por mesa o punto; Estadísticas por sede; Soporte prioritario",
      },
      { key: "puerta.cta", label: "Texto del botón", default: "Quiero mi Puerta" },
      { key: "puerta.demo", label: "Dirección de la Puerta de demostración", type: "url", default: "/p/demo", help: "Crea en Puertas una con la dirección demo para que el botón «Ver demo» funcione." },
    ],
  },
  {
    id: "menu",
    title: "Menú superior",
    description: "Enlaces de la barra de navegación del sitio.",
    fields: [
      {
        key: "nav.items",
        label: "Enlaces del menú",
        type: "textarea",
        help: "Uno por línea con el formato Texto | enlace. Ej: Castorly | /castorly",
        default: "Servicios | /#servicios\nCastorly | /castorly\nPuerta | /puerta\nPlanes | /#planes\nPreguntas | /#faq",
      },
      { key: "nav.cta", label: "Botón destacado – texto", default: "Hablemos" },
      { key: "nav.ctaUrl", label: "Botón destacado – enlace", type: "url", default: "/contacto" },
      { key: "nav.login", label: "Botón de ingreso al panel – texto (vacío = ocultarlo)", default: "Ingresar" },
    ],
  },
  {
    id: "pie",
    title: "Pie de página",
    fields: [
      { key: "footer.cta", label: "Frase grande", default: "¿Tienes un proyecto en mente?" },
      { key: "footer.ctaLink", label: "Texto del enlace de la frase", default: "Escríbenos" },
      { key: "footer.ctaUrl", label: "Enlace de la frase", type: "url", default: "/contacto" },
      { key: "footer.text", label: "Texto bajo el logo", type: "textarea", default: "Estudio de software en Bogotá. Páginas web, aplicaciones, chatbots e integraciones para empresas de Latinoamérica." },
      { key: "footer.servicesTitle", label: "Título de la columna de servicios", default: "Servicios", help: "La lista sale de la sección Servicios del panel." },
      { key: "footer.contactTitle", label: "Título de la columna de contacto", default: "Contacto", help: "Los datos salen de «Datos de contacto y redes»." },
      {
        key: "footer.links",
        label: "Enlaces extra (abajo)",
        type: "textarea",
        help: "Uno por línea: Texto | enlace. Ej: Política de privacidad | /privacidad",
        default: "",
      },
      { key: "footer.copyright", label: "Texto final (junto al ©)", default: "" },
    ],
  },
  {
    id: "contacto",
    title: "Datos de contacto y redes",
    fields: [
      { key: "contact.email", label: "Correo", default: "hola@aldore.co" },
      { key: "contact.phone", label: "Teléfono", default: "+57 300 000 0000" },
      { key: "contact.whatsapp", label: "WhatsApp (con indicativo)", default: "+573000000000" },
      { key: "contact.address", label: "Dirección / ciudad", default: "Bogotá, Colombia · Trabajo remoto en toda Latam" },
      { key: "contact.hours", label: "Horario", default: "Lunes a viernes, 8:00 a. m. – 6:00 p. m." },
      { key: "aldo.bubble", label: "Mensaje de Aldo (burbuja junto al botón de WhatsApp; vacío = sin burbuja)", default: "¡Hola! Soy Aldo 🦉 ¿Hablamos por WhatsApp?" },
      { key: "social.instagram", label: "Instagram (URL)", type: "url", default: "" },
      { key: "social.linkedin", label: "LinkedIn (URL)", type: "url", default: "" },
      { key: "social.facebook", label: "Facebook (URL)", type: "url", default: "" },
      { key: "social.x", label: "X / Twitter (URL)", type: "url", default: "" },
    ],
  },
];

export const SETTING_KEYS = new Set(SETTINGS_GROUPS.flatMap((g) => g.fields.map((f) => f.key)));

export type Settings = Record<string, string>;

export async function getSettings(): Promise<Settings> {
  const defaults: Settings = {};
  for (const g of SETTINGS_GROUPS) for (const f of g.fields) defaults[f.key] = f.default;
  const rows = await prisma.setting.findMany();
  for (const r of rows) defaults[r.key] = r.value;
  return defaults;
}
