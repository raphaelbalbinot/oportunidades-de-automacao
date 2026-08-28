import { prisma } from '../lib/prisma.js';

export interface AnalyticsFilter {
  registroId?: string;
  area?: string;
  situacao?: string;
  nivelMaturidade?: string;
  arquetipo?: string;
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
    if (filter?.nivelMaturidade) {
      targetRegistros = targetRegistros.filter((r: any) => r.nivelMaturidade === filter.nivelMaturidade);
    }
    if (filter?.arquetipo) {
      targetRegistros = targetRegistros.filter((r: any) => r.arquetipoPrimario === filter.arquetipo);
    }

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

    const totalVpl3Anos = Number(dataset.reduce((acc: number, r: any) => acc + (r.vpl3Anos || 0), 0).toFixed(2));
    const totalBeneficioLiquidoAnual = Number(dataset.reduce((acc: number, r: any) => acc + (r.beneficioLiquidoAnual || 0), 0).toFixed(2));

    const validPaybacks = dataset.filter((r: any) => (r.paybackMeses || 0) > 0);
    const paybackMedio =
      validPaybacks.length > 0
        ? Number((validPaybacks.reduce((acc: number, r: any) => acc + (r.paybackMeses || 0), 0) / validPaybacks.length).toFixed(1))
        : 0;

    const pontuacaoMedia =
      dataset.length > 0
        ? Number((dataset.reduce((acc: number, r: any) => acc + (r.pontuacaoBeneficios || 0), 0) / dataset.length).toFixed(2))
        : 0;

    // 2. Gráfico: Distribuição por Maturidade (N0 a N3)
    const maturidadeCounts: Record<string, number> = { N0: 0, N1: 0, N2: 0, N3: 0 };
    dataset.forEach((r: any) => {
      const m = r.nivelMaturidade || 'N0';
      maturidadeCounts[m] = (maturidadeCounts[m] || 0) + 1;
    });
    const distribuicaoMaturidade = [
      { name: 'N0 - Oportunidade', value: maturidadeCounts['N0'] || 0, key: 'N0' },
      { name: 'N1 - Parcial', value: maturidadeCounts['N1'] || 0, key: 'N1' },
      { name: 'N2 - Completo', value: maturidadeCounts['N2'] || 0, key: 'N2' },
      { name: 'N3 - Realizado', value: maturidadeCounts['N3'] || 0, key: 'N3' },
    ];

    // 3. Gráfico: Distribuição por 7 Arquétipos
    const arquetipoLabels: Record<string, string> = {
      A1: 'A1 - Transacional',
      A2: 'A2 - Erro/Retrabalho',
      A3: 'A3 - Autosserviço',
      A4: 'A4 - Compliance/Risco',
      A5: 'A5 - Lead Time/Receita',
      A6: 'A6 - Racionalização',
      A7: 'A7 - Comercial',
    };
    const arquetipoCounts: Record<string, number> = { A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, A7: 0 };
    dataset.forEach((r: any) => {
      const a = (r.arquetipoPrimario || 'A1').toUpperCase();
      arquetipoCounts[a] = (arquetipoCounts[a] || 0) + 1;
    });
    const distribuicaoArquetipos = Object.entries(arquetipoCounts).map(([key, value]) => ({
      key,
      name: arquetipoLabels[key] || key,
      value,
    }));

    // 4. Gráfico: Distribuição por Complexidade
    const complexidadeCounts: Record<string, number> = { Baixa: 0, Média: 0, Alta: 0 };
    dataset.forEach((r: any) => {
      const c = r.complexidade || 'Média';
      complexidadeCounts[c] = (complexidadeCounts[c] || 0) + 1;
    });
    const distribuicaoComplexidade = Object.entries(complexidadeCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // 5. Gráfico: Distribuição por Turno
    let totalHorasDiurno = 0;
    let totalHorasNoturno = 0;
    let totalHorasFimSemana = 0;

    dataset.forEach((r: any) => {
      const hd = Number(r.horasRoboDiurno || 0);
      const hn = Number(r.horasRoboNoturno || 0);
      const hf = Number(r.horasRoboFimDeSemana || 0);
      const hr = Number(r.horasRobo || 0);

      if (hd === 0 && hn === 0 && hf === 0 && hr > 0) {
        const t = (r.turno || 'Diurno').toLowerCase();
        if (t.includes('noturno')) totalHorasNoturno += hr;
        else if (t.includes('fim') || t.includes('semana')) totalHorasFimSemana += hr;
        else totalHorasDiurno += hr;
      } else {
        totalHorasDiurno += hd;
        totalHorasNoturno += hn;
        totalHorasFimSemana += hf;
      }
    });

    const distribuicaoTurno = [
      { name: 'Diurno', value: Number(totalHorasDiurno.toFixed(1)) },
      { name: 'Noturno', value: Number(totalHorasNoturno.toFixed(1)) },
      { name: 'Final de Semana', value: Number(totalHorasFimSemana.toFixed(1)) },
    ];

    // 6. Gráfico: Distribuição por Situação
    const situacaoCounts: Record<string, number> = {};
    dataset.forEach((r: any) => {
      const s = r.situacao || 'Em levantamento';
      situacaoCounts[s] = (situacaoCounts[s] || 0) + 1;
    });
    const distribuicaoSituacao = Object.entries(situacaoCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // 7. Comparativo AS IS vs TO BE por Processo
    const comparativoProcessos = targetRegistros.map((r: any) => ({
      id: r.id,
      idOrigem: r.idOrigem || '-',
      idAnalise: r.idAnalise,
      nome: r.nomeProcesso,
      area: r.area,
      nivelMaturidade: r.nivelMaturidade || 'N0',
      arquetipoPrimario: r.arquetipoPrimario || 'A1',
      arquetiposSecundarios: r.arquetiposSecundarios || '',
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
      beneficioLiquidoAnual: r.beneficioLiquidoAnual || (r.custoMensalAtual ? r.custoMensalAtual * 12 : 0),
      roiAno1: r.roiAno1 || 0,
      roiAno2: r.roiAno2 || 0,
      paybackMeses: r.paybackMeses || 0,
      vpl3Anos: r.vpl3Anos || 0,
      vplCenarioConservador: r.vplCenarioConservador || 0,
      vplCenarioBase: r.vplCenarioBase || 0,
      vplCenarioOtimista: r.vplCenarioOtimista || 0,
      recomendacao: r.recomendacao || 'Recomendado',
      situacao: r.situacao || 'Em levantamento',
    }));

    // 8. Matriz de Priorização (Esforço x Impacto / Benefícios x ROI x VPL)
    const matrizPriorizacao = dataset.map((r: any) => ({
      id: r.id,
      idAnalise: r.idAnalise,
      nome: r.nomeProcesso,
      area: r.area,
      nivelMaturidade: r.nivelMaturidade || 'N0',
      arquetipo: r.arquetipoPrimario || 'A1',
      beneficiosScore: Number(((r.pontuacaoBeneficios || 0) * 100).toFixed(1)),
      roiAno1: r.roiAno1,
      vpl3Anos: r.vpl3Anos || 0,
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
        totalVpl3Anos,
        totalBeneficioLiquidoAnual,
        paybackMedio,
        pontuacaoMediaPercent: Number((pontuacaoMedia * 100).toFixed(1)),
      },
      distribuicaoMaturidade,
      distribuicaoArquetipos,
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
