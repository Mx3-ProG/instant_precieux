import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { AppointmentInfo, QuoteInfo } from "./emails.js";

type EmailResult = { error?: unknown };

/** Exécute un lot d'emails et signale explicitement tout refus de Resend. */
export async function sendEmails(sends: Array<() => Promise<EmailResult>>) {
  const results = await Promise.all(sends.map((send) => send()));
  return results.every((result) => !result.error);
}

export function serverConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!supabaseUrl || !supabaseKey || !resendKey || !adminEmail) return null;
  return {
    supabase: createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }),
    resend: new Resend(resendKey),
    adminEmail,
    from: process.env.EMAIL_FROM || "L'instant précieux <onboarding@resend.dev>",
    siteUrl: String(process.env.SITE_URL || "https://linstantprecieux.fr").replace(/\/$/, ""),
  };
}

/** Charge une demande avec le nom et le prix de la formule choisie. */
export async function loadQuote(supabase: SupabaseClient, filter: { id: string } | { token: string }) {
  const query = supabase.from("quote_requests").select("*, services(name, price)");
  const { data, error } = await ("id" in filter ? query.eq("id", filter.id) : query.eq("appointment_token", filter.token)).maybeSingle();
  if (error || !data) return null;
  const service = data.services as { name: string; price: number } | null;
  return { row: data, info: { ...data, service_name: service?.name ?? null, service_price: service?.price ?? null } as QuoteInfo };
}

type AppointmentRow = { appointment_at?: string | null; appointment_duration?: number | null; appointment_location?: string | null; appointment_note?: string | null; city: string };
export function appointmentOf(row: AppointmentRow): AppointmentInfo | null {
  if (!row.appointment_at) return null;
  return { at: row.appointment_at, duration: row.appointment_duration || 90, location: row.appointment_location || row.city, note: row.appointment_note };
}

/** Vérifie que l'appel vient d'un administrateur connecté (jeton Supabase dans l'en-tête Authorization). */
export async function isAdmin(supabase: SupabaseClient, authorization: string | undefined) {
  const token = authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const { data } = await supabase.auth.getUser(token);
  return data.user?.app_metadata?.role === "admin";
}
