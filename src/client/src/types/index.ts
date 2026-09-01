export interface Parametro {
  id: string;
  // 12 Critérios Corporativos
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
  salarioDesenvolvedorI?: number;
  salarioDesenvolvedorII?: number;
  salarioDesenvolvedorIII?: number;
  custoHoraDesenvolvimento: number;
  taxaDescontoVpl?: number;
  horizonteVplMeses?: number;
  updatedAt?: string;
}

export interface PerfilPlataforma {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  custoLicencaMensal: number;
  custoEstacaoTrabalho: number;
  custoServidor: number;
  nrRobosDiluicao: number;
  isPadrao: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Area {
  id: string;
  nome: string;
  sigla: string;
  responsavel: string;
  descricao: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BeneficioNivel = 'principal' | 'bastante' | 'pouco' | 'nenhum';
export type MaturidadeNivel = 'N0' | 'N1' | 'N2' | 'N3';
export type ArquetipoTipo = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7';

export interface InstrumentacaoPendencia {
  campo: string;
  label: string;
  arquetipo?: string;
  ondeEncontrar: string;
  impactoParaPromocao: string;
}

export interface DiagnosticoInstrumentacao {
  nivelAtual: MaturidadeNivel;
  proximoNivel: string;
  percentualPreenchimento: number;
  pendencias: InstrumentacaoPendencia[];
}

export interface Registro {
  id: string;
  idOrigem: string;
  idAnalise: string;
  area: string;
  nomeProcesso: string;
  dataLevantamento: string;
  participantes: string;
  situacao: string; // 'Em levantamento' | 'Aprovado' | 'Em implantação' | 'Concluído' | 'Descartado'

  // Funil de Maturidade FCAIA (N0 a N3)
  nivelMaturidade: MaturidadeNivel;
  dataPromocaoMaturidade?: string;
  responsavelPromocao?: string;
  isRetrospectivo?: boolean;

  // Triagem Qualitativa N0
  sintomasDor?: string;
  papeisEnvolvidos?: string;
  criticidadePercebida?: 'Baixa' | 'Média' | 'Alta' | 'Crítica' | string;
  recorrenciaDor?: 'Rara' | 'Ocasional' | 'Frequente' | 'Diária' | string;

  // 7 Arquétipos de Processo
  arquetipoPrimario: ArquetipoTipo | string;
  arquetiposSecundarios?: string; // ex: "A2,A4"

  // Variáveis Quantitativas dos Arquétipos
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

  // Atribuição por Trilha
  percTrilhaProcesso?: number;
  percTrilhaSistema?: number;
  percTrilhaAutomacao?: number;
  justificativaTrilha?: string;

  // Fator de Reuso e Escala
  unidadesPiloto?: number;
  unidadesPotenciais?: number;
  custoMarginalReplicacao?: number;
  beneficioPotencialEscala?: number;

  // Baseline Incremental
  coberturaInicialPerc?: number;
  coberturaFinalPerc?: number;

  // AS IS
  areasEnvolvidas: string;
  descricaoProcesso: string;
  numExecucoes: number;
  periodicidade: string;
  numPessoasEnvolvidas: number;
  tipoAlocacao: string;
  perfilExecutor: string;
  valorHoraExecutor: number;
  tempoExecucao: number;
  custoMensalAtual: number;
  sistemasEnvolvidos: string;
  documentosApoio: string;

  // TO BE - Benefícios (12 Critérios Corporativos)
  benLiberarPessoas: BeneficioNivel;
  benReduzirCusto: BeneficioNivel;
  benReduzirErros: BeneficioNivel;
  benSegurancaPrivacidade: BeneficioNivel;
  benRastreabilidadeCompliance: BeneficioNivel;
  benKeyPersonRisk: BeneficioNivel;
  benMelhorarExpCliente: BeneficioNivel;
  benAumentarCapacidade: BeneficioNivel;
  benReduzirTempoResposta: BeneficioNivel;
  benInteroperabilidade: BeneficioNivel;
  benTransformacaoDigital: BeneficioNivel;
  benSustentabilidadeEsg: BeneficioNivel;
  benReduzirFte?: BeneficioNivel;
  pontuacaoBeneficios: number;

  // TO BE - Solução e Plataforma
  perfilPlataformaId?: string | null;
  perfilPlataforma?: PerfilPlataforma | null;
  tipoPlataformaNome?: string;
  descricaoSolucao: string;
  pontosAtencao: string;
  fteLiberado: number;
  reducaoTempoPrevista: string;
  complexidade: string; // 'Baixa' | 'Média' | 'Alta'
  reducaoCustoPrevista: string;
  numRotinas: number;
  turno: string;
  recomendacao: string;

  // Custos e Múltiplos Turnos
  perfilDesenvolvedor?: string;
  esforcoSetupSemanas: number;
  investimentoSetup: number;
  horasRoboDiurno: number;
  horasRoboNoturno: number;
  horasRoboFimDeSemana: number;
  horasRobo: number;
  custoHorasRobo: number;
  horasApoioNegocio: number;
  custoHorasNegocio: number;
  horasManutencao: number;
  custoManutencao: number;

  custoMensalAno1: number;
  custoMensalAno2: number;
  custoAnualAno1: number;
  custoAnualAno2: number;

  // Benefícios Bruto e Líquido por Arquétipo
  beneficioBrutoAnual?: number;
  beneficioLiquidoAnual?: number;

  // ROI & Payback
  roiAno1: number;
  roiAno2: number;
  paybackMeses: number;
  scorePriorizacao?: number;

  // VPL & Cenários
  vpl3Anos?: number;
  vplCenarioConservador?: number;
  vplCenarioBase?: number;
  vplCenarioOtimista?: number;
  paybackCenarioConservador?: number;
  paybackCenarioOtimista?: number;

  // N3 - Benefício Realizado
  beneficioRealizadoAnual?: number;
  desvioProjetadoRealizadoPerc?: number;
  dataApuracaoRealizado?: string;
  notasRealizado?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsKPIs {
  totalProcessos: number;
  totalFteLiberado: number;
  custoAtualMensalTotal: number;
  custoMensalAno1Total: number;
  custoMensalAno2Total: number;
  investimentoSetupTotal: number;
  roiAno1Total: number;
  roiAno2Total: number;
  paybackMedio: number;
  pontuacaoMediaPercent: number;
  totalVpl3Anos?: number;
  totalBeneficioLiquidoAnual?: number;
}

export interface AnalyticsResumo {
  isSpecificRecord: boolean;
  selectedRecord: Registro | null;
  kpis: AnalyticsKPIs;
  distribuicaoComplexidade: Array<{ name: string; value: number }>;
  distribuicaoTurno: Array<{ name: string; value: number }>;
  distribuicaoSituacao: Array<{ name: string; value: number }>;
  distribuicaoMaturidade?: Array<{ name: string; value: number }>;
  distribuicaoArquetipos?: Array<{ name: string; value: number }>;
  comparativoProcessos: Array<{
    id: string;
    idOrigem: string;
    idAnalise: string;
    nome: string;
    area: string;
    periodicidade: string;
    custoAtualMensal: number;
    perfilExecutor: string;
    tempoExecucao: number;
    sistemasEnvolvidos: string;
    complexidade: string;
    tipoPlataformaNome?: string;
    pontuacaoBeneficios: number;
    fteLiberado: number;
    reducaoCustoPrevista: string;
    reducaoTempoPrevista: string;
    investimentoSetup: number;
    horasRoboDiurno?: number;
    horasRoboNoturno?: number;
    horasRoboFimDeSemana?: number;
    horasRobo?: number;
    turno?: string;
    custoToBeMensalAno1: number;
    custoToBeMensalAno2: number;
    economiaMensalAno1: number;
    roiAno1: number;
    roiAno2: number;
    paybackMeses: number;
    scorePriorizacao?: number;
    recomendacao: string;
    situacao: string;
  }>;
  matrizPriorizacao: Array<{
    id: string;
    idAnalise: string;
    nome: string;
    area: string;
    nivelMaturidade?: string;
    arquetipo?: string;
    beneficiosScore: number;
    roiAno1: number;
    vpl3Anos?: number;
    beneficioLiquidoAnual?: number;
    esforcoSemanas?: number;
    scorePriorizacao?: number;
    fte: number;
    complexidade: string;
    payback: number;
    recomendacao: string;
    situacao?: string;
  }>;
  todosProcessosDisponiveis: Array<{
    id: string;
    idAnalise: string;
    nomeProcesso: string;
    area: string;
  }>;
}
