import { FastifyInstance } from 'fastify';
import { AreaController } from '../controllers/area.controller.js';

export async function areaRoutes(fastify: FastifyInstance) {
  fastify.get('/api/areas', AreaController.getAll);
  fastify.get('/api/areas/:id', AreaController.getById);
  fastify.post('/api/areas', AreaController.create);
  fastify.put('/api/areas/:id', AreaController.update);
  fastify.delete('/api/areas/:id', AreaController.delete);
}
