import React, { useState, useEffect } from 'react';
import { Parametro } from '../types';
import { api } from '../services/api';
import {
  Save,
  CheckCircle2,
  DollarSign,
  Cpu,
  Clock,
  Award,
} from 'lucide-react';

export const ParametrosPage: React.FC = () => {
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'beneficios' | 'infra' | 'turnos' | 'desenvolvimento'>('beneficios');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getParametros();
      setParametro(data);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao carregar parâmetros.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Parametro, value: number) => {
    if (!parametro) return;
    setParametro({ ...parametro, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (loading || !parametro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // Cálculos dinâmicos dos parâmetros
  const somaPesos =
    parametro.pesoAumentarCapacidade +
    parametro.pesoTransformacaoDigital +
    parametro.pesoLiberarPessoas +
    parametro.pesoMelhorarExpCliente +
    parametro.pesoReduzirCusto +
    parametro.pesoReduzirErros +
    parametro.pesoReduzirFte +
    parametro.pesoReduzirTempoResposta;

  const custoInfraTotal = parametro.operadorSalaControle + parametro.servidor;
  const custoRoboTotal = parametro.licencaRobo + parametro.estacaoTrabalhoRobo;
  const nrRobos = parametro.nrRobos > 0 ? parametro.nrRobos : 1;
  const baseCusto = (parametro.servidor / nrRobos) + custoRoboTotal + (parametro.operadorSalaControle / nrRobos);

  const custoHoraDiurno = (baseCusto * parametro.percDiurno) / 21 / 10;
  const custoHoraNoturno = (baseCusto * parametro.percNoturno) / 21 / 14;
  const custoHoraFimSemana = (baseCusto * parametro.percFimDeSemana) / 8 / 24;

  const custoHoraManutencao = (parametro.operadorSalaControle * 1.6) / 168;
  const custoSetup1SemanaMensal = (parametro.custoHoraDesenvolvimento * 40) / 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parametrização e Configurações Globais</h1>
          <p className="text-sm text-slate-500 mt-1">
            Definição de premissas financeiras, custos de infraestrutura, taxas de turnos e pesos de priorização para automações.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Parâmetros atualizados com sucesso!</span>
            <p className="text-xs text-emerald-700 mt-0.5">
              Novos levantamentos e edições utilizarão estes novos índices nos cálculos automáticos.
            </p>
          </div>
        </div>
      )}

      {/* Main Form Container with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 px-6 pt-3 space-x-2 overflow-x-auto">
          {[
            { id: 'beneficios', label: '1. Benefícios Intangíveis (Pesos)', icon: Award },
            { id: 'infra', label: '2. Infraestrutura & Carga Base', icon: Cpu },
            { id: 'turnos', label: '3. Turnos & Custos Horários', icon: Clock },
            { id: 'desenvolvimento', label: '4. Desenvolvimento & Setup', icon: DollarSign },
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

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Aba 1: Benefícios Intangíveis */}
          {activeTab === 'beneficios' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-brand-50 border border-brand-200 rounded-xl p-4">
                <div>
                  <h3 className="text-sm font-bold text-brand-900">Matriz de Priorização Estratégica</h3>
                  <p className="text-xs text-brand-700 mt-0.5">
                    Defina o peso de 1 (menor prioridade) a 3 (maior prioridade) para cada benefício intangível da organização.
                  </p>
                </div>
                <div className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white border border-brand-200 text-brand-900 font-extrabold text-xs">
                  Pontuação Máxima: {somaPesos} pontos
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Aumentar capacidade</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoAumentarCapacidade}
                    onChange={(e) => handleChange('pesoAumentarCapacidade', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transformação digital</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoTransformacaoDigital}
                    onChange={(e) => handleChange('pesoTransformacaoDigital', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Liberar pessoas p/ negócio</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoLiberarPessoas}
                    onChange={(e) => handleChange('pesoLiberarPessoas', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Melhorar Experiência Cliente</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoMelhorarExpCliente}
                    onChange={(e) => handleChange('pesoMelhorarExpCliente', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reduzir custo</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoReduzirCusto}
                    onChange={(e) => handleChange('pesoReduzirCusto', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reduzir erros operacionais</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoReduzirErros}
                    onChange={(e) => handleChange('pesoReduzirErros', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reduzir FTE</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoReduzirFte}
                    onChange={(e) => handleChange('pesoReduzirFte', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reduzir tempo de resposta</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={parametro.pesoReduzirTempoResposta}
                    onChange={(e) => handleChange('pesoReduzirTempoResposta', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Aba 2: Infraestrutura & Carga Base */}
          {activeTab === 'infra' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Carga Horária Padrão (HH/Mês)</label>
                  <input
                    type="number"
                    value={parametro.cargaHorariaPadrao}
                    onChange={(e) => handleChange('cargaHorariaPadrao', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Operador da Sala de Controle (R$/Mês)</label>
                  <input
                    type="number"
                    step="50"
                    value={parametro.operadorSalaControle}
                    onChange={(e) => handleChange('operadorSalaControle', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Servidor de Automação (R$/Mês)</label>
                  <input
                    type="number"
                    step="10"
                    value={parametro.servidor}
                    onChange={(e) => handleChange('servidor', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Custo Total de Infraestrutura</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                    R$ {custoInfraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês
                  </div>
                </div>
                <div className="text-xs text-slate-500 text-right">
                  Soma: Operador Sala de Controle + Servidor de Automação
                </div>
              </div>
            </div>
          )}

          {/* Aba 3: Turnos & Custos Horários */}
          {activeTab === 'turnos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Licença do Bot / Automação (R$/Mês)</label>
                  <input
                    type="number"
                    step="50"
                    value={parametro.licencaRobo}
                    onChange={(e) => handleChange('licencaRobo', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Estação de Trabalho do Bot (R$/Mês)</label>
                  <input
                    type="number"
                    step="10"
                    value={parametro.estacaoTrabalhoRobo}
                    onChange={(e) => handleChange('estacaoTrabalhoRobo', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Número Base de Bots / Robôs</label>
                  <input
                    type="number"
                    min="1"
                    value={parametro.nrRobos}
                    onChange={(e) => handleChange('nrRobos', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Percentual Turno Diurno (08h às 18h)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={parametro.percDiurno}
                    onChange={(e) => handleChange('percDiurno', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Taxa resultante: R$ {custoHoraDiurno.toFixed(2)}/h
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Percentual Turno Noturno (18h às 08h)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={parametro.percNoturno}
                    onChange={(e) => handleChange('percNoturno', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <div className="mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                    Taxa resultante: R$ {custoHoraNoturno.toFixed(2)}/h
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Percentual Turno Fim de Semana</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={parametro.percFimDeSemana}
                    onChange={(e) => handleChange('percFimDeSemana', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <div className="mt-2 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                    Taxa resultante: R$ {custoHoraFimSemana.toFixed(2)}/h
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba 4: Desenvolvimento & Setup */}
          {activeTab === 'desenvolvimento' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Valor Hora do Desenvolvedor (R$/HH)</label>
                  <input
                    type="number"
                    step="5"
                    value={parametro.custoHoraDesenvolvimento}
                    onChange={(e) => handleChange('custoHoraDesenvolvimento', Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Custo Hora Manutenção do Bot</label>
                  <div className="text-sm font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    R$ {custoHoraManutencao.toFixed(2)}/h
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Fórmula: Operador da Sala x 1.6 / 168h</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Investimento Setup por Semana</span>
                  <div className="text-lg font-extrabold text-emerald-900 mt-0.5">
                    R$ {custoSetup1SemanaMensal.toFixed(2)} / mês (diluído em 12x)
                  </div>
                </div>
                <div className="text-xs text-emerald-700 text-right">
                  Custo Hora Dev x 40h / 12 meses
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
          <div className="flex items-center justify-end pt-6 border-t border-slate-100 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
