import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminNewRequest, asLang, clientRequestReceived } from "./_lib/emails.js";
import { loadQuote, serverConfig } from "./_lib/server.js";

const required = ["name", "email", "city", "category", "service_id", "message"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  const body = req.body || {};
  if (body.company) return res.status(200).json({ ok: true });
  if (required.some((key) => !String(body[key] || "").trim())) return res.status(400).json({ error: "Champs requis manquants" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return res.status(400).json({ error: "Email invalide" });

  const config = serverConfig();
  if (!config) return res.status(503).json({ error: "Service non configuré" });
  const { supabase, resend, adminEmail, from, siteUrl } = config;

  const { data: quote, error } = await supabase.from("quote_requests").insert({
    name: String(body.name).slice(0, 160), email: String(body.email).slice(0, 254), phone: String(body.phone || "").slice(0, 40), city: String(body.city).slice(0, 160), category: String(body.category).slice(0, 160), category_label: String(body.category_label || "").slice(0, 160) || null, service_id: String(body.service_id).slice(0, 80), preferred_date: body.preferred_date || null, people_count: Math.max(1, Math.min(50, Number(body.people_count) || 1)), message: String(body.message).slice(0, 5000), lang: asLang(body.lang), status: "nouvelle",
  }).select("id").single();
  if (error || !quote) return res.status(500).json({ error: "Enregistrement impossible" });

  const loaded = await loadQuote(supabase, { id: quote.id });
  if (!loaded) return res.status(500).json({ error: "Enregistrement impossible" });
  const clientMail = clientRequestReceived(loaded.info, siteUrl);
  const adminMail = adminNewRequest(loaded.info, siteUrl);
  const [clientEmail, adminEmailResult] = await Promise.all([
    resend.emails.send({ from, to: body.email, replyTo: adminEmail, ...clientMail }, { headers: { "Idempotency-Key": `quote-client-${quote.id}` } }),
    resend.emails.send({ from, to: adminEmail, replyTo: body.email, ...adminMail }, { headers: { "Idempotency-Key": `quote-admin-${quote.id}` } }),
  ]);
  if (clientEmail.error || adminEmailResult.error) return res.status(502).json({ error: "Demande enregistrée, email non envoyé", id: quote.id });
  return res.status(200).json({ ok: true, id: quote.id });
}
