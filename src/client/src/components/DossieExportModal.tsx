import React, { useRef } from 'react';
import { Modal } from './Modal';
import { Registro, Parametro } from '../types';

interface DossieExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  registro: Registro | null;
  parametro?: Parametro | null;
}

export const DossieExportModal: React.FC<DossieExportModalProps> = ({
  isOpen,
  onClose,
  registro,
  parametro,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!registro) return null;

  const handlePrint = () => {
    window.open(`/?dossieId=${encodeURIComponent(registro.id)}`, '_blank');
  };

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
    A6: 'A6 — Racionalização de Ativos Técnicos (Consolidação de Robôs / Menor Sustentação)',
    A7: 'A7 — Processo Comercial e Oportunidade (Receita Adicional)',
  };

  const beneficioAnual = registro.beneficioLiquidoAnual || (registro.custoMensalAtual ? registro.custoMensalAtual * 12 : 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <i className="fas fa-file-invoice-dollar text-[#1351b4]"></i>
          <span className="font-bold text-[var(--govbr-blue-warm-vivid-90)]">
            Dossiê Executivo de Business Case — {registro.idAnalise}
          </span>
        </div>
      }
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Barra de Ações Superior (Oculta na Impressão) */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200 text-xs no-print">
          <div className="flex items-center space-x-2 text-slate-600">
            <i className="fas fa-info-circle text-[#1351b4]"></i>
            <span>Documento oficial padronizado para defesa orçamentária e instâncias decisórias do Serpro.</span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white font-bold rounded shadow-xs cursor-pointer transition-all"
          >
            <i className="fas fa-print"></i>
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>

        {/* Conteúdo Imprimível com Identidade Serpro & GOVBR DS */}
        <div
          ref={printRef}
          id="dossie-imprimivel"
          className="bg-white p-6 rounded-lg border border-slate-200 space-y-5 text-slate-900 font-['Rawline',sans-serif] text-xs leading-relaxed"
        >
          {/* Cabeçalho Institucional Oficial */}
          <div className="border-b-2 border-[#1351b4] pb-3 flex items-center justify-between avoid-break">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                SERPRO · FCAIA · SUPFC
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0c326f] m-0">
                Dossiê de Avaliação de Valor e Business Case de Automação
              </h2>
              <div className="text-xs text-slate-600 mt-0.5">
                Processo: <strong>{registro.nomeProcesso}</strong> ({registro.idAnalise})
              </div>
            </div>

            <div className="text-right space-y-1">
              <span
                className={`inline-block font-bold text-xs px-3 py-1 rounded-full border ${
                  mat === 'N0'
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : mat === 'N1'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : mat === 'N2'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-purple-100 text-purple-900 border-purple-300'
                }`}
              >
                {matLabels[mat] || mat}
              </span>
              <div className="text-[10px] text-slate-500">
                Data do Dossiê: {registro.dataLevantamento || new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Seção 1: Resumo Executivo & Identificação */}
          <div className="space-y-2.5 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1">
              1. Identificação da Demanda & Contexto
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">Área Solicitante:</span>
                <span className="font-bold text-slate-800">{registro.area || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ID Origem / Chamado:</span>
                <span className="font-bold text-slate-800">{registro.idOrigem || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Criticidade Percebida:</span>
                <span className="font-bold text-slate-800">{registro.criticidadePercebida || 'Média'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Situação no Portfólio:</span>
                <span className="font-bold text-slate-800">{registro.situacao || 'Em levantamento'}</span>
              </div>
            </div>

            {registro.sintomasDor && (
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                  Diagnóstico Qualitativo da Dor (Sintomas Relatados):
                </span>
                <p className="text-slate-700 m-0">{registro.sintomasDor}</p>
              </div>
            )}
          </div>

          {/* Seção 2: Arquétipo & Projeção Financeira Multi-Cenário */}
          <div className="space-y-2.5 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1">
              2. Classificação por Arquétipo & Fórmulas de Benefício
            </h3>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Arquétipo Primário de Valor:</span>
                <span className="font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {arqLabels[registro.arquetipoPrimario || 'A1'] || registro.arquetipoPrimario}
                </span>
              </div>
              {registro.arquetiposSecundarios && (
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Arquétipos Secundários:</span>
                  <span className="font-medium text-slate-700">{registro.arquetiposSecundarios}</span>
                </div>
              )}
            </div>

            {/* Tabela de Indicadores Financeiros */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="py-2 px-3">Indicador Financeiro</th>
                    <th className="py-2 px-3 text-right">Cenário Conservador</th>
                    <th className="py-2 px-3 text-right bg-blue-50/70 text-[#1351b4]">Cenário Base (Oficial)</th>
                    <th className="py-2 px-3 text-right">Cenário Otimista</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="py-1.5 px-3 font-semibold">Benefício Líquido Anual (R$)</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {((beneficioAnual * 0.8)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-1.5 px-3 text-right font-bold text-emerald-700 bg-blue-50/30">
                      {beneficioAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {((beneficioAnual * 1.2)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-semibold">VPL em 3 Anos (Taxa 12% a.a.)</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {(registro.vplCenarioConservador || (registro.vpl3Anos ? registro.vpl3Anos * 0.75 : 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-1.5 px-3 text-right font-bold text-cyan-800 bg-blue-50/30">
                      {(registro.vpl3Anos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {(registro.vplCenarioOtimista || (registro.vpl3Anos ? registro.vpl3Anos * 1.25 : 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-semibold">Payback Estimado</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {(registro.paybackCenarioConservador || (registro.paybackMeses ? registro.paybackMeses * 1.3 : 0)).toFixed(1)} meses
                    </td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-800 bg-blue-50/30">
                      {(registro.paybackMeses || 0).toFixed(1)} meses
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {(registro.paybackCenarioOtimista || (registro.paybackMeses ? registro.paybackMeses * 0.8 : 0)).toFixed(1)} meses
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-semibold">Investimento Inicial de Setup (Engenharia)</td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {((registro.investimentoSetup || 0) * 12 * 1.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-1.5 px-3 text-right font-bold text-slate-800 bg-blue-50/30">
                      {((registro.investimentoSetup || 0) * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="py-1.5 px-3 text-right text-slate-600">
                      {((registro.investimentoSetup || 0) * 12 * 0.9).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Seção 3: Trilha & Reuso */}
          <div className="space-y-2.5 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1">
              3. Atribuição por Trilha & Fator de Reuso
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Distribuição de Ganhos por Trilha:</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Automação (Robô/Fluxo):</span>
                  <span className="font-bold text-emerald-700">{((registro.percTrilhaAutomacao ?? 1.0) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Padronização de Processo:</span>
                  <span className="font-medium text-slate-700">{((registro.percTrilhaProcesso ?? 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Evolução de Sistema Legado:</span>
                  <span className="font-medium text-slate-700">{((registro.percTrilhaSistema ?? 0) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">Escalabilidade & Reuso:</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Unidades no Piloto:</span>
                  <span className="font-bold text-slate-800">{registro.unidadesPiloto ?? 1} unidade(s)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Unidades Potenciais (Parque):</span>
                  <span className="font-bold text-slate-800">{registro.unidadesPotenciais ?? 1} unidade(s)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Benefício Potencial em Escala:</span>
                  <span className="font-bold text-blue-800">
                    {(registro.beneficioPotencialEscala || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 4: Solução Técnica & Plataforma */}
          <div className="space-y-2.5 avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1351b4] border-b border-slate-200 pb-1">
              4. Arquitetura da Solução TO BE & Dimensionamento
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">Plataforma Tecnológica:</span>
                <span className="font-bold text-slate-800">{registro.tipoPlataformaNome || 'Python/Robot'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Complexidade:</span>
                <span className="font-bold text-slate-800">{registro.complexidade || 'Média'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Grade de Turno:</span>
                <span className="font-bold text-slate-800">{registro.turno || 'Diurno'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">FTEs Liberáveis:</span>
                <span className="font-bold text-blue-800">{registro.fteLiberado || 0} FTE</span>
              </div>
            </div>

            {registro.descricaoSolucao && (
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                  Arquitetura do Fluxo TO BE:
                </span>
                <p className="text-slate-700 m-0">{registro.descricaoSolucao}</p>
              </div>
            )}
          </div>

          {/* Rodapé de Assinaturas / Decisão */}
          <div className="pt-4 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-center text-[10px] text-slate-600 avoid-break">
            <div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Analista Técnico FCAIA / CoE
              </div>
              <div>Parecer Técnico e Dimensionamento</div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
                Gestor / Solicitante da Área de Negócio
              </div>
              <div>Validação de Premissas e Aprovação</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
