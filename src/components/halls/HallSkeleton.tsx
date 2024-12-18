import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface HallSkeletonProps {
  className?: string;
}

export function HallSkeleton({ className }: HallSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
      <Skeleton className="h-4 w-[60%]" />
    </div>
  );
} 