// Configuración del CRUD genérico del panel. Cada recurso = un modelo de Prisma.
import { ICON_NAMES } from "@/components/Icon";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "url" | "slug" | "money" | "date" | "month" | "relation" | "email";

export type ResourceField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  /** Para type "relation": modelo relacionado y campo que se muestra. */
  relation?: { model: RelatedModel; labelField: string; where?: Record<string, unknown> };
  /** Ocupa media fila en el formulario. */
  half?: boolean;
};

type RelatedModel = "client" | "employee";

export type ColumnFormat = "money" | "status" | "relation" | "bool" | "date";

export type ResourceConfig = {
  key: string;
  model: "service" | "product" | "plan" | "testimonial" | "faq" | "client" | "order" | "employee" | "payroll" | "staffRequest";
  label: string;
  singular: string;
  description: string;
  titleField: string;
  columns: { name: string; label: string; format?: ColumnFormat }[];
  fields: ResourceField[];
  /** Orden del listado. Por defecto: campo "order" y luego id. */
  sort?: Record<string, "asc" | "desc">[];
  /** Campo de estado para filtrar el listado y pintar etiquetas. */
  statusField?: string;
  /** Columnas de dinero que se suman al pie del listado. */
  totals?: string[];
  /** Ajusta los datos antes de guardar (cálculos, valores por defecto). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeSave?: (data: Record<string, any>) => Promise<void> | void;
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

/* ---------------- Gestión del negocio ---------------- */

const opts = (...xs: [string, string][]) => xs.map(([value, label]) => ({ value, label }));

export const ORDER_STATUSES = opts(
  ["cotizacion", "Cotización"],
  ["aprobado", "Aprobado"],
  ["en_progreso", "En progreso"],
  ["entregado", "Entregado"],
  ["pagado", "Pagado"],
  ["cancelado", "Cancelado"],
);
export const PAYROLL_STATUSES = opts(["pendiente", "Pendiente"], ["pagado", "Pagado"]);
export const REQUEST_STATUSES = opts(["pendiente", "Pendiente"], ["aprobada", "Aprobada"], ["rechazada", "Rechazada"]);
export const REQUEST_TYPES = opts(
  ["vacaciones", "Vacaciones"],
  ["permiso", "Permiso"],
  ["incapacidad", "Incapacidad"],
  ["compra", "Compra o gasto"],
  ["equipo", "Equipo o acceso"],
  ["otro", "Otro"],
);
export const CONTRACT_TYPES = opts(
  ["indefinido", "Término indefinido"],
  ["fijo", "Término fijo"],
  ["prestacion", "Prestación de servicios"],
  ["aprendiz", "Aprendiz / practicante"],
);

/** Color de la etiqueta según el valor del estado. */
export const STATUS_COLORS: Record<string, string> = {
  cotizacion: "bg-slate-200 text-slate-700",
  aprobado: "bg-sky-100 text-sky-700",
  en_progreso: "bg-amber-100 text-amber-800",
  entregado: "bg-violet-100 text-violet-700",
  pagado: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-700",
  pendiente: "bg-amber-100 text-amber-800",
  aprobada: "bg-emerald-100 text-emerald-700",
  rechazada: "bg-red-100 text-red-700",
};

export const BUSINESS_RESOURCES: ResourceConfig[] = [
  {
    key: "pedidos",
    model: "order",
    label: "Pedidos",
    singular: "pedido",
    description: "Proyectos y ventas: cotizaciones, trabajos en curso, entregas y pagos.",
    titleField: "title",
    sort: [{ createdAt: "desc" }],
    statusField: "status",
    totals: ["amount", "paid"],
    columns: [
      { name: "title", label: "Pedido" },
      { name: "clientId", label: "Cliente", format: "relation" },
      { name: "status", label: "Estado", format: "status" },
      { name: "amount", label: "Valor", format: "money" },
      { name: "paid", label: "Pagado", format: "money" },
      { name: "dueDate", label: "Entrega", format: "date" },
    ],
    fields: [
      { name: "title", label: "Nombre del pedido", type: "text", required: true, help: "Ej: Página web corporativa, Chatbot de WhatsApp" },
      { name: "clientId", label: "Cliente", type: "relation", relation: { model: "client", labelField: "name" }, half: true },
      { name: "service", label: "Servicio", type: "text", half: true },
      { name: "status", label: "Estado", type: "select", options: ORDER_STATUSES, half: true },
      { name: "amount", label: "Valor total (COP)", type: "money", half: true },
      { name: "paid", label: "Pagado hasta hoy (COP)", type: "money", half: true },
      { name: "startDate", label: "Fecha de inicio", type: "date", half: true },
      { name: "dueDate", label: "Fecha de entrega", type: "date", half: true },
      { name: "notes", label: "Notas", type: "textarea", rows: 4 },
    ],
  },
  {
    key: "clientes",
    model: "client",
    label: "Clientes",
    singular: "cliente",
    description: "Empresas y personas a las que les vendes.",
    titleField: "name",
    sort: [{ name: "asc" }],
    columns: [
      { name: "name", label: "Nombre" },
      { name: "company", label: "Empresa" },
      { name: "email", label: "Correo" },
      { name: "phone", label: "Teléfono" },
    ],
    fields: [
      { name: "name", label: "Nombre de contacto", type: "text", required: true, half: true },
      { name: "company", label: "Empresa", type: "text", half: true },
      { name: "taxId", label: "NIT / Cédula", type: "text", half: true },
      { name: "city", label: "Ciudad", type: "text", half: true },
      { name: "email", label: "Correo", type: "email", half: true },
      { name: "phone", label: "Teléfono / WhatsApp", type: "text", half: true },
      { name: "notes", label: "Notas", type: "textarea", rows: 4 },
    ],
  },
  {
    key: "empleados",
    model: "employee",
    label: "Empleados",
    singular: "empleado",
    description: "Tu equipo: datos de contacto, cargo, contrato y salario.",
    titleField: "name",
    sort: [{ active: "desc" }, { name: "asc" }],
    totals: ["salary"],
    columns: [
      { name: "name", label: "Nombre" },
      { name: "position", label: "Cargo" },
      { name: "salary", label: "Salario", format: "money" },
      { name: "startDate", label: "Ingreso", format: "date" },
      { name: "active", label: "Activo", format: "bool" },
    ],
    fields: [
      { name: "name", label: "Nombre completo", type: "text", required: true, half: true },
      { name: "document", label: "Cédula", type: "text", half: true },
      { name: "email", label: "Correo", type: "email", half: true },
      { name: "phone", label: "Teléfono", type: "text", half: true },
      { name: "position", label: "Cargo", type: "text", half: true },
      { name: "contractType", label: "Tipo de contrato", type: "select", options: CONTRACT_TYPES, half: true },
      { name: "salary", label: "Salario mensual (COP)", type: "money", half: true },
      { name: "startDate", label: "Fecha de ingreso", type: "date", half: true },
      { name: "bank", label: "Banco", type: "text", half: true },
      { name: "bankAccount", label: "Número de cuenta", type: "text", half: true },
      { name: "notes", label: "Notas", type: "textarea", rows: 3 },
      { name: "active", label: "Empleado activo", type: "checkbox" },
    ],
  },
  {
    key: "nomina",
    model: "payroll",
    label: "Nómina",
    singular: "pago de nómina",
    description: "Pagos mensuales a cada empleado. El neto se calcula solo: salario + bonos − deducciones.",
    titleField: "period",
    sort: [{ period: "desc" }, { id: "asc" }],
    statusField: "status",
    totals: ["baseSalary", "bonuses", "deductions", "net"],
    columns: [
      { name: "period", label: "Periodo" },
      { name: "employeeId", label: "Empleado", format: "relation" },
      { name: "baseSalary", label: "Salario", format: "money" },
      { name: "bonuses", label: "Bonos", format: "money" },
      { name: "deductions", label: "Deducciones", format: "money" },
      { name: "net", label: "Neto", format: "money" },
      { name: "status", label: "Estado", format: "status" },
    ],
    fields: [
      { name: "employeeId", label: "Empleado", type: "relation", required: true, relation: { model: "employee", labelField: "name" }, half: true },
      { name: "period", label: "Periodo", type: "month", required: true, half: true },
      { name: "baseSalary", label: "Salario base (COP)", type: "money", half: true, help: "Si lo dejas en 0 se usa el salario del empleado." },
      { name: "bonuses", label: "Bonos, horas extra, comisiones", type: "money", half: true },
      { name: "deductions", label: "Deducciones (salud, pensión, préstamos)", type: "money", half: true },
      { name: "status", label: "Estado", type: "select", options: PAYROLL_STATUSES, half: true },
      { name: "paidDate", label: "Fecha de pago", type: "date", half: true },
      { name: "notes", label: "Notas", type: "textarea", rows: 3 },
    ],
    async beforeSave(data) {
      if (!data.baseSalary && data.employeeId) {
        const { prisma } = await import("./db");
        const emp = await prisma.employee.findUnique({ where: { id: data.employeeId } });
        data.baseSalary = emp?.salary ?? 0;
      }
      data.net = (data.baseSalary || 0) + (data.bonuses || 0) - (data.deductions || 0);
      if (data.status === "pagado" && !data.paidDate) data.paidDate = new Date().toISOString().slice(0, 10);
    },
  },
  {
    key: "solicitudes",
    model: "staffRequest",
    label: "Solicitudes internas",
    singular: "solicitud",
    description: "Vacaciones, permisos, incapacidades, compras y otras solicitudes de tu equipo.",
    titleField: "title",
    sort: [{ createdAt: "desc" }],
    statusField: "status",
    columns: [
      { name: "title", label: "Solicitud" },
      { name: "employeeId", label: "Empleado", format: "relation" },
      { name: "type", label: "Tipo" },
      { name: "startDate", label: "Desde", format: "date" },
      { name: "endDate", label: "Hasta", format: "date" },
      { name: "status", label: "Estado", format: "status" },
    ],
    fields: [
      { name: "title", label: "Asunto", type: "text", required: true },
      { name: "employeeId", label: "Empleado", type: "relation", relation: { model: "employee", labelField: "name" }, half: true },
      { name: "type", label: "Tipo", type: "select", options: REQUEST_TYPES, half: true },
      { name: "startDate", label: "Desde", type: "date", half: true },
      { name: "endDate", label: "Hasta", type: "date", half: true },
      { name: "status", label: "Estado", type: "select", options: REQUEST_STATUSES, half: true },
      { name: "description", label: "Detalle", type: "textarea", rows: 4 },
    ],
  },
];

RESOURCES.push(...BUSINESS_RESOURCES);

/** Etiqueta legible de un valor de select (estado, tipo…). */
export function optionLabel(res: ResourceConfig, field: string, value: string) {
  return res.fields.find((f) => f.name === field)?.options?.find((o) => o.value === value)?.label ?? value;
}

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key);
}
