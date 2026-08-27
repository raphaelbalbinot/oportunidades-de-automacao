import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  activeTab: 'dashboard' | 'registros' | 'parametros';
  setActiveTab: (tab: 'dashboard' | 'registros' | 'parametros') => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [openColumn, setOpenColumn] = React.useState<string | null>(null);

  const toggleColumn = (columnId: string) => {
    setOpenColumn(prev => (prev === columnId ? null : columnId));
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

  const footerSections = [
    {
      id: 'solucoes',
      title: 'Soluções',
      links: [
        { label: 'Loja Serpro', href: 'https://loja.serpro.gov.br/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro' },
        { label: 'Inovação aberta', href: 'https://www.ventures.serpro.gov.br' },
        { label: 'Insights e Notícias', href: 'https://www.serpro.gov.br/insights' },
      ],
    },
    {
      id: 'suporte',
      title: 'Suporte',
      links: [
        { label: 'Ajuda ao cliente', href: 'https://www.serpro.gov.br/menu/suporte/ajuda-ao-cliente' },
        { label: 'Central de Ajuda', href: 'https://centraldeajuda.serpro.gov.br/duvidas/pt/atendimento/atendimento/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro' },
        { label: 'Central de Serviços', href: 'https://www.serpro.gov.br/menu/suporte/css' },
        { label: 'Consignatárias', href: 'https://www.serpro.gov.br/menu/suporte/escritorio-de-atendimento-ao-mercado' },
        { label: 'Transformação Digital da Justiça', href: 'https://www.serpro.gov.br/menu/suporte/central-de-servicos-transformacao-digital-da-justica' },
        { label: 'Downloads', href: 'https://www.serpro.gov.br/menu/suporte/downloads/downloads-e-softwares' },
      ],
    },
    {
      id: 'institucional',
      title: 'Institucional',
      links: [
        { label: 'Quem Somos', href: 'https://www.serpro.gov.br/menu/institucional/quem-somos' },
        { label: 'Marca Serpro', href: 'http://www.serpro.gov.br/marca-serpro/' },
        { label: 'Iniciativas Sociais', href: 'https://www.serpro.gov.br/menu/quem-somos/iniciativas-sociais' },
        { label: 'Governança', href: 'https://www.transparencia.serpro.gov.br/' },
        { label: 'Ética e Integridade', href: 'https://www.transparencia.serpro.gov.br/etica-e-integridade/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro' },
        { label: 'Acesso à Informação', href: 'https://www.transparencia.serpro.gov.br/acesso-a-informacao/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro' },
        { label: 'Privacidade', href: 'https://www.serpro.gov.br/privacidade-protecao-dados' },
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      links: [
        { label: 'Endereços', href: 'https://www.transparencia.serpro.gov.br/acesso-a-informacao/institucional/enderecos' },
        { label: 'Fale conosco', href: 'https://www.serpro.gov.br/menu/contato/cliente/cliente/@@template_contato' },
        { label: 'Imprensa', href: 'https://serpro.gov.br/menu/imprensa' },
        { label: 'Corregedoria', href: 'https://www.serpro.gov.br/corregedoria' },
        { label: 'Ouvidoria', href: 'https://www.transparencia.serpro.gov.br/etica-e-integridade/ouvidoria/fale-com-a-ouvidoria' },
        { label: 'Fala BR', href: 'https://falabr.cgu.gov.br/web/home' },
      ],
    },
    {
      id: 'empregados',
      title: 'Empregados',
      links: [
        { label: 'Intranet', href: 'https://intra.serpro.gov.br/login/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro' },
        { label: 'PAS Serpro', href: 'https://passerpro.impactomedica.com.br/' },
        { label: 'Plano Odontológico', href: 'https://intra.serpro.gov.br/minha-empresa/beneficios/plano-odontologico' },
        { label: 'Carreira', href: 'https://www.transparencia.serpro.gov.br/acesso-a-informacao/empregados/?utm_source=portal&utm_medium=rodape&utm_campaign=home-serpro' },
      ],
    },
    {
      id: 'sustentabilidade',
      title: 'SUSTENTABILIDADE',
      links: [
        { label: 'ESG', href: 'https://www.serpro.gov.br/menu/sustentabilidade/esg-serpro' },
        { label: 'Jornada Ser ESG', href: 'https://www.serpro.gov.br/menu/sustentabilidade/jornada-ser-esg' },
        { label: 'Objetivos de desenvolvimento Sustentável', href: 'https://www.serpro.gov.br/menu/sustentabilidade/ods' },
      ],
    },
  ];

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

      {/* Rodapé Oficial Serpro (GOV.BR DS br-footer) */}
      <footer className="br-footer bg-[#071d41] text-white pt-12 pb-8 mt-16 border-t border-slate-800 font-['Rawline','Raleway',sans-serif]">
        <div className="container-lg max-w-7xl mx-auto px-4 sm:px-8">
          <div className="logo-rodape pb-8">
            <img src="/assets/marca-serpro-rodape.png" alt="Serpro" className="h-12 max-h-[48px] max-w-[180px] w-auto object-contain brightness-100" />
          </div>

          {/* Grid de Seções com suporte a Sanfona no Mobile */}
          <div className="br-list horizontal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-[14px]">
            {footerSections.map((section) => {
              const isOpen = openColumn === section.id;
              return (
                <div key={section.id} className="col-2">
                  <button
                    type="button"
                    onClick={() => toggleColumn(section.id)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'expandido' : 'recolhido'}
                    className="br-item header font-bold text-white uppercase text-[14px] flex items-center justify-between w-full pb-2 border-b border-white/10 text-left cursor-pointer bg-transparent border-none sm:cursor-default"
                  >
                    <div className="content text-down-01 text-bold text-uppercase">{section.title}</div>
                    <div className="support sm:hidden">
                      <i className={`fas ${isOpen ? 'fa-angle-up' : 'fa-angle-down'} text-xs transition-transform`} aria-hidden="true"></i>
                    </div>
                  </button>
                  <div
                    className={`br-list space-y-3 pt-3 ${isOpen ? 'block' : 'hidden sm:block'}`}
                  >
                    <span className="br-divider d-md-none"></span>
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        className="br-item block py-1 text-white hover:underline transition-colors text-[13px] leading-tight"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="content">{link.label}</div>
                      </a>
                    ))}
                    <span className="br-divider d-md-none"></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redes Sociais & Selo Acesso à Informação */}
          <div className="d-none d-sm-block pt-10 border-t border-white/10">
            <div className="row flex items-end justify-between py-5">
              <div className="col">
                <div className="social-network space-y-3 text-left">
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

        <div className="container-lg max-w-7xl mx-auto px-4 sm:px-8 text-center pt-2">
          <div className="info flex flex-col items-center justify-center">
            <img
              src="/assets/assinatura-serpro-mf.png"
              alt="Serpro - Ministério da Fazenda - Governo Federal"
              className="img-fluid py-6 w-full max-w-[387px] h-auto object-contain mx-auto block"
            />
            <div className="text-down-01 text-medium text-[13px] text-slate-300 font-normal pb-4 mt-1">
              Serpro Sede - SGAN Quadra 601 Módulo &quot;V&quot; Brasília - DF CEP: 70836-900 <br /> Horário de atendimento: 8h às 18h
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
