import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConnectionState } from "@archethicjs/sdk";

export interface WalletStore {
  walletAddress: string | null;
  genesisAddress: string | null;
  isConnected: boolean;
  connectionState: ConnectionState;
  lastConnected: string | null;
  connectionAttempts: number;
  connectionError: string | null;
  setConnectionState: (state: ConnectionState) => void;
  setWalletState: (address: string | null, genesisAddress: string | null, isConnected: boolean) => void;
  setConnectionError: (error: string | null) => void;
  incrementConnectionAttempt: () => void;
  resetConnectionAttempts: () => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      genesisAddress: null,
      isConnected: false,
      connectionState: ConnectionState.Closed,
      lastConnected: null,
      connectionAttempts: 0,
      connectionError: null,
      
      setConnectionState: (state) => 
        set({ connectionState: state }),
        
      setWalletState: (address, genesisAddress, isConnected) => 
        set({ 
          walletAddress: address, 
          genesisAddress, 
          isConnected,
          lastConnected: isConnected ? new Date().toISOString() : get().lastConnected,
          connectionError: null,
        }),
      
      setConnectionError: (error) =>
        set({ connectionError: error }),
        
      incrementConnectionAttempt: () =>
        set((state) => ({ connectionAttempts: state.connectionAttempts + 1 })),
        
      resetConnectionAttempts: () =>
        set({ connectionAttempts: 0 }),
        
      disconnect: () =>
        set({ 
          isConnected: false, 
          connectionState: ConnectionState.Closed
        }),
    }),
    {
      name: 'unfoldinn-wallet-storage',
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        genesisAddress: state.genesisAddress,
        lastConnected: state.lastConnected,
      }),
    }
  )
);