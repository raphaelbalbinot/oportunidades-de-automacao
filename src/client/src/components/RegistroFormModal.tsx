import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { Registro, Parametro, BeneficioNivel, PerfilPlataforma } from '../types';
import { Tooltip } from './Tooltip';
import { api } from '../services/api';
import { Bot, Calculator, CheckCircle2, TrendingUp, DollarSign, Clock, HelpCircle, Layers, Award } from 'lucide-react';

interface RegistroFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Registro>) => Promise<void>;
  initialData?: Registro | null;
  parametro: Parametro | null;
}

export const RegistroFormModal: React.FC<RegistroFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  parametro,
}) => {
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

    // 7 Critérios Unificados
    benLiberarPessoas: 'nenhum',
    benReduzirCusto: 'nenhum',
    benReduzirErros: 'nenhum',
    benMelhorarExpCliente: 'nenhum',
    benAumentarCapacidade: 'nenhum',
    benReduzirTempoResposta: 'nenhum',
    benTransformacaoDigital: 'nenhum',

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
      setFormData(initialData);
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
        benMelhorarExpCliente: 'nenhum',
        benAumentarCapacidade: 'nenhum',
        benReduzirTempoResposta: 'nenhum',
        benTransformacaoDigital: 'nenhum',
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
        horasRobo: 60,
        horasApoioNegocio: 4,
        horasManutencao: 4,
      });
    }
  }, [initialData, isOpen, perfis]);

  const handleChange = (field: keyof Registro, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlataformaChange = (perfilId: string) => {
    const selected = perfis.find((p) => p.id === perfilId);
    setFormData((prev) => ({
      ...prev,
      perfilPlataformaId: perfilId,
      tipoPlataformaNome: selected?.nome || '',
    }));
  };

  // Cálculo de pré-visualização em tempo real com suporte a Perfil de Plataforma
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

    // Pontuação de Benefícios Unificados
    const pFactor = (res?: string) => {
      if (res === 'principal') return 1.0;
      if (res === 'bastante') return 0.5;
      if (res === 'pouco') return 0.25;
      return 0.0;
    };

    const pMax =
      parametro.pesoLiberarPessoas +
      parametro.pesoReduzirCusto +
      parametro.pesoReduzirErros +
      parametro.pesoMelhorarExpCliente +
      parametro.pesoAumentarCapacidade +
      parametro.pesoReduzirTempoResposta +
      parametro.pesoTransformacaoDigital;

    const somaPontos =
      pFactor(formData.benLiberarPessoas) * parametro.pesoLiberarPessoas +
      pFactor(formData.benReduzirCusto) * parametro.pesoReduzirCusto +
      pFactor(formData.benReduzirErros) * parametro.pesoReduzirErros +
      pFactor(formData.benMelhorarExpCliente) * parametro.pesoMelhorarExpCliente +
      pFactor(formData.benAumentarCapacidade) * parametro.pesoAumentarCapacidade +
      pFactor(formData.benReduzirTempoResposta) * parametro.pesoReduzirTempoResposta +
      pFactor(formData.benTransformacaoDigital) * parametro.pesoTransformacaoDigital;

    const pontuacaoBeneficios = pMax > 0 ? (somaPontos / pMax) * 100 : 0;

    // Custo da Plataforma e Turno
    const selectedPerfil = perfis.find((p) => p.id === formData.perfilPlataformaId);
    const servidor = selectedPerfil?.custoServidor !== undefined ? selectedPerfil.custoServidor : parametro.servidor;
    const nrRobos = selectedPerfil?.nrRobosDiluicao || parametro.nrRobos || 1;
    const licenca = selectedPerfil?.custoLicencaMensal !== undefined ? selectedPerfil.custoLicencaMensal : parametro.licencaRobo;
    const estacao = selectedPerfil?.custoEstacaoTrabalho !== undefined ? selectedPerfil.custoEstacaoTrabalho : parametro.estacaoTrabalhoRobo;

    const baseCusto = servidor / nrRobos + (licenca + estacao) + parametro.operadorSalaControle / nrRobos;

    let custoHoraRobo = (baseCusto * parametro.percDiurno) / 21 / 10;
    if (formData.turno === 'Noturno') custoHoraRobo = (baseCusto * parametro.percNoturno) / 21 / 14;
    if (formData.turno === 'Final de Semana') custoHoraRobo = (baseCusto * parametro.percFimDeSemana) / 8 / 24;

    const esforcoSetupSemanas = Number(formData.esforcoSetupSemanas) || 0;
    const investimentoSetup = esforcoSetupSemanas * ((parametro.custoHoraDesenvolvimento * 40) / 12);
    const horasRobo = Number(formData.horasRobo) || 0;
    const custoHorasRobo = horasRobo * custoHoraRobo;
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
      custoHoraRobo,
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
      alert('Por favor, informe o Nome do Processo.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao salvar oportunidade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRadioBeneficio = (field: keyof Registro, label: string, tooltipText: string) => {
    const value = (formData[field] as string) || 'nenhum';
    return (
      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center">
            {label}
            <Tooltip content={tooltipText} />
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Impacto</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[
            { id: 'principal', label: 'Principal (100%)', color: 'peer-checked:bg-emerald-600 peer-checked:text-white' },
            { id: 'bastante', label: 'Bastante (50%)', color: 'peer-checked:bg-brand-600 peer-checked:text-white' },
            { id: 'pouco', label: 'Pouco (25%)', color: 'peer-checked:bg-amber-600 peer-checked:text-white' },
            { id: 'nenhum', label: 'Nenhum (0%)', color: 'peer-checked:bg-slate-500 peer-checked:text-white' },
          ].map((opt) => (
            <label key={opt.id} className="cursor-pointer">
              <input
                type="radio"
                name={field}
                value={opt.id}
                checked={value === opt.id}
                onChange={() => handleChange(field, opt.id)}
                className="peer sr-only"
              />
              <div
                className={`py-1.5 px-1 text-center rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold transition-all hover:bg-slate-50 text-[11px] ${opt.color}`}
              >
                {opt.label.split(' ')[0]}
              </div>
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
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-1 pb-1 text-xs">
          {[
            { id: 'geral', label: '1. Identificação Geral' },
            { id: 'asis', label: '2. Diagnóstico AS IS' },
            { id: 'beneficios', label: '3. Matriz de Benefícios' },
            { id: 'tobe', label: '4. Solução TO BE & Esforço' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 font-bold rounded-lg transition-all ${
                activeSubTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Calculation Live Banner */}
        {calcPreview && (
          <div className="bg-gradient-to-r from-slate-900 to-brand-950 p-4 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-xs font-semibold text-brand-300 flex items-center space-x-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulação Instantânea de Retorno & Viabilidade</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-500/30 text-brand-200 border border-brand-400/30">
                Score: {calcPreview.pontuacaoBeneficios.toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Custo Atual (AS IS)</span>
                <span className="font-extrabold text-white text-sm">
                  R$ {calcPreview.custoMensalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">FTE Liberável</span>
                <span className="font-extrabold text-emerald-400 text-sm">{calcPreview.fteLiberado} FTE</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Custo TO BE (Ano 1)</span>
                <span className="font-extrabold text-amber-300 text-sm">
                  R$ {calcPreview.custoMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">ROI Líquido (Ano 1)</span>
                <span className="font-extrabold text-emerald-300 text-sm">
                  R$ {calcPreview.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Payback Estimado</span>
                <span className="font-extrabold text-sky-300 text-sm">{calcPreview.paybackMeses} meses</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Identificação Geral */}
        {activeSubTab === 'geral' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nome do Processo *
                <Tooltip content="Título descritivo da rotina operacional candidata à automação." />
              </label>
              <input
                type="text"
                required
                value={formData.nomeProcesso || ''}
                onChange={(e) => handleChange('nomeProcesso', e.target.value)}
                placeholder="Ex: Conciliação Bancária de Arrecadação"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Área / Diretoria *
                <Tooltip content="Unidade de negócio proprietária do processo." />
              </label>
              <input
                type="text"
                required
                value={formData.area || ''}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="Ex: Contabilidade, Financeiro, Gestão de Pessoas"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ID Origem (Opcional)
                <Tooltip content="Código ou número de demanda em sistema legado/Jira/Redmine." />
              </label>
              <input
                type="text"
                value={formData.idOrigem || ''}
                onChange={(e) => handleChange('idOrigem', e.target.value)}
                placeholder="Ex: DEM-2026-089"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Situação da Oportunidade
                <Tooltip content="Fase atual no pipeline de automação." />
              </label>
              <select
                value={formData.situacao || 'Em levantamento'}
                onChange={(e) => handleChange('situacao', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
              >
                <option value="Em levantamento">Em levantamento</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Em implantação">Em implantação</option>
                <option value="Concluído">Concluído</option>
                <option value="Descartado">Descartado</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data do Levantamento
                <Tooltip content="Data em que a entrevista ou diagnóstico inicial foi realizado." />
              </label>
              <input
                type="date"
                value={formData.dataLevantamento || ''}
                onChange={(e) => handleChange('dataLevantamento', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Participantes & Entrevistados
                <Tooltip content="Nomes e cargos das pessoas envolvidas na entrevista de levantamento." />
              </label>
              <input
                type="text"
                value={formData.participantes || ''}
                onChange={(e) => handleChange('participantes', e.target.value)}
                placeholder="Ex: Maria Souza (Analista), João Silva (Líder)"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Diagnóstico AS IS */}
        {activeSubTab === 'asis' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Descrição Detalhada do Processo Manual Atual
                <Tooltip content="Passo a passo sucinto de como as tarefas manuais são executadas hoje." />
              </label>
              <textarea
                rows={2}
                value={formData.descricaoProcesso || ''}
                onChange={(e) => handleChange('descricaoProcesso', e.target.value)}
                placeholder="Descreva as etapas operacionais manuais..."
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Matriz de Benefícios (7 Critérios Unificados) */}
        {activeSubTab === 'beneficios' && (
          <div className="space-y-3">
            <div className="bg-brand-50 border border-brand-200 p-3 rounded-xl text-xs text-brand-900 flex items-center justify-between">
              <span>Classifique o grau de impacto de cada benefício qualitativo e estratégico para a organização.</span>
              <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-brand-200">7 Critérios Unificados</span>
            </div>

            <div className="space-y-2.5">
              {renderRadioBeneficio('benLiberarPessoas', '1. Liberar Capacidade Humana / Realocação', 'Redirecionamento de tempo dos profissionais para atividades de inteligência, planejamento e atendimento de valor público.')}
              {renderRadioBeneficio('benReduzirCusto', '2. Reduzir Custos Operacionais', 'Economia orçamentária direta decorrente da otimização e automação da rotina.')}
              {renderRadioBeneficio('benReduzirErros', '3. Redução de Erros & Compliance', 'Prevenção de falhas humanas, multas, conformidade com auditorias de órgãos de controle e eliminação de retrabalho.')}
              {renderRadioBeneficio('benMelhorarExpCliente', '4. Experiência do Cidadão / Órgãos', 'Aumento da satisfação, clareza e celeridade percebida pelo usuário final do serviço público.')}
              {renderRadioBeneficio('benAumentarCapacidade', '5. Aumentar Capacidade Operacional', 'Permitir que a organização suporte aumentos expressivos de volume de requisições sem estrangulamento.')}
              {renderRadioBeneficio('benReduzirTempoResposta', '6. Reduzir Tempo de Resposta (SLA)', 'Diminuição drástica do tempo decorrido entre a solicitação e a entrega da demanda.')}
              {renderRadioBeneficio('benTransformacaoDigital', '7. Transformação Digital & Inovação', 'Adesão às diretrizes do Governo Digital, modernização de processos e eliminação de burocracia legada.')}
            </div>
          </div>
        )}

        {/* Tab 4: Solução TO BE & Esforço */}
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
                  className="w-full text-sm px-3 py-2 border border-brand-300 bg-brand-50/40 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-bold text-brand-900"
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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
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
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Turno de Execução
                  <Tooltip content="Janela de horário em que o robô executará (impacta a taxa horária calculada)." />
                </label>
                <select
                  value={formData.turno || 'Diurno'}
                  onChange={(e) => handleChange('turno', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium"
                >
                  <option value="Diurno">Diurno (08h às 18h)</option>
                  <option value="Noturno">Noturno (18h às 08h)</option>
                  <option value="Final de Semana">Final de Semana</option>
                </select>
              </div>

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
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Horas de Robô (Horas/Mês)
                  <Tooltip content="Tempo que o robô gastará para processar todo o volume mensal." />
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.horasRobo ?? 60}
                  onChange={(e) => handleChange('horasRobo', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Horas Manutenção (HH/Mês)
                  <Tooltip content="Estimativa de horas mensais de suporte do NOC para acompanhamento e ajustes." />
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.horasManutencao ?? 4}
                  onChange={(e) => handleChange('horasManutencao', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold"
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
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-xs transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar Oportunidade' : 'Cadastrar Oportunidade'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
