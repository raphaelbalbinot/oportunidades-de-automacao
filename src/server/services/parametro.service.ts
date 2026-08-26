import { prisma } from '../lib/prisma.js';
import { ParametroData } from './calculation.service.js';

export class ParametroService {
  static async getParametros(): Promise<ParametroData & { id: string; updatedAt: Date }> {
    let parametro = await prisma.parametro.findUnique({
      where: { id: 'singleton' },
    });

    if (!parametro) {
      parametro = await prisma.parametro.create({
        data: {
          id: 'singleton',
          pesoAumentarCapacidade: 2,
          pesoTransformacaoDigital: 1,
          pesoLiberarPessoas: 3,
          pesoMelhorarExpCliente: 1,
          pesoReduzirCusto: 3,
          pesoReduzirErros: 2,
          pesoReduzirFte: 3,
          pesoReduzirTempoResposta: 2,
          cargaHorariaPadrao: 160,
          operadorSalaControle: 4000,
          servidor: 1150.70,
          licencaRobo: 3325,
          estacaoTrabalhoRobo: 125,
          nrRobos: 1,
          percDiurno: 0.60,
          percNoturno: 0.30,
          percFimDeSemana: 0.10,
          custoHoraDesenvolvimento: 165,
        },
      });
    }

    return parametro;
  }

  static async updateParametros(data: Partial<ParametroData>) {
    return await prisma.parametro.upsert({
      where: { id: 'singleton' },
      update: {
        ...(data.pesoAumentarCapacidade !== undefined && { pesoAumentarCapacidade: Number(data.pesoAumentarCapacidade) }),
        ...(data.pesoTransformacaoDigital !== undefined && { pesoTransformacaoDigital: Number(data.pesoTransformacaoDigital) }),
        ...(data.pesoLiberarPessoas !== undefined && { pesoLiberarPessoas: Number(data.pesoLiberarPessoas) }),
        ...(data.pesoMelhorarExpCliente !== undefined && { pesoMelhorarExpCliente: Number(data.pesoMelhorarExpCliente) }),
        ...(data.pesoReduzirCusto !== undefined && { pesoReduzirCusto: Number(data.pesoReduzirCusto) }),
        ...(data.pesoReduzirErros !== undefined && { pesoReduzirErros: Number(data.pesoReduzirErros) }),
        ...(data.pesoReduzirFte !== undefined && { pesoReduzirFte: Number(data.pesoReduzirFte) }),
        ...(data.pesoReduzirTempoResposta !== undefined && { pesoReduzirTempoResposta: Number(data.pesoReduzirTempoResposta) }),
        ...(data.cargaHorariaPadrao !== undefined && { cargaHorariaPadrao: Number(data.cargaHorariaPadrao) }),
        ...(data.operadorSalaControle !== undefined && { operadorSalaControle: Number(data.operadorSalaControle) }),
        ...(data.servidor !== undefined && { servidor: Number(data.servidor) }),
        ...(data.licencaRobo !== undefined && { licencaRobo: Number(data.licencaRobo) }),
        ...(data.estacaoTrabalhoRobo !== undefined && { estacaoTrabalhoRobo: Number(data.estacaoTrabalhoRobo) }),
        ...(data.nrRobos !== undefined && { nrRobos: Number(data.nrRobos) }),
        ...(data.percDiurno !== undefined && { percDiurno: Number(data.percDiurno) }),
        ...(data.percNoturno !== undefined && { percNoturno: Number(data.percNoturno) }),
        ...(data.percFimDeSemana !== undefined && { percFimDeSemana: Number(data.percFimDeSemana) }),
        ...(data.custoHoraDesenvolvimento !== undefined && { custoHoraDesenvolvimento: Number(data.custoHoraDesenvolvimento) }),
      },
      create: {
        id: 'singleton',
        pesoAumentarCapacidade: Number(data.pesoAumentarCapacidade ?? 2),
        pesoTransformacaoDigital: Number(data.pesoTransformacaoDigital ?? 1),
        pesoLiberarPessoas: Number(data.pesoLiberarPessoas ?? 3),
        pesoMelhorarExpCliente: Number(data.pesoMelhorarExpCliente ?? 1),
        pesoReduzirCusto: Number(data.pesoReduzirCusto ?? 3),
        pesoReduzirErros: Number(data.pesoReduzirErros ?? 2),
        pesoReduzirFte: Number(data.pesoReduzirFte ?? 3),
        pesoReduzirTempoResposta: Number(data.pesoReduzirTempoResposta ?? 2),
        cargaHorariaPadrao: Number(data.cargaHorariaPadrao ?? 160),
        operadorSalaControle: Number(data.operadorSalaControle ?? 4000),
        servidor: Number(data.servidor ?? 1150.70),
        licencaRobo: Number(data.licencaRobo ?? 3325),
        estacaoTrabalhoRobo: Number(data.estacaoTrabalhoRobo ?? 125),
        nrRobos: Number(data.nrRobos ?? 1),
        percDiurno: Number(data.percDiurno ?? 0.60),
        percNoturno: Number(data.percNoturno ?? 0.30),
        percFimDeSemana: Number(data.percFimDeSemana ?? 0.10),
        custoHoraDesenvolvimento: Number(data.custoHoraDesenvolvimento ?? 165),
      },
    });
  }
}
