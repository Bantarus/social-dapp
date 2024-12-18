import { type Hall } from '@/types/hall';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HallIcon } from './HallIcon';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface FeaturedHallCardProps {
  hall: Hall;
}

export function FeaturedHallCard({ hall }: FeaturedHallCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <HallIcon hall={hall} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{hall.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {hall.description}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {hall.metrics.activeMembers} members
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/halls/${hall.id}`}>
              View Hall
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 