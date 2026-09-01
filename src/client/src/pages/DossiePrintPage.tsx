import React, { useEffect, useState } from 'react';
import { Registro, Parametro } from '../types';
import { api } from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DossiePrintPageProps {
  registroId: string;
}

export const DossiePrintPage: React.FC<DossiePrintPageProps> = ({ registroId }) => {
  const [registro, setRegistro] = useState<Registro | null>(null);
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [reg, param] = await Promise.all([
          api.getRegistroById(registroId),
          api.getParametros(),
        ]);
        setRegistro(reg);
        setParametro(param);
      } catch (err: any) {
        console.error(err);
        setError('Não foi possível carregar os dados da oportunidade para impressão.');
      } finally {
        setLoading(false);
      }
    };
    if (registroId) {
      load();
    }
  }, [registroId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1351b4] mb-3"></div>
        <p className="text-xs text-slate-600 font-semibold">Preparando Dossiê Executivo para Impressão / PDF...</p>
      </div>
    );
  }

  if (error || !registro) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-xs">
          <p className="font-bold">{error || 'Oportunidade não encontrada.'}</p>
        </div>
        <button
          onClick={() => window.close()}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded text-xs font-semibold"
        >
          Fechar Janela
        </button>
      </div>
    );
  }

  const mat = registro.nivelMaturidade || 'N0';
  const matLabels: Record<string, string> = {
    N0: 'N0 — Oportunidade (Dor Registrada)',
    N1: 'N1 — Business Case Parcial',
    N2: 'N2 — Business Case Completo',
    N3: 'N3 — Benefício Realizado (Pós-Operação)',
  };

  const arqLabels: Record<string, string> = {
    A1: 'A1 — Processo Transacional Repetitivo (Horas de Trabalho Liberadas)',
    A2: 'A2 — Erro e Retrabalho (Redução de Custos de Correção e Perdas)',
    A3: 'A3 — Atendimento e Autosserviço (Menor Custo por Contato / SAC)',
    A4: 'A4 — Conformidade e Risco Contratual (Mitigação de Multas e Glosas)',
    A5: 'A5 — Gargalo e Ciclo de Receita (Menor Lead Time / Antecipação)',
    A6: 'A6 — Racionalização de Ativos Técnicos (Consolidação de Soluções / Menor Sustentação)',
    A7: 'A7 — Processo Comercial e Oportunidade (Receita Adicional)',
  };

  const benefBruto = Number(registro.beneficioBrutoAnual || (registro.custoMensalAtual ? registro.custoMensalAtual * 12 : 0));
  const custoAno1 = Number(registro.custoAnualAno1 || ((registro.investimentoSetup || 0) * 12 + (registro.custoMensalAno2 || 0) * 12));
  const custoAno2 = Number(registro.custoAnualAno2 || ((registro.custoMensalAno2 || 0) * 12));
  const beneficioAnual = registro.beneficioLiquidoAnual || (benefBruto - custoAno1);

  // Dados para Gráfico de Fluxo Trienal
  const fluxoFinanceiroData = [
    {
      periodo: 'Ano 1 (Setup + Op.)',
      'Custo Total': Math.round(custoAno1),
      'Benefício Bruto': Math.round(benefBruto),
      'Saldo Líquido': Math.round(benefBruto - custoAno1),
    },
    {
      periodo: 'Ano 2 (Operação)',
      'Custo Total': Math.round(custoAno2),
      'Benefício Bruto': Math.round(benefBruto),
      'Saldo Líquido': Math.round(benefBruto - custoAno2),
    },
    {
      periodo: 'Ano 3 (Operação)',
      'Custo Total': Math.round(custoAno2),
      'Benefício Bruto': Math.round(benefBruto),
      'Saldo Líquido': Math.round(benefBruto - custoAno2),
    },
  ];

  // Dados para Gráfico de Pizza / Donut de Trilhas
  const percAuto = Math.round((registro.percTrilhaAutomacao ?? 1.0) * 100);
  const percProc = Math.round((registro.percTrilhaProcesso ?? 0) * 100);
  const percSist = Math.round((registro.percTrilhaSistema ?? 0) * 100);

  const trilhaData = [
    { name: 'Automação', value: percAuto > 0 ? percAuto : 100, color: '#1351b4' },
    { name: 'Padronização', value: percProc, color: '#059669' },
    { name: 'Evolução Sistêmica', value: percSist, color: '#d97706' },
  ].filter(t => t.value > 0);

  // Lista dos 12 Benefícios Intangíveis
  const beneficiosList = [
    { label: 'Liberar Pessoas (FTE)', value: registro.benLiberarPessoas, icon: 'fa-user-check' },
    { label: 'Redução de Custos', value: registro.benReduzirCusto, icon: 'fa-dollar-sign' },
    { label: 'Redução de Erros', value: registro.benReduzirErros, icon: 'fa-shield-alt' },
    { label: 'Segurança & Privacidade', value: registro.benSegurancaPrivacidade, icon: 'fa-lock' },
    { label: 'Rastreabilidade / Compliance', value: registro.benRastreabilidadeCompliance, icon: 'fa-file-signature' },
    { label: 'Key Person Risk', value: registro.benKeyPersonRisk, icon: 'fa-user-shield' },
    { label: 'Experiência do Cliente', value: registro.benMelhorarExpCliente, icon: 'fa-smile' },
    { label: 'Aumento de Capacidade', value: registro.benAumentarCapacidade, icon: 'fa-tachometer-alt' },
    { label: 'Redução Tempo Resposta', value: registro.benReduzirTempoResposta, icon: 'fa-clock' },
    { label: 'Interoperabilidade', value: registro.benInteroperabilidade, icon: 'fa-network-wired' },
    { label: 'Transformação Digital', value: registro.benTransformacaoDigital, icon: 'fa-laptop-code' },
    { label: 'Sustentabilidade ESG', value: registro.benSustentabilidadeEsg, icon: 'fa-leaf' },
  ];

  const getBeneficioBadge = (val?: string) => {
    switch (val) {
      case 'principal':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase">Alto</span>;
      case 'bastante':
        return <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[9px] uppercase">Médio</span>;
      case 'pouco':
        return <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium text-[9px] uppercase">Baixo</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[9px]">Neutro</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:bg-white print:p-0">
      {/* Barra Superior de Ações (Oculta na Impressão) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between bg-white p-3.5 rounded-lg border border-slate-300 shadow-sm print:hidden">
        <div className="flex items-center space-x-2 text-slate-700 text-xs">
          <i className="fas fa-file-pdf text-red-600 text-base"></i>
          <span className="font-bold">Dossiê Executivo de Business Case — {registro.idAnalise}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Visualização de Impressão A4 Oficial</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white font-bold rounded shadow-xs text-xs cursor-pointer transition-all"
          >
            <i className="fas fa-print"></i>
            <span>Imprimir / Salvar em PDF</span>
          </button>
          <button
            type="button"
            onClick={() => window.close()}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-xs cursor-pointer transition-all"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Folha A4 do Dossiê */}
      <div
        id="dossie-imprimivel"
        className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-lg border border-slate-300 shadow-sm print:border-none print:shadow-none print:p-0 space-y-6 text-slate-900 font-['Rawline',sans-serif] text-xs leading-relaxed"
      >
        {/* Cabeçalho Institucional Oficial Serpro / FCAIA */}
        <div className="border-b-2 border-[#1351b4] pb-4 flex items-center justify-between break-inside-avoid">
          <div>
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              SERPRO · FCAIA · SUPFC
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0c326f] m-0 tracking-tight">
              Dossiê de Avaliação de Valor e Business Case de Automação
            </h1>
            <div className="text-xs text-slate-700 mt-1">
              Processo: <strong className="text-slate-900">{registro.nomeProcesso}</strong> ({registro.idAnalise})
            </div>
          </div>

          <div className="text-right space-y-1.5">
            <span
              className={`inline-block font-bold text-xs px-3 py-1 rounded-full border ${
                mat === 'N0'
                  ? 'bg-blue-50 text-blue-900 border-blue-400'
                  : mat === 'N1'
                  ? 'bg-amber-50 text-amber-900 border-amber-400'
                  : mat === 'N2'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                  : 'bg-purple-50 text-purple-900 border-purple-400'
              }`}
            >
              {matLabels[mat] || mat}
            </span>
            <div className="text-[10px] text-slate-500 font-medium">
              Data de Emissão: {registro.dataLevantamento || new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Seção 1: Identificação da Demanda & Contexto */}
        <div className="space-y-3 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1 m-0">
            1. Identificação da Demanda & Contexto Operacional
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">Área Solicitante</span>
              <span className="font-bold text-slate-900 text-xs">{registro.area || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">ID Origem / Chamado</span>
              <span className="font-bold text-slate-900 text-xs">{registro.idOrigem || '-'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">Criticidade Percebida</span>
              <span className="font-bold text-slate-900 text-xs">{registro.criticidadePercebida || 'Média'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">Situação no Portfólio</span>
              <span className="font-bold text-slate-900 text-xs">{registro.situacao || 'Em levantamento'}</span>
            </div>
          </div>

          {registro.sintomasDor && (
            <div className="p-3 bg-white border border-slate-200 rounded">
              <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                Diagnóstico Qualitativo da Dor & Gargalos Operacionais:
              </span>
              <p className="text-slate-800 m-0 leading-relaxed">{registro.sintomasDor}</p>
            </div>
          )}
        </div>

        {/* Seção 2: Classificação por Arquétipo & Projeção Financeira Multi-Cenário */}
        <div className="space-y-3 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1 m-0">
            2. Classificação por Arquétipo & Engenharia Financeira (VPL 3 Anos)
          </h2>
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Arquétipo Primário de Valor</span>
              <span className="font-bold text-[#0c326f] text-xs">
                {arqLabels[registro.arquetipoPrimario || 'A1'] || registro.arquetipoPrimario}
              </span>
            </div>
            {registro.arquetiposSecundarios && (
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Arquétipos Secundários</span>
                <span className="font-medium text-slate-800 text-xs">{registro.arquetiposSecundarios}</span>
              </div>
            )}
          </div>

          {/* Tabela de Indicadores Financeiros nos 3 Cenários */}
          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-800 text-[10px] font-bold uppercase border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Indicador Financeiro Auditável</th>
                  <th className="py-2.5 px-3 text-right">Cenário Conservador</th>
                  <th className="py-2.5 px-3 text-right bg-blue-100/70 text-[#0c326f] font-extrabold">Cenário Base (Oficial)</th>
                  <th className="py-2.5 px-3 text-right">Cenário Otimista</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-800">Benefício Líquido Anual (R$)</td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {((beneficioAnual * 0.8)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-800 bg-blue-50/40">
                    {beneficioAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {((beneficioAnual * 1.2)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-800">VPL em 3 Anos (Taxa Desconto 12% a.a.)</td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {(registro.vplCenarioConservador || (registro.vpl3Anos ? registro.vpl3Anos * 0.75 : 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#1351b4] bg-blue-50/40">
                    {(registro.vpl3Anos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {(registro.vplCenarioOtimista || (registro.vpl3Anos ? registro.vpl3Anos * 1.25 : 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-800">Payback Estimado</td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {(registro.paybackCenarioConservador || (registro.paybackMeses ? registro.paybackMeses * 1.3 : 0)).toFixed(1)} meses
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900 bg-blue-50/40">
                    {(registro.paybackMeses || 0).toFixed(1)} meses
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {(registro.paybackCenarioOtimista || (registro.paybackMeses ? registro.paybackMeses * 0.8 : 0)).toFixed(1)} meses
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-800">Investimento Inicial de Setup (Engenharia)</td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {((registro.investimentoSetup || 0) * 12 * 1.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900 bg-blue-50/40">
                    {((registro.investimentoSetup || 0) * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-2 px-3 text-right text-slate-600">
                    {((registro.investimentoSetup || 0) * 12 * 0.9).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PAINEL VISUAL DE GRÁFICOS EXECUTIVOS (UX DESIGNER) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 break-inside-avoid">
          {/* Gráfico 1: Fluxo Trienal */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
              <i className="fas fa-chart-column text-[#1351b4]"></i>
              <span>Fluxo de Valor & Retorno Trienal (R$)</span>
            </span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fluxoFinanceiroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="periodo" tick={{ fontSize: 9, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#475569' }} tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`} />
                  <RechartsTooltip
                    formatter={(val: any, name: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                      fontSize: '11px',
                      padding: '8px 12px',
                      color: '#0f172a',
                    }}
                    labelStyle={{ color: '#0c326f', fontWeight: 'bold', marginBottom: '4px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}
                    itemStyle={{ color: '#1e293b', fontSize: '11px', padding: '2px 0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '4px' }} />
                  <Bar dataKey="Custo Total" fill="#ef4444" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="Benefício Bruto" fill="#3b82f6" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="Saldo Líquido" fill="#10b981" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Atribuição por Trilha */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
              <i className="fas fa-chart-pie text-[#1351b4]"></i>
              <span>Composição de Ganhos por Trilha</span>
            </span>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trilhaData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={4}
                    isAnimationActive={false}
                  >
                    {trilhaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any, name: any) => [`${val}%`, name || 'Participação']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                      fontSize: '11px',
                      padding: '8px 12px',
                      color: '#0f172a',
                    }}
                    labelStyle={{ color: '#0c326f', fontWeight: 'bold' }}
                    itemStyle={{ color: '#1e293b', fontSize: '11px', padding: '2px 0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '9.5px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Seção 3: Atribuição por Trilha & Fator de Reuso */}
        <div className="space-y-3 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1 m-0">
            3. Atribuição de Causalidade por Trilha & Fator de Reuso
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Distribuição de Causalidade por Trilha:</span>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Trilha Automação:</span>
                <span className="font-bold text-emerald-700">{percAuto}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Trilha Padronização de Processo:</span>
                <span className="font-medium text-slate-800">{percProc}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Trilha Evolução de Sistema Legado:</span>
                <span className="font-medium text-slate-800">{percSist}%</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Fator de Reuso e Potencial de Escala:</span>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Unidades Atendidas no Piloto:</span>
                <span className="font-bold text-slate-900">{registro.unidadesPiloto ?? 1} unidade(s)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Unidades Potenciais no Parque:</span>
                <span className="font-bold text-slate-900">{registro.unidadesPotenciais ?? 1} unidade(s)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Benefício Projetado em Escala:</span>
                <span className="font-bold text-[#1351b4]">
                  {(registro.beneficioPotencialEscala || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 4: Avaliação dos 12 Benefícios Intangíveis */}
        <div className="space-y-3 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1 m-0">
            4. Avaliação Qualitativa & Benefícios Intangíveis (12 Critérios Corporativos)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded border border-slate-200">
            {beneficiosList.map((b, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center space-x-1.5 truncate mr-1">
                  <i className={`fas ${b.icon} text-[#1351b4] text-[10px] w-3.5 text-center`}></i>
                  <span className="text-[10px] text-slate-700 font-medium truncate">{b.label}</span>
                </div>
                {getBeneficioBadge(b.value)}
              </div>
            ))}
          </div>
        </div>

        {/* Seção 5: Arquitetura da Solução TO BE & Dimensionamento */}
        <div className="space-y-3 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1 m-0">
            5. Arquitetura da Solução TO BE & Dimensionamento Técnico
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">Plataforma Tecnológica</span>
              <span className="font-bold text-slate-900 text-xs">{registro.tipoPlataformaNome || 'Python / Frameworks de Automação'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">Complexidade Técnica</span>
              <span className="font-bold text-slate-900 text-xs">{registro.complexidade || 'Média'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">Grade de Turno</span>
              <span className="font-bold text-slate-900 text-xs">{registro.turno || 'Diurno'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block uppercase">FTEs Liberáveis</span>
              <span className="font-bold text-[#1351b4] text-xs">{registro.fteLiberado || 0} FTE</span>
            </div>
          </div>

          {registro.descricaoSolucao && (
            <div className="p-3 bg-white border border-slate-200 rounded">
              <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                Arquitetura e Fluxo da Solução TO BE:
              </span>
              <p className="text-slate-800 m-0 leading-relaxed">{registro.descricaoSolucao}</p>
            </div>
          )}
        </div>

        {/* Rodapé de Assinaturas & Validação Institucional */}
        <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-12 text-center text-[10px] text-slate-700 break-inside-avoid">
          <div>
            <div className="border-t border-slate-400 pt-2 font-bold text-slate-900">
              Analista Técnico FCAIA / Centro de Excelência
            </div>
            <div className="text-slate-500 mt-0.5">Parecer Técnico, Custeio e Dimensionamento</div>
          </div>
          <div>
            <div className="border-t border-slate-400 pt-2 font-bold text-slate-900">
              Gestor / Solicitante da Área de Negócio
            </div>
            <div className="text-slate-500 mt-0.5">Validação de Premissas e Aprovação de Início</div>
          </div>
        </div>
      </div>
    </div>
  );
};
