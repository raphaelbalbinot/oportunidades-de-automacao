import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { SidebarMenu } from './SidebarMenu';

interface LayoutProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarExpanded((prev) => !prev);
    } else {
      setIsMobileMenuOpen((prev) => !prev);
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Analítico & Viabilidade';
      case 'registros':
        return 'Levantamento de Oportunidades';
      case 'parametros':
        return 'Parâmetros Globais de Custeio';
      default:
        return 'Página Inicial';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-['Rawline',sans-serif]">
      {/* Cabeçalho Oficial Serpro */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onToggleMenu={toggleMenu} />

      {/* Corpo Central: Sidebar Lateral (Desktop Fixa / Mobile Drawer) + Conteúdo */}
      <div className="flex flex-1 w-full">
        <SidebarMenu
          isExpanded={isSidebarExpanded}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb Serpro ("Você está aqui: Página Inicial > ...") */}
          <div className="breadcrumb-bar bg-transparent px-4 sm:px-8 py-2.5 text-[11px] text-slate-500 border-b border-slate-200/60 w-full">
            <span className="font-normal text-slate-500">Você está aqui: </span>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-[var(--govbr-blue-warm-vivid-70)] hover:underline cursor-pointer font-medium p-0 border-none bg-transparent"
            >
              Página Inicial
            </button>
            <span className="mx-1.5 text-slate-400">/</span>
            <span className="breadcrumb-current text-slate-700 font-semibold">{getBreadcrumbTitle()}</span>
          </div>

          {/* Conteúdo Principal */}
          <main id="conteudo-principal" className="flex-1 w-full px-4 sm:px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
