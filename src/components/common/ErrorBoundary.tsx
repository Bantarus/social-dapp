'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Frown, RefreshCw } from 'lucide-react';
import { isAppError, getErrorMessage } from '@/lib/errors';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Add global error handler
    const errorHandler = (event: ErrorEvent) => {
      console.error('Caught in ErrorBoundary:', event.error);
      setError(event.error);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (error) {
    // If custom fallback is provided, use it
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error UI
    return (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Frown className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {isAppError(error) ? error.userMessage : getErrorMessage(error)}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-muted rounded-md text-xs font-mono overflow-auto max-h-40">
                {error.stack}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}