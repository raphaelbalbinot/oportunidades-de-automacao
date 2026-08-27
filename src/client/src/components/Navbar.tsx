import React, { useState, useEffect } from 'react';
import { SidebarMenu } from './SidebarMenu';

interface NavbarProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontScale, setFontScale] = useState<number>(100);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

  const quickLinks = [
    { label: 'Empresa', href: 'https://www.serpro.gov.br/menu/quem-somos' },
    { label: 'Insights', href: 'https://www.serpro.gov.br/insights' },
    { label: 'Privacidade', href: 'https://www.serpro.gov.br/privacidade-protecao-dados' },
    { label: 'Suporte', href: 'https://www.serpro.gov.br/menu/suporte/css' },
    { label: 'Download e Software', href: 'https://www.serpro.gov.br/menu/suporte/downloads/downloads-e-softwares' },
    { label: 'Imprensa', href: 'https://www.serpro.gov.br/imprensa' },
    { label: 'Contato', href: 'https://www.serpro.gov.br/menu/contato/cliente/cliente/@@template_contato' },
    { label: 'Acesso à informação', href: 'https://www.transparencia.serpro.gov.br/acesso-a-informacao', external: true },
    { label: 'Loja Serpro', href: 'https://loja.serpro.gov.br/?utm_source=portal&utm_medium=menu&utm_campaign=home-serpro', external: true },
  ];

  return (
    <>
      {/* Menu Lateral GovBR DS (Drawer Acionado pelo Botão Hambúrguer) */}
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />

      <header className="w-full bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40 font-['Rawline',sans-serif]" id="header-capa">
        {/* 1. Barra de Acessibilidade Superior Oficial (serpro.gov.br) */}
        <div className="accessibility-bar bg-white border-b border-slate-200 px-4 sm:px-8 py-1 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="#conteudo-principal"
              className="hover:text-[var(--govbr-blue-warm-vivid-70)] flex items-center space-x-1.5 font-medium transition-colors focus:ring-2 focus:ring-[var(--govbr-blue-warm-vivid-70)] rounded px-1"
            >
              <span className="w-4 h-4 rounded-full bg-[var(--govbr-blue-warm-vivid-70)] text-white flex items-center justify-center text-[10px]">
                <i className="fas fa-universal-access"></i>
              </span>
              <span>Acessibilidade</span>
            </a>

            <button
              type="button"
              onClick={toggleContrast}
              className={`hover:text-[var(--govbr-blue-warm-vivid-70)] flex items-center space-x-1.5 font-medium transition-colors px-2 py-0.5 rounded cursor-pointer focus:ring-2 focus:ring-[var(--govbr-blue-warm-vivid-70)] ${
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
                className="btn-font-scale px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-bold cursor-pointer text-slate-700 hover:text-[var(--govbr-blue-warm-vivid-70)] text-[10px] focus:ring-1 focus:ring-[var(--govbr-blue-warm-vivid-70)]"
                title="Diminuir fonte (A-)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontChange(5)}
                className="btn-font-scale px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-bold cursor-pointer text-slate-700 hover:text-[var(--govbr-blue-warm-vivid-70)] text-[10px] focus:ring-1 focus:ring-[var(--govbr-blue-warm-vivid-70)]"
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

            <div className="header-actions flex items-center space-x-3 sm:space-x-4 lg:space-x-6 text-[14px] font-normal font-['Rawline','Raleway',sans-serif]">
              {/* Links Diretos em Telas Grandes */}
              <div className="header-links hidden xl:flex items-center space-x-6">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--govbr-blue-warm-vivid-70)] hover:text-[var(--govbr-blue-warm-vivid-90)] hover:underline transition-colors flex items-center space-x-1"
                  >
                    <span>{link.label}</span>
                    {link.external && <i className="fas fa-external-link-alt text-[10px] ml-0.5"></i>}
                  </a>
                ))}
              </div>

              {/* Menu Dropdown de Acesso Rápido em Telas Menores (Padrão GovBR 3 Pontinhos) */}
              <div className="relative xl:hidden">
                <button
                  type="button"
                  onClick={() => setIsQuickAccessOpen((prev) => !prev)}
                  className="br-button circle small w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 text-[var(--govbr-blue-warm-vivid-70)] flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Abrir Acesso Rápido"
                  aria-expanded={isQuickAccessOpen}
                  title="Acesso Rápido"
                >
                  <i className="fas fa-ellipsis-v text-xs"></i>
                </button>

                {isQuickAccessOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsQuickAccessOpen(false)}
                    />
                    <div className="br-list absolute right-0 top-10 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 text-xs">
                      <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 text-[10px]">
                        Acesso Rápido
                      </div>
                      {quickLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setIsQuickAccessOpen(false)}
                          className="block px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-[var(--govbr-blue-warm-vivid-70)] transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
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

          {/* Linha Inferior: Menu Hambúrguer Oficial GovBR + Título do Sistema + Campo de Busca */}
          <div className="header-bottom px-4 sm:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="header-menu flex items-center space-x-3">
              <div className="header-menu-trigger" id="header-navigation">
                <button
                  className="br-button circle btn-menu-trigger p-2 w-10 h-10 rounded-md text-[var(--govbr-blue-warm-vivid-70)] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer bg-transparent border-0 shadow-none focus:ring-2 focus:ring-[var(--govbr-blue-warm-vivid-70)]"
                  type="button"
                  aria-label="Abrir Menu de Navegação"
                  aria-expanded={isMenuOpen}
                  id="navigation"
                  onClick={() => setIsMenuOpen(true)}
                  title="Abrir Menu de Navegação"
                >
                  <i className="fas fa-bars text-lg" aria-hidden="true"></i>
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
      </header>
    </>
  );
};

