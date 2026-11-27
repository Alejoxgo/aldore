-- Servicios nuevos (si ya existen con ese slug, no se tocan)
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('carta-digital', 'Carta digital con pedidos a la mesa', 'cart', 'Tus clientes ven la carta y piden desde el QR de la mesa. El pedido te llega al instante.', 'Llevamos tu carta al celular de tus clientes: escanean el QR o acercan el celular al sticker NFC de la mesa, ven fotos y precios actualizados y hacen el pedido sin esperar al mesero.

Los pedidos llegan a una pantalla en cocina o caja y a tu WhatsApp. Cambias precios y platos agotados desde tu panel, sin reimprimir nada.', 'Carta con fotos y precios siempre al día
Pedidos desde la mesa por QR o NFC
Aviso a cocina, caja y WhatsApp
Platos agotados con un clic
Estadísticas de lo que más se vende', 6, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('tarjetas-nfc', 'Tarjetas de presentación NFC', 'smartphone', 'Una tarjeta que se acerca al celular y guarda tu contacto. Para todo tu equipo.', 'Tarjetas físicas con chip NFC y QR, con el diseño de tu empresa. Al acercarlas al celular abren el perfil de la persona: datos de contacto, WhatsApp, redes y un botón para guardarlo en la agenda.

Si alguien cambia de cargo o de número, se actualiza el perfil y la tarjeta sigue sirviendo.', 'Tarjeta física con NFC y QR
Perfil digital por empleado
Guardar contacto con un toque
Cambios sin reimprimir
Paquetes para equipos', 7, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('fidelizacion', 'Tarjeta de fidelización digital', 'sparkles', 'El clásico «la 10ª es gratis», pero en el celular. Sin tarjetas de papel que se pierden.', 'Tus clientes acumulan sellos escaneando un QR en caja y reclaman su premio cuando completan la tarjeta. Tú ves quién vuelve, cada cuánto y puedes enviarles promociones por WhatsApp.

Ideal para cafés, heladerías, panaderías, lavaderos y peluquerías.', 'Sellos con QR en caja
Premios configurables
Base de clientes que vuelven
Promociones por WhatsApp
Sin app que descargar', 8, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('resenas-google', 'Más reseñas en Google', 'chart', 'Stickers y tarjetas NFC que llevan directo a dejar la reseña de tu negocio en Google.', 'La mayoría de clientes felices no deja reseña porque le da pereza buscarte. Con un sticker NFC o un QR en la mesa o el mostrador, llegan directo al formulario de reseña de tu perfil de Google en un toque.

Más reseñas reales significan aparecer más arriba en Google Maps cuando alguien busca lo que vendes cerca.', 'Stickers y tarjetas NFC con QR
Enlace directo a tu reseña de Google
Material con tu marca
Conteo de toques
Cumple las políticas de Google', 9, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('mantenimiento-web', 'Plan de mantenimiento web', 'support', 'Hosting, dominio, copias de seguridad y cambios mensuales por una cuota fija.', 'Tu página siempre al día y sin preocupaciones: nos encargamos del hosting, el dominio, el certificado de seguridad, las copias de seguridad y las actualizaciones.

Cada mes incluye horas de cambios: nuevos productos, textos, fotos o secciones. Nos escribes por WhatsApp y lo hacemos.', 'Hosting, dominio y SSL
Copias de seguridad diarias
Horas de cambios cada mes
Monitoreo de caídas
Soporte por WhatsApp', 10, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('impresion-3d', 'Impresión 3D', 'cube', 'Piezas, prototipos y productos con tu marca, impresos en 3D. Desde una unidad.', 'Imprimimos en 3D lo que tu negocio necesite: prototipos de producto, repuestos y piezas a la medida, exhibidores, llaveros y regalos corporativos con tu logo.

También hacemos los soportes de mesa para tu Puerta by Aldore: porta QR y porta NFC con la forma y los colores de tu marca. Si no tienes el diseño, lo modelamos contigo.', 'Prototipos y piezas a la medida
Soportes de mesa para QR y NFC
Merchandising y regalos con tu logo
Modelado 3D si no tienes el diseño
Desde una unidad hasta producción por lotes', 11, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('agenda-online', 'Agenda online con recordatorios', 'calendar', 'Tus clientes reservan solos, a cualquier hora, y les llega el recordatorio por WhatsApp.', 'Una página de reservas con tus servicios, horarios y profesionales. El cliente elige el día y la hora, y la cita queda en tu agenda sin llamadas ni mensajes de ida y vuelta.

Un día antes y una hora antes le llega el recordatorio por WhatsApp, con opción de confirmar o reprogramar. Menos citas perdidas, más tiempo para atender.', 'Reservas 24/7 desde el celular
Recordatorios por WhatsApp
Varios profesionales y sedes
Confirmar o reprogramar con un toque
Ideal para peluquerías, consultorios y spas', 12, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('catalogo-whatsapp', 'Catálogo con pedidos por WhatsApp', 'cart', 'Una tienda sencilla: el cliente arma su pedido y te llega listo a WhatsApp.', 'Tu catálogo de productos en una página rápida, con fotos, precios y categorías. El cliente agrega lo que quiere al carrito y el pedido te llega a WhatsApp ya armado, con cantidades, total y dirección.

Sin pasarela de pago ni comisiones por venta. Perfecto para empezar a vender en línea sin complicarte.', 'Catálogo con fotos y precios
Pedido completo directo a WhatsApp
Sin comisiones por venta
Cambias productos desde tu panel
Listo en pocos días', 13, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('facturacion-electronica', 'Facturación electrónica conectada', 'receipt', 'Conectamos tu tienda, POS o sistema con Siigo o Alegra para que la factura salga sola.', 'Cada venta debe tener su factura electrónica ante la DIAN, y hacerla a mano quita tiempo y genera errores. Conectamos tu tienda online, tu punto de venta o tu sistema con tu software de facturación (Siigo, Alegra u otros) para que la factura se genere y se envíe automáticamente.

También sincronizamos clientes, productos e inventario para que todo cuadre.', 'Integración con Siigo, Alegra y otros
Factura automática por cada venta
Sincronización de clientes e inventario
Menos errores y menos digitación
Acompañamiento en la puesta en marcha', 14, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('pantallas-digitales', 'Pantallas de menú y publicidad', 'screen', 'Un TV en tu local con tu menú y promociones, que cambias desde el celular.', 'Convertimos cualquier televisor en una pantalla para tu negocio: menú con precios, promociones del día, videos y redes sociales. Lo programas desde tu panel y puedes mostrar contenido distinto según la hora (desayunos, almuerzos, happy hour).

Ideal para restaurantes, cafés, tiendas, gimnasios y salas de espera.', 'Menú y promociones en TV
Cambios desde el celular
Programación por horario
Varias pantallas y sedes
Diseño con tu marca', 15, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('automatizaciones', 'Automatizaciones para pymes', 'rocket', 'Que las tareas repetitivas se hagan solas: formularios, Excel, correos y avisos por WhatsApp.', 'Revisamos cómo trabajas y automatizamos lo que hoy se hace a mano: que los formularios de tu web lleguen a Excel o a tu CRM, que se envíen correos de seguimiento, que te avise por WhatsApp cuando llega un pedido o que se generen reportes cada semana.

Empezamos por lo que más tiempo te quita y te mostramos cuántas horas te ahorras.', 'Formularios a Excel, Google Sheets o CRM
Avisos por WhatsApp y correo
Reportes automáticos
Conexión entre tus herramientas
Diagnóstico gratis de procesos', 16, CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO "Service" ("slug", "title", "icon", "shortDescription", "description", "features", "order", "updatedAt") VALUES ('capacitaciones', 'Capacitaciones en herramientas digitales', 'school', 'Talleres prácticos de IA, WhatsApp Business y Google para tu negocio o tu equipo.', 'Talleres cortos y prácticos para que tú y tu equipo saquen provecho de las herramientas digitales: inteligencia artificial para el día a día, WhatsApp Business para vender, perfil de Google para aparecer en Maps y herramientas de productividad.

Presenciales o virtuales, para grupos o personalizados, con material para seguir practicando.', 'Inteligencia artificial para el trabajo
WhatsApp Business para vender
Google Maps y perfil de empresa
Presencial o virtual
Grupos o personalizado', 17, CURRENT_TIMESTAMP);

-- Preguntas frecuentes de Puerta
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Cuánto cuesta una Puerta by Aldore?', 'Desde $120.000 de instalación y $35.000 al mes con QR. Con stickers NFC son $250.000 de instalación y $49.000 al mes. Si pagas el año por adelantado, te regalamos 2 meses.', 20, CURRENT_TIMESTAMP);
INSERT INTO "Faq" ("question", "answer", "order", "updatedAt") VALUES ('¿Mis clientes tienen que descargar una app para usar la Puerta?', 'No. Escanean el QR con la cámara o acercan el celular al sticker NFC y se abre tu página al instante, en cualquier celular.', 21, CURRENT_TIMESTAMP);
