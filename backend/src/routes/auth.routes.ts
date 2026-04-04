import type { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { TemplateService } from '../services/template.service.js';
import type { CreateUserBody, LoginBody } from '../types/index.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // Check if setup is needed
  fastify.get('/api/auth/status', async (_request, reply) => {
    const hasUser = AuthService.hasUser();
    return reply.send({ setupRequired: !hasUser });
  });

  // First-run setup
  fastify.post<{ Body: CreateUserBody }>('/api/auth/setup', async (request, reply) => {
    const { username, password, language } = request.body;

    if (!username) {
      return reply.status(400).send({ error: request.t('validation:usernameRequired') });
    }
    if (!password) {
      return reply.status(400).send({ error: request.t('validation:passwordRequired') });
    }
    if (password.length < 8) {
      return reply.status(400).send({ error: request.t('validation:passwordTooShort') });
    }
    if (!language || !['de', 'en'].includes(language)) {
      return reply.status(400).send({ error: request.t('validation:languageInvalid') });
    }
    if (AuthService.hasUser()) {
      return reply.status(400).send({ error: request.t('errors:userExists') });
    }

    const user = await AuthService.createUser(username, password, language);

    TemplateService.seedDefaultTemplates();

    const token = fastify.jwt.sign({ id: user.id });

    return reply.send({
      token,
      user: {
        id: user.id,
        username: user.username,
        language: user.language
      }
    });
  });

  // Login
  fastify.post<{ Body: LoginBody }>(
    '/api/auth/login',
    { preHandler: [rateLimiter.limit({ windowMs: 15 * 60 * 1000, maxRequests: 5 })] },
    async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.status(400).send({ error: request.t('validation:usernameRequired') });
    }

    const user = await AuthService.verifyUser(username, password);

    if (!user) {
      return reply.status(401).send({ error: request.t('errors:invalidCredentials') });
    }

    const token = fastify.jwt.sign({ id: user.id });

    return reply.send({
      token,
      user: {
        id: user.id,
        username: user.username,
        language: user.language
      }
    });
  });

  // Change password
  fastify.put<{ Body: ChangePasswordBody }>(
    '/api/auth/password',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: number }).id;
      const { currentPassword, newPassword } = request.body;

      if (!currentPassword) {
        return reply.status(400).send({ error: request.t('validation:currentPasswordRequired') });
      }
      if (!newPassword) {
        return reply.status(400).send({ error: request.t('validation:passwordRequired') });
      }
      if (newPassword.length < 8) {
        return reply.status(400).send({ error: request.t('validation:passwordTooShort') });
      }

      const success = await AuthService.updatePassword(userId, currentPassword, newPassword);
      if (!success) {
        return reply.status(401).send({ error: request.t('validation:currentPasswordInvalid') });
      }

      return reply.send({ message: request.t('common:passwordChanged') });
    }
  );

  // Update language
  fastify.put<{ Body: { language: string } }>(
    '/api/auth/language',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: number }).id;
      const { language } = request.body;

      if (!language || !['de', 'en'].includes(language)) {
        return reply.status(400).send({ error: request.t('validation:languageInvalid') });
      }

      AuthService.updateUserLanguage(userId, language);
      return reply.send({ success: true, language });
    }
  );
}
