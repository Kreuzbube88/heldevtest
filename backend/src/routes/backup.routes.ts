import type { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';

export async function backupRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/api/backup/download',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const dbPath = process.env.DB_PATH || '/app/data/heldevtest.db';

      if (!fs.existsSync(dbPath)) {
        return reply.status(404).send({ error: request.t('errors:backupNotFound') });
      }

      const backupName = `heldevtest-backup-${Date.now()}.db`;
      const fileBuffer = fs.readFileSync(dbPath);

      return reply
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Disposition', `attachment; filename="${backupName}"`)
        .send(fileBuffer);
    }
  );
}
