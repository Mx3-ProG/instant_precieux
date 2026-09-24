import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const required = ["name", "email", "city", "category", "service_id", "message"];
const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c] || c));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  const body = req.body || {};
  if (body.company) return res.status(200).json({ ok: true });
  if (required.some((key) => !String(body[key] || "").trim())) return res.status(400).json({ error: "Champs requis manquants" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return res.status(400).json({ error: "Email invalide" });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.EMAIL_FROM || "L'instant précieux <onboarding@resend.dev>";
  if (!supabaseUrl || !supabaseKey || !resendKey || !adminEmail) return res.status(503).json({ error: "Service non configuré" });

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  const { data: quote, error } = await supabase.from("quote_requests").insert({
    name: String(body.name).slice(0, 160), email: String(body.email).slice(0, 254), phone: String(body.phone || "").slice(0, 40), city: String(body.city).slice(0, 160), category: String(body.category).slice(0, 160), service_id: String(body.service_id).slice(0, 80), preferred_date: body.preferred_date || null, people_count: Math.max(1, Math.min(50, Number(body.people_count) || 1)), message: String(body.message).slice(0, 5000), status: "nouvelle",
  }).select("id").single();
  if (error || !quote) return res.status(500).json({ error: "Enregistrement impossible" });

  const resend = new Resend(resendKey);
  const safeName = escapeHtml(body.name); const safeCategory = escapeHtml(body.category); const safeCity = escapeHtml(body.city); const safeMessage = escapeHtml(body.message).replace(/\n/g, "<br>");
  const [clientEmail, adminEmailResult] = await Promise.all([
    resend.emails.send({ from, to: body.email, subject: "Votre demande a bien été reçue", html: `<div style="font-family:Arial,sans-serif;color:#27221d;max-width:560px;margin:auto"><p style="color:#ad9362;text-transform:uppercase;letter-spacing:2px;font-size:12px">L'instant précieux</p><h1 style="font-family:Georgia,serif;font-weight:normal">Merci ${safeName}</h1><p>Nous avons bien reçu votre demande pour une séance <strong>${safeCategory}</strong>. Nous revenons vers vous rapidement avec une réponse personnalisée.</p><p>À très bientôt,<br>L'instant précieux</p></div>` }, { headers: { "Idempotency-Key": `quote-client-${quote.id}` } }),
    resend.emails.send({ from, to: adminEmail, replyTo: body.email, subject: `Nouvelle demande — ${body.name}`, html: `<div style="font-family:Arial,sans-serif;color:#27221d"><h1 style="font-family:Georgia,serif;font-weight:normal">Nouvelle demande de devis</h1><p><strong>Client :</strong> ${safeName}<br><strong>Email :</strong> ${escapeHtml(body.email)}<br><strong>Téléphone :</strong> ${escapeHtml(body.phone)}<br><strong>Commune :</strong> ${safeCity}<br><strong>Catégorie :</strong> ${safeCategory}<br><strong>Formule :</strong> ${escapeHtml(body.service_id)}</p><p>${safeMessage}</p><p>Référence : ${quote.id}</p></div>` }, { headers: { "Idempotency-Key": `quote-admin-${quote.id}` } }),
  ]);
  if (clientEmail.error || adminEmailResult.error) return res.status(502).json({ error: "Demande enregistrée, email non envoyé", id: quote.id });
  return res.status(200).json({ ok: true, id: quote.id });
}
