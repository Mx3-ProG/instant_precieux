/**
 * Génère les templates Supabase Auth (supabase/templates/*.html) à partir de api/_lib/emails.ts,
 * et, avec --preview <dossier>, un aperçu HTML de tous les emails avec des données d'exemple.
 *
 *   node scripts/generate-emails.ts
 *   node scripts/generate-emails.ts --preview /tmp/emails
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  adminAppointmentConfirmed,
  adminNewRequest,
  adminRescheduleRequested,
  AUTH_SUBJECTS,
  authTemplate,
  clientAppointmentConfirmed,
  clientAppointmentProposal,
  clientAppointmentReminder,
  clientRequestDeclined,
  clientRequestReceived,
  clientRescheduleReceived,
  type AuthTemplate,
  type QuoteInfo,
} from "../api/_lib/emails.ts";

const root = new URL("..", import.meta.url).pathname;
const templatesDir = join(root, "supabase/templates");
mkdirSync(templatesDir, { recursive: true });
for (const kind of Object.keys(AUTH_SUBJECTS) as AuthTemplate[]) {
  writeFileSync(join(templatesDir, `${kind}.html`), authTemplate(kind));
}
console.log(`Templates Supabase Auth écrits dans ${templatesDir}`);

const previewIndex = process.argv.indexOf("--preview");
if (previewIndex > -1) {
  const dir = process.argv[previewIndex + 1];
  mkdirSync(dir, { recursive: true });
  const site = "https://linstantprecieux.fr";
  const quote: QuoteInfo = {
    id: "7f3c2a10-5b1e-4c7d-9a2f-3e8b6d4c1a90",
    name: "Camille Moreau",
    email: "camille.moreau@example.com",
    phone: "06 12 34 56 78",
    city: "Nantes",
    category: "Bébé & naissance",
    service_id: "souvenir",
    service_name: "Souvenir",
    service_price: 100,
    preferred_date: "2026-10-17",
    people_count: 3,
    message: "Bonjour,\nNotre fille est née il y a deux semaines et nous aimerions garder un souvenir de ces premiers jours, à la maison, avec son grand frère.\nMerci !",
    lang: "fr",
    created_at: "2026-09-24T09:42:00Z",
  };
  const appt = { at: "2026-10-17T08:00:00Z", duration: 90, location: "12 rue des Olivettes, Nantes", note: "Prévoyez une pièce bien chauffée pour bébé, et gardez ses doudous à portée de main : ils feront de jolis détails." };
  const links = { confirm: `${site}/rendez-vous/abc?action=confirmer`, reschedule: `${site}/rendez-vous/abc?action=autre-date` };
  const emails: Record<string, { subject: string; html: string }> = {
    "client-1-demande-recue": clientRequestReceived(quote, site),
    "client-2-proposition-rdv": clientAppointmentProposal(quote, appt, links, site),
    "client-3-rdv-confirme": clientAppointmentConfirmed(quote, appt, site),
    "client-4-rappel-veille": clientAppointmentReminder(quote, appt, site),
    "client-5-autre-date-recue": clientRescheduleReceived(quote, "Plutôt un samedi matin si possible, ou en semaine après 16 h.", site),
    "client-6-demande-declinee": clientRequestDeclined(quote, "Je suis complète jusqu'à la mi-novembre, mais je serais ravie de vous photographier ensuite.", site),
    "client-2-proposition-rdv-en": clientAppointmentProposal({ ...quote, lang: "en", category_label: "Baby & newborn" }, appt, links, site),
    "admin-1-nouvelle-demande": adminNewRequest(quote, site),
    "admin-2-rdv-confirme": adminAppointmentConfirmed(quote, appt, site),
    "admin-3-autre-date-demandee": adminRescheduleRequested(quote, appt, "Plutôt un samedi matin si possible, ou en semaine après 16 h.", site),
  };
  for (const kind of Object.keys(AUTH_SUBJECTS) as AuthTemplate[]) {
    emails[`auth-${kind}`] = { subject: AUTH_SUBJECTS[kind], html: authTemplate(kind).replace(/\{\{ \.ConfirmationURL \}\}/g, `${site}/auth/v1/verify?token=…`).replace(/\{\{ \.Token \}\}/g, "482913").replace(/\{\{ \.Email \}\}/g, "admin@linstantprecieux.fr").replace(/\{\{ \.NewEmail \}\}/g, "nouvelle@linstantprecieux.fr").replace(/\{\{ \.SiteURL \}\}/g, site) };
  }
  for (const [name, email] of Object.entries(emails)) writeFileSync(join(dir, `${name}.html`), email.html);
  const index = `<!doctype html><meta charset="utf-8"><title>Emails</title><style>body{margin:0;font-family:system-ui;background:#e9e2d6;display:grid;grid-template-columns:280px 1fr;height:100vh}nav{overflow:auto;padding:16px;background:#27221d}nav a{display:block;color:#efe7da;padding:8px 10px;font-size:13px;text-decoration:none;border-radius:4px}nav a small{display:block;color:#a89c8f}nav a:hover{background:#3a3029}iframe{border:0;width:100%;height:100%}</style><nav>${Object.entries(emails).map(([n, e]) => `<a href="${n}.html" target="f">${n}<small>${e.subject.replace(/</g, "&lt;")}</small></a>`).join("")}</nav><iframe name="f" src="client-2-proposition-rdv.html"></iframe>`;
  writeFileSync(join(dir, "index.html"), index);
  console.log(`Aperçu : ${join(dir, "index.html")}`);
}
