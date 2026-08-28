export interface ParametroData {
  pesoLiberarPessoas: number;
  pesoReduzirCusto: number;
  pesoReduzirErros: number;
  pesoSegurancaPrivacidade: number;
  pesoRastreabilidadeCompliance: number;
  pesoKeyPersonRisk: number;
  pesoMelhorarExpCliente: number;
  pesoAumentarCapacidade: number;
  pesoReduzirTempoResposta: number;
  pesoInteroperabilidade: number;
  pesoTransformacaoDigital: number;
  pesoSustentabilidadeEsg: number;
  pesoReduzirFte?: number;
  cargaHorariaPadrao: number;
  operadorSalaControle: number;
  servidor: number;
  licencaRobo: number;
  estacaoTrabalhoRobo: number;
  nrRobos: number;
  percDiurno: number;
  percNoturno: number;
  percFimDeSemana: number;
  custoHoraDesenvolvimento: number;
  taxaDescontoVpl?: number;
  horizonteVplMeses?: number;
}

export interface PerfilPlataformaData {
  custoLicencaMensal?: number;
  custoEstacaoTrabalho?: number;
  custoServidor?: number;
  nrRobosDiluicao?: number;
}

export interface RegistroInput {
  // Identificação e Maturidade
  nomeProcesso?: string;
  area?: string;
  situacao?: string;
  nivelMaturidade?: string;
  isRetrospectivo?: boolean;
  beneficioRealizadoAnual?: number;
  sintomasDor?: string;
  criticidadePercebida?: string;
  recorrenciaDor?: string;

  // AS IS
  tempoExecucao?: number;
  valorHoraExecutor?: number;
  custoMensalAtual?: number;
  numExecucoes?: number;
  sistemasEnvolvidos?: string;

  // 7 Arquétipos de Processo
  arquetipoPrimario?: string;
  arquetiposSecundarios?: string;

  // Variáveis dos Arquétipos
  percAutomatizavel?: number;
  taxaErroAtual?: number;
  custoMedioErro?: number;
  reducaoEsperadaErro?: number;
  volumeContatosMensal?: number;
  custoAtendimentoHumano?: number;
  taxaContencaoEsperada?: number;
  custoAtendimentoAuto?: number;
  probabilidadeDescumprimento?: number;
  impactoFinanceiroOcorrencia?: number;
  reducaoProbabilidadeRisco?: number;
  historicoOcorrencias12m?: number;
  leadTimeAtualDias?: number;
  leadTimeProjetadoDias?: number;
  volumeAdicionalViabilizado?: number;
  ticketMedioReceita?: number;
  diasAntecipacaoFaturamento?: number;
  valorFaturadoCiclo?: number;
  nrAtivosAntes?: number;
  nrAtivosDepois?: number;
  custoManutencaoAnualAtivo?: number;
  numSolicitacoesComerciaisMes?: number;
  tempoRespostaAtualHoras?: number;
  tempoRespostaAlvoHoras?: number;
  taxaConversaoAtual?: number;
  taxaConversaoAlvo?: number;
  ticketMedioProposta?: number;
  percPerdasPorPrazo?: number;

  // Trilha, Reuso e Baseline
  percTrilhaProcesso?: number;
  percTrilhaSistema?: number;
  percTrilhaAutomacao?: number;
  unidadesPiloto?: number;
  unidadesPotenciais?: number;
  custoMarginalReplicacao?: number;
  coberturaInicialPerc?: number;
  coberturaFinalPerc?: number;

  // TO BE Operacional
  tipoPlataformaNome?: string;
  perfilPlataformaId?: string;
  turno?: string;
  esforcoSetupSemanas?: number;
  horasRoboDiurno?: number;
  horasRoboNoturno?: number;
  horasRoboFimDeSemana?: number;
  horasRobo?: number;
  horasApoioNegocio?: number;
  horasManutencao?: number;

  // 12 Critérios Corporativos
  benLiberarPessoas?: string;
  benReduzirCusto?: string;
  benReduzirErros?: string;
  benSegurancaPrivacidade?: string;
  benRastreabilidadeCompliance?: string;
  benKeyPersonRisk?: string;
  benMelhorarExpCliente?: string;
  benAumentarCapacidade?: string;
  benReduzirTempoResposta?: string;
  benInteroperabilidade?: string;
  benTransformacaoDigital?: string;
  benSustentabilidadeEsg?: string;
  benReduzirFte?: string;

  perfilPlataforma?: PerfilPlataformaData | null;
}

