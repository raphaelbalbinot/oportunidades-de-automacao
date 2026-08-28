import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { RegistrosPage } from './pages/RegistrosPage';
import { ParametrosPage } from './pages/ParametrosPage';
import { DossiePrintPage } from './pages/DossiePrintPage';
import { NotificationProvider } from './components/Notification';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registros' | 'parametros'>('dashboard');

  // Verifica se a URL solicita a visualização isolada e limpa de impressão do Dossiê
  const searchParams = new URLSearchParams(window.location.search);
  const printDossieId = searchParams.get('dossieId') || searchParams.get('printDossieId');
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const isDossiePath = pathParts[0] === 'dossie' && pathParts[1];
  const targetDossieId = printDossieId || (isDossiePath ? pathParts[1] : null);

  if (targetDossieId) {
    return (
      <NotificationProvider>
        <DossiePrintPage registroId={targetDossieId} />
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'registros' && <RegistrosPage />}
        {activeTab === 'parametros' && <ParametrosPage />}
      </Layout>
    </NotificationProvider>
  );
};
