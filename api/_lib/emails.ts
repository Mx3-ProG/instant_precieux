/**
 * Templates des emails transactionnels de L'instant précieux.
 * Mise en page en tableaux + styles en ligne : c'est ce que les clients mail (Gmail, Outlook, Apple Mail) affichent de façon fiable.
 * Aucune dépendance : ce fichier est aussi importé par scripts/generate-emails.ts pour produire les templates Supabase Auth.
 */

export type EmailLang = "fr" | "en" | "es" | "de";
export type Email = { subject: string; html: string; text: string };

export type QuoteInfo = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  city: string;
  category: string;
  category_label?: string | null;
  service_id?: string | null;
  service_name?: string | null;
  service_price?: number | null;
  preferred_date?: string | null;
  people_count?: number | null;
  message: string;
  lang?: string | null;
  created_at?: string | null;
};

export type AppointmentInfo = {
  at: string; // ISO
  duration: number; // minutes
  location: string;
  note?: string | null;
};

const TIME_ZONE = "Europe/Paris";

/* Palette du site (src/index.css, thème clair). */
const C = {
  cream: "#f3ecdf",
  paper: "#fbf8f2",
  ink: "#27221d",
  brown: "#5c4b3f",
  gold: "#ad9362",
  line: "#d7ccbd",
  muted: "#70675f",
  note: "#eee4d2",
};
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const SANS = "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

export const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c] || c);
const multiline = (value: unknown) => escapeHtml(value).replace(/\r?\n/g, "<br>");
/** « Un moment *rien qu'à vous* » → l'astérisque passe en italique doré, comme les titres du site. */
const rich = (value: string) => escapeHtml(value).replace(/\*(.+?)\*/g, `<em style="font-style:italic;color:${C.gold}">$1</em>`);
const plain = (value: string) => value.replace(/\*/g, "");
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;
export const asLang = (value: unknown): EmailLang => (["fr", "en", "es", "de"].includes(String(value)) ? (value as EmailLang) : "fr");

