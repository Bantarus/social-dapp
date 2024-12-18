'use client';

import { useQuery } from '@tanstack/react-query';
import { ArchethicService } from '@/services/archethic';
import { HallPost } from './HallPost';
import { useState } from 'react';

interface HallPostsProps {
  hallId: string;
  zone: 'fast' | 'cruise' | 'archive';
}

const archethicService = ArchethicService.getInstance();

export function HallPosts({ hallId, zone }: HallPostsProps) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', hallId, zone],
    queryFn: () => archethicService.getPostsByZone(zone, hallId),
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
  );
} 