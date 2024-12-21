import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { FeaturedHallCard } from '@/components/halls/FeaturedHallCard';
import { RecentActivityItem } from '@/components/halls/RecentActivityItem';
import { ArchethicService } from '@/services/archethic';
import { Hall } from '@/types/hall';
import { Post } from '@/types/post';

async function getFeaturedHalls() {
  const archethicService = await ArchethicService.getInstance();
  return await archethicService.getFeaturedHalls();
}

async function getRecentActivity() {
  const archethicService = await ArchethicService.getInstance();
  return await archethicService.getRecentActivity();
}

export default async function Home() {
  const [featuredHalls, recentActivity] = await Promise.all([
    getFeaturedHalls(),
    getRecentActivity(),
  ]);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h1 className="text-3xl font-bold">Welcome to UnfoldInn</h1>
          <p className="text-muted-foreground">
            A decentralized social platform built on Archethic blockchain, featuring dynamic Speed Zones for content relevance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/halls">
                <Plus className="h-4 w-4 mr-2" />
                Join a Hall
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/halls/create">
                Create Hall
              </Link>
            </Button>
          </div>
        </section>

        {/* Featured Halls Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Halls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredHalls?.map((hall: Hall) => (
              <FeaturedHallCard key={hall.id} hall={hall} />
            ))}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity?.map((activity) => (
              <RecentActivityItem 
                key={activity.post.id} 
                post={activity.post} 
                hall={activity.hall} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 