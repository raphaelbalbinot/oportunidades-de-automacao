import React, { useState, useEffect } from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
  onToggleMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onToggleMenu }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
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

          {/* Linha Inferior: Menu Hambúrguer Oficial GovBR + Título do Sistema */}
          <div className="header-bottom px-4 sm:px-8 py-2.5 flex items-center justify-between">
            <div className="header-menu flex items-center space-x-3">
              <div className="header-menu-trigger" id="header-navigation">
                <button
                  className="br-button circle btn-menu-trigger p-2 w-10 h-10 rounded-md text-[var(--govbr-blue-warm-vivid-70)] hover:bg-blue-50 flex items-center justify-center transition-colors cursor-pointer bg-transparent border-0 shadow-none focus:ring-2 focus:ring-[var(--govbr-blue-warm-vivid-70)]"
                  type="button"
                  aria-label="Alternar Menu de Navegação"
                  id="navigation"
                  onClick={onToggleMenu}
                  title="Alternar Menu de Navegação"
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
          </div>
        </div>
      </header>
  );
};

