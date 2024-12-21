import { Post } from '@/types/post';

export const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just deployed my first smart contract on Archethic! 🚀',
    author: {
      address: 'archethic_address_1',
      username: 'alice',
      influence: 75,
    },
    hallId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    zone: 'fast',
    engagement: {
      likes: 12,
      echoes: 3,
      comments: 5,
    },
    metadata: {
      type: 'text',
      tags: ['blockchain', 'development'],
    },
    metrics: {
      engagementVelocity: 20,
      qualityScore: 0.85,
    },
  },
  {
    id: '2',
    content: 'Thread: Understanding Archethic UCO tokenomics\n\n1/5 Let\'s dive into how UCO works...',
    author: {
      address: 'archethic_address_2',
      username: 'bob',
      influence: 92,
    },
    hallId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    zone: 'cruise',
    engagement: {
      likes: 45,
      echoes: 15,
      comments: 8,
    },
    metadata: {
      type: 'thread',
      tags: ['UCO', 'tokenomics', 'education'],
    },
    metrics: {
      engagementVelocity: 5,
      qualityScore: 0.95,
    },
  },
  {
    id: '3',
    content: 'Guide: Setting up your first Archethic node',
    author: {
      address: 'archethic_address_1',
      username: 'alice',
      influence: 75,
    },
    hallId: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 72 hours ago
    zone: 'archive',
    engagement: {
      likes: 120,
      echoes: 45,
      comments: 23,
    },
    metadata: {
      type: 'guide',
      tags: ['node', 'tutorial', 'blockchain'],
    },
    metrics: {
      engagementVelocity: 2,
      qualityScore: 0.98,
    },
  }
]; 