import type {
  PexelsCollectionResponse,
  PexelsSearchResponse,
  PexelsPhoto,
  PexelsCollectionMedia
} from '@/types/pexels';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_API_BASE = 'https://api.pexels.com/v1';

class PexelsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${PEXELS_API_BASE}${endpoint}`, {
      headers: {
        Authorization: this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get photos from a specific collection
   * @param collectionId - The collection ID (e.g., 'yxiptwp' from the URL)
   * @param options - Pagination options
   */
  async getCollection(
    collectionId: string,
    options: { page?: number; per_page?: number; type?: 'photos' | 'videos' } = {}
  ): Promise<PexelsCollectionResponse> {
    const { page = 1, per_page = 80, type } = options;
    const typeParam = type ? `&type=${type}` : '';
    return this.fetch<PexelsCollectionResponse>(
      `/collections/${collectionId}?page=${page}&per_page=${per_page}${typeParam}`
    );
  }

  /**
   * Search for photos
   * @param query - Search query
   * @param options - Search and pagination options
   */
  async searchPhotos(
    query: string,
    options: {
      page?: number;
      per_page?: number;
      orientation?: 'landscape' | 'portrait' | 'square';
      size?: 'large' | 'medium' | 'small';
      color?: string;
    } = {}
  ): Promise<PexelsSearchResponse> {
    const { page = 1, per_page = 15, orientation, size, color } = options;
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: per_page.toString(),
    });

    if (orientation) params.append('orientation', orientation);
    if (size) params.append('size', size);
    if (color) params.append('color', color);

    return this.fetch<PexelsSearchResponse>(`/search?${params.toString()}`);
  }

  /**
   * Get curated photos
   * @param options - Pagination options
   */
  async getCurated(options: { page?: number; per_page?: number } = {}): Promise<PexelsSearchResponse> {
    const { page = 1, per_page = 15 } = options;
    return this.fetch<PexelsSearchResponse>(`/curated?page=${page}&per_page=${per_page}`);
  }

  /**
   * Get a specific photo by ID
   * @param photoId - The photo ID
   */
  async getPhoto(photoId: number): Promise<PexelsPhoto> {
    return this.fetch<PexelsPhoto>(`/photos/${photoId}`);
  }

  /**
   * Convert Pexels collection media to gallery format
   */
  convertToGalleryImages(media: PexelsCollectionMedia[]) {
    return media
      .filter((item) => item.type === 'Photo')
      .map((item) => ({
        src: item.src?.large2x || item.src?.large || '',
        alt: item.alt || `Photo by ${item.photographer}`,
        photographer: item.photographer || 'Unknown',
        photographer_url: item.photographer_url || '',
        pexels_url: item.url,
      }));
  }

  /**
   * Convert Pexels search photos to gallery format
   */
  convertSearchToGalleryImages(photos: PexelsPhoto[]) {
    return photos.map((photo) => ({
      src: photo.src.large2x || photo.src.large,
      alt: photo.alt || `Photo by ${photo.photographer}`,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      pexels_url: photo.url,
    }));
  }

  /**
   * Get multiple photos by their IDs
   * @param photoIds - Array of photo IDs
   */
  async getPhotosByIds(photoIds: number[]): Promise<PexelsPhoto[]> {
    const photos = await Promise.all(
      photoIds.map(id => this.getPhoto(id))
    );
    return photos;
  }

  /**
   * Convert photos to portfolio project format
   */
  convertPhotosToProjectImages(photos: PexelsPhoto[]) {
    return photos.map((photo) => ({
      src: photo.src.large2x || photo.src.large,
      alt: photo.alt || `Photo by ${photo.photographer}`,
    }));
  }

}

// Create and export a singleton instance
export const pexelsService = new PexelsService(PEXELS_API_KEY);
