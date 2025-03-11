import { Post } from '@/types/post';
import { Achievement } from '@/types/achievement';
import { Hall } from '@/types/hall';
import Archethic, { Utils, Crypto, Contract, ConnectionState } from '@archethicjs/sdk';
import { generateHallContract } from '@/lib/contracts/templates';
import { HallContractParams } from '@/types/contracts';
import { createAppError, isAppError } from '@/lib/errors';
import { useTransactionStore } from '@/store/transactionStore';

// Import mock data
import { mockPosts } from '@/lib/mocks/posts';
import { mockHalls } from '@/lib/mocks/halls';
import { mockAchievements } from '@/lib/mocks/achievements';

// Contract addresses
const MASTER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MASTER_CONTRACT_ADDRESS;
const archethicEndpoint = process.env.NEXT_PUBLIC_ARCHETHIC_ENDPOINT || "https://testnet.archethic.net";

export class ArchethicService {
  private static instance: ArchethicService;
  private posts: Post[] = [...mockPosts];
  private halls: Hall[] = [...mockHalls];
  private archethic: Archethic;
  private rpcWallet: any;
  private isConnected: boolean = false;
  private archethicClient: Archethic;
  private walletAccount: any;

  private constructor() {
    this.archethic = new Archethic(archethicEndpoint);
    this.archethicClient = new Archethic(undefined);
    console.log('ArchethicService constructor initialized');
  }

  public static async getInstance(): Promise<ArchethicService> {
    if (!ArchethicService.instance) {
      ArchethicService.instance = new ArchethicService();
      await ArchethicService.instance.connect();
    }
    return ArchethicService.instance;
  }

