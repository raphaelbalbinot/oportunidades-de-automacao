import React, { useEffect } from 'react';

interface SidebarMenuProps {
  isExpanded: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
  darkMode?: boolean;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isExpanded,
  isMobileOpen,
  onCloseMobile,
  activeTab,
  setActiveTab,
  darkMode = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, onCloseMobile]);

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard Analítico',
      description: 'Indicadores, ROI, Payback e Viabilidade',
      icon: 'fa-chart-pie',
      badge: 'Principal',
    },
    {
      id: 'registros' as const,
      label: 'Levantamento de Processos',
      description: 'Gestão, cadastro e pontuação de oportunidades',
      icon: 'fa-list-check',
    },
    {
      id: 'parametros' as const,
      label: 'Parâmetros Globais',
      description: 'Custeio, taxas horárias e pesos corporativos',
      icon: 'fa-sliders-h',
    },
  ];

  const institutionalLinks = [
    { label: 'Loja Serpro', href: 'https://loja.serpro.gov.br/?utm_source=portal&utm_medium=menu&utm_campaign=home-serpro', icon: 'fa-shopping-cart' },
    { label: 'Acesso à Informação', href: 'https://www.transparencia.serpro.gov.br/acesso-a-informacao', icon: 'fa-info-circle' },
    { label: 'Central de Serviços (CSS)', href: 'https://www.serpro.gov.br/menu/suporte/css', icon: 'fa-headset' },
  ];

  const renderNavItems = (isCompact: boolean, isMobile: boolean) => (
    <nav className={`menu-body flex-1 overflow-y-auto ${isCompact ? 'px-2 py-4 space-y-3' : 'px-4 py-5 space-y-2'}`} aria-label="Telas do Sistema">
      {!isCompact && (
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Módulos Principais
        </div>
      )}

      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            title={isCompact ? item.label : undefined}
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) onCloseMobile();
            }}
            className={`menu-item w-full text-left rounded-lg flex items-center transition-all cursor-pointer border ${
              isCompact
                ? 'p-2.5 justify-center'
                : 'p-3 space-x-3.5'
            } ${
              isActive
                ? 'bg-blue-50/90 border-[var(--govbr-blue-warm-vivid-70)] text-[var(--govbr-blue-warm-vivid-70)] shadow-xs font-bold'
                : 'bg-transparent border-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
            } focus:ring-2 focus:ring-[var(--govbr-blue-warm-vivid-70)]`}
          >
            <div
              className={`rounded-lg flex items-center justify-center flex-shrink-0 text-base ${
                isCompact ? 'w-9 h-9' : 'w-8 h-8'
              } ${
                isActive
                  ? 'bg-[var(--govbr-blue-warm-vivid-70)] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <i className={`fas ${item.icon}`} aria-hidden="true"></i>
            </div>

            {!isCompact && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm tracking-tight truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-normal text-slate-500 mt-0.5 truncate">
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <i className="fas fa-chevron-right text-xs text-[var(--govbr-blue-warm-vivid-70)] flex-shrink-0"></i>
                )}
              </>
            )}
          </button>
        );
      })}

      {!isCompact && (
        <>
          <div className="pt-5 px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-200/80 mt-4">
            Acesso Rápido & Suporte
          </div>

          {institutionalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="menu-item block p-2.5 rounded-lg text-xs text-slate-600 hover:bg-slate-50 hover:text-[var(--govbr-blue-warm-vivid-70)] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <i className={`fas ${link.icon} text-slate-400 text-sm`} aria-hidden="true"></i>
                <span>{link.label}</span>
              </div>
              <i className="fas fa-external-link-alt text-[10px] text-slate-400"></i>
            </a>
          ))}
        </>
      )}
    </nav>
  );

  return (
    <>
      {/* 1. Versão Desktop: Sidebar Fixa / Persistente na Lateral Esquerda */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out border-r z-30 ${
          isExpanded ? 'w-64' : 'w-20'
        } ${
          darkMode
            ? 'bg-[#0f1d38] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        style={{ minHeight: 'calc(100vh - 120px)' }}
        aria-label="Menu Lateral Principal"
      >
        {renderNavItems(!isExpanded, false)}

        {/* Rodapé Desktop */}
        <div className={`menu-footer border-t border-slate-200 bg-slate-50/70 ${isExpanded ? 'p-4' : 'p-2 text-center'}`}>
          {isExpanded ? (
            <div>
              <div className="font-semibold text-xs text-slate-700 leading-snug">Serpro Oportunidade de Automação</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Versão 1.0 • GovBR DS</div>
            </div>
          ) : (
            <div className="text-[10px] font-bold text-slate-400 uppercase">v1.0</div>
          )}
        </div>
      </aside>

      {/* 2. Versão Mobile / Tablet: Drawer Retrátil com Scrim */}
      {isMobileOpen && (
        <div
          className="br-menu-wrapper fixed inset-0 z-50 overflow-hidden lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação Principal Mobile"
        >
          {/* Backdrop / Scrim */}
          <div
            className="menu-scrim fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Painel Drawer Mobile */}
          <div
            className={`relative z-10 w-full max-w-xs sm:max-w-sm h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out animate-in slide-in-from-left ${
              darkMode ? 'bg-[#0f1d38] text-white border-r border-slate-700' : 'bg-white text-slate-800 border-r border-slate-200'
            }`}
          >
            {/* Header Mobile Drawer */}
            <div className="menu-header px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2.5">
                <img
                  src={darkMode ? '/assets/marca-serpro-rodape.png' : '/assets/marca-serpro.png'}
                  alt="Serpro"
                  className="h-7 w-auto object-contain"
                />
                <div className="border-l border-slate-300 pl-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--govbr-blue-warm-vivid-70)] leading-none">
                    Sistema
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5 tracking-tight font-['Rawline',sans-serif]">
                    Oportunidades de Automação
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="br-button circle small w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-200/60 text-slate-600 flex items-center justify-center cursor-pointer transition-colors focus:ring-2 focus:ring-[var(--govbr-blue-warm-vivid-70)]"
                aria-label="Fechar o menu"
              >
                <i className="fas fa-times text-sm" aria-hidden="true"></i>
              </button>
            </div>

            {/* Itens Mobile */}
            {renderNavItems(false, true)}

            {/* Rodapé Mobile */}
            <div className="menu-footer p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
              <div>
                <div className="font-semibold text-slate-700">Serpro Oportunidade de Automação</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Versão 1.0 • Padrão GovBR DS</div>
              </div>
              <a
                href="https://www.serpro.gov.br"
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-[var(--govbr-blue-warm-vivid-70)] font-medium text-[11px]"
              >
                serpro.gov.br
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
