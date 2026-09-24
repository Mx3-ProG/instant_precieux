import { useState, useEffect, useMemo } from 'react';
import { pexelsService } from '@/services/pexels';
import type { PexelsPhoto } from '@/types/pexels';

interface UsePexelsPhotosByIdsReturn {
  photos: PexelsPhoto[] | null;
  loading: boolean;
  error: Error | null;
}

export function usePexelsPhotosByIds(photoIds: number[]): UsePexelsPhotosByIdsReturn {
  const [photos, setPhotos] = useState<PexelsPhoto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stabilize the photoIds array to prevent unnecessary re-fetches
  const ids = useMemo(() => photoIds, [photoIds.join(',')]);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setPhotos(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await pexelsService.getPhotosByIds(ids);

        if (!cancelled) {
          setPhotos(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch photos'));
          setLoading(false);
        }
      }
    };

    fetchPhotos();

    return () => {
      cancelled = true;
    };
  }, [ids]);

  return { photos, loading, error };
}
