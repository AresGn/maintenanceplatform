// Layout principal du tableau de bord
import React, { useState } from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille d'écran pour mobile
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header title={title} subtitle={subtitle} />
        <Content
          style={{
            margin: isMobile ? '12px' : '20px',
            padding: isMobile ? '12px' : '20px',
            background: '#f5f7fa',
            flex: 1,
            overflow: 'auto',
            minHeight: 0,
            borderRadius: '12px 12px 0 0'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
