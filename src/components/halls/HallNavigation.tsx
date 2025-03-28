'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { MobileHallNav } from './MobileHallNav';
import { DesktopHallNav } from './DesktopHallNav';
import { useHalls } from '@/hooks/halls/use-halls';
import { HallSkeleton } from './HallSkeleton';

interface HallNavigationProps {
  currentHallId?: string;
}

export function HallNavigation({ currentHallId }: HallNavigationProps) {
  const { data: halls, isLoading } = useHalls();
  const { isMobile } = useMediaQuery();

  if (isLoading) {
    return (
      <div className="hidden lg:flex flex-col w-60 shrink-0 border-r h-screen">
        <div className="p-4 border-b">
          <HallSkeleton className="h-8 w-full" />
        </div>
        <div className="p-4">
          <HallSkeleton />
        </div>
      </div>
    );
  }

  if (!halls) {
    return null;
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 rounded-full shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <Menu className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Halls</span>
            <span className="sr-only">Toggle halls navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] max-w-sm p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Halls Navigation</SheetTitle>
            <SheetDescription>
              Browse and navigate through available halls
            </SheetDescription>
          </SheetHeader>
          <MobileHallNav 
            halls={halls} 
            currentHallId={currentHallId} 
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DesktopHallNav 
      halls={halls} 
      currentHallId={currentHallId} 
    />
  );
} 