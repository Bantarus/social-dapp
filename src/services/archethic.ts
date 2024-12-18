import { Post } from '@/types/post';
import { Achievement } from '@/types/achievement';
import { YieldSlot, UserYieldMetrics } from '@/types/yield';
import { Hall } from '@/types/hall';

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

// Mock data for halls
const mockHalls: Hall[] = [
  {
    id: '1',
    name: "Developers' Hall",
    description: "A space for developers to share knowledge and discuss tech",
    members: [
      {
        address: 'archethic_address_1',
        role: 'admin',
        reputation: 95,
      },
      {
        address: 'archethic_address_2',
        role: 'moderator',
        reputation: 85,
      }
    ],
    metrics: {
      totalPosts: 150,
      activeMembers: 45,
      energyPool: 1000,
      unreadCount: 5,
    },
    settings: {
      isPrivate: false,
      requiresApproval: false,
      minimumReputation: 0,
    }
  },
  {
    id: '2',
    name: "Artists' Corner",
    description: "Share and discuss creative works and artistic endeavors",
    members: [
      {
        address: 'archethic_address_3',
        role: 'admin',
        reputation: 88,
      }
    ],
    metrics: {
      totalPosts: 89,
      activeMembers: 32,
      energyPool: 750,
      unreadCount: 2,
    },
    settings: {
      isPrivate: false,
      requiresApproval: false,
      minimumReputation: 0,
    }
  },
  {
    id: '3',
    name: "Builders' Guild",
    description: "For those building the future of web3 and blockchain",
    members: [
      {
        address: 'archethic_address_1',
        role: 'member',
        reputation: 75,
      },
      {
        address: 'archethic_address_4',
        role: 'admin',
        reputation: 92,
      }
    ],
    metrics: {
      totalPosts: 234,
      activeMembers: 67,
      energyPool: 1500,
      unreadCount: 8,
    },
    settings: {
      isPrivate: false,
      requiresApproval: true,
      minimumReputation: 10,
    }
  },
  {
    id: '4',
    name: "Traders' Tavern",
    description: "Discuss trading strategies and market analysis",
    members: [],
    metrics: {
      totalPosts: 56,
      activeMembers: 23,
      energyPool: 500,
      unreadCount: 3,
    },
    settings: {
      isPrivate: false,
      requiresApproval: false,
      minimumReputation: 0,
    }
  },
  {
    id: '5',
    name: "Writers' Workshop",
    description: "A space for writers to share and improve their craft",
    members: [],
    metrics: {
      totalPosts: 78,
      activeMembers: 28,
      energyPool: 600,
      unreadCount: 1,
    },
    settings: {
      isPrivate: false,
      requiresApproval: false,
      minimumReputation: 0,
    }
  }
];

// Mock transaction chain functions
export class ArchethicService {
  private static instance: ArchethicService;
  private posts: Post[] = [...mockPosts];
  private halls: Hall[] = [...mockHalls];

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
      hallId: postData.hallId || '',
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
  async getPostsByZone(zone: 'fast' | 'cruise' | 'archive', hallId?: string): Promise<Post[]> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredPosts = this.posts.filter(post => post.zone === zone);
    
    // If hallId is provided, filter by hall
    if (hallId) {
      filteredPosts = filteredPosts.filter(post => post.hallId === hallId);
    }

    console.log('getPostsByZone called with:', { zone, hallId }); // Debug log
    console.log('Filtered posts:', filteredPosts); // Debug log

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

  // Mock function to get a specific hall
  async getHall(hallId: string): Promise<Hall | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const hall = this.halls.find(h => h.id === hallId);
    return hall || null;
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

