import { Achievement } from '@/types/achievement';

export const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Begin your journey in the Fast Lane",
    type: "milestone",
    progress: 100,
    requirements: [
      { type: "Create first post", count: 1, completed: true }
    ],
    rewards: {
      energyBoost: 10,
      influencePoints: 5
    },
    completedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Chain Reactor",
    description: "Start a chain of engagement",
    type: "chain",
    progress: 60,
    requirements: [
      { type: "Get post echoes", count: 5, completed: true },
      { type: "Achieve engagement velocity", count: 10, completed: false }
    ],
    rewards: {
      maxEnergyIncrease: 20,
      influencePoints: 15
    }
  },
  {
    id: "3",
    title: "Community Event Star",
    description: "Participate in weekly challenge",
    type: "event",
    progress: 30,
    requirements: [
      { type: "Event participation", count: 3, completed: false }
    ],
    rewards: {
      energyBoost: 25,
      influencePoints: 20
    }
  }
]; 