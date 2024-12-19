"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { YieldSlot, UserYieldMetrics } from "@/types/yield";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, TrendingUp, Coins } from "lucide-react";
import { ArchethicService } from "@/services/archethic";

const archethicService = new ArchethicService();

interface YieldZoneProps {
  userMetrics: UserYieldMetrics;
}

export function YieldZone({ userMetrics }: YieldZoneProps) {
  // Fetch active slots using React Query directly with ArchethicService
  const { data: activeSlots, isLoading } = useQuery<YieldSlot[]>({
    queryKey: ['yieldSlots'],
    queryFn: () => archethicService.getActiveYieldSlots(),
    refetchInterval: 60000, // Refetch every minute
  });

  // Handle yield claiming directly with ArchethicService
  const handleClaimYield = async () => {
    try {
      // In a real implementation, we would get the user's address from auth context
      const mockUserAddress = "mock_address";
      const success = await archethicService.claimYieldRewards(mockUserAddress);
      if (success) {
        // Trigger a refetch of user metrics or update local state
        // You might want to add a toast notification here
      }
    } catch (error) {
      console.error('Failed to claim yield:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  if (isLoading) {
    return <YieldZoneSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      {/* User Yield Stats */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500">
        <CardContent className="p-4">
          <div className="flex justify-between items-center text-white">
            <div className="space-y-1">
              <p className="text-sm font-medium">Available Rewards</p>
              <p className="text-2xl font-bold">
                {userMetrics.claimableAmount.toFixed(2)} tokens
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClaimYield}
              disabled={userMetrics.claimableAmount <= 0}
            >
              <Coins className="mr-2 h-4 w-4" />
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Yield Slots Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {activeSlots?.map((slot) => (
            <CarouselItem key={slot.id} className="md:basis-1/2 lg:basis-1/3">
              <YieldSlotCard slot={slot} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

function YieldSlotCard({ slot }: { slot: YieldSlot }) {
  return (
    <Card className="h-full">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{slot.advertiser.name}</span>
            {slot.advertiser.verified && (
              <CheckCircle className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <Badge variant="secondary">
            <TrendingUp className="h-3 w-3 mr-1" />
            {slot.metrics.engagement}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-lg">{slot.content.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {slot.content.description}
          </p>
        </div>

        <Button 
          className="w-full"
          variant="outline"
          onClick={() => window.open(slot.content.callToAction.url, '_blank')}
        >
          {slot.content.callToAction.text}
        </Button>
      </CardContent>
    </Card>
  );
}

function YieldZoneSkeleton() {
  return (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