export interface CalculatedFields {
  nivelMaturidade: 'N0' | 'N1' | 'N2' | 'N3';
  custoMensalAtual: number;
  fteLiberado: number;
  pontuacaoBeneficios: number;
  investimentoSetup: number;
  horasRoboDiurno: number;
  horasRoboNoturno: number;
  horasRoboFimDeSemana: number;
  horasRobo: number;
  custoHorasRobo: number;
  turno: string;
  custoHorasNegocio: number;
  custoManutencao: number;
  custoMensalAno1: number;
  custoMensalAno2: number;
  custoAnualAno1: number;
  custoAnualAno2: number;

  // V2.0 - Métricas FCAIA
  beneficioBrutoAnual: number;
  beneficioLiquidoAnual: number;
  beneficioPotencialEscala: number;
  roiAno1: number;
  roiAno2: number;
  paybackMeses: number;
  vpl3Anos: number;
  vplCenarioConservador: number;
  vplCenarioBase: number;
  vplCenarioOtimista: number;
  paybackCenarioConservador: number;
  paybackCenarioOtimista: number;
}

export class CalculationService {
  /**
   * Determina o nível de maturidade do registro conforme regras FCAIA (N0 a N3).
   */
  static determinarNivelMaturidade(input: RegistroInput): 'N0' | 'N1' | 'N2' | 'N3' {
    if (input.isRetrospectivo || input.situacao === 'Concluído' || (Number(input.beneficioRealizadoAnual) > 0)) {
      return 'N3';
    }

    const temTempoOuVolume = (Number(input.tempoExecucao) > 0) || (Number(input.numExecucoes) > 0) || (Number(input.volumeContatosMensal) > 0);
    const temInvestimento = (Number(input.esforcoSetupSemanas) > 0) || (Number(input.horasRobo) > 0);

    if (!temTempoOuVolume) {
      return 'N0'; // Oportunidade crua (dor descrita)
    }

    if (temTempoOuVolume && !temInvestimento) {
      return 'N1'; // Business Case Parcial
    }

    return 'N2'; // Business Case Completo (todas as variáveis e setup informados)
  }

  /**
   * Calcula o custo por hora de operação do robô de acordo com o turno e plataforma tecnológica.
   */
  static getCustoHoraRoboPorTurno(
    param: ParametroData,
    turno: string = 'Diurno',
    perfil?: PerfilPlataformaData | null
  ): number {
    const servidor = perfil?.custoServidor !== undefined ? perfil.custoServidor : param.servidor;
    const nrRobos =
      perfil?.nrRobosDiluicao && perfil.nrRobosDiluicao > 0
        ? perfil.nrRobosDiluicao
        : param.nrRobos > 0
        ? param.nrRobos
        : 1;
    const licenca = perfil?.custoLicencaMensal !== undefined ? perfil.custoLicencaMensal : param.licencaRobo;
    const estacao = perfil?.custoEstacaoTrabalho !== undefined ? perfil.custoEstacaoTrabalho : param.estacaoTrabalhoRobo;

    const custoRoboTotal = licenca + estacao;
    const baseCusto = servidor / nrRobos + custoRoboTotal + param.operadorSalaControle / nrRobos;

    const normalTurno = (turno || 'Diurno').trim().toLowerCase();

    if (normalTurno.includes('noturno')) {
      return (baseCusto * param.percNoturno) / 21 / 14;
    } else if (normalTurno.includes('fim') || normalTurno.includes('semana') || normalTurno.includes('weekend')) {
      return (baseCusto * param.percFimDeSemana) / 8 / 24;
    } else {
      return (baseCusto * param.percDiurno) / 21 / 10;
    }
  }

  /**
   * Calcula o custo por hora de manutenção do robô.
   */
  static getCustoHoraManutencao(param: ParametroData): number {
    return (param.operadorSalaControle * 1.6) / 168;
  }

  /**
   * Calcula o custo de setup mensal diluído (em 12 meses) por semana de implementação.
   */
  static getCustoSetupMensalPorSemana(param: ParametroData): number {
    return (param.custoHoraDesenvolvimento * 40) / 12;
  }

  private static getBeneficioFactor(resposta: string = 'nenhum'): number {
    const r = (resposta || '').trim().toLowerCase();
    if (r === 'principal' || r === 'x') return 1.0;
    if (r === 'bastante') return 0.5;
    if (r === 'pouco') return 0.25;
    return 0.0;
  }

