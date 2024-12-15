import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  content: z.string().max(1000),
  author: z.object({
    address: z.string(),
    username: z.string(),
    influence: z.number(),
  }),
  timestamp: z.string(),
  zone: z.enum(['fast', 'cruise', 'archive']),
  engagement: z.object({
    likes: z.number(),
    echoes: z.number(),
    comments: z.number(),
  }),
  metadata: z.object({
    type: z.enum(['text', 'thread', 'echo', 'guide']),
    originTxHash: z.string().optional(),
    chainPosition: z.number().optional(),
    tags: z.array(z.string()),
  }),
  metrics: z.object({
    engagementVelocity: z.number(),
    qualityScore: z.number(),
  }),
});

export type Post = z.infer<typeof PostSchema>;