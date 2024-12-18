import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ArchethicService } from '@/services/archethic';
import { HallTabs } from '@/components/halls/HallTabs';
import { HallHeader } from '@/components/halls/HallHeader';

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
        <HallHeader hall={hall} />

        {/* Hall Content with Tabs */}
        <Suspense 
          fallback={
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg" />
              <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
          }
        >
          <HallTabs hallId={params.hallId} />
        </Suspense>
      </div>
    </div>
  );
} 