'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateHall } from '@/hooks/halls/use-halls';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { HALL_CATEGORIES } from '@/lib/constants/categories';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const createHallSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  category: z.enum(HALL_CATEGORIES.map(cat => cat.value) as [string, ...string[]]),
  settings: z.object({
    isPrivate: z.boolean().default(false),
    requiresApproval: z.boolean().default(false),
    minimumReputation: z.number().min(0).max(100).default(0),
  }),
});

type CreateHallFormData = z.infer<typeof createHallSchema>;

export function CreateHallForm() {
  const { mutateAsync: createHall, isPending } = useCreateHall();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateHallFormData>({
    resolver: zodResolver(createHallSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'general',
      settings: {
        isPrivate: false,
        requiresApproval: false,
        minimumReputation: 0,
      },
    },
  });

  const onSubmit = async (data: CreateHallFormData) => {
    try {
      await createHall(data);
      
      toast({
        title: "Success",
        description: "Hall created successfully",
      });
      
      router.push('/halls');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create hall",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hall Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hall name" {...field} />
              </FormControl>
              <FormDescription>
                Choose a unique and descriptive name for your hall
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your hall's purpose and goals" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide a clear description to help others understand your hall's purpose
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? HALL_CATEGORIES.find((category) => category.value === field.value)?.label
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {HALL_CATEGORIES.map((category) => (
                          <CommandItem
                            key={category.value}
                            value={category.value}
                            onSelect={() => {
                              form.setValue("category", category.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === category.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a category that best describes your hall's purpose
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.isPrivate"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Private Hall</FormLabel>
                <FormDescription>
                  Make this hall private and only accessible to approved members
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.requiresApproval"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Require Approval</FormLabel>
                <FormDescription>
                  Require admin approval for new members to join
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Hall...
            </>
          ) : (
            'Create Hall'
          )}
        </Button>
      </form>
    </Form>
  );
} 