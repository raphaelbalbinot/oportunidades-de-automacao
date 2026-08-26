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

> Plataforma corporativa Fullstack para gestão estratégica, levantamento operacional, dimensionamento com múltiplos turnos, catálogo de plataformas tecnológicas e análise de viabilidade de oportunidades de automação (RPA / Workflow / iPaaS / Low-Code).

---

## 📋 Visão Geral da Aplicação

O **Oportunidades de Automação** é um sistema corporativo projetado para apoiar centros de excelência (CoE), líderes de processos, arquitetos de soluções e executivos na qualificação, priorização e acompanhamento de iniciativas de automação de processos. 

A plataforma consolida o ciclo de vida analítico da oportunidade em quatro pilares fundamentais:

### 1. 📊 Dashboard Analítico & Painel Executivo
* **Métricas Consolidadas de Negócio:** Visão em tempo real de FTEs liberáveis, retorno financeiro líquido (*ROI Ano 1 e Ano 2*), Payback médio e pontuação média de benefícios intangíveis.
* **Análise Comparativa de Custos (AS IS vs TO BE):** Gráficos dinâmicos que demonstram visualmente o custo operacional manual atual frente ao custo pós-automação no primeiro ano (com setup diluído) e nos anos subsequentes (custo recorrente).
* **Distribuição por Turnos & Complexidade:** Gráficos interativos com discriminação explícita de escopo (global vs processo selecionado) e totalização do volume real de horas executadas em cada turno.
* **Tabela de Priorização com Linhas Expansíveis (Master-Detail Inline):** Estrutura responsiva com sincronização bidirecional de foco entre linhas e gráficos, além de expansão instantânea dos dossiês de diagnóstico, tecnologia adotada e projeções de retorno.

### 2. 📝 Levantamento e Dimensionamento Operacional
* **Diagnóstico AS IS (Situação Atual):** Mapeamento de periodicidade, tempo despendido (HH/mês), perfil do executor, custo hora de mão de obra e sistemas legados envolvidos.
* **Matriz Estratégica Corporativa (12 Critérios Universais):** Qualificação qualitativa ponderada cobrindo:
  1. *Liberar Capacidade Humana / Realocação de Pessoas*
  2. *Redução de Custos Operacionais*
  3. *Redução de Erros Operacionais*
  4. *Segurança da Informação & Privacidade de Dados (LGPD)*
  5. *Rastreabilidade & Conformidade (Compliance Empresarial)*
  6. *Mitigação de Dependência de Pessoas (Key-Person Risk)*
  7. *Experiência do Cliente / Usuário*
  8. *Capacidade Operacional & Escalabilidade*
  9. *Redução do Tempo de Resposta (SLA)*
  10. *Interoperabilidade & Integração entre Sistemas*
  11. *Transformação Digital & Inovação*
  12. *Sustentabilidade Operacional (ESG)*
* **Alocação de Horas em Múltiplos Turnos:** Dimensionamento combinando horas mensais em janelas Diurnas (08h às 18h), Noturnas (18h às 08h) e Fins de Semana, aplicando custeio financeiro ponderado exato.
* **Simulador Instantâneo:** Recálculo em tempo real do Score de Benefícios, Custos TO BE, ROI Líquido e Payback durante o preenchimento do formulário.

### 3. 🧩 Catálogo de Plataformas Tecnológicas
* **Gestão de Perfis de Tecnologia:** CRUD completo para modelagem de custos de licenças, estações de trabalho e diluição de servidores para tecnologias como:
  * 🐍 *Python & Robot Framework (Open Source / Cloud Native)*
  * ⚡ *n8n Workflow Automation (Self-Hosted Nuvem Gov / iPaaS)*
  * 🟦 *Microsoft Power Automate Desktop (RPA Corporativo)*
  * 🧩 *OutSystems / Low-Code Platform (RAD & Human-in-the-Loop)*

### 4. ⚙️ Parametrização e Governança Financeira Global
* **Taxas Operacionais por Turno:** Modelagem precisa dos custos de infraestrutura de robôs, servidores e operadores de sala de controle ponderados por turno.
* **Governança de Pesos:** Customização flexível dos pesos (1 a 3) dos 12 critérios corporativos.
* **Tooltips Contextuais:** Componente informativo explicativo integrado em todos os campos das telas de parametrização e cadastro de oportunidades.

---

## 🛠️ Stack Tecnológica

