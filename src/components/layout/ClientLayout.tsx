'use client';

import { HallNavigation } from '@/components/halls/HallNavigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <HallNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 