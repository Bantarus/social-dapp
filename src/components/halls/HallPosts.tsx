'use client';

import { useQuery } from '@tanstack/react-query';
import { ArchethicService } from '@/services/archethic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { HallPost } from './HallPost';
import { useState } from 'react';

interface HallPostsProps {
  hallId: string;
}

const archethicService = ArchethicService.getInstance();

export function HallPosts({ hallId }: HallPostsProps) {
  const { isMobile } = useMediaQuery();
  const [currentZone, setCurrentZone] = useState<'fast' | 'cruise' | 'archive'>('fast');
  
  const zones = [
    { value: 'fast', label: 'Fast Lane' },
    { value: 'cruise', label: 'Cruise' },
    { value: 'archive', label: 'Archive' },
  ] as const;

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', hallId, currentZone],
    queryFn: () => archethicService.getPostsByZone(currentZone, hallId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Tabs 
      defaultValue="fast" 
      className="w-full"
      onValueChange={(value) => setCurrentZone(value as typeof currentZone)}
    >
      <TabsList className="w-full justify-start">
        {zones.map((zone) => (
          <TabsTrigger
            key={zone.value}
            value={zone.value}
            className={cn(
              isMobile && "text-sm px-3",
              "flex-1 max-w-[200px]"
            )}
          >
            {zone.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={currentZone} className="mt-6">
        <div className="space-y-6">
          {posts?.map((post) => (
            <HallPost
              key={post.id}
              post={post}
              onEngagement={(type) => {
                archethicService.engageWithPost(post.id, type);
              }}
            />
          ))}
          {!posts?.length && (
            <div className="text-center py-12 text-muted-foreground">
              No posts in this zone yet
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
} 