// Configuración del CRUD genérico del panel. Cada recurso = un modelo de Prisma.
import { ICON_NAMES } from "@/components/Icon";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "url" | "slug";

export type ResourceField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  rows?: number;
};

export type ResourceConfig = {
  key: string;
  model: "service" | "product" | "plan" | "testimonial" | "faq";
  label: string;
  singular: string;
  description: string;
  titleField: string;
  columns: { name: string; label: string }[];
  fields: ResourceField[];
};

const iconOptions = ICON_NAMES.map((n) => ({ value: n, label: n }));
const order: ResourceField = { name: "order", label: "Orden (menor aparece primero)", type: "number" };
const published: ResourceField = { name: "published", label: "Publicado (visible en el sitio)", type: "checkbox" };
const featuresHelp = "Una característica por línea.";

export const RESOURCES: ResourceConfig[] = [
  {
    key: "servicios",
    model: "service",
    label: "Servicios",
    singular: "servicio",
    description: "Servicios que aparecen en la portada y tienen página propia en /servicios/[slug].",
    titleField: "title",
    columns: [
      { name: "title", label: "Título" },
      { name: "slug", label: "Slug" },
      { name: "order", label: "Orden" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "slug", help: "Se genera a partir del título si lo dejas vacío." },
      { name: "icon", label: "Ícono", type: "select", options: iconOptions },
      { name: "shortDescription", label: "Descripción corta (tarjeta)", type: "textarea", rows: 2, required: true },
      { name: "description", label: "Descripción completa", type: "textarea", rows: 8, help: "Separa párrafos con una línea en blanco.", required: true },
      { name: "features", label: "Qué incluye", type: "textarea", rows: 6, help: featuresHelp },
      order,
      published,
    ],
  },
  {
    key: "productos",
    model: "product",
    label: "Productos",
    singular: "producto",
    description: "Productos propios (como Castorly). Cada uno tiene página en /productos/[slug].",
    titleField: "name",
    columns: [
      { name: "name", label: "Nombre" },
      { name: "slug", label: "Slug" },
      { name: "featured", label: "Destacado" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "slug", help: "Usa «castorly» para el producto Castorly." },
      { name: "tagline", label: "Frase corta", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", rows: 8, help: "Separa párrafos con una línea en blanco.", required: true },
      { name: "features", label: "Características", type: "textarea", rows: 6, help: featuresHelp },
      { name: "price", label: "Precio (texto libre)", type: "text", help: "Ej: Desde $49.900 COP/mes" },
      { name: "priceNote", label: "Nota del precio", type: "text" },
      { name: "ctaLabel", label: "Texto del botón", type: "text" },
      { name: "ctaUrl", label: "Enlace del botón (vacío = formulario de contacto)", type: "url" },
      { name: "imageUrl", label: "Imagen (URL)", type: "url" },
      { name: "featured", label: "Destacado en portada", type: "checkbox" },
      order,
      published,
    ],
  },
  {
    key: "planes",
    model: "plan",
    label: "Planes y precios",
    singular: "plan",
    description: "Planes de páginas web que se muestran en la sección de precios.",
    titleField: "name",
    columns: [
      { name: "name", label: "Nombre" },
      { name: "price", label: "Precio" },
      { name: "highlighted", label: "Recomendado" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "price", label: "Precio", type: "text", required: true },
      { name: "period", label: "Periodo / nota", type: "text", help: "Ej: pago único, /mes" },
      { name: "description", label: "Descripción", type: "textarea", rows: 2 },
      { name: "features", label: "Incluye", type: "textarea", rows: 6, help: featuresHelp },
      { name: "highlighted", label: "Marcar como recomendado", type: "checkbox" },
      order,
      published,
    ],
  },
  {
    key: "testimonios",
    model: "testimonial",
    label: "Testimonios",
    singular: "testimonio",
    description: "Opiniones de clientes.",
    titleField: "name",
    columns: [
      { name: "name", label: "Nombre" },
      { name: "company", label: "Empresa" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "role", label: "Cargo", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "quote", label: "Testimonio", type: "textarea", rows: 4, required: true },
      order,
      published,
    ],
  },
  {
    key: "preguntas",
    model: "faq",
    label: "Preguntas frecuentes",
    singular: "pregunta",
    description: "Preguntas y respuestas de la portada.",
    titleField: "question",
    columns: [
      { name: "question", label: "Pregunta" },
      { name: "order", label: "Orden" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "question", label: "Pregunta", type: "text", required: true },
      { name: "answer", label: "Respuesta", type: "textarea", rows: 5, required: true },
      order,
      published,
    ],
  },
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key);
}
