import { type Hall } from '@/types/hall';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { HallIcon } from './HallIcon';
import { Badge } from '@/components/ui/badge';

interface HallListProps {
  halls: Hall[];
  currentHallId?: string;
  variant: 'mobile' | 'desktop';
}

export function HallList({ halls, currentHallId, variant }: HallListProps) {
  return (
    <div className="space-y-1">
      {halls?.map((hall) => (
        <Link
          key={hall.id}
          href={`/halls/${hall.id}`}
          className={cn(
            "flex items-center px-3 py-2 rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            currentHallId === hall.id && "bg-accent text-accent-foreground",
            variant === 'mobile' && "text-sm"
          )}
        >
          <div className="flex items-center gap-3">
            <HallIcon hall={hall} size={variant === 'mobile' ? 'sm' : 'md'} />
            <div className="flex flex-col">
              <span className="font-medium">{hall.name}</span>
              {variant === 'desktop' && hall.description && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {hall.description}
                </span>
              )}
            </div>
          </div>
          {hall.metrics.unreadCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {hall.metrics.unreadCount}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );
} 