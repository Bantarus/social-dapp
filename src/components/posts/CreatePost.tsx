'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostSchema } from '@/types/post';
import { useEnergyStore } from '@/store/energyStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { usePosts } from '@/hooks/usePosts';

type CreatePostFormData = {
  content: string;
  type: 'text' | 'thread' | 'echo' | 'guide';
  tags: string[];
};

export function CreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { useEnergy, actionCosts } = useEnergyStore();
  const { createPost } = usePosts('fast');

  const form = useForm<CreatePostFormData>({
    defaultValues: {
      content: '',
      type: 'text',
      tags: [],
    },
    resolver: zodResolver(PostSchema.pick({ 
      content: true,
      metadata: true 
    })),
  });

  const onSubmit = async (data: CreatePostFormData) => {
    setIsSubmitting(true);
    
    // Check if user has enough energy
    if (!useEnergy(actionCosts.post)) {
      toast({
        title: "Not enough energy",
        description: "Please wait for your energy to regenerate.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create new post
      await createPost.mutateAsync({
        content: data.content,
        author: {
          address: "placeholder-address", // Will be replaced with actual user address
          username: "placeholder-user", // Will be replaced with actual username
          influence: 0,
        },
        zone: 'fast',
        engagement: {
          likes: 0,
          echoes: 0,
          comments: 0,
        },
        metadata: {
          type: data.type,
          tags: data.tags,
        },
      });

      // Reset form
      form.reset();
    } catch (error) {
      // Error handling is done in the usePosts hook
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Textarea
            placeholder="What's happening?"
            className="min-h-[100px] resize-none"
            {...form.register('content')}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Select
            defaultValue="text"
            onValueChange={(value) => form.setValue('type', value as CreatePostFormData['type'])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Post type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Post</SelectItem>
              <SelectItem value="thread">Thread</SelectItem>
              <SelectItem value="echo">Echo</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            type="submit" 
            disabled={isSubmitting || createPost.isPending}
            className="ml-auto"
          >
            {isSubmitting || createPost.isPending ? 'Creating...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
} 