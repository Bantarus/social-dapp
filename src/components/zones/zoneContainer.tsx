'use client';

import React from 'react';
import { Clock, Flame, Archive, TrendingUp, Heart, MessageCircle, Share } from 'lucide-react';
import { CreatePost } from '@/components/posts/CreatePost';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { useEnergyStore } from '@/store/energyStore';
import { toast } from '@/components/ui/use-toast';
import { ZoneType } from '@/store/zoneStore';

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

const ZoneContainer = () => {
  const [currentZone, setCurrentZone] = React.useState<ZoneType>('fast');
  const { useEnergy, actionCosts } = useEnergyStore();
  const { posts, isLoading, engageWithPost } = usePosts(currentZone);

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Zone Navigation */}
      <div className="flex space-x-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
        {(['fast', 'cruise', 'archive'] as const).map((zone) => {
          const Icon = ZoneIcons[zone];
          const postCount = posts.filter(p => p.zone === zone).length;
          const engagementCount = posts
            .filter(p => p.zone === zone)
            .reduce((acc, post) => 
              acc + post.engagement.likes + post.engagement.echoes + post.engagement.comments, 
              0
            );

          return (
            <button
              key={zone}
              onClick={() => setCurrentZone(zone)}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                currentZone === zone
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
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

      {/* Create Post Form */}
      {currentZone === 'fast' && <CreatePost />}

      {/* Posts Display */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => {
            const { timeLeft } = calculatePostAge(post.timestamp);
            
            return (
              <div 
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {post.author.username[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">@{post.author.username}</span>
                      {currentZone !== 'archive' && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeLeft.toFixed(1)}h remaining
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{post.content}</p>
                    <div className="mt-3 flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEngagement(post.id, 'like')}
                        disabled={engageWithPost.isPending}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        {post.engagement.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEngagement(post.id, 'comment')}
                        disabled={engageWithPost.isPending}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.engagement.comments}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEngagement(post.id, 'echo')}
                        disabled={engageWithPost.isPending}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        {post.engagement.echoes}
                      </Button>
                      {currentZone === 'fast' && (
                        <span className="text-xs text-gray-500">
                          {post.metrics.engagementVelocity.toFixed(1)} eng/hr
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ZoneContainer;