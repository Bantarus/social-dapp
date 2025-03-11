import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArchethicService } from '@/services/archethic';
import { YieldSlot, UserYieldMetrics } from '@/types/yield';
import { useToast } from '@/components/ui/use-toast';

export function useYield(userMetrics: UserYieldMetrics) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const archethicService = ArchethicService.getInstance();

  // Query for active yield slots
  const {
    data: activeSlots,
    isLoading,
    error
  } = useQuery<YieldSlot[]>({
    queryKey: ['yieldSlots'],
    queryFn: () => archethicService.getActiveYieldSlots(),
    refetchInterval: 60000, // Refetch every minute
  });

  // Mutation for claiming yield rewards
  const claimYieldMutation = useMutation({
    mutationFn: async () => {
      // In a real implementation, we would get the user's address from auth context
      const mockUserAddress = "mock_address";
      return archethicService.claimYieldRewards(mockUserAddress);
    },
    onSuccess: () => {
      // Invalidate user metrics query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['userYieldMetrics'] });
      
      toast({
        title: "Success",
        description: "Yield rewards claimed successfully",
      });
    },
    onError: (error) => {
      console.error('Failed to claim yield:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to claim yield rewards",
        variant: "destructive",
      });
    },
  });

  const handleClaimYield = () => {
    claimYieldMutation.mutate();
  };

  return {
    activeSlots,
    isLoading,
    error,
    isClaimingYield: claimYieldMutation.isPending,
    handleClaimYield,
  };
}