  private async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.archethic.connect();
        this.isConnected = true;
        console.log("Connected to Archethic");
      } catch (error) {
        console.error("Failed to connect to Archethic:", error);
        throw error;
      }
    }
  }

  // Wallet connection management
  async connectWallet(): Promise<{
    connected: boolean;
    account?: string;
    genesisAddress?: string;
    endpoint?: string;
    error?: string;
  }> {
    try {
      if (!this.archethicClient.rpcWallet || this.archethicClient.rpcWallet  === undefined) {
        throw new Error('RPC Wallet not initialized')
      }
      console.log('archethicClient', this.archethicClient)

       // Attempt connection
       await this.archethicClient.connect().catch((error) => {
        console.error('Error connecting to Archethic:', error)
        throw new Error('Error connecting to Archethic: ' + error)
      })
      console.log('passed connect')

      await this.archethicClient.rpcWallet.setOrigin({
        name: "UnfoldInn",
        url: "https://testnet.app.unfoldinn.com"
      });

      // Get connection details
      const { endpointUrl } = await this.archethicClient.rpcWallet.getEndpoint();
      const walletAccount = await this.archethicClient.rpcWallet.getCurrentAccount();
      
      return {
        connected: true,
        account: walletAccount.shortName,
        genesisAddress: walletAccount.genesisAddress,
        endpoint: endpointUrl,
      };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return { connected: false };
    }
  }

  async disconnectWallet(): Promise<void> {
    try {
      if (!this.archethicClient.rpcWallet) {
        throw new Error('RPC Wallet not initialized');
      }
      await this.archethicClient.rpcWallet.close();
      console.log('disconnected')
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }

  // Real blockchain implementation to create a hall
  async createHall(hallData: Omit<Hall, 'id' | 'members' | 'metrics'>): Promise<Hall> {
    // Get transaction store functions
    const { addTransaction, updateTransaction } = useTransactionStore.getState();
    
    // Create a transaction entry
    const txId = addTransaction({
      type: 'hall_creation',
      title: 'Creating Hall',
      description: `Creating hall: ${hallData.name}`,
      status: 'pending',
    });
    
    try {
      if(!this.archethicClient.rpcWallet) {
        throw createAppError('RPC Wallet not initialized', 'wallet_error');
      }
  
      if(!MASTER_CONTRACT_ADDRESS) {
        throw createAppError('Master contract address not configured', 'validation_error');
      }
      
      // Update transaction status
      updateTransaction(txId, { status: 'broadcasting' });
  
      const walletAccount = await this.archethicClient.rpcWallet.getCurrentAccount();
  
      // 1. Generate a seed and derive address for the hall contract
      const hallSeed = Crypto.randomSecretKey();
      const hallAddress = Utils.uint8ArrayToHex(Crypto.deriveAddress(hallSeed, 0));
      
      console.log('Generated hall address:', hallAddress);
  
      // 2. Fund the generated address with UCO using wallet
      const fundingAmount = parseInt(process.env.NEXT_PUBLIC_FUNDING_AMOUNT || '0') * 10 ** 8;
      const fundingTx = this.archethicClient.transaction
        .new()
        .setType("transfer")
        .addUCOTransfer(hallAddress, BigInt(fundingAmount));
  
      updateTransaction(txId, { 
        description: `Funding new hall contract: ${hallData.name}` 
      });
      
      // Send funding transaction through wallet
      const fundingResult = await this.archethicClient.rpcWallet.sendTransaction(fundingTx);
      console.log('Funding transaction sent:', fundingResult);
  
      // Wait for confirmation to ensure funds are available
      await new Promise(resolve => setTimeout(resolve, 5000));
  
      // 3. Deploy the smart contract using the generated seed
      const contractCode = generateHallContract({
        CREATOR_ADDRESS: walletAccount.genesisAddress.toUpperCase(),
        MASTER_ADDRESS: MASTER_CONTRACT_ADDRESS.toUpperCase(),
      });
  
      updateTransaction(txId, { 
        description: `Deploying hall contract: ${hallData.name}` 
      });
  
      // Send contract deployment transaction directly to network
      const storageNoncePublicKey = await this.archethic.network.getStorageNoncePublicKey();
      const { encryptedSecret, authorizedKeys } = Crypto.encryptSecret(hallSeed, storageNoncePublicKey);
  
      const deployTx = this.archethic.transaction
        .new()
        .setType("contract")
        .setCode(contractCode)
        .setContent(JSON.stringify({
          ...hallData,
          name: hallData.name,
          description: hallData.description,
          isPrivate: hallData.settings?.isPrivate || false,
          requiresApproval: hallData.settings?.requiresApproval || false,
          minimumReputation: hallData.settings?.minimumReputation || 0
        }))
        .addOwnership(encryptedSecret, authorizedKeys)
        .build(hallSeed, 0);
  
      let nbConfirmation = 0;
  
      deployTx.originSign(Utils.originPrivateKey)
      .on("requiredConfirmation", (nbConf: any) => {
        console.log('Contract deployment confirmed:', nbConf);
        nbConfirmation = nbConf;
        
        // Update transaction status with confirmation count
        updateTransaction(txId, { 
          status: 'confirming',
          confirmations: nbConf
        });
      })
      .on("error", (context: any, reason: any) => {
        console.error(reason);
        
        // Update transaction status to failed
        updateTransaction(txId, { 
          status: 'failed',
          error: new Error(reason)
        });
      })
      .send();
  
      const hallDeployedAddress = Utils.uint8ArrayToHex(deployTx.address);
  
      // Wait for sufficient confirmations
      await new Promise((resolve, reject) => {
        const checkConfirmations = () => {
          if (nbConfirmation >= 11) {
            resolve(true);
          } else if (nbConfirmation === -1) {
            reject(new Error("Transaction failed"));
          } else {
            console.log('nbConfirmation : ', nbConfirmation);
            setTimeout(checkConfirmations, 1000);
          }
        };
        checkConfirmations();
      });
  
      // 4. Register with master contract
      updateTransaction(txId, { 
        description: `Registering hall with master contract: ${hallData.name}` 
      });
      
      const registerTx = this.archethicClient.transaction
        .new()
        .setType("transfer")
        .addRecipient(MASTER_CONTRACT_ADDRESS, "add_hall", [
          hallDeployedAddress,
          hallData.name,
          hallData.description,
          hallData.category,
          hallData.settings?.isPrivate
        ]);
  
      // Send registration transaction
      await this.archethicClient.rpcWallet.sendTransaction(registerTx);
  
      // Create hall object
      const newHall: Hall = {
        id: hallDeployedAddress,
        name: hallData.name || '',
        description: hallData.description || '',
        category: hallData.category || '',
        members: [{
          address: walletAccount.genesisAddress,
          role: 'admin',
          reputation: 100,
        }],
        metrics: {
          totalPosts: 0,
          activeMembers: 1,
          energyPool: 100,
          unreadCount: 0,
        },
        settings: hallData.settings || {
          isPrivate: false,
          requiresApproval: false,
          minimumReputation: 0,
        },
      };
  
      // Update transaction status to confirmed
      updateTransaction(txId, { 
        status: 'confirmed',
        description: `Successfully created hall: ${hallData.name}`
      });
      
      return newHall;
    } catch (error) {
      // Update transaction status to failed
      updateTransaction(txId, { 
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      console.error('Failed to create hall:', error);
      throw error;
    }
  }

  // Real blockchain implementation to join a hall
  async joinHall(hallId: string): Promise<Hall> {
    try {
      if (!hallId || !this.archethic.rpcWallet) {
        throw new Error('Hall ID and wallet connection are required');
      }

      const walletAccount = await this.archethic.rpcWallet.getCurrentAccount();

      const txBuilder = this.archethic.transaction
        .new()
        .setType("transfer")
        .addRecipient(MASTER_CONTRACT_ADDRESS as string, "join_hall", [hallId]);

      await this.archethic.rpcWallet.sendTransaction(txBuilder);

      // Get updated hall data
      const hall = await this.getHall(hallId);
      if (!hall) {
        throw new Error('Hall not found after joining');
      }

      return hall;
    } catch (error) {
      console.error('Failed to join hall:', error);
      throw error;
    }
  }

  // Real blockchain implementation to create a post
  async createPost(hallId: string, postData: Partial<Post>): Promise<boolean> {
    try {
      if (!hallId || !this.archethicClient.rpcWallet) {
        throw new Error('Hall ID and wallet connection are required');
      }

      const walletAccount = await this.archethicClient.rpcWallet.getCurrentAccount();

      const txBuilder = this.archethicClient.transaction
        .new()
        .setType("transfer")
        .addRecipient(hallId, "create_post", [
          postData.content,
          postData.metadata?.type || 'text',
          postData.metadata?.tags || [],
        ]);

      const response = await this.archethicClient.rpcWallet.sendTransaction(txBuilder);
      console.log('response', response)

   
      return true;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  // Get posts by zone
  async getPostsByZone(zone: 'fast' | 'cruise' | 'archive', hallId: string): Promise<Post[]> {
    try {
      // Get posts from blockchain
      const response = await this.archethic.network.callFunction(
        hallId,
        "get_posts_by_zone",
        [zone]
      );

      // Convert the map object to an array of posts with correct property mapping
      const posts = Object.entries(response.data).map(([id, postData]: [string, any]) => ({
        id,
        ...postData
      }));
      
      // Update local cache with new data
      this.posts = posts;
      
      // Filter posts
      return posts.filter((post: Post) => 
        post.zone === zone && (!hallId || post.id === hallId)
      );
    } catch (error) {
      console.error('Failed to get posts:', error);
      // Fallback to local cache
      return this.posts.filter(post => 
        post.zone === zone && (!hallId || post.id === hallId)
      );
    }
  }

  // Get all halls
  async getHalls(): Promise<Hall[]> {
    try {
      if (!MASTER_CONTRACT_ADDRESS) {
        throw new Error('Master contract address not configured');
      }



      const hallsMap = await this.archethic.network.callFunction(
        MASTER_CONTRACT_ADDRESS,
        "get_halls",
        []
      );
      console.log('Raw halls from contract:', hallsMap)

       // Convert the map object to an array of tasks with correct property mapping
       const halls = Object.entries(hallsMap).map(([id, hallData]: [string, any]) => ({
        id,
        ...hallData
      }));

      console.log('Halls:', halls)

      // Update local cache
      this.halls = halls;
      return halls;
    } catch (error) {
      console.error('Failed to get halls:', error);
      // Return cached halls in case of error
      return this.halls;
    }
  }

  // Get featured halls
  async getFeaturedHalls(): Promise<Hall[]> {
    try {
      if (!MASTER_CONTRACT_ADDRESS) {
        throw new Error('Master contract address not configured');
      }

      const result = await this.archethic.network.callFunction(
        MASTER_CONTRACT_ADDRESS,
        "get_featured_halls",
        []
      );

      if (result?.data) {
        return result.data;
      }

      // Fallback: return top halls based on metrics if no featured halls defined
      const halls = await this.getHalls();
      return halls
        .sort((a, b) => {
          // Sort by engagement metrics (active members + total posts)
          const engagementA = a.metrics.activeMembers + a.metrics.totalPosts;
          const engagementB = b.metrics.activeMembers + b.metrics.totalPosts;
          return engagementB - engagementA;
        })
        .slice(0, 5); // Return top 5 halls
    } catch (error) {
      console.error('Failed to get featured halls:', error);
      // Return mock featured halls in case of error
      return this.halls
        .sort((a, b) => {
          const engagementA = a.metrics.activeMembers + a.metrics.totalPosts;
          const engagementB = b.metrics.activeMembers + b.metrics.totalPosts;
          return engagementB - engagementA;
        })
        .slice(0, 5);
    }
  }

  // Get a specific hall
  async getHall(hallId: string): Promise<Hall | null> {
    try {
      if (!hallId) {
        throw createAppError('Hall ID is required', 'validation_error');
      }
  
      console.log('getHall called with:', hallId);
  
      // Only clean if needed
      const cleanHallId = hallId.includes('[') ? hallId.replace(/[\[\]]/g, '') : hallId;
      console.log('Using hall ID:', cleanHallId);
  
      try {
        const hallMap = await this.archethic.network.callFunction(
          MASTER_CONTRACT_ADDRESS as string,
          "get_hall",
          [cleanHallId]
        );
        console.log('getHall response:', hallMap);
  
        if (!hallMap) {
          // Look for hall in local cache
          const localHall = this.halls.find(h => h.id === hallId);
          if (localHall) return localHall;
          
          return null;
        }
  
        // Convert the map object to a hall with correct property mapping
        const hall = {
          id: cleanHallId,
          ...hallMap
        };
        
        return hall;
      } catch (networkError) {
        throw createAppError(
          'Failed to fetch hall from blockchain', 
          'network_error',
          networkError,
          { hallId: cleanHallId }
        );
      }
    } catch (error) {
      // Log the error for developers
      console.error('Failed to get hall:', error);
      
      // Re-throw AppErrors, wrap others
      if (isAppError(error)) {
        throw error;
      }
      
      throw createAppError(
        'Failed to get hall information', 
        'unknown_error',
        error
      );
    }
  }

  // Get recent activity across all halls or for a specific hall
  async getRecentActivity(hallId?: string): Promise<Array<{ post: Post; hall: Hall }>> {
    try {
      if (!MASTER_CONTRACT_ADDRESS) {
        throw new Error('Master contract address not configured');
      }

      const result = await this.archethic.network.callFunction(
        MASTER_CONTRACT_ADDRESS,
        "get_recent_activity",
        hallId ? [hallId] : []
      );

      if (result?.data) {
        // Transform the data to include hall information
        const activities = await Promise.all(
          result.data.map(async (post: Post) => {
            const hall = await this.getHall(post.hallId);
            return {
              post,
              hall: hall!
            };
          })
        );
        return activities;
      }

      // If no blockchain data, fallback to local cache
      let recentPosts = this.posts;
      
      // Filter by hall if specified
      if (hallId) {
        recentPosts = recentPosts.filter(post => post.hallId === hallId);
      }

      // Sort by timestamp (most recent first) and take last 20 posts
      const sortedPosts = recentPosts
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20);

      // Add hall information to each post
      const activities = await Promise.all(
        sortedPosts.map(async (post) => {
          const hall = await this.getHall(post.hallId);
          return {
            post,
            hall: hall || {
              id: post.hallId,
              name: 'Unknown Hall',
              description: '',
              category: '',
              members: [],
              metrics: {
                totalPosts: 0,
                activeMembers: 0,
                energyPool: 0,
                unreadCount: 0
              },
              settings: {
                isPrivate: false,
                requiresApproval: false,
                minimumReputation: 0
              }
            }
          };
        })
      );

      return activities;
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      
      // Fallback to local cache with hall information
      const activities = await Promise.all(
        this.posts
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 20)
          .map(async (post) => {
            const hall = await this.getHall(post.hallId);
            return {
              post,
              hall: hall || {
                id: post.hallId,
                name: 'Unknown Hall',
                description: '',
                category: '',
                members: [],
                metrics: {
                  totalPosts: 0,
                  activeMembers: 0,
                  energyPool: 0,
                  unreadCount: 0
                },
                settings: {
                  isPrivate: false,
                  requiresApproval: false,
                  minimumReputation: 0
                }
              }
            };
          })
      );

      return activities;
    }
  }

  // Get achievements
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await this.archethic.network.callFunction(
        MASTER_CONTRACT_ADDRESS as string,
        "get_achievements",
        []
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get achievements:', error);
      return mockAchievements;
    }
  }

  subscribeToConnectionState(callback: (state: ConnectionState) => void) {
    this.archethic.rpcWallet?.onconnectionstatechange(callback);
    return () => {
      this.archethic.rpcWallet?.unsubscribeconnectionstatechange();
    };
  }

  async leaveHall(hallId: string): Promise<Hall> {
    try {
      if (!hallId || !this.archethic.rpcWallet) {
        throw new Error('Hall ID and wallet connection are required');
      }

      const walletAccount = await this.archethic.rpcWallet.getCurrentAccount();

      const txBuilder = this.archethic.transaction
        .new()
        .setType("transfer")
        .addRecipient(MASTER_CONTRACT_ADDRESS as string, "leave_hall", [hallId]);

      await this.archethic.rpcWallet.sendTransaction(txBuilder);

      // Get updated hall data
      const hall = await this.getHall(hallId);
      if (!hall) {
        throw new Error('Hall not found after leaving');
      }

      return hall;
    } catch (error) {
      console.error('Failed to leave hall:', error);
      throw error;
    }
  }

  async updateHallSettings(hallId: string, settings: Hall['settings']): Promise<Hall> {
    try {
      if (!hallId || !this.archethic.rpcWallet) {
        throw new Error('Hall ID and wallet connection are required');
      }

      const txBuilder = this.archethic.transaction
        .new()
        .setType("transfer")
        .addRecipient(hallId, "update_settings", [
          settings.isPrivate,
          settings.requiresApproval,
          settings.minimumReputation
        ]);

      await this.archethic.rpcWallet.sendTransaction(txBuilder);

      // Get updated hall data
      const hall = await this.getHall(hallId);
      if (!hall) {
        throw new Error('Hall not found after updating settings');
      }

      return hall;
    } catch (error) {
      console.error('Failed to update hall settings:', error);
      throw error;
    }
  }
} 