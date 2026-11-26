import { prisma } from "./db";

type Field = { key: string; label: string; type?: "text" | "textarea" | "url"; default: string; help?: string };
export type SettingsGroup = { id: string; title: string; description?: string; fields: Field[] };

/** Todos los textos editables del sitio. Agregar un campo aquí lo hace editable en /admin/contenido. */
export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "marca",
    title: "Marca y SEO",
    fields: [
      { key: "site.name", label: "Nombre de la empresa", default: "NexoByte" },
      { key: "site.tagline", label: "Eslogan", default: "Tecnología que conecta tu negocio" },
      { key: "seo.title", label: "Título SEO", default: "NexoByte | Desarrollo web, apps, chatbots e integraciones TI" },
      {
        key: "seo.description",
        label: "Descripción SEO",
        type: "textarea",
        default:
          "Creamos páginas web, aplicaciones, chatbots con IA e integraciones TI para empresas que quieren crecer. Conoce también Castorly.",
      },
    ],
  },
  {
    id: "hero",
    title: "Portada (Hero)",
    fields: [
      { key: "hero.badge", label: "Etiqueta superior", default: "Agencia de tecnología · Latinoamérica" },
      { key: "hero.title", label: "Título principal", default: "Construimos la tecnología que hace crecer tu negocio" },
      {
        key: "hero.subtitle",
        label: "Subtítulo",
        type: "textarea",
        default:
          "Páginas web que venden, aplicaciones a la medida, chatbots con inteligencia artificial e integraciones que conectan todos tus sistemas. Un solo equipo, de la idea a producción.",
      },
      { key: "hero.ctaPrimary", label: "Botón principal", default: "Cotiza tu proyecto" },
      { key: "hero.ctaSecondary", label: "Botón secundario", default: "Conoce Castorly" },
      { key: "hero.stat1Value", label: "Dato 1 – valor", default: "+120" },
      { key: "hero.stat1Label", label: "Dato 1 – texto", default: "proyectos entregados" },
      { key: "hero.stat2Value", label: "Dato 2 – valor", default: "24/7" },
      { key: "hero.stat2Label", label: "Dato 2 – texto", default: "soporte y monitoreo" },
      { key: "hero.stat3Value", label: "Dato 3 – valor", default: "98%" },
      { key: "hero.stat3Label", label: "Dato 3 – texto", default: "clientes satisfechos" },
    ],
  },
  {
    id: "secciones",
    title: "Títulos de secciones",
    fields: [
      { key: "services.title", label: "Servicios – título", default: "Todo lo que tu empresa necesita en TI" },
      {
        key: "services.subtitle",
        label: "Servicios – subtítulo",
        type: "textarea",
        default: "Diseñamos, desarrollamos, integramos y mantenemos. Tú te enfocas en tu negocio.",
      },
      { key: "products.title", label: "Productos – título", default: "Nuestros productos" },
      { key: "products.subtitle", label: "Productos – subtítulo", type: "textarea", default: "Software listo para usar, creado por nuestro equipo." },
      { key: "plans.title", label: "Planes – título", default: "Planes de páginas web" },
      { key: "plans.subtitle", label: "Planes – subtítulo", type: "textarea", default: "Precios claros. Sin sorpresas. Todos incluyen hosting y certificado SSL el primer año." },
      { key: "process.title", label: "Proceso – título", default: "Así trabajamos" },
      {
        key: "process.steps",
        label: "Proceso – pasos (uno por línea, formato: Título | Descripción)",
        type: "textarea",
        default:
          "Descubrimiento | Entendemos tu negocio, tus objetivos y tus usuarios.\nDiseño | Prototipos y diseño visual que puedes ver antes de construir.\nDesarrollo | Sprints cortos con entregas que pruebas cada semana.\nLanzamiento y soporte | Publicamos, medimos y seguimos mejorando contigo.",
      },
      { key: "testimonials.title", label: "Testimonios – título", default: "Lo que dicen nuestros clientes" },
      { key: "faq.title", label: "Preguntas frecuentes – título", default: "Preguntas frecuentes" },
    ],
  },
  {
    id: "castorly",
    title: "Sección Castorly",
    description: "Bloque destacado de la portada y página /castorly. Los detalles del producto se editan en Productos.",
    fields: [
      { key: "castorly.badge", label: "Etiqueta", default: "Nuestra app" },
      { key: "castorly.title", label: "Título", default: "Castorly: la app que organiza tu operación" },
      {
        key: "castorly.text",
        label: "Texto",
        type: "textarea",
        default:
          "Castorly es nuestra aplicación propia para que tu equipo trabaje mejor: centraliza la información, automatiza tareas repetitivas y te da visibilidad en tiempo real desde el celular o el computador.",
      },
      { key: "castorly.cta", label: "Texto del botón", default: "Descubre Castorly" },
      { key: "castorly.url", label: "Enlace externo de la app (opcional)", type: "url", default: "" },
      { key: "castorly.imageUrl", label: "Imagen / captura (URL, opcional)", type: "url", default: "" },
    ],
  },
  {
    id: "cta",
    title: "Llamado a la acción final",
    fields: [
      { key: "cta.title", label: "Título", default: "¿Tienes una idea? Hagámosla realidad." },
      { key: "cta.text", label: "Texto", type: "textarea", default: "Cuéntanos tu proyecto y te enviamos una propuesta sin costo en menos de 48 horas." },
    ],
  },
  {
    id: "contacto",
    title: "Datos de contacto y redes",
    fields: [
      { key: "contact.email", label: "Correo", default: "hola@nexobyte.co" },
      { key: "contact.phone", label: "Teléfono", default: "+57 300 000 0000" },
      { key: "contact.whatsapp", label: "WhatsApp (con indicativo)", default: "+573000000000" },
      { key: "contact.address", label: "Dirección / ciudad", default: "Bogotá, Colombia · Trabajo remoto en toda Latam" },
      { key: "contact.hours", label: "Horario", default: "Lunes a viernes, 8:00 a. m. – 6:00 p. m." },
      { key: "social.instagram", label: "Instagram (URL)", type: "url", default: "" },
      { key: "social.linkedin", label: "LinkedIn (URL)", type: "url", default: "" },
      { key: "social.facebook", label: "Facebook (URL)", type: "url", default: "" },
      { key: "social.x", label: "X / Twitter (URL)", type: "url", default: "" },
      { key: "footer.text", label: "Texto del pie de página", type: "textarea", default: "Desarrollo web, aplicaciones, chatbots e integraciones TI para empresas que quieren crecer." },
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
