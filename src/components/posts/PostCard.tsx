import { Post } from '@/types/post';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, Clock, MessageSquare, GitBranch, Repeat, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryColors = {
  text: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  thread: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  echo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  guide: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
} as const;

const categoryIcons = {
  text: MessageSquare,
  thread: GitBranch,
  echo: Repeat,
  guide: BookOpen,
} as const;

interface PostCardProps {
  post: Post;
  className?: string;
  onEngagement?: (type: 'like' | 'comment' | 'echo') => void;
}

export function PostCard({ post, className, onEngagement }: PostCardProps) {
  console.log('PostCard received post:', post); // Debug entire post
  console.log('Post metadata:', post.metadata); // Debug metadata specifically
  console.log('Post tags:', post.metadata?.tags); // Debug tags array
  
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
            {post.author.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">@{post.author.username}</span>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {/* Add time calculation here */}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-xs text-gray-500">
          Debug: Has tags? {post.metadata?.tags ? 'Yes' : 'No'}, 
          Tags length: {post.metadata?.tags?.length || 0}
        </div>

        {post.metadata?.tags && post.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.metadata.tags.map((tag) => {
              console.log('Rendering tag:', tag); // Debug individual tag rendering
              return (
                <Badge 
                  key={tag}
                  variant="secondary" 
                  className="text-xs"
                >
                  #{tag}
                </Badge>
              );
            })}
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
      </CardContent>

      <CardFooter className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEngagement?.('like')}
        >
          <Heart className="h-4 w-4 mr-1" />
          {post.engagement.likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEngagement?.('comment')}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.engagement.comments}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEngagement?.('echo')}
        >
          <Share className="h-4 w-4 mr-1" />
          {post.engagement.echoes}
        </Button>
      </CardFooter>
    </Card>
  );
} 