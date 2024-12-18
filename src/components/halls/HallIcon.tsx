'use client';

import { type Hall } from '@/types/hall';
import { cn } from '@/lib/utils';
import { Hash } from 'lucide-react';

interface HallIconProps {
  hall: Hall;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const;

export function HallIcon({ hall, size = 'md' }: HallIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-muted",
        sizeClasses[size]
      )}
    >
      {hall.icon ? (
        <img
          src={hall.icon}
          alt={`${hall.name} icon`}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <Hash className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
} 