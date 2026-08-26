import { prisma } from '../lib/prisma.js';

export interface AnalyticsFilter {
  registroId?: string;
  area?: string;
  situacao?: string;
}

export class AnalyticsService {
  static async getResumo(filter?: AnalyticsFilter) {
    const allRegistros = await prisma.registro.findMany({
      include: {
        perfilPlataforma: true,
      },
      orderBy: { roiAno1: 'desc' },
    });

    let targetRegistros: any[] = allRegistros;

    if (filter?.area) {
      targetRegistros = targetRegistros.filter((r: any) => r.area === filter.area);
    }
    if (filter?.situacao) {
      targetRegistros = targetRegistros.filter((r: any) => r.situacao === filter.situacao);
    }

    // Se um registro específico foi selecionado
    const selectedRecord = filter?.registroId
      ? allRegistros.find((r: any) => r.id === filter.registroId)
      : null;

    const dataset: any[] = selectedRecord ? [selectedRecord] : targetRegistros;

    // 1. KPIs
    const totalProcessos = dataset.length;
    const totalFteLiberado = Number(dataset.reduce((acc: number, r: any) => acc + (r.fteLiberado || 0), 0).toFixed(2));
    const custoAtualMensalTotal = Number(dataset.reduce((acc: number, r: any) => acc + (r.custoMensalAtual || 0), 0).toFixed(2));
    const custoMensalAno1Total = Number(dataset.reduce((acc: number, r: any) => acc + (r.custoMensalAno1 || 0), 0).toFixed(2));
    const custoMensalAno2Total = Number(dataset.reduce((acc: number, r: any) => acc + (r.custoMensalAno2 || 0), 0).toFixed(2));
    const investimentoSetupTotal = Number(dataset.reduce((acc: number, r: any) => acc + (r.investimentoSetup || 0), 0).toFixed(2));
    const roiAno1Total = Number(dataset.reduce((acc: number, r: any) => acc + (r.roiAno1 || 0), 0).toFixed(2));
    const roiAno2Total = Number(dataset.reduce((acc: number, r: any) => acc + (r.roiAno2 || 0), 0).toFixed(2));

    const validPaybacks = dataset.filter((r: any) => (r.paybackMeses || 0) > 0);
    const paybackMedio =
      validPaybacks.length > 0
        ? Number((validPaybacks.reduce((acc: number, r: any) => acc + (r.paybackMeses || 0), 0) / validPaybacks.length).toFixed(1))
        : 0;

    const pontuacaoMedia =
      dataset.length > 0
        ? Number((dataset.reduce((acc: number, r: any) => acc + (r.pontuacaoBeneficios || 0), 0) / dataset.length).toFixed(2))
        : 0;

    // 2. Gráfico: Distribuição por Complexidade
    const complexidadeCounts: Record<string, number> = { Baixa: 0, Média: 0, Alta: 0 };
    dataset.forEach((r: any) => {
      const c = r.complexidade || 'Média';
      complexidadeCounts[c] = (complexidadeCounts[c] || 0) + 1;
    });
    const distribuicaoComplexidade = Object.entries(complexidadeCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // 3. Gráfico: Distribuição por Turno
    const turnoCounts: Record<string, number> = { Diurno: 0, Noturno: 0, 'Final de Semana': 0 };
    dataset.forEach((r: any) => {
      const t = r.turno || 'Diurno';
      turnoCounts[t] = (turnoCounts[t] || 0) + 1;
    });
    const distribuicaoTurno = Object.entries(turnoCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // 4. Gráfico: Distribuição por Situação
    const situacaoCounts: Record<string, number> = {};
    dataset.forEach((r: any) => {
      const s = r.situacao || 'Em levantamento';
      situacaoCounts[s] = (situacaoCounts[s] || 0) + 1;
    });
    const distribuicaoSituacao = Object.entries(situacaoCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // 5. Comparativo AS IS vs TO BE por Processo
    const comparativoProcessos = targetRegistros.map((r: any) => ({
      id: r.id,
      idOrigem: r.idOrigem || '-',
      idAnalise: r.idAnalise,
      nome: r.nomeProcesso,
      area: r.area,
      periodicidade: r.periodicidade || 'Mensal',
      custoAtualMensal: r.custoMensalAtual || 0,
      perfilExecutor: r.perfilExecutor || '-',
      tempoExecucao: r.tempoExecucao || 0,
      sistemasEnvolvidos: r.sistemasEnvolvidos || '-',
      complexidade: r.complexidade || 'Média',
      tipoPlataformaNome: r.tipoPlataformaNome || 'Python & Robot Framework (Open Source)',
      pontuacaoBeneficios: Number(((r.pontuacaoBeneficios || 0) * 100).toFixed(1)),
      fteLiberado: r.fteLiberado || 0,
      reducaoCustoPrevista: r.reducaoCustoPrevista || '0%',
      reducaoTempoPrevista: r.reducaoTempoPrevista || '0%',
      investimentoSetup: r.investimentoSetup || 0,
      custoToBeMensalAno1: r.custoMensalAno1 || 0,
      custoToBeMensalAno2: r.custoMensalAno2 || 0,
      economiaMensalAno1: Number(((r.custoMensalAtual || 0) - (r.custoMensalAno1 || 0)).toFixed(2)),
      roiAno1: r.roiAno1 || 0,
      roiAno2: r.roiAno2 || 0,
      paybackMeses: r.paybackMeses || 0,
      recomendacao: r.recomendacao || 'Recomendado',
      situacao: r.situacao || 'Em levantamento',
    }));

    // 6. Matriz de Priorização (Pontuação Benefícios vs ROI vs Complexidade)
    const matrizPriorizacao = dataset.map((r: any) => ({
      id: r.id,
      idAnalise: r.idAnalise,
      nome: r.nomeProcesso,
      area: r.area,
      beneficiosScore: Number(((r.pontuacaoBeneficios || 0) * 100).toFixed(1)),
      roiAno1: r.roiAno1,
      fte: r.fteLiberado,
      complexidade: r.complexidade,
      payback: r.paybackMeses,
      recomendacao: r.recomendacao,
    }));

    return {
      isSpecificRecord: !!selectedRecord,
      selectedRecord: selectedRecord || null,
      kpis: {
        totalProcessos,
        totalFteLiberado,
        custoAtualMensalTotal,
        custoMensalAno1Total,
        custoMensalAno2Total,
        investimentoSetupTotal,
        roiAno1Total,
        roiAno2Total,
        paybackMedio,
        pontuacaoMediaPercent: Number((pontuacaoMedia * 100).toFixed(1)),
      },
      distribuicaoComplexidade,
      distribuicaoTurno,
      distribuicaoSituacao,
      comparativoProcessos,
      matrizPriorizacao,
      todosProcessosDisponiveis: allRegistros.map((r: any) => ({
        id: r.id,
        idAnalise: r.idAnalise,
        nomeProcesso: r.nomeProcesso,
        area: r.area,
      })),
    };
  }
}
