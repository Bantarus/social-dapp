'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Home, Coins, Gift, Settings, LogOut, Menu } from 'lucide-react';
import { useHalls } from '@/hooks/halls/use-halls';
import { MobileHallNav } from '@/components/halls/MobileHallNav';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export function MenuSidebar() {
  const [open, setOpen] = useState(false);
  const { data: halls, isLoading } = useHalls();
  const { isMobile } = useMediaQuery();

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b bg-muted/10">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">Username</h2>
            <p className="text-sm text-muted-foreground">@username</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden">
        {/* User Actions */}
        <nav className="p-4 border-b" aria-label="User actions">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/yield">
                <Coins className="h-4 w-4" />
                <span>The Notice Board</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Gift className="h-4 w-4" />
              <span>Achievements</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </nav>

        {/* Halls Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Your Halls</h3>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-10 bg-muted animate-pulse rounded-md" />
                <div className="h-10 bg-muted animate-pulse rounded-md" />
              </div>
            ) : halls ? (
              <MobileHallNav halls={halls} />
            ) : null}
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="block lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="fixed top-4 left-4 z-50 px-4 rounded-full shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center gap-2"
            >
              <Menu className="h-4 w-4" />
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>User Navigation</SheetTitle>
              <SheetDescription>Access your profile, halls, and settings</SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-[300px] border-r bg-background h-screen">
      <SidebarContent />
    </div>
  );
}