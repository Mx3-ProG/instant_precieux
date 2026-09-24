import { supabase } from "@/lib/supabase";
import { getCookieConsent } from "@/lib/cookieConsent";

export type PageView = {
  id: string;
  path: string;
  page_title: string;
  visitor_id: string;
  created_at: string;
  country_code?: string | null;
  region?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

const STORAGE_KEY = "instant-precieux-page-views";
const VISITOR_KEY = "instant-precieux-visitor";

function getVisitorId() {
  const current = localStorage.getItem(VISITOR_KEY);
  if (current) return current;
  const id = globalThis.crypto?.randomUUID?.() || `visitor-${Date.now()}`;
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

export function getLocalPageViews(): PageView[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PageView[];
  } catch {
    return [];
  }
}

export function trackPageView(path: string, pageTitle: string) {
  if (path.startsWith("/admin") || getCookieConsent() !== "accepted") return;
  const event: PageView = {
    id: globalThis.crypto?.randomUUID?.() || `view-${Date.now()}`,
    path,
    page_title: pageTitle,
    visitor_id: getVisitorId(),
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...getLocalPageViews()].slice(0, 1000)));
  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => undefined);
}

export function clearLocalAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VISITOR_KEY);
}

export async function loadPageViews(): Promise<PageView[]> {
  if (!supabase) return getLocalPageViews();
  let result = await supabase.from("page_views").select("id,path,page_title,visitor_id,created_at,country_code,region,city,latitude,longitude").order("created_at", { ascending: false }).limit(5000);
  if (result.error && /(country_code|region|city|latitude|longitude)/i.test(result.error.message)) {
    result = await supabase.from("page_views").select("id,path,page_title,visitor_id,created_at").order("created_at", { ascending: false }).limit(5000);
  }
  if (result.error || !result.data.length) return getLocalPageViews();
  return result.data as PageView[];
}
