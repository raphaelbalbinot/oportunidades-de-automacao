import { FastifyRequest, FastifyReply } from 'fastify';
import { AreaService, AreaInput } from '../services/area.service.js';

export class AreaController {
  static async getAll(req: FastifyRequest, reply: FastifyReply) {
    try {
      const areas = await AreaService.getAll();
      return reply.send(areas);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao listar áreas corporativas.' });
    }
  }

  static async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const area = await AreaService.getById(req.params.id);
      if (!area) {
        return reply.status(404).send({ error: 'Área corporativa não encontrada.' });
      }
      return reply.send(area);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar área corporativa.' });
    }
  }

  static async create(req: FastifyRequest<{ Body: AreaInput }>, reply: FastifyReply) {
    try {
      if (!req.body.nome || !req.body.nome.trim()) {
        return reply.status(400).send({ error: 'O nome da área corporativa é obrigatório.' });
      }
      const created = await AreaService.create(req.body);
      return reply.status(201).send(created);
    } catch (error: any) {
      req.log.error(error);
      if (error.code === 'P2002') {
        return reply.status(409).send({ error: 'Já existe uma área cadastrada com este nome.' });
      }
      return reply.status(500).send({ error: 'Erro ao cadastrar área corporativa.' });
    }
  }

  static async update(
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<AreaInput> }>,
    reply: FastifyReply
  ) {
    try {
      const updated = await AreaService.update(req.params.id, req.body);
      return reply.send(updated);
    } catch (error: any) {
      req.log.error(error);
      if (error.code === 'P2002') {
        return reply.status(409).send({ error: 'Já existe uma área com este nome.' });
      }
      return reply.status(500).send({ error: 'Erro ao atualizar área corporativa.' });
    }
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await AreaService.delete(req.params.id);
      return reply.send({ success: true, message: 'Área excluída com sucesso.' });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao excluir área corporativa.' });
    }
  }
}
