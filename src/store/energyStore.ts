import { create } from 'zustand';

interface EnergyState {
  current: number;
  max: number;
  lastRegeneration: string;
  actionCosts: {
    post: number;
    echo: number;
    comment: number;
    like: number;
  };
  regenerationRate: number; // points per hour
  
  useEnergy: (amount: number) => boolean;
  regenerateEnergy: () => void;
  increaseMaxEnergy: (amount: number) => void;
}

export const useEnergyStore = create<EnergyState>((set, get) => ({
  current: 100,
  max: 100,
  lastRegeneration: new Date().toISOString(),
  actionCosts: {
    post: 5,
    echo: 2,
    comment: 3,
    like: 1,
  },
  regenerationRate: 4,

  useEnergy: (amount) => {
    const { current } = get();
    if (current < amount) return false;
    
    set((state) => ({
      current: state.current - amount,
    }));
    return true;
  },

  regenerateEnergy: () => {
    const { current, max, lastRegeneration, regenerationRate } = get();
    const now = new Date();
    const lastRegen = new Date(lastRegeneration);
    const hoursSinceRegen = (now.getTime() - lastRegen.getTime()) / (1000 * 60 * 60);
    const pointsToAdd = Math.floor(hoursSinceRegen * regenerationRate);
    
    if (pointsToAdd > 0) {
      set((state) => ({
        current: Math.min(state.max, state.current + pointsToAdd),
        lastRegeneration: now.toISOString(),
      }));
    }
  },

  increaseMaxEnergy: (amount) => {
    set((state) => ({
      max: state.max + amount,
      current: state.current + amount,
    }));
  },
}));