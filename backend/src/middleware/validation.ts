import type { FastifyRequest, FastifyReply } from 'fastify';

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'filename';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export function validateBody(rules: ValidationRule[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = request.body as Record<string, unknown>;
    const errors: string[] = [];

    for (const rule of rules) {
      const value = body?.[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value === undefined || value === null || value === '') continue;

      if (rule.type === 'string' || rule.type === 'filename') {
        if (typeof value !== 'string') {
          errors.push(`${rule.field} must be a string`);
          continue;
        }

        const sanitized = value.replace(/<[^>]*>/g, '').trim();
        body[rule.field] = sanitized;

        if (rule.minLength !== undefined && sanitized.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength !== undefined && sanitized.length > rule.maxLength) {
          errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
        }
        if (rule.type === 'filename' && !/^[\w\-. ]+$/.test(sanitized)) {
          errors.push(`${rule.field} contains invalid characters`);
        }
        if (rule.pattern !== undefined && !rule.pattern.test(sanitized)) {
          errors.push(`${rule.field} has invalid format`);
        }
      }

      if (rule.type === 'number' && typeof value !== 'number') {
        errors.push(`${rule.field} must be a number`);
      }
    }

    if (errors.length > 0) {
      await reply.status(400).send({ error: errors.join(', ') });
    }
  };
}
