import { useEffect } from 'react'
import { useWalletStore } from '@/store/walletStore'
import { ArchethicService } from '@/services/archethic'
import { ConnectionState } from "@archethicjs/sdk"
import { useToast } from '@/components/ui/use-toast'

export function useWallet() {
  const { toast } = useToast()
  const { 
    walletAddress, 
    genesisAddress, 
    isConnected, 
    connectionState,
    setConnectionState,
    setWalletState 
  } = useWalletStore()

  useEffect(() => {
    const setupConnectionListener = async () => {
      const archethicService = await ArchethicService.getInstance()
      
      // Subscribe to connection state changes
      const unsubscribe = archethicService.subscribeToConnectionState((state) => {
        setConnectionState(state)
        
        // Update wallet state when disconnected
        if (state === ConnectionState.Closed) {
          setWalletState(null, null, false)
        }
      })

      return () => {
        unsubscribe()
      }
    }

    setupConnectionListener()
  }, [setConnectionState, setWalletState])

  const connect = async () => {
    try {
      const archethicService = await ArchethicService.getInstance()
      const result = await archethicService.connectWallet()

      if (result.connected && result.account && result.genesisAddress) {
        setWalletState(result.account, result.genesisAddress, true)
        toast({
          title: "Wallet Connected",
          description: `Connected to ${result.account}`,
        })
        return true
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      return false
    }
  }

  const disconnect = async () => {
    try {
      const archethicService = await ArchethicService.getInstance()
      await archethicService.disconnectWallet()
      setWalletState(null, null, false)
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
      return true
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      toast({
        title: "Disconnection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    walletAddress,
    genesisAddress,
    isConnected,
    connectionState,
    connect,
    disconnect
  }
} 