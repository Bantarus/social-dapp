import { create } from 'zustand'
import { ConnectionState } from "@archethicjs/sdk"

export interface WalletStore {
  walletAddress: string | null
  genesisAddress: string | null
  isConnected: boolean
  connectionState: ConnectionState
  setConnectionState: (state: ConnectionState) => void
  setWalletState: (address: string | null, genesisAddress: string | null, isConnected: boolean) => void

}

export const useWalletStore = create<WalletStore>((set, get) => ({
  walletAddress: null,
  genesisAddress: null,
  isConnected: false,
  connectionState: ConnectionState.Closed,
  
  setConnectionState: (state) => 
    set({ connectionState: state }),
    
  setWalletState: (address, genesisAddress, isConnected) => 
    set({ walletAddress: address, genesisAddress, isConnected }),

})) 