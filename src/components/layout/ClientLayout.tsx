'use client';

import { MenuSidebar } from '@/components/menu/MenuSidebar';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Combined Navigation and Profile Sidebar */}
      <MenuSidebar />

      {/* Main Content */}
      <div className="flex-1">
        <header className="h-14 border-b px-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">UnfoldInn</h1>
          </div>
          <WalletConnectButton />
        </header>
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 