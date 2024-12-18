import { type Hall } from '@/types/hall';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Hash } from 'lucide-react';

interface HallIconProps extends React.HTMLAttributes<HTMLDivElement> {
  hall: Hall;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function HallIcon({ hall, size = 'md', className, ...props }: HallIconProps) {
  if (hall.icon) {
    return (
      <div className={cn('relative rounded-lg overflow-hidden', sizes[size], className)} {...props}>
        <Image
          src={hall.icon}
          alt={hall.name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-lg bg-muted',
        sizes[size],
        className
      )}
      {...props}
    >
      <Hash className={cn('text-muted-foreground', {
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-8 w-8': size === 'lg',
      })} />
    </div>
  );
} 