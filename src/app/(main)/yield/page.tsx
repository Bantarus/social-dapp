import { YieldZone } from '@/components/zones/YieldZone';
import { ArchethicService } from '@/services/archethic';

async function getInitialYieldMetrics() {
  const archethicService = new ArchethicService();
  // In a real implementation, we would get the user's address from the session/auth
  const mockUserAddress = "mock_address";
  return archethicService.getUserYieldMetrics(mockUserAddress);
}

export default async function YieldPage() {
  const initialYieldMetrics = await getInitialYieldMetrics();

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">The Notice Board</h1>
        <YieldZone userMetrics={initialYieldMetrics} />
      </div>
    </div>
  );
} 