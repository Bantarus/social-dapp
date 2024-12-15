import React, { useState, useEffect } from 'react';
import { Clock, Flame, Archive, TrendingUp, MessageCircle, Share2 } from 'lucide-react';

// Utility function to calculate post age and status
const calculatePostAge = (timestamp) => {
  const now = Date.now();
  const age = now - new Date(timestamp).getTime();
  const hoursOld = age / (1000 * 60 * 60);
  
  if (hoursOld < 24) return { zone: 'fast', timeLeft: 24 - hoursOld };
  if (hoursOld < 72) return { zone: 'cruise', timeLeft: 72 - hoursOld };
  return { zone: 'archive', timeLeft: 0 };
};

const SpeedZones = () => {
  // Mock posts data with timestamps
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "@alice",
      content: "🚨 Breaking: New zero-knowledge scaling solution just announced! First impressions thread... 🧵",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      engagement: { likes: 145, echoes: 23, comments: 67 },
      type: "breaking",
      engagementVelocity: 42.3 // engagements per hour
    },
    {
      id: 2,
      author: "@bob",
      content: "Deep dive: Analyzing the implications of recent governance proposals for DeFi protocols [Thread]",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
      engagement: { likes: 89, echoes: 12, comments: 34 },
      type: "analysis",
      engagementVelocity: 12.5
    },
    {
      id: 3,
      author: "@carol",
      content: "📚 Comprehensive Guide: Setting up your first Archethic node (Updated for 2024)",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(), // 100 hours ago
      engagement: { likes: 567, echoes: 89, comments: 123 },
      type: "guide",
      engagementVelocity: 5.2
    }
  ]);

  const [selectedZone, setSelectedZone] = useState('fast');
  const [zoneStats, setZoneStats] = useState({
    fast: { posts: 0, engagement: 0 },
    cruise: { posts: 0, engagement: 0 },
    archive: { posts: 0, engagement: 0 }
  });

  // Update zone stats periodically
  useEffect(() => {
    const updateStats = () => {
      const stats = posts.reduce((acc, post) => {
        const { zone } = calculatePostAge(post.timestamp);
        acc[zone].posts += 1;
        acc[zone].engagement += post.engagement.likes + post.engagement.echoes + post.engagement.comments;
        return acc;
      }, {
        fast: { posts: 0, engagement: 0 },
        cruise: { posts: 0, engagement: 0 },
        archive: { posts: 0, engagement: 0 }
      });
      setZoneStats(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [posts]);

  // Automatic zone transition system
  useEffect(() => {
    const checkZoneTransitions = () => {
      setPosts(currentPosts => 
        currentPosts.map(post => {
          const { zone } = calculatePostAge(post.timestamp);
          
          // If post is moving to archive, we need to evaluate if it qualifies
          if (zone === 'archive') {
            const totalEngagement = post.engagement.likes + post.engagement.echoes + post.engagement.comments;
            const isHighValue = totalEngagement > 500 || post.type === 'guide';
            
            if (!isHighValue) {
              // Post doesn't qualify for archive, should be removed
              return null;
            }
          }
          
          return post;
        }).filter(Boolean) // Remove null posts
      );
    };

    const interval = setInterval(checkZoneTransitions, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Zone Navigation */}
      <div className="flex space-x-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
        {[
          { id: 'fast', label: 'Fast Lane', icon: Flame, duration: '24h' },
          { id: 'cruise', label: 'Cruise Lane', icon: TrendingUp, duration: '72h' },
          { id: 'archive', label: 'Archive Lane', icon: Archive, duration: 'Permanent' }
        ].map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              selectedZone === zone.id
                ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <zone.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{zone.label}</span>
              <span className="text-xs text-gray-500">({zone.duration})</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {zoneStats[zone.id].posts} posts · {zoneStats[zone.id].engagement} engagements
            </div>
          </button>
        ))}
      </div>

      {/* Posts Display */}
      <div className="space-y-4">
        {posts
          .filter(post => calculatePostAge(post.timestamp).zone === selectedZone)
          .sort((a, b) => {
            // Sort based on zone-specific criteria
            if (selectedZone === 'fast') {
              return b.engagementVelocity - a.engagementVelocity;
            } else if (selectedZone === 'cruise') {
              return new Date(b.timestamp) - new Date(a.timestamp);
            } else {
              return (b.engagement.likes + b.engagement.echoes + b.engagement.comments) -
                     (a.engagement.likes + a.engagement.echoes + a.engagement.comments);
            }
          })
          .map(post => {
            const { timeLeft } = calculatePostAge(post.timestamp);
            
            return (
              <div 
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {post.author[1].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{post.author}</span>
                      {selectedZone !== 'archive' && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeLeft.toFixed(1)}h remaining
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{post.content}</p>
                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{post.engagement.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{post.engagement.echoes}</span>
                      </div>
                      {selectedZone === 'fast' && (
                        <div className="text-xs text-gray-500">
                          {post.engagementVelocity.toFixed(1)} engagements/hour
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SpeedZones;
