// Source language is English. All other languages are translations of it.

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN", dir: "ltr", locale: "en-US" },
  { code: "fr", label: "Français", short: "FR", dir: "ltr", locale: "fr-FR" },
  { code: "es", label: "Español", short: "ES", dir: "ltr", locale: "es-ES" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl", locale: "ar" },
  { code: "ru", label: "Русский", short: "RU", dir: "ltr", locale: "ru-RU" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string | string[]>;

const en: Dict = {
  "lang.label": "Language",

  "nav.home": "Home",
  "nav.services": "Services",
  "nav.booking": "Book a session",
  "nav.info": "Information",
  "nav.checkout": "Checkout",
  "nav.instagram": "Visit our Instagram page",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.growDigitalImage": "Get your digital image developed",

  "cookie.region": "Cookie preferences",
  "cookie.text":
    "This site uses cookies to measure audience and improve your browsing experience. You can accept or reject non-essential cookies.",
  "cookie.reject": "Reject",
  "cookie.accept": "Accept",

  "services.seoTitle": "Photography services — offers and pricing",
  "services.seoDescription":
    "Portrait, editorial and campaign photo/video sessions. Explore the offers, book a date and pay online securely.",
  "services.title": "Services",
  "services.intro":
    "Three formats for three intentions: an essential portrait, an editorial series, or a full photo and film campaign.",
  "services.intro2":
    "Every service includes direction, shooting, retouching and delivery through a private gallery. Scroll right to compare the offers.",
  "services.cta": "Book a session",
  "services.mostChosen": "Most chosen",
  "services.book": "Book",
  "services.buyNow": "Buy now",
  "services.listName": "Photography services",

  "booking.seoTitle": "Book a photo session — online calendar",
  "booking.seoDescription":
    "Pick your package, your date and your time slot, then complete your booking online.",
  "booking.title": "Booking",
  "booking.intro":
    "Select a package, then a date and a time slot. Payment happens at the next step.",
  "booking.calendar": "Calendar",
  "booking.prevMonth": "Previous month",
  "booking.nextMonth": "Next month",
  "booking.closedNote": "Sundays and past dates are not available.",
  "booking.slots": "Time slots",
  "booking.pickDateFirst": "Pick a date in the calendar first.",
  "booking.summary": "Summary",
  "booking.package": "Package",
  "booking.date": "Date",
  "booking.time": "Time",
  "booking.total": "Total",
  "booking.continue": "Continue to payment",
  "booking.backToOffers": "Review the offers",
  "booking.weekdays": ["M", "T", "W", "T", "F", "S", "S"],

  "checkout.seoTitle": "Secure payment — photo session booking",
  "checkout.seoDescription":
    "Complete your photo session booking and pay online by card.",
  "checkout.title": "Your order",
  "checkout.tbd": "to be defined",
  "checkout.changeDate": "Change the date",
  "checkout.yourDetails": "Your details",
  "checkout.fullName": "Full name *",
  "checkout.email": "Email *",
  "checkout.phone": "Phone",
  "checkout.notes": "Project details",
  "checkout.redirecting": "Redirecting…",
  "checkout.pay": "Pay {price}",
  "checkout.payment": "Payment",
  "checkout.paymentText":
    "Payment is processed by Stripe Checkout. No card data goes through this site.",
  "checkout.stripeSlot": "Stripe placeholder",
  "checkout.stripeSlotText":
    "This block will host the redirect to Stripe Checkout (or the embedded card form) as soon as payments are activated.",
  "checkout.perk1": "Deposit or full payment",
  "checkout.perk2": "Automatic invoice by email",
  "checkout.perk3": "Free cancellation up to 48 h before the session",
  "checkout.toastTitle": "Stripe payments not activated yet",
  "checkout.toastDescription":
    "The sales funnel is ready — only the Stripe connection is missing to take real payments.",

  "info.about": "About",
  "info.contact": "Contact",
  "info.email": "Email",
  "info.social": "Social",
  "info.firstName": "First Name *",
  "info.lastName": "Last Name *",
  "info.emailField": "Email *",
  "info.message": "Message *",
  "info.send": "Send",
  "info.sending": "Sending...",
  "info.errFirstName": "First name is required",
  "info.errLastName": "Last name is required",
  "info.errEmail": "Email is required",
  "info.errEmailInvalid": "Invalid email address",
  "info.errMessage": "Message is required",
  "info.sentTitle": "Message sent!",
  "info.sentDescription": "Thank you for reaching out. I'll get back to you soon.",
  "info.errorTitle": "Error",
  "info.errorDescription": "Failed to send message. Please try again.",

  "offer.portrait-essentiel.name": "Essential Portrait",
  "offer.portrait-essentiel.tagline": "A short session, one honest image.",
  "offer.portrait-essentiel.description":
    "Natural-light portrait session, in studio or outdoors. Ideal for a professional or personal need.",
  "offer.portrait-essentiel.duration": "1 hour",
  "offer.portrait-essentiel.deliverables": [
    "1 hour of shooting",
    "10 retouched photos",
    "Private online gallery",
    "Delivery within 7 days",
  ],
  "offer.editorial.name": "Editorial Session",
  "offer.editorial.tagline": "A complete visual narrative.",
  "offer.editorial.description":
    "Art direction, location scouting and a half-day shoot. Designed for brands and editorial projects.",
  "offer.editorial.duration": "4 hours",
  "offer.editorial.deliverables": [
    "4 hours of shooting",
    "Art direction and moodboard",
    "40 retouched photos",
    "12-month commercial licence",
    "Delivery within 10 days",
  ],
  "offer.campagne.name": "Campaign & Film",
  "offer.campagne.tagline": "Photo and film, one single eye.",
  "offer.campagne.description":
    "Full one-day production: photography and video capture, editing included.",
  "offer.campagne.duration": "1 full day",
  "offer.campagne.deliverables": [
    "Full day of shooting",
    "80 retouched photos",
    "One edited 60-second film",
    "Social media formats included",
    "24-month commercial licence",
  ],

  "home.photographer": "Photographer",
  "home.portfolioTitle": "Photography Portfolio",

  "footer.madeWith": "Made with Vite + React",
  "footer.emailAria": "Send us an email",

  "project.error": "Error loading project",

  "notFound.pageTitle": "404 - Page Not Found",
  "notFound.seoDescription":
    "The page you're looking for doesn't exist or has been moved. Return to our homepage to explore our photography.",
  "notFound.heading": "Page not found",
  "notFound.description":
    "The page you're looking for doesn't exist or has been moved.",
  "notFound.returnHome": "Return Home",
};

const fr: Dict = {
  "lang.label": "Langue",

  "nav.home": "Accueil",
  "nav.services": "Services",
  "nav.booking": "Réserver une séance",
  "nav.info": "Informations",
  "nav.checkout": "Paiement",
  "nav.instagram": "Voir notre page Instagram",
  "nav.openMenu": "Ouvrir le menu",
  "nav.closeMenu": "Fermer le menu",
  "nav.growDigitalImage": "Fais développer ton image digitale",

  "cookie.region": "Préférences de cookies",
  "cookie.text":
    "Ce site utilise des cookies pour mesurer l'audience et améliorer votre expérience de navigation. Vous pouvez accepter ou refuser les cookies non essentiels.",
  "cookie.reject": "Refuser",
  "cookie.accept": "Accepter",

  "services.seoTitle": "Services de photographie — offres et tarifs",
  "services.seoDescription":
    "Séances portrait, éditoriales et campagnes photo/vidéo. Découvrez les offres, réservez une date et payez en ligne en toute sécurité.",
  "services.title": "Services",
  "services.intro":
    "Trois formules pour trois intentions : un portrait essentiel, une série éditoriale, ou une campagne complète photo et vidéo.",
  "services.intro2":
    "Chaque prestation inclut la direction, la prise de vue, la retouche et la livraison via une galerie privée. Faites défiler vers la droite pour comparer les offres.",
  "services.cta": "Réserver une séance",
  "services.mostChosen": "Le plus choisi",
  "services.book": "Réserver",
  "services.buyNow": "Acheter maintenant",
  "services.listName": "Services de photographie",

  "booking.seoTitle": "Réserver une séance photo — agenda en ligne",
  "booking.seoDescription":
    "Choisissez votre formule, votre date et votre créneau horaire, puis finalisez votre réservation en ligne.",
  "booking.title": "Réservation",
  "booking.intro":
    "Sélectionnez une formule, puis une date et un créneau. Le paiement se fait à l'étape suivante.",
  "booking.calendar": "Agenda",
  "booking.prevMonth": "Mois précédent",
  "booking.nextMonth": "Mois suivant",
  "booking.closedNote": "Les dimanches et dates passées ne sont pas disponibles.",
  "booking.slots": "Créneaux",
  "booking.pickDateFirst": "Choisissez d'abord une date dans l'agenda.",
  "booking.summary": "Récapitulatif",
  "booking.package": "Formule",
  "booking.date": "Date",
  "booking.time": "Heure",
  "booking.total": "Total",
  "booking.continue": "Continuer vers le paiement",
  "booking.backToOffers": "Revoir les offres",
  "booking.weekdays": ["L", "M", "M", "J", "V", "S", "D"],

  "checkout.seoTitle": "Paiement sécurisé — réservation de séance photo",
  "checkout.seoDescription":
    "Finalisez votre réservation de séance photo et réglez en ligne par carte bancaire.",
  "checkout.title": "Votre commande",
  "checkout.tbd": "à définir",
  "checkout.changeDate": "Modifier la date",
  "checkout.yourDetails": "Vos informations",
  "checkout.fullName": "Nom complet *",
  "checkout.email": "Email *",
  "checkout.phone": "Téléphone",
  "checkout.notes": "Précisions sur le projet",
  "checkout.redirecting": "Redirection…",
  "checkout.pay": "Payer {price}",
  "checkout.payment": "Paiement",
  "checkout.paymentText":
    "Le paiement sera traité par Stripe Checkout. Aucune donnée bancaire ne transite par ce site.",
  "checkout.stripeSlot": "Emplacement Stripe",
  "checkout.stripeSlotText":
    "Ce bloc accueillera la redirection vers Stripe Checkout (ou le formulaire de carte intégré) dès l'activation des paiements.",
  "checkout.perk1": "Acompte ou paiement intégral",
  "checkout.perk2": "Facture automatique par email",
  "checkout.perk3": "Annulation gratuite jusqu'à 48 h avant la séance",
  "checkout.toastTitle": "Paiement Stripe non encore activé",
  "checkout.toastDescription":
    "Le tunnel de vente est prêt : il ne reste qu'à connecter Stripe pour encaisser réellement.",

  "info.about": "À propos",
  "info.contact": "Contact",
  "info.email": "Email",
  "info.social": "Réseaux",
  "info.firstName": "Prénom *",
  "info.lastName": "Nom *",
  "info.emailField": "Email *",
  "info.message": "Message *",
  "info.send": "Envoyer",
  "info.sending": "Envoi...",
  "info.errFirstName": "Le prénom est obligatoire",
  "info.errLastName": "Le nom est obligatoire",
  "info.errEmail": "L'email est obligatoire",
  "info.errEmailInvalid": "Adresse email invalide",
  "info.errMessage": "Le message est obligatoire",
  "info.sentTitle": "Message envoyé !",
  "info.sentDescription": "Merci pour votre message. Je vous réponds très vite.",
  "info.errorTitle": "Erreur",
  "info.errorDescription": "L'envoi a échoué. Merci de réessayer.",

  "offer.portrait-essentiel.name": "Portrait Essentiel",
  "offer.portrait-essentiel.tagline": "Une séance courte, une image juste.",
  "offer.portrait-essentiel.description":
    "Séance portrait en lumière naturelle, en studio ou en extérieur. Idéale pour un besoin professionnel ou personnel.",
  "offer.portrait-essentiel.duration": "1 heure",
  "offer.portrait-essentiel.deliverables": [
    "1 heure de prise de vue",
    "10 photos retouchées",
    "Galerie privée en ligne",
    "Livraison sous 7 jours",
  ],
  "offer.editorial.name": "Séance Éditoriale",
  "offer.editorial.tagline": "Une narration visuelle complète.",
  "offer.editorial.description":
    "Direction artistique, repérage et prise de vue sur une demi-journée. Pensée pour les marques et les projets éditoriaux.",
  "offer.editorial.duration": "4 heures",
  "offer.editorial.deliverables": [
    "4 heures de prise de vue",
    "Direction artistique et moodboard",
    "40 photos retouchées",
    "Licence commerciale 12 mois",
    "Livraison sous 10 jours",
  ],
  "offer.campagne.name": "Campagne & Film",
  "offer.campagne.tagline": "Photo et vidéo, un même regard.",
  "offer.campagne.description":
    "Production complète sur une journée : photographie et captation vidéo, montage inclus.",
  "offer.campagne.duration": "1 journée",
  "offer.campagne.deliverables": [
    "Journée complète de tournage",
    "80 photos retouchées",
    "1 film de 60 secondes monté",
    "Formats réseaux sociaux inclus",
    "Licence commerciale 24 mois",
  ],

  "home.photographer": "Photographe",
  "home.portfolioTitle": "Portfolio de photographie",

  "footer.madeWith": "Réalisé avec Vite + React",
  "footer.emailAria": "Nous envoyer un email",

  "project.error": "Erreur lors du chargement du projet",

  "notFound.pageTitle": "404 - Page introuvable",
  "notFound.seoDescription":
    "La page que vous recherchez n'existe pas ou a été déplacée. Retournez à notre page d'accueil pour découvrir notre photographie.",
  "notFound.heading": "Page introuvable",
  "notFound.description":
    "La page que vous recherchez n'existe pas ou a été déplacée.",
  "notFound.returnHome": "Retour à l'accueil",
};

const es: Dict = {
  "lang.label": "Idioma",

  "nav.home": "Inicio",
  "nav.services": "Servicios",
  "nav.booking": "Reservar una sesión",
  "nav.info": "Información",
  "nav.checkout": "Pago",
  "nav.instagram": "Visita nuestra página de Instagram",
  "nav.openMenu": "Abrir menú",
  "nav.closeMenu": "Cerrar menú",
  "nav.growDigitalImage": "Haz que desarrollen tu imagen digital",

  "cookie.region": "Preferencias de cookies",
  "cookie.text":
    "Este sitio utiliza cookies para medir la audiencia y mejorar tu experiencia de navegación. Puedes aceptar o rechazar las cookies no esenciales.",
  "cookie.reject": "Rechazar",
  "cookie.accept": "Aceptar",

  "services.seoTitle": "Servicios de fotografía — ofertas y tarifas",
  "services.seoDescription":
    "Sesiones de retrato, editoriales y campañas de foto y vídeo. Descubre las ofertas, reserva una fecha y paga en línea de forma segura.",
  "services.title": "Servicios",
  "services.intro":
    "Tres fórmulas para tres intenciones: un retrato esencial, una serie editorial o una campaña completa de foto y vídeo.",
  "services.intro2":
    "Cada servicio incluye dirección, sesión, retoque y entrega en una galería privada. Desplázate a la derecha para comparar las ofertas.",
  "services.cta": "Reservar una sesión",
  "services.mostChosen": "La más elegida",
  "services.book": "Reservar",
  "services.buyNow": "Comprar ahora",
  "services.listName": "Servicios de fotografía",

  "booking.seoTitle": "Reservar una sesión de fotos — agenda en línea",
  "booking.seoDescription":
    "Elige tu fórmula, tu fecha y tu franja horaria, y finaliza tu reserva en línea.",
  "booking.title": "Reserva",
  "booking.intro":
    "Selecciona una fórmula y después una fecha y una franja horaria. El pago se realiza en el paso siguiente.",
  "booking.calendar": "Agenda",
  "booking.prevMonth": "Mes anterior",
  "booking.nextMonth": "Mes siguiente",
  "booking.closedNote": "Los domingos y las fechas pasadas no están disponibles.",
  "booking.slots": "Franjas horarias",
  "booking.pickDateFirst": "Elige primero una fecha en la agenda.",
  "booking.summary": "Resumen",
  "booking.package": "Fórmula",
  "booking.date": "Fecha",
  "booking.time": "Hora",
  "booking.total": "Total",
  "booking.continue": "Continuar al pago",
  "booking.backToOffers": "Ver las ofertas",
  "booking.weekdays": ["L", "M", "X", "J", "V", "S", "D"],

  "checkout.seoTitle": "Pago seguro — reserva de sesión fotográfica",
  "checkout.seoDescription":
    "Finaliza tu reserva de sesión fotográfica y paga en línea con tarjeta.",
  "checkout.title": "Tu pedido",
  "checkout.tbd": "por definir",
  "checkout.changeDate": "Cambiar la fecha",
  "checkout.yourDetails": "Tus datos",
  "checkout.fullName": "Nombre completo *",
  "checkout.email": "Email *",
  "checkout.phone": "Teléfono",
  "checkout.notes": "Detalles del proyecto",
  "checkout.redirecting": "Redirigiendo…",
  "checkout.pay": "Pagar {price}",
  "checkout.payment": "Pago",
  "checkout.paymentText":
    "El pago será procesado por Stripe Checkout. Ningún dato bancario pasa por este sitio.",
  "checkout.stripeSlot": "Espacio para Stripe",
  "checkout.stripeSlotText":
    "Este bloque alojará la redirección a Stripe Checkout (o el formulario de tarjeta integrado) en cuanto se activen los pagos.",
  "checkout.perk1": "Anticipo o pago íntegro",
  "checkout.perk2": "Factura automática por email",
  "checkout.perk3": "Cancelación gratuita hasta 48 h antes de la sesión",
  "checkout.toastTitle": "Pagos con Stripe aún no activados",
  "checkout.toastDescription":
    "El embudo de venta está listo: solo falta conectar Stripe para cobrar de verdad.",

  "info.about": "Sobre mí",
  "info.contact": "Contacto",
  "info.email": "Email",
  "info.social": "Redes",
  "info.firstName": "Nombre *",
  "info.lastName": "Apellido *",
  "info.emailField": "Email *",
  "info.message": "Mensaje *",
  "info.send": "Enviar",
  "info.sending": "Enviando...",
  "info.errFirstName": "El nombre es obligatorio",
  "info.errLastName": "El apellido es obligatorio",
  "info.errEmail": "El email es obligatorio",
  "info.errEmailInvalid": "Dirección de email no válida",
  "info.errMessage": "El mensaje es obligatorio",
  "info.sentTitle": "¡Mensaje enviado!",
  "info.sentDescription": "Gracias por escribir. Te responderé muy pronto.",
  "info.errorTitle": "Error",
  "info.errorDescription": "No se pudo enviar el mensaje. Inténtalo de nuevo.",

  "offer.portrait-essentiel.name": "Retrato Esencial",
  "offer.portrait-essentiel.tagline": "Una sesión corta, una imagen justa.",
  "offer.portrait-essentiel.description":
    "Sesión de retrato con luz natural, en estudio o en exteriores. Ideal para una necesidad profesional o personal.",
  "offer.portrait-essentiel.duration": "1 hora",
  "offer.portrait-essentiel.deliverables": [
    "1 hora de sesión",
    "10 fotos retocadas",
    "Galería privada en línea",
    "Entrega en 7 días",
  ],
  "offer.editorial.name": "Sesión Editorial",
  "offer.editorial.tagline": "Una narrativa visual completa.",
  "offer.editorial.description":
    "Dirección artística, localización y sesión de media jornada. Pensada para marcas y proyectos editoriales.",
  "offer.editorial.duration": "4 horas",
  "offer.editorial.deliverables": [
    "4 horas de sesión",
    "Dirección artística y moodboard",
    "40 fotos retocadas",
    "Licencia comercial de 12 meses",
    "Entrega en 10 días",
  ],
  "offer.campagne.name": "Campaña y Film",
  "offer.campagne.tagline": "Foto y vídeo, una misma mirada.",
  "offer.campagne.description":
    "Producción completa de un día: fotografía y captación de vídeo, montaje incluido.",
  "offer.campagne.duration": "1 jornada",
  "offer.campagne.deliverables": [
    "Jornada completa de rodaje",
    "80 fotos retocadas",
    "1 film de 60 segundos montado",
    "Formatos para redes sociales incluidos",
    "Licencia comercial de 24 meses",
  ],

  "home.photographer": "Fotógrafa",
  "home.portfolioTitle": "Portafolio de fotografía",

  "footer.madeWith": "Hecho con Vite + React",
  "footer.emailAria": "Envíanos un correo",

  "project.error": "Error al cargar el proyecto",

  "notFound.pageTitle": "404 - Página no encontrada",
  "notFound.seoDescription":
    "La página que buscas no existe o ha sido movida. Vuelve a nuestra página de inicio para explorar nuestra fotografía.",
  "notFound.heading": "Página no encontrada",
  "notFound.description":
    "La página que buscas no existe o ha sido movida.",
  "notFound.returnHome": "Volver al inicio",
};

const ar: Dict = {
  "lang.label": "اللغة",

  "nav.home": "الرئيسية",
  "nav.services": "الخدمات",
  "nav.booking": "حجز جلسة",
  "nav.info": "معلومات",
  "nav.checkout": "الدفع",
  "nav.instagram": "زيارة صفحتنا على إنستغرام",
  "nav.openMenu": "فتح القائمة",
  "nav.closeMenu": "إغلاق القائمة",
  "nav.growDigitalImage": "طوّر صورتك الرقمية معنا",

  "cookie.region": "تفضيلات ملفات تعريف الارتباط",
  "cookie.text":
    "يستخدم هذا الموقع ملفات تعريف الارتباط لقياس الزيارات وتحسين تجربة التصفح. يمكنك قبول أو رفض الملفات غير الضرورية.",
  "cookie.reject": "رفض",
  "cookie.accept": "قبول",

  "services.seoTitle": "خدمات التصوير — العروض والأسعار",
  "services.seoDescription":
    "جلسات بورتريه وتحريرية وحملات تصوير فوتوغرافي وفيديو. اكتشف العروض، احجز موعدًا وادفع عبر الإنترنت بأمان.",
  "services.title": "الخدمات",
  "services.intro":
    "ثلاث صيغ لثلاث نوايا: بورتريه أساسي، سلسلة تحريرية، أو حملة كاملة تجمع الصورة والفيديو.",
  "services.intro2":
    "تشمل كل خدمة الإخراج الفني والتصوير والمعالجة والتسليم عبر معرض خاص. مرّر إلى اليسار لمقارنة العروض.",
  "services.cta": "احجز جلسة",
  "services.mostChosen": "الأكثر اختيارًا",
  "services.book": "احجز",
  "services.buyNow": "اشترِ الآن",
  "services.listName": "خدمات التصوير",

  "booking.seoTitle": "حجز جلسة تصوير — أجندة عبر الإنترنت",
  "booking.seoDescription":
    "اختر الصيغة والتاريخ والتوقيت، ثم أكمل حجزك عبر الإنترنت.",
  "booking.title": "الحجز",
  "booking.intro":
    "اختر صيغة، ثم تاريخًا وتوقيتًا. يتم الدفع في الخطوة التالية.",
  "booking.calendar": "الأجندة",
  "booking.prevMonth": "الشهر السابق",
  "booking.nextMonth": "الشهر التالي",
  "booking.closedNote": "أيام الأحد والتواريخ الماضية غير متاحة.",
  "booking.slots": "المواعيد",
  "booking.pickDateFirst": "اختر تاريخًا من الأجندة أولًا.",
  "booking.summary": "الملخص",
  "booking.package": "الصيغة",
  "booking.date": "التاريخ",
  "booking.time": "الوقت",
  "booking.total": "الإجمالي",
  "booking.continue": "المتابعة إلى الدفع",
  "booking.backToOffers": "مراجعة العروض",
  "booking.weekdays": ["ن", "ث", "ر", "خ", "ج", "س", "ح"],

  "checkout.seoTitle": "دفع آمن — حجز جلسة تصوير",
  "checkout.seoDescription":
    "أكمل حجز جلسة التصوير وادفع عبر الإنترنت بالبطاقة البنكية.",
  "checkout.title": "طلبك",
  "checkout.tbd": "يُحدد لاحقًا",
  "checkout.changeDate": "تغيير التاريخ",
  "checkout.yourDetails": "بياناتك",
  "checkout.fullName": "الاسم الكامل *",
  "checkout.email": "البريد الإلكتروني *",
  "checkout.phone": "الهاتف",
  "checkout.notes": "تفاصيل المشروع",
  "checkout.redirecting": "جارٍ التحويل…",
  "checkout.pay": "ادفع {price}",
  "checkout.payment": "الدفع",
  "checkout.paymentText":
    "تتم معالجة الدفع عبر Stripe Checkout. لا تمر أي بيانات بنكية عبر هذا الموقع.",
  "checkout.stripeSlot": "مكان Stripe",
  "checkout.stripeSlotText":
    "سيستضيف هذا القسم التحويل إلى Stripe Checkout (أو نموذج البطاقة المدمج) فور تفعيل المدفوعات.",
  "checkout.perk1": "دفعة مقدمة أو دفع كامل",
  "checkout.perk2": "فاتورة تلقائية عبر البريد الإلكتروني",
  "checkout.perk3": "إلغاء مجاني حتى 48 ساعة قبل الجلسة",
  "checkout.toastTitle": "لم يتم تفعيل الدفع عبر Stripe بعد",
  "checkout.toastDescription":
    "مسار البيع جاهز: يكفي ربط Stripe لتحصيل المدفوعات فعليًا.",

  "info.about": "نبذة",
  "info.contact": "اتصال",
  "info.email": "البريد الإلكتروني",
  "info.social": "التواصل الاجتماعي",
  "info.firstName": "الاسم *",
  "info.lastName": "اللقب *",
  "info.emailField": "البريد الإلكتروني *",
  "info.message": "الرسالة *",
  "info.send": "إرسال",
  "info.sending": "جارٍ الإرسال...",
  "info.errFirstName": "الاسم مطلوب",
  "info.errLastName": "اللقب مطلوب",
  "info.errEmail": "البريد الإلكتروني مطلوب",
  "info.errEmailInvalid": "عنوان بريد إلكتروني غير صالح",
  "info.errMessage": "الرسالة مطلوبة",
  "info.sentTitle": "تم إرسال الرسالة!",
  "info.sentDescription": "شكرًا لتواصلك. سأعود إليك قريبًا.",
  "info.errorTitle": "خطأ",
  "info.errorDescription": "تعذّر إرسال الرسالة. يرجى المحاولة مجددًا.",

  "offer.portrait-essentiel.name": "بورتريه أساسي",
  "offer.portrait-essentiel.tagline": "جلسة قصيرة، صورة صادقة.",
  "offer.portrait-essentiel.description":
    "جلسة بورتريه بالضوء الطبيعي، في الاستوديو أو في الخارج. مثالية للاحتياجات المهنية أو الشخصية.",
  "offer.portrait-essentiel.duration": "ساعة واحدة",
  "offer.portrait-essentiel.deliverables": [
    "ساعة تصوير",
    "10 صور معالَجة",
    "معرض خاص عبر الإنترنت",
    "التسليم خلال 7 أيام",
  ],
  "offer.editorial.name": "جلسة تحريرية",
  "offer.editorial.tagline": "سرد بصري متكامل.",
  "offer.editorial.description":
    "إخراج فني واستكشاف المواقع وتصوير لنصف يوم. مصممة للعلامات التجارية والمشاريع التحريرية.",
  "offer.editorial.duration": "4 ساعات",
  "offer.editorial.deliverables": [
    "4 ساعات تصوير",
    "إخراج فني ولوحة مزاجية",
    "40 صورة معالَجة",
    "رخصة تجارية لمدة 12 شهرًا",
    "التسليم خلال 10 أيام",
  ],
  "offer.campagne.name": "حملة وفيلم",
  "offer.campagne.tagline": "صورة وفيديو، بنظرة واحدة.",
  "offer.campagne.description":
    "إنتاج كامل ليوم واحد: تصوير فوتوغرافي وفيديو، مع المونتاج.",
  "offer.campagne.duration": "يوم كامل",
  "offer.campagne.deliverables": [
    "يوم تصوير كامل",
    "80 صورة معالَجة",
    "فيلم مونتاج مدته 60 ثانية",
    "صيغ شبكات التواصل مشمولة",
    "رخصة تجارية لمدة 24 شهرًا",
  ],

  "home.photographer": "مصورة",
  "home.portfolioTitle": "معرض أعمال التصوير",

  "footer.madeWith": "صُنع باستخدام Vite + React",
  "footer.emailAria": "أرسل لنا بريدًا إلكترونيًا",

  "project.error": "خطأ في تحميل المشروع",

  "notFound.pageTitle": "404 - الصفحة غير موجودة",
  "notFound.seoDescription":
    "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. عد إلى صفحتنا الرئيسية لاستكشاف أعمالنا في التصوير.",
  "notFound.heading": "الصفحة غير موجودة",
  "notFound.description":
    "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  "notFound.returnHome": "العودة إلى الرئيسية",
};

const ru: Dict = {
  "lang.label": "Язык",

  "nav.home": "Главная",
  "nav.services": "Услуги",
  "nav.booking": "Забронировать съёмку",
  "nav.info": "Информация",
  "nav.checkout": "Оплата",
  "nav.instagram": "Перейти в наш Instagram",
  "nav.openMenu": "Открыть меню",
  "nav.closeMenu": "Закрыть меню",
  "nav.growDigitalImage": "Доверьте нам развитие вашего цифрового имиджа",

  "cookie.region": "Настройки файлов cookie",
  "cookie.text":
    "Этот сайт использует файлы cookie для измерения аудитории и улучшения работы сайта. Вы можете принять или отклонить необязательные cookie.",
  "cookie.reject": "Отклонить",
  "cookie.accept": "Принять",

  "services.seoTitle": "Услуги фотографа — предложения и цены",
  "services.seoDescription":
    "Портретные, editorial-съёмки и рекламные кампании фото/видео. Изучите предложения, выберите дату и оплатите онлайн.",
  "services.title": "Услуги",
  "services.intro":
    "Три формата для трёх задач: лаконичный портрет, editorial-серия или полноценная фото- и видеокампания.",
  "services.intro2":
    "Каждая услуга включает режиссуру, съёмку, ретушь и доставку через приватную галерею. Прокручивайте вправо, чтобы сравнить предложения.",
  "services.cta": "Забронировать съёмку",
  "services.mostChosen": "Выбирают чаще всего",
  "services.book": "Забронировать",
  "services.buyNow": "Купить сейчас",
  "services.listName": "Услуги фотографа",

  "booking.seoTitle": "Бронирование съёмки — онлайн-календарь",
  "booking.seoDescription":
    "Выберите пакет, дату и время, затем завершите бронирование онлайн.",
  "booking.title": "Бронирование",
  "booking.intro":
    "Выберите пакет, затем дату и время. Оплата — на следующем шаге.",
  "booking.calendar": "Календарь",
  "booking.prevMonth": "Предыдущий месяц",
  "booking.nextMonth": "Следующий месяц",
  "booking.closedNote": "Воскресенья и прошедшие даты недоступны.",
  "booking.slots": "Время",
  "booking.pickDateFirst": "Сначала выберите дату в календаре.",
  "booking.summary": "Итого",
  "booking.package": "Пакет",
  "booking.date": "Дата",
  "booking.time": "Время",
  "booking.total": "Сумма",
  "booking.continue": "Перейти к оплате",
  "booking.backToOffers": "Вернуться к предложениям",
  "booking.weekdays": ["П", "В", "С", "Ч", "П", "С", "В"],

  "checkout.seoTitle": "Безопасная оплата — бронирование фотосессии",
  "checkout.seoDescription":
    "Завершите бронирование фотосессии и оплатите картой онлайн.",
  "checkout.title": "Ваш заказ",
  "checkout.tbd": "уточняется",
  "checkout.changeDate": "Изменить дату",
  "checkout.yourDetails": "Ваши данные",
  "checkout.fullName": "Полное имя *",
  "checkout.email": "Email *",
  "checkout.phone": "Телефон",
  "checkout.notes": "Детали проекта",
  "checkout.redirecting": "Переадресация…",
  "checkout.pay": "Оплатить {price}",
  "checkout.payment": "Оплата",
  "checkout.paymentText":
    "Платёж обрабатывается Stripe Checkout. Данные карты не проходят через этот сайт.",
  "checkout.stripeSlot": "Место для Stripe",
  "checkout.stripeSlotText":
    "Этот блок будет содержать переход в Stripe Checkout (или встроенную форму карты) сразу после активации платежей.",
  "checkout.perk1": "Предоплата или полная оплата",
  "checkout.perk2": "Автоматический счёт на email",
  "checkout.perk3": "Бесплатная отмена за 48 ч до съёмки",
  "checkout.toastTitle": "Платежи Stripe ещё не активированы",
  "checkout.toastDescription":
    "Воронка продаж готова — осталось подключить Stripe для реальных платежей.",

  "info.about": "О себе",
  "info.contact": "Контакты",
  "info.email": "Email",
  "info.social": "Соцсети",
  "info.firstName": "Имя *",
  "info.lastName": "Фамилия *",
  "info.emailField": "Email *",
  "info.message": "Сообщение *",
  "info.send": "Отправить",
  "info.sending": "Отправка...",
  "info.errFirstName": "Укажите имя",
  "info.errLastName": "Укажите фамилию",
  "info.errEmail": "Укажите email",
  "info.errEmailInvalid": "Некорректный email",
  "info.errMessage": "Введите сообщение",
  "info.sentTitle": "Сообщение отправлено!",
  "info.sentDescription": "Спасибо за обращение. Я отвечу в ближайшее время.",
  "info.errorTitle": "Ошибка",
  "info.errorDescription": "Не удалось отправить сообщение. Попробуйте ещё раз.",

  "offer.portrait-essentiel.name": "Базовый портрет",
  "offer.portrait-essentiel.tagline": "Короткая съёмка, точный кадр.",
  "offer.portrait-essentiel.description":
    "Портретная съёмка при естественном свете, в студии или на улице. Подходит для деловых и личных задач.",
  "offer.portrait-essentiel.duration": "1 час",
  "offer.portrait-essentiel.deliverables": [
    "1 час съёмки",
    "10 отретушированных фото",
    "Приватная онлайн-галерея",
    "Доставка за 7 дней",
  ],
  "offer.editorial.name": "Editorial-съёмка",
  "offer.editorial.tagline": "Полноценное визуальное повествование.",
  "offer.editorial.description":
    "Арт-дирекшн, поиск локаций и съёмка в течение половины дня. Для брендов и редакционных проектов.",
  "offer.editorial.duration": "4 часа",
  "offer.editorial.deliverables": [
    "4 часа съёмки",
    "Арт-дирекшн и мудборд",
    "40 отретушированных фото",
    "Коммерческая лицензия на 12 месяцев",
    "Доставка за 10 дней",
  ],
  "offer.campagne.name": "Кампания и фильм",
  "offer.campagne.tagline": "Фото и видео одним взглядом.",
  "offer.campagne.description":
    "Полное однодневное производство: фотосъёмка и видеосъёмка с монтажом.",
  "offer.campagne.duration": "1 день",
  "offer.campagne.deliverables": [
    "Полный съёмочный день",
    "80 отретушированных фото",
    "Смонтированный ролик 60 секунд",
    "Форматы для соцсетей включены",
    "Коммерческая лицензия на 24 месяца",
  ],

  "home.photographer": "Фотограф",
  "home.portfolioTitle": "Фотопортфолио",

  "footer.madeWith": "Сделано с Vite + React",
  "footer.emailAria": "Напишите нам письмо",

  "project.error": "Ошибка загрузки проекта",

  "notFound.pageTitle": "404 - Страница не найдена",
  "notFound.seoDescription":
    "Страница, которую вы ищете, не существует или была перемещена. Вернитесь на главную страницу, чтобы увидеть нашу фотографию.",
  "notFound.heading": "Страница не найдена",
  "notFound.description":
    "Страница, которую вы ищете, не существует или была перемещена.",
  "notFound.returnHome": "Вернуться на главную",
};

export const translations: Record<LanguageCode, Dict> = { en, fr, es, ar, ru };
export type TranslationKey = keyof typeof en;
