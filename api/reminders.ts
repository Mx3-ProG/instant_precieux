import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clientAppointmentReminder } from "./_lib/emails.js";
import { appointmentOf, loadQuote, serverConfig } from "./_lib/server.js";

/** Tâche planifiée (vercel.json → crons) : rappel la veille de chaque séance confirmée. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: "Non autorisé" });
  const config = serverConfig();
  if (!config) return res.status(503).json({ error: "Service non configuré" });
  const { supabase, resend, adminEmail, from, siteUrl } = config;

  const now = Date.now();
  const { data, error } = await supabase
    .from("quote_requests")
    .select("id")
    .eq("appointment_status", "confirmee")
    .is("reminder_sent_at", null)
    .gte("appointment_at", new Date(now + 12 * 3600_000).toISOString())
    .lt("appointment_at", new Date(now + 36 * 3600_000).toISOString());
  if (error) return res.status(500).json({ error: "Lecture impossible" });

  let sent = 0;
  for (const { id } of data) {
    const loaded = await loadQuote(supabase, { id });
    const appt = loaded && appointmentOf(loaded.row);
    if (!loaded || !appt) continue;
    const result = await resend.emails.send({ from, to: loaded.info.email, replyTo: adminEmail, ...clientAppointmentReminder(loaded.info, appt, siteUrl) }, { headers: { "Idempotency-Key": `appt-reminder-${id}-${appt.at}` } });
    if (result.error) continue;
    await supabase.from("quote_requests").update({ reminder_sent_at: new Date().toISOString() }).eq("id", id);
    sent++;
  }
  return res.status(200).json({ ok: true, sent });
}
