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
    <header className="w-full bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40 font-['Rawline',sans-serif]" id="header-capa">
      {/* 1. Barra de Acessibilidade Superior Oficial (serpro.gov.br) */}
      <div className="accessibility-bar bg-white border-b border-slate-200 px-4 sm:px-8 py-1 text-[11px] text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a
            href="#conteudo-principal"
            className="hover:text-[var(--govbr-blue-warm-vivid-70)] flex items-center space-x-1.5 font-medium transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-[var(--govbr-blue-warm-vivid-70)] text-white flex items-center justify-center text-[10px]">
              <i className="fas fa-universal-access"></i>
            </span>
            <span>Acessibilidade</span>
          </a>

          <button
            type="button"
            onClick={toggleContrast}
            className={`hover:text-[var(--govbr-blue-warm-vivid-70)] flex items-center space-x-1.5 font-medium transition-colors px-2 py-0.5 rounded cursor-pointer ${
              darkMode ? 'bg-[#0c326f] text-white font-bold border border-blue-400' : 'border border-transparent'
            }`}
            title="Alternar modo de Alto Contraste (WCAG AAA)"
          >
            <i className="fas fa-adjust text-xs"></i>
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
      </div>

      {/* 2. Cabeçalho Oficial GOV.BR DS Serpro (.br-header) */}
      <div className="br-header flex flex-column justify-content-end w-full">
        {/* Linha Superior: Logo + Divisor + Links Institucionais + Área do Cliente */}
        <div className="header-top px-4 sm:px-8 py-3 flex items-center justify-between border-b border-slate-100">
          <div className="header-logo flex items-center">
            <a
              className="logo flex items-center cursor-pointer"
              aria-label="marca do serpro"
              href="https://www.serpro.gov.br/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={darkMode ? '/assets/marca-serpro-rodape.png' : '/assets/marca-serpro.png'}
                alt="Serpro"
                className="h-9 w-auto object-contain"
              />
            </a>
            <span className="br-divider vertical h-7 w-px bg-slate-300 mx-4 hidden sm:block"></span>
          </div>

          <div className="header-actions flex items-center space-x-4 lg:space-x-6 text-[14px] font-normal font-['Rawline','Raleway',sans-serif]">
            <div className="header-links hidden xl:flex items-center space-x-6">
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

            <span className="br-divider vertical h-6 w-px bg-slate-300 mx-2 hidden sm:block"></span>

            <div className="header-login hidden sm:block">
              <div className="header-sign-in">
                <a
                  href="http://cliente.serpro.gov.br/"
                  target="_blank"
                  rel="noreferrer"
                  className="br-sign-in small btn-area-cliente flex items-center space-x-2 px-4 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:text-[var(--govbr-blue-warm-vivid-70)] hover:border-[var(--govbr-blue-warm-vivid-70)] bg-white hover:bg-slate-50 transition-all font-normal text-[13px] cursor-pointer"
                >
                  <i className="far fa-user text-xs"></i>
                  <span>Área do cliente</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior: Menu Hambúrguer + Título do Sistema + Campo de Busca Oficial */}
        <div className="header-bottom px-4 sm:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="header-menu flex items-center space-x-3">
            <div className="header-menu-trigger" id="header-navigation">
              <button
                className="br-button small circle btn-menu-trigger p-2 text-[var(--govbr-blue-warm-vivid-70)] hover:bg-blue-50 rounded transition-colors cursor-pointer bg-transparent border-0 shadow-none"
                type="button"
                aria-label="Menu"
                id="navigation"
              >
                <i className="fas fa-bars text-lg"></i>
              </button>
            </div>
            <div className="header-info">
              <div className="header-title text-lg md:text-xl font-medium text-[var(--govbr-blue-warm-vivid-90)] tracking-tight m-0 font-['Rawline',sans-serif]">
                Oportunidades de Automação
              </div>
            </div>
          </div>

          <form
            id="main-searchbox"
            className="search-form-container relative w-full md:w-80 m-0 bg-transparent border-0"
            action="https://www.serpro.gov.br/@@search"
            method="get"
            target="_blank"
          >
            <div className="relative w-full flex items-center">
              <input
                name="SearchableText"
                id="searchbox"
                type="text"
                placeholder="O que você procura?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full bg-white border border-slate-300 rounded-md py-2 pl-3.5 pr-10 text-xs text-slate-700 italic placeholder:text-slate-400 focus:bg-white focus:border-[var(--govbr-blue-warm-vivid-70)] focus:outline-none transition-colors"
              />
              <button
                className="search-submit-btn absolute right-2 top-1/2 -translate-y-1/2 text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] cursor-pointer p-1.5 bg-transparent border-0 shadow-none flex items-center justify-center"
                type="submit"
                aria-label="Pesquisar"
              >
                <i className="fas fa-search text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Abas de Navegação do Sistema (Estilo br-tab oficial com suporte a Alto Contraste) */}
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

