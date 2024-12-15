'use client';

import { useQuery } from '@tanstack/react-query';
import { AchievementCard } from './AchievementCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Achievement } from '@/types/achievement';
import { ArchethicService } from '@/services/archethic';
import { useAchievementStore } from '@/store/achievementStore';
import { useEffect } from 'react';

export function AchievementsContainer() {
  const { setAchievements, selectedType, setSelectedType, getFilteredAchievements } = useAchievementStore();

  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: () => ArchethicService.getInstance().getAchievements(),
  });

  useEffect(() => {
    if (achievements) {
      setAchievements(achievements);
    }
  }, [achievements, setAchievements]);

  const filteredAchievements = getFilteredAchievements();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)} className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="chain">Chains</TabsTrigger>
        <TabsTrigger value="milestone">Milestones</TabsTrigger>
        <TabsTrigger value="event">Events</TabsTrigger>
      </TabsList>

      <TabsContent value={selectedType} className="mt-4">
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
} 