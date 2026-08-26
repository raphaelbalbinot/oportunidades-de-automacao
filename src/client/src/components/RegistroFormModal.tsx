import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Registro, Parametro, BeneficioNivel } from '../types';
import { Bot, Calculator, CheckCircle2, TrendingUp, DollarSign, Clock, HelpCircle, Layers } from 'lucide-react';

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

    benAumentarCapacidade: 'nenhum',
    benTransformacaoDigital: 'nenhum',
    benLiberarPessoas: 'nenhum',
    benMelhorarExpCliente: 'nenhum',
    benReduzirCusto: 'nenhum',
    benReduzirErros: 'nenhum',
    benReduzirFte: 'nenhum',
    benReduzirTempoResposta: 'nenhum',

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
    if (initialData) {
      setFormData(initialData);
    } else {
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
        benAumentarCapacidade: 'nenhum',
        benTransformacaoDigital: 'nenhum',
        benLiberarPessoas: 'nenhum',
        benMelhorarExpCliente: 'nenhum',
        benReduzirCusto: 'nenhum',
        benReduzirErros: 'nenhum',
        benReduzirFte: 'nenhum',
        benReduzirTempoResposta: 'nenhum',
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
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Registro, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cálculo de pré-visualização em tempo real
  const calcPreview = React.useMemo(() => {
    if (!parametro) return null;

    const tempoExecucao = Number(formData.tempoExecucao) || 0;
    const valorHoraExecutor = Number(formData.valorHoraExecutor) || 0;
    let custoMensalAtual = Number(formData.custoMensalAtual) || 0;
    if (custoMensalAtual === 0 && tempoExecucao > 0 && valorHoraExecutor > 0) {
      custoMensalAtual = tempoExecucao * valorHoraExecutor;
    }

    const cargaHoraria = parametro.cargaHorariaPadrao || 160;
    const fteLiberado = Number((tempoExecucao / cargaHoraria).toFixed(2));

    // Pontuação de Benefícios
    const pFactor = (res?: string) => {
      if (res === 'principal') return 1.0;
      if (res === 'bastante') return 0.5;
      if (res === 'pouco') return 0.25;
      return 0.0;
    };

    const pMax =
      parametro.pesoAumentarCapacidade +
      parametro.pesoTransformacaoDigital +
      parametro.pesoLiberarPessoas +
      parametro.pesoMelhorarExpCliente +
      parametro.pesoReduzirCusto +
      parametro.pesoReduzirErros +
      parametro.pesoReduzirFte +
      parametro.pesoReduzirTempoResposta;

    const somaPontos =
      pFactor(formData.benAumentarCapacidade) * parametro.pesoAumentarCapacidade +
      pFactor(formData.benTransformacaoDigital) * parametro.pesoTransformacaoDigital +
      pFactor(formData.benLiberarPessoas) * parametro.pesoLiberarPessoas +
      pFactor(formData.benMelhorarExpCliente) * parametro.pesoMelhorarExpCliente +
      pFactor(formData.benReduzirCusto) * parametro.pesoReduzirCusto +
      pFactor(formData.benReduzirErros) * parametro.pesoReduzirErros +
      pFactor(formData.benReduzirFte) * parametro.pesoReduzirFte +
      pFactor(formData.benReduzirTempoResposta) * parametro.pesoReduzirTempoResposta;

    const pontuacaoBeneficios = pMax > 0 ? (somaPontos / pMax) * 100 : 0;

    // Custo do Turno
    const nrRobos = parametro.nrRobos || 1;
    const custoRoboTotal = parametro.licencaRobo + parametro.estacaoTrabalhoRobo;
    const baseCusto = (parametro.servidor / nrRobos) + custoRoboTotal + (parametro.operadorSalaControle / nrRobos);
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

    const roiAno1 = (custoMensalAtual * 12) - custoAnualAno1;
    const roiAno2 = (custoMensalAtual * 24) - custoAnualAno1 - custoAnualAno2 - roiAno1;
    const paybackMeses = custoMensalAtual > 0 ? (custoAnualAno1 / custoMensalAtual) : 0;

    return {
      custoMensalAtual,
      fteLiberado,
      pontuacaoBeneficios,
      investimentoSetup,
      custoMensalAno1,
      custoMensalAno2,
      roiAno1,
      roiAno2,
      paybackMeses,
    };
  }, [formData, parametro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomeProcesso) {
      alert('Por favor, informe o nome do processo.');
      return;
    }
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar oportunidade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const beneficiosList = [
    { key: 'benAumentarCapacidade' as const, label: 'Aumentar capacidade de processamento', peso: parametro?.pesoAumentarCapacidade ?? 2 },
    { key: 'benTransformacaoDigital' as const, label: 'Iniciativa de transformação digital', peso: parametro?.pesoTransformacaoDigital ?? 1 },
    { key: 'benLiberarPessoas' as const, label: 'Liberar pessoas para atividades de negócio', peso: parametro?.pesoLiberarPessoas ?? 3 },
    { key: 'benMelhorarExpCliente' as const, label: 'Melhorar experiência do cliente/cidadão', peso: parametro?.pesoMelhorarExpCliente ?? 1 },
    { key: 'benReduzirCusto' as const, label: 'Reduzir custos operacionais diretos', peso: parametro?.pesoReduzirCusto ?? 3 },
    { key: 'benReduzirErros' as const, label: 'Reduzir erros operacionais e retrabalho', peso: parametro?.pesoReduzirErros ?? 2 },
    { key: 'benReduzirFte' as const, label: 'Reduzir necessidade de FTE dedicado', peso: parametro?.pesoReduzirFte ?? 3 },
    { key: 'benReduzirTempoResposta' as const, label: 'Reduzir tempo de resposta (SLA)', peso: parametro?.pesoReduzirTempoResposta ?? 2 },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Editar Processo: ${initialData.idAnalise} - ${initialData.nomeProcesso}` : 'Nova Oportunidade de Automação'}
      subtitle="Levantamento operacional, matriz de benefícios e estimativas de custeio TO BE"
      maxWidth="5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-200 space-x-2">
          {[
            { id: 'geral', label: '1. Identificação & Contexto' },
            { id: 'asis', label: '2. Situação Atual (AS IS)' },
            { id: 'beneficios', label: '3. Benefícios Intangíveis' },
            { id: 'tobe', label: '4. Solução & Custeio (TO BE)' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
                activeSubTab === tab.id
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Geral */}
        {activeSubTab === 'geral' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ID Origem (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: FIN-001"
                value={formData.idOrigem || ''}
                onChange={(e) => handleChange('idOrigem', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ID Análise</label>
              <input
                type="text"
                placeholder="Ex: P1 (automático se vazio)"
                value={formData.idAnalise || ''}
                onChange={(e) => handleChange('idAnalise', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Área / Departamento *</label>
              <input
                type="text"
                required
                placeholder="Ex: Contabilidade, RH, Fiscal"
                value={formData.area || ''}
                onChange={(e) => handleChange('area', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Processo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Lançamento de Notas Fiscais e Conciliação"
                value={formData.nomeProcesso || ''}
                onChange={(e) => handleChange('nomeProcesso', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data do Levantamento</label>
              <input
                type="date"
                value={formData.dataLevantamento || ''}
                onChange={(e) => handleChange('dataLevantamento', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Situação / Status</label>
              <select
                value={formData.situacao || 'Em levantamento'}
                onChange={(e) => handleChange('situacao', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              >
                <option value="Em levantamento">Em levantamento</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Em implantação">Em implantação</option>
                <option value="Concluído">Concluído</option>
                <option value="Descartado">Descartado</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Participantes do Levantamento</label>
              <input
                type="text"
                placeholder="Ex: João Silva (Analista), Maria Santos (Coordenadora)"
                value={formData.participantes || ''}
                onChange={(e) => handleChange('participantes', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: AS IS */}
        {activeSubTab === 'asis' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição do Processo Atual</label>
              <textarea
                rows={3}
                placeholder="Detalhe como o processo é executado manualmente hoje..."
                value={formData.descricaoProcesso || ''}
                onChange={(e) => handleChange('descricaoProcesso', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Periodicidade</label>
              <select
                value={formData.periodicidade || 'Mensal'}
                onChange={(e) => handleChange('periodicidade', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              >
                <option value="Diária">Diária</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Sob demanda">Sob demanda</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1"># Execuções por Mês</label>
              <input
                type="number"
                min="0"
                value={formData.numExecucoes ?? 0}
                onChange={(e) => handleChange('numExecucoes', Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nr Pessoas Envolvidas</label>
              <input
                type="number"
                min="1"
                value={formData.numPessoasEnvolvidas ?? 1}
                onChange={(e) => handleChange('numPessoasEnvolvidas', Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Perfil do Executor</label>
              <input
                type="text"
                placeholder="Ex: Assistente, Analista Jr, Especialista"
                value={formData.perfilExecutor || ''}
                onChange={(e) => handleChange('perfilExecutor', e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Hora Executor (R$/HH)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.valorHoraExecutor ?? 0}
                onChange={(e) => handleChange('valorHoraExecutor', Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempo de Execução (Horas/Mês)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.tempoExecucao ?? 0}
                onChange={(e) => handleChange('tempoExecucao', Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sistemas Envolvidos</label>
                <input
                  type="text"
                  placeholder="Ex: SAP, SEFAZ, Excel, Navegador Web"
                  value={formData.sistemasEnvolvidos || ''}
                  onChange={(e) => handleChange('sistemasEnvolvidos', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Documentos de Apoio</label>
                <input
                  type="text"
                  placeholder="Ex: Manual do Processo.pdf, Procedimento Operacional"
                  value={formData.documentosApoio || ''}
                  onChange={(e) => handleChange('documentosApoio', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Benefícios Intangíveis */}
        {activeSubTab === 'beneficios' && (
          <div className="space-y-4">
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-900">Matriz de Avaliação de Benefícios</h4>
                <p className="text-xs text-brand-700">
                  Defina o nível de contribuição da robotização para cada objetivo estratégico.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Pontuação Calculada</span>
                <div className="text-xl font-extrabold text-brand-900">
                  {calcPreview ? `${calcPreview.pontuacaoBeneficios.toFixed(1)}%` : '0%'}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-4 text-left">Objetivo / Benefício</th>
                    <th className="py-2.5 px-3 text-center">Peso</th>
                    <th className="py-2.5 px-3 text-center">Principal (100%)</th>
                    <th className="py-2.5 px-3 text-center">Bastante (50%)</th>
                    <th className="py-2.5 px-3 text-center">Pouco (25%)</th>
                    <th className="py-2.5 px-3 text-center">Nenhum (0%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {beneficiosList.map((b) => {
                    const currentVal = formData[b.key] || 'nenhum';
                    return (
                      <tr key={b.key} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-slate-800">{b.label}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-bold">{b.peso}</td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="radio"
                            name={b.key}
                            checked={currentVal === 'principal'}
                            onChange={() => handleChange(b.key, 'principal')}
                            className="text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="radio"
                            name={b.key}
                            checked={currentVal === 'bastante'}
                            onChange={() => handleChange(b.key, 'bastante')}
                            className="text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="radio"
                            name={b.key}
                            checked={currentVal === 'pouco'}
                            onChange={() => handleChange(b.key, 'pouco')}
                            className="text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="radio"
                            name={b.key}
                            checked={currentVal === 'nenhum'}
                            onChange={() => handleChange(b.key, 'nenhum')}
                            className="text-slate-400 focus:ring-slate-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: TO BE & Custeio */}
        {activeSubTab === 'tobe' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição da Solução Robotizada</label>
                <textarea
                  rows={2}
                  placeholder="Descreva a arquitetura do bot, etapas automatizadas e integrações..."
                  value={formData.descricaoSolucao || ''}
                  onChange={(e) => handleChange('descricaoSolucao', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Complexidade Técnica</label>
                <select
                  value={formData.complexidade || 'Média'}
                  onChange={(e) => handleChange('complexidade', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Turno de Execução do Robô</label>
                <select
                  value={formData.turno || 'Diurno'}
                  onChange={(e) => handleChange('turno', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                >
                  <option value="Diurno">Diurno (08h às 18h)</option>
                  <option value="Noturno">Noturno (18h às 08h)</option>
                  <option value="Final de Semana">Final de Semana (Sáb/Dom)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recomendação Final</label>
                <select
                  value={formData.recomendacao || 'Recomendado'}
                  onChange={(e) => handleChange('recomendacao', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                >
                  <option value="Recomendado">Recomendado</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Não viável">Não viável</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Esforço de Setup (Semanas)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.esforcoSetupSemanas ?? 1}
                  onChange={(e) => handleChange('esforcoSetupSemanas', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horas Robô Estimadas (HH/Mês)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.horasRobo ?? 0}
                  onChange={(e) => handleChange('horasRobo', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horas Apoio Negócio (HH/Mês)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.horasApoioNegocio ?? 0}
                  onChange={(e) => handleChange('horasApoioNegocio', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Horas Manutenção Robô (HH/Mês)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.horasManutencao ?? 0}
                  onChange={(e) => handleChange('horasManutencao', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Redução de Tempo Prevista</label>
                <input
                  type="text"
                  placeholder="Ex: 85%"
                  value={formData.reducaoTempoPrevista || ''}
                  onChange={(e) => handleChange('reducaoTempoPrevista', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Redução de Custo Prevista</label>
                <input
                  type="text"
                  placeholder="Ex: 75%"
                  value={formData.reducaoCustoPrevista || ''}
                  onChange={(e) => handleChange('reducaoCustoPrevista', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Calculation Preview Banner */}
        {calcPreview && (
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Calculator className="w-4 h-4" />
                <span>Simulação Financeira Instantânea (Parâmetros Ativos)</span>
              </div>
              <span className="text-xs text-slate-400">Fórmulas sincronizadas com a planilha</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Custo Atual (Mês)</div>
                <div className="text-sm font-bold text-slate-100">
                  R$ {calcPreview.custoMensalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">FTE Liberado</div>
                <div className="text-sm font-bold text-emerald-400">{calcPreview.fteLiberado} FTE</div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Custo TO BE (Mês)</div>
                <div className="text-sm font-bold text-cyan-400">
                  R$ {calcPreview.custoMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">ROI Ano 1</div>
                <div className={`text-sm font-bold ${calcPreview.roiAno1 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {calcPreview.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">ROI 2 Anos</div>
                <div className={`text-sm font-bold ${calcPreview.roiAno2 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {calcPreview.roiAno2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Payback</div>
                <div className="text-sm font-bold text-amber-400">{calcPreview.paybackMeses.toFixed(1)} meses</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Cadastrar Oportunidade'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
