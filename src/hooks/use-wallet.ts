// src/hooks/use-wallet.ts (Enhanced)
import { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/walletStore';
import { ArchethicService } from '@/services/archethic';
import { ConnectionState } from "@archethicjs/sdk";
import { useToast } from '@/components/ui/use-toast';
import { createAppError } from '@/lib/errors';

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_INTERVAL = 5000; // 5 seconds

export function useWallet() {
  const { toast } = useToast();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { 
    walletAddress, 
    genesisAddress, 
    isConnected, 
    connectionState,
    lastConnected,
    connectionAttempts,
    connectionError,
    setConnectionState,
    setWalletState,
    setConnectionError,
    incrementConnectionAttempt,
    resetConnectionAttempts,
    disconnect,
  } = useWalletStore();

  // Add auto reconnect on page load
  useEffect(() => {
    const attemptReconnect = async () => {
      // Only attempt reconnect if we have a previous connection and aren't already connected
      if (walletAddress && !isConnected && !isReconnecting && connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
        setIsReconnecting(true);
        incrementConnectionAttempt();
        
        try {
          const result = await connect(true);
          if (result) {
            resetConnectionAttempts();
          }
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
        } finally {
          setIsReconnecting(false);
        }
      }
    };
    
    attemptReconnect();
    
    // Set up reconnection interval if needed
    let reconnectTimer: NodeJS.Timeout | null = null;
    
    if (walletAddress && !isConnected && connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectTimer = setInterval(attemptReconnect, RECONNECT_INTERVAL);
    }
    
    return () => {
      if (reconnectTimer) {
        clearInterval(reconnectTimer);
      }
    };
  }, [walletAddress, isConnected, connectionAttempts]);

  // Monitor connection state changes
  useEffect(() => {
    const setupConnectionListener = async () => {
      const archethicService = await ArchethicService.getInstance();
      
      // Subscribe to connection state changes
      const unsubscribe = archethicService.subscribeToConnectionState((state) => {
        setConnectionState(state);
        
        // Update wallet state when disconnected
        if (state === ConnectionState.Closed && isConnected) {
          setWalletState(null, null, false);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet connection was closed.",
            variant: "destructive",
          });
        }
      });

      return () => {
        unsubscribe();
      };
    };

    setupConnectionListener();
  }, [setConnectionState, setWalletState, isConnected, toast]);

  const connect = async (silent = false): Promise<boolean> => {
    if (isConnected) return true;
    
    setConnectionError(null);
    
    try {
      const archethicService = await ArchethicService.getInstance();
      const result = await archethicService.connectWallet();

      if (result.connected && result.account && result.genesisAddress) {
        setWalletState(result.account, result.genesisAddress, true);
        if (!silent) {
          toast({
            title: "Wallet Connected",
            description: `Connected to ${result.account}`,
          });
        }
        return true;
      } else {
        const errorMessage = result.error || "Failed to connect wallet. Please try again.";
        setConnectionError(errorMessage);
        if (!silent) {
          toast({
            title: "Connection Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setConnectionError(errorMessage);
      
      if (!silent) {
        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const disconnectWallet = async () => {
    try {
      const archethicService = await ArchethicService.getInstance();
      await archethicService.disconnectWallet();
      disconnect();
      resetConnectionAttempts();
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      
      toast({
        title: "Disconnection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    walletAddress,
    genesisAddress,
    isConnected,
    connectionState,
    isReconnecting,
    connectionError,
    connect,
    disconnect: disconnectWallet
  };
}