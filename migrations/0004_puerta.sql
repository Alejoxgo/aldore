-- CreateTable
CREATE TABLE IF NOT EXISTS "LinkPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#e2471c',
    "theme" TEXT NOT NULL DEFAULT 'oscuro',
    "buttons" TEXT NOT NULL DEFAULT '',
    "wifiName" TEXT NOT NULL DEFAULT '',
    "wifiPass" TEXT NOT NULL DEFAULT '',
    "clientId" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "LinkPage_slug_key" ON "LinkPage"("slug");


-- Puerta de demostración (aldore.co/p/demo)
INSERT OR IGNORE INTO "LinkPage" ("slug", "name", "subtitle", "color", "theme", "buttons", "wifiName", "wifiPass") VALUES ('demo', 'La Esquina Café', 'Sabaneta · Café de origen', '#e2471c', 'oscuro', 'carta | Nuestra carta | Mira lo que tenemos hoy | https://aldore.co
resena | ¿Cómo te fue hoy? | Déjanos tu reseña en Google | https://aldore.co
whatsapp | Escríbenos por WhatsApp | Pedidos y reservas | +573000000000
wifi | Conéctate a nuestro WiFi | Toca para ver la clave | wifi
pago | Métodos de pago | Nequi, Daviplata y tarjetas | https://aldore.co', 'LaEsquina_Clientes', 'cafecito2026');
