import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import * as i18nextMiddleware from 'i18next-http-middleware';
import i18next from './i18n.js';
import { authRoutes } from './routes/auth.routes.js';
import { sessionRoutes } from './routes/session.routes.js';
import { templateRoutes } from './routes/template.routes.js';
import { exportRoutes } from './routes/export.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from './database/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

await fastify.register(fastifyCors, {
  origin: true,
  credentials: true
});

await fastify.register(fastifyJwt, {
  secret: JWT_SECRET
});

await fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// i18n middleware
await fastify.register(i18nextMiddleware.plugin, { i18next });

// Authenticate decorator
fastify.decorate('authenticate', authMiddleware);

// Health check
fastify.get('/health', async (_request, reply) => {
  try {
    db.prepare('SELECT 1').get();
    return reply.send({ status: 'ok', database: 'connected' });
  } catch {
    return reply.status(503).send({ status: 'error', database: 'disconnected' });
  }
});

// Routes
await fastify.register(authRoutes);
await fastify.register(sessionRoutes);
await fastify.register(templateRoutes);
await fastify.register(exportRoutes);

// Serve frontend static files (only if dist exists)
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  await fastify.register(fastifyStatic, {
    root: frontendDist,
    prefix: '/'
  });

  fastify.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api/')) {
      void reply.status(404).send({ error: 'Not Found' });
    } else {
      void reply.sendFile('index.html');
    }
  });
} else {
  fastify.setNotFoundHandler((request, reply) => {
    void reply.status(404).send({ error: 'Not Found' });
  });
}

// Error handler
fastify.setErrorHandler(errorHandler);

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

try {
  await fastify.listen({ port: PORT, host: HOST });
  fastify.log.info(`Server listening on ${HOST}:${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
