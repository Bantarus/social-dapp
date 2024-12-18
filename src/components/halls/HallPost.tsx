import { type Post } from '@/types/post';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface HallPostProps {
  post: Post;
  className?: string;
  onEngagement?: (type: 'like' | 'comment' | 'echo') => void;
}

export function HallPost({ post, className, onEngagement }: HallPostProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author.username}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                </span>
              </div>
              {post.metadata.type !== 'text' && (
                <div className="text-xs text-muted-foreground uppercase">
                  {post.metadata.type}
                </div>
              )}
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {post.content}
            </div>
            {post.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
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
      <CardFooter className="px-6 py-4 border-t bg-muted/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onEngagement?.('like')}>
            <Heart className="h-4 w-4 mr-1" />
            {post.engagement.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEngagement?.('comment')}>
            <MessageCircle className="h-4 w-4 mr-1" />
            {post.engagement.comments}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEngagement?.('echo')}>
            <Share className="h-4 w-4 mr-1" />
            {post.engagement.echoes}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 