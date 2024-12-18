import { type Post } from '@/types/post';
import { Card, CardContent } from '@/components/ui/card';
import { HallIcon } from './HallIcon';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface MinimalHall {
  id: string;
  name: string;
  icon?: string;
  description: string;
  metrics: {
    totalPosts: number;
    activeMembers: number;
    energyPool: number;
    unreadCount: number;
  };
  members: {
    address: string;
    role: 'member' | 'moderator' | 'admin';
    reputation: number;
  }[];
  settings: {
    isPrivate: boolean;
    requiresApproval: boolean;
    minimumReputation: number;
  };
}

interface RecentActivityItemProps {
  post: Post;
  hall: MinimalHall;
}

export function RecentActivityItem({ post, hall }: RecentActivityItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <HallIcon hall={hall} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <Link 
                href={`/halls/${hall.id}`}
                className="font-medium hover:underline"
              >
                {hall.name}
              </Link>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="mt-1 text-sm line-clamp-2">
              {post.content}
            </p>
            {post.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.metadata.tags.map((tag) => (
                  <div
                    key={tag}
                    className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 