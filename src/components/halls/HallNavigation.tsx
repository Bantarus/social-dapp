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
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] max-w-sm p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Navigation</SheetTitle>
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