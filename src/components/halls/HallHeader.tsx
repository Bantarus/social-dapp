'use client';

import { type Hall } from '@/types/hall';
import { HallIcon } from './HallIcon';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Settings, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HallHeaderProps {
  hall: Hall;
}

export function HallHeader({ hall }: HallHeaderProps) {
  const { isMobile } = useMediaQuery();

  if (!hall) {
    return <HallHeaderSkeleton />;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <HallIcon hall={hall} size="lg" />
        <div>
          <h1 className="text-2xl font-bold">{hall.name}</h1>
          {!isMobile && (
            <p className="text-muted-foreground">{hall.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Users className="h-4 w-4" />
          <span className="sr-only">Members</span>
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </div>
  );
}

function HallHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  );
} 