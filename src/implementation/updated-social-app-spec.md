# DecentraPost - Technical Implementation Specification (Updated)

## 1. Technology Stack

### 1.1 Frontend Core
- **Next.js 14+**
  - App Router for optimized routing
  - Server Components for improved performance
  - Built-in API routes for backend functionality
  - SSR capabilities for better SEO and performance

### 1.2 State Management
- **TanStack Query (React Query)**
  - Managing Archethic chain data
  - Caching post data and user profiles
  - Real-time updates for Speed Zones
  - Optimistic updates for post engagement

- **Zustand**
  - Local state management (user preferences, UI state)
  - Energy system state
  - Zone transitions
  - Achievement tracking

### 1.3 UI & Styling
- **TailwindCSS**
  - Utility-first styling
  - Custom theming for zones
  - Responsive design
  - Dark mode support

- **shadcn/ui**
  - Pre-built accessible components
  - Consistent design system
  - Custom theme integration
  - Form components

### 1.4 Forms & Validation
- **React Hook Form**
  - Post creation forms
  - Profile editing
  - Form validation

- **Zod**
  - Schema validation for posts
  - User input validation
  - Type safety

## 2. Project Structure

```typescript
src/
├── app/                    # Next.js App Router
│   ├── (zones)/           # Speed Zones routes
│   │   ├── fast/
│   │   ├── cruise/
│   │   └── archive/
│   ├── profile/           # User profile routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── zones/            # Zone-specific components
│   ├── posts/            # Post-related components
│   ├── user/             # User-related components
│   └── ui/               # shadcn/ui components
├── hooks/
│   ├── chain/            # Archethic chain hooks
│   ├── posts/            # Post management hooks
│   └── zones/            # Zone management hooks
├── lib/
│   ├── utils/            # Utility functions
│   └── validators/       # Zod schemas
├── store/                # Zustand stores
│   ├── userStore.ts
│   ├── zoneStore.ts
│   └── energyStore.ts
└── types/                # TypeScript types
```

## 3. Data Structures (Updated)

### 3.1 Post Schema
```typescript
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
```

## 4. State Management Implementation

### 4.1 Chain Data Management
```typescript
// hooks/chain/useChainQuery.ts
import { useQuery } from '@tanstack/react-query';

export const useZonePosts = (zone: ZoneType) => {
  return useQuery({
    queryKey: ['posts', zone],
    queryFn: () => fetchZonePosts(zone),
    staleTime: zone === 'fast' ? 30000 : 60000,
    refetchInterval: zone === 'fast' ? 30000 : false,
  });
};
```

### 4.2 Local State Management
```typescript
// store/zoneStore.ts
import create from 'zustand';

interface ZoneState {
  currentZone: ZoneType;
  transitions: Map<string, ZoneTransition>;
  setCurrentZone: (zone: ZoneType) => void;
  trackTransition: (postId: string, transition: ZoneTransition) => void;
}

export const useZoneStore = create<ZoneState>((set) => ({
  currentZone: 'fast',
  transitions: new Map(),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  trackTransition: (postId, transition) => 
    set((state) => ({
      transitions: new Map(state.transitions).set(postId, transition),
    })),
}));
```

## 5. Component Examples

### 5.1 Zone Container
```typescript
// components/zones/ZoneContainer.tsx
export const ZoneContainer = () => {
  const { currentZone } = useZoneStore();
  const { data: posts, isLoading } = useZonePosts(currentZone);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <ZoneSkeleton />
      ) : (
        posts?.map((post) => (
          <PostCard 
            key={post.id} 
            post={post}
            className={cn(
              "transition-all duration-300",
              post.zone === 'fast' && "border-l-4 border-yellow-500"
            )}
          />
        ))
      )}
    </div>
  );
};
```

### 5.2 Post Form
```typescript
// components/posts/PostForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const PostForm = () => {
  const form = useForm<Post>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      zone: 'fast',
      type: 'text',
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="What's happening?"
                className="min-h-[100px]"
              />
            </FormControl>
          </FormItem>
        )}
      />
      {/* Additional form fields */}
    </Form>
  );
};
```

## 6. Performance Optimizations

### 6.1 Data Fetching
```typescript
// Components marked with 'use client'
import { Suspense } from 'react';

export default function ZonePage() {
  return (
    <Suspense fallback={<ZoneSkeleton />}>
      <ZoneContainer />
    </Suspense>
  );
}
```

### 6.2 Virtual Scrolling
```typescript
// components/zones/VirtualizedZone.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualizedZone = ({ posts }: { posts: Post[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <PostCard post={posts[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 7. Testing Strategy

### 7.1 Component Testing
```typescript
// __tests__/components/ZoneContainer.test.tsx
import { render, screen } from '@testing-library/react';
import { ZoneContainer } from '@/components/zones/ZoneContainer';

describe('ZoneContainer', () => {
  it('should render posts in the correct zone', async () => {
    render(<ZoneContainer />);
    expect(await screen.findByText(/What's happening/i)).toBeInTheDocument();
  });
});
```

## 8. Deployment

### 8.1 Next.js Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placeholders.dev'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

Would you like me to:
1. Elaborate on any specific component implementation?
2. Add more details about the Archethic chain integration?
3. Expand on the testing strategy?
4. Provide more examples of form validation and state management?