import { z } from 'zod';
import { HALL_CATEGORIES } from '@/lib/constants/categories';

const categoryValues = HALL_CATEGORIES.map(cat => cat.value);

export const HallSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(categoryValues as [string, ...string[]]),
  icon: z.string().optional(),
  members: z.array(z.object({
    address: z.string(),
    role: z.enum(['member', 'moderator', 'admin']),
    reputation: z.number(),
  })),
  metrics: z.object({
    totalPosts: z.number(),
    activeMembers: z.number(),
    energyPool: z.number(),
    unreadCount: z.number(),
  }),
  settings: z.object({
    isPrivate: z.boolean(),
    requiresApproval: z.boolean(),
    minimumReputation: z.number(),
  }),
});

export type Hall = z.infer<typeof HallSchema>;

export type HallRole = 'member' | 'moderator' | 'admin'; 