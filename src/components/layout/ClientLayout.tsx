'use client';

import { MenuSidebar } from '@/components/menu/MenuSidebar';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import InnUnfoldLogo from '@/components/common/InnUnfoldLogo';

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
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
            {/* Left spacer */}
            <div className="w-[100px]" />
            
            {/* Centered logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <InnUnfoldLogo className="h-8" />
            </div>
            
            {/* Right-aligned wallet button */}
            <WalletConnectButton />
          </div>
        </header>
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 