-- Contenido inicial de ejemplo (editable luego desde el panel).
INSERT INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('desarrollo-web', 'Páginas web y tiendas online', 'code', 'Sitios rápidos, modernos y optimizados para Google que convierten visitas en clientes.', 'Diseñamos y desarrollamos páginas web corporativas, landing pages y tiendas online pensadas para vender. Cada sitio es rápido, se ve perfecto en el celular y está optimizado para aparecer en Google.

Incluimos panel de administración para que actualices tu contenido sin depender de nadie, integración con WhatsApp, analítica y pasarelas de pago.', 'Diseño a la medida y responsive
SEO técnico y velocidad
Panel autoadministrable
Tiendas online con pagos en línea
Hosting, dominio y certificado SSL
Integración con WhatsApp y redes', 0, CURRENT_TIMESTAMP);
INSERT INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('aplicaciones', 'Aplicaciones a la medida', 'smartphone', 'Apps móviles y web que digitalizan tus procesos y escalan con tu negocio.', 'Construimos aplicaciones móviles (iOS y Android) y plataformas web a la medida: sistemas internos, portales de clientes, marketplaces, apps de reservas y mucho más.

Trabajamos con metodologías ágiles y entregas semanales para que veas avances reales desde el primer sprint.', 'Apps iOS y Android
Plataformas web y SaaS
Diseño UX/UI
Arquitectura en la nube escalable
Mantenimiento y evolución continua', 1, CURRENT_TIMESTAMP);
INSERT INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('chatbots', 'Chatbots con inteligencia artificial', 'bot', 'Asistentes 24/7 en WhatsApp, web e Instagram que atienden, venden y agendan por ti.', 'Creamos chatbots con IA que entienden lenguaje natural, responden preguntas frecuentes, califican prospectos, toman pedidos y agendan citas, en WhatsApp, tu sitio web, Instagram o Messenger.

Los entrenamos con la información de tu negocio y los conectamos a tu CRM o sistemas internos para que la conversación termine en una venta.', 'WhatsApp Business API
IA entrenada con tus datos
Agendamiento y pedidos automáticos
Traspaso a un asesor humano
Reportes de conversaciones', 2, CURRENT_TIMESTAMP);
INSERT INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('integraciones-ti', 'Integraciones TI y automatización', 'plug', 'Conectamos tu ERP, CRM, facturación, pagos y apps para que la información fluya sola.', 'Integramos los sistemas que ya usas (ERP, CRM, facturación electrónica, pasarelas de pago, e-commerce, hojas de cálculo) mediante APIs y automatizaciones.

Eliminamos la doble digitación, reducimos errores y te damos datos confiables en tiempo real.', 'APIs REST y webhooks
Facturación electrónica
Automatización de procesos
Sincronización de inventarios y pedidos
Tableros de indicadores', 3, CURRENT_TIMESTAMP);
INSERT INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('nube-y-soporte', 'Nube, infraestructura y soporte', 'cloud', 'Migración a la nube, servidores, copias de seguridad y soporte técnico para tu equipo.', 'Administramos tu infraestructura en la nube (AWS, Google Cloud, Azure), configuramos correos corporativos, copias de seguridad y monitoreo 24/7.

Además ofrecemos soporte técnico para tu equipo de trabajo con tiempos de respuesta garantizados.', 'Migración a la nube
Correo corporativo
Backups automáticos
Monitoreo 24/7
Mesa de ayuda', 4, CURRENT_TIMESTAMP);
INSERT INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('ciberseguridad', 'Ciberseguridad y consultoría TI', 'shield', 'Protegemos tu información y te acompañamos en la transformación digital.', 'Evaluamos la seguridad de tus sistemas, implementamos buenas prácticas y te ayudamos a cumplir la normativa de protección de datos.

También te acompañamos con consultoría para definir la hoja de ruta tecnológica de tu empresa.', 'Auditorías de seguridad
Protección de datos personales
Políticas y capacitación
Hoja de ruta de transformación digital', 5, CURRENT_TIMESTAMP);
INSERT INTO "Product" ("slug", "name", "tagline", "description", "features", "price", "priceNote", "ctaLabel", "ctaUrl", "featured", "order", "updatedAt") VALUES ('castorly', 'Castorly', 'Calma en cada llamada.', 'Castorly es tu centro de trabajo para el Service Desk: llamadas, tickets, conocimiento y Cástor, en un solo lugar.

Cástor es el asistente integrado que te acompaña mientras atiendes llamadas, gestionas tickets y consultas artículos, para que tu equipo resuelva más rápido y con menos estrés.

Las cuentas las aprueba el administrador de cada organización y el acceso está protegido con conexión segura y verificación en dos pasos.', 'Llamadas del Service Desk en un solo lugar
Gestión de tickets
Base de conocimiento y artículos
Cástor, asistente que te acompaña en cada caso
Verificación en dos pasos
Cuentas aprobadas por el administrador', '', '', 'Solicitar acceso', 'https://castorly.co/register', 1, 0, CURRENT_TIMESTAMP);
INSERT INTO "Product" ("slug", "name", "tagline", "description", "features", "price", "priceNote", "ctaLabel", "order", "updatedAt") VALUES ('aldore-bot', 'Aldore Bot', 'Chatbot de WhatsApp listo en 7 días.', 'Un asistente virtual con IA que atiende a tus clientes en WhatsApp las 24 horas, responde preguntas frecuentes, toma pedidos y agenda citas.

Incluye configuración, entrenamiento con la información de tu negocio y panel de conversaciones.', 'WhatsApp oficial
Respuestas con IA
Agenda y pedidos
Panel de conversaciones', 'Desde $290.000 COP/mes', 'Implementación incluida', 'Quiero mi chatbot', 1, CURRENT_TIMESTAMP);
INSERT INTO "Product" ("slug", "name", "tagline", "description", "features", "price", "priceNote", "ctaLabel", "order", "updatedAt") VALUES ('aldore-web', 'Aldore Web', 'Tu página web autoadministrable, lista en 10 días.', 'Una página web profesional con panel de administración, hosting, dominio y certificado SSL incluidos. Ideal para pymes y emprendedores que necesitan presencia digital rápida y efectiva.', 'Diseño profesional
Panel administrable
Hosting y dominio
Formulario de contacto y WhatsApp', 'Desde $1.200.000 COP', 'Pago único', 'Cotizar', 2, CURRENT_TIMESTAMP);
INSERT INTO "Plan" ("name", "price", "period", "description", "features", "order", "updatedAt") VALUES ('Emprendedor', '$1.200.000', 'COP · pago único', 'Para empezar con presencia digital profesional.', 'Landing page de 1 página
Diseño responsive
Formulario y botón de WhatsApp
Hosting y dominio por 1 año
Certificado SSL', 0, CURRENT_TIMESTAMP);
INSERT INTO "Plan" ("name", "price", "period", "description", "features", "highlighted", "order", "updatedAt") VALUES ('Empresarial', '$3.500.000', 'COP · pago único', 'Sitio completo y autoadministrable.', 'Hasta 8 secciones
Panel de administración
Blog y SEO on-page
Integración con Google Analytics
Hosting y dominio por 1 año
3 meses de soporte', 1, 1, CURRENT_TIMESTAMP);
INSERT INTO "Plan" ("name", "price", "period", "description", "features", "order", "updatedAt") VALUES ('E-commerce', '$6.900.000', 'COP · desde', 'Tienda online lista para vender.', 'Catálogo ilimitado
Pasarela de pagos
Gestión de inventario y pedidos
Integración con facturación electrónica
Capacitación del equipo
6 meses de soporte', 2, CURRENT_TIMESTAMP);
INSERT INTO "Testimonial" ("name", "role", "company", "quote", "order", "updatedAt") VALUES ('Laura Gómez', 'Gerente', 'Distribuidora Andina', 'Integraron nuestro ERP con la tienda online y dejamos de digitar pedidos a mano. Ahorramos horas cada semana.', 0, CURRENT_TIMESTAMP);
INSERT INTO "Testimonial" ("name", "role", "company", "quote", "order", "updatedAt") VALUES ('Carlos Restrepo', 'Fundador', 'Clínica Dental Sonríe', 'El chatbot agenda citas por WhatsApp incluso de madrugada. Nuestra agenda nunca había estado tan llena.', 1, CURRENT_TIMESTAMP);
INSERT INTO "Testimonial" ("name", "role", "company", "quote", "order", "updatedAt") VALUES ('Andrea Martínez', 'Directora comercial', 'Grupo Inmobiliario Altos', 'La nueva página web se ve espectacular y la podemos actualizar nosotros mismos. Los leads se duplicaron.', 2, CURRENT_TIMESTAMP);
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Cuánto tiempo toma desarrollar una página web?', 'Una landing page está lista en 7 a 10 días hábiles. Un sitio corporativo completo toma de 3 a 5 semanas, y una tienda online de 4 a 8 semanas, según el alcance.', 0, CURRENT_TIMESTAMP);
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Puedo editar mi página yo mismo?', 'Sí. Todos nuestros sitios incluyen un panel de administración sencillo para que cambies textos, imágenes, productos y precios sin conocimientos técnicos.', 1, CURRENT_TIMESTAMP);
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Qué es Castorly?', 'Es nuestra plataforma para equipos de Service Desk: reúne llamadas, tickets, base de conocimiento y a Cástor, un asistente que te acompaña en cada caso. Puedes solicitar acceso en castorly.co.', 2, CURRENT_TIMESTAMP);
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Trabajan con empresas fuera de mi ciudad?', 'Sí, trabajamos 100 % remoto con clientes en toda Latinoamérica y coordinamos reuniones por videollamada.', 3, CURRENT_TIMESTAMP);
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Ofrecen soporte después de la entrega?', 'Todos los proyectos incluyen un periodo de soporte y garantía. Además ofrecemos planes de mantenimiento mensual.', 4, CURRENT_TIMESTAMP);
