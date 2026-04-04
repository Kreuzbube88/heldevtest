import type { FastifyInstance } from 'fastify';
import { TemplateService } from '../services/template.service.js';

export async function templateRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all templates
  fastify.get('/api/templates', { preHandler: [fastify.authenticate] }, async (_request, reply) => {
    const templates = TemplateService.getAllTemplates();
    return reply.send(templates);
  });

  // Get single template
  fastify.get<{ Params: { id: string } }>(
    '/api/templates/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const template = TemplateService.getTemplateById(Number(request.params.id));

      if (!template) {
        return reply.status(404).send({ error: request.t('errors:templateNotFound') });
      }

      return reply.send(template);
    }
  );

  // Create template
  fastify.post<{ Body: { name: string; description: string; content: string } }>(
    '/api/templates',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { name, description, content } = request.body;
      const template = TemplateService.createTemplate(name, description, content);
      return reply.send(template);
    }
  );

  // Delete template
  fastify.delete<{ Params: { id: string } }>(
    '/api/templates/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      TemplateService.deleteTemplate(Number(request.params.id));
      return reply.send({ success: true });
    }
  );
}