  // Hall-related methods
  async getHalls(): Promise<Hall[]> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.halls;
  }

  async createHall(hallData: Partial<Hall>): Promise<Hall> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newHall: Hall = {
      id: `hall_${Date.now()}`,
      name: hallData.name || '',
      description: hallData.description || '',
      members: hallData.members || [],
      metrics: {
        totalPosts: 0,
        activeMembers: 0,
        energyPool: 100, // Initial energy pool
        unreadCount: 0,
      },
      settings: hallData.settings || {
        isPrivate: false,
        requiresApproval: false,
        minimumReputation: 0,
      },
    };

    this.halls.push(newHall);
    return newHall;
  }

  async joinHall(hallId: string, userAddress: string): Promise<Hall> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const hallIndex = this.halls.findIndex(h => h.id === hallId);
    if (hallIndex === -1) throw new Error('Hall not found');

    const hall = { ...this.halls[hallIndex] };
    
    // Check if user is already a member
    if (hall.members.some(m => m.address === userAddress)) {
      throw new Error('Already a member');
    }

    // Add user as member
    hall.members.push({
      address: userAddress,
      role: 'member',
      reputation: 0,
    });

    hall.metrics.activeMembers++;
    this.halls[hallIndex] = hall;
    return hall;
  }

  async leaveHall(hallId: string, userAddress: string): Promise<void> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const hallIndex = this.halls.findIndex(h => h.id === hallId);
    if (hallIndex === -1) throw new Error('Hall not found');

    const hall = { ...this.halls[hallIndex] };
    
    // Remove user from members
    hall.members = hall.members.filter(m => m.address !== userAddress);
    hall.metrics.activeMembers = Math.max(0, hall.metrics.activeMembers - 1);

    this.halls[hallIndex] = hall;
  }

  async updateHallSettings(hallId: string, settings: Hall['settings']): Promise<Hall> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const hallIndex = this.halls.findIndex(h => h.id === hallId);
    if (hallIndex === -1) throw new Error('Hall not found');

    const hall = { ...this.halls[hallIndex] };
    hall.settings = settings;
    this.halls[hallIndex] = hall;
    return hall;
  }

  async getFeaturedHalls(): Promise<Hall[]> {
    // Mock implementation - replace with actual blockchain call
    return [
      {
        id: '1',
        name: "Developers' Hall",
        description: "A space for developers to share knowledge and collaborate",
        icon: undefined,
        metrics: {
          totalPosts: 150,
          activeMembers: 75,
          energyPool: 1000,
          unreadCount: 5,
        },
        members: [],
        settings: {
          isPrivate: false,
          requiresApproval: false,
          minimumReputation: 0,
        },
      },
      {
        id: '2',
        name: "Artists' Corner",
        description: "Share and discuss creative works in the digital space",
        icon: undefined,
        metrics: {
          totalPosts: 200,
          activeMembers: 120,
          energyPool: 1500,
          unreadCount: 8,
        },
        members: [],
        settings: {
          isPrivate: false,
          requiresApproval: false,
          minimumReputation: 0,
        },
      },
      {
        id: '3',
        name: "Traders' Tavern",
        description: "Discuss trading strategies and market analysis",
        icon: undefined,
        metrics: {
          totalPosts: 180,
          activeMembers: 90,
          energyPool: 1200,
          unreadCount: 3,
        },
        members: [],
        settings: {
          isPrivate: false,
          requiresApproval: false,
          minimumReputation: 0,
        },
      },
    ];
  }

  async getRecentActivity(): Promise<Array<{ post: Post; hall: Hall }>> {
    // Mock implementation - replace with actual blockchain call
    const halls = await this.getFeaturedHalls();
    
    return [
      {
        post: {
          id: '1',
          content: "Just launched a new project using Archethic blockchain!",
          author: {
            address: 'mock_address_1',
            username: 'dev_enthusiast',
            influence: 85,
          },
          hallId: halls[0].id,
          timestamp: new Date().toISOString(),
          zone: 'fast',
          engagement: {
            likes: 12,
            echoes: 5,
            comments: 3,
          },
          metadata: {
            type: 'text',
            tags: ['blockchain', 'development'],
          },
          metrics: {
            engagementVelocity: 0.8,
            qualityScore: 0.9,
          },
        },
        hall: halls[0],
      },
      {
        post: {
          id: '2',
          content: "Check out my latest digital art piece inspired by blockchain technology",
          author: {
            address: 'mock_address_2',
            username: 'crypto_artist',
            influence: 92,
          },
          hallId: halls[1].id,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          zone: 'fast',
          engagement: {
            likes: 25,
            echoes: 8,
            comments: 6,
          },
          metadata: {
            type: 'text',
            tags: ['art', 'nft'],
          },
          metrics: {
            engagementVelocity: 0.9,
            qualityScore: 0.95,
          },
        },
        hall: halls[1],
      },
    ];
  }
} 