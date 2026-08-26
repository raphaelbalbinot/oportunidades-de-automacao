import { prisma } from '../lib/prisma.js';
import { CalculationService, RegistroInput } from './calculation.service.js';
import { ParametroService } from './parametro.service.js';

export interface RegistroFilter {
  search?: string;
  area?: string;
  situacao?: string;
  complexidade?: string;
}

export class RegistroService {
  static async list(filter?: RegistroFilter) {
    const where: any = {};

    if (filter?.area) {
      where.area = { contains: filter.area };
    }
    if (filter?.situacao) {
      where.situacao = filter.situacao;
    }
    if (filter?.complexidade) {
      where.complexidade = filter.complexidade;
    }
    if (filter?.search) {
      where.OR = [
        { nomeProcesso: { contains: filter.search } },
        { idAnalise: { contains: filter.search } },
        { idOrigem: { contains: filter.search } },
        { area: { contains: filter.search } },
        { descricaoProcesso: { contains: filter.search } },
        { tipoPlataformaNome: { contains: filter.search } },
      ];
    }

    return await prisma.registro.findMany({
      where,
      include: {
        perfilPlataforma: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    return await prisma.registro.findUnique({
      where: { id },
      include: {
        perfilPlataforma: true,
      },
    });
  }

  static async create(data: any) {
    const parametro = await ParametroService.getParametros();

    let perfilPlataforma = null;
    let tipoPlataformaNome = data.tipoPlataformaNome || 'Python & Robot Framework (Open Source)';
    if (data.perfilPlataformaId) {
      perfilPlataforma = await prisma.perfilPlataforma.findUnique({
        where: { id: data.perfilPlataformaId },
      });
      if (perfilPlataforma) {
        tipoPlataformaNome = perfilPlataforma.nome;
      }
    }

    const calculated = CalculationService.calculate(
      {
        ...(data as RegistroInput),
        perfilPlataforma: perfilPlataforma || undefined,
      },
      parametro
    );

    let idAnalise = data.idAnalise;
    if (!idAnalise || idAnalise.trim() === '') {
      const count = await prisma.registro.count();
      idAnalise = `P${count + 1}`;
    }

    return await prisma.registro.create({
      data: {
        idOrigem: data.idOrigem ?? '',
        idAnalise: idAnalise,
        area: data.area ?? '',
        nomeProcesso: data.nomeProcesso ?? 'Novo Processo',
        dataLevantamento: data.dataLevantamento ?? new Date().toISOString().split('T')[0],
        participantes: data.participantes ?? '',
        situacao: data.situacao ?? 'Em levantamento',
        areasEnvolvidas: data.areasEnvolvidas ?? '',
        descricaoProcesso: data.descricaoProcesso ?? '',
        numExecucoes: Number(data.numExecucoes ?? 0),
        periodicidade: data.periodicidade ?? 'Mensal',
        numPessoasEnvolvidas: Number(data.numPessoasEnvolvidas ?? 1),
        tipoAlocacao: data.tipoAlocacao ?? 'Parcial',
        perfilExecutor: data.perfilExecutor ?? 'Analista',
        valorHoraExecutor: Number(data.valorHoraExecutor ?? 0),
        tempoExecucao: Number(data.tempoExecucao ?? 0),
        sistemasEnvolvidos: data.sistemasEnvolvidos ?? '',
        documentosApoio: data.documentosApoio ?? '',

        // 12 Benefícios Corporativos
        benLiberarPessoas: data.benLiberarPessoas ?? 'nenhum',
        benReduzirCusto: data.benReduzirCusto ?? 'nenhum',
        benReduzirErros: data.benReduzirErros ?? 'nenhum',
        benSegurancaPrivacidade: data.benSegurancaPrivacidade ?? 'nenhum',
        benRastreabilidadeCompliance: data.benRastreabilidadeCompliance ?? 'nenhum',
        benKeyPersonRisk: data.benKeyPersonRisk ?? 'nenhum',
        benMelhorarExpCliente: data.benMelhorarExpCliente ?? 'nenhum',
        benAumentarCapacidade: data.benAumentarCapacidade ?? 'nenhum',
        benReduzirTempoResposta: data.benReduzirTempoResposta ?? 'nenhum',
        benInteroperabilidade: data.benInteroperabilidade ?? 'nenhum',
        benTransformacaoDigital: data.benTransformacaoDigital ?? 'nenhum',
        benSustentabilidadeEsg: data.benSustentabilidadeEsg ?? 'nenhum',
        benReduzirFte: data.benReduzirFte ?? 'nenhum',

        // Plataforma e Solução
        perfilPlataformaId: data.perfilPlataformaId || null,
        tipoPlataformaNome: tipoPlataformaNome,
        descricaoSolucao: data.descricaoSolucao ?? '',
        pontosAtencao: data.pontosAtencao ?? '',
        reducaoTempoPrevista: data.reducaoTempoPrevista ?? '0%',
        complexidade: data.complexidade ?? 'Média',
        reducaoCustoPrevista: data.reducaoCustoPrevista ?? '0%',
        numRotinas: Number(data.numRotinas ?? 1),
        turno: calculated.turno,
        recomendacao: data.recomendacao ?? 'Recomendado',
        esforcoSetupSemanas: Number(data.esforcoSetupSemanas ?? 1),
        
        // Multi-Turno & Horas de Robô
        horasRoboDiurno: calculated.horasRoboDiurno,
        horasRoboNoturno: calculated.horasRoboNoturno,
        horasRoboFimDeSemana: calculated.horasRoboFimDeSemana,
        horasRobo: calculated.horasRobo,
        
        horasApoioNegocio: Number(data.horasApoioNegocio ?? 0),
        horasManutencao: Number(data.horasManutencao ?? 0),

        // Valores Calculados
        custoMensalAtual: calculated.custoMensalAtual,
        fteLiberado: calculated.fteLiberado,
        pontuacaoBeneficios: calculated.pontuacaoBeneficios,
        investimentoSetup: calculated.investimentoSetup,
        custoHorasRobo: calculated.custoHorasRobo,
        custoHorasNegocio: calculated.custoHorasNegocio,
        custoManutencao: calculated.custoManutencao,
        custoMensalAno1: calculated.custoMensalAno1,
        custoMensalAno2: calculated.custoMensalAno2,
        custoAnualAno1: calculated.custoAnualAno1,
        custoAnualAno2: calculated.custoAnualAno2,
        roiAno1: calculated.roiAno1,
        roiAno2: calculated.roiAno2,
        paybackMeses: calculated.paybackMeses,
      },
      include: {
        perfilPlataforma: true,
      },
    });
  }

  static async update(id: string, data: any) {
    const parametro = await ParametroService.getParametros();

    let perfilPlataforma = null;
    let tipoPlataformaNome = data.tipoPlataformaNome;
    if (data.perfilPlataformaId) {
      perfilPlataforma = await prisma.perfilPlataforma.findUnique({
        where: { id: data.perfilPlataformaId },
      });
      if (perfilPlataforma) {
        tipoPlataformaNome = perfilPlataforma.nome;
      }
    }

    const calculated = CalculationService.calculate(
      {
        ...(data as RegistroInput),
        perfilPlataforma: perfilPlataforma || undefined,
      },
      parametro
    );

    return await prisma.registro.update({
      where: { id },
      data: {
        ...(data.idOrigem !== undefined && { idOrigem: data.idOrigem }),
        ...(data.idAnalise !== undefined && { idAnalise: data.idAnalise }),
        ...(data.area !== undefined && { area: data.area }),
        ...(data.nomeProcesso !== undefined && { nomeProcesso: data.nomeProcesso }),
        ...(data.dataLevantamento !== undefined && { dataLevantamento: data.dataLevantamento }),
        ...(data.participantes !== undefined && { participantes: data.participantes }),
        ...(data.situacao !== undefined && { situacao: data.situacao }),
        ...(data.areasEnvolvidas !== undefined && { areasEnvolvidas: data.areasEnvolvidas }),
        ...(data.descricaoProcesso !== undefined && { descricaoProcesso: data.descricaoProcesso }),
        ...(data.numExecucoes !== undefined && { numExecucoes: Number(data.numExecucoes) }),
        ...(data.periodicidade !== undefined && { periodicidade: data.periodicidade }),
        ...(data.numPessoasEnvolvidas !== undefined && { numPessoasEnvolvidas: Number(data.numPessoasEnvolvidas) }),
        ...(data.tipoAlocacao !== undefined && { tipoAlocacao: data.tipoAlocacao }),
        ...(data.perfilExecutor !== undefined && { perfilExecutor: data.perfilExecutor }),
        ...(data.valorHoraExecutor !== undefined && { valorHoraExecutor: Number(data.valorHoraExecutor) }),
        ...(data.tempoExecucao !== undefined && { tempoExecucao: Number(data.tempoExecucao) }),
        ...(data.sistemasEnvolvidos !== undefined && { sistemasEnvolvidos: data.sistemasEnvolvidos }),
        ...(data.documentosApoio !== undefined && { documentosApoio: data.documentosApoio }),

        // 12 Benefícios Corporativos
        ...(data.benLiberarPessoas !== undefined && { benLiberarPessoas: data.benLiberarPessoas }),
        ...(data.benReduzirCusto !== undefined && { benReduzirCusto: data.benReduzirCusto }),
        ...(data.benReduzirErros !== undefined && { benReduzirErros: data.benReduzirErros }),
        ...(data.benSegurancaPrivacidade !== undefined && { benSegurancaPrivacidade: data.benSegurancaPrivacidade }),
        ...(data.benRastreabilidadeCompliance !== undefined && { benRastreabilidadeCompliance: data.benRastreabilidadeCompliance }),
        ...(data.benKeyPersonRisk !== undefined && { benKeyPersonRisk: data.benKeyPersonRisk }),
        ...(data.benMelhorarExpCliente !== undefined && { benMelhorarExpCliente: data.benMelhorarExpCliente }),
        ...(data.benAumentarCapacidade !== undefined && { benAumentarCapacidade: data.benAumentarCapacidade }),
        ...(data.benReduzirTempoResposta !== undefined && { benReduzirTempoResposta: data.benReduzirTempoResposta }),
        ...(data.benInteroperabilidade !== undefined && { benInteroperabilidade: data.benInteroperabilidade }),
        ...(data.benTransformacaoDigital !== undefined && { benTransformacaoDigital: data.benTransformacaoDigital }),
        ...(data.benSustentabilidadeEsg !== undefined && { benSustentabilidadeEsg: data.benSustentabilidadeEsg }),
        ...(data.benReduzirFte !== undefined && { benReduzirFte: data.benReduzirFte }),

        // Plataforma e Solução
        ...(data.perfilPlataformaId !== undefined && { perfilPlataformaId: data.perfilPlataformaId }),
        ...(tipoPlataformaNome !== undefined && { tipoPlataformaNome: tipoPlataformaNome }),
        ...(data.descricaoSolucao !== undefined && { descricaoSolucao: data.descricaoSolucao }),
        ...(data.pontosAtencao !== undefined && { pontosAtencao: data.pontosAtencao }),
        ...(data.reducaoTempoPrevista !== undefined && { reducaoTempoPrevista: data.reducaoTempoPrevista }),
        ...(data.complexidade !== undefined && { complexidade: data.complexidade }),
        ...(data.reducaoCustoPrevista !== undefined && { reducaoCustoPrevista: data.reducaoCustoPrevista }),
        ...(data.numRotinas !== undefined && { numRotinas: Number(data.numRotinas) }),
        turno: calculated.turno,
        ...(data.recomendacao !== undefined && { recomendacao: data.recomendacao }),
        ...(data.esforcoSetupSemanas !== undefined && { esforcoSetupSemanas: Number(data.esforcoSetupSemanas) }),
        
        // Multi-Turno
        horasRoboDiurno: calculated.horasRoboDiurno,
        horasRoboNoturno: calculated.horasRoboNoturno,
        horasRoboFimDeSemana: calculated.horasRoboFimDeSemana,
        horasRobo: calculated.horasRobo,
        
        ...(data.horasApoioNegocio !== undefined && { horasApoioNegocio: Number(data.horasApoioNegocio) }),
        ...(data.horasManutencao !== undefined && { horasManutencao: Number(data.horasManutencao) }),

        // Atualiza campos calculados
        custoMensalAtual: calculated.custoMensalAtual,
        fteLiberado: calculated.fteLiberado,
        pontuacaoBeneficios: calculated.pontuacaoBeneficios,
        investimentoSetup: calculated.investimentoSetup,
        custoHorasRobo: calculated.custoHorasRobo,
        custoHorasNegocio: calculated.custoHorasNegocio,
        custoManutencao: calculated.custoManutencao,
        custoMensalAno1: calculated.custoMensalAno1,
        custoMensalAno2: calculated.custoMensalAno2,
        custoAnualAno1: calculated.custoAnualAno1,
        custoAnualAno2: calculated.custoAnualAno2,
        roiAno1: calculated.roiAno1,
        roiAno2: calculated.roiAno2,
        paybackMeses: calculated.paybackMeses,
      },
      include: {
        perfilPlataforma: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.registro.delete({
      where: { id },
    });
  }
}
