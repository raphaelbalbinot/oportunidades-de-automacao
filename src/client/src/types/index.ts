export interface Parametro {
  id: string;
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

export type BeneficioNivel = 'principal' | 'bastante' | 'pouco' | 'nenhum';

export interface Registro {
  id: string;
  idOrigem: string;
  idAnalise: string;
  area: string;
  nomeProcesso: string;
  dataLevantamento: string;
  participantes: string;
  situacao: string; // 'Em levantamento' | 'Aprovado' | 'Em implantação' | 'Concluído' | 'Descartado'

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

  // TO BE - Benefícios (7 Critérios Unificados)
  benLiberarPessoas: BeneficioNivel;
  benReduzirCusto: BeneficioNivel;
  benReduzirErros: BeneficioNivel;
  benMelhorarExpCliente: BeneficioNivel;
  benAumentarCapacidade: BeneficioNivel;
  benReduzirTempoResposta: BeneficioNivel;
  benTransformacaoDigital: BeneficioNivel;
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
  turno: string; // 'Diurno' | 'Noturno' | 'Final de Semana'
  recomendacao: string;

  // Custos e Totais
  esforcoSetupSemanas: number;
  investimentoSetup: number;
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

  // ROI & Payback
  roiAno1: number;
  roiAno2: number;
  paybackMeses: number;

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
}

export interface AnalyticsResumo {
  isSpecificRecord: boolean;
  selectedRecord: Registro | null;
  kpis: AnalyticsKPIs;
  distribuicaoComplexidade: Array<{ name: string; value: number }>;
  distribuicaoTurno: Array<{ name: string; value: number }>;
  distribuicaoSituacao: Array<{ name: string; value: number }>;
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
    custoToBeMensalAno1: number;
    custoToBeMensalAno2: number;
    economiaMensalAno1: number;
    roiAno1: number;
    roiAno2: number;
    paybackMeses: number;
    recomendacao: string;
    situacao: string;
  }>;
  matrizPriorizacao: Array<{
    id: string;
    idAnalise: string;
    nome: string;
    area: string;
    beneficiosScore: number;
    roiAno1: number;
    fte: number;
    complexidade: string;
    payback: number;
    recomendacao: string;
  }>;
  todosProcessosDisponiveis: Array<{
    id: string;
    idAnalise: string;
    nomeProcesso: string;
    area: string;
  }>;
}
