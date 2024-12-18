import { z } from 'zod';

export const PostSchema = z.object({
  content: z.string()
    .min(1, 'Post cannot be empty')
    .max(1000, 'Post cannot exceed 1000 characters'),
  type: z.enum(['text', 'thread', 'echo', 'guide']),
  tags: z.array(z.string()),
});