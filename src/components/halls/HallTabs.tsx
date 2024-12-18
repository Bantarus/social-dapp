'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { HallZone } from './HallZone';
import { useScrollDirection } from '@/hooks/use-scroll-direction';

interface HallTabsProps {
  hallId: string;
}

export function HallTabs({ hallId }: HallTabsProps) {
  const { isMobile } = useMediaQuery();
  
  const tabs = [
    { value: 'fast', label: 'Fast Lane' },
    { value: 'cruise', label: 'Cruise' },
    { value: 'archive', label: 'Archive' },
  ];

  const TabsNavigation = () => (
    <TabsList className="w-full justify-start">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className={cn(
            isMobile && "text-sm px-3",
            "flex-1 max-w-[200px]"
          )}
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );

  return (
    <Tabs defaultValue="fast" className="w-full relative">
      {/* Sticky Navigation */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-40">
        <TabsNavigation />
      </div>

      <TabsContent value="fast" className="mt-6">
        <HallZone hallId={hallId} zone="fast" />
      </TabsContent>
      <TabsContent value="cruise" className="mt-6">
        <HallZone hallId={hallId} zone="cruise" />
      </TabsContent>
      <TabsContent value="archive" className="mt-6">
        <HallZone hallId={hallId} zone="archive" />
      </TabsContent>
    </Tabs>
  );
} 