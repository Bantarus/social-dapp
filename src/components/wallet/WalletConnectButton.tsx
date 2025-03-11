// src/components/wallet/WalletConnectButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2, ChevronDown } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { ConnectionState } from "@archethicjs/sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WalletConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    isConnected, 
    connectionState, 
    walletAddress,
    isReconnecting,
    connect, 
    disconnect 
  } = useWallet();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isConnected ? "Disconnecting..." : "Connecting..."}
        </>
      );
    }
    
    if (isReconnecting) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Reconnecting...
        </>
      );
    }
    
    if (connectionState === ConnectionState.Connecting) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      );
    }
    
    if (isConnected) {
      return (
        <>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="hidden md:inline mr-1">Connected:</span>
            <span className="truncate max-w-[100px]">{formatAddress(walletAddress || '')}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </>
      );
    }
    
    return (
      <>
        <Wallet className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="inline sm:hidden">Connect</span>
      </>
    );
  };

  // Format address for display (e.g., 0xabcd...1234)
  const formatAddress = (address: string): string => {
    if (!address) return '';
    if (address.length <= 10) return address;
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // If connected, show dropdown with wallet info and disconnect option
  if (isConnected) {
    return (
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading || isReconnecting || connectionState === ConnectionState.Connecting}
                >
                  {getButtonContent()}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connected: {walletAddress}</p>
            </TooltipContent>
          </Tooltip>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigator.clipboard.writeText(walletAddress || '')}>
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleDisconnect}>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    );
  }

  // If not connected, show connect button
  return (
    <Button 
      onClick={handleConnect} 
      variant="outline" 
      size="sm"
      disabled={isLoading || isReconnecting || connectionState === ConnectionState.Connecting}
    >
      {getButtonContent()}
    </Button>
  );
}