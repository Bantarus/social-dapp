'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostSchema } from '@/lib/validators/post';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Loader2, X } from 'lucide-react';

interface PostFormData {
  content: string;
  type: 'text' | 'thread' | 'echo' | 'guide';
  tags: string[];
}

export const CreatePost = () => {
  const [isPosting, setIsPosting] = useState(false);
  const { createPost } = usePosts('fast');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<PostFormData>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      content: '',
      type: 'text',
      tags: [],
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsPosting(true);

      // Create post using React Query mutation
      await createPost.mutateAsync({
        content: data.content,
        author: {
          address: 'mock_address',
          username: 'current_user',
          influence: 0,
        },
        zone: 'fast',
        metadata: {
          type: data.type,
          tags: tags,
        },
        engagement: {
          likes: 0,
          echoes: 0,
          comments: 0,
        },
      });

      // Reset form
      form.reset();
      setTags([]);

    } catch (err) {
      console.error('Failed to create post:', err);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        {...form.register('content')}
        placeholder="What's happening?"
        className="min-h-[100px] resize-none"
        disabled={isPosting}
      />
      
      {/* Post type selection */}
      <select {...form.register('type')} className="w-full p-2 border rounded">
        <option value="text">Regular Post</option>
        <option value="thread">Thread</option>
        <option value="guide">Guide</option>
      </select>

      {/* Tags input */}
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          disabled={isPosting}
        />
        
        {/* Tags display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div 
                key={tag}
                className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={isPosting} 
        className="w-full"
      >
        {isPosting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          'Post'
        )}
      </Button>
    </form>
  );
}; 