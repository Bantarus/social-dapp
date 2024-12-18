import { useQuery } from '@tanstack/react-query';
import { ArchethicService } from '@/services/archethic';
import { HallPost } from './HallPost';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HallZoneProps {
  hallId: string;
  zone: 'fast' | 'cruise' | 'archive';
}

const archethicService = ArchethicService.getInstance();

export function HallZone({ hallId, zone }: HallZoneProps) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', hallId, zone],
    queryFn: () => archethicService.getPostsByZone(zone, hallId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">No posts in this zone yet</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <HallPost
          key={post.id}
          post={post}
          onEngagement={(type) => {
            archethicService.engageWithPost(post.id, type);
          }}
        />
      ))}
    </div>
  );
} 