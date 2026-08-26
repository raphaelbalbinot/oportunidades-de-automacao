import { FastifyRequest, FastifyReply } from 'fastify';
import { ParametroService } from '../services/parametro.service.js';

export class ParametroController {
  static async get(req: FastifyRequest, reply: FastifyReply) {
    try {
      const parametros = await ParametroService.getParametros();
      return reply.send(parametros);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao buscar parâmetros globais.' });
    }
  }

  static async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as any;
      const updated = await ParametroService.updateParametros(data);
      return reply.send(updated);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao atualizar parâmetros globais.' });
    }
  }
}
