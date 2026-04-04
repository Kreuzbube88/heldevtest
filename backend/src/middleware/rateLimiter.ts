import type { FastifyRequest, FastifyReply } from 'fastify';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private readonly requests: Map<string, RateLimitRecord> = new Map();

  limit(config: RateLimitConfig) {
    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const ip =
        (request.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
        request.ip ??
        'unknown';
      const now = Date.now();
      const record = this.requests.get(ip);

      if (!record || now > record.resetAt) {
        this.requests.set(ip, { count: 1, resetAt: now + config.windowMs });
        return;
      }

      if (record.count >= config.maxRequests) {
        await reply.status(429).send({ error: 'Too many requests. Please try again later.' });
        return;
      }

      record.count++;
    };
  }

  startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [ip, record] of this.requests.entries()) {
        if (now > record.resetAt) {
          this.requests.delete(ip);
        }
      }
    }, 5 * 60 * 1000);
  }
}

export const rateLimiter = new RateLimiter();
