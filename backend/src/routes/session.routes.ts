import type { FastifyInstance } from 'fastify';
import { SessionService } from '../services/session.service.js';
import { MarkdownParserService } from '../services/markdown-parser.service.js';
import type { SaveTestResultBody } from '../types/index.js';

export async function sessionRoutes(fastify: FastifyInstance): Promise<void> {
  // Upload test plan
  fastify.post('/api/sessions/upload', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: request.t('errors:fileUploadFailed') });
    }

    if (!data.filename.endsWith('.md')) {
      return reply.status(400).send({ error: request.t('errors:invalidFileType') });
    }

    const buffer = await data.toBuffer();
    const markdown = buffer.toString('utf-8');
    const parsed = MarkdownParserService.parse(markdown);

    const userId = (request.user as { id: number }).id;
    const session = SessionService.createSession(
      userId,
      parsed.title || data.filename,
      data.filename,
      parsed
    );

    return reply.send(session);
  });

  // Get all sessions
  fastify.get('/api/sessions', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const userId = (request.user as { id: number }).id;
    const sessions = SessionService.getAllSessions(userId);
    return reply.send(sessions);
  });

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
}
