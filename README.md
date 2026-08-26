# ⚡ Oportunidades de Automação (Automação Suite)

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

> Plataforma corporativa Fullstack para gestão estratégica, levantamento operacional, modelagem financeira e análise de viabilidade de oportunidades de automação de processos.

---

## 📋 Visão Geral da Aplicação

O **Oportunidades de Automação** é um sistema projetado para apoiar centros de excelência (CoE), líderes de operações e equipes de tecnologia na qualificação, priorização e acompanhamento de iniciativas de automação de processos. 

A plataforma consolida o ciclo de vida analítico da oportunidade em três pilares fundamentais:

### 1. 📊 Dashboard Analítico & Painel Executivo
* **Métricas Consolidadas de Negócio:** Visão em tempo real de FTEs liberáveis, retorno financeiro líquido (*ROI Ano 1 e Ano 2*), Payback médio e pontuação média de benefícios intangíveis.
* **Análise Comparativa de Custos (AS IS vs TO BE):** Gráficos dinâmicos que demonstram visualmente o custo operacional manual atual frente ao custo pós-automação no primeiro ano (com setup diluído) e nos anos subsequentes (custo recorrente).
* **Tabela de Priorização com Linhas Expansíveis (Master-Detail Inline):** Estrutura 100% responsiva (sem estouro de rolagem horizontal) com sincronização bidirecional de foco entre linhas e gráficos, além de expansão instantânea dos dossiês de diagnóstico, automação e retorno financeiro.
* **Filtros Avançados e Busca Global:** Segmentação imediata por área, status do processo, complexidade e busca textual com reatividade simultânea em todos os indicadores.

### 2. 📝 Levantamento e Dimensionamento Operacional
* **Diagnóstico AS IS (Situação Atual):** Mapeamento de periodicidade, tempo despendido (HH/mês), perfil do executor, custo hora de mão de obra e sistemas legados envolvidos.
* **Matriz Multidimensional de Benefícios:** Qualificação de ganhos qualitativos (aumento de capacidade, transformação digital, redução de erros, tempo de resposta, experiência do cliente e liberação de pessoas).
* **Solução TO BE & Simulador Instantâneo:** Definição da complexidade, turnos de execução (diurno, noturno, fins de semana) e dimensionamento de esforço de setup com recálculo matemático imediato durante o preenchimento.

### 3. ⚙️ Parametrização e Governança Financeira Global
* **Taxas de Custeio por Turno:** Modelagem precisa dos custos de infraestrutura de robôs, estações de trabalho, licenças, servidores e operadores de sala de controle ponderados por turno de execução.
* **Custos de Setup & Manutenção:** Gestão unificada do valor de hora de desenvolvimento e suporte operacional.
* **Pesos Ponderados de Benefícios:** Customização dos fatores de ponderação da matriz de decisão de acordo com as diretrizes estratégicas da organização.

---

## 🛠️ Stack Tecnológica

* **Linguagem:** TypeScript (End-to-End no backend e frontend).
* **Backend:** Node.js com Fastify estruturado em arquitetura modular limpa (`routes`, `controllers`, `services`, `lib`).
* **ORM & Banco de Dados:** Prisma ORM com SQLite para desenvolvimento local (`dev.db`) e suporte nativo a PostgreSQL para produção via `DATABASE_URL`.
* **Frontend:** React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts (Componentes modulares de alto desempenho).
* **DevOps & Containers:** Dockerfile multi-stage, `docker-compose.yml` e esteira automatizada `.gitlab-ci.yml`.

---

## 📐 Fórmulas Matemáticas Implementadas

### 1. Custo por Turno de Operação da Automação (R$/HH)
$$\text{Base} = \frac{\text{Servidor}}{\text{NrRobôs}} + (\text{Licença} + \text{Estação}) + \frac{\text{Operador}}{\text{NrRobôs}}$$
* **Turno Diurno (08h às 18h):** $\frac{\text{Base} \times \%_{\text{Diurno}}}{21 \times 10}$
* **Turno Noturno (18h às 08h):** $\frac{\text{Base} \times \%_{\text{Noturno}}}{21 \times 14}$
* **Turno Final de Semana:** $\frac{\text{Base} \times \%_{\text{FimDeSemana}}}{8 \times 24}$

