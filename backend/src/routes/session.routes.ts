import type { FastifyInstance } from 'fastify';
import { SessionService } from '../services/session.service.js';
import { MarkdownParserService } from '../services/markdown-parser.service.js';
import type { SaveTestResultBody, ResolveProblemBody } from '../types/index.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

interface SectionContentBody {
  content: string;
}

export async function sessionRoutes(fastify: FastifyInstance): Promise<void> {
  // Upload test plan
  fastify.post(
    '/api/sessions/upload',
    { preHandler: [fastify.authenticate, rateLimiter.limit({ windowMs: 60 * 1000, maxRequests: 20 })] },
    async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: request.t('errors:fileUploadFailed') });
    }

    if (!data.filename.endsWith('.md')) {
      return reply.status(400).send({ error: request.t('errors:invalidFileType') });
    }

    const buffer = await data.toBuffer();
    const markdown = buffer.toString('utf-8');
    const { plan, problems } = MarkdownParserService.parse(markdown);

    const userId = (request.user as { id: number }).id;
    const session = SessionService.createSession(
      userId,
      plan.title || data.filename,
      data.filename,
      plan
    );

    return reply.send({ success: true, sessionId: session.id, problems });
  });

  // Get sessions (paginated)
  fastify.get<{ Querystring: { page?: string; limit?: string } }>(
    '/api/sessions',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: number }).id;
      const page = Math.max(1, parseInt(request.query.page ?? '1', 10));
      const limit = Math.min(100, Math.max(1, parseInt(request.query.limit ?? '20', 10)));
      const offset = (page - 1) * limit;

      const result = SessionService.getSessionsPaginated(userId, limit, offset);
      return reply.send({
        sessions: result.sessions,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: offset + result.sessions.length < result.total
        }
      });
    }
  );

  // Get single session with results
  fastify.get<{ Params: { id: string } }>(
    '/api/sessions/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const session = SessionService.getSessionById(Number(request.params.id));

      if (!session) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }

      const results = SessionService.getSessionResults(session.id);
      return reply.send({ session, results });
    }
  );

  // Clone session
  fastify.post<{ Params: { id: string } }>(
    '/api/sessions/:id/clone',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: number }).id;
      const cloned = SessionService.cloneSession(Number(request.params.id), userId);
      if (!cloned) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }
      return reply.send({ success: true, sessionId: cloned.id });
    }
  );

  // Archive session
  fastify.put<{ Params: { id: string } }>(
    '/api/sessions/:id/archive',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const ok = SessionService.archiveSession(Number(request.params.id));
      if (!ok) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }
      return reply.send({ success: true });
    }
  );

  // Unarchive session
  fastify.put<{ Params: { id: string } }>(
    '/api/sessions/:id/unarchive',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const ok = SessionService.unarchiveSession(Number(request.params.id));
      if (!ok) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }
      return reply.send({ success: true });
    }
  );

  // Delete session
  fastify.delete<{ Params: { id: string } }>(
    '/api/sessions/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      SessionService.deleteSession(Number(request.params.id));
      return reply.send({ success: true });
    }
  );

  // Save test result (auto-save)
  fastify.post<{ Params: { id: string }; Body: SaveTestResultBody }>(
    '/api/sessions/:id/results',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const sessionId = Number(request.params.id);
      const { test_path, status, bugs, duration_seconds } = request.body;

      const result = SessionService.saveTestResult(sessionId, test_path, status, bugs, duration_seconds);
      return reply.send(result);
    }
  );

  // Apply import resolutions
  fastify.post<{ Params: { id: string }; Body: ResolveProblemBody }>(
    '/api/sessions/:id/resolve-problems',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const sessionId = Number(request.params.id);
      const { resolutions } = request.body;

      const session = SessionService.applyResolutions(sessionId, resolutions);
      if (!session) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }

      return reply.send({ success: true, session });
    }
  );

  // Update freetext section content (auto-save)
  fastify.put<{ Params: { id: string; sectionId: string }; Body: SectionContentBody }>(
    '/api/sessions/:id/sections/:sectionId/content',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const sessionId = Number(request.params.id);
      const { sectionId } = request.params;
      const { content } = request.body;

      const ok = SessionService.updateSectionContent(sessionId, sectionId, content);
      if (!ok) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }

      return reply.send({ success: true });
    }
  );
}
