'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { ConnectionState } from "@archethicjs/sdk";

export function WalletConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, connectionState, connect, disconnect } = useWallet();

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (isConnected) {
        await disconnect();
      } else {
        await connect();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return isConnected ? "Disconnecting..." : "Connecting...";
    }
    if (connectionState === ConnectionState.Connecting) {
      return "Connecting...";
    }
    return isConnected ? "Disconnect" : "Connect Wallet";
  };

  return (
    <Button 
      onClick={handleAction} 
      variant="outline" 
      size="sm"
      disabled={isLoading || connectionState === ConnectionState.Connecting}
    >
      {isConnected ? (
        <LogOut className="h-4 w-4 mr-2" />
      ) : (
        <Wallet className="h-4 w-4 mr-2" />
      )}
      {getButtonText()}
    </Button>
  );
} 