  /**
   * Calcula o benefício bruto anual gerado pela combinação dos 7 Arquétipos FCAIA.
   */
  static calcularBeneficioArquetipos(
    input: RegistroInput,
    custoMensalAtualPadrao: number,
    param: ParametroData
  ): { brutoAnual: number; detalhe: Record<string, number> } {
    const arqPrimario = (input.arquetipoPrimario || 'A1').toUpperCase();
    const arqsSecundarios = (input.arquetiposSecundarios || '')
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0 && s !== arqPrimario);

    const arquetiposAtivos = new Set([arqPrimario, ...arqsSecundarios.slice(0, 2)]);
    const detalhe: Record<string, number> = {};
    let somaBruta = 0;

    // A1 - Transacional Repetitivo (Horas Liberadas)
    if (arquetiposAtivos.has('A1')) {
      const percAuto = input.percAutomatizavel !== undefined ? Number(input.percAutomatizavel) : 1.0;
      const ganhoA1 = (custoMensalAtualPadrao * 12) * Math.max(0, Math.min(1, percAuto));
      detalhe['A1'] = Number(ganhoA1.toFixed(2));
      somaBruta += detalhe['A1'];
    }

    // A2 - Processo com alta taxa de erro ou retrabalho
    if (arquetiposAtivos.has('A2')) {
      const numExec = Number(input.numExecucoes) || 0;
      const taxaErro = Number(input.taxaErroAtual) || 0;
      const custoErro = Number(input.custoMedioErro) || 0;
      const reducaoErro = Number(input.reducaoEsperadaErro) || 0.8;
      const ganhoA2 = (numExec * taxaErro * custoErro * reducaoErro) * 12;
      detalhe['A2'] = Number(ganhoA2.toFixed(2));
      somaBruta += detalhe['A2'];
    }

    // A3 - Atendimento e autosserviço
    if (arquetiposAtivos.has('A3')) {
      const volume = Number(input.volumeContatosMensal) || 0;
      const custoHumano = Number(input.custoAtendimentoHumano) || 0;
      const custoAuto = Number(input.custoAtendimentoAuto) || 0;
      const taxaContencao = Number(input.taxaContencaoEsperada) || 0;
      const economiaContato = Math.max(0, custoHumano - custoAuto);
      const ganhoA3 = (volume * taxaContencao * economiaContato) * 12;
      detalhe['A3'] = Number(ganhoA3.toFixed(2));
      somaBruta += detalhe['A3'];
    }

    // A4 - Conformidade e risco contratual (Glosas / Multas)
    if (arquetiposAtivos.has('A4')) {
      const impacto = Number(input.impactoFinanceiroOcorrencia) || 0;
      const prob = Number(input.probabilidadeDescumprimento) || 0;
      const redProb = Number(input.reducaoProbabilidadeRisco) || 0.9;
      const hist = Number(input.historicoOcorrencias12m) || 0;

      let ganhoA4 = 0;
      if (hist > 0) {
        ganhoA4 = hist * impacto * redProb;
      } else {
        ganhoA4 = prob * impacto * redProb;
      }
      detalhe['A4'] = Number(ganhoA4.toFixed(2));
      somaBruta += detalhe['A4'];
    }

    // A5 - Gargalo, lead time e ciclo de receita
    if (arquetiposAtivos.has('A5')) {
      const taxaDesc = param.taxaDescontoVpl || 0.12;
      const diasAntecipacao = Number(input.diasAntecipacaoFaturamento) || 0;
      const valorFaturadoCiclo = Number(input.valorFaturadoCiclo) || 0;
      const ganhoAntecipacao = (valorFaturadoCiclo * 12) * ((taxaDesc * diasAntecipacao) / 365);

      const volAdicional = Number(input.volumeAdicionalViabilizado) || 0;
      const ticketReceita = Number(input.ticketMedioReceita) || 0;
      const ganhoCapacidade = (volAdicional * ticketReceita) * 12;

      const ganhoA5 = ganhoAntecipacao + ganhoCapacidade;
      detalhe['A5'] = Number(ganhoA5.toFixed(2));
      somaBruta += detalhe['A5'];
    }

    // A6 - Racionalização de ativos técnicos
    if (arquetiposAtivos.has('A6')) {
      const antes = Number(input.nrAtivosAntes) || 0;
      const depois = Number(input.nrAtivosDepois) || 0;
      const custoAtivo = Number(input.custoManutencaoAnualAtivo) || 0;
      const ganhoA6 = Math.max(0, antes - depois) * custoAtivo;
      detalhe['A6'] = Number(ganhoA6.toFixed(2));
      somaBruta += detalhe['A6'];
    }

