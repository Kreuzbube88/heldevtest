import type { FastifyInstance } from 'fastify';
import { SessionService } from '../services/session.service.js';
import { ExportService } from '../services/export.service.js';

export async function exportRoutes(fastify: FastifyInstance): Promise<void> {
  // Export as Markdown
  fastify.get<{ Params: { id: string } }>(
    '/api/export/:id/markdown',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const session = SessionService.getSessionById(Number(request.params.id));

      if (!session) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }

      const results = SessionService.getSessionResults(session.id);
      const markdown = ExportService.toMarkdown(session, results);

      void reply.header('Content-Type', 'text/markdown');
      void reply.header('Content-Disposition', `attachment; filename="${session.name}.md"`);
      return reply.send(markdown);
    }
  );

  // Export as HTML
  fastify.get<{ Params: { id: string } }>(
    '/api/export/:id/html',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const session = SessionService.getSessionById(Number(request.params.id));

      if (!session) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }

      const results = SessionService.getSessionResults(session.id);
      const html = ExportService.toHTML(session, results);

      void reply.header('Content-Type', 'text/html');
      void reply.header('Content-Disposition', `attachment; filename="${session.name}.html"`);
      return reply.send(html);
    }
  );

  // Export as JSON
  fastify.get<{ Params: { id: string } }>(
    '/api/export/:id/json',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const session = SessionService.getSessionById(Number(request.params.id));

      if (!session) {
        return reply.status(404).send({ error: request.t('errors:sessionNotFound') });
      }

      const results = SessionService.getSessionResults(session.id);
      const json = ExportService.toJSON(session, results);
      return reply.send(json);
    }
  );
}
