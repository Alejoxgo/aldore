// Carga datos iniciales. Es idempotente: solo inserta contenido en tablas vacías.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

import { services, products, plans, testimonials, faqs } from "./seed-data.mjs";

async function seedIfEmpty(name, delegate, rows) {
  if ((await delegate.count()) > 0) {
    console.log(`• ${name}: ya tiene datos, se omite.`);
    return;
  }
  for (const data of rows) await delegate.create({ data });
  console.log(`✓ ${name}: ${rows.length} registros creados.`);
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@aldore.co").toLowerCase();
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
