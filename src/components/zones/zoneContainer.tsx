'use client';

import React from 'react';
import { Clock, Flame, Archive, TrendingUp, Heart, MessageCircle, Share, MessageSquare, GitBranch, Repeat, BookOpen } from 'lucide-react';
import { CreatePost } from '@/components/posts/CreatePost';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { useEnergyStore } from '@/store/energyStore';
import { toast } from '@/components/ui/use-toast';
import { ZoneType } from '@/store/zoneStore';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { PostCard } from '@/components/posts/PostCard';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

const calculatePostAge = (timestamp: string): { zone: ZoneType; timeLeft: number } => {
  const now = Date.now();
  const age = now - new Date(timestamp).getTime();
  const hoursOld = age / (1000 * 60 * 60);
  
  if (hoursOld < 24) return { zone: 'fast', timeLeft: 24 - hoursOld };
  if (hoursOld < 72) return { zone: 'cruise', timeLeft: 72 - hoursOld };
  return { zone: 'archive', timeLeft: 0 };
};

const ZoneIcons = {
  fast: Flame,
  cruise: TrendingUp,
  archive: Archive,
} as const;

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

const ZoneNavigation = ({ 
  currentZone, 
  setCurrentZone, 
  posts, 
  className 
}: { 
  currentZone: ZoneType; 
  setCurrentZone: (zone: ZoneType) => void; 
  posts: any[];
  className?: string;
}) => (
  <div className={cn("w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b", className)}>
    <div className="max-w-4xl mx-auto">
      <div className="flex space-x-4 p-4">
        {(['fast', 'cruise', 'archive'] as const).map((zone) => {
          const Icon = ZoneIcons[zone];
          const postCount = posts?.filter(p => p.zone === zone).length ?? 0;
          const engagementCount = posts
            ?.filter(p => p.zone === zone)
            .reduce((acc, post) => 
              acc + post.engagement.likes + post.engagement.echoes + post.engagement.comments, 
              0
            ) ?? 0;

          return (
            <button
              key={zone}
              onClick={() => setCurrentZone(zone)}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg transition-colors",
                currentZone === zone
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {zone.charAt(0).toUpperCase() + zone.slice(1)} Lane
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {postCount} posts · {engagementCount} engagements
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const ZoneContainer = () => {
  const [currentZone, setCurrentZone] = React.useState<ZoneType>('fast');
  const { useEnergy, actionCosts } = useEnergyStore();
  const { posts, isLoading, engageWithPost } = usePosts(currentZone);
  const { scrollDirection, isAtTop } = useScrollDirection();

  const handleEngagement = async (postId: string, type: 'like' | 'echo' | 'comment') => {
    if (!useEnergy(actionCosts[type])) {
      toast({
        title: "Not enough energy",
        description: "Please wait for your energy to regenerate.",
        variant: "destructive",
      });
      return;
    }

    try {
      await engageWithPost.mutateAsync({ postId, type });
    } catch (error) {
      console.error('Failed to engage with post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Static Navigation */}
      <div className="sticky top-0 z-40">
        <ZoneNavigation 
          currentZone={currentZone} 
          setCurrentZone={setCurrentZone} 
          posts={posts || []}
        />
      </div>

      {/* Floating Navigation */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300",
          scrollDirection === 'up' && !isAtTop ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <ZoneNavigation 
          currentZone={currentZone} 
          setCurrentZone={setCurrentZone} 
          posts={posts || []}
        />
      </div>

      {/* Content */}
      <div className="space-y-6 pt-4">
        {/* Create Post Form */}
        {currentZone === 'fast' && <CreatePost />}

        {/* Posts Display */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-0 pb-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </CardFooter>
              </Card>
            ))
          ) : (
            posts?.map((post) => {
              const { timeLeft } = calculatePostAge(post.timestamp);
              
              return (
                <PostCard 
                  key={post.id}
                  post={post}
                  className={cn(
                    post.zone === 'fast' && "border-l-4 border-yellow-500"
                  )}
                  onEngagement={(type) => handleEngagement(post.id, type)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoneContainer;