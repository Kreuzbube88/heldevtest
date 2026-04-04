import type { FastifyRequest, FastifyReply } from 'fastify';
import type { i18n } from 'i18next';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    t: (key: string, options?: Record<string, unknown>) => string;
    i18n: i18n;
  }
}
