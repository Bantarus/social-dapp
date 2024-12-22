import { useQuery, useMutation } from '@tanstack/react-query';
import { type Hall } from '@/types/hall';
import { HallContractParams} from '@/types/contracts'
import { ArchethicService } from '@/services/archethic';
import { useHallsStore } from '@/store/hallsStore';

export function useHalls() {
  const { halls, fetchHalls, isLoading, error } = useHallsStore();

  useQuery<Hall[], Error>({
    queryKey: ['halls'],
    queryFn: async () => {
      await fetchHalls();
      return halls;
    },
    initialData: halls,
  });

  return { halls, isLoading, error };
}

export function useHall(hallId: string) {
  const { currentHall, fetchHall, isLoading, error } = useHallsStore();
  const decodedHallId = decodeURIComponent(hallId);

  useQuery<Hall | null, Error>({
    queryKey: ['halls', decodedHallId],
    queryFn: async () => {
      await fetchHall(decodedHallId);
      return currentHall;
    },
    initialData: currentHall,
  });

  return { hall: currentHall, isLoading, error };
}

export function useCreateHall() {
  const { addHall } = useHallsStore();

  return useMutation({
    mutationFn: async (hallData: Omit<Hall, 'id' | 'members' | 'metrics'>) => {
      const service = await ArchethicService.getInstance();
      const newHall = await service.createHall(hallData);
      addHall(newHall);
      return newHall;
    },
    onError: (error) => {
      console.error('Failed to create hall:', error);
      throw error;
    }
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