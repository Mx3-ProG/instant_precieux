import { useState, useEffect } from 'react';
import { pexelsService } from '@/services/pexels';
import type { PexelsSearchResponse } from '@/types/pexels';

interface UsePexelsSearchOptions {
  query: string;
  page?: number;
  per_page?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  enabled?: boolean;
}

interface UsePexelsSearchReturn {
  data: PexelsSearchResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * React hook to search for photos on Pexels
 * @param options - Search options
 * @returns Search results, loading state, error, and refetch function
 */
export function usePexelsSearch({
  query,
  page = 1,
  per_page = 80,
  orientation,
  size,
  color,
  enabled = true,
}: UsePexelsSearchOptions): UsePexelsSearchReturn {
  const [data, setData] = useState<PexelsSearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled || !query) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const searchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pexelsService.searchPhotos(query, {
          page,
          per_page,
          orientation,
          size,
          color,
        });

        if (isMounted) {
          setData(response);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to search photos'));
          setLoading(false);
        }
      }
    };

    searchPhotos();

    return () => {
      isMounted = false;
    };
  }, [query, page, per_page, orientation, size, color, enabled, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}
