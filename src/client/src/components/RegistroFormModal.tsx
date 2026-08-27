import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { Registro, Parametro, BeneficioNivel, PerfilPlataforma } from '../types';
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
  const [formData, setFormData] = useState<Partial<Registro>>({
    idOrigem: '',
    idAnalise: '',
    area: '',
    nomeProcesso: '',
    dataLevantamento: new Date().toISOString().split('T')[0],
    participantes: '',
    situacao: 'Em levantamento',
    areasEnvolvidas: '',
    descricaoProcesso: '',
    numExecucoes: 100,
    periodicidade: 'Mensal',
    numPessoasEnvolvidas: 1,
    tipoAlocacao: 'Parcial',
    perfilExecutor: 'Analista',
    valorHoraExecutor: 45,
    tempoExecucao: 80,
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
    reducaoTempoPrevista: '80%',
    complexidade: 'Média',
    reducaoCustoPrevista: '70%',
    numRotinas: 1,
    turno: 'Diurno',
    recomendacao: 'Recomendado',

    esforcoSetupSemanas: 2,
    horasRoboDiurno: 40,
    horasRoboNoturno: 20,
    horasRoboFimDeSemana: 0,
    horasRobo: 60,
    horasApoioNegocio: 4,
    horasManutencao: 4,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'asis' | 'beneficios' | 'tobe'>('geral');

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const list = await api.getPerfisPlataforma();
        setPerfis(list);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) {
      fetchPerfis();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        horasRoboDiurno: initialData.horasRoboDiurno ?? (initialData.turno === 'Noturno' ? 0 : initialData.horasRobo || 0),
        horasRoboNoturno: initialData.horasRoboNoturno ?? (initialData.turno === 'Noturno' ? initialData.horasRobo || 0 : 0),
        horasRoboFimDeSemana: initialData.horasRoboFimDeSemana ?? (initialData.turno === 'Final de Semana' ? initialData.horasRobo || 0 : 0),
      });
    } else {
      const padrao = perfis.find((p) => p.isPadrao) || perfis[0];
      setFormData({
        idOrigem: '',
        idAnalise: '',
        area: '',
        nomeProcesso: '',
        dataLevantamento: new Date().toISOString().split('T')[0],
        participantes: '',
        situacao: 'Em levantamento',
        areasEnvolvidas: '',
        descricaoProcesso: '',
        numExecucoes: 100,
        periodicidade: 'Mensal',
        numPessoasEnvolvidas: 1,
        tipoAlocacao: 'Parcial',
        perfilExecutor: 'Analista',
        valorHoraExecutor: 45,
        tempoExecucao: 80,
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
        tipoPlataformaNome: padrao?.nome || 'Python & Robot Framework (Open Source)',
        descricaoSolucao: '',
        pontosAtencao: '',
        reducaoTempoPrevista: '80%',
        complexidade: 'Média',
        reducaoCustoPrevista: '70%',
        numRotinas: 1,
        turno: 'Diurno',
        recomendacao: 'Recomendado',
        esforcoSetupSemanas: 2,
        horasRoboDiurno: 40,
        horasRoboNoturno: 20,
        horasRoboFimDeSemana: 0,
        horasRobo: 60,
        horasApoioNegocio: 4,
        horasManutencao: 4,
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

  // Cálculo de pré-visualização em tempo real com suporte a Perfil de Plataforma e Múltiplos Turnos
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

    // Pontuação de Benefícios (12 Critérios Corporativos)
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

    // Custo da Plataforma e Taxas por Turno
    const selectedPerfil = perfis.find((p) => p.id === formData.perfilPlataformaId);
    const servidor = selectedPerfil?.custoServidor !== undefined ? selectedPerfil.custoServidor : parametro.servidor;
    const nrRobos = selectedPerfil?.nrRobosDiluicao || parametro.nrRobos || 1;
    const licenca = selectedPerfil?.custoLicencaMensal !== undefined ? selectedPerfil.custoLicencaMensal : parametro.licencaRobo;
    const estacao = selectedPerfil?.custoEstacaoTrabalho !== undefined ? selectedPerfil.custoEstacaoTrabalho : parametro.estacaoTrabalhoRobo;

    const baseCusto = servidor / nrRobos + (licenca + estacao) + parametro.operadorSalaControle / nrRobos;

    const taxaDiurna = (baseCusto * parametro.percDiurno) / 21 / 10;
    const taxaNoturna = (baseCusto * parametro.percNoturno) / 21 / 14;
    const taxaFimSemana = (baseCusto * parametro.percFimDeSemana) / 8 / 24;

    const horasDiurno = Number(formData.horasRoboDiurno) || 0;
    const horasNoturno = Number(formData.horasRoboNoturno) || 0;
    const horasFimSemana = Number(formData.horasRoboFimDeSemana) || 0;

    const custoHorasRoboDiurno = horasDiurno * taxaDiurna;
    const custoHorasRoboNoturno = horasNoturno * taxaNoturna;
    const custoHorasRoboFimSemana = horasFimSemana * taxaFimSemana;
    const custoHorasRobo = custoHorasRoboDiurno + custoHorasRoboNoturno + custoHorasRoboFimSemana;
    const totalHorasRobo = horasDiurno + horasNoturno + horasFimSemana;

    const esforcoSetupSemanas = Number(formData.esforcoSetupSemanas) || 0;
    const investimentoSetup = esforcoSetupSemanas * ((parametro.custoHoraDesenvolvimento * 40) / 12);
    const horasApoio = Number(formData.horasApoioNegocio) || 0;
    const custoHorasNegocio = horasApoio * valorHoraExecutor;
    const horasManutencao = Number(formData.horasManutencao) || 0;
    const custoHoraManutencao = (parametro.operadorSalaControle * 1.6) / 168;
    const custoManutencao = horasManutencao * custoHoraManutencao;

    const custoMensalAno1 = investimentoSetup + custoHorasRobo + custoHorasNegocio + custoManutencao;
    const custoMensalAno2 = custoHorasRobo + custoHorasNegocio + custoManutencao;

    const custoAnualAno1 = custoMensalAno1 * 12;
    const custoAnualAno2 = custoMensalAno2 * 12;

    const roiAno1 = custoMensalAtual * 12 - custoAnualAno1;
    const roiAno2 = custoMensalAtual * 12 - custoAnualAno2;

    const paybackMeses = custoMensalAtual > 0 && custoAnualAno1 > 0 ? Number((custoAnualAno1 / custoMensalAtual).toFixed(1)) : 0;

    return {
      custoMensalAtual,
      fteLiberado,
      pontuacaoBeneficios,
      investimentoSetup,
      taxaDiurna,
      taxaNoturna,
      taxaFimSemana,
      horasDiurno,
      horasNoturno,
      horasFimSemana,
      totalHorasRobo,
      custoHorasRoboDiurno,
      custoHorasRoboNoturno,
      custoHorasRoboFimSemana,
      custoHorasRobo,
      custoMensalAno1,
      custoMensalAno2,
      roiAno1,
      roiAno2,
      paybackMeses,
    };
  }, [formData, parametro, perfis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeProcesso || formData.nomeProcesso.trim() === '') {
      notify.warning('Campo Obrigatório', 'Por favor, informe o Nome do Processo.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (onSave) {
        await onSave(formData);
      } else {
        if (initialData) {
          await api.updateRegistro(initialData.id, formData);
        } else {
          await api.createRegistro(formData);
        }
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      notify.error('Erro ao Salvar', err.message || 'Erro ao salvar oportunidade.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderRadioBeneficio = (
    field: keyof Registro,
    label: string,
    descricao: string,
    tooltipText?: string
  ) => {
    const value = formData[field] || 'nenhum';
    const options: { val: BeneficioNivel; label: string; desc: string; color: string }[] = [
      { val: 'principal', label: 'Principal (100%)', desc: 'Objetivo central', color: 'bg-green-50 text-green-900 border-green-400' },
      { val: 'bastante', label: 'Bastante (50%)', desc: 'Impacto forte', color: 'bg-blue-50 text-[#1351b4] border-blue-400' },
      { val: 'pouco', label: 'Pouco (25%)', desc: 'Secundário', color: 'bg-amber-50 text-amber-900 border-amber-400' },
      { val: 'nenhum', label: 'Nenhum (0%)', desc: 'Sem impacto', color: 'bg-slate-50 text-slate-600 border-slate-200' },
    ];

    return (
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <div>
            <span className="font-bold text-xs text-slate-800 flex items-center">
              {label}
              {tooltipText && <Tooltip content={tooltipText} />}
            </span>
            <p className="text-[11px] text-slate-500 m-0">{descricao}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {options.map((opt) => (
            <label
              key={opt.val}
              className={`flex items-center space-x-2 p-2 rounded border text-xs cursor-pointer transition-colors ${
                value === opt.val
                  ? `${opt.color} font-bold shadow-xs border-2`
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name={field as string}
                value={opt.val}
                checked={value === opt.val}
                onChange={() => handleChange(field, opt.val)}
                className="text-[#1351b4] focus:ring-[#1351b4] h-3.5 w-3.5 cursor-pointer"
              />
              <span className="text-[11px] leading-tight">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Editar Oportunidade: ${formData.idAnalise || 'Processo'}` : 'Cadastrar Nova Oportunidade de Automação'}
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Navigation Tabs (Estilo br-tab) */}
        <div className="flex border-b border-slate-200 space-x-1 pb-1 text-xs">
          {[
            { id: 'geral', label: '1. Identificação Geral', icon: 'fa-id-card' },
            { id: 'asis', label: '2. Diagnóstico AS IS', icon: 'fa-file-alt' },
            { id: 'beneficios', label: '3. Matriz de Benefícios', icon: 'fa-award' },
            { id: 'tobe', label: '4. Solução TO BE & Multi-Turnos', icon: 'fa-robot' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 font-bold rounded transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-[#1351b4] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <i className={`fas ${tab.icon} text-xs mr-1`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Calculation Live Banner (GovBR Navy) */}
        {calcPreview && (
          <div className="bg-[#0c326f] p-4 rounded-lg text-white border border-[#1351b4] shadow-sm">
            <div className="flex items-center justify-between border-b border-blue-400/30 pb-2 mb-3">
              <span className="text-xs font-bold text-blue-200 flex items-center space-x-1.5">
                <i className="fas fa-calculator mr-1"></i>
                <span>Simulação Instantânea de Retorno & Viabilidade</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-100 border border-blue-400">
                Score de Benefícios: {calcPreview.pontuacaoBeneficios.toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Custo Atual (AS IS)</span>
                <span className="font-bold text-white text-sm">
                  R$ {calcPreview.custoMensalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">FTE Liberável</span>
                <span className="font-bold text-green-300 text-sm">{calcPreview.fteLiberado} FTE</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Custo TO BE (Ano 1)</span>
                <span className="font-bold text-amber-300 text-sm">
                  R$ {calcPreview.custoMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">ROI Líquido (Ano 1)</span>
                <span className="font-bold text-green-300 text-sm">
                  R$ {calcPreview.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-blue-200 block font-medium">Payback Estimado</span>
                <span className="font-bold text-cyan-300 text-sm">{calcPreview.paybackMeses} meses</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Identificação Geral */}
        {activeSubTab === 'geral' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Processo *
                  <Tooltip content="Título claro e descritivo da atividade de negócio a ser automatizada." />
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomeProcesso || ''}
                  onChange={(e) => handleChange('nomeProcesso', e.target.value)}
                  placeholder="Ex: Conciliação Bancária de Arrecadação"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Área / Diretoria *
                  <Tooltip content="Departamento ou gerência proprietária da regra de negócio do processo." />
                </label>
                <input
                  type="text"
                  value={formData.area || ''}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="Ex: Contabilidade, Financeiro, Gestão de Pessoas"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ID Origem (Opcional)
                  <Tooltip content="Código ou número de chamado em ferramenta externa (Jira, ServiceNow, Demanda interna)." />
                </label>
                <input
                  type="text"
                  value={formData.idOrigem || ''}
                  onChange={(e) => handleChange('idOrigem', e.target.value)}
                  placeholder="Ex: DEM-2026-089"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Situação da Oportunidade
                  <Tooltip content="Estágio atual no funil de esteira de automação do Centro de Excelência." />
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
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data do Levantamento
                  <Tooltip content="Data em que as entrevistas e mapeamento da rotina foram iniciados." />
                </label>
                <input
                  type="date"
                  value={formData.dataLevantamento || ''}
                  onChange={(e) => handleChange('dataLevantamento', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Participantes & Entrevistados
                  <Tooltip content="Nomes dos analistas e líderes de processo que participaram da sessão de descoberta." />
                </label>
                <input
                  type="text"
                  value={formData.participantes || ''}
                  onChange={(e) => handleChange('participantes', e.target.value)}
                  placeholder="Ex: Maria Souza (Analista), João Silva (Líder)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Diagnóstico AS IS */}
        {activeSubTab === 'asis' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Descrição Detalhada do Processo AS IS
                <Tooltip content="Resumo passo a passo de como o processo é executado manualmente hoje." />
              </label>
              <textarea
                rows={2}
                value={formData.descricaoProcesso || ''}
                onChange={(e) => handleChange('descricaoProcesso', e.target.value)}
                placeholder="Descreva as etapas operacionais manuais..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Periodicidade
                  <Tooltip content="Frequência com que o processo é disparado." />
                </label>
                <select
                  value={formData.periodicidade || 'Mensal'}
                  onChange={(e) => handleChange('periodicidade', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Diária">Diária</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Sob demanda">Sob demanda</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nº de Execuções / Mês
                  <Tooltip content="Volume de transações ou vezes que a rotina é executada ao longo de um mês." />
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numExecucoes ?? 100}
                  onChange={(e) => handleChange('numExecucoes', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Perfil do Executor
                  <Tooltip content="Cargo ou qualificação média de quem opera a tarefa manual." />
                </label>
                <input
                  type="text"
                  value={formData.perfilExecutor || ''}
                  onChange={(e) => handleChange('perfilExecutor', e.target.value)}
                  placeholder="Ex: Analista Fiscal Jr"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor da Hora do Executor (R$/HH)
                  <Tooltip content="Custo da hora de mão de obra direta do profissional executor." />
                </label>
                <input
                  type="number"
                  step="5"
                  value={formData.valorHoraExecutor ?? 45}
                  onChange={(e) => handleChange('valorHoraExecutor', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tempo Total de Execução (Horas/Mês)
                  <Tooltip content="Total de horas mensais gastas somando todos os envolvidos nesta rotina." />
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.tempoExecucao ?? 80}
                  onChange={(e) => handleChange('tempoExecucao', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sistemas Envolvidos
                  <Tooltip content="Softwares, portais e ferramentas manipuladas (ex: SAP, SIAFI, Excel, SEFAZ)." />
                </label>
                <input
                  type="text"
                  value={formData.sistemasEnvolvidos || ''}
                  onChange={(e) => handleChange('sistemasEnvolvidos', e.target.value)}
                  placeholder="Ex: SAP, SIAFI, Excel"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Matriz de Benefícios (12 Critérios Corporativos) */}
        {activeSubTab === 'beneficios' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900 flex items-center justify-between">
              <span>Classifique o grau de impacto de cada benefício estratégico corporativo para o negócio.</span>
              <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200">12 Critérios Corporativos</span>
            </div>

            {/* 1. Eficiência Operacional */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">1. Eficiência & Otimização Operacional</span>
              {renderRadioBeneficio('benLiberarPessoas', '1. Liberar Capacidade Humana / Realocação', 'Redirecionamento de tempo dos profissionais para atividades de inteligência, planejamento e análises estratégicas.', 'Foco na produtividade e agregação de valor sem premissa de corte de pessoal.')}
              {renderRadioBeneficio('benReduzirCusto', '2. Reduzir Custos Operacionais', 'Economia orçamentária direta decorrente da otimização e automação da rotina manual.', 'Redução de despesas operacionais e custos com retrabalho.')}
              {renderRadioBeneficio('benReduzirErros', '3. Redução de Erros Operacionais', 'Eliminação de falhas humanas na digitação, validação de regras de negócio e retrabalho.', 'Garante precisão matemática e conformidade na execução das rotinas.')}
            </div>

            {/* 2. Governança, Risco & Compliance */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">2. Governança, Risco & Compliance</span>
              {renderRadioBeneficio('benSegurancaPrivacidade', '4. Segurança da Informação & Privacidade (LGPD)', 'Proteção contra vazamento de dados, execução em cofre de credenciais e sigilo.', 'Execução segura em background sem contato humano desnecessário com dados confidenciais.')}
              {renderRadioBeneficio('benRastreabilidadeCompliance', '5. Rastreabilidade & Conformidade (Compliance)', 'Trilha de auditoria digital completa, carimbos de tempo, evidências imutáveis e compliance.', 'Facilita auditorias externas/internas e prestação de contas com logs estruturados.')}
              {renderRadioBeneficio('benKeyPersonRisk', '6. Mitigação de Key-Person Risk (Pessoa-Chave)', 'Eliminação de gargalos decorrentes de conhecimento tácito concentrado em pessoas-chave.', 'Garante resiliência e continuidade operacional independente de ausências ou rotatividade.')}
            </div>

            {/* 3. Qualidade, Atendimento & SLA */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">3. Qualidade, Atendimento & SLA</span>
              {renderRadioBeneficio('benMelhorarExpCliente', '7. Experiência do Cliente / Usuário', 'Aumento da satisfação, padronização e agilidade percebida pelo usuário final do serviço.', 'Respostas instantâneas e maior qualidade percebida.')}
              {renderRadioBeneficio('benAumentarCapacidade', '8. Capacidade & Escalabilidade Operacional', 'Capacidade de absorver aumentos expressivos de volume e picos sazonais sem estrangulamento.', 'Escalabilidade elástica sem necessidade de novas contratações emergenciais.')}
              {renderRadioBeneficio('benReduzirTempoResposta', '9. Reduzir Tempo de Resposta (SLA)', 'Diminuição drástica do tempo decorrido entre a solicitação e a entrega final da demanda.', 'Melhora expressiva nos indicadores de nível de serviço.')}
            </div>

            {/* 4. Estratégia & Sustentabilidade */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">4. Estratégia & Sustentabilidade</span>
              {renderRadioBeneficio('benInteroperabilidade', '10. Interoperabilidade entre Sistemas', 'Integração ágil e não invasiva entre múltiplos softwares, ERPs, CRMs, portais web e bases legadas.', 'Conecta ecossistemas heterogêneos sem necessidade de APIs customizadas complexas.')}
              {renderRadioBeneficio('benTransformacaoDigital', '11. Transformação Digital & Inovação', 'Modernização de rotinas, fomento à cultura de automação e eliminação de burocracia.', 'Acelera a maturidade digital corporativa.')}
              {renderRadioBeneficio('benSustentabilidadeEsg', '12. Sustentabilidade Operacional (ESG)', 'Desmaterialização de documentos, eliminação do uso de papel e sustentabilidade corporativa.', 'Redução da pegada ecológica e suporte às diretrizes ESG.')}
            </div>
          </div>
        )}

        {/* Tab 4: Solução TO BE & Múltiplos Turnos */}
        {activeSubTab === 'tobe' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Plataforma Tecnológica da Solução
                  <Tooltip content="Tecnologia ou orquestrador que será utilizado para construir e rodar a automação." />
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Complexidade Técnica Estimada
                  <Tooltip content="Grau de dificuldade técnica de implementação da automação." />
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Descrição da Solução TO BE
                <Tooltip content="Como o robô ou fluxo de automação atuará de ponta a ponta." />
              </label>
              <textarea
                rows={2}
                value={formData.descricaoSolucao || ''}
                onChange={(e) => handleChange('descricaoSolucao', e.target.value)}
                placeholder="Descreva a arquitetura da solução automatizada..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>

            {/* Painel de Dimensionamento com Múltiplos Turnos */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <i className="fas fa-clock text-[#1351b4] mr-1"></i>
                  <span>Alocação de Horas em Múltiplos Turnos (Dimensionamento do Robô)</span>
                  <Tooltip content="Aloque as horas mensais estimadas de execução do robô em cada janela horária. O custo total é calculado com a taxa exata de cada turno." />
                </span>
                <span className="text-[11px] font-bold text-[#1351b4] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  Total: {formData.horasRobo || 0} h/mês
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Diurno */}
                <div className="bg-white p-3 rounded border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-900 flex items-center space-x-1">
                      <i className="fas fa-sun text-amber-500 mr-1"></i>
                      <span>Turno Diurno</span>
                    </span>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                      R$ {calcPreview?.taxaDiurna.toFixed(2)}/h
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mb-1.5">08h às 18h (Dias Úteis)</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.horasRoboDiurno ?? 0}
                    onChange={(e) => handleChange('horasRoboDiurno', Number(e.target.value))}
                    className="w-full text-xs font-bold px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] outline-none"
                  />
                  <span className="text-[10px] text-slate-600 block mt-1">
                    Subtotal: <strong className="text-slate-900">R$ {calcPreview?.custoHorasRoboDiurno.toFixed(2)}/mês</strong>
                  </span>
                </div>

                {/* Noturno */}
                <div className="bg-white p-3 rounded border border-blue-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-950 flex items-center space-x-1">
                      <i className="fas fa-moon text-blue-700 mr-1"></i>
                      <span>Turno Noturno</span>
                    </span>
                    <span className="text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">
                      R$ {calcPreview?.taxaNoturna.toFixed(2)}/h
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mb-1.5">18h às 08h (Madrugada)</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.horasRoboNoturno ?? 0}
                    onChange={(e) => handleChange('horasRoboNoturno', Number(e.target.value))}
                    className="w-full text-xs font-bold px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] outline-none"
                  />
                  <span className="text-[10px] text-slate-600 block mt-1">
                    Subtotal: <strong className="text-slate-900">R$ {calcPreview?.custoHorasRoboNoturno.toFixed(2)}/mês</strong>
                  </span>
                </div>

                {/* Fim de Semana */}
                <div className="bg-white p-3 rounded border border-purple-200 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-purple-950 flex items-center space-x-1">
                      <i className="fas fa-calendar-alt text-purple-600 mr-1"></i>
                      <span>Fim de Semana</span>
                    </span>
                    <span className="text-[10px] text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded font-semibold">
                      R$ {calcPreview?.taxaFimSemana.toFixed(2)}/h
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mb-1.5">Sábados e Domingos 24h</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.horasRoboFimDeSemana ?? 0}
                    onChange={(e) => handleChange('horasRoboFimDeSemana', Number(e.target.value))}
                    className="w-full text-xs font-bold px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] outline-none"
                  />
                  <span className="text-[10px] text-slate-600 block mt-1">
                    Subtotal: <strong className="text-slate-900">R$ {calcPreview?.custoHorasRoboFimSemana.toFixed(2)}/mês</strong>
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                <span className="text-slate-700 font-semibold">Custo Total de Operação do Robô (Ponderado):</span>
                <span className="font-bold text-[#1351b4] text-xs">
                  R$ {calcPreview?.custoHorasRobo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Esforço de Setup (Semanas)
                  <Tooltip content="Semanas estimadas de desenvolvimento, homologação e implantação da automação." />
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.esforcoSetupSemanas ?? 2}
                  onChange={(e) => handleChange('esforcoSetupSemanas', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Horas Apoio Negócio (HH/Mês)
                  <Tooltip content="Horas mensais gastas pela área de negócio para interações pontuais ou exceções." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.horasApoioNegocio ?? 4}
                  onChange={(e) => handleChange('horasApoioNegocio', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Horas Manutenção NOC (HH/Mês)
                  <Tooltip content="Estimativa de horas mensais de suporte do NOC para acompanhamento e sustentação do robô." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.horasManutencao ?? 4}
                  onChange={(e) => handleChange('horasManutencao', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] outline-none font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-semibold rounded text-xs transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2.5 bg-[#1351b4] hover:bg-[#0c326f] active:bg-[#0c326f] text-white font-bold rounded text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <i className="fas fa-save mr-1.5"></i>
            <span>{isSubmitting ? 'Salvando...' : initialData ? 'Salvar Oportunidade' : 'Cadastrar Oportunidade'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

