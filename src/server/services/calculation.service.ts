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
}

export interface PerfilPlataformaData {
  custoLicencaMensal?: number;
  custoEstacaoTrabalho?: number;
  custoServidor?: number;
  nrRobosDiluicao?: number;
}

export interface RegistroInput {
  tempoExecucao?: number;
  valorHoraExecutor?: number;
  custoMensalAtual?: number;
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
  roiAno1: number;
  roiAno2: number;
  paybackMeses: number;
}

export class CalculationService {
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
      // Noturno: 21 dias uteis x 14 horas
      return (baseCusto * param.percNoturno) / 21 / 14;
    } else if (normalTurno.includes('fim') || normalTurno.includes('semana') || normalTurno.includes('weekend')) {
      // Fim de Semana: 8 dias x 24 horas
      return (baseCusto * param.percFimDeSemana) / 8 / 24;
    } else {
      // Diurno: 21 dias uteis x 10 horas
      return (baseCusto * param.percDiurno) / 21 / 10;
    }
  }

  /**
   * Calcula o custo por hora de manutenção do robô (com encargos técnicos).
   */
  static getCustoHoraManutencao(param: ParametroData): number {
    return (param.operadorSalaControle * 1.6) / 168;
  }

  /**
   * Calcula o custo de setup mensal (diluído em 12 meses) por semana de implementação.
   */
  static getCustoSetupMensalPorSemana(param: ParametroData): number {
    return (param.custoHoraDesenvolvimento * 40) / 12;
  }

  /**
   * Calcula o fator de peso para cada benefício intangível baseado na resposta.
   */
  private static getBeneficioFactor(resposta: string = 'nenhum'): number {
    const r = (resposta || '').trim().toLowerCase();
    if (r === 'principal' || r === 'x') return 1.0;
    if (r === 'bastante') return 0.5;
    if (r === 'pouco') return 0.25;
    return 0.0;
  }

  /**
   * Executa todos os cálculos derivados de um registro utilizando os parâmetros e perfil informados.
   */
  static calculate(input: RegistroInput, param: ParametroData): CalculatedFields {
    const tempoExecucao = Number(input.tempoExecucao) || 0;
    const valorHoraExecutor = Number(input.valorHoraExecutor) || 0;
    let custoMensalAtual = Number(input.custoMensalAtual) || 0;

    if (custoMensalAtual === 0 && tempoExecucao > 0 && valorHoraExecutor > 0) {
      custoMensalAtual = tempoExecucao * valorHoraExecutor;
    }

    // 1. FTE Liberado (Horas poupadas / Carga Horária Padrão)
    const cargaHoraria = param.cargaHorariaPadrao > 0 ? param.cargaHorariaPadrao : 160;
    const fteLiberado = Number((tempoExecucao / cargaHoraria).toFixed(2));

    // 2. Pontuação de Benefícios (12 Critérios Corporativos Universais)
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

    // 3. Custos de Setup
    const esforcoSetupSemanas = Number(input.esforcoSetupSemanas) || 0;
    const custoSetupPorSemana = this.getCustoSetupMensalPorSemana(param);
    const investimentoSetup = Number((esforcoSetupSemanas * custoSetupPorSemana).toFixed(2));

    // 4. Multi-Turno & Custos de Operação do Robô
    let horasRoboDiurno = Number(input.horasRoboDiurno) || 0;
    let horasRoboNoturno = Number(input.horasRoboNoturno) || 0;
    let horasRoboFimDeSemana = Number(input.horasRoboFimDeSemana) || 0;
    let horasRobo = Number(input.horasRobo) || 0;

    // Se as horas específicas de turnos não foram detalhadas, mas horasRobo foi informada:
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

    // Rótulo descritivo do turno
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

    // 5. Totais Mensais e Anuais
    const custoMensalAno1 = Number(
      (investimentoSetup + custoHorasRobo + custoHorasNegocio + custoManutencao).toFixed(2)
    );
    const custoMensalAno2 = Number((custoHorasRobo + custoHorasNegocio + custoManutencao).toFixed(2));

    const custoAnualAno1 = Number((custoMensalAno1 * 12).toFixed(2));
    const custoAnualAno2 = Number((custoMensalAno2 * 12).toFixed(2));

    // 6. ROI e Payback
    const roiAno1 = Number(((custoMensalAtual * 12) - custoAnualAno1).toFixed(2));
    const roiAno2 = Number(((custoMensalAtual * 24) - custoAnualAno1 - custoAnualAno2 - roiAno1).toFixed(2));

    const paybackMeses =
      custoMensalAtual > 0 && custoAnualAno1 > 0 ? Number((custoAnualAno1 / custoMensalAtual).toFixed(1)) : 0;

    return {
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
      roiAno1,
      roiAno2,
      paybackMeses,
    };
  }
}
