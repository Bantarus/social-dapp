import { Hall } from '@/types/hall';

export const mockHalls: Hall[] = [
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
  }
]; 