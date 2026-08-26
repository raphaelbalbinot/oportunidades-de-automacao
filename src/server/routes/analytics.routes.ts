import { FastifyInstance } from 'fastify';
import { AnalyticsController } from '../controllers/analytics.controller.js';

export async function analyticsRoutes(app: FastifyInstance) {
  app.get('/api/analytics/resumo', AnalyticsController.getResumo);
}
