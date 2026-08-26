import { FastifyInstance } from 'fastify';
import { RegistroController } from '../controllers/registro.controller.js';

export async function registroRoutes(app: FastifyInstance) {
  app.get('/api/registros', RegistroController.list);
  app.get('/api/registros/:id', RegistroController.getById);
  app.post('/api/registros', RegistroController.create);
  app.put('/api/registros/:id', RegistroController.update);
  app.delete('/api/registros/:id', RegistroController.delete);
}
