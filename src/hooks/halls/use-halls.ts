import { useQuery, useMutation } from '@tanstack/react-query';
import { type Hall } from '@/types/hall';
import { HallContractParams} from '@/types/contracts'
import { ArchethicService } from '@/services/archethic';
import { useHallsStore } from '@/store/hallsStore';

export function useHalls() {
  const { halls, fetchHalls, isLoading, error } = useHallsStore();

  // Still use React Query for caching and background updates
  useQuery({
    queryKey: ['halls'],
    queryFn: fetchHalls,
    initialData: halls,
  });

  return { halls, isLoading, error };
}

export function useHall(hallId: string) {
  const { currentHall, fetchHall, isLoading, error } = useHallsStore();

  // Decode the hallId before using it
  const decodedHallId = decodeURIComponent(hallId);

  useQuery({
    queryKey: ['halls', decodedHallId],
    queryFn: () => fetchHall(decodedHallId),
    initialData: currentHall,
  });

  return { 
    hall: currentHall, 
    isLoading, 
    error 
  };
}

export function useCreateHall() {
  const { addHall } = useHallsStore();

  return useMutation({
    mutationFn: async (params: { 
      hallData: Omit<Hall, 'id' | 'members' | 'metrics'>,
      placeholders: HallContractParams 
    }) => {
      const service = await ArchethicService.getInstance();
      const newHall = await service.createHall(params.hallData, params.placeholders);
      addHall(newHall);
      return newHall;
    },
  });
}

export function useJoinHall() {
  const { updateHall } = useHallsStore();

  return useMutation({
    mutationFn: async ({ hallId, userAddress }: { hallId: string; userAddress: string }) => {
      const service = await ArchethicService.getInstance();
      const updatedHall = await service.joinHall(hallId);
      updateHall(updatedHall);
      return updatedHall;
    },
  });
}

export function useLeaveHall() {
  const { updateHall } = useHallsStore();

  return useMutation({
    mutationFn: async ({ hallId, userAddress }: { hallId: string; userAddress: string }) => {
      const service = await ArchethicService.getInstance();
      const updatedHall = await service.leaveHall(hallId);
      updateHall(updatedHall);
      return updatedHall;
    },
  });
}

export function useUpdateHallSettings() {
  const { updateHall } = useHallsStore();

  return useMutation({
    mutationFn: async ({ hallId, settings }: { hallId: string; settings: Hall['settings'] }) => {
      const service = await ArchethicService.getInstance();
      const updatedHall = await service.updateHallSettings(hallId, settings);
      updateHall(updatedHall);
      return updatedHall;
    },
  });
} 