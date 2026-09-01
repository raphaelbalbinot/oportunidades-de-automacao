import { CalculationService } from '../services/calculation.service.js';
import { InstrumentacaoService } from '../services/instrumentacao.service.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ OK: ${message}`);
  }
}

async function runTests() {
  console.log('🧪 Iniciando Execução do Plano de Verificação Automatizado (V2.0)...');

  const parametroMock: any = {
    pesoLiberarPessoas: 3,
    pesoReduzirCusto: 3,
    pesoReduzirErros: 3,
    pesoSegurancaPrivacidade: 3,
    pesoRastreabilidadeCompliance: 3,
    pesoKeyPersonRisk: 2,
    pesoMelhorarExpCliente: 2,
    pesoAumentarCapacidade: 2,
    pesoReduzirTempoResposta: 2,
    pesoInteroperabilidade: 2,
    pesoTransformacaoDigital: 1,
    pesoSustentabilidadeEsg: 1,
    pesoReduzirFte: 0,
    cargaHorariaPadrao: 160,
    operadorSalaControle: 7500,
    servidor: 1150.70,
    licencaRobo: 0,
    estacaoTrabalhoRobo: 0,
    nrRobos: 5,
    percDiurno: 0.60,
    percNoturno: 0.30,
    percFimDeSemana: 0.10,
    salarioDesenvolvedorI: 10000,
    salarioDesenvolvedorII: 18500,
    salarioDesenvolvedorIII: 26000,
    custoHoraDesenvolvimento: 185,
    taxaDescontoVpl: 0.12,
    horizonteVplMeses: 36,
  };

  // 1. Teste de Transição e Classificação de Maturidade
  console.log('\n--- 1. Validação do Funil de Maturidade (N0 a N3) ---');
  const matN0 = CalculationService.determinarNivelMaturidade({
    nomeProcesso: 'Demanda Crua',
    sintomasDor: 'Muitos erros manuais',
  });
  assert(matN0 === 'N0', 'Demanda sem tempo/volume é classificada como N0');

  const matN1 = CalculationService.determinarNivelMaturidade({
    nomeProcesso: 'Processo em Mapeamento',
    tempoExecucao: 80,
    custoMensalAtual: 5000,
    arquetipoPrimario: 'A1',
  });
  assert(matN1 === 'N1', 'Demanda com custo/tempo mas sem plataforma TO BE é classificada como N1');

  const matN2 = CalculationService.determinarNivelMaturidade({
    nomeProcesso: 'Processo Completo',
    tempoExecucao: 120,
    custoMensalAtual: 7800,
    arquetipoPrimario: 'A1',
    tipoPlataformaNome: 'Python',
    esforcoSetupSemanas: 3,
    horasRobo: 100,
  });
  assert(matN2 === 'N2', 'Demanda com TO BE completo e esforço é classificada como N2');

  const matN3 = CalculationService.determinarNivelMaturidade({
    nomeProcesso: 'Processo Entregue',
    tempoExecucao: 120,
    custoMensalAtual: 7800,
    arquetipoPrimario: 'A1',
    tipoPlataformaNome: 'Python',
    esforcoSetupSemanas: 3,
    horasRobo: 100,
    beneficioRealizadoAnual: 74000,
  });
  assert(matN3 === 'N3', 'Demanda com benefício realizado é classificada como N3');

  // 2. Teste das Fórmulas dos 7 Arquétipos
  console.log('\n--- 2. Validação dos 7 Arquétipos de Benefício em R$ ---');

  // A1: Horas de Trabalho Liberadas
  const calcA1 = CalculationService.calculate(
    {
      tempoExecucao: 120,
      custoMensalAtual: 6000,
      arquetipoPrimario: 'A1',
      percAutomatizavel: 0.8,
      percTrilhaAutomacao: 1.0,
      esforcoSetupSemanas: 2,
      horasRoboDiurno: 40,
    },
    parametroMock
  );
  assert(calcA1.beneficioLiquidoAnual > 0, 'Arquétipo A1 calcula benefício financeiro positivo');

  // A2: Erro e Retrabalho
  const calcA2 = CalculationService.calculate(
    {
      tempoExecucao: 60,
      custoMensalAtual: 3000,
      numExecucoes: 1000,
      taxaErroAtual: 0.10,
      custoMedioErro: 50,
      reducaoEsperadaErro: 0.90,
      arquetipoPrimario: 'A2',
      percTrilhaAutomacao: 1.0,
      esforcoSetupSemanas: 2,
    },
    parametroMock
  );
  assert(calcA2.beneficioLiquidoAnual > 0, 'Arquétipo A2 calcula benefício de mitigação de erros');

  // A4: Conformidade / Risco / Glosas
  const calcA4 = CalculationService.calculate(
    {
      tempoExecucao: 40,
      custoMensalAtual: 2500,
      impactoFinanceiroOcorrencia: 100000,
      probabilidadeDescumprimento: 0.20,
      reducaoProbabilidadeRisco: 0.90,
      arquetipoPrimario: 'A4',
      percTrilhaAutomacao: 0.80,
      esforcoSetupSemanas: 3,
    },
    parametroMock
  );
  assert(calcA4.beneficioLiquidoAnual > 0, 'Arquétipo A4 calcula valor de mitigação de risco com atribuição de trilha');

  // A6: Racionalização Técnica (Consolidação de robôs)
  const calcA6 = CalculationService.calculate(
    {
      tempoExecucao: 100,
      custoMensalAtual: 7000,
      nrAtivosAntes: 8,
      nrAtivosDepois: 1,
      custoManutencaoAnualAtivo: 12000,
      arquetipoPrimario: 'A6',
      percTrilhaAutomacao: 0.75,
      esforcoSetupSemanas: 4,
    },
    parametroMock
  );
  assert(calcA6.beneficioLiquidoAnual > 0, 'Arquétipo A6 calcula economia por redução de sustentação técnica');

  // A7: Processo Comercial / Receita
  const calcA7 = CalculationService.calculate(
    {
      tempoExecucao: 50,
      custoMensalAtual: 3500,
      numSolicitacoesComerciaisMes: 50,
      taxaConversaoAtual: 0.20,
      taxaConversaoAlvo: 0.35,
      ticketMedioProposta: 15000,
      arquetipoPrimario: 'A7',
      percTrilhaAutomacao: 0.70,
      esforcoSetupSemanas: 4,
    },
    parametroMock
  );
  assert(calcA7.beneficioLiquidoAnual > 0, 'Arquétipo A7 calcula receita adicional convertida');

  // 3. Teste de VPL e Cenários de Sensibilidade
  console.log('\n--- 3. Validação de VPL (3 Anos) e Cenários ---');
  const vplValor = CalculationService.calcularVPL(20000, 30000, 30000, 30000, 0.12);
  assert(vplValor > 0, `VPL em 3 anos positivo (calculado: R$ ${vplValor.toFixed(2)})`);

  const calcCenarios = CalculationService.calculate(
    {
      tempoExecucao: 120,
      custoMensalAtual: 8000,
      arquetipoPrimario: 'A1',
      esforcoSetupSemanas: 3,
      horasRoboDiurno: 50,
    },
    parametroMock
  );
  assert(calcCenarios.vpl3Anos > 0, `VPL Base calculado: R$ ${calcCenarios.vpl3Anos.toFixed(2)}`);
  assert(calcCenarios.vplCenarioConservador < calcCenarios.vpl3Anos, 'VPL Cenário Conservador é menor que o Cenário Base');
  assert(calcCenarios.vplCenarioOtimista > calcCenarios.vpl3Anos, 'VPL Cenário Otimista é maior que o Cenário Base');

  // 4. Teste do Diagnóstico de Instrumentação
  console.log('\n--- 4. Validação do Diagnóstico de Instrumentação ---');
  const diag = InstrumentacaoService.gerarDiagnostico({
    nomeProcesso: 'Processo com Pendências',
    sintomasDor: 'Processo manual demorado',
  });
  assert(diag.pendencias.length > 0, `Diagnóstico detectou ${diag.pendencias.length} pendências para promoção`);
  assert(diag.pendencias[0].ondeEncontrar.length > 0, 'Cada pendência indica a fonte do dado');

  // 5. Teste dos 3 Perfis de Desenvolvedores
  console.log('\n--- 5. Validação dos 3 Perfis de Desenvolvedores (I, II, III) ---');
  const horaDevI = CalculationService.getCustoHoraDesenvolvedor(parametroMock, 'Desenvolvedor I');
  const horaDevII = CalculationService.getCustoHoraDesenvolvedor(parametroMock, 'Desenvolvedor II');
  const horaDevIII = CalculationService.getCustoHoraDesenvolvedor(parametroMock, 'Desenvolvedor III');

  assert(horaDevI === 100, `Desenvolvedor I calcula R$ 100/h a partir de R$ 10.000/mês (obtido: ${horaDevI})`);
  assert(horaDevII === 185, `Desenvolvedor II calcula R$ 185/h a partir de R$ 18.500/mês (obtido: ${horaDevII})`);
  assert(horaDevIII === 260, `Desenvolvedor III calcula R$ 260/h a partir de R$ 26.000/mês (obtido: ${horaDevIII})`);

  const calcDevI = CalculationService.calculate(
    {
      tempoExecucao: 80,
      custoMensalAtual: 5000,
      arquetipoPrimario: 'A1',
      perfilDesenvolvedor: 'Desenvolvedor I',
      esforcoSetupSemanas: 2,
    },
    parametroMock
  );

  const calcDevIII = CalculationService.calculate(
    {
      tempoExecucao: 80,
      custoMensalAtual: 5000,
      arquetipoPrimario: 'A1',
      perfilDesenvolvedor: 'Desenvolvedor III',
      esforcoSetupSemanas: 2,
    },
    parametroMock
  );

  assert(calcDevIII.investimentoSetup > calcDevI.investimentoSetup, 'Setup com Desenvolvedor III é mais caro que com Desenvolvedor I para a mesma duração');

  // 6. Teste do Score Composto Ponderado de Priorização
  console.log('\n--- 6. Validação do Score Composto Ponderado de Priorização ---');
  const calcScore = CalculationService.calculate(
    {
      tempoExecucao: 120,
      custoMensalAtual: 8000,
      arquetipoPrimario: 'A1',
      percAutomatizavel: 0.9,
      percTrilhaAutomacao: 1.0,
      esforcoSetupSemanas: 2,
      benLiberarPessoas: 'principal',
      benReduzirCusto: 'bastante',
      benReduzirErros: 'bastante',
      benSegurancaPrivacidade: 'principal',
      benRastreabilidadeCompliance: 'principal',
      benKeyPersonRisk: 'bastante',
      benMelhorarExpCliente: 'bastante',
      benAumentarCapacidade: 'bastante',
      benReduzirTempoResposta: 'bastante',
      benInteroperabilidade: 'bastante',
      benTransformacaoDigital: 'principal',
      benSustentabilidadeEsg: 'pouco',
    },
    parametroMock
  );

  assert(calcScore.scorePriorizacao > 0 && calcScore.scorePriorizacao <= 100, `Score de Priorização calculado dentro do range [0, 100] (obtido: ${calcScore.scorePriorizacao})`);
  assert(calcScore.scorePriorizacao >= 50, `Demanda com alto retorno e alto score intangível recebe nota relevante (obtido: ${calcScore.scorePriorizacao})`);

  console.log('\n🎉 TODOS OS TESTES DO PLANO DE VERIFICAÇÃO PASSARAM COM SUCESSO!\n');
}

runTests().catch((err) => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
