import { FastifyRequest, FastifyReply } from 'fastify';
import { PerfilPlataformaService } from '../services/perfil-plataforma.service.js';

export class PerfilPlataformaController {
  static async list(request: FastifyRequest, reply: FastifyReply) {
    const perfis = await PerfilPlataformaService.list();
    return reply.send(perfis);
  }

  static async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const perfil = await PerfilPlataformaService.getById(request.params.id);
    if (!perfil) {
      return reply.status(404).send({ error: 'Perfil de plataforma não encontrado' });
    }
    return reply.send(perfil);
  }

  static async create(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
      const perfil = await PerfilPlataformaService.create(request.body);
      return reply.status(201).send(perfil);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Erro ao criar perfil de plataforma' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    try {
      const perfil = await PerfilPlataformaService.update(request.params.id, request.body);
      return reply.send(perfil);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Erro ao atualizar perfil de plataforma' });
    }
  }

  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await PerfilPlataformaService.delete(request.params.id);
      return reply.send({ message: 'Perfil excluído com sucesso' });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Erro ao excluir perfil de plataforma' });
    }
  }
}
