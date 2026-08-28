import { FastifyRequest, FastifyReply } from 'fastify';
import { RegistroService } from '../services/registro.service.js';

export class RegistroController {
  static async list(req: FastifyRequest, reply: FastifyReply) {
    try {
      const query = req.query as any;
      const registros = await RegistroService.list({
        search: query.search,
        area: query.area,
        situacao: query.situacao,
        complexidade: query.complexidade,
        nivelMaturidade: query.nivelMaturidade,
        arquetipo: query.arquetipo,
      });
      return reply.send(registros);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao listar registros de automação.' });
    }
  }

  static async getDiagnostico(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      const diagnostico = await RegistroService.getDiagnostico(id);
      if (!diagnostico) {
        return reply.status(404).send({ error: 'Registro não encontrado para diagnóstico.' });
      }
      return reply.send(diagnostico);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao gerar diagnóstico de instrumentação.' });
    }
  }

  static async getById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      const registro = await RegistroService.getById(id);
      if (!registro) {
        return reply.status(404).send({ error: 'Registro não encontrado.' });
      }
      return reply.send(registro);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar registro.' });
    }
  }

  static async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as any;
      const novoRegistro = await RegistroService.create(data);
      return reply.status(201).send(novoRegistro);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao cadastrar oportunidade de automação.' });
    }
  }

  static async update(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      const data = req.body as any;
      const updated = await RegistroService.update(id, data);
      return reply.send(updated);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao atualizar registro.' });
    }
  }

  static async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      await RegistroService.delete(id);
      return reply.send({ success: true, message: 'Registro excluído com sucesso.' });
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao remover registro.' });
    }
  }
}
