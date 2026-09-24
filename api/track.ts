import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const payloadSchema = z.object({
  path: z.string().max(180).regex(/^\//).refine((path) => !path.startsWith("/admin")),
  page_title: z.string().max(120),
  visitor_id: z.string().max(80),
});

function readHeader(req: VercelRequest, name: string) {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function decodeLocation(value: string | undefined, maxLength: number) {
  if (!value) return null;
  try {
    return decodeURIComponent(value).slice(0, maxLength);
  } catch {
    return value.slice(0, maxLength);
  }
}

function readCoordinate(value: string | undefined, min: number, max: number) {
  const coordinate = Number(value);
  if (!Number.isFinite(coordinate) || coordinate < min || coordinate > max) return null;
  return Math.round(coordinate * 10) / 10;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return res.status(503).json({ ok: false });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const baseView = { ...parsed.data, referrer: String(req.headers.referer || "").slice(0, 300) };
  const countryCode = readHeader(req, "x-vercel-ip-country")?.toUpperCase();
  const geography = {
    country_code: countryCode && /^[A-Z]{2}$/.test(countryCode) ? countryCode : null,
    region: decodeLocation(readHeader(req, "x-vercel-ip-country-region"), 80),
    city: decodeLocation(readHeader(req, "x-vercel-ip-city"), 120),
    latitude: readCoordinate(readHeader(req, "x-vercel-ip-latitude"), -90, 90),
    longitude: readCoordinate(readHeader(req, "x-vercel-ip-longitude"), -180, 180),
  };
  let { error } = await supabase.from("page_views").insert({ ...baseView, ...geography });
  if (error && /(country_code|region|city|latitude|longitude)/i.test(error.message)) {
    ({ error } = await supabase.from("page_views").insert(baseView));
  }
  if (error) return res.status(500).json({ ok: false });
  return res.status(201).json({ ok: true });
}
