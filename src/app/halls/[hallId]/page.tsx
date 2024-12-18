import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ArchethicService } from '@/services/archethic';
import { HallPosts } from '@/components/halls/HallPosts';

interface HallPageProps {
  params: {
    hallId: string;
  };
}

async function getHallData(hallId: string) {
  const archethicService = ArchethicService.getInstance();
  const hall = await archethicService.getHall(hallId);
  
  if (!hall) {
    notFound();
  }
  
  return hall;
}

export default async function HallPage({ params }: HallPageProps) {
  const hall = await getHallData(params.hallId);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Hall Header */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{hall.name}</h1>
            <p className="text-muted-foreground">{hall.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {hall.metrics.activeMembers} members
            </div>
          </div>
        </section>

        {/* Hall Content */}
        <Suspense 
          fallback={
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg" />
              <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
          }
        >
          <HallPosts hallId={params.hallId} />
        </Suspense>
      </div>
    </div>
  );
} 