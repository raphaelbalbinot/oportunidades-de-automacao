import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  static async getResumo(req: FastifyRequest, reply: FastifyReply) {
    try {
      const query = req.query as any;
      const resumo = await AnalyticsService.getResumo({
        registroId: query.registroId,
        area: query.area,
        situacao: query.situacao,
        nivelMaturidade: query.nivelMaturidade,
        arquetipo: query.arquetipo,
      });
      return reply.send(resumo);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({ error: 'Erro ao gerar dados analíticos agregados.' });
    }
  }
}