* **Linguagem:** TypeScript (End-to-End no backend e frontend).
* **Backend:** Node.js com Fastify estruturado em arquitetura modular limpa (`routes`, `controllers`, `services`, `lib`).
* **ORM & Banco de Dados:** Prisma ORM com SQLite para desenvolvimento local (`dev.db`) e suporte nativo a PostgreSQL para produção via `DATABASE_URL`.
* **Frontend:** React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts (Componentes modulares de alto desempenho).
* **DevOps & Containers:** Dockerfile multi-stage, `docker-compose.yml` e esteira automatizada `.gitlab-ci.yml`.

---

## 📐 Fórmulas Matemáticas Implementadas

### 1. Custo por Turno de Operação da Plataforma (R$/HH)
$$\text{Base} = \frac{\text{Servidor}}{\text{NrRobôs}} + (\text{Licença} + \text{Estação}) + \frac{\text{Operador}}{\text{NrRobôs}}$$
* **Turno Diurno (08h às 18h):** $\frac{\text{Base} \times \%_{\text{Diurno}}}{21 \times 10}$
* **Turno Noturno (18h às 08h):** $\frac{\text{Base} \times \%_{\text{Noturno}}}{21 \times 14}$
* **Turno Final de Semana:** $\frac{\text{Base} \times \%_{\text{FimDeSemana}}}{8 \times 24}$

### 2. Custo Total de Execução do Robô (Múltiplos Turnos)
$$\text{CustoHorasRobô} = (H_{\text{diurno}} \times T_{\text{diurna}}) + (H_{\text{noturno}} \times T_{\text{noturna}}) + (H_{\text{fimSemana}} \times T_{\text{fimSemana}})$$

### 3. Custo de Setup e Manutenção
* **Setup Mensal Diluído (12 meses):** $\text{Semanas} \times \frac{\text{CustoHoraDev} \times 40}{12}$
* **Hora de Manutenção:** $\frac{\text{Operador} \times 1.6}{168}$

### 4. ROI e Payback
* **FTE Liberado:** $\frac{\text{TempoExecução (h)}}{\text{CargaHorariaPadrao (160h)}}$
* **Custo TO BE (Ano 1):** $\text{Setup} + \text{CustoHorasRobô} + \text{HorasApoioNegócio} + \text{HorasManutenção}$
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

# 2. Sincronize o banco com o schema Prisma
npm run prisma:push

# 3. Popule o banco com perfis de plataforma e registros de exemplo
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
| `GET` | `/api/parametros` | Retorna as configurações, pesos dos 12 critérios e taxas ativas |
| `PUT` | `/api/parametros` | Atualiza parâmetros globais e pesos da matriz |
| `GET` | `/api/perfis-plataforma` | Lista o catálogo de plataformas tecnológicas |
| `POST` | `/api/perfis-plataforma` | Cria um novo perfil tecnológico com seus custos |
| `PUT` | `/api/perfis-plataforma/:id` | Atualiza um perfil tecnológico |
| `DELETE` | `/api/perfis-plataforma/:id` | Remove um perfil tecnológico |
| `GET` | `/api/registros` | Lista oportunidades (com filtros por `search`, `area`, `situacao`, `complexidade`) |
| `GET` | `/api/registros/:id` | Retorna um processo/levantamento específico |
| `POST` | `/api/registros` | Cria oportunidade calculando automaticamente os campos derivados e múltiplos turnos |
| `PUT` | `/api/registros/:id` | Atualiza oportunidade recalculando com base nos parâmetros vigentes |
| `DELETE` | `/api/registros/:id` | Remove uma oportunidade |
| `GET` | `/api/analytics/resumo` | Retorna KPIs, gráficos e matriz (suporta `?registroId=...` para foco específico) |
| `GET` | `/api/health` | Healthcheck da API |

---

## 📁 Estrutura do Projeto

```
.
├── prisma/
│   ├── schema.prisma          # Modelos Parametro, PerfilPlataforma e Registro
│   └── seed.ts                # Carga inicial de dados corporativos
├── src/
│   ├── server/                # Backend Fastify + TypeScript
│   │   ├── controllers/       # Controladores REST
│   │   ├── services/          # Regras de negócio e motor de cálculos
│   │   ├── routes/            # Definição de rotas da API
│   │   ├── lib/               # Instância singleton do Prisma
│   │   └── index.ts           # Servidor HTTP e static files handler
│   └── client/                # Frontend React + Vite + Tailwind + Recharts
│       ├── src/
│       │   ├── components/    # Navbar, Modal, StatCard, RegistroFormModal, Tooltip
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
