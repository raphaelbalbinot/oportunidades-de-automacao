import React, { useState, useEffect } from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontScale, setFontScale] = useState<number>(100);


  useEffect(() => {
    const isDark = localStorage.getItem('serpro_contrast_mode') === 'true';
    if (isDark) {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleContrast = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('serpro_contrast_mode', String(nextMode));
    if (nextMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleFontChange = (delta: number) => {
    setFontScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 85), 130);
      document.documentElement.style.fontSize = `${(next / 100) * 16}px`;
      return next;
    });
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40 font-['Rawline',sans-serif]">
      {/* 1. Barra de Acessibilidade Superior Oficial (serpro.gov.br) */}
      <div className="accessibility-bar bg-[#f8f9fa] border-b border-slate-200 px-4 sm:px-8 py-1 text-[11px] text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a
            href="#conteudo-principal"
            className="hover:text-[var(--govbr-blue-warm-vivid-70)] flex items-center space-x-1.5 font-medium transition-colors"
          >
            <i className="fas fa-universal-access text-[var(--govbr-blue-warm-vivid-70)]"></i>
            <span>Acessibilidade</span>
          </a>

          <button
            type="button"
            onClick={toggleContrast}
            className={`hover:text-[var(--govbr-blue-warm-vivid-70)] flex items-center space-x-1.5 font-medium transition-colors px-2 py-0.5 rounded cursor-pointer ${
              darkMode ? 'bg-[#0c326f] text-white font-bold border border-blue-400' : 'border border-slate-300'
            }`}
            title="Alternar modo de Alto Contraste (WCAG AAA)"
          >
            <i className="fas fa-adjust"></i>
            <span>Alto contraste</span>
          </button>

          <div className="flex items-center space-x-1 pl-2 border-l border-slate-300">
            <button
              type="button"
              onClick={() => handleFontChange(-5)}
              className="btn-font-scale px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-bold cursor-pointer text-slate-700 hover:text-[var(--govbr-blue-warm-vivid-70)] text-[10px]"
              title="Diminuir fonte (A-)"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontChange(5)}
              className="btn-font-scale px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-bold cursor-pointer text-slate-700 hover:text-[var(--govbr-blue-warm-vivid-70)] text-[10px]"
              title="Aumentar fonte (A+)"
            >
              A+
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-600">
          <a
            href="https://www.serpro.gov.br/switchLanguage?set_language=pt-br"
            className="flex items-center space-x-1.5 hover:text-[var(--govbr-blue-warm-vivid-70)] font-semibold text-slate-700 transition-colors"
            title="Português (Brasil)"
          >
            <span className="text-xs">🇧🇷</span>
            <span>Português (Brasil)</span>
          </a>
        </div>
      </div>

      {/* 2. Cabeçalho Principal (Linha Superior: Logo Serpro + Links Institucionais Oficiais + Área do Cliente) */}
      <div className="header-main-line px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Esquerda: Logo Oficial Serpro + Divisor Vertical */}
        <div className="flex items-center">
          <a
            href="https://www.serpro.gov.br"
            target="_blank"
            rel="noreferrer"
            className="flex items-center cursor-pointer"
            aria-label="Portal Oficial Serpro"
          >
            <img
              src={darkMode ? '/assets/marca-serpro-rodape.png' : '/assets/marca-serpro.png'}
              alt="Serpro"
              className="h-9 w-auto object-contain"
            />
          </a>
          <span className="h-7 w-px bg-slate-300 mx-4 hidden sm:block divider-line"></span>
        </div>

        {/* Direita: Links Institucionais Canônicos Serpro + Divisor + Área do Cliente */}
        <div className="flex items-center space-x-4 lg:space-x-6 text-[14px] font-normal header-links-group font-['Rawline','Raleway',sans-serif]">
          <div className="hidden xl:flex items-center space-x-6">
            <a href="https://www.serpro.gov.br/menu/quem-somos" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Empresa
            </a>
            <a href="https://www.serpro.gov.br/insights" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Insights
            </a>
            <a href="https://www.serpro.gov.br/privacidade-protecao-dados" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Privacidade
            </a>
            <a href="https://www.serpro.gov.br/menu/suporte/css" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Suporte
            </a>
            <a href="https://www.serpro.gov.br/menu/suporte/downloads/downloads-e-softwares" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Download e Software
            </a>
            <a href="https://www.serpro.gov.br/imprensa" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Imprensa
            </a>
            <a href="https://www.serpro.gov.br/menu/contato/cliente/cliente/@@template_contato" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors">
              Contato
            </a>
            <a href="https://www.transparencia.serpro.gov.br/acesso-a-informacao" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] flex items-center space-x-1 hover:underline transition-colors">
              <span>Acesso à informação</span>
              <i className="fas fa-external-link-alt text-[10px] ml-0.5"></i>
            </a>
            <a href="https://loja.serpro.gov.br/?utm_source=portal&utm_medium=menu&utm_campaign=home-serpro" target="_blank" rel="noreferrer" className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] flex items-center space-x-1 hover:underline transition-colors">
              <span>Loja Serpro</span>
              <i className="fas fa-external-link-alt text-[10px] ml-0.5"></i>
            </a>
          </div>

          <span className="h-6 w-px bg-slate-300 mx-2 hidden sm:block divider-line"></span>

          {/* Botão Oficial em Pílula: Área do cliente */}
          <a
            href="http://cliente.serpro.gov.br/"
            target="_blank"
            rel="noreferrer"
            className="btn-area-cliente flex items-center space-x-2 px-4 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:text-[var(--govbr-blue-warm-vivid-70)] hover:border-[var(--govbr-blue-warm-vivid-70)] bg-white hover:bg-slate-50 transition-all font-normal text-[13px] cursor-pointer"
          >
            <i className="far fa-user text-xs"></i>
            <span>Área do cliente</span>
          </a>
        </div>
      </div>

      {/* 3. Linha Inferior: Hambúrguer Menu + Título do Sistema + Campo de Busca Oficial */}
      <div className="header-title-line px-4 sm:px-8 py-2.5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Esquerda: Hambúrguer + Título */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="btn-menu-trigger p-2 text-[var(--govbr-blue-warm-vivid-70)] hover:bg-blue-50 rounded transition-colors cursor-pointer"
            aria-label="Menu de Navegação"
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
          <h1 className="header-title text-lg md:text-xl font-medium text-[var(--govbr-blue-warm-vivid-90)] tracking-tight m-0 font-['Rawline',sans-serif]">
            Oportunidades de Automação
          </h1>
        </div>

        {/* Direita: Campo de Pesquisa ("O que você procura?") integrado à busca oficial Serpro */}
        <form
          action="https://www.serpro.gov.br/@@search"
          method="get"
          target="_blank"
          className="relative w-full md:w-80 m-0"
        >
          <input
            type="text"
            name="SearchableText"
            placeholder="O que você procura?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full bg-[#f8f9fa] border border-slate-300 rounded-md py-1.5 pl-3.5 pr-9 text-xs text-slate-700 italic placeholder:text-slate-400 focus:bg-white focus:border-[var(--govbr-blue-warm-vivid-70)] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="search-submit-btn absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] cursor-pointer p-1 bg-transparent border-0 shadow-none"
            aria-label="Pesquisar"
          >
            <i className="fas fa-search text-xs"></i>
          </button>
        </form>
      </div>

      {/* 4. Abas de Navegação do Sistema (Estilo br-tab oficial com suporte a Alto Contraste) */}
      <div className="header-tabs-bar border-t border-slate-200 px-4 sm:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Navegação do Sistema">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'dashboard'
                ? 'tab-active border-[var(--govbr-blue-warm-vivid-70)] text-[var(--govbr-blue-warm-vivid-70)] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <i className="fas fa-chart-pie text-xs"></i>
            <span>Dashboard Analítico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registros')}
            className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'registros'
                ? 'tab-active border-[var(--govbr-blue-warm-vivid-70)] text-[var(--govbr-blue-warm-vivid-70)] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <i className="fas fa-list-check text-xs"></i>
            <span>Levantamento de Processos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parametros')}
            className={`py-2.5 px-4 font-semibold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'parametros'
                ? 'tab-active border-[var(--govbr-blue-warm-vivid-70)] text-[var(--govbr-blue-warm-vivid-70)] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <i className="fas fa-sliders-h text-xs"></i>
            <span>Parâmetros Globais</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

