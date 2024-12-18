'use client';

import { useQuery } from '@tanstack/react-query';
import { ArchethicService } from '@/services/archethic';
import { HallPosts } from './HallPosts';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HallZoneProps {
  hallId: string;
  zone: 'fast' | 'cruise' | 'archive';
}

export function HallZone({ hallId, zone }: HallZoneProps) {
  return (
    <div className="space-y-6">
      {zone === 'fast' && (
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      )}
      <HallPosts hallId={hallId} zone={zone} />
    </div>
  );
} 