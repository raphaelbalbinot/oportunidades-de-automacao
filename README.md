# 🤖 Oportunidades de Automação (RPA Suite)

> Boilerplate Fullstack moderno, modular e pronto para produção para levantamento, parametrização e análise de viabilidade de oportunidades de automação de processos robotizados (RPA).

---

## 📋 Visão Geral da Aplicação

Esta aplicação replica com fidelidade matemática as regras de negócio da planilha analítica [`docs/Oportunidades-de-Automação.xlsx`](docs/Oportunidades-de-Automação.xlsx), organizada em três áreas principais:

1. **Parametrização (Configuração Global):** Tabela singleton com taxas de infraestrutura de robôs, custos de servidores, operadores, valores de desenvolvimento, percentuais de custo por turnos e pesos de benefícios intangíveis (aba *Parâmetros*).
2. **CRUD Operacional de Processos:** Cadastro detalhado do processo AS IS (situação manual atual), avaliação na matriz de benefícios intangíveis e estimativas TO BE (solução de robô, esforço de setup, horas de manutenção). Os valores calculados são congelados no momento do cadastro/edição (aba *Levantamento*).
3. **Dashboard Analítico & Viabilidade:** KPIs executivos consolidados (total de FTE liberado, ROI Ano 1, ROI 2 Anos, Payback em meses), comparativos gráficos de custos mensais AS IS vs TO BE, distribuição por complexidade e turno, com suporte a **visão global agregada** ou **foco por projeto específico selecionado** (aba *Análise*).

---

## 🛠️ Stack Tecnológica

* **Linguagem:** TypeScript (End-to-End no backend e frontend).
* **Backend:** Node.js com Fastify estruturado em camadas (`routes`, `controllers`, `services`, `lib`).
* **ORM & Banco de Dados:** Prisma ORM com SQLite para desenvolvimento local (arquivo `dev.db`) e preparado para PostgreSQL via `DATABASE_URL`.
* **Frontend:** React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts.
* **DevOps & Containers:** Dockerfile multi-stage, `docker-compose.yml` e `.gitlab-ci.yml`.

---

## 📐 Fórmulas Matemáticas Implementadas

### 1. Custo por Turno de Operação do Robô (R$/HH)
$$\text{Base} = \frac{\text{Servidor}}{\text{NrRobôs}} + (\text{Licença} + \text{Estação}) + \frac{\text{Operador}}{\text{NrRobôs}}$$
* **Turno Diurno (08h às 18h):** $\frac{\text{Base} \times \%_{\text{Diurno}}}{21 \times 10}$ (Padrão: ~R$ 24,57/h)
* **Turno Noturno (18h às 08h):** $\frac{\text{Base} \times \%_{\text{Noturno}}}{21 \times 14}$ (Padrão: ~R$ 8,78/h)
* **Turno Final de Semana:** $\frac{\text{Base} \times \%_{\text{FimDeSemana}}}{8 \times 24}$ (Padrão: ~R$ 4,48/h)

### 2. Custo de Setup e Manutenção
* **Setup Mensal Diluído (12 meses):** $\text{Semanas} \times \frac{\text{CustoHoraDev} \times 40}{12}$ (Ex: R$ 550,00/mês por semana de esforço)
* **Hora de Manutenção:** $\frac{\text{Operador} \times 1.6}{168}$ (Padrão: ~R$ 38,10/h)

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
* Docker e Docker Compose (opcional para rodar conteinerizado)

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
│   │   └── index.ts           # Inicialização do servidor e static handler
│   └── client/                # Frontend React + Vite + Tailwind + Recharts
│       ├── src/
│       │   ├── components/    # Navbar, Modal, StatCard, RegistroFormModal
│       │   ├── pages/         # DashboardPage, RegistrosPage, ParametrosPage
│       │   ├── services/      # Cliente de API HTTP
│       │   ├── types/         # Tipos TypeScript compartilhados
│       │   ├── App.tsx
│       │   └── main.tsx
├── Dockerfile                 # Multi-stage build
├── docker-compose.yml         # Orquestração local com volume persistente
├── .gitlab-ci.yml             # Pipeline de CI/CD para GitLab
└── README.md
```
