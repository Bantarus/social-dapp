'use client';

import { Achievement } from '@/types/achievement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
  const getIcon = () => {
    switch (achievement.type) {
      case 'chain':
        return <Trophy className="h-4 w-4" />;
      case 'milestone':
        return <Star className="h-4 w-4" />;
      case 'event':
        return <Zap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "p-1.5 rounded-full",
            achievement.progress === 100 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          )}>
            {getIcon()}
          </div>
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
        </div>
        <CardDescription>{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={achievement.progress} className="h-2" />
          
          <div className="space-y-2">
            {achievement.requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className={cn(
                  req.completed ? "text-green-600" : "text-gray-600"
                )}>
                  {req.type} ({req.count})
                </span>
                {req.completed && <Badge variant="secondary">Completed</Badge>}
              </div>
            ))}
          </div>

          {achievement.rewards && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-2">Rewards</h4>
              <div className="flex flex-wrap gap-2">
                {achievement.rewards.energyBoost && (
                  <Badge variant="outline" className="bg-blue-50">
                    +{achievement.rewards.energyBoost} Energy Boost
                  </Badge>
                )}
                {achievement.rewards.maxEnergyIncrease && (
                  <Badge variant="outline" className="bg-purple-50">
                    +{achievement.rewards.maxEnergyIncrease} Max Energy
                  </Badge>
                )}
                {achievement.rewards.influencePoints && (
                  <Badge variant="outline" className="bg-yellow-50">
                    +{achievement.rewards.influencePoints} Influence
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 