import { create } from 'zustand';
import { Achievement } from '@/types/achievement';

interface AchievementState {
  achievements: Achievement[];
  selectedType: 'all' | 'chain' | 'milestone' | 'event';
  setAchievements: (achievements: Achievement[]) => void;
  setSelectedType: (type: 'all' | 'chain' | 'milestone' | 'event') => void;
  getFilteredAchievements: () => Achievement[];
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  selectedType: 'all',
  setAchievements: (achievements) => set({ achievements }),
  setSelectedType: (type) => set({ selectedType: type }),
  getFilteredAchievements: () => {
    const { achievements, selectedType } = get();
    if (selectedType === 'all') return achievements;
    return achievements.filter(a => a.type === selectedType);
  },
})); 