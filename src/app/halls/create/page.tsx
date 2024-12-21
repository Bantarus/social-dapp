import { Suspense } from 'react';
import { CreateHallForm } from '@/components/halls/CreateHallForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateHallPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Hall</CardTitle>
          <CardDescription>
            Create a new community space with customized settings and start building your community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense 
            fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg" />
                <div className="h-32 bg-gray-200 rounded-lg" />
                <div className="h-10 bg-gray-200 rounded-lg" />
              </div>
            }
          >
            <CreateHallForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
} 