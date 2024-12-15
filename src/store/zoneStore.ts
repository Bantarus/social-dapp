import { create } from 'zustand';
import { Post } from '../types/post';

export type ZoneType = 'fast' | 'cruise' | 'archive';

interface ZoneStats {
  posts: number;
  engagement: number;
}

interface ZoneState {
  currentZone: ZoneType;
  zoneStats: Record<ZoneType, ZoneStats>;
  posts: Post[];
  setCurrentZone: (zone: ZoneType) => void;
  updateZoneStats: () => void;
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
  transitionPost: (postId: string, newZone: ZoneType) => void;
}

export const useZoneStore = create<ZoneState>((set, get) => ({
  currentZone: 'fast',
  zoneStats: {
    fast: { posts: 0, engagement: 0 },
    cruise: { posts: 0, engagement: 0 },
    archive: { posts: 0, engagement: 0 },
  },
  posts: [],

  setCurrentZone: (zone) => set({ currentZone: zone }),

  updateZoneStats: () => {
    const { posts } = get();
    const stats = posts.reduce(
      (acc, post) => {
        acc[post.zone].posts += 1;
        const totalEngagement = 
          post.engagement.likes + 
          post.engagement.echoes + 
          post.engagement.comments;
        acc[post.zone].engagement += totalEngagement;
        return acc;
      },
      {
        fast: { posts: 0, engagement: 0 },
        cruise: { posts: 0, engagement: 0 },
        archive: { posts: 0, engagement: 0 },
      }
    );
    set({ zoneStats: stats });
  },

  addPost: (post) => {
    set((state) => ({
      posts: [...state.posts, post],
    }));
    get().updateZoneStats();
  },

  removePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
    get().updateZoneStats();
  },

  transitionPost: (postId, newZone) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, zone: newZone } : post
      ),
    }));
    get().updateZoneStats();
  },
}));