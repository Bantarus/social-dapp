'use client';

import { useEffect } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { TransactionStatus } from '@/store/transactionStore';

export function TransactionNotifications() {
  const { transactions, removeTransaction } = useTransactionStore();
  const { toast } = useToast();
  
  // Monitor transactions for state changes and show toasts
  useEffect(() => {
    const confirmedTxs = transactions.filter(
      (tx) => tx.status === 'confirmed' && tx.updatedAt > new Date(Date.now() - 5000)
    );
    
    const failedTxs = transactions.filter(
      (tx) => tx.status === 'failed' && tx.updatedAt > new Date(Date.now() - 5000)
    );
    
    // Show toast for newly confirmed transactions
    confirmedTxs.forEach((tx) => {
      toast({
        title: 'Transaction Confirmed',
        description: tx.title,
        variant: 'default',
      });
    });
    
    // Show toast for newly failed transactions
    failedTxs.forEach((tx) => {
      toast({
        title: 'Transaction Failed',
        description: tx.error?.message || tx.title,
        variant: 'destructive',
      });
    });
  }, [transactions, toast]);
  
  // Fix: Use a stable reference to the getPendingTransactions function
  const getPendingTransactions = useTransactionStore(state => state.getPendingTransactions);
  // Then call the function outside the selector
  const pendingTransactions = getPendingTransactions();
  
  if (pendingTransactions.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {pendingTransactions.map((tx) => (
        <Card key={tx.id} className="w-full shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{tx.title}</h4>
                {tx.description && (
                  <p className="text-sm text-muted-foreground">{tx.description}</p>
                )}
              </div>
              <TransactionStatusBadge status={tx.status} />
            </div>
            
            {tx.confirmations !== undefined && (
              <div className="mt-2 text-sm">
                Confirmations: {tx.confirmations}
              </div>
            )}
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeTransaction(tx.id)}
              disabled={tx.status === 'confirming' || tx.status === 'broadcasting'}
            >
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> Pending
        </Badge>
      );
    case 'broadcasting':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700">
          <Loader2 className="h-3 w-3 animate-spin" /> Broadcasting
        </Badge>
      );
    case 'confirming':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700">
          <Loader2 className="h-3 w-3 animate-spin" /> Confirming
        </Badge>
      );
    case 'confirmed':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
          <CheckCircle className="h-3 w-3" /> Confirmed
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700">
          <XCircle className="h-3 w-3" /> Failed
        </Badge>
      );
    default:
      return null;
  }
}