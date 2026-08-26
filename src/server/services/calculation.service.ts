export interface ParametroData {
  pesoLiberarPessoas: number;
  pesoReduzirCusto: number;
  pesoReduzirErros: number;
  pesoMelhorarExpCliente: number;
  pesoAumentarCapacidade: number;
  pesoReduzirTempoResposta: number;
  pesoTransformacaoDigital: number;
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
  horasRobo?: number;
  horasApoioNegocio?: number;
  horasManutencao?: number;
  benLiberarPessoas?: string;
  benReduzirCusto?: string;
  benReduzirErros?: string;
  benMelhorarExpCliente?: string;
  benAumentarCapacidade?: string;
  benReduzirTempoResposta?: string;
  benTransformacaoDigital?: string;
  benReduzirFte?: string;
  perfilPlataforma?: PerfilPlataformaData | null;
}

export interface CalculatedFields {
  custoMensalAtual: number;
  fteLiberado: number;
  pontuacaoBeneficios: number;
  investimentoSetup: number;
  custoHorasRobo: number;
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

    // 2. Pontuação de Benefícios (7 Critérios Estratégicos do Setor Público)
    const pMax =
      param.pesoLiberarPessoas +
      param.pesoReduzirCusto +
      param.pesoReduzirErros +
      param.pesoMelhorarExpCliente +
      param.pesoAumentarCapacidade +
      param.pesoReduzirTempoResposta +
      param.pesoTransformacaoDigital;

    const somaPontos =
      this.getBeneficioFactor(input.benLiberarPessoas) * param.pesoLiberarPessoas +
      this.getBeneficioFactor(input.benReduzirCusto) * param.pesoReduzirCusto +
      this.getBeneficioFactor(input.benReduzirErros) * param.pesoReduzirErros +
      this.getBeneficioFactor(input.benMelhorarExpCliente) * param.pesoMelhorarExpCliente +
      this.getBeneficioFactor(input.benAumentarCapacidade) * param.pesoAumentarCapacidade +
      this.getBeneficioFactor(input.benReduzirTempoResposta) * param.pesoReduzirTempoResposta +
      this.getBeneficioFactor(input.benTransformacaoDigital) * param.pesoTransformacaoDigital;

    const pontuacaoBeneficios = pMax > 0 ? Number((somaPontos / pMax).toFixed(4)) : 0;

    // 3. Custos de Setup e Operação TO BE com Perfil Tecnológico
    const esforcoSetupSemanas = Number(input.esforcoSetupSemanas) || 0;
    const custoSetupPorSemana = this.getCustoSetupMensalPorSemana(param);
    const investimentoSetup = Number((esforcoSetupSemanas * custoSetupPorSemana).toFixed(2));

    const horasRobo = Number(input.horasRobo) || 0;
    const custoHoraRobo = this.getCustoHoraRoboPorTurno(param, input.turno, input.perfilPlataforma);
    const custoHorasRobo = Number((horasRobo * custoHoraRobo).toFixed(2));

    const horasApoioNegocio = Number(input.horasApoioNegocio) || 0;
    const custoHorasNegocio = Number((horasApoioNegocio * valorHoraExecutor).toFixed(2));

    const horasManutencao = Number(input.horasManutencao) || 0;
    const custoHoraManutencao = this.getCustoHoraManutencao(param);
    const custoManutencao = Number((horasManutencao * custoHoraManutencao).toFixed(2));

    // 4. Totais Mensais e Anuais
    const custoMensalAno1 = Number(
      (investimentoSetup + custoHorasRobo + custoHorasNegocio + custoManutencao).toFixed(2)
    );
    const custoMensalAno2 = Number((custoHorasRobo + custoHorasNegocio + custoManutencao).toFixed(2));

    const custoAnualAno1 = Number((custoMensalAno1 * 12).toFixed(2));
    const custoAnualAno2 = Number((custoMensalAno2 * 12).toFixed(2));

    // 5. ROI e Payback
    const roiAno1 = Number(((custoMensalAtual * 12) - custoAnualAno1).toFixed(2));
    const roiAno2 = Number(((custoMensalAtual * 24) - custoAnualAno1 - custoAnualAno2 - roiAno1).toFixed(2));

    const paybackMeses =
      custoMensalAtual > 0 && custoAnualAno1 > 0 ? Number((custoAnualAno1 / custoMensalAtual).toFixed(1)) : 0;

    return {
      custoMensalAtual,
      fteLiberado,
      pontuacaoBeneficios,
      investimentoSetup,
      custoHorasRobo,
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
