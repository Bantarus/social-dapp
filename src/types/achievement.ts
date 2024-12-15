import { z } from 'zod';

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['chain', 'milestone', 'event']),
  progress: z.number().min(0).max(100),
  requirements: z.array(z.object({
    type: z.string(),
    count: z.number(),
    completed: z.boolean()
  })),
  rewards: z.object({
    energyBoost: z.number().optional(),
    maxEnergyIncrease: z.number().optional(),
    influencePoints: z.number().optional()
  }),
  completedAt: z.string().optional(),
  chainPosition: z.number().optional()
});

export type Achievement = z.infer<typeof AchievementSchema>; 