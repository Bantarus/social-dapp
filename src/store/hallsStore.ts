import { create } from 'zustand';
import { Hall } from '@/types/hall';
import { ArchethicService } from '@/services/archethic';

interface HallsState {
  halls: Hall[];
  currentHall: Hall | null;
  isLoading: boolean;
  error: string | null;
  fetchHalls: () => Promise<void>;
  fetchHall: (hallId: string) => Promise<void>;
  setCurrentHall: (hall: Hall | null) => void;
  updateHall: (updatedHall: Hall) => void;
  addHall: (hall: Hall) => void;
}

export const useHallsStore = create<HallsState>((set, get) => ({
  halls: [],
  currentHall: null,
  isLoading: false,
  error: null,

  fetchHalls: async () => {
    set({ isLoading: true, error: null });
    try {
      const service = await ArchethicService.getInstance();
      const halls = await service.getHalls();
      set({ halls, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch halls', 
        isLoading: false 
      });
    }
  },

  fetchHall: async (hallId: string) => {
    set({ isLoading: true, error: null });
    try {
      const service = await ArchethicService.getInstance();
      
      // Debug logging
      console.log('Original hallId received:', hallId);
      
      // Only clean if it contains brackets
      const cleanHallId = hallId.includes('[') ? hallId.replace(/[\[\]]/g, '') : hallId;
      console.log('Cleaned hallId:', cleanHallId);
      
      const hall = await service.getHall(cleanHallId);
      console.log('Hall response:', hall);
      
      if (hall) {
        set((state) => ({
          currentHall: hall,
          halls: state.halls.map(h => h.id === hall.id ? hall : h),
          isLoading: false
        }));
      } else {
        set({ 
          error: 'Hall not found',
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error in fetchHall:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch hall', 
        isLoading: false 
      });
    }
  },

  setCurrentHall: (hall: Hall | null) => {
    set({ currentHall: hall });
  },

  updateHall: (updatedHall: Hall) => {
    set((state) => ({
      halls: state.halls.map(hall => 
        hall.id === updatedHall.id ? updatedHall : hall
      ),
      currentHall: state.currentHall?.id === updatedHall.id 
        ? updatedHall 
        : state.currentHall
    }));
  },

  addHall: (hall: Hall) => {
    set((state) => ({
      halls: [...state.halls, hall]
    }));
  },
})); 