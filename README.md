# Nodara · Sitio web + panel de administración

Sitio web corporativo (en español) para **Nodara**, empresa de servicios TI: páginas web, aplicaciones a la medida, chatbots con IA, integraciones TI, nube/soporte, ciberseguridad y la app propia **Castorly**.

Todo el contenido es administrable desde `/admin` (protegido con usuario y contraseña).

## Qué incluye

**Sitio público**
- Portada: hero, servicios, bloque destacado de Castorly, productos, proceso de trabajo, planes y precios, testimonios, preguntas frecuentes y formulario de contacto.
- Página propia por servicio (`/servicios/[slug]`) y por producto (`/productos/[slug]`). `/castorly` lleva a la página del producto Castorly.
- Página `/contacto`, botón flotante de WhatsApp, SEO básico (títulos, descripción, Open Graph, `robots.txt`) y diseño responsive.

**Panel admin (`/admin`)**
| Sección | Qué puedes hacer |
|---|---|
| Resumen | Conteos y últimos contactos |
| Leads / contactos | Ver mensajes del formulario, buscar, filtrar, cambiar estado (nuevo → contactado → en negociación → ganado/perdido), notas internas, abrir WhatsApp, exportar CSV |
| Textos del sitio | Nombre de la marca, SEO, hero, títulos de secciones, pasos del proceso, sección Castorly, datos de contacto, redes sociales, pie de página |
| Servicios / Productos / Planes / Testimonios / Preguntas | Crear, editar, ordenar, ocultar/publicar y eliminar |
| Usuarios | Crear y eliminar administradores, cambiar tu contraseña |

Los cambios se ven en el sitio de inmediato.

## Stack

- **Next.js 15** (App Router, Server Actions) + **React 19** + **TypeScript**
- **Prisma 6** con **SQLite** (cambiable a PostgreSQL)
- **Tailwind CSS**
- Autenticación propia: contraseñas con bcrypt, sesión en cookie `httpOnly` firmada (JWT con `jose`), middleware que protege `/admin` y `/api/admin`, y límite de intentos de login.

## Instalación local

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env          # edita AUTH_SECRET, ADMIN_EMAIL y ADMIN_PASSWORD
npm run setup                 # crea la base de datos y carga el contenido inicial
npm run dev                   # http://localhost:3000
```

Ingresa a http://localhost:3000/admin con `ADMIN_EMAIL` / `ADMIN_PASSWORD` y cambia la contraseña en **Usuarios**.

> El contenido inicial (servicios, precios, testimonios, textos de Castorly) es de ejemplo. Reemplázalo desde el panel con la información real.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | `file:./dev.db` para SQLite o una URL `postgresql://…` |
| `AUTH_SECRET` | Secreto de al menos 32 caracteres (`openssl rand -base64 48`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Primer administrador; solo se usan si no existe ningún usuario |
| `INSECURE_COOKIES` | Pon `true` solo si pruebas en producción **sin HTTPS** (no recomendado) |

## Despliegue

### Opción A · VPS o servidor propio con Docker (recomendada con SQLite)

```bash
cp .env.example .env     # define AUTH_SECRET y ADMIN_PASSWORD
docker compose up -d --build
```

La base de datos queda en el volumen `nodara-data`, así que sobrevive a reinicios y actualizaciones. Pon delante un proxy con HTTPS (Caddy, Nginx + Certbot, Cloudflare). Ejemplo con Caddy:

```
nodara.co {
  reverse_proxy localhost:3000
}
```

Para actualizar: `git pull && docker compose up -d --build`.

### Opción B · Railway / Render / Fly.io

1. Crea el servicio desde este repositorio (detectan el `Dockerfile`).
2. Agrega un **volumen persistente** montado en `/data` y define `DATABASE_URL=file:/data/nodara.db`.
3. Define `AUTH_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

### Opción C · Vercel (con PostgreSQL)

Vercel no tiene disco persistente, así que usa PostgreSQL (Neon, Supabase, Vercel Postgres):

1. En `prisma/schema.prisma` cambia `provider = "sqlite"` por `provider = "postgresql"`.
2. Define en Vercel `DATABASE_URL` (la de Postgres), `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. Desde tu equipo, con esa `DATABASE_URL` en `.env`, ejecuta una vez `npm run setup` para crear las tablas y el contenido.
4. Despliega. El comando de build (`npm run build`) ya ejecuta `prisma generate`.

### Servidor Node sin Docker

```bash
npm ci
npm run setup
npm run build
PORT=3000 npm start      # usa pm2 o systemd para mantenerlo arriba
```

## Estructura

```
prisma/schema.prisma          Modelos: User, Service, Product, Plan, Testimonial, Faq, Setting, Lead
prisma/seed.mjs               Contenido inicial y usuario admin (idempotente)
src/app/(site)/               Sitio público
src/app/admin/                Login, panel y server actions del admin
src/lib/settings.ts           Lista de textos editables (agrega un campo aquí y aparece en el panel)
src/lib/resources.ts          Configuración del CRUD genérico (campos de servicios, productos, etc.)
src/components/               Componentes del sitio y del panel
```

## Personalización rápida

- **Nuevo texto editable:** agrégalo en `SETTINGS_GROUPS` (`src/lib/settings.ts`) y úsalo con `s["tu.clave"]`.
- **Nuevo campo en servicios/productos:** agrégalo al modelo en `schema.prisma`, ejecuta `npm run db:push` y añádelo en `src/lib/resources.ts`.
- **Colores de marca:** `tailwind.config.ts` (`brand`, `accent`, `ink`).
