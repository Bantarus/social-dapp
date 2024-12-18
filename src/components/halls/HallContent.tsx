'use client';

import { HallHeader } from '@/components/halls/HallHeader';
import { HallTabs } from '@/components/halls/HallTabs';
import { ArchethicService } from '@/services/archethic';
import { type Hall } from '@/types/hall';
import { useQuery } from '@tanstack/react-query';

interface HallContentProps {
  hallId: string;
  initialHall: Hall;
}

const archethicService = ArchethicService.getInstance();

export function HallContent({ hallId, initialHall }: HallContentProps) {
  const { data: hall, isLoading } = useQuery({
    queryKey: ['hall', hallId],
    queryFn: () => archethicService.getHall(hallId),
    initialData: initialHall,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg" />
        <div className="h-96 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!hall) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <HallHeader hall={hall} />
      <HallTabs hallId={hall.id} />
    </div>
  );
} 