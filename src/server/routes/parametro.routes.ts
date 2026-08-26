import { FastifyInstance } from 'fastify';
import { ParametroController } from '../controllers/parametro.controller.js';

export async function parametroRoutes(app: FastifyInstance) {
  app.get('/api/parametros', ParametroController.get);
  app.put('/api/parametros', ParametroController.update);
}
