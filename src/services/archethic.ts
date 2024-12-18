import { Post } from '@/types/post';
import { Achievement } from '@/types/achievement';
import { YieldSlot, UserYieldMetrics } from '@/types/yield';

// Mock data for development
const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just deployed my first smart contract on Archethic! 🚀',
    author: {
      address: 'archethic_address_1',
      username: 'alice',
      influence: 75,
    },
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
];

const mockAchievements: Achievement[] = [
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

// Mock transaction chain functions
export class ArchethicService {
  private static instance: ArchethicService;
  private posts: Post[] = [...mockPosts];

  public constructor() {
    console.log('ArchethicService constructor - Initial posts:', this.posts); // Debug initial posts
  }

  public static getInstance(): ArchethicService {
    if (!ArchethicService.instance) {
      ArchethicService.instance = new ArchethicService();
      console.log('Created new ArchethicService instance'); // Debug instance creation
    }
    return ArchethicService.instance;
  }

  // Mock function to create a post transaction
  async createPost(postData: Partial<Post>): Promise<Post> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a new post with default values and provided data
    const newPost: Post = {
      id: `post_${Date.now()}`,
      content: postData.content || '',
      author: postData.author || {
        address: '',
        username: '',
        influence: 0,
      },
      timestamp: new Date().toISOString(),
      zone: postData.zone || 'fast',
      engagement: {
        likes: 0,
        echoes: 0,
        comments: 0,
      },
      metadata: {
        type: postData.metadata?.type || 'text',
        tags: postData.metadata?.tags || [],
      },
      metrics: {
        engagementVelocity: 0,
        qualityScore: 0.5,
      },
    };

    // Add to mock posts array
    this.posts.unshift(newPost);

    return newPost;
  }

  // Mock function to fetch posts by zone
  async getPostsByZone(zone: 'fast' | 'cruise' | 'archive'): Promise<Post[]> {
    console.log('getPostsByZone called with zone:', zone); // Debug zone parameter
    console.log('Current posts in service:', this.posts); // Debug available posts
    const filteredPosts = this.posts.filter(post => post.zone === zone);
    console.log('Filtered posts:', filteredPosts); // Debug filtered results
    return filteredPosts;
  }

  // Mock function to engage with a post (like, echo, comment)
  async engageWithPost(
    postId: string,
    type: 'like' | 'echo' | 'comment',
    data?: { content?: string }
  ): Promise<Post> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('Post not found');

    const post = { ...this.posts[postIndex] };
    
    // Type-safe engagement update
    switch (type) {
      case 'like':
        post.engagement.likes++;
        break;
      case 'echo':
        post.engagement.echoes++;
        break;
      case 'comment':
        post.engagement.comments++;
        break;
    }
    
    // Update metrics
    post.metrics.engagementVelocity = this.calculateEngagementVelocity(post);
    post.metrics.qualityScore = this.calculateQualityScore(post);

    this.posts[postIndex] = post;
    return post;
  }

  // Mock function to get user profile
  async getUserProfile(address: string): Promise<{
    address: string;
    username: string;
    influence: number;
  }> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock user data
    return {
      address,
      username: address.slice(0, 8),
      influence: Math.floor(Math.random() * 100),
    };
  }

  // Helper functions for calculating metrics
  private calculateInitialQualityScore(post: Omit<Post, 'id' | 'timestamp' | 'metrics'>): number {
    // Simple mock quality score based on content length and type
    const lengthScore = Math.min(post.content.length / 1000, 1);
    const typeScore = post.metadata.type === 'guide' ? 1 : 0.7;
    return (lengthScore + typeScore) / 2;
  }

  private calculateEngagementVelocity(post: Post): number {
    const totalEngagement = 
      post.engagement.likes + 
      post.engagement.echoes * 2 + 
      post.engagement.comments * 3;
    
    const ageInHours = 
      (Date.now() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60);
    
    return totalEngagement / Math.max(ageInHours, 1);
  }

  private calculateQualityScore(post: Post): number {
    const engagementScore = Math.min(
      (post.engagement.likes + post.engagement.echoes * 2 + post.engagement.comments * 3) / 100,
      1
    );
    return (post.metrics.qualityScore + engagementScore) / 2;
  }

  async getAchievements(): Promise<Achievement[]> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Fetching achievements:', mockAchievements); // Debug log
    return mockAchievements;
  }

  // Fetch active yield slots
  async getActiveYieldSlots(): Promise<YieldSlot[]> {
    // Mock implementation - replace with actual blockchain interaction
    return [
      {
        id: "1",
        advertiser: {
          address: "0x123...",
          name: "DeFi Protocol",
          verified: true,
        },
        content: {
          title: "Launch Your DeFi Project",
          description: "Get early access to our new liquidity pools",
          callToAction: {
            text: "Join Now",
            url: "https://example.com/defi",
          },
        },
        metrics: {
          bidAmount: 1000,
          startTime: new Date().toISOString(),
          duration: 24 * 60 * 60, // 24 hours in seconds
          impressions: 1200,
          engagement: 45,
        },
        distribution: {
          userPool: 700, // 70%
          platformPool: 200, // 20%
          curatorPool: 100, // 10%
        },
      },
      // Add more mock slots as needed
    ];
  }

  // Get user yield metrics
  async getUserYieldMetrics(userAddress: string): Promise<UserYieldMetrics> {
    // Mock implementation - replace with actual blockchain interaction
    return {
      totalEarned: 1500,
      lastClaim: new Date().toISOString(),
      multiplier: 1.2,
      claimableAmount: 45.5,
    };
  }

  // Claim yield rewards
  async claimYieldRewards(userAddress: string): Promise<boolean> {
    try {
      // Mock implementation - replace with actual blockchain transaction
      // Here you would:
      // 1. Create a transaction to claim rewards
      // 2. Sign it with user's wallet
      // 3. Broadcast to the network
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate blockchain delay
      return true;
    } catch (error) {
      console.error('Failed to claim yield rewards:', error);
      return false;
    }
  }

  // Place a bid for yield slot
  async bidForYieldSlot(
    advertiserAddress: string,
    slotContent: Omit<YieldSlot['content'], 'id'>,
    bidAmount: number,
    duration: number
  ): Promise<string> {
    try {
      // Mock implementation - replace with actual blockchain transaction
      // Here you would:
      // 1. Create a transaction with bid details
      // 2. Transfer tokens for the bid
      // 3. Store slot content on chain
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "mock_slot_id";
    } catch (error) {
      console.error('Failed to place yield slot bid:', error);
      throw error;
    }
  }
} 