    // A7 - Processo comercial e captura de oportunidade
    if (arquetiposAtivos.has('A7')) {
      const numSol = Number(input.numSolicitacoesComerciaisMes) || 0;
      const convAtual = Number(input.taxaConversaoAtual) || 0;
      const convAlvo = Number(input.taxaConversaoAlvo) || 0;
      const ticket = Number(input.ticketMedioProposta) || 0;
      const deltaConv = Math.max(0, convAlvo - convAtual);
      const ganhoA7 = (numSol * 12) * deltaConv * ticket;
      detalhe['A7'] = Number(ganhoA7.toFixed(2));
      somaBruta += detalhe['A7'];
    }

    // Fallback: se nenhum arquétipo gerou valor, mas há custo atual mensal
    if (somaBruta === 0 && custoMensalAtualPadrao > 0) {
      somaBruta = custoMensalAtualPadrao * 12;
      detalhe['A1'] = Number(somaBruta.toFixed(2));
    }

    return { brutoAnual: Number(somaBruta.toFixed(2)), detalhe };
  }

  /**
   * Calcula o Valor Presente Líquido (VPL) para um horizonte de 3 anos.
   */
  static calcularVPL(
    investimentoInicial: number,
    fluxoAno1: number,
    fluxoAno2: number,
    fluxoAno3: number,
    taxaDesconto: number = 0.12
  ): number {
    const r = taxaDesconto > 0 ? taxaDesconto : 0.12;
    const vpl =
      -investimentoInicial +
      fluxoAno1 / Math.pow(1 + r, 1) +
      fluxoAno2 / Math.pow(1 + r, 2) +
      fluxoAno3 / Math.pow(1 + r, 3);
    return Number(vpl.toFixed(2));
  }

  /**
   * Executa todos os cálculos integrados da V2.0 com múltiplos arquétipos, trilha, reuso e VPL.
   */
  static calculate(input: RegistroInput, param: ParametroData): CalculatedFields {
    const nivelMaturidade = this.determinarNivelMaturidade(input);

    const tempoExecucao = Number(input.tempoExecucao) || 0;
    const valorHoraExecutor = Number(input.valorHoraExecutor) || 0;
    let custoMensalAtual = Number(input.custoMensalAtual) || 0;

    if (custoMensalAtual === 0 && tempoExecucao > 0 && valorHoraExecutor > 0) {
      custoMensalAtual = tempoExecucao * valorHoraExecutor;
    }

    // 1. FTE Liberado
    const cargaHoraria = param.cargaHorariaPadrao > 0 ? param.cargaHorariaPadrao : 160;
    const fteLiberado = Number((tempoExecucao / cargaHoraria).toFixed(2));

    // 2. Pontuação de Benefícios Estratégicos (12 Critérios)
    const pMax =
      (param.pesoLiberarPessoas || 3) +
      (param.pesoReduzirCusto || 3) +
      (param.pesoReduzirErros || 3) +
      (param.pesoSegurancaPrivacidade || 3) +
      (param.pesoRastreabilidadeCompliance || 3) +
      (param.pesoKeyPersonRisk || 2) +
      (param.pesoMelhorarExpCliente || 2) +
      (param.pesoAumentarCapacidade || 2) +
      (param.pesoReduzirTempoResposta || 2) +
      (param.pesoInteroperabilidade || 2) +
      (param.pesoTransformacaoDigital || 1) +
      (param.pesoSustentabilidadeEsg || 1);

    const somaPontos =
      this.getBeneficioFactor(input.benLiberarPessoas) * (param.pesoLiberarPessoas || 3) +
      this.getBeneficioFactor(input.benReduzirCusto) * (param.pesoReduzirCusto || 3) +
      this.getBeneficioFactor(input.benReduzirErros) * (param.pesoReduzirErros || 3) +
      this.getBeneficioFactor(input.benSegurancaPrivacidade) * (param.pesoSegurancaPrivacidade || 3) +
      this.getBeneficioFactor(input.benRastreabilidadeCompliance) * (param.pesoRastreabilidadeCompliance || 3) +
      this.getBeneficioFactor(input.benKeyPersonRisk) * (param.pesoKeyPersonRisk || 2) +
      this.getBeneficioFactor(input.benMelhorarExpCliente) * (param.pesoMelhorarExpCliente || 2) +
      this.getBeneficioFactor(input.benAumentarCapacidade) * (param.pesoAumentarCapacidade || 2) +
      this.getBeneficioFactor(input.benReduzirTempoResposta) * (param.pesoReduzirTempoResposta || 2) +
      this.getBeneficioFactor(input.benInteroperabilidade) * (param.pesoInteroperabilidade || 2) +
      this.getBeneficioFactor(input.benTransformacaoDigital) * (param.pesoTransformacaoDigital || 1) +
      this.getBeneficioFactor(input.benSustentabilidadeEsg) * (param.pesoSustentabilidadeEsg || 1);

    const pontuacaoBeneficios = pMax > 0 ? Number((somaPontos / pMax).toFixed(4)) : 0;

    // 3. Custos de Setup e Multi-Turno
    const esforcoSetupSemanas = Number(input.esforcoSetupSemanas) || 0;
    const custoSetupPorSemana = this.getCustoSetupMensalPorSemana(param);
    const investimentoSetup = Number((esforcoSetupSemanas * custoSetupPorSemana).toFixed(2));
    const investimentoSetupTotalCapital = Number((investimentoSetup * 12).toFixed(2));

    let horasRoboDiurno = Number(input.horasRoboDiurno) || 0;
    let horasRoboNoturno = Number(input.horasRoboNoturno) || 0;
    let horasRoboFimDeSemana = Number(input.horasRoboFimDeSemana) || 0;
    let horasRobo = Number(input.horasRobo) || 0;

    if (horasRoboDiurno === 0 && horasRoboNoturno === 0 && horasRoboFimDeSemana === 0 && horasRobo > 0) {
      const normalTurno = (input.turno || 'Diurno').toLowerCase();
      if (normalTurno.includes('noturno')) horasRoboNoturno = horasRobo;
      else if (normalTurno.includes('fim') || normalTurno.includes('semana')) horasRoboFimDeSemana = horasRobo;
      else horasRoboDiurno = horasRobo;
    } else {
      horasRobo = Number((horasRoboDiurno + horasRoboNoturno + horasRoboFimDeSemana).toFixed(2));
    }

    const taxaDiurna = this.getCustoHoraRoboPorTurno(param, 'Diurno', input.perfilPlataforma);
    const taxaNoturna = this.getCustoHoraRoboPorTurno(param, 'Noturno', input.perfilPlataforma);
    const taxaFimSemana = this.getCustoHoraRoboPorTurno(param, 'Final de Semana', input.perfilPlataforma);

    const custoHorasRobo = Number(
      (
        horasRoboDiurno * taxaDiurna +
        horasRoboNoturno * taxaNoturna +
        horasRoboFimDeSemana * taxaFimSemana
      ).toFixed(2)
    );

    let turno = 'Diurno';
    const turnosAtivos = [];
    if (horasRoboDiurno > 0) turnosAtivos.push('Diurno');
    if (horasRoboNoturno > 0) turnosAtivos.push('Noturno');
    if (horasRoboFimDeSemana > 0) turnosAtivos.push('Fim de Semana');

    if (turnosAtivos.length > 1) {
      turno = 'Múltiplos Turnos';
    } else if (turnosAtivos.length === 1) {
      turno = turnosAtivos[0];
    } else {
      turno = input.turno || 'Diurno';
    }

    const horasApoioNegocio = Number(input.horasApoioNegocio) || 0;
    const custoHorasNegocio = Number((horasApoioNegocio * valorHoraExecutor).toFixed(2));

    const horasManutencao = Number(input.horasManutencao) || 0;
    const custoHoraManutencao = this.getCustoHoraManutencao(param);
    const custoManutencao = Number((horasManutencao * custoHoraManutencao).toFixed(2));

    // Custo operacional recorrente
    const custoMensalRecorrente = Number((custoHorasRobo + custoHorasNegocio + custoManutencao).toFixed(2));
    const custoMensalAno1 = Number((investimentoSetup + custoMensalRecorrente).toFixed(2));
    const custoMensalAno2 = custoMensalRecorrente;

    const custoAnualAno1 = Number((custoMensalAno1 * 12).toFixed(2));
    const custoAnualAno2 = Number((custoMensalAno2 * 12).toFixed(2));

    // 4. Benefícios dos 7 Arquétipos e Atribuição por Trilha (FCAIA)
    const { brutoAnual } = this.calcularBeneficioArquetipos(input, custoMensalAtual, param);
    const percAutomacao = input.percTrilhaAutomacao !== undefined ? Math.max(0, Math.min(1, Number(input.percTrilhaAutomacao))) : 1.0;
    const beneficioBrutoAnual = brutoAnual;
    const beneficioLiquidoAnual = Number((beneficioBrutoAnual * percAutomacao).toFixed(2));

    // 5. Fator de Reuso e Escala (Seção 5.4)
    const unidadesPiloto = Math.max(1, Number(input.unidadesPiloto) || 1);
    const unidadesPotenciais = Math.max(unidadesPiloto, Number(input.unidadesPotenciais) || 1);
    const custoMarginal = Number(input.custoMarginalReplicacao) || 0;

    const beneficioPotencialEscala = Number(
      (
        (beneficioLiquidoAnual * (unidadesPotenciais / unidadesPiloto)) -
        ((unidadesPotenciais - unidadesPiloto) * custoMarginal)
      ).toFixed(2)
    );

    // 6. ROI e Payback Clássicos
    const roiAno1 = Number((beneficioLiquidoAnual - custoAnualAno1).toFixed(2));
    const roiAno2 = Number((beneficioLiquidoAnual * 2 - custoAnualAno1 - custoAnualAno2 - roiAno1).toFixed(2));

    const paybackMeses =
      beneficioLiquidoAnual > 0 && custoAnualAno1 > 0
        ? Number(((custoAnualAno1 / (beneficioLiquidoAnual / 12))).toFixed(1))
        : custoMensalAtual > 0 && custoAnualAno1 > 0
        ? Number((custoAnualAno1 / custoMensalAtual).toFixed(1))
        : 0;

    // 7. Engenharia Financeira: VPL em 3 Anos & Cenários de Sensibilidade
    const taxaDesc = param.taxaDescontoVpl || 0.12;
    const custoOpRecorrenteAnual = Number((custoMensalRecorrente * 12).toFixed(2));

    // Cenário Base
    const fluxoAno1 = beneficioLiquidoAnual - custoOpRecorrenteAnual;
    const fluxoAno2 = beneficioLiquidoAnual - custoOpRecorrenteAnual;
    const fluxoAno3 = beneficioLiquidoAnual - custoOpRecorrenteAnual;
    const vplCenarioBase = this.calcularVPL(investimentoSetupTotalCapital, fluxoAno1, fluxoAno2, fluxoAno3, taxaDesc);
    const vpl3Anos = vplCenarioBase;

    // Cenário Conservador (-20% benefício, +20% custos)
    const benCons = beneficioLiquidoAnual * 0.8;
    const custoCons = custoOpRecorrenteAnual * 1.2;
    const setupCons = investimentoSetupTotalCapital * 1.2;
    const vplCenarioConservador = this.calcularVPL(setupCons, benCons - custoCons, benCons - custoCons, benCons - custoCons, taxaDesc);
    const paybackCenarioConservador =
      benCons > custoCons && setupCons > 0
        ? Number((setupCons / ((benCons - custoCons) / 12)).toFixed(1))
        : Number((paybackMeses * 1.3).toFixed(1));

    // Cenário Otimista (+20% benefício, -10% custos)
    const benOtim = beneficioLiquidoAnual * 1.2;
    const custoOtim = custoOpRecorrenteAnual * 0.9;
    const setupOtim = investimentoSetupTotalCapital * 0.9;
    const vplCenarioOtimista = this.calcularVPL(setupOtim, benOtim - custoOtim, benOtim - custoOtim, benOtim - custoOtim, taxaDesc);
    const paybackCenarioOtimista =
      benOtim > custoOtim && setupOtim > 0
        ? Number((setupOtim / ((benOtim - custoOtim) / 12)).toFixed(1))
        : Number((paybackMeses * 0.8).toFixed(1));

    return {
      nivelMaturidade,
      custoMensalAtual,
      fteLiberado,
      pontuacaoBeneficios,
      investimentoSetup,
      horasRoboDiurno,
      horasRoboNoturno,
      horasRoboFimDeSemana,
      horasRobo,
      custoHorasRobo,
      turno,
      custoHorasNegocio,
      custoManutencao,
      custoMensalAno1,
      custoMensalAno2,
      custoAnualAno1,
      custoAnualAno2,
      beneficioBrutoAnual,
      beneficioLiquidoAnual,
      beneficioPotencialEscala,
      roiAno1,
      roiAno2,
      paybackMeses,
      vpl3Anos,
      vplCenarioConservador,
      vplCenarioBase,
      vplCenarioOtimista,
      paybackCenarioConservador,
      paybackCenarioOtimista,
    };
  }
}
