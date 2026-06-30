/**
 * Rate Limiting with Tier-based Configuration
 * Implements intelligent rate limiting based on user tier and API endpoint
 */

class RateLimiter {
  constructor() {
    this.tiers = {
      free: { requestsPerMinute: 10, requestsPerHour: 100 },
      premium: { requestsPerMinute: 100, requestsPerHour: 10000 },
      enterprise: { requestsPerMinute: 1000, requestsPerHour: 100000 },
    };
    this.requestCounts = new Map();
  }

  /**
   * Check if request should be allowed based on tier and endpoint
   */
  checkRateLimit(userId, tier, endpoint) {
    const tierConfig = this.tiers[tier] || this.tiers.free;
    const key = `${userId}:${endpoint}`;
    const now = Date.now();

    if (!this.requestCounts.has(key)) {
      this.requestCounts.set(key, []);
    }

    const timestamps = this.requestCounts.get(key);
    const recentMinute = timestamps.filter(t => now - t < 60000);
    const recentHour = timestamps.filter(t => now - t < 3600000);

    if (
      recentMinute.length >= tierConfig.requestsPerMinute ||
      recentHour.length >= tierConfig.requestsPerHour
    ) {
      return {
        allowed: false,
        limit: tierConfig.requestsPerMinute,
        remaining: Math.max(0, tierConfig.requestsPerMinute - recentMinute.length),
      };
    }

    timestamps.push(now);
    this.requestCounts.set(key, timestamps.filter(t => now - t < 3600000));

    return {
      allowed: true,
      limit: tierConfig.requestsPerMinute,
      remaining: tierConfig.requestsPerMinute - recentMinute.length - 1,
    };
  }

  /**
   * Get current usage statistics for a user
   */
  getUsageStats(userId, tier) {
    const tierConfig = this.tiers[tier] || this.tiers.free;
    const stats = {};

    for (const [key, timestamps] of this.requestCounts) {
      if (key.startsWith(userId)) {
        const now = Date.now();
        stats[key] = {
          minuteUsage: timestamps.filter(t => now - t < 60000).length,
          hourUsage: timestamps.filter(t => now - t < 3600000).length,
          limits: tierConfig,
        };
      }
    }

    return stats;
  }
}

module.exports = RateLimiter;
