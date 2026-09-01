import { prisma } from '../lib/prisma.js';
import { CalculationService, RegistroInput } from './calculation.service.js';
import { ParametroService } from './parametro.service.js';
import { InstrumentacaoService } from './instrumentacao.service.js';

export interface RegistroFilter {
  search?: string;
  area?: string;
  situacao?: string;
  complexidade?: string;
  nivelMaturidade?: string;
  arquetipo?: string;
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
    if (filter?.nivelMaturidade) {
      where.nivelMaturidade = filter.nivelMaturidade;
    }
    if (filter?.arquetipo) {
      where.OR = [
        { arquetipoPrimario: filter.arquetipo },
        { arquetiposSecundarios: { contains: filter.arquetipo } },
      ];
    }
    if (filter?.search) {
      where.OR = [
        { nomeProcesso: { contains: filter.search } },
        { idAnalise: { contains: filter.search } },
        { idOrigem: { contains: filter.search } },
        { area: { contains: filter.search } },
        { descricaoProcesso: { contains: filter.search } },
        { sintomasDor: { contains: filter.search } },
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

  static async getDiagnostico(id: string) {
    const registro = await this.getById(id);
    if (!registro) return null;
    return InstrumentacaoService.gerarDiagnostico(registro);
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

        // Funil de Maturidade FCAIA
        nivelMaturidade: data.nivelMaturidade || calculated.nivelMaturidade,
        dataPromocaoMaturidade: data.dataPromocaoMaturidade ?? (calculated.nivelMaturidade !== 'N0' ? new Date().toISOString().split('T')[0] : ''),
        responsavelPromocao: data.responsavelPromocao ?? '',
        isRetrospectivo: Boolean(data.isRetrospectivo ?? false),

        // Triagem Qualitativa N0
        sintomasDor: data.sintomasDor ?? '',
        papeisEnvolvidos: data.papeisEnvolvidos ?? '',
        criticidadePercebida: data.criticidadePercebida ?? 'Média',
        recorrenciaDor: data.recorrenciaDor ?? 'Frequente',

        // 7 Arquétipos
        arquetipoPrimario: data.arquetipoPrimario ?? 'A1',
        arquetiposSecundarios: data.arquetiposSecundarios ?? '',

        // Variáveis dos Arquétipos
        percAutomatizavel: Number(data.percAutomatizavel ?? 1.0),
        taxaErroAtual: Number(data.taxaErroAtual ?? 0),
        custoMedioErro: Number(data.custoMedioErro ?? 0),
        reducaoEsperadaErro: Number(data.reducaoEsperadaErro ?? 0.8),
        volumeContatosMensal: Number(data.volumeContatosMensal ?? 0),
        custoAtendimentoHumano: Number(data.custoAtendimentoHumano ?? 0),
        taxaContencaoEsperada: Number(data.taxaContencaoEsperada ?? 0),
        custoAtendimentoAuto: Number(data.custoAtendimentoAuto ?? 0),
        probabilidadeDescumprimento: Number(data.probabilidadeDescumprimento ?? 0),
        impactoFinanceiroOcorrencia: Number(data.impactoFinanceiroOcorrencia ?? 0),
        reducaoProbabilidadeRisco: Number(data.reducaoProbabilidadeRisco ?? 0),
        historicoOcorrencias12m: Number(data.historicoOcorrencias12m ?? 0),
        leadTimeAtualDias: Number(data.leadTimeAtualDias ?? 0),
        leadTimeProjetadoDias: Number(data.leadTimeProjetadoDias ?? 0),
        volumeAdicionalViabilizado: Number(data.volumeAdicionalViabilizado ?? 0),
        ticketMedioReceita: Number(data.ticketMedioReceita ?? 0),
        diasAntecipacaoFaturamento: Number(data.diasAntecipacaoFaturamento ?? 0),
        valorFaturadoCiclo: Number(data.valorFaturadoCiclo ?? 0),
        nrAtivosAntes: Number(data.nrAtivosAntes ?? 0),
        nrAtivosDepois: Number(data.nrAtivosDepois ?? 0),
        custoManutencaoAnualAtivo: Number(data.custoManutencaoAnualAtivo ?? 0),
        numSolicitacoesComerciaisMes: Number(data.numSolicitacoesComerciaisMes ?? 0),
        tempoRespostaAtualHoras: Number(data.tempoRespostaAtualHoras ?? 0),
        tempoRespostaAlvoHoras: Number(data.tempoRespostaAlvoHoras ?? 0),
        taxaConversaoAtual: Number(data.taxaConversaoAtual ?? 0),
        taxaConversaoAlvo: Number(data.taxaConversaoAlvo ?? 0),
        ticketMedioProposta: Number(data.ticketMedioProposta ?? 0),
        percPerdasPorPrazo: Number(data.percPerdasPorPrazo ?? 0),

        // Trilha e Reuso
        percTrilhaProcesso: Number(data.percTrilhaProcesso ?? 0),
        percTrilhaSistema: Number(data.percTrilhaSistema ?? 0),
        percTrilhaAutomacao: Number(data.percTrilhaAutomacao ?? 1.0),
        justificativaTrilha: data.justificativaTrilha ?? '',
        unidadesPiloto: Number(data.unidadesPiloto ?? 1),
        unidadesPotenciais: Number(data.unidadesPotenciais ?? 1),
        custoMarginalReplicacao: Number(data.custoMarginalReplicacao ?? 0),
        beneficioPotencialEscala: calculated.beneficioPotencialEscala,
        coberturaInicialPerc: Number(data.coberturaInicialPerc ?? 0),
        coberturaFinalPerc: Number(data.coberturaFinalPerc ?? 1.0),

        // AS IS
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
        perfilDesenvolvedor: data.perfilDesenvolvedor || 'Desenvolvedor II',
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

        // Benefícios Brutos e Líquidos V2
        beneficioBrutoAnual: calculated.beneficioBrutoAnual,
        beneficioLiquidoAnual: calculated.beneficioLiquidoAnual,
        roiAno1: calculated.roiAno1,
        roiAno2: calculated.roiAno2,
        paybackMeses: calculated.paybackMeses,
        scorePriorizacao: calculated.scorePriorizacao,

        // VPL & Cenários
        vpl3Anos: calculated.vpl3Anos,
        vplCenarioConservador: calculated.vplCenarioConservador,
        vplCenarioBase: calculated.vplCenarioBase,
        vplCenarioOtimista: calculated.vplCenarioOtimista,
        paybackCenarioConservador: calculated.paybackCenarioConservador,
        paybackCenarioOtimista: calculated.paybackCenarioOtimista,

        // N3 Realizado
        beneficioRealizadoAnual: Number(data.beneficioRealizadoAnual ?? 0),
        desvioProjetadoRealizadoPerc: Number(data.desvioProjetadoRealizadoPerc ?? 0),
        dataApuracaoRealizado: data.dataApuracaoRealizado ?? '',
        notasRealizado: data.notasRealizado ?? '',
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

        // Funil de Maturidade FCAIA
        ...(data.nivelMaturidade !== undefined
          ? { nivelMaturidade: data.nivelMaturidade }
          : { nivelMaturidade: calculated.nivelMaturidade }),
        ...(data.dataPromocaoMaturidade !== undefined && { dataPromocaoMaturidade: data.dataPromocaoMaturidade }),
        ...(data.responsavelPromocao !== undefined && { responsavelPromocao: data.responsavelPromocao }),
        ...(data.isRetrospectivo !== undefined && { isRetrospectivo: Boolean(data.isRetrospectivo) }),

        // Triagem Qualitativa N0
        ...(data.sintomasDor !== undefined && { sintomasDor: data.sintomasDor }),
        ...(data.papeisEnvolvidos !== undefined && { papeisEnvolvidos: data.papeisEnvolvidos }),
        ...(data.criticidadePercebida !== undefined && { criticidadePercebida: data.criticidadePercebida }),
        ...(data.recorrenciaDor !== undefined && { recorrenciaDor: data.recorrenciaDor }),

        // 7 Arquétipos
        ...(data.arquetipoPrimario !== undefined && { arquetipoPrimario: data.arquetipoPrimario }),
        ...(data.arquetiposSecundarios !== undefined && { arquetiposSecundarios: data.arquetiposSecundarios }),

        // Variáveis dos Arquétipos
        ...(data.percAutomatizavel !== undefined && { percAutomatizavel: Number(data.percAutomatizavel) }),
        ...(data.taxaErroAtual !== undefined && { taxaErroAtual: Number(data.taxaErroAtual) }),
        ...(data.custoMedioErro !== undefined && { custoMedioErro: Number(data.custoMedioErro) }),
        ...(data.reducaoEsperadaErro !== undefined && { reducaoEsperadaErro: Number(data.reducaoEsperadaErro) }),
        ...(data.volumeContatosMensal !== undefined && { volumeContatosMensal: Number(data.volumeContatosMensal) }),
        ...(data.custoAtendimentoHumano !== undefined && { custoAtendimentoHumano: Number(data.custoAtendimentoHumano) }),
        ...(data.taxaContencaoEsperada !== undefined && { taxaContencaoEsperada: Number(data.taxaContencaoEsperada) }),
        ...(data.custoAtendimentoAuto !== undefined && { custoAtendimentoAuto: Number(data.custoAtendimentoAuto) }),
        ...(data.probabilidadeDescumprimento !== undefined && { probabilidadeDescumprimento: Number(data.probabilidadeDescumprimento) }),
        ...(data.impactoFinanceiroOcorrencia !== undefined && { impactoFinanceiroOcorrencia: Number(data.impactoFinanceiroOcorrencia) }),
        ...(data.reducaoProbabilidadeRisco !== undefined && { reducaoProbabilidadeRisco: Number(data.reducaoProbabilidadeRisco) }),
        ...(data.historicoOcorrencias12m !== undefined && { historicoOcorrencias12m: Number(data.historicoOcorrencias12m) }),
        ...(data.leadTimeAtualDias !== undefined && { leadTimeAtualDias: Number(data.leadTimeAtualDias) }),
        ...(data.leadTimeProjetadoDias !== undefined && { leadTimeProjetadoDias: Number(data.leadTimeProjetadoDias) }),
        ...(data.volumeAdicionalViabilizado !== undefined && { volumeAdicionalViabilizado: Number(data.volumeAdicionalViabilizado) }),
        ...(data.ticketMedioReceita !== undefined && { ticketMedioReceita: Number(data.ticketMedioReceita) }),
        ...(data.diasAntecipacaoFaturamento !== undefined && { diasAntecipacaoFaturamento: Number(data.diasAntecipacaoFaturamento) }),
        ...(data.valorFaturadoCiclo !== undefined && { valorFaturadoCiclo: Number(data.valorFaturadoCiclo) }),
        ...(data.nrAtivosAntes !== undefined && { nrAtivosAntes: Number(data.nrAtivosAntes) }),
        ...(data.nrAtivosDepois !== undefined && { nrAtivosDepois: Number(data.nrAtivosDepois) }),
        ...(data.custoManutencaoAnualAtivo !== undefined && { custoManutencaoAnualAtivo: Number(data.custoManutencaoAnualAtivo) }),
        ...(data.numSolicitacoesComerciaisMes !== undefined && { numSolicitacoesComerciaisMes: Number(data.numSolicitacoesComerciaisMes) }),
        ...(data.tempoRespostaAtualHoras !== undefined && { tempoRespostaAtualHoras: Number(data.tempoRespostaAtualHoras) }),
        ...(data.tempoRespostaAlvoHoras !== undefined && { tempoRespostaAlvoHoras: Number(data.tempoRespostaAlvoHoras) }),
        ...(data.taxaConversaoAtual !== undefined && { taxaConversaoAtual: Number(data.taxaConversaoAtual) }),
        ...(data.taxaConversaoAlvo !== undefined && { taxaConversaoAlvo: Number(data.taxaConversaoAlvo) }),
        ...(data.ticketMedioProposta !== undefined && { ticketMedioProposta: Number(data.ticketMedioProposta) }),
        ...(data.percPerdasPorPrazo !== undefined && { percPerdasPorPrazo: Number(data.percPerdasPorPrazo) }),

        // Trilha e Reuso
        ...(data.percTrilhaProcesso !== undefined && { percTrilhaProcesso: Number(data.percTrilhaProcesso) }),
        ...(data.percTrilhaSistema !== undefined && { percTrilhaSistema: Number(data.percTrilhaSistema) }),
        ...(data.percTrilhaAutomacao !== undefined && { percTrilhaAutomacao: Number(data.percTrilhaAutomacao) }),
        ...(data.justificativaTrilha !== undefined && { justificativaTrilha: data.justificativaTrilha }),
        ...(data.unidadesPiloto !== undefined && { unidadesPiloto: Number(data.unidadesPiloto) }),
        ...(data.unidadesPotenciais !== undefined && { unidadesPotenciais: Number(data.unidadesPotenciais) }),
        ...(data.custoMarginalReplicacao !== undefined && { custoMarginalReplicacao: Number(data.custoMarginalReplicacao) }),
        beneficioPotencialEscala: calculated.beneficioPotencialEscala,
        ...(data.coberturaInicialPerc !== undefined && { coberturaInicialPerc: Number(data.coberturaInicialPerc) }),
        ...(data.coberturaFinalPerc !== undefined && { coberturaFinalPerc: Number(data.coberturaFinalPerc) }),

        // AS IS
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
        ...(data.perfilDesenvolvedor !== undefined && { perfilDesenvolvedor: data.perfilDesenvolvedor }),
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

        beneficioBrutoAnual: calculated.beneficioBrutoAnual,
        beneficioLiquidoAnual: calculated.beneficioLiquidoAnual,
        roiAno1: calculated.roiAno1,
        roiAno2: calculated.roiAno2,
        paybackMeses: calculated.paybackMeses,
        scorePriorizacao: calculated.scorePriorizacao,

        vpl3Anos: calculated.vpl3Anos,
        vplCenarioConservador: calculated.vplCenarioConservador,
        vplCenarioBase: calculated.vplCenarioBase,
        vplCenarioOtimista: calculated.vplCenarioOtimista,
        paybackCenarioConservador: calculated.paybackCenarioConservador,
        paybackCenarioOtimista: calculated.paybackCenarioOtimista,

        ...(data.beneficioRealizadoAnual !== undefined && { beneficioRealizadoAnual: Number(data.beneficioRealizadoAnual) }),
        ...(data.desvioProjetadoRealizadoPerc !== undefined && { desvioProjetadoRealizadoPerc: Number(data.desvioProjetadoRealizadoPerc) }),
        ...(data.dataApuracaoRealizado !== undefined && { dataApuracaoRealizado: data.dataApuracaoRealizado }),
        ...(data.notasRealizado !== undefined && { notasRealizado: data.notasRealizado }),
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
