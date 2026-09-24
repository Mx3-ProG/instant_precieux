import { createClient } from "@supabase/supabase-js";
import type { GalleryItem, Service } from "@/content";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const hasSupabase = Boolean(url && key);
export const supabase = hasSupabase ? createClient(url!, key!) : null;

export async function loadPublicContent() {
  if (!supabase) return null;
  const [serviceResult, galleryResult] = await Promise.all([
    supabase.from("services").select("*").eq("published", true).order("sort_order"),
    supabase.from("gallery_items").select("*").eq("published", true).order("sort_order"),
  ]);
  if (serviceResult.error || galleryResult.error) return null;
  return {
    services: serviceResult.data.map((row) => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      description: row.description,
      photoCount: row.photo_count,
      usbIncluded: row.usb_included,
      published: row.published,
    })) as Service[],
    gallery: galleryResult.data as GalleryItem[],
  };
}

export async function signInAdmin(email: string, password: string) {
  if (!supabase) return { demo: true };
  const result = await supabase.auth.signInWithPassword({ email, password });
  if (result.error) throw result.error;
  if (result.data.user?.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("Ce compte n'a pas accès à l'administration.");
  }
  return { demo: false };
}

export async function saveRow(table: "services" | "gallery_items", row: Record<string, unknown>) {
  if (!supabase) return null;
  const result = await supabase.from(table).upsert(row).select().single();
  if (result.error) throw result.error;
  return result.data;
}

export async function deleteRow(table: "services" | "gallery_items", id: string) {
  if (!supabase) return;
  const result = await supabase.from(table).delete().eq("id", id);
  if (result.error) throw result.error;
}

async function optimizeImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Impossible de préparer cette image.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Conversion impossible.")), "image/webp", 0.86));
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture de l’image impossible."));
    reader.readAsDataURL(file);
  });
}

export async function uploadGalleryImage(file: File) {
  const optimized = await optimizeImage(file);
  if (!supabase) return fileToDataUrl(optimized);
  const path = `portfolio/${Date.now()}-${crypto.randomUUID()}.webp`;
  const result = await supabase.storage.from("gallery").upload(path, optimized, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
  if (result.error) throw result.error;
  return supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}

export async function deleteGalleryImage(publicUrl: string) {
  if (!supabase || !publicUrl.includes("/storage/v1/object/public/gallery/")) return;
  const path = decodeURIComponent(publicUrl.split("/storage/v1/object/public/gallery/")[1] || "");
  if (!path) return;
  const result = await supabase.storage.from("gallery").remove([path]);
  if (result.error) throw result.error;
}

export async function loadQuotes() {
  if (!supabase) return [];
  const result = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
  if (result.error) throw result.error;
  return result.data;
}

export async function updateQuoteStatus(id: string, status: string) {
  if (!supabase) return;
  const result = await supabase.from("quote_requests").update({ status }).eq("id", id);
  if (result.error) throw result.error;
}
