import { type Hall } from '@/types/hall';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HallList } from './HallList';

interface MobileHallNavProps {
  halls: Hall[];
  currentHallId?: string;
}

export function MobileHallNav({ halls, currentHallId }: MobileHallNavProps) {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)] py-2">
      <div className="space-y-2 p-2">
        <HallList 
          halls={halls} 
          currentHallId={currentHallId}
          variant="mobile"
        />
      </div>
    </ScrollArea>
  );
} 