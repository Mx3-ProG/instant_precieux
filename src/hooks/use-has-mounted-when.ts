import { useState, useEffect } from "react";

export function useHasMountedWhen(delay = 10): boolean {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasMounted(true), delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return hasMounted;
}
