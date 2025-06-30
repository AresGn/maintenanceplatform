// Sidebar du tableau de bord
import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ToolOutlined,
  CalendarOutlined,
  AlertOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Menus selon les rôles
  const getMenuItems = () => {
    const commonItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Tableau de bord',
      },
    ];

    const roleSpecificItems = {
      admin: [
        {
          key: 'equipment',
          icon: <ToolOutlined />,
          label: 'Équipements',
          children: [
            { key: 'equipment-list', label: 'Liste des équipements' },
            { key: 'equipment-add', label: 'Ajouter équipement' },
            { key: 'equipment-categories', label: 'Catégories' },
          ],
        },
        {
          key: 'maintenance',
          icon: <CalendarOutlined />,
          label: 'Maintenance',
          children: [
            { key: 'maintenance-calendar', label: 'Calendrier' },
            { key: 'maintenance-planning', label: 'Planification' },
            { key: 'maintenance-interventions', label: 'Interventions' },
            { key: 'maintenance-history', label: 'Historique' },
          ],
        },
        {
          key: 'inventory',
          icon: <ShopOutlined />,
          label: 'Inventaire',
          children: [
            { key: 'inventory-parts', label: 'Pièces détachées' },
            { key: 'inventory-stock', label: 'Gestion stock' },
            { key: 'inventory-orders', label: 'Commandes' },
          ],
        },
        {
          key: 'team',
          icon: <TeamOutlined />,
          label: 'Équipe',
          children: [
            { key: 'team-members', label: 'Membres' },
            { key: 'team-roles', label: 'Rôles' },
            { key: 'team-performance', label: 'Performance' },
          ],
        },
        {
          key: 'reports',
          icon: <BarChartOutlined />,
          label: 'Rapports',
          children: [
            { key: 'reports-kpi', label: 'Indicateurs KPI' },
            { key: 'reports-maintenance', label: 'Maintenance' },
            { key: 'reports-costs', label: 'Coûts' },
          ],
        },
        {
          key: 'alerts',
          icon: <AlertOutlined />,
          label: 'Alertes',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Configuration',
          children: [
            { key: 'settings-general', label: 'Général' },
            { key: 'settings-notifications', label: 'Notifications' },
            { key: 'settings-backup', label: 'Sauvegarde' },
          ],
        },
      ],
      supervisor: [
        {
          key: 'equipment',
          icon: <ToolOutlined />,
          label: 'Équipements',
          children: [
            { key: 'equipment-list', label: 'Liste des équipements' },
            { key: 'equipment-status', label: 'État des équipements' },
          ],
        },
        {
          key: 'maintenance',
          icon: <CalendarOutlined />,
          label: 'Maintenance',
          children: [
            { key: 'maintenance-calendar', label: 'Calendrier' },
            { key: 'maintenance-planning', label: 'Planification' },
            { key: 'maintenance-interventions', label: 'Interventions' },
            { key: 'maintenance-validate', label: 'Validation' },
          ],
        },
        {
          key: 'team',
          icon: <TeamOutlined />,
          label: 'Mon équipe',
          children: [
            { key: 'team-technicians', label: 'Techniciens' },
            { key: 'team-assignments', label: 'Affectations' },
            { key: 'team-performance', label: 'Performance' },
          ],
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Rapports',
          children: [
            { key: 'reports-team', label: 'Équipe' },
            { key: 'reports-maintenance', label: 'Maintenance' },
          ],
        },
        {
          key: 'alerts',
          icon: <AlertOutlined />,
          label: 'Alertes',
        },
      ],
      technician: [
        {
          key: 'tasks',
          icon: <CalendarOutlined />,
          label: 'Mes tâches',
          children: [
            { key: 'tasks-today', label: 'Aujourd\'hui' },
            { key: 'tasks-week', label: 'Cette semaine' },
            { key: 'tasks-history', label: 'Historique' },
          ],
        },
        {
          key: 'equipment',
          icon: <ToolOutlined />,
          label: 'Mes équipements',
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Mes rapports',
        },
        {
          key: 'alerts',
          icon: <AlertOutlined />,
          label: 'Notifications',
        },
      ],
    };

    return [
      ...commonItems,
      ...(roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []),
    ];
  };

  const handleMenuClick = (e: { key: string }) => {
    const routeMap: { [key: string]: string } = {
      'dashboard': `/dashboard/${user?.role}`,
      'equipment-list': '/equipments',
      'equipment-add': '/equipments/new',
      'equipment-categories': '/equipments/categories', // TODO: À implémenter
      'maintenance-calendar': '/maintenance/calendar',
      'maintenance-planning': '/maintenance/planning',
      'maintenance-interventions': '/maintenance/interventions',
      'maintenance-history': '/maintenance/history', // TODO: À implémenter
      'maintenance-validate': '/maintenance/validate', // TODO: À implémenter
    };

    const route = routeMap[e.key];
    if (route) {
      navigate(route);
    }
  };

  // Déterminer la clé sélectionnée basée sur l'URL actuelle
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/equipments/new') {
      return ['equipment-add'];
    }
    if (path.startsWith('/equipments')) {
      return ['equipment-list'];
    }
    if (path === '/maintenance/calendar') {
      return ['maintenance-calendar'];
    }
    if (path === '/maintenance/planning') {
      return ['maintenance-planning'];
    }
    if (path.startsWith('/maintenance/interventions')) {
      return ['maintenance-interventions'];
    }
    if (path.startsWith('/maintenance')) {
      return ['maintenance-calendar'];
    }
    if (path.includes('/dashboard')) {
      return ['dashboard'];
    }
    return ['dashboard'];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: 'white',
        borderRight: '1px solid #f0f0f0',
        position: isMobile ? 'fixed' : 'relative',
        height: isMobile ? '100vh' : 'auto',
        zIndex: isMobile ? 1000 : 'auto',
      }}
      width={isMobile ? 200 : 250}
      collapsedWidth={isMobile ? 0 : 80}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken && !collapsed) {
          onCollapse(true);
        }
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        onClick={handleMenuClick}
        style={{
          height: 'calc(100% - 96px)',
          borderRight: 0,
          paddingTop: '8px'
        }}
        items={getMenuItems()}
      />
    </Sider>
  );
};
