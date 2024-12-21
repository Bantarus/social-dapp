export const HALL_CATEGORIES = [
  // Technology & Development
  { value: 'blockchain', label: 'Blockchain & Crypto' },
  { value: 'programming', label: 'Programming & Development' },
  { value: 'web3', label: 'Web3 & DApps' },
  { value: 'ai-ml', label: 'AI & Machine Learning' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  
  // Creative & Arts
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'nft', label: 'NFTs & Digital Collectibles' },
  { value: 'design', label: 'Design & UI/UX' },
  { value: 'music', label: 'Music & Audio' },
  
  // Business & Economics
  { value: 'defi', label: 'DeFi & Finance' },
  { value: 'dao', label: 'DAOs & Governance' },
  { value: 'tokenomics', label: 'Tokenomics & Economics' },
  { value: 'startups', label: 'Startups & Innovation' },
  
  // Education & Research
  { value: 'research', label: 'Research & Development' },
  { value: 'education', label: 'Education & Learning' },
  { value: 'documentation', label: 'Documentation & Guides' },
  
  // Community & Social
  { value: 'community', label: 'Community Building' },
  { value: 'events', label: 'Events & Meetups' },
  { value: 'governance', label: 'Governance & Voting' },
  
  // Gaming & Entertainment
  { value: 'gaming', label: 'Gaming & Metaverse' },
  { value: 'entertainment', label: 'Entertainment' },
  
  // Infrastructure & Tools
  { value: 'infrastructure', label: 'Infrastructure & Protocols' },
  { value: 'tools', label: 'Tools & Utilities' },
  
  // Other
  { value: 'other', label: 'Other' }
] as const;

export type HallCategory = typeof HALL_CATEGORIES[number]['value']; 