### 2. Custo de Setup e Manutenção
* **Setup Mensal Diluído (12 meses):** $\text{Semanas} \times \frac{\text{CustoHoraDev} \times 40}{12}$
* **Hora de Manutenção:** $\frac{\text{Operador} \times 1.6}{168}$

### 3. ROI e Payback
* **FTE Liberado:** $\frac{\text{TempoExecução (h)}}{\text{CargaHorariaPadrao (160h)}}$
* **Custo TO BE (Ano 1):** $\text{Setup} + \text{HorasRobô} + \text{HorasApoioNegócio} + \text{HorasManutenção}$
* **ROI Ano 1:** $(\text{CustoMensalAtual} \times 12) - \text{CustoAnualAno1}$
* **Payback (meses):** $\frac{\text{CustoAnualAno1}}{\text{CustoMensalAtual}}$

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Node.js v20+ ou v22+
* npm v10+
* Docker e Docker Compose (opcional)

### 1. Instalação e Preparação Local

```bash
# 1. Instale as dependências
npm install

# 2. Gere o Prisma Client e crie as tabelas no SQLite
npm run prisma:push

# 3. Popule o banco com parâmetros padrão e registros exemplo
npm run prisma:seed
```

### 2. Executando em Modo de Desenvolvimento

```bash
# Roda simultaneamente o Backend Fastify (porta 8080) e Frontend Vite (porta 3000)
npm run dev
```

* **Frontend (Vite):** http://localhost:3000
* **API Backend (Fastify):** http://localhost:8080/api

---

## 🐳 Executando com Docker e Docker Compose

```bash
# Construir a imagem e subir o container com volume persistente em /data
docker-compose up --build -d
```

A aplicação estará disponível em **http://localhost:8080** (a API Fastify servirá os arquivos estáticos de produção do frontend e responderá aos endpoints REST).

---

## 🔌 Endpoints da API RESTful

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/parametros` | Retorna as configurações e taxas ativas |
| `PUT` | `/api/parametros` | Atualiza parâmetros globais e taxas de custeio |
| `GET` | `/api/registros` | Lista oportunidades (com filtros por `search`, `area`, `situacao`, `complexidade`) |
| `GET` | `/api/registros/:id` | Retorna um processo/levantamento específico |
| `POST` | `/api/registros` | Cria oportunidade calculando automaticamente os campos derivados |
| `PUT` | `/api/registros/:id` | Atualiza oportunidade recalculando com base nos parâmetros vigentes |
| `DELETE` | `/api/registros/:id` | Remove uma oportunidade |
| `GET` | `/api/analytics/resumo` | Retorna KPIs, gráficos e matriz (suporta `?registroId=...` para foco específico) |
| `GET` | `/api/health` | Healthcheck da API |

---

## 📁 Estrutura do Projeto

```
.
├── prisma/
│   ├── schema.prisma          # Modelos Parametro e Registro
│   └── seed.ts                # Carga inicial de dados
├── src/
│   ├── server/                # Backend Fastify + TypeScript
│   │   ├── controllers/       # Controladores REST
│   │   ├── services/          # Regras de negócio e motor de cálculos
│   │   ├── routes/            # Definição de rotas
│   │   ├── lib/               # Instância singleton do Prisma
│   │   └── index.ts           # Servidor HTTP e static files handler
│   └── client/                # Frontend React + Vite + Tailwind + Recharts
│       ├── src/
│       │   ├── components/    # Navbar, Modal, StatCard, RegistroFormModal
│       │   ├── pages/         # DashboardPage, RegistrosPage, ParametrosPage
│       │   ├── services/      # Cliente HTTP de integração
│       │   ├── types/         # Tipos TypeScript compartilhados
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       └── vite.config.ts
├── Dockerfile                 # Multi-stage container build
├── docker-compose.yml         # Orquestração local conteinerizada
├── .gitlab-ci.yml             # Pipeline de CI/CD para GitLab
└── README.md
```
