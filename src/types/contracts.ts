export interface ContractDeploymentResponse {
  address: string
  status: 'pending' | 'deployed' | 'failed'
}

export interface HallContractParams {
  MASTER_ADDRESS: string
  CREATOR_ADDRESS: string
} 