import React, { useState, useEffect } from 'react';
import { Parametro, PerfilPlataforma } from '../types';
import { api } from '../services/api';
import { Tooltip } from '../components/Tooltip';
import {
  Save,
  CheckCircle2,
  DollarSign,
  Cpu,
  Clock,
  Award,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Star,
  Server,
  Code2,
  Workflow,
  Sparkles,
  X,
} from 'lucide-react';

export const ParametrosPage: React.FC = () => {
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [perfis, setPerfis] = useState<PerfilPlataforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'beneficios' | 'taxas' | 'perfis'>('beneficios');

  // Modal State para Perfil de Plataforma
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<PerfilPlataforma | null>(null);
  const [perfilFormData, setPerfilFormData] = useState<Partial<PerfilPlataforma>>({
    nome: '',
    categoria: 'Open Source / Scripting',
    descricao: '',
    custoLicencaMensal: 0,
    custoEstacaoTrabalho: 0,
    custoServidor: 1150.7,
    nrRobosDiluicao: 5,
    isPadrao: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paramData, perfisData] = await Promise.all([
        api.getParametros(),
        api.getPerfisPlataforma(),
      ]);
      setParametro(paramData);
      setPerfis(perfisData);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao carregar configurações.');
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (field: keyof Parametro, value: number) => {
    if (!parametro) return;
    setParametro({ ...parametro, [field]: value });
  };

  const handleSaveParametros = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parametro) return;
    try {
      setSaving(true);
      const updated = await api.updateParametros(parametro);
      setParametro(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar parâmetros.');
    } finally {
      setSaving(false);
    }
  };

  // CRUD Perfil de Plataforma
  const handleOpenNewPerfil = () => {
    setEditingPerfil(null);
    setPerfilFormData({
      nome: '',
      categoria: 'Open Source / Scripting',
      descricao: '',
      custoLicencaMensal: 0,
      custoEstacaoTrabalho: 0,
      custoServidor: 1150.7,
      nrRobosDiluicao: 5,
      isPadrao: false,
    });
    setPerfilModalOpen(true);
  };

  const handleOpenEditPerfil = (p: PerfilPlataforma) => {
    setEditingPerfil(p);
    setPerfilFormData({ ...p });
    setPerfilModalOpen(true);
  };

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPerfil) {
        await api.updatePerfilPlataforma(editingPerfil.id, perfilFormData);
      } else {
        await api.createPerfilPlataforma(perfilFormData);
      }
      setPerfilModalOpen(false);
      const updatedPerfis = await api.getPerfisPlataforma();
      setPerfis(updatedPerfis);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar perfil de plataforma.');
    }
  };

  const handleDeletePerfil = async (id: string, nome: string) => {
    if (confirm(`Deseja realmente excluir o perfil "${nome}"?`)) {
      try {
        await api.deletePerfilPlataforma(id);
        const updatedPerfis = await api.getPerfisPlataforma();
        setPerfis(updatedPerfis);
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir perfil.');
      }
    }
  };

  const handleSetPadraoPerfil = async (p: PerfilPlataforma) => {
    try {
      await api.updatePerfilPlataforma(p.id, { isPadrao: true });
      const updatedPerfis = await api.getPerfisPlataforma();
      setPerfis(updatedPerfis);
    } catch (err: any) {
      alert(err.message || 'Erro ao definir perfil padrão.');
    }
  };

  if (loading || !parametro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Cálculos dinâmicos dos parâmetros
  const somaPesos =
    parametro.pesoLiberarPessoas +
    parametro.pesoReduzirCusto +
    parametro.pesoReduzirErros +
    parametro.pesoMelhorarExpCliente +
    parametro.pesoAumentarCapacidade +
    parametro.pesoReduzirTempoResposta +
    parametro.pesoTransformacaoDigital;

  const custoHoraManutencao = (parametro.operadorSalaControle * 1.6) / 168;
  const custoSetup1SemanaMensal = (parametro.custoHoraDesenvolvimento * 40) / 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parametrização e Configurações Globais</h1>
          <p className="text-sm text-slate-500 mt-1">
            Governança de pesos da matriz pública, taxas operacionais globais e catálogo de plataformas tecnológicas.
          </p>
        </div>

        {activeTab !== 'perfis' && (
          <button
            onClick={handleSaveParametros}
            disabled={saving}
            className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Parâmetros globais atualizados com sucesso!</span>
            <p className="text-xs text-emerald-700 mt-0.5">
              Os novos índices e fórmulas serão aplicados imediatamente nos próximos cálculos e levantamentos.
            </p>
          </div>
        </div>
      )}

      {/* Main Container with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 pt-3 space-x-2 overflow-x-auto">
          {[
            { id: 'beneficios', label: '1. Matriz de Benefícios (Pesos)', icon: Award },
            { id: 'taxas', label: '2. Taxas Operacionais & Turnos', icon: Clock },
            { id: 'perfis', label: '3. Catálogo de Plataformas Tecnológicas', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Matriz de Benefícios */}
        {activeTab === 'beneficios' && (
          <form onSubmit={handleSaveParametros} className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div>
                <h3 className="text-sm font-bold text-brand-900">Matriz de Priorização do Setor Público</h3>
                <p className="text-xs text-brand-700 mt-0.5">
                  Pesos estratégicos (1 a 3) calibrados para a realidade governamental, com unificação de capacidade humana liberada.
                </p>
              </div>
              <div className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white border border-brand-200 text-brand-900 font-extrabold text-xs shadow-sm">
                Soma de Pesos: {somaPesos} pontos
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Liberar Capacidade / Pessoas
                    <Tooltip content="Peso dado ao redirecionamento de esforço humano de tarefas repetitivas para análises e atividades de alto valor público (sem premissa de demissão)." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoLiberarPessoas}
                  onChange={(e) => handleParamChange('pesoLiberarPessoas', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Reduzir Custos Operacionais
                    <Tooltip content="Impacto na eficiência orçamentária e redução de despesas operacionais diretas com processos manuais." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirCusto}
                  onChange={(e) => handleParamChange('pesoReduzirCusto', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Redução de Erros & Compliance
                    <Tooltip content="Mitigação de falhas humanas, prevenção de autuações de órgãos de controle (TCU/CGU), glosas e retrabalho." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirErros}
                  onChange={(e) => handleParamChange('pesoReduzirErros', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Experiência do Cidadão / Órgãos
                    <Tooltip content="Melhoria na qualidade, celeridade e satisfação do cidadão ou ministérios conveniados atendidos pelo serviço." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoMelhorarExpCliente}
                  onChange={(e) => handleParamChange('pesoMelhorarExpCliente', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Aumentar Capacidade Operacional
                    <Tooltip content="Capacidade de absorver aumentos de volume e picos sazonais de demanda sem necessidade de contratações emergenciais." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoAumentarCapacidade}
                  onChange={(e) => handleParamChange('pesoAumentarCapacidade', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Reduzir Tempo de Resposta (SLA)
                    <Tooltip content="Aceleração drástica do tempo de ciclo de entrega da solicitação ao usuário final." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirTempoResposta}
                  onChange={(e) => handleParamChange('pesoReduzirTempoResposta', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Transformação Digital & Inovação
                    <Tooltip content="Aderência à Estratégia de Governo Digital, eliminando formulários em papel e rotinas arcaicas." />
                  </label>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoTransformacaoDigital}
                  onChange={(e) => handleParamChange('pesoTransformacaoDigital', Number(e.target.value))}
                  className="w-full text-sm font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Pesos da Matriz'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Taxas Operacionais & Turnos */}
        {activeTab === 'taxas' && (
          <form onSubmit={handleSaveParametros} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Carga Horária Padrão (HH/Mês)
                  <Tooltip content="Jornada média mensal de referência para dimensionamento de FTE liberado (Padrão 160h = 40h semanais)." />
                </label>
                <input
                  type="number"
                  value={parametro.cargaHorariaPadrao}
                  onChange={(e) => handleParamChange('cargaHorariaPadrao', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Posto Sustentação NOC / Operador (R$/Mês)
                  <Tooltip content="Custo mensal total do posto de monitoramento 24x7 e sustentação operacional de robôs, incluindo encargos e adicionais." />
                </label>
                <input
                  type="number"
                  step="50"
                  value={parametro.operadorSalaControle}
                  onChange={(e) => handleParamChange('operadorSalaControle', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Custo Hora de Engenharia/Dev (R$/HH)
                  <Tooltip content="Valor integral da hora técnica de analistas/desenvolvedores para desenvolvimento e setup das soluções de automação." />
                </label>
                <input
                  type="number"
                  step="5"
                  value={parametro.custoHoraDesenvolvimento}
                  onChange={(e) => handleParamChange('custoHoraDesenvolvimento', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Percentual Turno Diurno (08h às 18h)
                  <Tooltip content="Fração do rateio de custos alocada ao turno comercial diurno (21 dias x 10h = 210h disponíveis)." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={parametro.percDiurno}
                  onChange={(e) => handleParamChange('percDiurno', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Percentual Turno Noturno (18h às 08h)
                  <Tooltip content="Fração do rateio de custos alocada à janela noturna de processamento em lote (21 dias x 14h = 294h disponíveis)." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={parametro.percNoturno}
                  onChange={(e) => handleParamChange('percNoturno', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Percentual Turno Fim de Semana
                  <Tooltip content="Fração do rateio de custos para execuções contínuas de sábado e domingo (8 dias x 24h = 192h disponíveis)." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={parametro.percFimDeSemana}
                  onChange={(e) => handleParamChange('percFimDeSemana', Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Derived Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase">Custo Hora de Manutenção do Robô</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  R$ {custoHoraManutencao.toFixed(2)} / hora
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Fórmula: Operador NOC x 1.6 / 168h</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-800 uppercase">Custo Setup por Semana de Esforço</span>
                <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
                  R$ {custoSetup1SemanaMensal.toFixed(2)} / mês (12 meses)
                </div>
                <span className="text-[11px] text-emerald-700 mt-1 block">Fórmula: Hora Dev x 40h / 12 meses</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Taxas Operacionais'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Catálogo de Plataformas Tecnológicas */}
        {activeTab === 'perfis' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Perfis de Plataformas Tecnológicas</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gerencie custos de licença, estações e diluição em servidor para cada tecnologia adotada no Centro de Excelência.
                </p>
              </div>

              <button
                onClick={handleOpenNewPerfil}
                className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Plataforma</span>
              </button>
            </div>

            {/* Grid de Perfis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {perfis.map((p) => {
                const baseCusto =
                  (p.custoServidor / (p.nrRobosDiluicao || 1)) +
                  p.custoLicencaMensal +
                  p.custoEstacaoTrabalho +
                  (parametro.operadorSalaControle / (p.nrRobosDiluicao || 1));

                const taxaDiurno = (baseCusto * parametro.percDiurno) / 21 / 10;
                const taxaNoturno = (baseCusto * parametro.percNoturno) / 21 / 14;

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      p.isPadrao
                        ? 'bg-brand-50/30 border-brand-300 shadow-sm ring-1 ring-brand-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{p.nome}</h4>
                          {p.isPadrao && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                              <Star className="w-3 h-3 fill-brand-600 text-brand-600" />
                              <span>Padrão</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{p.categoria}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {!p.isPadrao && (
                          <button
                            title="Definir como padrão"
                            onClick={() => handleSetPadraoPerfil(p)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          title="Editar custos"
                          onClick={() => handleOpenEditPerfil(p)}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          title="Excluir plataforma"
                          onClick={() => handleDeletePerfil(p.id, p.nome)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">{p.descricao || 'Sem descrição informada.'}</p>

                    {/* Breakdown de Custos */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Licença / Robô</span>
                        <span className="font-bold text-slate-800">
                          {p.custoLicencaMensal > 0 ? `R$ ${p.custoLicencaMensal.toFixed(2)}` : 'R$ 0,00 (Livre)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Estação Dedicada</span>
                        <span className="font-bold text-slate-800">
                          {p.custoEstacaoTrabalho > 0 ? `R$ ${p.custoEstacaoTrabalho.toFixed(2)}` : 'R$ 0,00 (N/A)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Servidor / Rateio</span>
                        <span className="font-bold text-slate-800">{p.nrRobosDiluicao} robôs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-600 block font-bold">Taxa Diurna</span>
                        <span className="font-extrabold text-brand-700">R$ {taxaDiurno.toFixed(2)}/h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar / Editar Perfil de Plataforma */}
      {perfilModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-brand-600" />
                <span>{editingPerfil ? 'Editar Plataforma Tecnológica' : 'Nova Plataforma Tecnológica'}</span>
              </h3>
              <button onClick={() => setPerfilModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePerfil} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome da Plataforma
                  <Tooltip content="Nome de exibição da ferramenta (ex: Python & Robot Framework, n8n, Power Automate)." />
                </label>
                <input
                  type="text"
                  required
                  value={perfilFormData.nome || ''}
                  onChange={(e) => setPerfilFormData({ ...perfilFormData, nome: e.target.value })}
                  placeholder="Ex: n8n Workflow Automation"
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                    <Tooltip content="Classificação arquitetural da plataforma de automação." />
                  </label>
                  <select
                    value={perfilFormData.categoria || 'Open Source / Scripting'}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, categoria: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                  >
                    <option value="Open Source / Scripting">Open Source / Scripting</option>
                    <option value="Workflow & iPaaS">Workflow & iPaaS</option>
                    <option value="RPA Proprietário">RPA Proprietário</option>
                    <option value="Low-Code / RAD">Low-Code / RAD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nº Robôs para Rateio
                    <Tooltip content="Quantidade de robôs/instâncias no CoE que dividem os custos de servidor e NOC." />
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={perfilFormData.nrRobosDiluicao ?? 5}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, nrRobosDiluicao: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Licença (R$/mês)
                    <Tooltip content="Custo de licença de runtime/execução por robô (R$ 0,00 para Open Source)." />
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={perfilFormData.custoLicencaMensal ?? 0}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, custoLicencaMensal: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estação (R$/mês)
                    <Tooltip content="Custo de máquina virtual desktop dedicada (se exigido pela tecnologia)." />
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={perfilFormData.custoEstacaoTrabalho ?? 0}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, custoEstacaoTrabalho: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Servidor (R$/mês)
                    <Tooltip content="Custo do cluster/servidor de orquestração compartilhado." />
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={perfilFormData.custoServidor ?? 1150.7}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, custoServidor: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição & Diretriz de Uso
                  <Tooltip content="Breve recomendação técnica de quando utilizar essa plataforma." />
                </label>
                <textarea
                  rows={2}
                  value={perfilFormData.descricao || ''}
                  onChange={(e) => setPerfilFormData({ ...perfilFormData, descricao: e.target.value })}
                  placeholder="Descreva as aplicações ideais desta plataforma..."
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="chkPadrao"
                  checked={!!perfilFormData.isPadrao}
                  onChange={(e) => setPerfilFormData({ ...perfilFormData, isPadrao: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="chkPadrao" className="font-semibold text-slate-700 cursor-pointer">
                  Definir como plataforma padrão inicial em novos projetos
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPerfilModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow transition-all"
                >
                  Salvar Plataforma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
