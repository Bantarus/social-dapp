import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArchethicService } from '@/services/archethic';
import { Post } from '@/types/post';
import { useToast } from '@/components/ui/use-toast';

const archethicService = ArchethicService.getInstance();

export function usePosts(zone: 'fast' | 'cruise' | 'archive') {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query for fetching posts
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', zone],
    queryFn: () => archethicService.getPostsByZone(zone),
    staleTime: zone === 'fast' ? 30000 : 60000, // Refresh more frequently for fast lane
  });

  // Mutation for creating a new post
  const createPost = useMutation({
    mutationFn: (newPost: Omit<Post, 'id' | 'timestamp' | 'metrics'>) =>
      archethicService.createPost(newPost),
    onSuccess: (newPost) => {
      // Update posts cache
      queryClient.setQueryData(['posts', newPost.zone], (oldPosts: Post[] = []) => 
        [newPost, ...oldPosts]
      );

      toast({
        title: 'Post created',
        description: 'Your post has been published successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Mutation for post engagement
  const engageWithPost = useMutation({
    mutationFn: ({
      postId,
      type,
      data,
    }: {
      postId: string;
      type: 'like' | 'echo' | 'comment';
      data?: { content?: string };
    }) => archethicService.engageWithPost(postId, type, data),
    onSuccess: (updatedPost) => {
      // Update post in cache
      queryClient.setQueryData(['posts', updatedPost.zone], (oldPosts: Post[] = []) =>
        oldPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );

      toast({
        title: 'Engagement recorded',
        description: 'Your interaction has been recorded successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to record engagement. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    posts: posts || [],
    isLoading,
    error,
    createPost,
    engageWithPost,
  };
} 