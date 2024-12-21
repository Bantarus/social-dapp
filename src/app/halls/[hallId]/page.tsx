'use client';

import { Suspense, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { HallTabs } from '@/components/halls/HallTabs';
import { HallHeader } from '@/components/halls/HallHeader';
import { useHallsStore } from '@/store/hallsStore';

export default function HallPage() {
  const params = useParams();
  const { currentHall, fetchHall, isLoading, error } = useHallsStore();
  
  useEffect(() => {
    if (!params?.hallId) return;
    
    // Debug logging
    console.log('Raw params:', params);
    console.log('Raw hallId:', params.hallId);
    
    // Get the hallId directly from the URL
    const pathSegments = window.location.pathname.split('/');
    const hallIdFromUrl = pathSegments[pathSegments.length - 1];
    
    console.log('Hall ID from URL:', hallIdFromUrl);
    
    if (hallIdFromUrl) {
      fetchHall(hallIdFromUrl);
    }
  }, [params?.hallId, fetchHall]);

  if (error) {
    console.error('Failed to load hall:', error);
    return <div>Error loading hall</div>;
  }

  if (isLoading || !currentHall) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col gap-6">
        <Suspense 
          fallback={
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          }
        >
          <HallHeader hall={currentHall} />
        </Suspense>

        <Suspense 
          fallback={
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg" />
              <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
          }
        >
          <HallTabs />
        </Suspense>
      </div>
    </div>
  );
} 