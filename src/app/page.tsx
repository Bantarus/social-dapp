import ZoneContainer from '@/components/zones/zoneContainer';
import { YieldZone } from '@/components/zones/YieldZone';
import { ArchethicService } from '@/services/archethic';

// Since we need to fetch initial data for the YieldZone
async function getInitialYieldMetrics() {
  const archethicService = new ArchethicService();
  // In a real implementation, we would get the user's address from the session/auth
  const mockUserAddress = "mock_address";
  return archethicService.getUserYieldMetrics(mockUserAddress);
}

export default async function Home() {
  // Fetch initial yield metrics
  const initialYieldMetrics = await getInitialYieldMetrics();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome to Unfoldinn</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          A decentralized social platform built on Archethic blockchain, featuring dynamic Speed Zones for content relevance.
        </p>
        
        {/* Yield Zone Section */}
        <section className="mb-12">
          <YieldZone userMetrics={initialYieldMetrics} />
        </section>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-8" />
        {/* Display Speed Zone Posts */}
        <section className="space-y-6">
          <ZoneContainer />
        </section>
      </div>
    </main>
  );
}