const LOCALES: Record<EmailLang, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE" };
export function formatDate(iso: string, lang: EmailLang) {
  return new Intl.DateTimeFormat(LOCALES[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE }).format(new Date(iso));
}
export function formatTime(iso: string, lang: EmailLang) {
  return new Intl.DateTimeFormat(LOCALES[lang], { hour: "2-digit", minute: "2-digit", timeZone: TIME_ZONE }).format(new Date(iso));
}
/** Date seule (colonne `date` Postgres) : pas de fuseau à appliquer. */
function formatDay(day: string, lang: EmailLang) {
  const [y, m, d] = day.split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALES[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}
function formatDuration(minutes: number, lang: EmailLang) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
const euro = (value: number, lang: EmailLang) => new Intl.NumberFormat(LOCALES[lang], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

/* ───────────────────────── Briques de mise en page ───────────────────────── */

function layout({ lang, preheader, body, footer }: { lang: EmailLang; preheader: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>L'instant précieux</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:${C.cream};}
  a{color:${C.brown};}
  @media (max-width:620px){
    .card{padding:36px 24px !important;}
    .title{font-size:34px !important;}
    .ticket-date{font-size:26px !important;}
    .btn a{display:block !important;}
    .stack{display:block !important;width:auto !important;}
    .label{border-bottom:0 !important;padding-bottom:0 !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.cream};">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream};">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center" style="padding:0 0 28px;">
        <span style="font-family:${SERIF};font-size:28px;line-height:1;color:${C.ink};">L'instant <em style="font-style:italic;color:${C.gold};">précieux</em></span>
      </td></tr>
      <tr><td class="card" style="background:${C.paper};border:1px solid ${C.line};padding:48px 44px;font-family:${SANS};color:${C.ink};">
        ${body}
      </td></tr>
      <tr><td align="center" style="padding:28px 12px 0;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};">
        ${footer}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const eyebrow = (text: string) =>
  `<p style="margin:0 0 14px;font-family:${SANS};font-size:11px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:${C.gold};">${escapeHtml(text)}</p>`;
const title = (text: string) =>
  `<h1 class="title" style="margin:0 0 22px;font-family:${SERIF};font-size:42px;line-height:1.05;font-weight:400;color:${C.ink};">${rich(text)}</h1>`;
const paragraph = (html: string) => `<p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${C.brown};">${html}</p>`;
const divider = () => `<div style="height:1px;background:${C.line};margin:30px 0;line-height:1px;font-size:1px;">&nbsp;</div>`;
const small = (html: string) => `<p style="margin:0;font-size:12px;line-height:1.7;color:${C.muted};">${html}</p>`;

function button(label: string, href: string, variant: "primary" | "outline" = "primary") {
  const bg = variant === "primary" ? C.brown : "transparent";
  const color = variant === "primary" ? "#ffffff" : C.brown;
  return `<table role="presentation" class="btn stack" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 10px 10px 0;"><tr><td style="background:${bg};border:1px solid ${C.brown};">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:15px 26px;font-family:${SANS};font-size:12px;font-weight:500;letter-spacing:1.6px;text-transform:uppercase;text-decoration:none;color:${color};text-align:center;">${escapeHtml(label)}&nbsp;&nbsp;&rarr;</a>
</td></tr></table>`;
}
const buttons = (...items: string[]) => `<div style="margin:30px 0 6px;">${items.join("")}</div>`;

/** Tableau libellé / valeur (récapitulatifs). Les valeurs sont déjà échappées. */
function details(rows: [string, string | null | undefined][]) {
  const visible = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};">
${visible
  .map(
    ([label, value]) => `<tr>
  <td class="stack label" valign="top" style="width:34%;padding:13px 12px 13px 0;border-bottom:1px solid ${C.line};font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${escapeHtml(label)}</td>
  <td class="stack" valign="top" style="padding:13px 0;border-bottom:1px solid ${C.line};font-size:14px;line-height:1.6;color:${C.ink};">${value}</td>
</tr>`,
  )
  .join("\n")}
</table>`;
}

/** Encart « billet » du rendez-vous : la date en grand, en serif. */
function ticket(appt: AppointmentInfo, lang: EmailLang, labels: { time: string; duration: string; place: string }) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.note};margin:6px 0 8px;">
<tr><td style="padding:28px 28px 24px;border-left:3px solid ${C.gold};">
  <p class="ticket-date" style="margin:0 0 16px;font-family:${SERIF};font-size:30px;line-height:1.15;color:${C.ink};">${escapeHtml(capitalize(formatDate(appt.at, lang)))}</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
    <td class="stack" valign="top" style="padding:0 18px 8px 0;"><span style="display:block;font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">${escapeHtml(labels.time)}</span><span style="font-size:15px;color:${C.ink};">${escapeHtml(formatTime(appt.at, lang))}</span></td>
    <td class="stack" valign="top" style="padding:0 18px 8px 0;"><span style="display:block;font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">${escapeHtml(labels.duration)}</span><span style="font-size:15px;color:${C.ink};">${escapeHtml(formatDuration(appt.duration, lang))}</span></td>
    <td class="stack" valign="top" style="padding:0 0 8px;"><span style="display:block;font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">${escapeHtml(labels.place)}</span><span style="font-size:15px;color:${C.ink};">${escapeHtml(appt.location)}</span></td>
  </tr></table>
</td></tr></table>`;
}

function quoteBlock(html: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;"><tr>
<td style="border-left:2px solid ${C.gold};padding:4px 0 4px 18px;font-family:${SERIF};font-size:19px;font-style:italic;line-height:1.5;color:${C.brown};">${html}</td></tr></table>`;
}

/* ───────────────────────── Textes clients (4 langues) ───────────────────────── */

const T = {
  fr: {
    footer: "Photographe de famille à domicile",
    footerNote: "Vous recevez cet email suite à votre demande sur notre site.",
    signature: "À très bientôt,<br><em>L'instant précieux</em>",
    labels: { date: "Date", time: "Heure", duration: "Durée", place: "Lieu", formula: "Formule", category: "Séance", people: "Personnes", preferred: "Date souhaitée", reference: "Référence" },
    received: {
      subject: "Votre demande a bien été reçue",
      preheader: "Merci pour votre confiance — nous revenons vers vous très vite avec une proposition de date.",
      eyebrow: "Demande reçue",
      title: "Merci *{name}*",
      intro: "Votre demande de séance photo nous est bien parvenue. Nous allons la lire avec attention et revenir vers vous sous 48 heures avec une <strong>proposition de rendez-vous</strong>.",
      recap: "Récapitulatif de votre demande",
      next: "Vous recevrez un email avec la date proposée : il vous suffira de la confirmer en un clic, ou de nous suggérer un autre moment.",
    },
    proposal: {
      subject: "Proposition de rendez-vous pour votre séance",
      preheader: "Nous vous proposons le {date} à {time}. Confirmez en un clic.",
      eyebrow: "Proposition de rendez-vous",
      title: "Un moment *rien qu'à vous*",
      intro: "Bonjour {name}, merci encore pour votre demande. Voici le créneau que nous vous proposons pour votre séance :",
      note: "Un mot de la photographe",
      confirm: "Confirmer ce rendez-vous",
      reschedule: "Proposer une autre date",
      help: "Ce créneau ne vous convient pas ? Aucun souci : indiquez-nous vos disponibilités et nous trouverons ensemble le bon moment.",
    },
    confirmed: {
      subject: "Votre séance est confirmée",
      preheader: "Rendez-vous le {date} à {time}. Nous avons hâte !",
      eyebrow: "Rendez-vous confirmé",
      title: "C'est *noté*",
      intro: "Merci {name}, votre séance est confirmée. Vous trouverez l'invitation à ajouter à votre agenda en pièce jointe.",
      prepTitle: "Pour préparer la séance",
      prep: [
        "Privilégiez des tenues simples, aux tons doux et coordonnés.",
        "Ouvrez les rideaux : la lumière naturelle fait toute la différence.",
        "Pas besoin de tout ranger — ce sont vos gestes qui comptent, pas le décor.",
      ],
      change: "Un empêchement ? Répondez simplement à cet email, nous trouverons une autre date.",
    },
    reminder: {
      subject: "Votre séance, c'est demain",
      preheader: "Rendez-vous demain à {time}. À très vite !",
      eyebrow: "Rappel",
      title: "À *demain* {name}",
      intro: "Petit rappel pour votre séance photo, prévue demain. Il n'y a rien à préparer de plus : venez comme vous êtes, nous nous occupons du reste.",
      change: "Un imprévu ? Répondez à cet email dès que possible.",
    },
    reschedule: {
      subject: "Nous cherchons une autre date",
      preheader: "Votre demande de changement de date a bien été reçue.",
      eyebrow: "Changement de date",
      title: "Trouvons le *bon moment*",
      intro: "Merci {name}, nous avons bien reçu votre message. Nous revenons vers vous rapidement avec un nouveau créneau.",
      yourMessage: "Votre message",
    },
    declined: {
      subject: "À propos de votre demande de séance",
      preheader: "Merci pour votre demande — un mot de notre part.",
      eyebrow: "Votre demande",
      title: "Merci *{name}*",
      intro: "Nous avons été touchés par votre demande. Malheureusement, nous ne sommes pas en mesure d'y donner suite pour le moment.",
      outro: "N'hésitez pas à nous recontacter pour une prochaine occasion : ce sera avec plaisir.",
    },
  },
  en: {
    footer: "In-home family photographer",
    footerNote: "You are receiving this email following your request on our website.",
    signature: "See you soon,<br><em>L'instant précieux</em>",
    labels: { date: "Date", time: "Time", duration: "Duration", place: "Location", formula: "Package", category: "Session", people: "People", preferred: "Preferred date", reference: "Reference" },
    received: {
      subject: "We've received your request",
      preheader: "Thank you for your trust — we'll get back to you very soon with a proposed date.",
      eyebrow: "Request received",
      title: "Thank you *{name}*",
      intro: "Your photo session request has reached us. We'll read it carefully and get back to you within 48 hours with a <strong>proposed appointment</strong>.",
      recap: "Your request at a glance",
      next: "You'll receive an email with the proposed date: simply confirm it in one click, or suggest another time.",
    },
    proposal: {
      subject: "A proposed date for your session",
      preheader: "We suggest {date} at {time}. Confirm in one click.",
      eyebrow: "Proposed appointment",
      title: "A moment *just for you*",
      intro: "Hello {name}, thank you again for your request. Here is the time we'd like to suggest for your session:",
      note: "A word from the photographer",
      confirm: "Confirm this appointment",
      reschedule: "Suggest another date",
      help: "Doesn't suit you? No problem: tell us when you're available and we'll find the right moment together.",
    },
    confirmed: {
      subject: "Your session is confirmed",
      preheader: "See you on {date} at {time}. We can't wait!",
      eyebrow: "Appointment confirmed",
      title: "It's *booked*",
      intro: "Thank you {name}, your session is confirmed. You'll find a calendar invitation attached.",
      prepTitle: "Getting ready",
      prep: [
        "Choose simple outfits in soft, coordinated tones.",
        "Open the curtains: natural light makes all the difference.",
        "No need to tidy everything — it's your gestures that matter, not the decor.",
      ],
      change: "Something came up? Just reply to this email and we'll find another date.",
    },
    reminder: {
      subject: "Your session is tomorrow",
      preheader: "See you tomorrow at {time}!",
      eyebrow: "Reminder",
      title: "See you *tomorrow* {name}",
      intro: "A gentle reminder about your photo session tomorrow. There's nothing else to prepare: come as you are, we'll take care of the rest.",
      change: "Something unexpected? Reply to this email as soon as possible.",
    },
    reschedule: {
      subject: "We're finding another date",
      preheader: "Your request for a new date has been received.",
      eyebrow: "New date",
      title: "Let's find the *right moment*",
      intro: "Thank you {name}, we've received your message. We'll get back to you shortly with a new time.",
      yourMessage: "Your message",
    },
    declined: {
      subject: "About your session request",
      preheader: "Thank you for your request — a note from us.",
      eyebrow: "Your request",
      title: "Thank you *{name}*",
      intro: "We were touched by your request. Unfortunately, we're unable to take it on at the moment.",
      outro: "Please don't hesitate to get in touch for a future occasion — it would be a pleasure.",
    },
  },
  es: {
    footer: "Fotógrafa de familia a domicilio",
    footerNote: "Recibe este correo tras su solicitud en nuestra web.",
    signature: "Hasta muy pronto,<br><em>L'instant précieux</em>",
    labels: { date: "Fecha", time: "Hora", duration: "Duración", place: "Lugar", formula: "Fórmula", category: "Sesión", people: "Personas", preferred: "Fecha deseada", reference: "Referencia" },
    received: {
      subject: "Hemos recibido su solicitud",
      preheader: "Gracias por su confianza: le responderemos muy pronto con una propuesta de fecha.",
      eyebrow: "Solicitud recibida",
      title: "Gracias *{name}*",
      intro: "Su solicitud de sesión de fotos nos ha llegado. La leeremos con atención y le responderemos en 48 horas con una <strong>propuesta de cita</strong>.",
      recap: "Resumen de su solicitud",
      next: "Recibirá un correo con la fecha propuesta: bastará con confirmarla en un clic o sugerirnos otro momento.",
    },
    proposal: {
      subject: "Propuesta de cita para su sesión",
      preheader: "Le proponemos el {date} a las {time}. Confirme en un clic.",
      eyebrow: "Propuesta de cita",
      title: "Un momento *solo para ustedes*",
      intro: "Hola {name}, gracias de nuevo por su solicitud. Este es el horario que le proponemos para su sesión:",
      note: "Unas palabras de la fotógrafa",
      confirm: "Confirmar la cita",
      reschedule: "Proponer otra fecha",
      help: "¿No le viene bien? Ningún problema: indíquenos su disponibilidad y encontraremos juntos el momento adecuado.",
    },
    confirmed: {
      subject: "Su sesión está confirmada",
      preheader: "Cita el {date} a las {time}. ¡Tenemos muchas ganas!",
      eyebrow: "Cita confirmada",
      title: "¡*Anotado*!",
      intro: "Gracias {name}, su sesión está confirmada. Encontrará adjunta la invitación para añadirla a su calendario.",
      prepTitle: "Para preparar la sesión",
      prep: [
        "Elija ropa sencilla, en tonos suaves y coordinados.",
        "Abra las cortinas: la luz natural marca la diferencia.",
        "No hace falta ordenarlo todo: lo que cuenta son sus gestos, no la decoración.",
      ],
      change: "¿Algún imprevisto? Responda a este correo y buscaremos otra fecha.",
    },
    reminder: {
      subject: "Su sesión es mañana",
      preheader: "Nos vemos mañana a las {time}.",
      eyebrow: "Recordatorio",
      title: "Hasta *mañana* {name}",
      intro: "Un pequeño recordatorio de su sesión de fotos de mañana. No hay nada más que preparar: vengan tal como son, nosotros nos encargamos del resto.",
      change: "¿Un imprevisto? Responda a este correo lo antes posible.",
    },
    reschedule: {
      subject: "Buscamos otra fecha",
      preheader: "Hemos recibido su solicitud de cambio de fecha.",
      eyebrow: "Cambio de fecha",
      title: "Busquemos el *momento adecuado*",
      intro: "Gracias {name}, hemos recibido su mensaje. Le responderemos pronto con un nuevo horario.",
      yourMessage: "Su mensaje",
    },
    declined: {
      subject: "Sobre su solicitud de sesión",
      preheader: "Gracias por su solicitud: unas palabras de nuestra parte.",
      eyebrow: "Su solicitud",
      title: "Gracias *{name}*",
      intro: "Su solicitud nos ha emocionado. Lamentablemente, no podemos atenderla por el momento.",
      outro: "No dude en volver a contactarnos para una próxima ocasión: será un placer.",
    },
  },
  de: {
    footer: "Familienfotografin bei Ihnen zu Hause",
    footerNote: "Sie erhalten diese E-Mail aufgrund Ihrer Anfrage auf unserer Website.",
    signature: "Bis ganz bald,<br><em>L'instant précieux</em>",
    labels: { date: "Datum", time: "Uhrzeit", duration: "Dauer", place: "Ort", formula: "Paket", category: "Shooting", people: "Personen", preferred: "Wunschtermin", reference: "Referenz" },
    received: {
      subject: "Ihre Anfrage ist eingegangen",
      preheader: "Danke für Ihr Vertrauen – wir melden uns in Kürze mit einem Terminvorschlag.",
      eyebrow: "Anfrage erhalten",
      title: "Danke *{name}*",
      intro: "Ihre Anfrage für ein Fotoshooting ist bei uns eingegangen. Wir lesen sie aufmerksam und melden uns innerhalb von 48 Stunden mit einem <strong>Terminvorschlag</strong>.",
      recap: "Ihre Anfrage im Überblick",
      next: "Sie erhalten eine E-Mail mit dem vorgeschlagenen Termin: Bestätigen Sie ihn mit einem Klick oder schlagen Sie uns einen anderen Zeitpunkt vor.",
    },
    proposal: {
      subject: "Terminvorschlag für Ihr Shooting",
      preheader: "Wir schlagen den {date} um {time} vor. Mit einem Klick bestätigen.",
      eyebrow: "Terminvorschlag",
      title: "Ein Moment *nur für Sie*",
      intro: "Hallo {name}, nochmals danke für Ihre Anfrage. Diesen Termin schlagen wir Ihnen für Ihr Shooting vor:",
      note: "Ein Wort der Fotografin",
      confirm: "Termin bestätigen",
      reschedule: "Anderen Termin vorschlagen",
      help: "Passt es nicht? Kein Problem: Teilen Sie uns mit, wann Sie Zeit haben, und wir finden gemeinsam den richtigen Moment.",
    },
    confirmed: {
      subject: "Ihr Shooting ist bestätigt",
      preheader: "Wir sehen uns am {date} um {time}. Wir freuen uns!",
      eyebrow: "Termin bestätigt",
      title: "Ist *notiert*",
      intro: "Danke {name}, Ihr Shooting ist bestätigt. Die Kalendereinladung finden Sie im Anhang.",
      prepTitle: "Zur Vorbereitung",
      prep: [
        "Wählen Sie schlichte Kleidung in sanften, abgestimmten Tönen.",
        "Öffnen Sie die Vorhänge: Natürliches Licht macht den Unterschied.",
        "Sie müssen nicht alles aufräumen – es zählen Ihre Gesten, nicht die Deko.",
      ],
      change: "Etwas dazwischengekommen? Antworten Sie einfach auf diese E-Mail, wir finden einen neuen Termin.",
    },
    reminder: {
      subject: "Ihr Shooting ist morgen",
      preheader: "Bis morgen um {time}!",
      eyebrow: "Erinnerung",
      title: "Bis *morgen* {name}",
      intro: "Eine kleine Erinnerung an Ihr Fotoshooting morgen. Sie müssen nichts weiter vorbereiten: Kommen Sie, wie Sie sind – um den Rest kümmern wir uns.",
      change: "Etwas Unvorhergesehenes? Antworten Sie bitte so bald wie möglich auf diese E-Mail.",
    },
    reschedule: {
      subject: "Wir suchen einen neuen Termin",
      preheader: "Ihre Bitte um einen neuen Termin ist eingegangen.",
      eyebrow: "Neuer Termin",
      title: "Finden wir den *richtigen Moment*",
      intro: "Danke {name}, wir haben Ihre Nachricht erhalten. Wir melden uns in Kürze mit einem neuen Termin.",
      yourMessage: "Ihre Nachricht",
    },
    declined: {
      subject: "Zu Ihrer Shooting-Anfrage",
      preheader: "Danke für Ihre Anfrage – ein paar Worte von uns.",
      eyebrow: "Ihre Anfrage",
      title: "Danke *{name}*",
      intro: "Ihre Anfrage hat uns sehr berührt. Leider können wir sie derzeit nicht annehmen.",
      outro: "Melden Sie sich gerne bei einer nächsten Gelegenheit – wir freuen uns darauf.",
    },
  },
} satisfies Record<EmailLang, unknown>;

const fill = (text: string, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");

function clientFooter(lang: EmailLang, siteUrl: string) {
  const t = T[lang];
  const host = siteUrl.replace(/^https?:\/\//, "");
  return `<span style="font-family:${SERIF};font-size:16px;color:${C.ink};">L'instant <em style="color:${C.gold};">précieux</em></span><br>${escapeHtml(t.footer)} · <a href="${escapeHtml(siteUrl)}" style="color:${C.muted};">${escapeHtml(host)}</a><br><span style="color:${C.muted};">${escapeHtml(t.footerNote)}</span>`;
}

function requestRecap(q: QuoteInfo, lang: EmailLang) {
  const l = T[lang].labels;
  return details([
    [l.category, escapeHtml(q.category_label || q.category)],
    [l.formula, q.service_name ? `${escapeHtml(q.service_name)}${q.service_price != null ? ` — ${euro(q.service_price, lang)}` : ""}` : null],
    [l.preferred, q.preferred_date ? escapeHtml(formatDay(q.preferred_date, lang)) : null],
    [l.people, q.people_count ? String(q.people_count) : null],
    [l.place, escapeHtml(q.city)],
  ]);
}

/* ───────────────────────── Emails client ───────────────────────── */

export function clientRequestReceived(q: QuoteInfo, siteUrl: string): Email {
  const lang = asLang(q.lang);
  const t = T[lang].received;
  const name = firstName(q.name);
  const body = [
    eyebrow(t.eyebrow),
    title(fill(t.title, { name })),
    paragraph(t.intro),
    `<p style="margin:28px 0 12px;font-family:${SERIF};font-size:21px;color:${C.ink};">${escapeHtml(t.recap)}</p>`,
    requestRecap(q, lang),
    `<div style="height:24px;"></div>`,
    paragraph(escapeHtml(t.next)),
    paragraph(T[lang].signature),
  ].join("\n");
  return {
    subject: t.subject,
    html: layout({ lang, preheader: t.preheader, body, footer: clientFooter(lang, siteUrl) }),
    text: `${plain(fill(t.title, { name }))}\n\n${stripTags(t.intro)}\n\n${t.next}\n\nL'instant précieux\n${siteUrl}`,
  };
}

export function clientAppointmentProposal(q: QuoteInfo, appt: AppointmentInfo, links: { confirm: string; reschedule: string }, siteUrl: string): Email {
  const lang = asLang(q.lang);
  const t = T[lang].proposal;
  const l = T[lang].labels;
  const name = firstName(q.name);
  const vars = { name, date: formatDate(appt.at, lang), time: formatTime(appt.at, lang) };
  const body = [
    eyebrow(t.eyebrow),
    title(t.title),
    paragraph(escapeHtml(fill(t.intro, vars))),
    ticket(appt, lang, l),
    q.service_name ? small(`${escapeHtml(l.formula)} · ${escapeHtml(q.service_name)}${q.service_price != null ? ` — ${euro(q.service_price, lang)}` : ""}`) : "",
    appt.note ? `<div style="height:22px;"></div>${eyebrow(t.note)}${quoteBlock(multiline(appt.note))}` : "",
    buttons(button(t.confirm, links.confirm), button(t.reschedule, links.reschedule, "outline")),
    divider(),
    small(escapeHtml(t.help)),
    `<div style="height:18px;"></div>`,
    paragraph(T[lang].signature),
  ].join("\n");
  return {
    subject: t.subject,
    html: layout({ lang, preheader: fill(t.preheader, vars), body, footer: clientFooter(lang, siteUrl) }),
    text: `${plain(t.title)}\n\n${fill(t.intro, vars)}\n\n${vars.date} — ${vars.time} (${formatDuration(appt.duration, lang)})\n${appt.location}\n${appt.note ? `\n${appt.note}\n` : ""}\n${t.confirm} : ${links.confirm}\n${t.reschedule} : ${links.reschedule}\n\nL'instant précieux`,
  };
}

export function clientAppointmentConfirmed(q: QuoteInfo, appt: AppointmentInfo, siteUrl: string): Email {
  const lang = asLang(q.lang);
  const t = T[lang].confirmed;
  const name = firstName(q.name);
  const vars = { name, date: formatDate(appt.at, lang), time: formatTime(appt.at, lang) };
  const prep = t.prep
    .map((item, i) => `<tr><td valign="top" style="width:34px;padding:0 0 14px;font-family:${SERIF};font-size:20px;color:${C.gold};">0${i + 1}</td><td style="padding:3px 0 14px;font-size:14px;line-height:1.6;color:${C.brown};">${escapeHtml(item)}</td></tr>`)
    .join("");
  const body = [
    eyebrow(t.eyebrow),
    title(t.title),
    paragraph(escapeHtml(fill(t.intro, vars))),
    ticket(appt, lang, T[lang].labels),
    divider(),
    `<p style="margin:0 0 16px;font-family:${SERIF};font-size:21px;color:${C.ink};">${escapeHtml(t.prepTitle)}</p>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${prep}</table>`,
    divider(),
    small(escapeHtml(t.change)),
    `<div style="height:18px;"></div>`,
    paragraph(T[lang].signature),
  ].join("\n");
  return {
    subject: t.subject,
    html: layout({ lang, preheader: fill(t.preheader, vars), body, footer: clientFooter(lang, siteUrl) }),
    text: `${plain(t.title)}\n\n${fill(t.intro, vars)}\n\n${vars.date} — ${vars.time}\n${appt.location}\n\n${t.prep.map((p) => `• ${p}`).join("\n")}\n\n${t.change}\n\nL'instant précieux`,
  };
}

export function clientAppointmentReminder(q: QuoteInfo, appt: AppointmentInfo, siteUrl: string): Email {
  const lang = asLang(q.lang);
  const t = T[lang].reminder;
  const name = firstName(q.name);
  const vars = { name, time: formatTime(appt.at, lang) };
  const body = [
    eyebrow(t.eyebrow),
    title(fill(t.title, { name })),
    paragraph(escapeHtml(t.intro)),
    ticket(appt, lang, T[lang].labels),
    appt.note ? `<div style="height:14px;"></div>${quoteBlock(multiline(appt.note))}` : "",
    divider(),
    small(escapeHtml(t.change)),
    `<div style="height:18px;"></div>`,
    paragraph(T[lang].signature),
  ].join("\n");
  return {
    subject: t.subject,
    html: layout({ lang, preheader: fill(t.preheader, vars), body, footer: clientFooter(lang, siteUrl) }),
    text: `${plain(fill(t.title, { name }))}\n\n${t.intro}\n\n${formatDate(appt.at, lang)} — ${vars.time}\n${appt.location}\n\n${t.change}\n\nL'instant précieux`,
  };
}

export function clientRescheduleReceived(q: QuoteInfo, clientMessage: string, siteUrl: string): Email {
  const lang = asLang(q.lang);
  const t = T[lang].reschedule;
  const name = firstName(q.name);
  const body = [
    eyebrow(t.eyebrow),
    title(t.title),
    paragraph(escapeHtml(fill(t.intro, { name }))),
    clientMessage ? `${eyebrow(t.yourMessage)}${quoteBlock(multiline(clientMessage))}<div style="height:12px;"></div>` : "",
    paragraph(T[lang].signature),
  ].join("\n");
  return {
    subject: t.subject,
    html: layout({ lang, preheader: t.preheader, body, footer: clientFooter(lang, siteUrl) }),
    text: `${plain(t.title)}\n\n${fill(t.intro, { name })}\n\nL'instant précieux`,
  };
}

export function clientRequestDeclined(q: QuoteInfo, personalMessage: string | null | undefined, siteUrl: string): Email {
  const lang = asLang(q.lang);
  const t = T[lang].declined;
  const name = firstName(q.name);
  const body = [
    eyebrow(t.eyebrow),
    title(fill(t.title, { name })),
    paragraph(escapeHtml(t.intro)),
    personalMessage ? quoteBlock(multiline(personalMessage)) + `<div style="height:14px;"></div>` : "",
    paragraph(escapeHtml(t.outro)),
    paragraph(T[lang].signature),
  ].join("\n");
  return {
    subject: t.subject,
    html: layout({ lang, preheader: t.preheader, body, footer: clientFooter(lang, siteUrl) }),
    text: `${plain(fill(t.title, { name }))}\n\n${t.intro}\n\n${personalMessage ? `${personalMessage}\n\n` : ""}${t.outro}\n\nL'instant précieux`,
  };
}

/* ───────────────────────── Emails administrateur (français) ───────────────────────── */

const LANG_NAMES: Record<EmailLang, string> = { fr: "Français", en: "Anglais", es: "Espagnol", de: "Allemand" };

function adminFooter(siteUrl: string) {
  return `Notification automatique · <a href="${escapeHtml(siteUrl)}/admin/dashboard" style="color:${C.muted};">Espace administrateur</a>`;
}

function clientDetails(q: QuoteInfo) {
  const phone = q.phone ? `<a href="tel:${escapeHtml(q.phone.replace(/\s/g, ""))}" style="color:${C.ink};">${escapeHtml(q.phone)}</a>` : `<span style="color:${C.muted};">Non renseigné</span>`;
  return details([
    ["Client", `<strong style="font-weight:500;">${escapeHtml(q.name)}</strong>`],
    ["Email", `<a href="mailto:${escapeHtml(q.email)}" style="color:${C.ink};">${escapeHtml(q.email)}</a>`],
    ["Téléphone", phone],
    ["Commune", escapeHtml(q.city)],
  ]);
}

function sessionDetails(q: QuoteInfo) {
  return details([
    ["Séance", escapeHtml(q.category)],
    ["Formule", q.service_name ? `${escapeHtml(q.service_name)}${q.service_price != null ? ` — ${euro(q.service_price, "fr")}` : ""}` : escapeHtml(q.service_id)],
    ["Date souhaitée", q.preferred_date ? `<strong style="font-weight:500;">${escapeHtml(formatDay(q.preferred_date, "fr"))}</strong>` : `<span style="color:${C.muted};">Flexible</span>`],
    ["Personnes", q.people_count ? String(q.people_count) : null],
    ["Langue", LANG_NAMES[asLang(q.lang)]],
    ["Reçue le", q.created_at ? escapeHtml(`${formatDate(q.created_at, "fr")} à ${formatTime(q.created_at, "fr")}`) : null],
    ["Référence", `<span style="font-family:ui-monospace,Menlo,monospace;font-size:12px;color:${C.muted};">${escapeHtml(q.id)}</span>`],
  ]);
}

const sectionTitle = (text: string) => `<p style="margin:30px 0 12px;font-family:${SERIF};font-size:21px;color:${C.ink};">${escapeHtml(text)}</p>`;

export function adminNewRequest(q: QuoteInfo, siteUrl: string): Email {
  const subjectLine = `Nouvelle demande de rendez-vous — ${q.name}`;
  const replySubject = encodeURIComponent("Votre demande de séance — L'instant précieux");
  const body = [
    eyebrow("Nouvelle demande"),
    title(`${q.name.replace(/\*/g, "")}, *${q.category.replace(/\*/g, "")}*`),
    paragraph(
      q.preferred_date
        ? `Une nouvelle demande de séance vient d'arriver. Date souhaitée par le client : <strong style="color:${C.ink};">${escapeHtml(formatDay(q.preferred_date, "fr"))}</strong>.`
        : "Une nouvelle demande de séance vient d'arriver. Le client n'a pas indiqué de date : proposez-lui un créneau.",
    ),
    sectionTitle("Contact"),
    clientDetails(q),
    sectionTitle("Séance"),
    sessionDetails(q),
    sectionTitle("Son message"),
    quoteBlock(multiline(q.message)),
    buttons(button("Proposer une date", `${siteUrl}/admin/dashboard?demande=${encodeURIComponent(q.id)}`), button("Répondre par email", `mailto:${q.email}?subject=${replySubject}`, "outline")),
    small("Répondre directement à cet email écrit aussi au client."),
  ].join("\n");
  return {
    subject: subjectLine,
    html: layout({ lang: "fr", preheader: `${q.category} · ${q.city}${q.preferred_date ? ` · souhaitée le ${formatDay(q.preferred_date, "fr")}` : ""}`, body, footer: adminFooter(siteUrl) }),
    text: [
      subjectLine,
      "",
      `Client : ${q.name}`,
      `Email : ${q.email}`,
      `Téléphone : ${q.phone || "—"}`,
      `Commune : ${q.city}`,
      `Séance : ${q.category}`,
      `Formule : ${q.service_name || q.service_id || "—"}`,
      `Date souhaitée : ${q.preferred_date ? formatDay(q.preferred_date, "fr") : "flexible"}`,
      `Personnes : ${q.people_count ?? "—"}`,
      "",
      q.message,
      "",
      `Référence : ${q.id}`,
      `${siteUrl}/admin/dashboard?demande=${q.id}`,
    ].join("\n"),
  };
}

export function adminAppointmentConfirmed(q: QuoteInfo, appt: AppointmentInfo, siteUrl: string): Email {
  const body = [
    eyebrow("Rendez-vous confirmé"),
    title(`${q.name.replace(/\*/g, "")} a *confirmé*`),
    paragraph("Le client vient d'accepter le créneau proposé. Une invitation d'agenda est jointe à cet email."),
    ticket(appt, "fr", T.fr.labels),
    sectionTitle("Contact"),
    clientDetails(q),
    sectionTitle("Séance"),
    sessionDetails(q),
    buttons(button("Voir la demande", `${siteUrl}/admin/dashboard?demande=${encodeURIComponent(q.id)}`)),
  ].join("\n");
  return {
    subject: `Rendez-vous confirmé — ${q.name}, ${formatDate(appt.at, "fr")} à ${formatTime(appt.at, "fr")}`,
    html: layout({ lang: "fr", preheader: `${formatDate(appt.at, "fr")} à ${formatTime(appt.at, "fr")} · ${appt.location}`, body, footer: adminFooter(siteUrl) }),
    text: `${q.name} a confirmé le rendez-vous du ${formatDate(appt.at, "fr")} à ${formatTime(appt.at, "fr")}.\n${appt.location}\n\n${q.email} · ${q.phone || "—"}\nRéférence : ${q.id}`,
  };
}

export function adminRescheduleRequested(q: QuoteInfo, appt: AppointmentInfo, clientMessage: string, siteUrl: string): Email {
  const body = [
    eyebrow("Autre date demandée"),
    title(`${q.name.replace(/\*/g, "")} souhaite *une autre date*`),
    paragraph(`Le créneau du <strong style="color:${C.ink};">${escapeHtml(formatDate(appt.at, "fr"))} à ${escapeHtml(formatTime(appt.at, "fr"))}</strong> ne convient pas au client.`),
    sectionTitle("Ses disponibilités"),
    quoteBlock(clientMessage ? multiline(clientMessage) : `<span style="color:${C.muted};">Aucun message laissé.</span>`),
    sectionTitle("Contact"),
    clientDetails(q),
    buttons(button("Proposer une nouvelle date", `${siteUrl}/admin/dashboard?demande=${encodeURIComponent(q.id)}`), button("Répondre par email", `mailto:${q.email}`, "outline")),
  ].join("\n");
  return {
    subject: `Autre date demandée — ${q.name}`,
    html: layout({ lang: "fr", preheader: clientMessage.slice(0, 120) || "Le client souhaite un autre créneau.", body, footer: adminFooter(siteUrl) }),
    text: `${q.name} souhaite une autre date que le ${formatDate(appt.at, "fr")} à ${formatTime(appt.at, "fr")}.\n\n${clientMessage}\n\n${q.email} · ${q.phone || "—"}\nRéférence : ${q.id}`,
  };
}

/* ───────────────────────── Invitation agenda (.ics) ───────────────────────── */

export function appointmentIcs(q: QuoteInfo, appt: AppointmentInfo, organizerEmail: string, forAdmin = false) {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(appt.at);
  const end = new Date(start.getTime() + appt.duration * 60_000);
  const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);
  const summary = forAdmin ? `Séance photo — ${q.name}` : "Séance photo — L'instant précieux";
  const description = forAdmin ? `${q.category} · ${q.service_name || q.service_id || ""}\n${q.email} · ${q.phone || ""}` : appt.note || "";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//L'instant precieux//Rendez-vous//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${q.id}@linstantprecieux.fr`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(summary)}`,
    `LOCATION:${esc(appt.location)}`,
    `DESCRIPTION:${esc(description)}`,
    `ORGANIZER;CN=L'instant précieux:mailto:${organizerEmail}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/* ───────────────────────── Supabase Auth (variables Go : {{ .ConfirmationURL }}…) ───────────────────────── */

export type AuthTemplate = "confirmation" | "invite" | "magic_link" | "recovery" | "email_change" | "reauthentication";

export const AUTH_SUBJECTS: Record<AuthTemplate, string> = {
  confirmation: "Confirmez votre adresse email",
  invite: "Vous êtes invité·e sur L'instant précieux",
  magic_link: "Votre lien de connexion",
  recovery: "Réinitialisez votre mot de passe",
  email_change: "Confirmez votre nouvelle adresse email",
  reauthentication: "Votre code de vérification",
};

export function authTemplate(kind: AuthTemplate) {
  const url = "{{ .ConfirmationURL }}";
  const content: Record<AuthTemplate, { eyebrow: string; title: string; intro: string; cta?: string; code?: boolean; outro: string }> = {
    confirmation: {
      eyebrow: "Bienvenue",
      title: "Confirmez *votre adresse*",
      intro: "Merci de vous être inscrit·e. Cliquez sur le bouton ci-dessous pour confirmer l'adresse <strong>{{ .Email }}</strong> et activer votre compte.",
      cta: "Confirmer mon adresse",
      outro: "Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet email.",
    },
    invite: {
      eyebrow: "Invitation",
      title: "Rejoignez *l'espace administrateur*",
      intro: "Vous avez été invité·e à gérer le site <strong>L'instant précieux</strong> : portfolio, prestations et demandes de rendez-vous. Acceptez l'invitation pour créer votre accès.",
      cta: "Accepter l'invitation",
      outro: "Vous ne vous attendiez pas à cette invitation ? Vous pouvez ignorer cet email.",
    },
    magic_link: {
      eyebrow: "Connexion",
      title: "Votre lien *de connexion*",
      intro: "Cliquez sur le bouton ci-dessous pour vous connecter à votre espace. Ce lien est à usage unique et expire rapidement.",
      cta: "Me connecter",
      outro: "Si vous n'avez pas demandé à vous connecter, ignorez cet email : votre compte reste protégé.",
    },
    recovery: {
      eyebrow: "Mot de passe",
      title: "Un nouveau *mot de passe*",
      intro: "Une demande de réinitialisation du mot de passe a été faite pour <strong>{{ .Email }}</strong>. Cliquez ci-dessous pour en choisir un nouveau.",
      cta: "Choisir un mot de passe",
      outro: "Vous n'êtes pas à l'origine de cette demande ? Ignorez cet email, votre mot de passe actuel reste valable.",
    },
    email_change: {
      eyebrow: "Changement d'adresse",
      title: "Confirmez *votre nouvelle adresse*",
      intro: "Vous avez demandé à remplacer <strong>{{ .Email }}</strong> par <strong>{{ .NewEmail }}</strong>. Confirmez ce changement en cliquant ci-dessous.",
      cta: "Confirmer le changement",
      outro: "Si vous n'avez pas demandé ce changement, contactez-nous immédiatement en répondant à cet email.",
    },
    reauthentication: {
      eyebrow: "Vérification",
      title: "Votre *code*",
      intro: "Saisissez ce code pour confirmer votre identité :",
      code: true,
      outro: "Ce code expire rapidement. Si vous n'avez rien demandé, ignorez cet email.",
    },
  };
  const c = content[kind];
  const codeBlock = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:${C.note};margin:8px 0 24px;"><tr><td style="padding:22px 34px;border-left:3px solid ${C.gold};font-family:${SERIF};font-size:40px;letter-spacing:10px;color:${C.ink};">{{ .Token }}</td></tr></table>`;
  const body = [
    eyebrow(c.eyebrow),
    title(c.title),
    paragraph(c.intro),
    c.code ? codeBlock : buttons(button(c.cta!, url)),
    c.code ? "" : small(`Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :<br><a href="${url}" style="color:${C.brown};word-break:break-all;">${url}</a>`),
    divider(),
    small(c.outro),
  ].join("\n");
  const footer = `<span style="font-family:${SERIF};font-size:16px;color:${C.ink};">L'instant <em style="color:${C.gold};">précieux</em></span><br>Photographe de famille à domicile · <a href="{{ .SiteURL }}" style="color:${C.muted};">{{ .SiteURL }}</a>`;
  return layout({ lang: "fr", preheader: AUTH_SUBJECTS[kind], body, footer });
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, "");
}
