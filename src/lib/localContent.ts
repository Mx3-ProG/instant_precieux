import type { GalleryItem, Service } from "@/content";

const SERVICE_KEY = "instant-precieux-services";
const GALLERY_KEY = "instant-precieux-gallery";

function read<T>(key: string, fallback: T) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function loadLocalContent(fallback: { services: Service[]; gallery: GalleryItem[] }) {
  return { services: read(SERVICE_KEY, fallback.services), gallery: read(GALLERY_KEY, fallback.gallery) };
}

export function saveLocalServices(services: Service[]) {
  localStorage.setItem(SERVICE_KEY, JSON.stringify(services));
}

export function saveLocalGallery(gallery: GalleryItem[]) {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
  } catch {
    throw new Error("Le stockage de démonstration est plein. Connectez Supabase pour conserver davantage d’images.");
  }
}
