'use client';

import { MenuSidebar } from '@/components/menu/MenuSidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Combined Navigation and Profile Sidebar */}
      <MenuSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
} 