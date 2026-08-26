import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { RegistrosPage } from './pages/RegistrosPage';
import { ParametrosPage } from './pages/ParametrosPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registros' | 'parametros'>('dashboard');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'registros' && <RegistrosPage />}
      {activeTab === 'parametros' && <ParametrosPage />}
    </Layout>
  );
};
