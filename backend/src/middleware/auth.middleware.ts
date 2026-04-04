import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
    const payload = request.user as { id: number };
    const user = AuthService.getUserById(payload.id);

    if (!user) {
      await reply.status(401).send({ error: request.t('errors:unauthorized') });
      return;
    }

    // Set user language for i18n
    await request.i18n.changeLanguage(user.language);
  } catch {
    await reply.status(401).send({ error: request.t('errors:unauthorized') });
  }
}
