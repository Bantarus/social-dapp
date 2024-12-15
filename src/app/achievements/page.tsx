import { AchievementsContainer } from '@/components/achievements/AchievementsContainer';

export default function AchievementsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">Track your progress and earn rewards</p>
        </div>
        
        <AchievementsContainer />
      </div>
    </main>
  );
} 