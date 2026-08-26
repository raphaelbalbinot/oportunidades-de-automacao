import { FastifyInstance } from 'fastify';
import { parametroRoutes } from './parametro.routes.js';
import { registroRoutes } from './registro.routes.js';
import { analyticsRoutes } from './analytics.routes.js';
import { perfilPlataformaRoutes } from './perfil-plataforma.routes.js';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(parametroRoutes);
  await app.register(registroRoutes);
  await app.register(analyticsRoutes);
  await app.register(perfilPlataformaRoutes);

  // Healthcheck endpoint
  app.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Oportunidades de Automação API',
  }));
}
