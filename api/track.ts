import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const payloadSchema = z.object({
  path: z.string().max(180).regex(/^\//).refine((path) => !path.startsWith("/admin")),
  page_title: z.string().max(120),
  visitor_id: z.string().max(80),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return res.status(503).json({ ok: false });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("page_views").insert({ ...parsed.data, referrer: String(req.headers.referer || "").slice(0, 300) });
  if (error) return res.status(500).json({ ok: false });
  return res.status(201).json({ ok: true });
}
