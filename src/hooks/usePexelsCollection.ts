import { useState, useEffect } from 'react';
import { pexelsService } from '@/services/pexels';
import type { PexelsCollectionResponse } from '@/types/pexels';

interface UsePexelsCollectionOptions {
  collectionId: string;
  page?: number;
  per_page?: number;
  type?: 'photos' | 'videos';
  enabled?: boolean;
}

interface UsePexelsCollectionReturn {
  data: PexelsCollectionResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * React hook to fetch photos/videos from a Pexels collection
 * @param options - Collection fetch options
 * @returns Collection data, loading state, error, and refetch function
 */
export function usePexelsCollection({
  collectionId,
  page = 1,
  per_page = 80,
  type,
  enabled = true,
}: UsePexelsCollectionOptions): UsePexelsCollectionReturn {
  const [data, setData] = useState<PexelsCollectionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await pexelsService.getCollection(collectionId, {
          page,
          per_page,
          type,
        });

        if (isMounted) {
          setData(response);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch collection'));
          setLoading(false);
        }
      }
    };

    fetchCollection();

    return () => {
      isMounted = false;
    };
  }, [collectionId, page, per_page, type, enabled, refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}
