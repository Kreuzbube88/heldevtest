import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply): void {
  request.log.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || request.t('errors:internalError');

  void reply.status(statusCode).send({
    error: message,
    statusCode
  });
}
