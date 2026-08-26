import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Breadcrumb Serpro ("Você está aqui: Página Inicial > ...") */}
      <div className="breadcrumb-bar bg-transparent px-4 sm:px-8 py-2 text-[11px] text-slate-500 border-b border-slate-200/60 max-w-7xl w-full mx-auto">
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
      <main id="conteudo-principal" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {children}
      </main>

      {/* Rodapé Oficial Serpro (GOV.BR DS br-footer Oficial de serpro.gov.br) */}
      <footer className="br-footer bg-[#071d41] text-white pt-12 pb-8 mt-16 border-t border-slate-800 font-['Rawline','Raleway',sans-serif]">
        <div className="container-lg max-w-7xl mx-auto px-4 sm:px-8">
          <div className="logo-rodape pb-8">
            <img src="/assets/marca-serpro-rodape.png" alt="Serpro" className="h-10 w-auto object-contain brightness-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-[14px]">
            {/* Coluna 1: SOLUÇÕES */}
            <div>
              <a className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between pb-2 border-b border-white/10" href="javascript:void(0)">
                <span className="content text-bold text-uppercase">Soluções</span>
                <span className="support"><i className="fas fa-angle-down text-xs" aria-hidden="true"></i></span>
              </a>
              <div className="space-y-3 pt-3" style={{ display: 'block' }}>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://loja.serpro.gov.br/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro" target="_blank" rel="noreferrer">
                  <span className="content">Loja Serpro</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.ventures.serpro.gov.br" target="_blank" rel="noreferrer">
                  <span className="content">Inovação aberta</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/insights" target="_blank" rel="noreferrer">
                  <span className="content">Insights e Notícias</span>
                </a>
              </div>
            </div>

            {/* Coluna 2: SUPORTE */}
            <div>
              <a className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between pb-2 border-b border-white/10" href="javascript:void(0)">
                <span className="content text-bold text-uppercase">Suporte</span>
                <span className="support"><i className="fas fa-angle-down text-xs" aria-hidden="true"></i></span>
              </a>
              <div className="space-y-3 pt-3" style={{ display: 'block' }}>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/suporte/ajuda-ao-cliente" target="_blank" rel="noreferrer">
                  <span className="content">Ajuda ao cliente</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://centraldeajuda.serpro.gov.br/duvidas/pt/atendimento/atendimento/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro" target="_blank" rel="noreferrer">
                  <span className="content">Central de Ajuda</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/suporte/css" target="_blank" rel="noreferrer">
                  <span className="content">Central de Serviços</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/suporte/escritorio-de-atendimento-ao-mercado" target="_blank" rel="noreferrer">
                  <span className="content">Consignatárias</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/suporte/central-de-servicos-transformacao-digital-da-justica" target="_blank" rel="noreferrer">
                  <span className="content">Transformação Digital da Justiça</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/suporte/downloads/downloads-e-softwares" target="_blank" rel="noreferrer">
                  <span className="content">Downloads</span>
                </a>
              </div>
            </div>

            {/* Coluna 3: INSTITUCIONAL */}
            <div>
              <a className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between pb-2 border-b border-white/10" href="javascript:void(0)">
                <span className="content text-bold text-uppercase">Institucional</span>
                <span className="support"><i className="fas fa-angle-down text-xs" aria-hidden="true"></i></span>
              </a>
              <div className="space-y-3 pt-3" style={{ display: 'block' }}>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/institucional/quem-somos" target="_blank" rel="noreferrer">
                  <span className="content">Quem Somos</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="http://www.serpro.gov.br/marca-serpro/" target="_blank" rel="noreferrer">
                  <span className="content">Marca Serpro</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/quem-somos/iniciativas-sociais" target="_blank" rel="noreferrer">
                  <span className="content">Iniciativas Sociais</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.transparencia.serpro.gov.br/" target="_blank" rel="noreferrer">
                  <span className="content">Governança</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.transparencia.serpro.gov.br/etica-e-integridade/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro" target="_blank" rel="noreferrer">
                  <span className="content">Ética e Integridade</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.transparencia.serpro.gov.br/acesso-a-informacao/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro" target="_blank" rel="noreferrer">
                  <span className="content">Acesso à Informação</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/privacidade-protecao-dados" target="_blank" rel="noreferrer">
                  <span className="content">Privacidade</span>
                </a>
              </div>
            </div>

            {/* Coluna 4: CONTATO */}
            <div>
              <a className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between pb-2 border-b border-white/10" href="javascript:void(0)">
                <span className="content text-bold text-uppercase">Contato</span>
                <span className="support"><i className="fas fa-angle-down text-xs" aria-hidden="true"></i></span>
              </a>
              <div className="space-y-3 pt-3" style={{ display: 'block' }}>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.transparencia.serpro.gov.br/acesso-a-informacao/institucional/enderecos" target="_blank" rel="noreferrer">
                  <span className="content">Endereços</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/contato/cliente/cliente/@@template_contato" target="_blank" rel="noreferrer">
                  <span className="content">Fale conosco</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://serpro.gov.br/menu/imprensa" target="_blank" rel="noreferrer">
                  <span className="content">Imprensa</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/corregedoria" target="_blank" rel="noreferrer">
                  <span className="content">Corregedoria</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.transparencia.serpro.gov.br/etica-e-integridade/ouvidoria/fale-com-a-ouvidoria" target="_blank" rel="noreferrer">
                  <span className="content">Ouvidoria</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://falabr.cgu.gov.br/web/home" target="_blank" rel="noreferrer">
                  <span className="content">Fala BR</span>
                </a>
              </div>
            </div>

            {/* Coluna 5: EMPREGADOS */}
            <div>
              <a className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between pb-2 border-b border-white/10" href="javascript:void(0)">
                <span className="content text-bold text-uppercase">Empregados</span>
                <span className="support"><i className="fas fa-angle-down text-xs" aria-hidden="true"></i></span>
              </a>
              <div className="space-y-3 pt-3" style={{ display: 'block' }}>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://intra.serpro.gov.br/login/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro" target="_blank" rel="noreferrer">
                  <span className="content">Intranet</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://passerpro.impactomedica.com.br/" target="_blank" rel="noreferrer">
                  <span className="content">PAS Serpro</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://intra.serpro.gov.br/minha-empresa/beneficios/plano-odontologico" target="_blank" rel="noreferrer">
                  <span className="content">Plano Odontológico</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.transparencia.serpro.gov.br/acesso-a-informacao/empregados/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro" target="_blank" rel="noreferrer">
                  <span className="content">Carreira</span>
                </a>
              </div>
            </div>

            {/* Coluna 6: SUSTENTABILIDADE */}
            <div>
              <a className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between pb-2 border-b border-white/10" href="javascript:void(0)">
                <span className="content text-bold text-uppercase">SUSTENTABILIDADE</span>
                <span className="support"><i className="fas fa-angle-down text-xs" aria-hidden="true"></i></span>
              </a>
              <div className="space-y-3 pt-3" style={{ display: 'block' }}>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/sustentabilidade/esg-serpro" target="_blank" rel="noreferrer">
                  <span className="content">ESG</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/sustentabilidade/jornada-ser-esg" target="_blank" rel="noreferrer">
                  <span className="content">Jornada Ser ESG</span>
                </a>
                <a className="br-item block py-1 text-white hover:underline transition-colors" href="https://www.serpro.gov.br/menu/sustentabilidade/ods" target="_blank" rel="noreferrer">
                  <span className="content">Objetivos de desenvolvimento Sustentável</span>
                </a>
              </div>
            </div>
          </div>

          {/* Redes Sociais & Selo Acesso à Informação */}
          <div className="d-block pt-10 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
              <div className="col">
                <div className="social-network space-y-3 text-center sm:text-left">
                  <div className="social-network-title font-bold text-[14px] text-white uppercase tracking-wider">Redes Sociais</div>
                  <div className="d-flex flex items-center space-x-3 text-base">
                    <a className="br-button circle w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all" href="http://facebook.com/SerproBrasil" aria-label="Visite o Serpro no Facebook" target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook-f" aria-hidden="true"></i>
                    </a>
                    <a className="br-button circle w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all" href="https://x.com/serpro" aria-label="Visite o Serpro no X" target="_blank" rel="noreferrer">
                      <i className="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a className="br-button circle w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all" href="https://www.linkedin.com/company/serpro" aria-label="Visite o Serpro no Linkedin" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                    </a>
                    <a className="br-button circle w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all" href="https://www.instagram.com/serprobrasil/" aria-label="Visite o Serpro no Instagram" target="_blank" rel="noreferrer">
                      <i className="fab fa-instagram" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col assigns text-right">
                <a className="logo-acesso-footer hover:opacity-90 transition-opacity inline-block" href="https://www.gov.br/acessoainformacao/pt-br" title="Acesse o portal sobre o acesso à informação" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 117 49" height="49" width="117" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                    <circle cx="22" cy="23" r="22" fill="#fff"></circle>
                    <path style={{ stroke: '#222', strokeWidth: 9, strokeLinecap: 'round' }} d="m 22,23 v 13"></path>
                    <path style={{ stroke: '#fff', strokeWidth: 4, strokeLinejoin: 'round' }} d="m 4,43 3,-6 4,3 z"></path>
                    <circle r="4.5" cy="11" cx="22" fill="#222"></circle>
                    <g fill="#222">
                      <text x="47" y="22">
                        <tspan x="47" y="18" fill="#fff" style={{ font: 'normal bold 11px Open Sans, sans-serif' }}>Acesso à</tspan>
                        <tspan x="47" y="31" fill="#fff" style={{ font: 'normal bold 11px Open Sans, sans-serif' }}>Informação</tspan>
                      </text>
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <span className="br-divider my-3 border-t border-white/10 block max-w-7xl mx-auto"></span>

        <div className="container-lg max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-4 pt-4">
          <div className="info flex flex-col items-center justify-center space-y-3">
            <img src="/assets/assinatura-serpro-mf.png" alt="Serpro - Ministério da Fazenda - Governo Federal" className="img-fluid py-2 h-10 md:h-12 w-auto object-contain mx-auto brightness-100" />
            <div className="text-down-01 text-medium text-[14px] text-slate-300 font-normal">
              Serpro Sede - SGAN Quadra 601 Módulo "V" Brasília - DF CEP: 70836-900 <br /> Horário de atendimento: 8h às 18h
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
