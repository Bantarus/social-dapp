import { z } from 'zod';

export const UserSchema = z.object({
  address: z.string(),
  username: z.string(),
  profile: z.object({
    bio: z.string(),
    avatar: z.string(),
    joinedDate: z.string(),
  }),
  metrics: z.object({
    influence: z.number(),
    energy: z.object({
      current: z.number(),
      max: z.number(),
      lastRegeneration: z.string(),
    }),
    achievements: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      dateEarned: z.string(),
      type: z.enum(['chain', 'event', 'milestone']),
    })),
  }),
});

export type User = z.infer<typeof UserSchema>;