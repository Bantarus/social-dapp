import { z } from 'zod';

export const YieldSlotSchema = z.object({
  id: z.string(),
  advertiser: z.object({
    address: z.string(),
    name: z.string(),
    verified: z.boolean(),
  }),
  content: z.object({
    title: z.string(),
    description: z.string(),
    media: z.string().optional(),
    callToAction: z.object({
      text: z.string(),
      url: z.string().url(),
    }),
  }),
  metrics: z.object({
    bidAmount: z.number(),
    startTime: z.string(),
    duration: z.number(),
    impressions: z.number(),
    engagement: z.number(),
  }),
  distribution: z.object({
    userPool: z.number(),
    platformPool: z.number(),
    curatorPool: z.number(),
  }),
});

export const UserYieldMetricsSchema = z.object({
  totalEarned: z.number(),
  lastClaim: z.string(),
  multiplier: z.number(),
  claimableAmount: z.number(),
});

export type YieldSlot = z.infer<typeof YieldSlotSchema>;
export type UserYieldMetrics = z.infer<typeof UserYieldMetricsSchema>;
