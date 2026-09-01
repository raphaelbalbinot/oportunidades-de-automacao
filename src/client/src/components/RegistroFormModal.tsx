import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { Registro, Parametro, BeneficioNivel, PerfilPlataforma, Area, MaturidadeNivel, ArquetipoTipo, InstrumentacaoPendencia } from '../types';
import { api } from '../services/api';
import { Tooltip } from './Tooltip';
import { useNotification } from './Notification';

interface RegistroFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSave?: (formData: Partial<Registro>) => Promise<void> | void;
  initialData?: Registro | null;
  parametro?: Parametro | null;
}

export const RegistroFormModal: React.FC<RegistroFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSave,
  initialData,
  parametro,
}) => {
  const notify = useNotification();
  const [perfis, setPerfis] = useState<PerfilPlataforma[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [formData, setFormData] = useState<Partial<Registro>>({
    idOrigem: '',
    idAnalise: '',
    area: '',
    nomeProcesso: '',
    dataLevantamento: new Date().toISOString().split('T')[0],
    participantes: '',
    situacao: 'Em levantamento',
    nivelMaturidade: 'N0',
    isRetrospectivo: false,

    // Triagem N0
    sintomasDor: '',
    papeisEnvolvidos: '',
    criticidadePercebida: 'Média',
    recorrenciaDor: 'Frequente',

    // 7 Arquétipos
    arquetipoPrimario: 'A1',
    arquetiposSecundarios: '',

    // Variáveis dos Arquétipos
    percAutomatizavel: 100,
    taxaErroAtual: 0,
    custoMedioErro: 0,
    reducaoEsperadaErro: 0.8,
    volumeContatosMensal: 0,
    custoAtendimentoHumano: 0,
    taxaContencaoEsperada: 0.6,
    custoAtendimentoAuto: 0,
    probabilidadeDescumprimento: 0,
    impactoFinanceiroOcorrencia: 0,
    reducaoProbabilidadeRisco: 0.9,
    historicoOcorrencias12m: 0,
    leadTimeAtualDias: 0,
    leadTimeProjetadoDias: 0,
    volumeAdicionalViabilizado: 0,
    ticketMedioReceita: 0,
    diasAntecipacaoFaturamento: 0,
    valorFaturadoCiclo: 0,
    nrAtivosAntes: 0,
    nrAtivosDepois: 0,
    custoManutencaoAnualAtivo: 0,
    numSolicitacoesComerciaisMes: 0,
    tempoRespostaAtualHoras: 0,
    tempoRespostaAlvoHoras: 0,
    taxaConversaoAtual: 0,
    taxaConversaoAlvo: 0,
    ticketMedioProposta: 0,
    percPerdasPorPrazo: 0,

    // Trilha e Reuso
    percTrilhaProcesso: 0,
    percTrilhaSistema: 0,
    percTrilhaAutomacao: 1.0,
    justificativaTrilha: '',
    unidadesPiloto: 1,
    unidadesPotenciais: 1,
    custoMarginalReplicacao: 0,
    coberturaInicialPerc: 0,
    coberturaFinalPerc: 1.0,

    // AS IS
    areasEnvolvidas: '',
    descricaoProcesso: '',
    numExecucoes: 0,
    periodicidade: 'Mensal',
    numPessoasEnvolvidas: 0,
    tipoAlocacao: 'Parcial',
    perfilExecutor: 'Analista',
    valorHoraExecutor: 45,
    tempoExecucao: 0,
    custoMensalAtual: 0,
    sistemasEnvolvidos: '',
    documentosApoio: '',

    // 12 Critérios Corporativos
    benLiberarPessoas: 'nenhum',
    benReduzirCusto: 'nenhum',
    benReduzirErros: 'nenhum',
    benSegurancaPrivacidade: 'nenhum',
    benRastreabilidadeCompliance: 'nenhum',
    benKeyPersonRisk: 'nenhum',
    benMelhorarExpCliente: 'nenhum',
    benAumentarCapacidade: 'nenhum',
    benReduzirTempoResposta: 'nenhum',
    benInteroperabilidade: 'nenhum',
    benTransformacaoDigital: 'nenhum',
    benSustentabilidadeEsg: 'nenhum',

    perfilPlataformaId: '',
    tipoPlataformaNome: '',
    descricaoSolucao: '',
    pontosAtencao: '',
    reducaoTempoPrevista: '',
    complexidade: 'Média',
    reducaoCustoPrevista: '',
    numRotinas: 1,
    turno: 'Diurno',
    recomendacao: 'Recomendado',

    perfilDesenvolvedor: 'Desenvolvedor II',
    esforcoSetupSemanas: 0,
    horasRoboDiurno: 0,
    horasRoboNoturno: 0,
    horasRoboFimDeSemana: 0,
    horasRobo: 0,
    horasApoioNegocio: 0,
    horasManutencao: 0,

    // N3 Realizado
    beneficioRealizadoAnual: 0,
    desvioProjetadoRealizadoPerc: 0,
    dataApuracaoRealizado: '',
    notasRealizado: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<
    'geral' | 'arquetipos' | 'beneficios' | 'tobe' | 'trilha' | 'diagnostico' | 'realizado'
  >('geral');

  const stepOrder: Array<'geral' | 'arquetipos' | 'beneficios' | 'tobe' | 'trilha' | 'diagnostico' | 'realizado'> = [
    'geral',
    'arquetipos',
    'beneficios',
    'tobe',
    'trilha',
    'diagnostico',
  ];
  if (formData.id || formData.isRetrospectivo || (formData.beneficioRealizadoAnual && formData.beneficioRealizadoAnual > 0)) {
    stepOrder.push('realizado');
  }

  const currentStepIndex = stepOrder.indexOf(activeSubTab);

  const handleNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      setActiveSubTab(stepOrder[currentStepIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveSubTab(stepOrder[currentStepIndex - 1]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfisList, areasList] = await Promise.all([
          api.getPerfisPlataforma(),
          api.getAreas(),
        ]);
        setPerfis(perfisList);
        setAreas(areasList);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        nivelMaturidade: initialData.nivelMaturidade || 'N0',
        arquetipoPrimario: initialData.arquetipoPrimario || 'A1',
        percAutomatizavel: initialData.percAutomatizavel !== undefined ? (initialData.percAutomatizavel <= 1 && initialData.percAutomatizavel > 0 ? Math.round(initialData.percAutomatizavel * 100) : initialData.percAutomatizavel) : 100,
        percTrilhaAutomacao: initialData.percTrilhaAutomacao ?? 1.0,
        unidadesPiloto: initialData.unidadesPiloto ?? 1,
        unidadesPotenciais: initialData.unidadesPotenciais ?? 1,
        horasRoboDiurno: initialData.horasRoboDiurno ?? (initialData.turno === 'Noturno' ? 0 : initialData.horasRobo || 0),
        horasRoboNoturno: initialData.horasRoboNoturno ?? (initialData.turno === 'Noturno' ? initialData.horasRobo || 0 : 0),
        horasRoboFimDeSemana: initialData.horasRoboFimDeSemana ?? (initialData.turno === 'Final de Semana' ? initialData.horasRobo || 0 : 0),
        horasManutencao: initialData.horasManutencao ?? 0,
        horasApoioNegocio: initialData.horasApoioNegocio ?? 0,
        perfilDesenvolvedor: initialData.perfilDesenvolvedor || 'Desenvolvedor II',
      });
    } else {
      const padrao = perfis.find((p) => p.isPadrao) || perfis[0];
      setActiveSubTab('geral');
      setFormData({
        idOrigem: '',
        idAnalise: '',
        area: '',
        nomeProcesso: '',
        dataLevantamento: new Date().toISOString().split('T')[0],
        participantes: '',
        situacao: 'Em levantamento',
        nivelMaturidade: 'N0',
        isRetrospectivo: false,
        sintomasDor: '',
        papeisEnvolvidos: '',
        criticidadePercebida: 'Média',
        recorrenciaDor: 'Frequente',
        arquetipoPrimario: 'A1',
        arquetiposSecundarios: '',
        percAutomatizavel: 100,
        taxaErroAtual: 0,
        custoMedioErro: 0,
        reducaoEsperadaErro: 0.8,
        volumeContatosMensal: 0,
        custoAtendimentoHumano: 0,
        taxaContencaoEsperada: 0.6,
        custoAtendimentoAuto: 0,
        probabilidadeDescumprimento: 0,
        impactoFinanceiroOcorrencia: 0,
        reducaoProbabilidadeRisco: 0.9,
        historicoOcorrencias12m: 0,
        leadTimeAtualDias: 0,
        leadTimeProjetadoDias: 0,
        volumeAdicionalViabilizado: 0,
        ticketMedioReceita: 0,
        diasAntecipacaoFaturamento: 0,
        valorFaturadoCiclo: 0,
        nrAtivosAntes: 0,
        nrAtivosDepois: 0,
        custoManutencaoAnualAtivo: 0,
        numSolicitacoesComerciaisMes: 0,
        tempoRespostaAtualHoras: 0,
        tempoRespostaAlvoHoras: 0,
        taxaConversaoAtual: 0,
        taxaConversaoAlvo: 0,
        ticketMedioProposta: 0,
        percPerdasPorPrazo: 0,
        percTrilhaProcesso: 0,
        percTrilhaSistema: 0,
        percTrilhaAutomacao: 1.0,
        justificativaTrilha: '',
        unidadesPiloto: 1,
        unidadesPotenciais: 1,
        custoMarginalReplicacao: 0,
        coberturaInicialPerc: 0,
        coberturaFinalPerc: 1.0,
        areasEnvolvidas: '',
        descricaoProcesso: '',
        numExecucoes: 0,
        periodicidade: 'Mensal',
        numPessoasEnvolvidas: 0,
        tipoAlocacao: 'Parcial',
        perfilExecutor: 'Analista',
        valorHoraExecutor: 45,
        tempoExecucao: 0,
        custoMensalAtual: 0,
        sistemasEnvolvidos: '',
        documentosApoio: '',
        benLiberarPessoas: 'nenhum',
        benReduzirCusto: 'nenhum',
        benReduzirErros: 'nenhum',
        benSegurancaPrivacidade: 'nenhum',
        benRastreabilidadeCompliance: 'nenhum',
        benKeyPersonRisk: 'nenhum',
        benMelhorarExpCliente: 'nenhum',
        benAumentarCapacidade: 'nenhum',
        benReduzirTempoResposta: 'nenhum',
        benInteroperabilidade: 'nenhum',
        benTransformacaoDigital: 'nenhum',
        benSustentabilidadeEsg: 'nenhum',
        perfilPlataformaId: padrao?.id || '',
        tipoPlataformaNome: padrao?.nome || 'Python / Frameworks de Automação (Open Source)',
        descricaoSolucao: '',
        pontosAtencao: '',
        reducaoTempoPrevista: '',
        complexidade: 'Média',
        reducaoCustoPrevista: '',
        numRotinas: 1,
        turno: 'Diurno',
        recomendacao: 'Recomendado',
        perfilDesenvolvedor: 'Desenvolvedor II',
        esforcoSetupSemanas: 0,
        horasRoboDiurno: 0,
        horasRoboNoturno: 0,
        horasRoboFimDeSemana: 0,
        horasRobo: 0,
        horasApoioNegocio: 0,
        horasManutencao: 0,
        beneficioRealizadoAnual: 0,
        desvioProjetadoRealizadoPerc: 0,
        dataApuracaoRealizado: '',
        notasRealizado: '',
      });
    }
  }, [initialData, isOpen, perfis]);

  const handleChange = (field: keyof Registro, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'horasRoboDiurno' || field === 'horasRoboNoturno' || field === 'horasRoboFimDeSemana') {
        const hd = Number(field === 'horasRoboDiurno' ? value : updated.horasRoboDiurno) || 0;
        const hn = Number(field === 'horasRoboNoturno' ? value : updated.horasRoboNoturno) || 0;
        const hf = Number(field === 'horasRoboFimDeSemana' ? value : updated.horasRoboFimDeSemana) || 0;
        updated.horasRobo = Number((hd + hn + hf).toFixed(2));
      }
      return updated;
    });
  };

  const handlePlataformaChange = (perfilId: string) => {
    const selected = perfis.find((p) => p.id === perfilId);
    setFormData((prev) => ({
      ...prev,
      perfilPlataformaId: perfilId,
      tipoPlataformaNome: selected ? selected.nome : prev.tipoPlataformaNome,
    }));
  };

  // Cálculo de pré-visualização em tempo real V2.0
  const calcPreview = useMemo(() => {
    if (!parametro) return null;

    const tempoExecucao = Number(formData.tempoExecucao) || 0;
    const valorHoraExecutor = Number(formData.valorHoraExecutor) || 0;
    let custoMensalAtual = Number(formData.custoMensalAtual) || 0;
    if (custoMensalAtual === 0 && tempoExecucao > 0 && valorHoraExecutor > 0) {
      custoMensalAtual = tempoExecucao * valorHoraExecutor;
    }

    const cargaHoraria = parametro.cargaHorariaPadrao || 160;
    const fteLiberado = Number((tempoExecucao / cargaHoraria).toFixed(2));

    // Determina nível de maturidade
    let nivelMaturidade: MaturidadeNivel = 'N0';
    if (formData.isRetrospectivo || formData.situacao === 'Concluído') {
      nivelMaturidade = 'N3';
    } else if (tempoExecucao > 0 || (Number(formData.numExecucoes) > 0 && Number(formData.taxaErroAtual) > 0)) {
      if (Number(formData.esforcoSetupSemanas) > 0 || Number(formData.horasRobo) > 0) {
        nivelMaturidade = 'N2';
      } else {
        nivelMaturidade = 'N1';
      }
    }

    // 12 Critérios
    const pFactor = (res?: string) => {
      if (res === 'principal') return 1.0;
      if (res === 'bastante') return 0.5;
      if (res === 'pouco') return 0.25;
      return 0.0;
    };

    const pMax =
      (parametro.pesoLiberarPessoas || 3) +
      (parametro.pesoReduzirCusto || 3) +
      (parametro.pesoReduzirErros || 3) +
      (parametro.pesoSegurancaPrivacidade || 3) +
      (parametro.pesoRastreabilidadeCompliance || 3) +
      (parametro.pesoKeyPersonRisk || 2) +
      (parametro.pesoMelhorarExpCliente || 2) +
      (parametro.pesoAumentarCapacidade || 2) +
      (parametro.pesoReduzirTempoResposta || 2) +
      (parametro.pesoInteroperabilidade || 2) +
      (parametro.pesoTransformacaoDigital || 1) +
      (parametro.pesoSustentabilidadeEsg || 1);

    const somaPontos =
      pFactor(formData.benLiberarPessoas) * (parametro.pesoLiberarPessoas || 3) +
      pFactor(formData.benReduzirCusto) * (parametro.pesoReduzirCusto || 3) +
      pFactor(formData.benReduzirErros) * (parametro.pesoReduzirErros || 3) +
      pFactor(formData.benSegurancaPrivacidade) * (parametro.pesoSegurancaPrivacidade || 3) +
      pFactor(formData.benRastreabilidadeCompliance) * (parametro.pesoRastreabilidadeCompliance || 3) +
      pFactor(formData.benKeyPersonRisk) * (parametro.pesoKeyPersonRisk || 2) +
      pFactor(formData.benMelhorarExpCliente) * (parametro.pesoMelhorarExpCliente || 2) +
      pFactor(formData.benAumentarCapacidade) * (parametro.pesoAumentarCapacidade || 2) +
      pFactor(formData.benReduzirTempoResposta) * (parametro.pesoReduzirTempoResposta || 2) +
      pFactor(formData.benInteroperabilidade) * (parametro.pesoInteroperabilidade || 2) +
      pFactor(formData.benTransformacaoDigital) * (parametro.pesoTransformacaoDigital || 1) +
      pFactor(formData.benSustentabilidadeEsg) * (parametro.pesoSustentabilidadeEsg || 1);

    const pontuacaoBeneficios = pMax > 0 ? (somaPontos / pMax) * 100 : 0;

    // Custos da Plataforma
    const selectedPerfil = perfis.find((p) => p.id === formData.perfilPlataformaId);
    const servidor = selectedPerfil?.custoServidor !== undefined ? selectedPerfil.custoServidor : parametro.servidor;
    const nrRobos = selectedPerfil?.nrRobosDiluicao || parametro.nrRobos || 1;
    const licenca = selectedPerfil?.custoLicencaMensal !== undefined ? selectedPerfil.custoLicencaMensal : parametro.licencaRobo;
    const estacao = selectedPerfil?.custoEstacaoTrabalho !== undefined ? selectedPerfil.custoEstacaoTrabalho : parametro.estacaoTrabalhoRobo;
    const baseCusto = servidor / nrRobos + (licenca + estacao) + parametro.operadorSalaControle / nrRobos;

    const taxaDiurna = (baseCusto * parametro.percDiurno) / 21 / 10;
    const taxaNoturna = (baseCusto * parametro.percNoturno) / 21 / 14;
    const taxaFimSemana = (baseCusto * parametro.percFimDeSemana) / 8 / 24;

    const hd = Number(formData.horasRoboDiurno) || 0;
    const hn = Number(formData.horasRoboNoturno) || 0;
    const hf = Number(formData.horasRoboFimDeSemana) || 0;
    const custoHorasRobo = hd * taxaDiurna + hn * taxaNoturna + hf * taxaFimSemana;

    const encargos = 1.6;
    const perfilDev = (formData.perfilDesenvolvedor || 'Desenvolvedor II').trim().toLowerCase();
    let custoHoraDev = parametro.custoHoraDesenvolvimento || 185;

    if (perfilDev.includes('iii') || perfilDev.includes('senior') || perfilDev.includes('sênior') || perfilDev.includes('3')) {
      const sal = parametro.salarioDesenvolvedorIII || 26000;
      custoHoraDev = (sal * encargos) / cargaHoraria;
    } else if ((perfilDev.includes('i') && !perfilDev.includes('ii') && !perfilDev.includes('iii')) || perfilDev.includes('junior') || perfilDev.includes('júnior') || perfilDev.includes('1')) {
      const sal = parametro.salarioDesenvolvedorI || 10000;
      custoHoraDev = (sal * encargos) / cargaHoraria;
    } else {
      const sal = parametro.salarioDesenvolvedorII || 18500;
      custoHoraDev = (sal * encargos) / cargaHoraria;
    }

    const esforcoSetupSemanas = Number(formData.esforcoSetupSemanas) || 0;
    const investimentoSetup = (esforcoSetupSemanas * (custoHoraDev * 40)) / 12;

    const horasApoio = Number(formData.horasApoioNegocio) || 0;
    const custoHorasNegocio = horasApoio * valorHoraExecutor;

    const horasManut = Number(formData.horasManutencao) || 0;
    const custoHoraManut = (parametro.operadorSalaControle * 1.6) / 168;
    const custoManutencao = horasManut * custoHoraManut;

    const custoRecorrenteMensal = custoHorasRobo + custoHorasNegocio + custoManutencao;
    const custoMensalAno1 = investimentoSetup + custoRecorrenteMensal;
    const custoAnualAno1 = custoMensalAno1 * 12;
    const custoAnualAno2 = custoRecorrenteMensal * 12;

    // Cálculo do Benefício Bruto Multiarquétipo
    let beneficioBruto = 0;
    const arq = (formData.arquetipoPrimario || 'A1').toUpperCase();

    if (arq === 'A1') {
      const rawPerc = Number(formData.percAutomatizavel !== undefined ? formData.percAutomatizavel : 100);
      const percAuto = rawPerc > 1 ? rawPerc / 100 : (rawPerc <= 0 ? 0 : rawPerc);
      beneficioBruto = (custoMensalAtual * 12) * Math.max(0, Math.min(1, percAuto));
    } else if (arq === 'A2') {
      const numExec = Number(formData.numExecucoes) || 0;
      const tErro = Number(formData.taxaErroAtual) || 0;
      const cErro = Number(formData.custoMedioErro) || 0;
      const rErro = Number(formData.reducaoEsperadaErro) || 0.8;
      beneficioBruto = numExec * tErro * cErro * rErro * 12;
    } else if (arq === 'A3') {
      const vol = Number(formData.volumeContatosMensal) || 0;
      const cHum = Number(formData.custoAtendimentoHumano) || 0;
      const cAuto = Number(formData.custoAtendimentoAuto) || 0;
      const tCont = Number(formData.taxaContencaoEsperada) || 0.6;
      beneficioBruto = vol * tCont * Math.max(0, cHum - cAuto) * 12;
    } else if (arq === 'A4') {
      const imp = Number(formData.impactoFinanceiroOcorrencia) || 0;
      const prob = Number(formData.probabilidadeDescumprimento) || 0;
      const red = Number(formData.reducaoProbabilidadeRisco) || 0.9;
      beneficioBruto = imp * prob * red;
    } else if (arq === 'A5') {
      const volAdic = Number(formData.volumeAdicionalViabilizado) || 0;
      const tick = Number(formData.ticketMedioReceita) || 0;
      beneficioBruto = volAdic * tick * 12;
    } else if (arq === 'A6') {
      const ant = Number(formData.nrAtivosAntes) || 0;
      const dep = Number(formData.nrAtivosDepois) || 0;
      const cAtiv = Number(formData.custoManutencaoAnualAtivo) || 0;
      beneficioBruto = Math.max(0, ant - dep) * cAtiv;
    } else if (arq === 'A7') {
      const numSol = Number(formData.numSolicitacoesComerciaisMes) || 0;
      const cAtu = Number(formData.taxaConversaoAtual) || 0;
      const cAlvo = Number(formData.taxaConversaoAlvo) || 0;
      const tick = Number(formData.ticketMedioProposta) || 0;
      beneficioBruto = numSol * 12 * Math.max(0, cAlvo - cAtu) * tick;
    }

    if (beneficioBruto === 0 && custoMensalAtual > 0) {
      beneficioBruto = custoMensalAtual * 12;
    }

    const percAuto = Number(formData.percTrilhaAutomacao ?? 1.0);
    const beneficioLiquidoAnual = beneficioBruto * percAuto;

    const roiAno1 = beneficioLiquidoAnual - custoAnualAno1;
    const paybackMeses =
      beneficioLiquidoAnual > 0 && custoAnualAno1 > 0
        ? Number((custoAnualAno1 / (beneficioLiquidoAnual / 12)).toFixed(1))
        : 0;

    // VPL 3 Anos
    const taxaDesc = parametro.taxaDescontoVpl || 0.12;
    const invTotal = investimentoSetup * 12;
    const fluxoAnual = beneficioLiquidoAnual - custoAnualAno2;
    const vpl3Anos =
      -invTotal +
      fluxoAnual / Math.pow(1 + taxaDesc, 1) +
      fluxoAnual / Math.pow(1 + taxaDesc, 2) +
      fluxoAnual / Math.pow(1 + taxaDesc, 3);

    return {
      nivelMaturidade,
      custoMensalAtual,
      fteLiberado,
      pontuacaoBeneficios: Number(pontuacaoBeneficios.toFixed(1)),
      investimentoSetup: Number(investimentoSetup.toFixed(2)),
      custoMensalAno1: Number(custoMensalAno1.toFixed(2)),
      custoMensalAno2: Number(custoRecorrenteMensal.toFixed(2)),
      beneficioLiquidoAnual: Number(beneficioLiquidoAnual.toFixed(2)),
      roiAno1: Number(roiAno1.toFixed(2)),
      paybackMeses,
      vpl3Anos: Number(vpl3Anos.toFixed(2)),
    };
  }, [formData, parametro, perfis]);

  // Lista de pendências para o diagnóstico
  const diagnosticoPendencias = useMemo<InstrumentacaoPendencia[]>(() => {
    const list: InstrumentacaoPendencia[] = [];
    if (!formData.tempoExecucao || Number(formData.tempoExecucao) <= 0) {
      list.push({
        campo: 'tempoExecucao',
        label: 'Tempo de Execução Manual (HH/mês)',
        arquetipo: 'A1',
        ondeEncontrar: 'Entrevista de processo com os operadores ou chamados no Jira/ServiceNow.',
        impactoParaPromocao: 'Essencial para avançar de N0 para N1 e apurar FTE liberado.',
      });
    }
    if (!formData.numExecucoes || Number(formData.numExecucoes) <= 0) {
      list.push({
        campo: 'numExecucoes',
        label: 'Volume Mensal de Transações',
        ondeEncontrar: 'Logs de aplicação, ERP (SAP) ou relatórios operacionais.',
        impactoParaPromocao: 'Base para dimensionar capacidade de processamento.',
      });
    }
    if (!formData.valorHoraExecutor || Number(formData.valorHoraExecutor) <= 0) {
      list.push({
        campo: 'valorHoraExecutor',
        label: 'Custo/Hora do Executor (R$/h)',
        ondeEncontrar: 'Tabela média de salários/encargos (RH/Gestão de Pessoas).',
        impactoParaPromocao: 'Necessário para monetizar as horas em valor financeiro.',
      });
    }
    if (!formData.esforcoSetupSemanas || Number(formData.esforcoSetupSemanas) <= 0) {
      list.push({
        campo: 'esforcoSetupSemanas',
        label: 'Esforço de Implementação (Semanas)',
        ondeEncontrar: 'Estimativa de engenharia técnica do CoE/FCAIA.',
        impactoParaPromocao: 'Necessário para calcular investimento inicial, Payback e VPL (N2).',
      });
    }
    return list;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(formData);
      } else {
        if (formData.id) {
          await api.updateRegistro(formData.id, formData);
          notify.success('Oportunidade de automação atualizada com sucesso!');
        } else {
          await api.createRegistro(formData);
          notify.success('Nova oportunidade de automação cadastrada com sucesso!');
        }
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      notify.error(err.message || 'Erro ao salvar oportunidade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRadioBeneficio = (
    field: keyof Registro,
    label: string,
    descricao: string,
    exemplo: string
  ) => (
    <div className="bg-white p-2.5 rounded border border-slate-200 hover:border-blue-400 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <label className="font-semibold text-slate-800 text-xs flex items-center space-x-1">
          <span>{label}</span>
          <Tooltip content={descricao} />
        </label>
        <span className="text-[10px] text-slate-500 italic hidden sm:inline">{exemplo}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mt-1">
        {(['principal', 'bastante', 'pouco', 'nenhum'] as BeneficioNivel[]).map((val) => (
          <label
            key={val}
            className={`flex items-center justify-center p-1 rounded text-[11px] border cursor-pointer font-medium transition-all ${
              formData[field] === val
                ? 'bg-[#1351b4] text-white border-[#1351b4] font-bold shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <input
              type="radio"
              name={String(field)}
              value={val}
              checked={formData[field] === val}
              onChange={() => handleChange(field, val)}
              className="sr-only"
            />
            <span className="capitalize">{val}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <span className="font-bold text-[var(--govbr-blue-warm-vivid-90)]">
            {formData.id ? 'Editar Oportunidade de Automação' : 'Cadastrar Oportunidade de Automação'}
          </span>
          {calcPreview && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                calcPreview.nivelMaturidade === 'N0'
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : calcPreview.nivelMaturidade === 'N1'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : calcPreview.nivelMaturidade === 'N2'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-purple-100 text-purple-900 border-purple-300'
              }`}
            >
              Nível {calcPreview.nivelMaturidade} —{' '}
              {calcPreview.nivelMaturidade === 'N0'
                ? 'Oportunidade'
                : calcPreview.nivelMaturidade === 'N1'
                ? 'Business Case Parcial'
                : calcPreview.nivelMaturidade === 'N2'
                ? 'Business Case Completo'
                : 'Benefício Realizado'}
            </span>
          )}
        </div>
      }
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Painel Superior Executivo com Métricas V2.0 */}
        {calcPreview && (
          <div className="bg-[#0c326f] text-white p-3 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Benefício Anual (R$)</span>
                <span className="font-bold text-emerald-300 text-sm">
                  {calcPreview.beneficioLiquidoAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">VPL (3 Anos)</span>
                <span className="font-bold text-cyan-300 text-sm">
                  {calcPreview.vpl3Anos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">FTEs Liberáveis</span>
                <span className="font-bold text-amber-300 text-sm">{calcPreview.fteLiberado} FTE</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Payback Estimado</span>
                <span className="font-bold text-white text-sm">{calcPreview.paybackMeses} meses</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Score Intangível</span>
                <span className="font-bold text-purple-300 text-sm">{calcPreview.pontuacaoBeneficios}%</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Score Priorização</span>
                <span className="font-bold text-yellow-300 text-sm">{calcPreview.scorePriorizacao ?? 0} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Wizard Bar (GOVBR DS) */}
        <div className="flex border-b border-slate-200 overflow-x-auto pb-1 gap-1">
          {stepOrder.map((stepKey, idx) => {
            const isActive = activeSubTab === stepKey;
            const isPassed = currentStepIndex > idx;
            const stepLabels: Record<string, { label: string; icon: string }> = {
              geral: { label: '1. Contexto (N0)', icon: 'fa-file-alt' },
              arquetipos: { label: '2. AS IS & 7 Arquétipos', icon: 'fa-chart-line' },
              beneficios: { label: '3. Benefícios Intangíveis', icon: 'fa-award' },
              tobe: { label: '4. TO BE & Engenharia', icon: 'fa-laptop-code' },
              trilha: { label: '5. Trilha & Reuso', icon: 'fa-sitemap' },
              diagnostico: { label: '6. Diagnóstico & Prontidão', icon: 'fa-stethoscope' },
              realizado: { label: '7. N3 Realizado', icon: 'fa-check-circle' },
            };

            const info = stepLabels[stepKey] || { label: stepKey, icon: 'fa-circle' };

            return (
              <button
                key={stepKey}
                type="button"
                onClick={() => setActiveSubTab(stepKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-t transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-white text-[#1351b4] border-b-2 border-[#1351b4] font-bold shadow-xs'
                    : isPassed
                    ? 'text-emerald-700 hover:bg-emerald-50/50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    isActive
                      ? 'bg-[#1351b4] text-white'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPassed ? <i className="fas fa-check text-[8px]"></i> : idx + 1}
                </span>
                <span>{info.label}</span>
                {stepKey === 'diagnostico' && diagnosticoPendencias.length > 0 && (
                  <span className="bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[9px] font-bold">
                    {diagnosticoPendencias.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Ficha N0 (Entrada Rápida) */}
        {activeSubTab === 'geral' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Ficha de Oportunidade (Nível N0)
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Preenchível em até 10 minutos. Nenhuma métrica quantitativa é obrigatória para registrar a dor.
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                Ponto de Partida Legítimo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Nome do Processo *</span>
                  <Tooltip content="Título claro e descritivo da rotina operacional a ser automatizada." />
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomeProcesso || ''}
                  onChange={(e) => handleChange('nomeProcesso', e.target.value)}
                  placeholder="Ex: Conciliação de Arrecadação NFS-e"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Área / Diretoria Solicitante *</span>
                  <Tooltip content="Departamento corporativo proprietário do processo de negócio." />
                </label>
                <select
                  required
                  value={formData.area || ''}
                  onChange={(e) => handleChange('area', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="">Selecione a área corporativa...</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.nome}>
                      {a.sigla ? `[${a.sigla}] ` : ''}{a.nome}
                    </option>
                  ))}
                  {formData.area && !areas.some((a) => a.nome === formData.area) && (
                    <option value={formData.area}>{formData.area} (Informada)</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                <span>Descrição da Dor / Sintomas Operacionais (N0)</span>
                <Tooltip content="Descreva os gargalos, retrabalhos, atrasos ou dificuldades enfrentadas pela equipe hoje." />
              </label>
              <textarea
                rows={3}
                value={formData.sintomasDor || formData.descricaoProcesso || ''}
                onChange={(e) => {
                  handleChange('sintomasDor', e.target.value);
                  if (!formData.descricaoProcesso) handleChange('descricaoProcesso', e.target.value);
                }}
                placeholder="Descreva qualitativamente a dor enfrentada pela área..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Criticidade Percebida</span>
                  <Tooltip content="Gravidade do impacto da dor no dia a dia da equipe." />
                </label>
                <select
                  value={formData.criticidadePercebida || 'Média'}
                  onChange={(e) => handleChange('criticidadePercebida', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Recorrência da Dor</span>
                  <Tooltip content="Com que frequência o problema se manifesta." />
                </label>
                <select
                  value={formData.recorrenciaDor || 'Frequente'}
                  onChange={(e) => handleChange('recorrenciaDor', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Diária">Diária</option>
                  <option value="Frequente">Frequente (Semanal/Quinzenal)</option>
                  <option value="Ocasional">Ocasional (Mensal)</option>
                  <option value="Rara">Rara / Sob Demanda</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Situação do Ciclo de Vida</span>
                  <Tooltip content="Estágio atual no funil do Centro de Excelência." />
                </label>
                <select
                  value={formData.situacao || 'Em levantamento'}
                  onChange={(e) => handleChange('situacao', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Em levantamento">Em levantamento</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Em implantação">Em implantação</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Descartado">Descartado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Sistemas Envolvidos</span>
                  <Tooltip content="Softwares manipulados (ex: SAP, SIAFI, Excel, SEFAZ, Portal Web)." />
                </label>
                <input
                  type="text"
                  value={formData.sistemasEnvolvidos || ''}
                  onChange={(e) => handleChange('sistemasEnvolvidos', e.target.value)}
                  placeholder="Ex: SAP, SIAFI, Portal Gov, Excel"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Papéis / Participantes Entrevistados</span>
                  <Tooltip content="Nomes e cargos das pessoas envolvidas na descoberta." />
                </label>
                <input
                  type="text"
                  value={formData.participantes || ''}
                  onChange={(e) => handleChange('participantes', e.target.value)}
                  placeholder="Ex: Ana Lima (Analista), Carlos Souza (Coordenador)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AS IS & 7 Arquétipos de Benefício */}
        {activeSubTab === 'arquetipos' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Classificação por Arquétipo de Processo (A1 a A7)
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Cada arquétipo define a fórmula de benefício em R$. Selecione o arquétipo primário que melhor representa o ganho principal da automação.
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                Arquétipo {formData.arquetipoPrimario}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Arquétipo Primário *</span>
                  <Tooltip content="Principal alavanca de geração de valor financeiro da demanda." />
                </label>
                <select
                  value={formData.arquetipoPrimario || 'A1'}
                  onChange={(e) => handleChange('arquetipoPrimario', e.target.value as ArquetipoTipo)}
                  className="w-full text-xs px-3 py-2 border border-[#1351b4] bg-white rounded font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="A1">A1 — Processo Transacional Repetitivo (Horas de Trabalho Liberadas)</option>
                  <option value="A2">A2 — Erro e Retrabalho (Redução de Custos de Correção e Perdas)</option>
                  <option value="A3">A3 — Atendimento e Autosserviço (Menor Custo por Contato / SAC)</option>
                  <option value="A4">A4 — Conformidade e Risco Contratual (Mitigação de Multas e Glosas)</option>
                  <option value="A5">A5 — Gargalo e Ciclo de Receita (Menor Lead Time / Antecipação de Faturamento)</option>
                  <option value="A6">A6 — Racionalização de Ativos Técnicos (Consolidação de Soluções / Menos Manutenção)</option>
                  <option value="A7">A7 — Processo Comercial e Oportunidade (Receita Adicional / Propostas Comerciais)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Arquétipos Secundários (Opcional)</span>
                  <Tooltip content="Arquétipos secundários cujos ganhos somam-se sem sobreposição (ex: A2, A4)." />
                </label>
                <input
                  type="text"
                  value={formData.arquetiposSecundarios || ''}
                  onChange={(e) => handleChange('arquetiposSecundarios', e.target.value)}
                  placeholder="Ex: A2, A4"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>

            {/* Variáveis Dinâmicas do Arquétipo Primário Selecionado */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                Variáveis Quantitativas do Arquétipo Primário ({formData.arquetipoPrimario})
              </span>

              {/* A1 */}
              {formData.arquetipoPrimario === 'A1' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Tempo Médio Manual (HH/mês)</span>
                      <Tooltip content="Horas humanas gastas por mês executando a tarefa." />
                    </label>
                    <input
                      type="number"
                      value={formData.tempoExecucao ?? 80}
                      onChange={(e) => handleChange('tempoExecucao', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Custo Hora do Executor (R$/h)</span>
                      <Tooltip content="Custo da mão de obra por hora." />
                    </label>
                    <input
                      type="number"
                      value={formData.valorHoraExecutor ?? 45}
                      onChange={(e) => handleChange('valorHoraExecutor', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>% Automatizável (0% a 100%)</span>
                      <Tooltip content="Percentual do processo absorvido pela automação (ex: 100 para 100%, 80 para 80%)." />
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={formData.percAutomatizavel ?? 100}
                      onChange={(e) => handleChange('percAutomatizavel', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {/* A2 */}
              {formData.arquetipoPrimario === 'A2' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Volume Mensal (Transações)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.numExecucoes ?? 100}
                      onChange={(e) => handleChange('numExecucoes', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Taxa de Erro Atual (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ex: 0.10 para 10%"
                      value={formData.taxaErroAtual ?? 0.05}
                      onChange={(e) => handleChange('taxaErroAtual', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Custo Médio por Erro (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.custoMedioErro ?? 50}
                      onChange={(e) => handleChange('custoMedioErro', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Redução Esperada do Erro (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={formData.reducaoEsperadaErro ?? 0.8}
                      onChange={(e) => handleChange('reducaoEsperadaErro', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {/* A3 */}
              {formData.arquetipoPrimario === 'A3' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Volume de Contatos/Mês</span>
                    </label>
                    <input
                      type="number"
                      value={formData.volumeContatosMensal ?? 1000}
                      onChange={(e) => handleChange('volumeContatosMensal', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Custo Atendimento Humano (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.custoAtendimentoHumano ?? 15}
                      onChange={(e) => handleChange('custoAtendimentoHumano', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Taxa de Contenção (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={formData.taxaContencaoEsperada ?? 0.6}
                      onChange={(e) => handleChange('taxaContencaoEsperada', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Custo Atendimento Auto (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.custoAtendimentoAuto ?? 1.5}
                      onChange={(e) => handleChange('custoAtendimentoAuto', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {/* A4 */}
              {formData.arquetipoPrimario === 'A4' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Impacto Financeiro Multa/Glosa (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.impactoFinanceiroOcorrencia ?? 50000}
                      onChange={(e) => handleChange('impactoFinanceiroOcorrencia', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Probabilidade Anual Ocorrência (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={formData.probabilidadeDescumprimento ?? 0.2}
                      onChange={(e) => handleChange('probabilidadeDescumprimento', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Redução de Risco Esperada (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={formData.reducaoProbabilidadeRisco ?? 0.9}
                      onChange={(e) => handleChange('reducaoProbabilidadeRisco', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {/* A5, A6, A7 complementares */}
              {formData.arquetipoPrimario === 'A5' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Volume Adicional Viabilizado/Mês</span>
                    </label>
                    <input
                      type="number"
                      value={formData.volumeAdicionalViabilizado ?? 50}
                      onChange={(e) => handleChange('volumeAdicionalViabilizado', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Ticket Médio de Receita (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.ticketMedioReceita ?? 200}
                      onChange={(e) => handleChange('ticketMedioReceita', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Dias Antecipação Faturamento</span>
                    </label>
                    <input
                      type="number"
                      value={formData.diasAntecipacaoFaturamento ?? 5}
                      onChange={(e) => handleChange('diasAntecipacaoFaturamento', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {formData.arquetipoPrimario === 'A6' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Nº Ativos Técnicos Antes</span>
                    </label>
                    <input
                      type="number"
                      value={formData.nrAtivosAntes ?? 8}
                      onChange={(e) => handleChange('nrAtivosAntes', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Nº Ativos Técnicos Depois</span>
                    </label>
                    <input
                      type="number"
                      value={formData.nrAtivosDepois ?? 1}
                      onChange={(e) => handleChange('nrAtivosDepois', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Custo Manutenção Anual por Ativo (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.custoManutencaoAnualAtivo ?? 12000}
                      onChange={(e) => handleChange('custoManutencaoAnualAtivo', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {formData.arquetipoPrimario === 'A7' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Solicitações Comerciais/Mês</span>
                    </label>
                    <input
                      type="number"
                      value={formData.numSolicitacoesComerciaisMes ?? 30}
                      onChange={(e) => handleChange('numSolicitacoesComerciaisMes', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Taxa Conversão Alvo (%)</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={formData.taxaConversaoAlvo ?? 0.35}
                      onChange={(e) => handleChange('taxaConversaoAlvo', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                      <span>Ticket Médio Proposta (R$)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.ticketMedioProposta ?? 15000}
                      onChange={(e) => handleChange('ticketMedioProposta', Number(e.target.value))}
                      className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Trilha, Reuso & Escala */}
        {activeSubTab === 'trilha' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Atribuição por Trilha de Solução (Seção 5.3) & Fator de Reuso (Seção 5.4)
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Demandas reais combinam melhorias de processo, evolução de sistemas e automação. O business case reivindica a parcela que lhe cabe.
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                Trilha & Escala
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                  <span>Trilha Automação (%)</span>
                  <Tooltip content="Fração do benefício conquistada pela solução de automação." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={formData.percTrilhaAutomacao ?? 1.0}
                  onChange={(e) => handleChange('percTrilhaAutomacao', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-blue-400 bg-blue-50/50 rounded font-bold text-blue-900"
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                  <span>Trilha Padronização (%)</span>
                  <Tooltip content="Ganho obtido antes da automação via redesenho/simplificação." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={formData.percTrilhaProcesso ?? 0}
                  onChange={(e) => handleChange('percTrilhaProcesso', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                  <span>Trilha Evolução Sistema (%)</span>
                  <Tooltip content="Ganho atribuível a novas APIs ou correções no sistema legado." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={formData.percTrilhaSistema ?? 0}
                  onChange={(e) => handleChange('percTrilhaSistema', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-xs">
                Fator de Reuso e Escala (Seção 5.4)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                    <span>Unidades no Piloto</span>
                    <Tooltip content="Ex: 1 município / 1 cliente inicial." />
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.unidadesPiloto ?? 1}
                    onChange={(e) => handleChange('unidadesPiloto', Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                    <span>Unidades Potenciais</span>
                    <Tooltip content="Total de unidades/clientes que poderão reutilizar a automação." />
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.unidadesPotenciais ?? 1}
                    onChange={(e) => handleChange('unidadesPotenciais', Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[34px] leading-tight text-xs">
                    <span>Custo Marginal Replicação (R$)</span>
                    <Tooltip content="Custo adicional para habilitar cada nova unidade." />
                  </label>
                  <input
                    type="number"
                    value={formData.custoMarginalReplicacao ?? 0}
                    onChange={(e) => handleChange('custoMarginalReplicacao', Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Matriz de 12 Critérios */}
        {activeSubTab === 'beneficios' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Matriz de Avaliação Multicritério (12 Critérios Corporativos)
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Classifique o grau de impacto de cada benefício estratégico corporativo para o negócio.
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                12 Critérios Corporativos
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">1. Eficiência & Otimização Operacional</span>
              {renderRadioBeneficio('benLiberarPessoas', '1. Liberar Capacidade Humana / Realocação', 'Redirecionamento de tempo para atividades de inteligência.', 'Foco na produtividade sem corte de pessoal.')}
              {renderRadioBeneficio('benReduzirCusto', '2. Reduzir Custos Operacionais', 'Economia orçamentária direta decorrente da automação.', 'Redução de despesas operacionais.')}
              {renderRadioBeneficio('benReduzirErros', '3. Redução de Erros Operacionais', 'Eliminação de falhas humanas na digitação e validação.', 'Garante precisão matemática e conformidade.')}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">2. Governança, Risco & Compliance</span>
              {renderRadioBeneficio('benSegurancaPrivacidade', '4. Segurança da Informação & Privacidade (LGPD)', 'Proteção contra vazamento de dados e sigilo.', 'Execução segura em background.')}
              {renderRadioBeneficio('benRastreabilidadeCompliance', '5. Rastreabilidade & Conformidade (Compliance)', 'Trilha de auditoria digital e evidências imutáveis.', 'Facilita auditorias e prestação de contas.')}
              {renderRadioBeneficio('benKeyPersonRisk', '6. Mitigação de Key-Person Risk (Pessoa-Chave)', 'Eliminação de gargalos decorrentes de conhecimento tácito.', 'Garante continuidade operacional.')}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">3. Qualidade, Atendimento & SLA</span>
              {renderRadioBeneficio('benMelhorarExpCliente', '7. Experiência do Cliente / Usuário', 'Aumento da satisfação e agilidade percebida.', 'Respostas instantâneas.')}
              {renderRadioBeneficio('benAumentarCapacidade', '8. Capacidade & Escalabilidade Operacional', 'Absorção de aumentos de volume e picos sazonais.', 'Escalabilidade sem novas contratações.')}
              {renderRadioBeneficio('benReduzirTempoResposta', '9. Reduzir Tempo de Resposta (SLA)', 'Diminuição do tempo entre a solicitação e a entrega.', 'Melhora nos indicadores de nível de serviço.')}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">4. Estratégia & Sustentabilidade</span>
              {renderRadioBeneficio('benInteroperabilidade', '10. Interoperabilidade entre Sistemas', 'Integração ágil e não invasiva entre múltiplos softwares.', 'Conecta ecossistemas heterogêneos.')}
              {renderRadioBeneficio('benTransformacaoDigital', '11. Transformação Digital & Inovação', 'Modernização de rotinas e cultura de automação.', 'Acelera a maturidade digital.')}
              {renderRadioBeneficio('benSustentabilidadeEsg', '12. Sustentabilidade Operacional (ESG)', 'Desmaterialização de documentos e eliminação de papel.', 'Suporte às diretrizes ESG.')}
            </div>
          </div>
        )}

        {/* Tab 6: Solução TO BE & Turnos */}
        {activeSubTab === 'tobe' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Solução Técnica TO BE, Turnos e Esforço de Setup
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Dimensione a plataforma tecnológica, horas de execução nos 3 turnos e o investimento de engenharia.
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                TO BE & Engenharia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Plataforma Tecnológica da Solução</span>
                  <Tooltip content="Tecnologia ou orquestrador utilizado para construir a automação." />
                </label>
                <select
                  value={formData.perfilPlataformaId || ''}
                  onChange={(e) => handlePlataformaChange(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-blue-300 bg-blue-50/50 rounded focus:border-[#1351b4] focus:outline-none font-bold text-slate-900 cursor-pointer"
                >
                  {perfis.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.isPadrao ? '⭐ ' : ''}{p.nome} ({p.categoria})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight">
                  <span>Complexidade Técnica Estimada</span>
                  <Tooltip content="Grau de dificuldade técnica de implementação." />
                </label>
                <select
                  value={formData.complexidade || 'Média'}
                  onChange={(e) => handleChange('complexidade', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white font-medium cursor-pointer"
                >
                  <option value="Baixa">Baixa (Rotinas simples e fluxos estáveis)</option>
                  <option value="Média">Média (Integração com 2 a 3 sistemas ou regras condicionais)</option>
                  <option value="Alta">Alta (Sistemas legados desktop complexos ou OCR/IA)</option>
                </select>
              </div>
            </div>

            {/* Bloco de Engenharia de Desenvolvimento & Setup */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <i className="fas fa-code-branch text-[#1351b4]"></i>
                <span>Engenharia de Desenvolvimento & Setup da Solução</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Perfil do Desenvolvedor</span>
                    <Tooltip content="Nível técnico do profissional para o desenvolvimento da automação. Cada perfil possui valor de hora técnica correspondente ao seu salário/encargos cadastrados nos parâmetros." />
                  </label>
                  <select
                    value={formData.perfilDesenvolvedor || 'Desenvolvedor II'}
                    onChange={(e) => handleChange('perfilDesenvolvedor', e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-blue-400 bg-blue-50/50 rounded font-bold text-blue-900 focus:border-[#1351b4] focus:outline-none cursor-pointer"
                  >
                    <option value="Desenvolvedor I">Desenvolvedor I (Júnior)</option>
                    <option value="Desenvolvedor II">Desenvolvedor II (Pleno - Padrão)</option>
                    <option value="Desenvolvedor III">Desenvolvedor III (Sênior)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Esforço de Implementação (Semanas)</span>
                    <Tooltip content="Tempo total estimado em semanas (40h/semana) para desenvolver, testar e homologar a automação." />
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.esforcoSetupSemanas ?? 2}
                    onChange={(e) => handleChange('esforcoSetupSemanas', Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded font-semibold bg-white focus:border-[#1351b4] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bloco de Horas de Automação nos Turnos */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <i className="fas fa-clock text-[#1351b4]"></i>
                <span>Alocação de Horas em Múltiplos Turnos (Dimensionamento da Execução da Automação)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-medium text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Diurno (08h-18h)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.horasRoboDiurno ?? 0}
                    onChange={(e) => handleChange('horasRoboDiurno', Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-medium text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Noturno (18h-08h)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.horasRoboNoturno ?? 0}
                    onChange={(e) => handleChange('horasRoboNoturno', Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-medium text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Fim de Semana</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.horasRoboFimDeSemana ?? 0}
                    onChange={(e) => handleChange('horasRoboFimDeSemana', Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-xs">
                Sustentação Operacional & Apoio Contínuo (h/mês)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-medium text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Horas Mensais de Manutenção / NOC</span>
                    <Tooltip content="Horas mensais estimadas de suporte técnico e sustentação preventiva/corretiva da automação pela equipe de sustentação/NOC." />
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.horasManutencao ?? 4}
                    onChange={(e) => handleChange('horasManutencao', Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-end font-medium text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                    <span>Horas Mensais de Apoio do Negócio</span>
                    <Tooltip content="Horas mensais dedicadas pela equipe de negócio para acompanhamento, tratamento de exceções e apoio operacional contínuo." />
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.horasApoioNegocio ?? 4}
                    onChange={(e) => handleChange('horasApoioNegocio', Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Diagnóstico de Instrumentação & Prontidão (RF04) */}
        {activeSubTab === 'diagnostico' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Diagnóstico de Instrumentação, Fontes de Dados & Prontidão (RF04)
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Checklist de prontidão para promoção da oportunidade no funil de maturidade (N0 → N1 → N2).
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                Maturidade: {calcPreview?.nivelMaturidade}
              </span>
            </div>

            {diagnosticoPendencias.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-center text-emerald-900">
                <i className="fas fa-check-circle text-lg text-emerald-600 mb-1"></i>
                <div className="font-bold">Todas as variáveis essenciais estão preenchidas!</div>
                <div className="text-[11px]">Esta oportunidade já dispõe de todos os insumos para um Business Case Nível N2 e priorização.</div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {diagnosticoPendencias.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                        <i className="fas fa-search text-amber-500 mr-1"></i>
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.impactoParaPromocao}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 pl-4 border-l-2 border-blue-400">
                      <strong>Onde encontrar:</strong> {item.ondeEncontrar}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: N3 Realizado */}
        {activeSubTab === 'realizado' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#1351b4] text-white p-3.5 rounded-lg shadow-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-white block text-xs">
                  Ciclo de Benefício Realizado (Nível N3)
                </span>
                <span className="text-[11px] text-blue-100 block mt-0.5">
                  Para processos entregues e em operação. Permite confrontar a economia projetada com o resultado real apurado em produção para calibrar benchmarks.
                </span>
              </div>
              <span className="bg-white text-[#0c326f] text-[10px] font-bold px-2.5 py-1 rounded shadow-xs whitespace-nowrap">
                N3 — Realizado
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="isRetrospectivo"
                  checked={formData.isRetrospectivo || false}
                  onChange={(e) => handleChange('isRetrospectivo', e.target.checked)}
                  className="h-4 w-4 text-[#1351b4] rounded border-slate-300 cursor-pointer"
                />
                <label htmlFor="isRetrospectivo" className="font-semibold text-slate-800 cursor-pointer">
                  Demanda Cadastrada em Modo Retrospectivo (Legado Já em Operação)
                </label>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                  <span>Data da Apuração Realizada</span>
                </label>
                <input
                  type="date"
                  value={formData.dataApuracaoRealizado || ''}
                  onChange={(e) => handleChange('dataApuracaoRealizado', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                  <span>Benefício Realizado Anual (R$)</span>
                </label>
                <input
                  type="number"
                  value={formData.beneficioRealizadoAnual ?? 0}
                  onChange={(e) => handleChange('beneficioRealizadoAnual', Number(e.target.value))}
                  placeholder="Ex: 120000"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-end font-semibold text-slate-700 mb-1 min-h-[30px] leading-tight text-xs">
                  <span>Desvio vs Projetado (%)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.desvioProjetadoRealizadoPerc ?? 0}
                  onChange={(e) => handleChange('desvioProjetadoRealizadoPerc', Number(e.target.value))}
                  placeholder="Ex: -0.05 para -5%"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notas de Auditoria & Lições Aprendidas</label>
              <textarea
                rows={2}
                value={formData.notasRealizado || ''}
                onChange={(e) => handleChange('notasRealizado', e.target.value)}
                placeholder="Registre os fatores que explicaram a aderência ou desvio do benefício..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}

        {/* Rodapé com Navegação Wizard & Ações GOVBR DS */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center space-x-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer transition-colors flex items-center space-x-1.5"
              >
                <i className="fas fa-chevron-left text-[10px]"></i>
                <span>Anterior</span>
              </button>
            )}

            {currentStepIndex < stepOrder.length - 1 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1351b4] hover:bg-[#0c326f] rounded shadow-xs cursor-pointer transition-all flex items-center space-x-1.5"
              >
                <span>Próximo Passo</span>
                <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
            )}

            {/* Salvar visível no último passo ou se estiver em modo de edição */}
            {(currentStepIndex === stepOrder.length - 1 || formData.id) && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2 text-xs font-bold text-white rounded shadow-sm hover:shadow cursor-pointer transition-all flex items-center space-x-2 ${
                  currentStepIndex === stepOrder.length - 1
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#1351b4] hover:bg-[#0c326f]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    <span>{formData.id ? 'Salvar Alterações' : 'Concluir & Cadastrar'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
