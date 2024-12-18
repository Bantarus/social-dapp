import { Suspense } from 'react';
import { HallContent } from '@/components/halls/HallContent';

interface HallPageProps {
  params: {
    hallId: string;
  };
}

export default async function HallPage({ 
  params: { hallId }, 
}: HallPageProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      }
    >
      <HallContent hallId={hallId} />
    </Suspense>
  );
} 