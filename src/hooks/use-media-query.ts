'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Create the media query list
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    // Initial check
    setIsMobile(mediaQuery.matches);

    // Add listener for changes
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return { isMobile };
} 