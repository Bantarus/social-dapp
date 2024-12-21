import { type Hall } from '@/types/hall';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HallList } from './HallList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface DesktopHallNavProps {
  halls: Hall[];
  currentHallId?: string;
}

export function DesktopHallNav({ halls, currentHallId }: DesktopHallNavProps) {
  return (
    <div className="hidden lg:flex flex-col w-60 shrink-0 border-r h-screen">
      <div className="p-4 border-b">
        <Button className="w-full" size="sm" asChild>
          <Link href="/halls/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Hall
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <HallList 
          halls={halls} 
          currentHallId={currentHallId}
          variant="desktop"
        />
      </ScrollArea>
    </div>
  );
} 