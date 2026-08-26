import { FastifyInstance } from 'fastify';
import { PerfilPlataformaController } from '../controllers/perfil-plataforma.controller.js';

export async function perfilPlataformaRoutes(app: FastifyInstance) {
  app.get('/api/perfis-plataforma', PerfilPlataformaController.list);
  app.get('/api/perfis-plataforma/:id', PerfilPlataformaController.getById);
  app.post('/api/perfis-plataforma', PerfilPlataformaController.create);
  app.put('/api/perfis-plataforma/:id', PerfilPlataformaController.update);
  app.delete('/api/perfis-plataforma/:id', PerfilPlataformaController.delete);
}
