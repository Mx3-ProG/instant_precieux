import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  adminAppointmentConfirmed,
  adminRescheduleRequested,
  appointmentIcs,
  asLang,
  clientAppointmentConfirmed,
  clientAppointmentProposal,
  clientRequestDeclined,
  clientRescheduleReceived,
} from "./_lib/emails.js";
import { appointmentOf, isAdmin, loadQuote, serverConfig } from "./_lib/server.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LANG_PREFIX = { fr: "", en: "/en", es: "/es", de: "/de" } as const;

/**
 * GET  ?token=…                                  → détails publics du rendez-vous (page client).
 * POST { action: "confirm" | "reschedule", token } → réponse du client.
 * POST { action: "propose" | "refuse", id }        → actions administrateur (jeton Supabase requis).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const config = serverConfig();
  if (!config) return res.status(503).json({ error: "Service non configuré" });
  const { supabase, resend, adminEmail, from, siteUrl } = config;

  if (req.method === "GET") {
    const token = String(req.query.token || "");
    if (!UUID.test(token)) return res.status(404).json({ error: "Lien invalide" });
    const loaded = await loadQuote(supabase, { token });
    const appt = loaded && appointmentOf(loaded.row);
    if (!loaded || !appt) return res.status(404).json({ error: "Lien invalide" });
    return res.status(200).json({
      name: loaded.info.name.split(/\s+/)[0],
      lang: asLang(loaded.info.lang),
      status: loaded.row.appointment_status,
      service: loaded.info.service_name,
      ...appt,
    });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  const body = req.body || {};

  /* ── Réponses du client ── */
  if (body.action === "confirm" || body.action === "reschedule") {
    const token = String(body.token || "");
    if (!UUID.test(token)) return res.status(404).json({ error: "Lien invalide" });
    const loaded = await loadQuote(supabase, { token });
    const appt = loaded && appointmentOf(loaded.row);
    if (!loaded || !appt) return res.status(404).json({ error: "Lien invalide" });
    const q = loaded.info;
    const current = loaded.row.appointment_status;

    if (body.action === "confirm") {
      if (current === "confirmee") return res.status(200).json({ ok: true, status: current });
      if (current !== "proposee") return res.status(409).json({ error: "Ce rendez-vous n'est plus disponible" });
      if (new Date(appt.at).getTime() < Date.now()) return res.status(409).json({ error: "Ce créneau est passé" });
      const { error } = await supabase.from("quote_requests").update({ appointment_status: "confirmee", appointment_responded_at: new Date().toISOString(), client_response: null }).eq("id", q.id);
      if (error) return res.status(500).json({ error: "Mise à jour impossible" });
      const ics = (forAdmin: boolean) => [{ filename: "seance-linstant-precieux.ics", content: Buffer.from(appointmentIcs(q, appt, adminEmail, forAdmin)).toString("base64"), contentType: "text/calendar; charset=utf-8" }];
      const key = `${q.id}-${appt.at}`;
      await Promise.all([
        resend.emails.send({ from, to: q.email, replyTo: adminEmail, ...clientAppointmentConfirmed(q, appt, siteUrl), attachments: ics(false) }, { headers: { "Idempotency-Key": `appt-confirmed-client-${key}` } }),
        resend.emails.send({ from, to: adminEmail, replyTo: q.email, ...adminAppointmentConfirmed(q, appt, siteUrl), attachments: ics(true) }, { headers: { "Idempotency-Key": `appt-confirmed-admin-${key}` } }),
      ]);
      return res.status(200).json({ ok: true, status: "confirmee" });
    }

    if (current === "a_replanifier") return res.status(200).json({ ok: true, status: current });
    const message = String(body.message || "").trim().slice(0, 2000);
    const { error } = await supabase.from("quote_requests").update({ appointment_status: "a_replanifier", appointment_responded_at: new Date().toISOString(), client_response: message || null }).eq("id", q.id);
    if (error) return res.status(500).json({ error: "Mise à jour impossible" });
    await Promise.all([
      resend.emails.send({ from, to: q.email, replyTo: adminEmail, ...clientRescheduleReceived(q, message, siteUrl) }),
      resend.emails.send({ from, to: adminEmail, replyTo: q.email, ...adminRescheduleRequested(q, appt, message, siteUrl) }),
    ]);
    return res.status(200).json({ ok: true, status: "a_replanifier" });
  }

  /* ── Actions administrateur ── */
  if (body.action !== "propose" && body.action !== "refuse") return res.status(400).json({ error: "Action inconnue" });
  if (!(await isAdmin(supabase, req.headers.authorization))) return res.status(401).json({ error: "Accès réservé à l'administration" });
  const id = String(body.id || "");
  if (!UUID.test(id)) return res.status(400).json({ error: "Demande introuvable" });
  const loaded = await loadQuote(supabase, { id });
  if (!loaded) return res.status(404).json({ error: "Demande introuvable" });
  const q = loaded.info;

  if (body.action === "refuse") {
    const { error } = await supabase.from("quote_requests").update({ status: "refusee", appointment_status: null, appointment_token: null }).eq("id", id);
    if (error) return res.status(500).json({ error: "Mise à jour impossible" });
    const result = await resend.emails.send({ from, to: q.email, replyTo: adminEmail, ...clientRequestDeclined(q, String(body.message || "").trim().slice(0, 2000), siteUrl) });
    if (result.error) return res.status(502).json({ error: "Statut mis à jour, email non envoyé" });
    return res.status(200).json({ ok: true, status: "refusee" });
  }

  const at = new Date(String(body.appointment_at || ""));
  if (Number.isNaN(at.getTime()) || at.getTime() < Date.now()) return res.status(400).json({ error: "Date de rendez-vous invalide" });
  const duration = Math.max(15, Math.min(600, Number(body.duration) || 90));
  const location = String(body.location || q.city).trim().slice(0, 300) || q.city;
  const note = String(body.note || "").trim().slice(0, 2000) || null;
  // Nouveau jeton à chaque proposition : un ancien lien ne peut pas confirmer une date remplacée.
  const token = randomUUID();
  const { error } = await supabase.from("quote_requests").update({
    status: "acceptee", appointment_at: at.toISOString(), appointment_duration: duration, appointment_location: location, appointment_note: note, appointment_status: "proposee", appointment_token: token, appointment_responded_at: null, client_response: null, reminder_sent_at: null,
  }).eq("id", id);
  if (error) return res.status(500).json({ error: "Mise à jour impossible" });

  const page = `${siteUrl}${LANG_PREFIX[asLang(q.lang)]}/rendez-vous/${token}`;
  const mail = clientAppointmentProposal(q, { at: at.toISOString(), duration, location, note }, { confirm: `${page}?action=confirmer`, reschedule: `${page}?action=autre-date` }, siteUrl);
  const result = await resend.emails.send({ from, to: q.email, replyTo: adminEmail, ...mail }, { headers: { "Idempotency-Key": `appt-proposal-${token}` } });
  if (result.error) return res.status(502).json({ error: "Rendez-vous enregistré, email non envoyé" });
  return res.status(200).json({ ok: true, status: "proposee", appointment_at: at.toISOString(), appointment_duration: duration, appointment_location: location, appointment_note: note });
}
