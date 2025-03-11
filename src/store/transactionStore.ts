import { create } from 'zustand';

export type TransactionStatus = 
  | 'pending'
  | 'broadcasting'
  | 'confirming'
  | 'confirmed'
  | 'failed';

export interface Transaction {
  id: string;
  type: 'contract_deployment' | 'hall_creation' | 'post_creation' | 'engagement' | 'other';
  title: string;
  description?: string;
  status: TransactionStatus;
  hash?: string;
  confirmations?: number;
  createdAt: Date;
  updatedAt: Date;
  error?: Error;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  removeTransaction: (id: string) => void;
  clearTransactions: () => void;
  getTransaction: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: Transaction['type']) => Transaction[];
  getPendingTransactions: () => Transaction[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  
  addTransaction: (transaction) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
    
    return id;
  },
  
  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => 
        tx.id === id 
          ? { 
              ...tx, 
              ...updates, 
              updatedAt: new Date() 
            } 
          : tx
      ),
    }));
  },
  
  removeTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    }));
  },
  
  clearTransactions: () => {
    set({ transactions: [] });
  },
  
  getTransaction: (id) => {
    return get().transactions.find((tx) => tx.id === id);
  },
  
  getTransactionsByType: (type) => {
    return get().transactions.filter((tx) => tx.type === type);
  },
  
  getPendingTransactions: () => {
    return get().transactions.filter(
      (tx) => ['pending', 'broadcasting', 'confirming'].includes(tx.status)
    );
  },
}));