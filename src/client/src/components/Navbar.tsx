import React from 'react';
import { LayoutDashboard, FileSpreadsheet, Settings2, Sparkles, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard Analítico',
      icon: LayoutDashboard,
      description: 'KPIs, gráficos e viabilidade',
    },
    {
      id: 'registros' as const,
      label: 'Levantamento de Processos',
      icon: FileSpreadsheet,
      description: 'CRUD e matriz de benefícios',
    },
    {
      id: 'parametros' as const,
      label: 'Parâmetros Globais',
      icon: Settings2,
      description: 'Custos, infraestrutura e pesos',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Oportunidades de Automação</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-brand-100 text-brand-800 border border-brand-200">
                  <Sparkles className="w-3 h-3 mr-1 text-brand-600" /> Automação Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Análise de Viabilidade, Custos & Retorno sobre Investimento</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={tab.description}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
