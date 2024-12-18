'use client';

import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 10);
      
      // When we're at the top, reset direction to up
      if (scrollY < 10) {
        setScrollDirection('up');
        setPrevScrollY(scrollY);
        return;
      }

      const direction = scrollY > prevScrollY ? 'down' : 'up';
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      
      setPrevScrollY(scrollY);
    };

    // Update on mount
    updateScrollDirection();

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, prevScrollY]);

  return { scrollDirection, isAtTop };
} 