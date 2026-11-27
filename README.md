# Aldore · Sitio web + panel de administración

Sitio web corporativo (en español) para **Aldore**, empresa de servicios TI: páginas web, aplicaciones a la medida, chatbots con IA, integraciones TI, nube/soporte, ciberseguridad y la app propia **Castorly**.

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
- **Prisma 6** con **PostgreSQL** (Supabase en producción)
- **Cloudflare Workers** vía OpenNext (también corre en Node/Docker)
- **Tailwind CSS**
- Autenticación propia: contraseñas con bcrypt, sesión en cookie `httpOnly` firmada (JWT con `jose`), middleware que protege `/admin` y `/api/admin`, y límite de intentos de login.

## Instalación local

Requisitos: Node.js 20 o superior y un PostgreSQL (local, Docker o un proyecto de Supabase).

```bash
npm install
cp .env.example .env          # edita DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL y ADMIN_PASSWORD
npm run setup                 # crea la base de datos y carga el contenido inicial
npm run dev                   # http://localhost:3000
```

Ingresa a http://localhost:3000/admin con `ADMIN_EMAIL` / `ADMIN_PASSWORD` y cambia la contraseña en **Usuarios**.

> El contenido inicial (servicios, precios, testimonios, textos de Castorly) es de ejemplo. Reemplázalo desde el panel con la información real.

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL `postgresql://…` con `?schema=aldore` (en Supabase, la del *Transaction pooler*) |
| `AUTH_SECRET` | Secreto de al menos 32 caracteres (`openssl rand -base64 48`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Primer administrador; solo se usan si no existe ningún usuario |
| `SITE_URL` | URL pública, por defecto `https://aldore.co` (SEO, sitemap) |
| `SETUP_CODE` | Código para crear el primer administrador desde `/admin/login` cuando la base está vacía |
| `INSECURE_COOKIES` | Pon `true` solo si pruebas en producción **sin HTTPS** (no recomendado) |

## Despliegue

### Opción recomendada · Cloudflare Workers + Supabase (dominio aldore.co)

El sitio corre en **Cloudflare Workers** (con [OpenNext](https://opennext.js.org/cloudflare)) y guarda los datos en **Supabase** (PostgreSQL), en un esquema propio llamado `aldore`, separado de Castorly y fuera de la API pública de Supabase.

1. **Crear las tablas en Supabase:** abre tu proyecto → **SQL Editor** → pega todo el archivo [`supabase/aldore.sql`](supabase/aldore.sql) → **Run**. Se hace una sola vez.
2. **Copiar la conexión:** Supabase → botón **Connect** → *Transaction pooler* (puerto `6543`). Copia la URI, reemplaza `[YOUR-PASSWORD]` por la contraseña de la base y agrega al final `?schema=aldore`. Ejemplo:
   `postgresql://postgres.xxxx:CLAVE@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=aldore`
3. **Conectar el repositorio en Cloudflare:** Workers & Pages → Create → Import a repository:
   - Project name: `aldore` (igual a `name` en `wrangler.jsonc`)
   - Build command: `npm run cf:build`
   - Deploy command: `npm run cf:deploy`
   - Preview command: `npx wrangler versions upload`
4. **Secretos** del Worker (Settings → Variables and Secrets, tipo *Secret*):
   - `DATABASE_URL`: la cadena del paso 2
   - `AUTH_SECRET`: texto aleatorio de 32+ caracteres
   - `SETUP_CODE`: un código que solo tú conozcas
   Después de agregarlos, vuelve a desplegar (Deployments → *Retry* o un nuevo push).
5. **Primer administrador:** abre `https://aldore.co/admin/login`. Como no hay usuarios verás «Configura tu panel»: escribe el `SETUP_CODE`, tu nombre, correo y contraseña.
6. **Dominio:** Worker → Settings → Domains & Routes → *Add* → Custom domain → `aldore.co` y `www.aldore.co`.

Probar localmente con el runtime de Cloudflare: crea `.dev.vars` con `DATABASE_URL`, `AUTH_SECRET` y `SETUP_CODE`, y ejecuta `npm run cf:preview`.

Cambios de esquema: edita `prisma/schema.prisma` y aplica el cambio en Supabase (por ejemplo con `npx prisma db push` apuntando a la URL directa, puerto 5432) o con SQL en el editor. `npm run db:sql` regenera `supabase/aldore.sql` para instalaciones nuevas.

### Opción A · VPS o servidor propio con Docker (PostgreSQL incluido)

```bash
cp .env.example .env     # define AUTH_SECRET, ADMIN_PASSWORD y DB_PASSWORD
docker compose up -d --build
```

La base de datos PostgreSQL queda en el volumen `aldore-db`, así que sobrevive a reinicios y actualizaciones. Pon delante un proxy con HTTPS (Caddy, Nginx + Certbot, Cloudflare). Ejemplo con Caddy:

```
aldore.co {
  reverse_proxy localhost:3000
}
```

Para actualizar: `git pull && docker compose up -d --build`.

### Opción B · Railway / Render / Fly.io

1. Crea el servicio desde este repositorio (detectan el `Dockerfile`).
2. Define `DATABASE_URL` (Supabase o el Postgres del proveedor, con `?schema=aldore`), `AUTH_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

### Opción C · Vercel (con PostgreSQL)

1. Define en Vercel `DATABASE_URL` (la de Postgres), `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Desde tu equipo, con esa `DATABASE_URL` en `.env`, ejecuta una vez `npm run setup` para crear las tablas y el contenido.
3. Despliega. El comando de build (`npm run build`) ya ejecuta `prisma generate`.

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
prisma/seed.mjs               Contenido inicial y usuario admin en Node (idempotente)
prisma/seed-data.mjs          Datos de ejemplo compartidos
supabase/aldore.sql           SQL para crear el esquema "aldore" en Supabase (generado con npm run db:sql)
wrangler.jsonc                Configuración del Worker de Cloudflare
src/app/(site)/               Sitio público
src/app/admin/                Login, panel y server actions del admin
src/lib/settings.ts           Lista de textos editables (agrega un campo aquí y aparece en el panel)
src/lib/resources.ts          Configuración del CRUD genérico (campos de servicios, productos, etc.)
src/components/               Componentes del sitio y del panel
```

## Identidad visual

- **Logo:** arco ojival (la «A» de Aldore y una puerta) con la entrada en bermellón. Archivos: `public/logo-mark.svg` y `src/app/icon.svg` (favicon). Componente: `src/components/Logo.tsx`.
- **Colores:** papel `#f4f1ea`, tinta `#16130f`, bermellón `#e2471c`.
- **Tipografías:** Space Grotesk (títulos), Geist (texto), JetBrains Mono (etiquetas y código) y Fraunces solo en el logotipo, servidas localmente con Fontsource.
- En los títulos editables puedes encerrar una palabra entre `*asteriscos*` para resaltarla en cursiva.

## Personalización rápida

- **Nuevo texto editable:** agrégalo en `SETTINGS_GROUPS` (`src/lib/settings.ts`) y úsalo con `s["tu.clave"]`.
- **Nuevo campo en servicios/productos:** agrégalo al modelo en `schema.prisma`, ejecuta `npm run db:push` y añádelo en `src/lib/resources.ts`.
- **Colores de marca:** `tailwind.config.ts` (`brand`, `paper`, `ink`).
