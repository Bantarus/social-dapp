import { create } from 'zustand';
import { YieldSlot, UserYieldMetrics } from '@/types/yield';

interface YieldState {
  userMetrics: UserYieldMetrics;
  setUserMetrics: (metrics: UserYieldMetrics) => void;
  claimYield: () => Promise<void>;
}

export const useYieldStore = create<YieldState>((set) => ({
  userMetrics: {
    totalEarned: 0,
    lastClaim: new Date().toISOString(),
    multiplier: 1,
    claimableAmount: 0,
  },
  setUserMetrics: (metrics) => set({ userMetrics: metrics }),
  claimYield: async () => {
    try {
      // Implement blockchain interaction for claiming yield
      // Update user metrics after successful claim
      set((state) => ({
        userMetrics: {
          ...state.userMetrics,
          claimableAmount: 0,
          lastClaim: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error('Failed to claim yield:', error);
      throw error;
    }
  },
}));
