import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Hall } from '@/types/hall';
import { ArchethicService } from '@/services/archethic';

const archethicService = ArchethicService.getInstance();

export function useHalls() {
  return useQuery({
    queryKey: ['halls'],
    queryFn: () => archethicService.getHalls(),
  });
}

export function useHall(hallId: string) {
  return useQuery({
    queryKey: ['halls', hallId],
    queryFn: () => archethicService.getHall(hallId),
  });
}

export function useCreateHall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hallData: Partial<Hall>) => archethicService.createHall(hallData),
    onSuccess: (newHall) => {
      queryClient.setQueryData<Hall[]>(['halls'], (old = []) => [...old, newHall]);
    },
  });
}

export function useJoinHall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hallId, userAddress }: { hallId: string; userAddress: string }) =>
      archethicService.joinHall(hallId, userAddress),
    onSuccess: (updatedHall) => {
      queryClient.setQueryData<Hall[]>(['halls'], (old = []) =>
        old.map(h => (h.id === updatedHall.id ? updatedHall : h))
      );
      queryClient.setQueryData(['halls', updatedHall.id], updatedHall);
    },
  });
}

export function useLeaveHall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hallId, userAddress }: { hallId: string; userAddress: string }) =>
      archethicService.leaveHall(hallId, userAddress),
    onSuccess: (_, { hallId, userAddress }) => {
      queryClient.setQueryData<Hall[]>(['halls'], (old = []) =>
        old.map(h => {
          if (h.id !== hallId) return h;
          return {
            ...h,
            members: h.members.filter(m => m.address !== userAddress),
            metrics: {
              ...h.metrics,
              activeMembers: Math.max(0, h.metrics.activeMembers - 1),
            },
          };
        })
      );
      queryClient.invalidateQueries({ queryKey: ['halls', hallId] });
    },
  });
}

export function useUpdateHallSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hallId, settings }: { hallId: string; settings: Hall['settings'] }) =>
      archethicService.updateHallSettings(hallId, settings),
    onSuccess: (updatedHall) => {
      queryClient.setQueryData<Hall[]>(['halls'], (old = []) =>
        old.map(h => (h.id === updatedHall.id ? updatedHall : h))
      );
      queryClient.setQueryData(['halls', updatedHall.id], updatedHall);
    },
  });
} 